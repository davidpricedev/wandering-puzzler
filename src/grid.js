import * as R from "ramda";
import { gridColor } from "./constants";

export function drawGrid(ctx, canvasOffset) {
  const { cx, cy, gridSize, canvasWidth, canvasHeight } = canvasOffset;
  const halfGridSize = gridSize / 2;
  const offsetX = (cx - halfGridSize) % gridSize;
  const offsetY = (cy - halfGridSize) % gridSize;
  console.log("offsets for grid: ", offsetX, offsetY, gridSize);
  R.range(0, canvasHeight / gridSize + 1).forEach((i) => {
    // horizontal
    const y = i * gridSize + offsetY; // - halfGridSize;
    drawLine({
      ctx,
      start: { x: 0, y },
      end: { x: canvasWidth, y },
      color: gridColor,
    });
  });
  R.range(0, canvasWidth / gridSize + 1).forEach((j) => {
    // vertical
    const x = j * gridSize + offsetX; // - halfGridSize;
    drawLine({
      ctx,
      start: { x, y: 0 },
      end: { x, y: canvasHeight },
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

export function drawCenterLine(ctx, canvasOffset) {
  const { x, y, canvasWidth, canvasHeight } = canvasOffset;
  drawLine({
    ctx,
    start: { x: x, y: 0 },
    end: { x: x, y: canvasHeight },
    color: "rgba(155,0,0,0.05)",
  });
  drawLine({
    ctx,
    start: { x: 0, y: y },
    end: { x: canvasWidth, y: y },
    color: "rgba(155,0,0,0.05)",
  });
}
