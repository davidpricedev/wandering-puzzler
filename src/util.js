import * as R from "ramda";
import { directionMap, gridSize } from "./constants";

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

export const vectorAdd = (a, b) => ({
  x: a.x + b.x,
  y: a.y + b.y,
});

export const vectorScale = (a, scalar) => ({
  x: a.x * scalar,
  y: a.y * scalar,
});

export const vectorPairString = (a) => `${a.x},${a.y}`;

export const vectorEqual = (a, b) => a?.x === b?.x && a?.y === b?.y;

export function getNeighboringSprites(player, spriteIndex) {
  // const neighbors = [
  //   `${player.x},${player.y - 1}`,
  //   `${player.x},${player.y + 1}`,
  //   `${player.x - 1},${player.y}`,
  //   `${player.x + 1},${player.y}`,
  // ];
  const neighbors = Object.values(directionMap).map(
    (x) => `${player.x + x.x},${player.y + x.y}`,
  );
  return R.pick(neighbors, spriteIndex);
}
