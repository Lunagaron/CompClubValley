// Select the canvas element from the document
const canvas = document.querySelector("canvas");

// Get the 2D rendering context of the canvas
const c = canvas.getContext("2d");

// Set the width and height of the canvas to a 16:9 aspect ratio
canvas.width = 1024;
canvas.height = 576;

// Slice out each pixel layer to parse collisions
const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 70) {
  collisionsMap.push(collisions.slice(i, i + 70));
}

// Boundaries
class Boundary {
  static width = 48;
  static height = 48;
  constructor({ position }) {
    this.position = position;
    this.width = 48;
    this.height = 48;
  }

  draw() {
    c.fillStyle = "red";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

const boundaries = [];

// Offset the player from the upper-left hand side of the map
const offset = {
  x: -740, // Adjust the position as needed
  y: -600, // Adjust the position as needed
};

collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025)
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
  });
});

// Fill the canvas with a white background
c.fillStyle = "white";
c.fillRect(0, 0, canvas.width, canvas.height);

// Create a new image object and set the source for the background
const image = new Image();
image.src = "../static/images/background.png";

// Create a new image object and set the source for the player
const playerImage = new Image();
playerImage.src = "../static/images/playerDown.png";

// Define a Sprite class to encapsulate drawing functionality
class Sprite {
  constructor({ position, image }) {
    this.position = position;
    this.image = image;
  }

  // Draw the sprite onto the canvas
  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

// Create a background sprite
const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: image,
});

// Object to keep track of key states
const keys = {
  w: { pressed: false },
  s: { pressed: false },
  a: { pressed: false },
  d: { pressed: false },
};

// Animate the canvas
function animate() {
  window.requestAnimationFrame(animate);
  background.draw();

  // Draws the boundaries onto the map
  boundaries.forEach((boundary) => {
    boundary.draw();
  });

  // Draw the player image onto the canvas
  c.drawImage(
    playerImage,
    // Define the cropping of the player image (x_0, y_0, x_1, y_1)
    0,
    0,
    playerImage.width / 4,
    playerImage.height,
    // Define the placement of the player image (x_0, y_0, x_1, y_1)
    canvas.width / 2 - playerImage.width / 8, // Adjust the position as needed
    canvas.height / 2 - playerImage.height / 2,
    playerImage.width / 4,
    playerImage.height
  );

  // Move the background sprite based on key states
  if (keys.w.pressed && lastKey === "w") background.position.y += 3;
  else if (keys.s.pressed && lastKey === "s") background.position.y -= 3;
  else if (keys.a.pressed && lastKey === "a") background.position.x += 3;
  else if (keys.d.pressed && lastKey === "d") background.position.x -= 3;
}

animate();

// Event listeners for keydown and keyup events
let lastKey = "";
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = true;
      lastKey = "w";
      break;
    case "s":
      keys.s.pressed = true;
      lastKey = "s";
      break;
    case "a":
      keys.a.pressed = true;
      lastKey = "a";
      break;
    case "d":
      keys.d.pressed = true;
      lastKey = "d";
      break;
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = false;
      break;
    case "s":
      keys.s.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
  }
});
