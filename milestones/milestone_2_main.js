// Step 1: Get the canvas element and its 2D rendering context.
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

// Step 2: Set the canvas dimensions.
canvas.width = 1024;
canvas.height = 576;

// Step 3: Set the canvas background to white.
c.fillStyle = "white";
c.fillRect(0, 0, canvas.width, canvas.height);

// TODO: Generate collision map by slicing into rows.

// TODO: Generate battle boundaries map by slicing into rows.

// Step 6: Define position offset for the player.
const offset = { x: -740, y: -650 };

// TODO: Define a function to create boundaries from the collision map.

// TODO: Create boundaries and battle zones using the function defined above.

// Step 9: Define a function to load images.
const loadImage = (src) => {
  const image = new Image();
  image.src = src;
  return image;
};

// Step 10: Load images for the background, foreground, and player sprites.
const image = loadImage("../static/images/background.png");
const foregroundImage = loadImage("../static/images/foreground.png");
const playerDownImage = loadImage("../static/images/playerDown.png");
const playerUpImage = loadImage("../static/images/playerUp.png");
const playerLeftImage = loadImage("../static/images/playerLeft.png");
const playerRightImage = loadImage("../static/images/playerRight.png");

// Step 11: Create sprites for the player, background, and foreground.
const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 4 / 2,
    y: canvas.height / 2 - 68 / 2,
  },
  image: playerDownImage,
  frames: { max: 4 },
  sprites: {
    up: playerUpImage,
    down: playerDownImage,
    left: playerLeftImage,
    right: playerRightImage,
  },
});

const background = new Sprite({
  position: { x: offset.x, y: offset.y },
  image: image,
});

const foreground = new Sprite({
  position: { x: offset.x, y: offset.y },
  image: foregroundImage,
});

// TODO: Initialize an object to keep track of key states.

// TODO: Initialize an array of movable items.

// TODO: Define a function to detect collisions between rectangles.

// Step 15: Define the main animation function.
function animate() {
  window.requestAnimationFrame(animate);

  // Draw the background.
  background.draw();

  // Draw the player.
  player.draw();

  // Draw the foreground.
  foreground.draw();
}

// Step 16: Start the animation.
animate();

// TODO: Add event listeners for keyboard input.
