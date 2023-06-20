import * as R from "ramda";
import { Sprite } from "./sprite";
import { Player } from "./player";
import { charToType, charAliases } from "./constants";
import { Data } from "dataclass";
import { Box } from "./point";

export class Map extends Data {
  sprites = [];
  maxScore = 0;
  comment = "";
  maxMoves = 0;
  bounds = null;

  /**
   * Wanderer maps have 2 extra lines at the end:
   * - a comment line
   * - a number line (maybe max moves?)
   */
  static parse(mapString) {
    const lines = mapString.trim().split("\n");
    const sprites = extractSprites(lines.slice(0, lines.length - 2));
    const height = lines.length - 2;
    const width = lines[0].length;
    const bounds = Box.create({
      left: 0,
      top: 0,
      right: width,
      bottom: height,
    });
    return Map.create({
      maxScore: sprites.reduce((acc, x) => acc + x.score, 0),
      sprites,
      bounds,
      comment: lines.at(-2),
      maxMoves: lines.at(-1),
    });
  }
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
