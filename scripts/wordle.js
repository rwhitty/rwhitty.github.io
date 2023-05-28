import { possible_words_list } from "./wordLists.js";

var counter = 0;
function handleClick() {
    console.log("oof");
    var oofText = document.createElement("p");
    oofText.textContent = possible_words_list[counter];
    document.body.appendChild(oofText);
    counter += 1;
}

document.getElementById("tile-1-1").addEventListener("click", handleClick);

var possible_words = possible_words_list;
var num_guesses = 0;

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
            best_guess = guess;
        }
    }
    return guess;
}

function updatePossibilities(guess, pattern) {
    var pattern_to_subgroup = divideByPattern(guess);
    possible_words = pattern_to_subgroup[pattern.toString()];
}