import { possible_words_list } from "./wordLists.js";

var counter = 0;
function handleClick() {
    var oofText = document.createElement("p");
    oofText.textContent = possible_words_list[counter];
    document.body.appendChild(oofText);
    counter += 1;
}

document.getElementById("myButton").addEventListener("click", handleClick);

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

function divideAlphabet(guess, alphabet) {
    var pattern_to_subgroup = {};
    for (var i = 0; i < alphabet.length; i++) {
        var curr_pattern = computePattern(guess, alphabet[i]).toString();
        if (curr_pattern in pattern_to_subgroup) {
            pattern_to_subgroup[curr_pattern].push(alphabet[i]);
        } else {
            pattern_to_subgroup[curr_pattern] = [alphabet[i]];
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

function make_guess(legal_words) {
    var best_guess = "";
    var highest_ent = 0;
    for (int i = 0; i < legal_words.length; i++) {
        var guess = legal_words[i];
        var curr_ent = entropy(probabilityDist(divideAlphabet(guess, legal_words)));
    }
}