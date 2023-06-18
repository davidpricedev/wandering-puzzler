import * as R from "ramda";
import { grassColor, gridSize } from "./constants";

export const drawGrass = (ctx, canvasOffset, mapWidth, mapHeight) => {
  ctx.fillStyle = grassColor;
  const { x, y, width, height } = canvasOffset.translateAndScale({
    x: 0,
    y: 0,
  });
  ctx.fillRect(x, y, mapWidth * width, mapHeight * height);
};

export function drawGameOver(ctx, canvas, reason, score) {
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.font = "48px serif";
  ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
  ctx.font = "24px serif";
  ctx.fillText(reason, canvas.width / 2, canvas.height / 2 + 30);
  ctx.font = "24px serif";
  ctx.fillText(`score: ${score}`, canvas.width / 2, canvas.height / 2 + 50);
}

/**
 * center is the desired center point relative to the map (not the canvas)
 * translation needs to account for the size of the grid too, so subtract 0.5
 * to prevent make the center of the center grid cell the center of the canvas
 */
export const getCanvasOffset = (canvas, centerX, centerY) => ({
  x: canvas.width / 2,
  y: canvas.height / 2,
  gridSize,
  width: gridSize,
  height: gridSize,
  canvasWidth: canvas.width,
  canvasHeight: canvas.height,
  translateAndScale: ({ x, y }) => ({
    x: (x - centerX - 0.5) * gridSize + canvas.width / 2,
    y: (y - centerY - 0.5) * gridSize + canvas.height / 2,
    width: gridSize,
    height: gridSize,
  }),
});

export const center = (canvas) => {
  return {
    x: canvas.width / 2,
    y: canvas.height / 2,
  };
};
