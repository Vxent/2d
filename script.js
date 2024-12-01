
// Add functionality for adding text and image to front and back
document.getElementById('add-front').addEventListener('click', () => {
    const text = document.getElementById('text-input').value;
    const textElement = document.getElementById('front-text');
    textElement.textContent = text;
    textElement.style.display = 'block';

    const imageInput = document.getElementById('image-input');
    const imageElement = document.getElementById('front-image');
    if (imageInput.files && imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imageElement.src = e.target.result;
            imageElement.style.display = 'block';
        };
        reader.readAsDataURL(imageInput.files[0]);
    }
    enableInteract(textElement);
    enableInteract(imageElement);
});

document.getElementById('add-back').addEventListener('click', () => {
    const text = document.getElementById('text-input').value;
    const textElement = document.getElementById('back-text');
    textElement.textContent = text;
    textElement.style.display = 'block';

    const imageInput = document.getElementById('image-input');
    const imageElement = document.getElementById('back-image');
    if (imageInput.files && imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imageElement.src = e.target.result;
            imageElement.style.display = 'block';
        };
        reader.readAsDataURL(imageInput.files[0]);
    }
    enableInteract(textElement);
    enableInteract(imageElement);
});

// Enable Interact.js for drag-and-drop and resize
function enableInteract(element) {
    interact(element)
        .draggable({
            listeners: {
                move(event) {
                    const { target, dx, dy } = event;
                    const x = (parseFloat(target.getAttribute('data-x')) || 0) + dx;
                    const y = (parseFloat(target.getAttribute('data-y')) || 0) + dy;

                    target.style.transform = `translate(${x}px, ${y}px)`;
                    target.setAttribute('data-x', x);
                    target.setAttribute('data-y', y);
                }
            }
        })
        .resizable({
            edges: { left: true, right: true, bottom: true, top: true },
            listeners: {
                move(event) {
                    let { target, rect, deltaRect } = event;
                    let x = (parseFloat(target.getAttribute('data-x')) || 0);
                    let y = (parseFloat(target.getAttribute('data-y')) || 0);

                    target.style.width = rect.width + 'px';
                    target.style.height = rect.height + 'px';

                    x += deltaRect.left;
                    y += deltaRect.top;

                    target.style.transform = `translate(${x}px, ${y}px)`;
                    target.setAttribute('data-x', x);
                    target.setAttribute('data-y', y);
                }
            }
        });
}

// Change Shirt Color
document.getElementById('color-picker').addEventListener('input', function() {
    const color = this.value;
    
    // Apply color overlay with desired shirt color (with opacity for blending)
    document.getElementById('front-shirt-svg').children[0].setAttribute('fill', color);
    document.getElementById('back-shirt-svg').children[0].setAttribute('fill', color);
});

// Download the customized shirt as an image
document.getElementById('download-btn').addEventListener('click', function() {
    const canvas = document.getElementById('shirt-canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions (same as shirt size)
    canvas.width = 300;
    canvas.height = 400;

    // Get front and back shirt elements
    const frontShirt = document.getElementById('front-shirt');
    const backShirt = document.getElementById('back-shirt');

    // Draw front shirt
    drawShirt(ctx, frontShirt, 0);

    // Draw back shirt
    drawShirt(ctx, backShirt, 400);

    // Convert canvas to image and trigger download
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'customized_shirt.png';
    link.click();
});

function drawShirt(ctx, shirtElement, offsetY) {
    // Draw shirt SVG
    const svg = shirtElement.querySelector('svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    img.onload = function() {
        ctx.drawImage(img, 0, offsetY, 300, 400);
        URL.revokeObjectURL(url);
    };
    img.src = url;

    // Draw text
    const textElement = shirtElement.querySelector('.custom-text');
    if (textElement.style.display === 'block') {
        ctx.font = '20px Arial';
        ctx.fillStyle = 'black';
        const x = parseFloat(textElement.getAttribute('data-x')) || 0;
        const y = parseFloat(textElement.getAttribute('data-y')) || 0;
        ctx.fillText(textElement.textContent, 150 + x, 200 + y + offsetY);
    }

    // Draw image
    const imgElement = shirtElement.querySelector('.custom-image');
    if (imgElement.style.display === 'block') {
        const customImg = new Image();
        customImg.onload = function() {
            const x = parseFloat(imgElement.getAttribute('data-x')) || 0;
            const y = parseFloat(imgElement.getAttribute('data-y')) || 0;
            ctx.drawImage(customImg, 150 + x - (customImg.width / 2), 200 + y - (customImg.height / 2) + offsetY);
        };
        customImg.src = imgElement.src;
    }
}
document.addEventListener('DOMContentLoaded', function() {
    const frontTextElement = document.getElementById('front-text');
    const backTextElement = document.getElementById('back-text');
    const frontImageElement = document.getElementById('front-image');
    const backImageElement = document.getElementById('back-image');
    const frontColorOverlay = document.getElementById('front-color-overlay');
    const backColorOverlay = document.getElementById('back-color-overlay');
    const colorPicker = document.getElementById('color-picker');
    const textInput = document.getElementById('text-input');
    const imageInput = document.getElementById('image-input');
    const resetButton = document.getElementById('reset-btn');

    // Reset customization function
    function resetCustomization() {
        // Clear the text fields
        frontTextElement.textContent = '';
        backTextElement.textContent = '';

        // Remove the images
        frontImageElement.src = '';
        backImageElement.src = '';

        // Reset the shirt colors to the default color (white)
        frontColorOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.3)'; // Default dark overlay
        backColorOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';  // Default dark overlay

        // Reset the text input field
        textInput.value = '';

        // Reset the image input (remove any uploaded image)
        imageInput.value = '';
    }

    // Add event listener to the reset button
    resetButton.addEventListener('click', resetCustomization);

    // Other existing event listeners to handle adding text and images (you can include these if you haven't already)
    const addFrontButton = document.getElementById('add-front');
    const addBackButton = document.getElementById('add-back');

    // Add text to the front shirt
    addFrontButton.addEventListener('click', function() {
        if (textInput.value.trim() !== '') {
            frontTextElement.textContent = textInput.value.trim();
        }
    });

    // Add text to the back shirt
    addBackButton.addEventListener('click', function() {
        if (textInput.value.trim() !== '') {
            backTextElement.textContent = textInput.value.trim();
        }
    });

    // Handle image upload for the front shirt
    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                frontImageElement.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Handle color picker change
    colorPicker.addEventListener('input', function(e) {
        const color = e.target.value;
        frontColorOverlay.style.backgroundColor = `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, 0.3)`;
        backColorOverlay.style.backgroundColor = `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, 0.3)`;
    });
});
