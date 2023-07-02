class Sprite {
  /*
   * The Sprite class is used to create animated images on the canvas.
   *
   * Arguments:
   * - position: an object with 'x' and 'y' properties to set the starting position of the sprite on the canvas.
   * - image: an Image object which is the picture of the sprite.
   * - frames: an object that has 'max' property telling how many animation frames are there. Default is 1 if not given.
   * - sprites: an array of extra sprites (not used in this example).
   */
  constructor({ position, image, frames = { max: 1 }, sprites = [] }) {
    // Set the position, image, and additional sprites
    this.position = position;
    this.image = image;
    // frames is used to control animation. It has val and elapsed properties that help in controlling which frame to show.
    this.frames = { ...frames, val: 0, elapsed: 0 };
    this.moving = false; // If the sprite is moving or not.
    this.sprites = sprites;

    // Once the image is loaded, calculate the width and height of each frame.
    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
    };
  }

  // This function is used to draw the sprite on the canvas.
  draw() {
    // Draw part of the image on the canvas. This is used for animations.
    c.drawImage(
      this.image,
      // Select the portion of the image to draw by defining a rectangle.
      this.frames.val * this.width,
      0,
      this.width,
      this.image.height,
      // Define where on the canvas the image should be drawn.
      this.position.x,
      this.position.y,
      this.width,
      this.image.height
    );

    // If the sprite is not moving or has only one frame, don't change frames.
    if (!this.moving || this.frames.max <= 1) return;

    // Count how many times the sprite has been drawn
    this.frames.elapsed++;

    // Change the frame every 10 draws to create the animation effect.
    if (this.frames.elapsed % 10 === 0) {
      // Move to the next frame, if it's past the last frame, go back to the first.
      this.frames.val = (this.frames.val + 1) % this.frames.max;
    }
  }
}

class Boundary {
  /*
   * The Boundary class represents a rectangle that can be used to check if something
   * has collided with it.
   */

  // These are default values for the width and height of the rectangle.
  static width = 48;
  static height = 48;

  /*
   * Initialize a new boundary.
   * - position: an object with 'x' and 'y' to set where the rectangle is placed on the canvas.
   */
  constructor({ position }) {
    this.position = position;
    // Set the width and height of the rectangle.
    this.width = Boundary.width;
    this.height = Boundary.height;
  }

  // This function is used to draw the rectangle on the canvas. Helpful for testing.
  draw() {
    // Set the color of the rectangle to be transparent red.
    c.fillStyle = "rgba(255, 0, 0, 0.5)";
    // Draw the rectangle on the canvas at the specified position.
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}
