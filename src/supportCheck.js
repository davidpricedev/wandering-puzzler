import { Point } from "./point.js";

const supportTable = {
  leftArrow: {
    direct: Point.left(),
    leftLeanWall: [Point.up(), Point.upLeft()],
    rightLeanWall: [Point.down(), Point.downLeft()],
  },
  rightArrow: {
    direct: Point.right(),
    leftLeanWall: [Point.down(), Point.downRight()],
    rightLeanWall: [Point.up(), Point.upRight()],
  },
  rock: {
    direct: Point.down(),
    leftLeanWall: [Point.right(), Point.downRight()],
    rightLeanWall: [Point.left(), Point.downLeft()],
  },
};

export function getSupportedBy(sprites, sprite) {
  const supportPos = supportTable[sprite.spriteType]["direct"].add(sprite);
  const supportSprite = sprites.find((s) => supportPos.equals(s));
  // Easy case, we are supported directly
  if (
    !supportSprite ||
    !["leftLeanWall", "rightLeanWall"].includes(supportSprite.spriteType)
  ) {
    return supportSprite;
  }

  // Supported by a leaning wall, so need to check other directions too...
  return getIndirectSupport(sprites, sprite, supportSprite);
}

function getIndirectSupport(sprites, sprite, directSupport) {
  const indirectSupports = supportTable[sprite.spriteType][
    directSupport.spriteType
  ].map((p) => p.add(sprite));
  return indirectSupports.find((p) => sprites.find((s) => p.equals(s)));
}
