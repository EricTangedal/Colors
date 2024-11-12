const hex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F"];
const btn = document.getElementById('btn');
const color = document.querySelector('.color');
let lastColor = "#ffffff"; // Initial color (white)
const duration = 3000; // Duration of the interpolation in milliseconds
let isAnimating = false; // Tracks if the animation is running
let animationFrameId;

btn.addEventListener('click', function() {
    isAnimating = !isAnimating; // Toggle animation state
    btn.textContent = isAnimating ? 'Pause' : 'Start'; // Update button text

    if (isAnimating) {
        startContinuousInterpolation();
    } else {
        cancelAnimationFrame(animationFrameId); // Stop the animation
    }
});

function startContinuousInterpolation() {
    const newColor = getRandomHexColor();
    animateColorInterpolation(lastColor, newColor, duration, () => {
        if (isAnimating) {
            startContinuousInterpolation(); // Start new interpolation after the current one completes
        }
    });
}

function animateColorInterpolation(color1, color2, duration, onComplete) {
    const startTime = performance.now();

    function step(currentTime) {
        const elapsed = currentTime - startTime;
        const ratio = Math.min(elapsed / duration, 1); // Calculate the ratio (0 to 1)
        const interpolatedColor = interpolateColor(color1, color2, ratio);

        // Update the color display and background color
        color.textContent = interpolatedColor;
        document.body.style.backgroundColor = interpolatedColor;
        lastColor = interpolatedColor;

        if (ratio < 1) {
            animationFrameId = requestAnimationFrame(step); // Continue animation until ratio reaches 1
        } else {
            onComplete(); // Call onComplete callback after animation finishes
        }
    }

    animationFrameId = requestAnimationFrame(step); // Start the animation
}

function getRandomHexColor() {
    let hexColor = '#';
    for (let i = 0; i < 6; i++) {
        hexColor += hex[getRandomNumber()];
    }
    return hexColor;
}

function getRandomNumber() {
    return Math.floor(Math.random() * hex.length);
}

function interpolateColor(color1, color2, ratio) {
    const hexToRgb = (hex) => {
        const bigint = parseInt(hex.slice(1), 16);
        return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
    };

    const rgbToHex = (r, g, b) => {
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    };

    const [r1, g1, b1] = hexToRgb(color1);
    const [r2, g2, b2] = hexToRgb(color2);

    const r = Math.round(r1 + ratio * (r2 - r1));
    const g = Math.round(g1 + ratio * (g2 - g1));
    const b = Math.round(b1 + ratio * (b2 - b1));

    return rgbToHex(r, g, b);
}
