export function newPlayer(x, y) {
  return {
    x,
    y,
  };
}

export function drawPlayer(ctx, canvasOffset, player) {
  ctx.fillStyle = "red";
  const {x, y, width, height} = canvasOffset.translateAndScale(player);
  ctx.fillRect(x, y, width, height);
};
