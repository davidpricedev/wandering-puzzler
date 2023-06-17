export function newSprite(x, y, char) {
  if (char === " " || char === "") return null;
  const type = charToType[char];
  return {
    x,
    y,
    type,
    ...attributesMap[type],
  };
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
  player: {
    char: "P",
    color: "red",
    score: 0,
  },
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

export function drawSprite(ctx, canvasOffset, sprite) {
  const { draw = drawSquare } = sprite;
  draw(ctx, canvasOffset, sprite);
}
