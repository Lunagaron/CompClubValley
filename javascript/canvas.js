// Select the canvas element from the document
const canvas = document.querySelector("canvas");

// Get the 2D rendering context of the canvas
const c = canvas.getContext("2d");

// Set the width and height of the canvas to a 16:9 aspect ratio
canvas.width = 1024;
canvas.height = 576;

// Fill the canvas with a white background
c.fillStyle = "white";
c.fillRect(0, 0, canvas.width, canvas.height);
