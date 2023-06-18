import * as R from "ramda";
import { gridColor } from "./constants";

export function drawGrid(ctx, canvasOffset) {
  const {
    x: canvasOffsetX,
    y: canvasOffsetY,
    gridSize,
    canvasWidth,
    canvasHeight,
  } = canvasOffset;
  const offsetX = canvasOffsetX % gridSize;
  const offsetY = canvasOffsetY % gridSize;
  R.range(0, canvasHeight / gridSize + 1).forEach((i) => {
    drawLine({
      ctx,
      start: { x: 0, y: i * gridSize - offsetY },
      end: { x: canvasWidth, y: i * gridSize - offsetY },
      color: gridColor,
    });
  });
  R.range(0, canvasWidth / gridSize + 1).forEach((j) => {
    drawLine({
      ctx,
      start: { x: j * gridSize - offsetX, y: 0 },
      end: { x: j * gridSize - offsetX, y: canvasHeight },
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
