import * as R from "ramda";
import { Data } from "dataclass";
import { charToType, wallColor } from "./constants";
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
  drawSprite = null;

  static fromType(x, y, spriteType) {
    return Sprite.create({
      x,
      y,
      spriteType,
      char: R.invertObj(charToType)[spriteType],
      ...attributesMap[spriteType],
    });
  }

  draw(ctx, canvasOffset, assets) {
    if (this.drawSprite) {
      this.drawSprite(ctx, canvasOffset, assets, this);
    } else if (assets[this.spriteType]) {
      drawImage(ctx, canvasOffset, assets[this.spriteType], this);
    } else {
      drawSquare(ctx, canvasOffset, this);
    }
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
  ctx.font = `${width}px serif`;
  ctx.textAlign = "center";
  ctx.fillStyle = "#DDD";
  ctx.fillText(char, x + width * 0.5, y + height * 0.85);
};

export const drawImage = (ctx, canvasOffset, image, sprite) => {
  const { x, y, width, height } = canvasOffset.translateAndScale(sprite);
  ctx.drawImage(
    image, // 0, 0, image.width, image.height,
    x,
    y,
    width,
    height,
  );
};

const wallAttributes = {
  color: wallColor,
  impassible: true,
  allowedFlows: [],
  drawSprite: drawLeaningWallTile,
};
const arrowAttributes = {
  color: "pink",
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
    color: "green",
    canBeTrampled: true,
    score: 0,
    allowedFlows: [],
  },
  cactus: {
    color: "orange",
    death: true,
    gameOverReason: "You got too close to a bomb!",
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
  leftArrow: { ...arrowAttributes, drawSprite: drawLeftArrowTile },
  rightArrow: { ...arrowAttributes, drawSprite: drawRightArrowTile },
};

function drawWallTile(ctx, canvasOffset, assets, sprite) {
  const { color } = sprite;
  ctx.fillStyle = color;
  const { x, y, width, height } = canvasOffset.translateAndScale(sprite);
  ctx.fillRect(x, y, width, height);
  ctx.drawImage(assets.wall, x, y, width, height);
}

function drawLeftArrowTile(ctx, canvasOffset, assets, sprite) {
  const scaley = 1 / 3;
  const { x, y, width, height } = canvasOffset.translateAndScale(sprite);
  ctx.drawImage(
    assets.arrow,
    x,
    y + height * (0.5 - scaley / 2),
    width,
    height * scaley,
  );
}

function drawRightArrowTile(ctx, canvasOffset, assets, sprite) {
  const { x, y, width, height } = canvasOffset.translateAndScale(sprite);
  ctx.save();
  ctx.scale(-1, 1);
  // ctx.translate(-sprite.x, sprite.y);
  ctx.drawImage(
    assets.arrow,
    // 0, 0, assets.arrow.width, assets.arrow.height,
    -x - width,
    y + height / 3,
    width,
    height / 3,
  );
  ctx.restore();
}

function drawLeaningWallTile(ctx, canvasOffset, assets, sprite) {
  const { char } = sprite;
  const { x, y, width, height } = canvasOffset.translateAndScale(sprite);
  ctx.drawImage(
    getLeaningWallImage(sprite.spriteType, width, assets["wall"]),
    x,
    y,
    width,
    height,
  );
}

function getLeaningWallImage(spriteType, scale, image) {
  const scratch = document.createElement("canvas");
  scratch.width = scale;
  scratch.height = scale;
  const ctx = scratch.getContext("2d");
  ctx.fillStyle = wallColor;
  ctx.translate(scale / 2, scale / 2);
  ctx.rotate(spriteType === "leftLeanWall" ? -Math.PI / 4 : Math.PI / 4);
  ctx.translate(-scale / 2, -scale / 2);
  const x = (scale * 3) / 8;
  const w = scale / 4;
  ctx.fillRect(x, -50, w, scale + 300);
  ctx.drawImage(image, x, -50, w, scale + 300);
  ctx.restore();
  return scratch;
}
