import * as R from "ramda";
import { directionMap, gridSize } from "./constants";

export const center = (canvas) => {
  return {
    x: canvas.width / 2,
    y: canvas.height / 2,
  };
};

export const vectorAdd = (a, b) => ({
  x: a.x + b.x,
  y: a.y + b.y,
});

export const vectorScale = (a, scalar) => ({
  x: a.x * scalar,
  y: a.y * scalar,
});

export const vectorEqual = (a, b) => a?.x === b?.x && a?.y === b?.y;

export function getNeighboringSprites(player, sprites) {
  return Object.values(directionMap)
    .map((d) => sprites.getAt(vectorAdd(player, d)))
    .filter(R.identity);
}
