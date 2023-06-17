import * as R from "ramda";
import { grassColor, gridColor } from "./constants";

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
    color: "red",
  });
  drawLine({
    ctx,
    start: { x: 0, y: y },
    end: { x: canvasWidth, y: y },
    color: "red",
  });
}

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
