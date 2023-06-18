import * as R from "ramda";
import { Sprite } from "./sprite";
import { Player } from "./player";
import { charToType } from "./constants";

const mapString = String.raw`
##########
# #   S  #
# B   B  #
# C     C#
# \ PC/  #
#        #
# CL  S  #
#        #
# CS  S  #
##########
`.trim();

export const readStaticMap = () => parseMap(mapString);

export function parseMap(mapString) {
  const lines = mapString.trim().split("\n");
  return {
    sprites: extractSprites(lines),
    height: lines.length,
    width: lines[0].length,
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
  const spriteType = charToType[char];
  if (!spriteType) {
    return null;
  }

  return spriteType === "player"
    ? Player.from(x, y)
    : Sprite.fromType(x, y, spriteType);
}
