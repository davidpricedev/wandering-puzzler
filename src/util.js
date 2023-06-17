import { gridSize } from "./constants";

export const center = (canvas) => {
  return {
    x: canvas.width / 2,
    y: canvas.height / 2,
  };
};

export const gridOffset = (canvas) => ({
  x: (canvas.width / 2) % gridSize,
  y: (canvas.height / 2) % gridSize,
});

export const canvasOffset = (canvas, centerX, centerY) => ({
  x: (canvas.width / 2) - centerX,
  y: (canvas.height / 2),
  gridSize,
  width: gridSize,
  height: gridSize,
  translateAndScale: ({x, y}) => ({
    x: (x - centerX) * gridSize + canvas.width / 2,
    y: (y - centerY) * gridSize + canvas.height / 2,
    width: gridSize,
    height: gridSize,
  }),
});
