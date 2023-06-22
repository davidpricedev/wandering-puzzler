import * as R from "ramda";
import { Data } from "dataclass";
import { allDirections, cardinalDirectionMap } from "./constants";
import { Point } from "./point";

export class SpriteCollection extends Data {
  sprites = [];

  static fromSprites(sprites) {
    return SpriteCollection.create({
      sprites,
    });
  }

  getAt(pos) {
    return this.sprites.find((s) => Point.of(s).equals(pos));
  }

  move(oldPos, newPos) {
    const oldSprite = this.getAt(oldPos);
    if (!oldSprite) {
      console.error("No sprite found at: ", oldPos);
      throw new Error(`No sprite found at ${oldPos.toString()}`);
    }

    const newSprite = oldSprite.moveTo(newPos);
    return this.copy({
      sprites: this.sprites.map((s) =>
        Point.of(s).equals(oldPos) ? newSprite : s,
      ),
    });
  }

  removeAt(pos) {
    return this.copy({
      sprites: this.sprites.filter((s) => !Point.of(s).equals(pos)),
    });
  }

  find(fn) {
    return this.sprites.find(fn);
  }

  forEach(fn) {
    this.sprites.forEach(fn);
  }

  getCardinalNeighbors(pos) {
    return Object.values(cardinalDirectionMap)
      .map((d) => this.getAt(Point.of(pos).add(d)))
      .filter(R.identity);
  }

  getAllNeighbors(pos) {
    return allDirections.map((d) => this.getAt(d.add(pos))).filter(R.identity);
  }

  filterToViewport(viewport) {
    return this.copy({
      sprites: this.sprites.filter((s) => viewport.containsPoint(s, true)),
    });
  }
}
