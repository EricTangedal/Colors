const canvas = document.getElementById('colorWheel');
const ctx = canvas.getContext('2d');
const selectedColorDisplay = document.getElementById('selectedColor');
const colorCodeDisplay = document.getElementById('colorCode');
const hexInput = document.getElementById('hexInput');
const rgbInput = document.getElementById('rgbInput');
const radius = canvas.width / 2; // Radius of the color wheel
const centerX = canvas.width / 2; // Center X coordinate of the wheel
const centerY = canvas.height / 2; // Center Y coordinate of the wheel

let selectedPosition =  { x: centerX, y: centerY }; // Stores the selected color's position
let isDragging = false;

// Function to draw the color wheel
function drawColorWheel() {
    const toRadians = (angle) => angle * (Math.PI / 180);

    for (let angle = 0; angle < 360; angle+= 0.5) {
        const startAngle = toRadians(angle);
        const endAngle = toRadians(angle + 1);

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);

        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        gradient.addColorStop(0, 'white');
        gradient.addColorStop(1, `hsl(${angle}, 100%, 50%)`);
        ctx.fillStyle = gradient;
        ctx.fill();
    }
}

// Draw a small circle to indicate the selected color
function drawSelectedColorIndicator(x, y) {    
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'black';
    ctx.stroke();
}

// Function to pick a color at a specific position
function pickColorAtPosition(x, y) {
    const radius = canvas.width / 2;
    const distance = Math.sqrt(Math.pow(x - radius, 2) + Math.pow(y - radius, 2));

    if (distance < radius) { // Only pick colors within the wheel radius
        // Get the color at the specified position
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        const color = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;

        // Update the selected color and display		
        updateSelectedColor(color);    
    }
}

// Function to update the selected color display and input fields
function updateSelectedColor(color) {
    const rgb = color.match(/\d+/g).map(Number);
    const hex = rgbToHex(rgb[0], rgb[1], rgb[2]);
    selectedColorDisplay.style.backgroundColor = color;
    hexInput.value = hex;
    rgbInput.value = `${rgb[0]}, ${rgb[1]}, ${rgb[2]}`;
}

// Convert Hex to RGB
function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    return [ (bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255 ];
}

// Convert RGB to Hex
function rgbToHex(r, g, b) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

// Convert RGB to HSL
function rgbToHsl(r, g, b) {
    // Convert RGB values from the range [0, 255] to [0, 1]
    r /= 255;
    g /= 255;
    b /= 255;

    // Calculate the max and min values of r, g, and b
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    let h, s, l = (max + min) / 2; // Lightness is the average of max and min

    if (max === min) {
        // Achromatic case (no hue, gray colors)
        h = s = 0;
    } else {
        // Calculate saturation
        const d = max - min; // Delta (difference between max and min)
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        // Calculate hue based on which color component is max
        switch (max) {
            case r:
                h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
                break;
            case g:
                h = ((b - r) / d + 2) * 60;
                break;
            case b:
                h = ((r - g) / d + 4) * 60;
                break;
        }
    }

    // Ensure hue is in the range [0, 360] by using modulo 360
    h = Math.round(h) % 360;
    s = Math.round(s * 100); // Convert to percentage
    l = Math.round(l * 100); // Convert to percentage

    return [h, s, l];
}

// Event listener for clicking on the canvas to pick a color
canvas.addEventListener('click', (event) => {
    const x = event.offsetX;
    const y = event.offsetY;
	pickColorAtPosition(x, y);
});

// Event listener for hex input
hexInput.addEventListener('input', () => {
    const hex = hexInput.value;
    if (/^#[0-9A-F]{6}$/i.test(hex)) {
        const [r, g, b] = hexToRgb(hex);
        const rgbColor = `rgb(${r}, ${g}, ${b})`;
        updateSelectedColor(rgbColor); // Update position directly from RGB
    }
});

// Event listener for RGB input
rgbInput.addEventListener('input', () => {
    const rgb = rgbInput.value.match(/\d+/g);
    if (rgb && rgb.length === 3) {
        const [r, g, b] = rgb.map(Number);
        if (r <= 255 && g <= 255 && b <= 255) {
            const rgbColor = `rgb(${r}, ${g}, ${b})`;
			updateSelectedColor(rgbColor);
        }
    }
});

// Event listeners for drag-and-select functionality
canvas.addEventListener('mousedown', (event) => {
    isDragging = true;
    pickColorAtPosition(event.offsetX, event.offsetY);
});

canvas.addEventListener('mousemove', (event) => {
    if (isDragging) {
        pickColorAtPosition(event.offsetX, event.offsetY);
    }
});

document.addEventListener('mouseup', () => {
	isDragging = false;
});

// Draw the color wheel initially
drawColorWheel();
