import { possible_words_list } from "./wordLists.js";

function handleClick() {
    var oofText = document.createElement("p");
    oofText.textContent = possible_words_list[0];
    document.body.appendChild(oofText);
}

document.getElementById("myButton").addEventListener("click", handleClick);