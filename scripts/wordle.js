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

    }
}