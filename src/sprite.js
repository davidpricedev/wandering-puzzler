export function newSprite(x, y, char) {
  if (char === " " || char === "") return null;
  return {
    x,
    y,
    type: charToType[char],
  };
}

const charToType = {
  "#": "wall",
  P: "player",
};

const spriteTypes = {
  wall: {
    color: "grey",
  },
  player: {
    color: "red",
  },
  shrubbery: {
    color: "green",
  },
};

export function drawSprite(ctx, canvasOffset, sprite) {
  const { type } = sprite;
  ctx.fillStyle = spriteTypes[type].color;
  const { x, y, width, height } = canvasOffset.translateAndScale(sprite);
  ctx.fillRect(x, y, width, height);
}
