import * as R from "ramda";
import { Data } from "dataclass";
import { getCanvasOffset } from "./framing";
import { SpriteCollection } from "./sprites";
import { Map } from "./map";
import { LEVELS } from "./maps";
import { Point, Box } from "./point";
export class GameState extends Data {
  player = null;
  sprites = null;
  canvas = null;
  ctx = null;
  canvasOffset = null;
  mapBounds = null;
  gameOver = false;
  gameOverReason = "";
  animateQueue = [];
  assets = null;
  levelName = 0;
  levelComplete = false;
  levelComment = "";
  maxScore = 0;

  static initialize(levelName, canvas, assets) {
    const mapData = Map.parse(LEVELS[levelName]);
    const {
      sprites: allSprites,
      bounds: mapBounds,
      maxScore,
      comment,
    } = mapData;
    const [[player], spriteList] = R.partition(
      (x) => x.spriteType === "player",
      allSprites,
    );
    const sprites = SpriteCollection.fromSprites(spriteList);
    const canvasOffset = getCanvasOffset(canvas, player.x, player.y);
    return GameState.create({
      levelName,
      player,
      sprites,
      canvas,
      ctx: canvas.getContext("2d"),
      canvasOffset,
      mapBounds,
      assets,
      maxScore,
      levelComment: comment,
    });
  }
}
