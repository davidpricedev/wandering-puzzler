import * as R from "ramda";
import { Data } from "dataclass";

export class Point extends Data {
  x = 0;
  y = 0;

  static of(a, b) {
    if (b !== undefined) {
      return Point.create({ x: a, y: b });
    } else if (Array.isArray(a)) {
      return Point.create({ x: a[0], y: a[1] });
    } else if ("x" in a && "y" in a) {
      return Point.create({ x: a.x, y: a.y });
    } else {
      console.error(`Invalid arguments to Point.of: `, a, b);
      throw new Error(`Invalid arguments to Point.of: ${a}, ${b}`);
    }
  }

  add(other) {
    return Point.create({
      x: this.x + other.x,
      y: this.y + other.y,
    });
  }

  subtract(other) {
    return Point.create({
      x: this.x - other.x,
      y: this.y - other.y,
    });
  }

  scale(scalar) {
    return Point.create({
      x: this.x * scalar,
      y: this.y * scalar,
    });
  }

  toPairString() {
    return `${this.x},${this.y}`;
  }

  isZero() {
    return this.x === 0 && this.y === 0;
  }

  modulo(scalar) {
    return Point.create({
      x: this.x % scalar,
      y: this.y % scalar,
    });
  }

  static up = () => Point.of(0, -1);
  static upRight = () => Point.of(1, -1);
  static right = () => Point.of(1, 0);
  static downRight = () => Point.of(1, 1);
  static down = () => Point.of(0, 1);
  static downLeft = () => Point.of(-1, 1);
  static left = () => Point.of(-1, 0);
  static upLeft = () => Point.of(-1, -1);
  static zero = () => Point.of(0, 0);

  static arrayInclues(point, array) {
    return array.some((p) => p.equals(point));
  }
}

export class Box extends Data {
  left = 0;
  right = 0;
  top = 0;
  bottom = 0;

  static of({ topLeft, bottomRight }) {
    return Box.create({
      left: topLeft.x,
      right: bottomRight.x,
      top: topLeft.y,
      bottom: bottomRight.y,
    });
  }

  static fromPoints(points) {
    const xs = points.map((p) => p.x);
    const ys = points.map((p) => p.y);
    return Box.create({
      left: Math.min(...xs),
      right: Math.max(...xs),
      top: Math.min(...ys),
      bottom: Math.max(...ys),
    });
  }

  static fromCenter(center, rx, ry) {
    return Box.create({
      left: center.x - rx,
      right: center.x + rx,
      top: center.y - ry,
      bottom: center.y + ry,
    });
  }

  scale(scalar) {
    return Box.create({
      left: this.left * scalar,
      right: this.right * scalar,
      top: this.top * scalar,
      bottom: this.bottom * scalar,
    });
  }

  width() {
    return this.right - this.left;
  }

  height() {
    return this.bottom - this.top;
  }

  topLeft() {
    return Point.of(this.left, this.top);
  }

  topRight() {
    return Point.of(this.right, this.top);
  }

  bottomLeft() {
    return Point.of(this.left, this.bottom);
  }

  bottomRight() {
    return Point.of(this.right, this.bottom);
  }

  containsPoint(point, includeBREdge = false) {
    if (includeBREdge) {
      return (
        point.x >= this.left &&
        point.x <= this.right &&
        point.y >= this.top &&
        point.y <= this.bottom
      );
    }

    if (point.x === this.right && point.y === this.bottom) {
      console.log("contains point", point, this);
    }
    return (
      point.x >= this.left &&
      point.x < this.right &&
      point.y >= this.top &&
      point.y < this.bottom
    );
  }
}
