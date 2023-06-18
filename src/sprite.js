import * as R from "ramda";
import { Data } from "dataclass";
import { charToType } from "./constants";
import { Point } from "./point";

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

  static fromType(x, y, spriteType) {
    return Sprite.create({
      x,
      y,
      spriteType,
      char: R.invertObj(charToType)[spriteType],
      ...attributesMap[spriteType],
    });
  }

  draw(ctx, canvasOffset) {
    drawSquare(ctx, canvasOffset, this);
  }

  moveTo(pos) {
    return this.copy({ x: pos.x, y: pos.y });
  }

  isRock() {
    return this.spriteType === "rock";
  }

  isArrow() {
    return ["leftArrow", "rightArrow"].includes(this.spriteType);
  }
}

/** Start witt really bad graphics, and add some proper svgs in later */
const drawSquare = (ctx, canvasOffset, sprite) => {
  const { color, char } = sprite;
  ctx.fillStyle = color;
  const { x, y, width, height } = canvasOffset.translateAndScale(sprite);
  ctx.fillRect(x, y, width, height);
  ctx.font = "10px serif";
  ctx.textAlign = "center";
  ctx.fillStyle = "#DDD";
  ctx.fillText(
    char,
    x + canvasOffset.gridSize * 0.5,
    y + canvasOffset.gridSize * 0.85,
  );
};

const wallAttributes = {
  color: "grey",
  impassible: true,
  allowedFlows: [],
};
const arrowAttributes = {
  color: "pink",
  isMobile: true,
  allowedFlows: [],
};

const attributesMap = {
  wall: wallAttributes,
  leftLeanWall: {
    ...wallAttributes,
    allowedFlows: [Point.upLeft(), Point.downRight()],
  },
  rightLeanWall: {
    ...wallAttributes,
    allowedFlows: [Point.upRight(), Point.downLeft()],
  },
  shrubbery: {
    color: "green",
    canBeTrampled: true,
    score: 0,
    allowedFlows: [],
  },
  lava: {
    color: "orange",
    death: true,
    gameOverReason: "You fell in lava!",
    allowedFlows: [],
  },
  coin: {
    color: "yellow",
    canBeTrampled: true,
    score: 10,
  },
  rock: {
    color: "brown",
    isMobile: true,
  },
  leftArrow: arrowAttributes,
  rightArrow: arrowAttributes,
};
