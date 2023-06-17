import * as R from 'ramda';
import { gridColor, gridSize } from './constants';
import { gridOffset } from './util';

export function drawGrid(canvas, ctx) {
  const { x: xoffset, y: yoffset } = gridOffset(canvas);
  R.range(0, canvas.height / gridSize + 1).forEach(i => {
    drawLine({ ctx, start: { x: 0, y: i * gridSize - yoffset }, end: { x: canvas.width, y: i * gridSize - yoffset }, color: gridColor })
  });
  R.range(0, canvas.width / gridSize + 1).forEach(j => {
    drawLine({ ctx, start: { x: j * gridSize - xoffset, y: 0 }, end: { x: j * gridSize - xoffset, y: canvas.height }, color: gridColor })
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
