// Get the canvas element and its 2D rendering context.
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

// Set the canvas dimensions.
canvas.width = 1024;
canvas.height = 576;

// Generate collision map by slicing into rows.
const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 70) {
  collisionsMap.push(collisions.slice(i, i + 70));
}

// Position offset for the player.
const offset = { x: -740, y: -650 };

// Create boundary objects based on collision map.
const boundaries = [];
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

// Set the canvas background to white.
c.fillStyle = "white";
c.fillRect(0, 0, canvas.width, canvas.height);

// Load images for background and player in different orientations.
const image = new Image();
image.src = "../static/images/background.png";

const playerDownImage = new Image();
playerDownImage.src = "../static/images/playerDown.png";

const playerUpImage = new Image();
playerUpImage.src = "../static/images/playerUp.png";

const playerLeftImage = new Image();
playerLeftImage.src = "../static/images/playerLeft.png";

const playerRightImage = new Image();
playerRightImage.src = "../static/images/playerRight.png";

// Load image for foreground.
const foregroundImage = new Image();
foregroundImage.src = "../static/images/foreground.png";

// Create player sprite.
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

// Create background sprite.
const background = new Sprite({
  position: { x: offset.x, y: offset.y },
  image: image,
});

// Create foreground sprite.
const foreground = new Sprite({
  position: { x: offset.x, y: offset.y },
  image: foregroundImage,
});

// Object to keep track of key states.
const keys = {
  w: { pressed: false },
  s: { pressed: false },
  a: { pressed: false },
  d: { pressed: false },
};

// Array of movable items.
const movables = [background, ...boundaries, foreground];

// Function to detect collisions between rectangles.
function rectangularCollisions({ rectangle1, rectangle2 }) {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y
  );
}

// Function to animate the canvas.
function animate() {
  window.requestAnimationFrame(animate);

  // Draw the background.
  background.draw();

  // Draw the boundaries.
  boundaries.forEach((boundary) => boundary.draw());

  // Draw the player.
  player.draw();

  // Draw the foreground.
  foreground.draw();

  // Handle player movement based on key states.
  let moving = true;
  player.moving = false;
  const speed = 3;
  const checkCollision = (boundary, dx, dy) => {
    return rectangularCollisions({
      rectangle1: player,
      rectangle2: {
        ...boundary,
        position: { x: boundary.position.x + dx, y: boundary.position.y + dy },
      },
    });
  };

  // Handling movement and collisions for each direction.
  if (keys.w.pressed) {
    player.moving = true;
    player.image = player.sprites.up;
    if (!boundaries.some((b) => checkCollision(b, 0, speed))) {
      movables.forEach((m) => (m.position.y += speed));
    }
  } else if (keys.s.pressed) {
    player.moving = true;
    player.image = player.sprites.down;
    if (!boundaries.some((b) => checkCollision(b, 0, -speed))) {
      movables.forEach((m) => (m.position.y -= speed));
    }
  } else if (keys.a.pressed) {
    player.moving = true;
    player.image = player.sprites.left;
    if (!boundaries.some((b) => checkCollision(b, speed, 0))) {
      movables.forEach((m) => (m.position.x += speed));
    }
  } else if (keys.d.pressed) {
    player.moving = true;
    player.image = player.sprites.right;
    if (!boundaries.some((b) => checkCollision(b, -speed, 0))) {
      movables.forEach((m) => (m.position.x -= speed));
    }
  }
}

// Start animation.
animate();

// Event listeners for keyboard input.
window.addEventListener("keydown", (e) => {
  if (["w", "s", "a", "d"].includes(e.key)) {
    keys[e.key].pressed = true;
  }
});

window.addEventListener("keyup", (e) => {
  if (["w", "s", "a", "d"].includes(e.key)) {
    keys[e.key].pressed = false;
  }
});
