import * as R from "ramda";
import { newSprite } from "./sprite";

const mapString = `
##########
# #      #
#        #
#        #
#   P    #
#        #
#        #
#        #
#        #
##########
`.trim();

export const readStaticMap = () => map(mapString);

export const map = (mapString) => {
  const lines = mapString.trim().split("\n");
  return {
    sprites: extractSprites(lines),
    height: lines.length,
    width: lines[0].length,
  };
};

const extractSprites = R.pipe(
  lines => lines.map((row, y) => row.split("").map((char, x) => newSprite(x, y, char))),
  R.flatten,
  R.filter(x => x !== null),
);
