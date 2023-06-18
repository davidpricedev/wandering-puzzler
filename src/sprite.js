import { Data } from "dataclass";

export function parseMapChar(x, y, char) {
  const spriteType = charToType[char];
  if (!spriteType) {
    return null;
  }

  if (spriteType === "player") {
    console.log("player: ", x, y, Player.from(x, y));
  }
  return spriteType === "player"
    ? Player.from(x, y)
    : Sprite.fromType(x, y, spriteType);
}

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

  static fromType(x, y, spriteType) {
    return Sprite.create({
      x,
      y,
      spriteType,
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

export class Player extends Sprite {
  color = "red";
  spriteType = "player";
  score = 0;
  char = "P";

  static from(x, y) {
    return Player.create({
      x,
      y,
    });
  }

  addScore(score) {
    return this.copy({ score: this.score + score });
  }
}

const charToType = {
  "#": "wall",
  P: "player",
  S: "shrubbery",
  L: "lava",
  C: "coin",
  "/": "rightLeanWall",
  "\\": "leftLeanWall",
  B: "rock",
};

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
  char: "#",
};

const attributesMap = {
  wall: wallAttributes,
  leftLeanWall: {
    ...wallAttributes,
    char: "\\",
  },
  rightLeanWall: {
    ...wallAttributes,
    char: "/",
  },
  // player: {
  //   char: "P",
  //   color: "red",
  //   score: 0,
  // },
  shrubbery: {
    char: "S",
    color: "green",
    impassible: false,
    canBeTrampled: true,
    score: 0,
  },
  lava: {
    char: "L",
    color: "orange",
    impassible: false,
    death: true,
    canBeTrampled: false,
    gameOverReason: "You fell in lava!",
  },
  coin: {
    char: "C",
    color: "yellow",
    impassible: false,
    canBeTrampled: true,
    score: 10,
  },
  rock: {
    char: "B",
    color: "brown",
    impassible: false,
    canBeTrampled: false,
  },
};
