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

  // Used to show boundaries - for debugging
  draw() {
    c.fillStyle = "rgba(255,0,0,0)";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

const boundaries = [];

// Offset the player from the upper-left hand side of the map
const offset = {
  x: -740, // Adjust the position as needed
  y: -650, // Adjust the position as needed
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
  constructor({ position, image, frames = { max: 1, hold: 10 } }) {
    this.position = position;
    this.image = image;
    this.frames = frames;
    // Load after this.image is finished loading
    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
    };
  }

  // Draw the sprite onto the canvas
  draw() {
    // Draw the player image onto the canvas
    c.drawImage(
      this.image,
      // Define the cropping of the player image (x_0, y_0, x_1, y_1)
      0,
      0,
      this.image.width / this.frames.max,
      this.image.height,
      // Define the placement of the player image (x_0, y_0, x_1, y_1)
      this.position.x,
      this.position.y,
      this.image.width / this.frames.max,
      this.image.height
    );
  }
}

// Player Sprite
const player = new Sprite({
  position: {
    // Draws player sprite in the centre of the map
    x: canvas.width / 2 - 192 / 4 / 2, // Adjust the position as needed
    y: canvas.height / 2 - 68 / 2, // Adjust the position as needed
  },
  image: playerImage,
  frames: {
    max: 4,
  },
});

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

// Items that are moveable on the map
const movables = [background, ...boundaries];

// Detect collisions
function rectangularCollisions({ rectangle1, rectangle2 }) {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y
  );
}

// Animate the canvas
function animate() {
  window.requestAnimationFrame(animate);
  background.draw();

  // Draws the boundaries onto the map
  boundaries.forEach((boundary) => {
    boundary.draw();
  });

  // Draws out player sprite
  player.draw();

  // Move the background sprite based on key states
  let moving = true;
  if (keys.w.pressed && lastKey === "w") {
    for (let i = 0; i < boundaries.length; i++) {
      // Use boundary detection function on player and boundary
      const boundary = boundaries[i];
      if (
        rectangularCollisions({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y + 3,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving)
      movables.forEach((movable) => {
        movable.position.y += 3;
      });
  } else if (keys.s.pressed && lastKey === "s") {
    for (let i = 0; i < boundaries.length; i++) {
      // Use boundary detection function on player and boundary
      const boundary = boundaries[i];
      if (
        rectangularCollisions({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y - 3,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving)
      movables.forEach((movable) => {
        movable.position.y -= 3;
      });
  } else if (keys.a.pressed && lastKey === "a") {
    for (let i = 0; i < boundaries.length; i++) {
      // Use boundary detection function on player and boundary
      const boundary = boundaries[i];
      if (
        rectangularCollisions({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x + 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving)
      movables.forEach((movable) => {
        movable.position.x += 3;
      });
  } else if (keys.d.pressed && lastKey === "d") {
    for (let i = 0; i < boundaries.length; i++) {
      // Use boundary detection function on player and boundary
      const boundary = boundaries[i];
      if (
        rectangularCollisions({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x - 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving)
      movables.forEach((movable) => {
        movable.position.x -= 3;
      });
  }
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
