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

  scale(scalar) {
    return Point.create({
      x: this.x * scalar,
      y: this.y * scalar,
    });
  }

  toPairString() {
    return `${this.x},${this.y}`;
  }
}
