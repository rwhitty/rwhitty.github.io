import { possible_words_list } from "./wordLists.js";

// Initialize useful constants

var gameMode = "inputGuess";
var possible_words = possible_words_list;
var num_guesses = 0;
var length_curr_guess = 0;
var curr_guess = "";
var buttons = [
    document.getElementById("tile-1-1"),
    document.getElementById("tile-1-2"),
    document.getElementById("tile-1-3"),
    document.getElementById("tile-1-4"),
    document.getElementById("tile-1-5")
];



// Initialize page elements

var user_guess_text = document.getElementById("user-guess");
var bot_guess_button = document.getElementById("bot-guess-button");
var bot_guess_text = document.getElementById("current-bot-guess");
var user_submit_button = document.getElementById("user-guess-button");
var user_instructions_text = document.getElementById("user-instructions");



// Utility functions

function addButtons() {
    buttons = [
    document.getElementById("tile-" + (num_guesses + 1).toString() + "-1"),
    document.getElementById("tile-" + (num_guesses + 1).toString() + "-2"),
    document.getElementById("tile-" + (num_guesses + 1).toString() + "-3"),
    document.getElementById("tile-" + (num_guesses + 1).toString() + "-4"),
    document.getElementById("tile-" + (num_guesses + 1).toString() + "-5")
    ];
}



// Event listeners

function add_button_listeners() {
    for (var i = 0; i < 5; i++) {
        buttons[i].addEventListener("click", function() {
            if (gameMode == "reviewGuess") {
                if (this.style.backgroundColor.toString() == "rgb(90, 90, 90)") {
                    this.style.backgroundColor = "#ffc425";
                } else if (this.style.backgroundColor.toString() == "rgb(255, 196, 37)") {
                    this.style.backgroundColor = "#019a01";
                } else if (this.style.backgroundColor == "rgb(1, 154, 1)") {
                    this.style.backgroundColor = "#5A5A5A";
                }
            }
        })
    }
}

add_button_listeners();

bot_guess_button.addEventListener("click", function() {
    bot_guess_text.textContent = make_guess();
    user_guess_text.focus();
});

user_guess_text.addEventListener("input", function() {
    var invalidChars = "`~1!2@3#4$5%6^7&8*9(0)-_=+[{]}|;:'\"\\,<.>/?";
    for (var i = 0; i < invalidChars.length; i++) {
        if (user_guess_text.value.includes(invalidChars[i])) {
            user_guess_text.value = user_guess_text.value.replace(invalidChars[i], "");
        }
    }
    if (user_guess_text.value.length > 5) {
        user_guess_text.value = user_guess_text.value.slice(0, 5);
    }
    for (var i = 0; i < 5; i++) {
        if (i < user_guess_text.value.length) {
            buttons[i].textContent = user_guess_text.value[i].toUpperCase();
        } else {
            buttons[i].textContent = "";
        }
    }
    length_curr_guess = user_guess_text.value.length;
});

user_submit_button.addEventListener("click", function() {
    if (user_guess_text.value.length == 5 && possible_words.includes(user_guess_text.value) && gameMode == "inputGuess") {
        gameMode = "reviewGuess";
        curr_guess = user_guess_text.value;
        this.textContent = "Submit Pattern";
        user_instructions_text.textContent = "You guessed " + curr_guess + "! Now click the letters to describe the pattern";
        for (var i = 0; i < 5; i++) {
            buttons[i].style.backgroundColor = "#5A5A5A";
            buttons[i].style.color = "white";
        }
    } else if (gameMode == "inputGuess") {
        user_instructions_text.textContent = "You submitted an invalid word!"
        user_guess_text.focus();
    } else if (gameMode == "reviewGuess") {
        var submitted_pattern = pattern_from_buttons();
        updatePossibilities(curr_guess, submitted_pattern);
        gameMode = "inputGuess";
    }
});

window.addEventListener("keypress", function() {
    user_guess_text.focus();
});



// Real info theory solver functionality

function pattern_from_buttons() {
    var return_pattern = [0, 0, 0, 0, 0];
    for (var i = 0; i < 5; i++) {
        if (buttons[i].style.backgroundColor.toString() == "rgb(255, 196, 37)") {
            return_pattern[i] = 1;
        } else if (buttons[i].style.backgroundColor.toString() == "rgb(1, 154, 1)") {
            return_pattern[i] = 2;
        }
    }
    return return_pattern;
}

function computePattern(guess, answer) {
    var pattern = [0, 0, 0, 0, 0];
    var taken = [false, false, false, false, false];
    for (var i = 0; i < 5; i++) {
        if (guess[i] == answer[i]) {
            pattern[i] = 2;
            taken[i] = true;
        }
    }
    for (var i = 0; i < 5; i++) {
        if (pattern[i] != 2) {
            var query = guess[i];
            for (var j = 0; j < 5; j++) {
                if (query == answer[j] && taken[j] == false) {
                    pattern[i] = 1;
                    taken[j] = true;
                    j = 5;
                }
            }
        }
    }
    return pattern;
}

function divideByPattern(guess) {
    var pattern_to_subgroup = {};
    for (var i = 0; i < possible_words.length; i++) {
        var curr_pattern = computePattern(guess, possible_words[i]).toString();
        if (curr_pattern in pattern_to_subgroup) {
            pattern_to_subgroup[curr_pattern].push(possible_words[i]);
        } else {
            pattern_to_subgroup[curr_pattern] = [possible_words[i]];
        }
    }
    return pattern_to_subgroup;
}

function probabilityDist(pattern_groups) {
    var dist = [];
    var size = 0;
    for (var [key, val] of Object.entries(pattern_groups)) {
        size += val.length;
    }
    for (var [key, val] of Object.entries(pattern_groups)) {
        dist.push(val.length / size);
    }
    return dist;
}

function entropy(dist) {
    var entropy = 0;
    for (var i = 0; i < dist.length; i++) {
        entropy += dist[i] * Math.log2(1 / dist[i]);
    }
    return entropy;
}

function make_guess() {
    var best_guess = "";
    var highest_ent = 0;
    for (var i = 0; i < possible_words.length; i++) {
        var guess = possible_words[i];
        var curr_ent = entropy(probabilityDist(divideByPattern(guess)));
        if (curr_ent > highest_ent) {
            highest_ent = curr_ent;
            best_guess = guess;
        }
    }
    return best_guess;
}

function updatePossibilities(guess, pattern) {
    var pattern_to_subgroup = divideByPattern(guess);
    possible_words = pattern_to_subgroup[pattern.toString()];
    num_guesses += 1;
}