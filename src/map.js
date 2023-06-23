import * as R from "ramda";
import { Sprite } from "./sprite";
import { Player } from "./player";
import { charToType, charAliases } from "./constants";
import { Data } from "dataclass";
import { Box, Point } from "./point";

export class Map extends Data {
  sprites = [];
  maxScore = 0;
  comment = "";
  maxMoves = 0;
  bounds = null;

  /**
   * Wanderer maps have 2 extra lines at the end:
   * - a comment line
   * - a number line (maybe max moves?)
   */
  static parse(mapString) {
    const lines = mapString.trim().split("\n");
    const sprites = extractSprites(lines);
    const height = lines.length - 2;
    const width = lines[0].length;
    const bounds = Box.create({
      left: 0,
      top: 0,
      right: width,
      bottom: height,
    });
    return Map.create({
      maxScore: sprites.reduce((acc, x) => acc + x.score, 0),
      sprites,
      bounds,
      comment: lines.at(-2),
      maxMoves: lines.at(-1),
    });
  }
}

const extractSprites = R.pipe(
  (lines) => lines.slice(0, lines.length - 2),
  (lines) =>
    lines.map((row, y) =>
      row.split("").map((char, x) => parseMapChar(x, y, char)),
    ),
  R.flatten,
  R.filter((x) => x !== null),
  applySupportCheck,
);

// Probably a bit slow - currently O(n^2)
// could index it or maybe use the raw map lines if needed
function applySupportCheck(sprites) {
  return sprites.map((sprite) => {
    if (!sprite.isMobile) {
      return sprite;
    }

    const supportSprite = getSupportedBy(sprites, sprite);
    return supportSprite
      ? sprite.copy({ supportedBy: Point.of(supportSprite) })
      : sprite;
  });
}

function parseMapChar(x, y, char) {
  const realChar = charAliases[char];
  const spriteType = charToType[realChar || char];
  if (!spriteType) {
    return null;
  }

  return spriteType === "player"
    ? Player.from(x, y)
    : Sprite.fromType(x, y, spriteType);
}

export const motionTable = {
  rock: Point.down(),
  rightArrow: Point.right(),
  leftArrow: Point.left(),
};

function getSupportedBy(sprites, sprite) {
  const supportPos = motionTable[sprite.spriteType].add(sprite);
  const supportSprite = sprites.find((s) => supportPos.equals(s));
  // Easy case, we are supported directly
  if (
    !supportSprite ||
    !["leftLeanWall", "rightLeanWall"].includes(supportSprite.spriteType)
  ) {
    return supportSprite;
  }

  // Supported by a leaning wall, so need to check other directions too...
  return getIndirectSupportedBy(sprites, sprite, supportSprite);
}

const getIndirectSupportedBy = (sprites, sprite, directSupport) => {
  if (sprite.spriteType !== "rock") {
    // deal with arrows later
    return directSupport;
  }

  return getIndirectRockSupportedBy(sprites, sprite, directSupport);
};

const getIndirectRockSupportedBy = (sprites, sprite, directSupport) => {
  if (directSupport.spriteType === "leftLeanWall") {
    const rightSupport = sprites.find((s) =>
      Point.right().add(sprite).equals(s),
    );
    if (rightSupport) {
      return rightSupport;
    } else {
      return sprites.find((s) => Point.downRight().add(sprite).equals(s));
    }
  }

  if (directSupport.spriteType === "rightLeanWall") {
    const leftSupport = sprites.find((s) => Point.left().add(sprite).equals(s));
    if (leftSupport) {
      return leftSupport;
    } else {
      return sprites.find((s) => Point.downLeft().add(sprite).equals(s));
    }
  }
};
