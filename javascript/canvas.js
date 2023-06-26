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

const boundaries = [];

// Offset the player from the upper-left hand side of the map
const offset = {
  x: -740, // Adjust the position as needed
  y: -650, // Adjust the position as needed
};

// Create boundary objects based on collision map
collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025) {
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
    }
  });
});

// Fill the canvas with a white background
c.fillStyle = "white";
c.fillRect(0, 0, canvas.width, canvas.height);

// Create a new image object and set the source for the background
const image = new Image();
image.src = "../static/images/background.png";

// Create a new image object and set the source for the player for each orientation
const playerDownImage = new Image();
playerDownImage.src = "../static/images/playerDown.png";

const playerUpImage = new Image();
playerUpImage.src = "../static/images/playerUp.png";

const playerLeftImage = new Image();
playerLeftImage.src = "../static/images/playerLeft.png";

const playerRightImage = new Image();
playerRightImage.src = "../static/images/playerRight.png";

// Create a new image object and set the source for the foreground
const foregroundImage = new Image();
foregroundImage.src = "../static/images/foreground.png";

// Player Sprite
const player = new Sprite({
  position: {
    // Draws player sprite in the center of the map
    x: canvas.width / 2 - 192 / 4 / 2, // Adjust the position as needed
    y: canvas.height / 2 - 68 / 2, // Adjust the position as needed
  },
  image: playerDownImage,
  frames: {
    max: 4,
  },
  sprites: {
    up: playerUpImage,
    down: playerDownImage,
    left: playerLeftImage,
    right: playerRightImage,
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

// Create a foreground sprite
const foreground = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: foregroundImage,
});

// Object to keep track of key states
const keys = {
  w: { pressed: false },
  s: { pressed: false },
  a: { pressed: false },
  d: { pressed: false },
};

// Items that are movable on the map
const movables = [background, ...boundaries, foreground];

// Detect collisions between rectangles
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

  // Draw the background onto the map
  background.draw();

  // Draw the boundaries onto the map
  boundaries.forEach((boundary) => {
    boundary.draw();
  });

  // Draw the player sprite
  player.draw();

  // Draw the foreground over the player
  foreground.draw();

  // Move the background sprite based on key states
  let moving = true;
  player.moving = false;
  if (keys.w.pressed && lastKey === "w") {
    player.moving = true;
    player.image = player.sprites.up;
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
    if (moving) {
      movables.forEach((movable) => {
        movable.position.y += 3;
      });
    }
  } else if (keys.s.pressed && lastKey === "s") {
    player.moving = true;
    player.image = player.sprites.down;
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
    if (moving) {
      movables.forEach((movable) => {
        movable.position.y -= 3;
      });
    }
  } else if (keys.a.pressed && lastKey === "a") {
    player.moving = true;
    player.image = player.sprites.left;
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
    if (moving) {
      movables.forEach((movable) => {
        movable.position.x += 3;
      });
    }
  } else if (keys.d.pressed && lastKey === "d") {
    player.moving = true;
    player.image = player.sprites.right;
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
    if (moving) {
      movables.forEach((movable) => {
        movable.position.x -= 3;
      });
    }
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
