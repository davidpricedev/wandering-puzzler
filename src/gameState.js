import * as R from "ramda";
import { Data } from "dataclass";
import { getCanvasOffset } from "./framing";
import { SpriteCollection } from "./sprites";

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
  neighbors = null;

  static initialize(mapData, canvas) {
    const { sprites: allSprites, width: mapWidth, height: mapHeight } = mapData;
    const [[player], sprites] = R.partition(
      (x) => x.spriteType === "player",
      allSprites,
    );
    const canvasOffset = getCanvasOffset(canvas, player.x, player.y);
    return GameState.create({
      player,
      sprites: SpriteCollection.fromSprites(sprites),
      canvas,
      ctx: canvas.getContext("2d"),
      canvasOffset,
      mapWidth,
      mapHeight,
    });
  }
}
