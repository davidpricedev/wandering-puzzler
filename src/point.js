import * as R from "ramda";
import { Data } from "dataclass";

export class Point extends Data {
  x = 0;
  y = 0;

  static of({ x, y }) {
    return Point.create({ x, y });
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

  static up = () => Point.of({ x: 0, y: -1 });
  static upRight = () => Point.of({ x: 1, y: -1 });
  static right = () => Point.of({ x: 1, y: 0 });
  static downRight = () => Point.of({ x: 1, y: 1 });
  static down = () => Point.of({ x: 0, y: 1 });
  static downLeft = () => Point.of({ x: -1, y: 1 });
  static left = () => Point.of({ x: -1, y: 0 });
  static upLeft = () => Point.of({ x: -1, y: -1 });

  static arrayInclues(point, array) {
    return array.some((p) => p.equals(point));
  }
}
