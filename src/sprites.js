import * as R from "ramda";
import { Data } from "dataclass";
import { directionMap } from "./constants";
import { Point } from "./point";

export class SpriteCollection extends Data {
  sprites = [];
  spriteIndex = {};

  static fromSprites(sprites) {
    return SpriteCollection.create({
      sprites,
      spriteIndex: R.reduce(
        (acc, sprite) => ({
          ...acc,
          [Point.of(sprite).toPairString()]: sprite,
        }),
        {},
        sprites,
      ),
    });
  }

  getAt(pos) {
    return this.spriteIndex[Point.of(pos).toPairString()];
  }

  move(oldPos, newPos) {
    const newSprite = this.getAt(oldPos).moveTo(newPos);
    return SpriteCollection.fromSprites(
      this.sprites.map((s) => (Point.of(s).equals(oldPos) ? newSprite : s)),
    );
  }

  removeAt(pos) {
    return SpriteCollection.fromSprites(
      this.sprites.filter((s) => !Point.of(s).equals(pos)),
    );
  }

  forEach(fn) {
    this.sprites.forEach(fn);
  }

  getNeighbors(pos) {
    return Object.values(directionMap)
      .map((d) => this.getAt(Point.of(pos).add(d)))
      .filter(R.identity);
  }
}
