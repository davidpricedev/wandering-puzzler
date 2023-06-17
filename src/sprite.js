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
};

const attributesMap = {
  wall: {
    color: "grey",
    impassible: true,
    canBeTrampled: false,
  },
  player: {
    color: "red",
  },
  shrubbery: {
    color: "green",
    impassible: false,
    canBeTrampled: true,
  },
  lava: {
    color: "orange",
    impassible: false,
    death: true,
    canBeTrampled: false,
  },
};

export function drawSprite(ctx, canvasOffset, sprite) {
  const { color } = sprite;
  ctx.fillStyle = color;
  const { x, y, width, height } = canvasOffset.translateAndScale(sprite);
  ctx.fillRect(x, y, width, height);
}
