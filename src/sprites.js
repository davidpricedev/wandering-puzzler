import * as R from "ramda";
import { Data } from "dataclass";
import { vectorEqual } from "./util";

const vectorPairString = (a) => `${a.x},${a.y}`;

export class SpriteCollection extends Data {
  sprites = [];
  spriteIndex = {};

  static fromSprites(sprites) {
    return SpriteCollection.create({
      sprites,
      spriteIndex: R.reduce(
        (acc, sprite) => ({ ...acc, [vectorPairString(sprite)]: sprite }),
        {},
        sprites,
      ),
    });
  }

  getAt(pos) {
    return this.spriteIndex[vectorPairString(pos)];
  }

  move(oldPos, newPos) {
    const newSprite = this.getAt(oldPos).moveTo(newPos);
    return SpriteCollection.fromSprites(
      this.sprites.map((s) => (vectorEqual(s, oldPos) ? newSprite : s)),
    );
  }

  removeAt(pos) {
    return SpriteCollection.fromSprites(
      this.sprites.filter((s) => !vectorEqual(s, pos)),
    );
  }

  forEach(fn) {
    this.sprites.forEach(fn);
  }
}
