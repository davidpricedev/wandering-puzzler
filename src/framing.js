import * as R from "ramda";
import { grassColor } from "./constants";
import { Point, Box } from "./point";
import { drawLine } from "./grid";

export const drawGrass = (ctx, canvasOffset, mapWidth, mapHeight) => {
  ctx.fillStyle = grassColor;
  const { canvasViewport: cv } = canvasOffset;
  ctx.fillRect(cv.left, cv.top, cv.width(), cv.height());
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

export function drawBusy(ctx, canvas) {
  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.font = "12px serif";
  ctx.fillText("working...", canvas.width / 2, 20);
}

/**
 * center is the desired center point relative to the map (not the canvas)
 * translation needs to account for the size of the grid too, so subtract 0.5
 * to prevent make the center of the center grid cell the center of the canvas
 * Original game is 11 x 7, so we'll aim for that while staying square
 */
export const getCanvasOffset = (canvas, centerX, centerY) => {
  const center = getCenter(canvas);
  const gridSize = getGridSize(canvas);
  const canvasViewport = getCanvasViewport(canvas);
  return {
    center,
    gridSize,
    cellW: gridSize,
    cellH: gridSize,
    canvasWidth: canvas.width,
    canvasHeight: canvas.height,
    canvasViewport,
    mapWidth: canvasViewport.width() / gridSize,
    mapHeight: canvasViewport.height() / gridSize,
    translateAndScale: ({ x, y }) => ({
      x: (x - centerX - 0.5) * gridSize + canvas.width / 2,
      y: (y - centerY - 0.5) * gridSize + canvas.height / 2,
      width: gridSize,
      height: gridSize,
    }),
  };
};

export const getCenter = (canvas) =>
  Point.of({
    x: Math.round(canvas.width / 2),
    y: Math.round(canvas.height / 2),
  });

// Original game is 11 x 7, so we'll aim for that while staying square
export const getGridSize = (canvas) =>
  Math.min(Math.floor(canvas.width / 11), Math.floor(canvas.height / 7));

export const getCanvasViewport = (canvas) => {
  const gridSize = getGridSize(canvas);
  const center = getCenter(canvas);
  // move from center point to top left of the center box
  // then find the remainer of the division by the grid size
  const vptl = Point.of({
    x: Math.round((center.x - gridSize / 2) % gridSize),
    y: Math.round((center.y - gridSize / 2) % gridSize),
  });
  return Box.create({
    left: vptl.x,
    top: vptl.y,
    right: vptl.x + gridSize * Math.floor((canvas.width - vptl.x) / gridSize),
    bottom: vptl.y + gridSize * Math.floor((canvas.height - vptl.y) / gridSize),
  });
};

export const drawCanvasViewport = (ctx, cv) => {
  console.log("drawing cv: ", cv.left, cv.top, cv.width(), cv.height(), cv);
  ctx.strokeStyle = "red";
  ctx.strokeRect(cv.left, cv.top, cv.width(), cv.height());
};
