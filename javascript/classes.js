class Sprite {
  /* Initialise a new Sprite class, representing an image or animation that is to be drawn onto the canvas.
   * Args:
   * - position: {x, y} coordinates to position the sprite on the canvas.
   * - image: Image object representing the sprite's image.
   * - frames: Object with 'max' property indicating the total number of frames in the sprite's animation.
   * - sprites: Array of additional sprites that can be used (optional).
   */
  constructor({ position, image, frames = { max: 1 }, sprites = [] }) {
    this.position = position;
    this.image = image;
    // Adding additional properties to frames - val and elapsed to keep track of animation progress.
    this.frames = { ...frames, val: 0, elapsed: 0 };
    this.moving = false;
    this.sprites = sprites;

    // Calculate width and height of each frame after the image is loaded.
    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
    };
  }

  // Draw the sprite on the canvas.
  draw() {
    // Draw the sprite image onto the canvas.
    c.drawImage(
      this.image,
      // Crop to current frame (x_0, y_0, x_1, y_1).
      this.frames.val * this.width,
      0,
      this.width,
      this.image.height,
      // Position on canvas (x_0, y_0, x_1, y_1).
      this.position.x,
      this.position.y,
      this.width,
      this.image.height
    );

    // If the sprite is not moving or does not have animation frames, do not update frame.
    if (!this.moving || this.frames.max <= 1) return;

    // Update the elapsed frame counter.
    this.frames.elapsed++;

    // Change frame every 10 draws (modulated by elapsed).
    if (this.frames.elapsed % 10 === 0) {
      // Iterate through the frames.
      this.frames.val = (this.frames.val + 1) % this.frames.max;
    }
  }
}

class Boundary {
  /* Boundary class representing a rectangular area that can be used to detect collisions.
   */
  // Constants representing the default width and height of the boundary.
  static width = 48;
  static height = 48;

  // Initialize a new boundary.
  // - position: {x, y} coordinates to position the boundary on the canvas.
  constructor({ position }) {
    this.position = position;
    // Set the width and height of the boundary.
    this.width = Boundary.width;
    this.height = Boundary.height;
  }

  // Draw the boundary on the canvas for debugging purposes.
  // It uses transparent red color.
  draw() {
    c.fillStyle = "rgba(255, 0, 0, 0.5)"; // Transparent red color.
    // Draw the rectangle at the boundary's position with its width and height.
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}
