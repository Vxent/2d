// Initialize the Fabric.js canvas
const canvas = new fabric.Canvas('clothingCanvas');
canvas.setBackgroundColor('white', canvas.renderAll.bind(canvas));  // Set default background

// Load both front and back SVG for the T-shirt
const loadTshirt = () => {
    // Load the front T-shirt SVG
    fabric.loadSVGFromURL('2D SVG/frontTshirt.svg', (frontObjects, frontOptions) => {
        const frontTshirt = fabric.util.groupSVGElements(frontObjects, frontOptions);
        frontTshirt.set({
            left: canvas.width / 2 - frontTshirt.width / 2,
            top: canvas.height / 2 - frontTshirt.height / 2,
        });

        // Load the back T-shirt SVG
        fabric.loadSVGFromURL('2D SVG/backTshirt.svg', (backObjects, backOptions) => {
            const backTshirt = fabric.util.groupSVGElements(backObjects, backOptions);
            backTshirt.set({
                left: canvas.width / 2 - backTshirt.width / 2,
                top: canvas.height / 2 - backTshirt.height / 2,
            });

            // Clear any existing objects and add both front and back to the canvas
            canvas.clear();
            canvas.add(frontTshirt);
            canvas.add(backTshirt);
        });
    });
};

// Button Event Listeners for loading clothing type
document.getElementById('tshirtBtn').onclick = loadTshirt;

// Add Text to the canvas
document.getElementById('addTextBtn').onclick = () => {
    const text = prompt('Enter text to add to the clothing:', 'Custom Text');
    if (text) {
        const textObject = new fabric.Text(text, {
            left: 150,
            top: 150,
            fontFamily: 'Arial',
            fontSize: 30,
            fill: '#000000',  // Default text color
        });
        canvas.add(textObject);
    }
};

// Add Image to the canvas
document.getElementById('addImageBtn').onclick = () => {
    const imgUrl = prompt('Enter the image URL to add to the clothing:', 'https://example.com/logo.png');
    if (imgUrl) {
        fabric.Image.fromURL(imgUrl, (img) => {
            img.set({
                left: 200,
                top: 200,
                scaleX: 0.3,  // Adjust image size
                scaleY: 0.3,
            });
            canvas.add(img);
        });
    }
};

// Set a default clothing when the page loads
window.onload = loadTshirt;  // Load the T-shirt by default
