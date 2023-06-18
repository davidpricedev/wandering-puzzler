import * as R from "ramda";
import { Data } from "dataclass";
import { charToType } from "./constants";

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
  canBeTrampled: false,
};

const attributesMap = {
  wall: wallAttributes,
  leftLeanWall: wallAttributes,
  rightLeanWall: wallAttributes,
  shrubbery: {
    color: "green",
    impassible: false,
    canBeTrampled: true,
    score: 0,
  },
  lava: {
    color: "orange",
    impassible: false,
    death: true,
    canBeTrampled: false,
    gameOverReason: "You fell in lava!",
  },
  coin: {
    color: "yellow",
    impassible: false,
    canBeTrampled: true,
    score: 10,
  },
  rock: {
    color: "brown",
    impassible: false,
    canBeTrampled: false,
    isMobile: true,
  },
};
