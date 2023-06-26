// Step 1: Get the canvas element and its 2D rendering context.
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

// Step 2: Set the canvas dimensions.
canvas.width = 1024;
canvas.height = 576;

// Step 3: Set the canvas background to white.
c.fillStyle = "white";
c.fillRect(0, 0, canvas.width, canvas.height);

// Step 4: Generate collision map by slicing into rows.
const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 70) {
  collisionsMap.push(collisions.slice(i, i + 70));
}

// Step 5: Generate battle boundaries map by slicing into rows.
const battleZonesMap = [];
for (let i = 0; i < battleZonesData.length; i += 70) {
  battleZonesMap.push(battleZonesData.slice(i, i + 70));
}

// Step 6: Define position offset for the player.
const offset = { x: -740, y: -650 };

// Step 7: Define a function to create boundaries from the collision map.
const createBoundariesFromMap = (map, zonesArray) => {
  const boundaries = [];
  map.forEach((row, i) => {
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
  zonesArray.push(...boundaries);
};

// Step 8: Create boundaries and battle zones using the function defined above.
const boundaries = [];
createBoundariesFromMap(collisionsMap, boundaries);

const battleZones = [];
createBoundariesFromMap(battleZonesMap, battleZones);

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

// Step 12: Initialize an object to keep track of key states.
const keys = {
  w: { pressed: false },
  s: { pressed: false },
  a: { pressed: false },
  d: { pressed: false },
};

// Step 13: Initialize an array of movable items.
const movables = [background, ...boundaries, foreground, ...battleZones];

// Step 14: Define a function to detect collisions between rectangles.
function rectangularCollisions({ rectangle1, rectangle2 }) {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y
  );
}

// Step 15: Define the main animation function.
function animate() {
  window.requestAnimationFrame(animate);

  // Draw the background.
  background.draw();

  // Draw the boundaries for map boundary and battle zones
  boundaries.forEach((boundary) => boundary.draw());
  battleZones.forEach((battleZone) => battleZone.draw());

  // Draw the player.
  player.draw();

  // Draw the foreground.
  foreground.draw();

  // Detect collision with battlezone, and activate a battle
  if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
    for (let i = 0; i < battleZones.length; i++) {
      const battleZone = battleZones[i];
      const overlappingArea =
        (Math.min(
          player.position.x + player.width,
          battleZone.position.x + battleZone.width
        ) -
          Math.max(player.position.x, battleZone.position.x)) *
        (Math.min(
          player.position.y + player.height,
          battleZone.position.y + battleZone.height
        ) -
          Math.max(player.position.y, battleZone.position.y));
      if (
        rectangularCollisions({
          rectangle1: player,
          rectangle2: battleZone,
        }) &&
        overlappingArea > (player.width * player.height) / 2 &&
        Math.random() < 0.005 // Only initiate an event in a 5/100 chance
      ) {
        console.log("Battle Zone collision");
        break;
      }
    }
  }

  // Handle player movement based on key states.
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

// Step 16: Start the animation.
animate();

// Step 17: Add event listeners for keyboard input.
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
