import * as R from "ramda";
import { grassColor, gridColor, gridSize } from "./constants";

export function drawGrid(ctx, canvasOffset) {
  const offset = {
    x: canvasOffset.x % canvasOffset.gridSize,
    y: canvasOffset.y % canvasOffset.gridSize,
  };
  R.range(0, canvas.height / gridSize + 1).forEach((i) => {
    console.log("drawing V line", i, gridSize, offset.x, offset.y);
    drawLine({
      ctx,
      start: { x: 0, y: i * gridSize - offset.y },
      end: { x: canvas.width, y: i * gridSize - offset.y },
      color: gridColor,
    });
  });
  R.range(0, canvas.width / gridSize + 1).forEach((j) => {
    drawLine({
      ctx,
      start: { x: j * gridSize - offset.x, y: 0 },
      end: { x: j * gridSize - offset.x, y: canvas.height },
      color: gridColor,
    });
  });
}

export function drawLine({ ctx, start, end, color }) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();
}

export const drawGrass = (ctx, canvasOffset, mapWidth, mapHeight) => {
  ctx.fillStyle = grassColor;
  const { x, y, width, height } = canvasOffset.translateAndScale({
    x: 0,
    y: 0,
  });
  ctx.fillRect(x, y, mapWidth * width, mapHeight * height);
};

export function drawGameOver(ctx, canvas) {
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = "48px serif";
  ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
}
