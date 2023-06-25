import * as R from "ramda";
import { gridColor } from "../constants";

export function drawGrid(ctx, projection) {
  const { cellW, cellH, canvasW, canvasH, mapViewport: mv } = projection;
  const { x: offsetX, y: offsetY } = projection.translateAndScale(mv.topLeft());
  R.range(0, canvasH / cellH + 1).forEach((i) => {
    // horizontal
    const y = i * cellH + offsetY;
    drawLine({
      ctx,
      start: { x: 0, y },
      end: { x: canvasW, y },
      color: gridColor,
    });
  });
  R.range(0, canvasW / cellW + 1).forEach((j) => {
    // vertical
    const x = j * cellW + offsetX;
    drawLine({
      ctx,
      start: { x, y: 0 },
      end: { x, y: canvasH },
      color: gridColor,
    });
  });
}

export function drawLine({ ctx, start, end, color, width = 1 }) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();
}

export function drawCenterLine(ctx, projection) {
  const { canvasCenter, canvasW, canvasH, cellW, cellH } = projection;
  drawLine({
    ctx,
    start: { x: canvasCenter.x, y: 0 },
    end: { x: canvasCenter.x, y: canvasH },
    color: "rgba(155,0,0,0.07)",
  });
  drawLine({
    ctx,
    start: { x: 0, y: canvasCenter.y },
    end: { x: canvasW, y: canvasCenter.y },
    color: "rgba(155,0,0,0.07)",
  });
}
