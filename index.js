const hex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F"];
const btn = document.getElementById('btn');
const color = document.querySelector('.color');
let lastColor = "#ffffff"; // Initial color (white)

btn.addEventListener('click', changeColor);

function changeColor(lastColor){
    // Get random number between 0 and 3.
    const newColor = getRandomHexColor();
    document.body.style.backgroundColor = newColor;
    color.textContent = newColor;
    lastColor = newColor;
}

function getRandomNumber(){
    return Math.floor(Math.random() * hex.length);
}

function getRandomHexColor() {
    let hexColor = '#';
    for (let i = 0; i < 6; i++) {
        hexColor += hex[getRandomNumber()];
    }
    return hexColor;
}