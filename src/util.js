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

export const canvasOffset = (canvas) => ({
  x: (canvas.width / 2),
  y: (canvas.height / 2),
  gridSize,
  width: gridSize,
  height: gridSize,
  translateAndScale: ({x, y}) => ({
    x: x * gridSize + canvas.width / 2,
    y: y * gridSize + canvas.height / 2,
    width: gridSize,
    height: gridSize,
  }),
});
