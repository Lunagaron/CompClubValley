// Define a Sprite class to encapsulate drawing functionality
class Sprite {
  constructor({ position, image, frames = { max: 1 }, sprites = [] }) {
    this.position = position;
    this.image = image;
    this.frames = { ...frames, val: 0, elapsed: 0 };
    // Load after this.image is finished loading
    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
    };
    this.moving = false;
    this.sprites = sprites;
  }

  // Draw the sprite onto the canvas
  draw() {
    // Draw the player image onto the canvas
    c.drawImage(
      this.image,
      // Define the cropping of the player image (x_0, y_0, x_1, y_1)
      this.frames.val * this.width,
      0,
      this.image.width / this.frames.max,
      this.image.height,
      // Define the placement of the player image (x_0, y_0, x_1, y_1)
      this.position.x,
      this.position.y,
      this.image.width / this.frames.max,
      this.image.height
    );
    // If the player isnt holding a keydown, return
    if (!this.moving) return;

    // Else if the player is moving
    if (this.frames.max > 1) {
      this.frames.elapsed++;
    }
    if (this.frames.elapsed % 10 === 0) {
      // Iterates through the frames of the character sprite
      if (this.frames.val < this.frames.max - 1) this.frames.val++;
      else this.frames.val = 0;
    }
  }
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
