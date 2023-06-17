import { gridSize } from "./constants";

export const center = (canvas) => {
  return {
    x: canvas.width / 2,
    y: canvas.height / 2,
  };
};

/**
 * center is the desired center point relative to the map (not the canvas)
 * translation needs to account for the size of the grid too, so subtract 0.5
 * to prevent make the center of the center grid cell the center of the canvas
 */
export const canvasOffset = (canvas, centerX, centerY) => ({
  x: canvas.width / 2,
  y: canvas.height / 2,
  gridSize,
  width: gridSize,
  height: gridSize,
  canvasWidth: canvas.width,
  canvasHeight: canvas.height,
  translateAndScale: ({ x, y }) => ({
    x: (x - centerX - 0.5) * gridSize + canvas.width / 2,
    y: (y - centerY - 0.5) * gridSize + canvas.height / 2,
    width: gridSize,
    height: gridSize,
  }),
});
