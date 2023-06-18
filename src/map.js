import * as R from "ramda";
import { Sprite, parseMapChar } from "./sprite";

const mapString = String.raw`
##########
# #  BS  #
#        #
# C   B C#
# \ P /  #
#        #
# CL  S  #
#        #
# CS  S  #
##########
`.trim();

export const readStaticMap = () => parseMap(mapString);

export const parseMap = (mapString) => {
  const lines = mapString.trim().split("\n");
  console.log("sprites: ", extractSprites(lines));
  return {
    sprites: extractSprites(lines),
    height: lines.length,
    width: lines[0].length,
  };
};

const extractSprites = R.pipe(
  (lines) =>
    lines.map((row, y) =>
      row.split("").map((char, x) => parseMapChar(x, y, char)),
    ),
  R.flatten,
  R.filter((x) => x !== null),
);
