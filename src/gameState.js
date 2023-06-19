import * as R from "ramda";
import { Data } from "dataclass";
import { getCanvasOffset } from "./framing";
import { SpriteCollection } from "./sprites";
import { parseMap } from "./map";
import { LEVELS } from "./maps";
import { Point, Box } from "./point";
export class GameState extends Data {
  player = null;
  sprites = null;
  canvas = null;
  ctx = null;
  canvasOffset = null;
  mapWidth = 0;
  mapHeight = 0;
  gameOver = false;
  gameOverReason = "";
  animateQueue = [];
  assets = null;
  levelName = 0;
  levelComplete = false;
  levelComment = "";
  maxScore = 0;
  mapViewport = null;

  static initialize(levelName, canvas, assets) {
    const mapData = parseMap(LEVELS[levelName]);
    const { sprites: allSprites, width, height, maxScore, comment } = mapData;
    const [[player], spriteList] = R.partition(
      (x) => x.spriteType === "player",
      allSprites,
    );
    const sprites = SpriteCollection.fromSprites(spriteList);
    const canvasOffset = getCanvasOffset(canvas, player.x, player.y);
    const mapViewport = Box.fromCenter(
      Point.of(player),
      canvasOffset.mapWidth / 2,
      canvasOffset.mapHeight / 2,
    );
    return GameState.create({
      levelName,
      player,
      sprites,
      canvas,
      ctx: canvas.getContext("2d"),
      canvasOffset,
      mapWidth: width,
      mapHeight: height,
      assets,
      maxScore,
      levelComment: comment,
      mapViewport,
    });
  }
}
