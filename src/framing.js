import * as R from "ramda";
import { defaultZoom, grassColor } from "./constants";
import { Point, Box } from "./point";
import { drawLine } from "./grid";

export const drawGrass = (ctx, projection) => {
  ctx.fillStyle = grassColor;
  const { clippedCanvasViewport: ccv } = projection;
  ctx.fillRect(ccv.left, ccv.top, ccv.width(), ccv.height());
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

export function drawLevelComplete(ctx, state) {
  const { canvas, score, maxScore, player, maxMoves } = state;
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.font = "48px serif";
  ctx.fillText("Level Complete", canvas.width / 2, canvas.height / 2);
  ctx.font = "24px serif";
  ctx.fillText(
    `score: ${score} / ${maxScore}`,
    canvas.width / 2,
    canvas.height / 2 + 30,
  );
  ctx.fillText(
    `moves: ${player.moves} / ${maxMoves}`,
    canvas.width / 2,
    canvas.height / 2 + 50,
  );
}

export function drawBusy(ctx, canvas) {
  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.font = "12px serif";
  ctx.fillText("working...", canvas.width / 2, 20);
}

// Need to switch to drawing lines rather than a rect and clip based on the projection
export function drawMapEdge(ctx, projection) {
  const { clippedCanvasViewport: ccv, mapBounds } = projection;
  const topLeft = projection.translateAndScale(mapBounds.topLeft());
  const bottomRight = projection.translateAndScale(mapBounds.bottomRight());
  const topRight = Point.of(bottomRight.x, topLeft.y);
  const bottomLeft = Point.of(topLeft.x, bottomRight.y);

  const edgesH = [
    { start: topLeft, end: topRight },
    { start: bottomLeft, end: bottomRight },
  ];
  const edgesV = [
    { start: topLeft, end: bottomLeft },
    { start: topRight, end: bottomRight },
  ];
  const commonProps = { ctx, bounds: ccv, color: "black", width: 5 };
  edgesH.forEach((a) => drawClampedHorizontalLine({ ...a, ...commonProps }));
  edgesV.forEach((a) => drawClampedVerticalLine({ ...a, ...commonProps }));
}

export function drawClampedHorizontalLine({
  ctx,
  start,
  end,
  bounds,
  color,
  width,
}) {
  if (start.y !== end.y) throw new Error("start and end must have same y");
  if (start.y < bounds.top || start.y > bounds.bottom) return;
  const clampedStart = Point.of(Math.max(start.x, bounds.left), start.y);
  const clampedEnd = Point.of(Math.min(end.x, bounds.right), end.y);
  console.log("drawing edgeH line: ", clampedStart, clampedEnd, bounds);
  drawLine({ ctx, start: clampedStart, end: clampedEnd, color, width });
}

export function drawClampedVerticalLine({
  ctx,
  start,
  end,
  bounds,
  color,
  width,
}) {
  if (start.x !== end.x) throw new Error("start and end must have same x");
  if (start.x < bounds.left || start.x > bounds.right) return;
  const clampedStart = Point.of(start.x, Math.max(start.y, bounds.top));
  const clampedEnd = Point.of(start.x, Math.min(end.y, bounds.bottom));
  console.log("drawing edgeV line: ", clampedStart, clampedEnd, bounds);
  drawLine({ ctx, start: clampedStart, end: clampedEnd, color, width });
}

export const drawCanvasViewport = (ctx, cv) => {
  console.log("drawing cv: ", cv.left, cv.top, cv.width(), cv.height(), cv);
  ctx.strokeStyle = "red";
  ctx.strokeRect(cv.left, cv.top, cv.width(), cv.height());
};
