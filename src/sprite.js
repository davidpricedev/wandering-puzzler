import * as R from "ramda";
import { Data } from "dataclass";
import { charToType, wallColor } from "./constants";
import { Point } from "./point";
import {
  drawImage,
  drawSquare,
  drawLeaningWallTile,
  drawWallTile,
  drawLeftArrowTile,
  drawRightArrowTile,
} from "./canvas";
import { getSupportedBy } from "./supportCheck";

export class Sprite extends Data {
  x = 0;
  y = 0;
  spriteType = "?";
  color = "black";
  impassible = false;
  canBeTrampled = false;
  char = "?";
  score = 0;
  death = false;
  gameOverReason = "";
  isMobile = false;
  allowedFlows = [
    Point.upLeft(),
    Point.upRight(),
    Point.downLeft(),
    Point.downRight(),
  ];
  drawSprite = null;
  supportedBy = null;
  hasMoved = false;

  static fromType(x, y, spriteType) {
    return Sprite.create({
      x,
      y,
      spriteType,
      char: R.invertObj(charToType)[spriteType],
      ...attributesMap[spriteType],
    });
  }

  draw(ctx, projection, assets) {
    if (this.drawSprite) {
      this.drawSprite(ctx, projection, assets, this);
    } else if (assets[this.spriteType]) {
      drawImage(ctx, projection, assets[this.spriteType], this);
    } else {
      drawSquare(ctx, projection, this);
    }
  }

  moveTo(pos) {
    return this.copy({ x: pos.x, y: pos.y, hasMoved: true });
  }

  isRock() {
    return this.spriteType === "rock";
  }

  isArrow() {
    return ["leftArrow", "rightArrow"].includes(this.spriteType);
  }

  hasSupport(sprites) {
    return this.supportedBy && sprites.getAt(this.supportedBy);
  }

  setSupport(sprites) {
    return this.copy({ supportedBy: getSupportedBy(sprites, this) });
  }
}

const wallAttributes = {
  color: wallColor,
  impassible: true,
  allowedFlows: [],
  drawSprite: drawLeaningWallTile,
};
const arrowAttributes = {
  isMobile: true,
  allowedFlows: [],
};

const attributesMap = {
  wall: {
    ...wallAttributes,
    drawSprite: drawWallTile,
  },
  leftLeanWall: {
    ...wallAttributes,
    allowedFlows: [Point.upLeft(), Point.downRight()],
  },
  rightLeanWall: {
    ...wallAttributes,
    allowedFlows: [Point.upRight(), Point.downLeft()],
  },
  shrubbery: {
    canBeTrampled: true,
    score: 0,
    allowedFlows: [],
  },
  cactus: {
    death: true,
    gameOverReason: "You got too close to a bomb!",
    allowedFlows: [],
  },
  coin: {
    canBeTrampled: true,
    score: 10,
  },
  rock: {
    isMobile: true,
  },
  leftArrow: { ...arrowAttributes, drawSprite: drawLeftArrowTile },
  rightArrow: { ...arrowAttributes, drawSprite: drawRightArrowTile },
  exit: {
    allowedFlows: [],
  },
};
