import * as R from "ramda";
import { Sprite } from "./sprite";
import { Player } from "./player";
import { charToType, charAliases } from "./constants";

/**
 * Wanderer maps have 2 extra lines at the end:
 * - a comment line
 * - a number line (maybe moves remaining?)
 */
export function parseMap(mapString) {
  const lines = mapString.trim().split("\n");
  const sprites = extractSprites(lines.slice(0, lines.length - 2));
  return {
    maxScore: sprites.reduce((acc, x) => acc + x.score, 0),
    sprites,
    height: lines.length - 2,
    width: lines[0].length,
    comment: lines.at(-2),
    num: lines.at(-1),
  };
}

const extractSprites = R.pipe(
  (lines) =>
    lines.map((row, y) =>
      row.split("").map((char, x) => parseMapChar(x, y, char)),
    ),
  R.flatten,
  R.filter((x) => x !== null),
);

function parseMapChar(x, y, char) {
  const realChar = charAliases[char];
  const spriteType = charToType[realChar || char];
  if (!spriteType) {
    return null;
  }

  return spriteType === "player"
    ? Player.from(x, y)
    : Sprite.fromType(x, y, spriteType);
}
