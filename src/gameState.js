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
  animateQueue = [];

  static initialize(mapData, canvas) {
    const { sprites: allSprites, width: mapWidth, height: mapHeight } = mapData;
    const [[player], spriteList] = R.partition(
      (x) => x.spriteType === "player",
      allSprites,
    );
    const sprites = SpriteCollection.fromSprites(spriteList);
    const canvasOffset = getCanvasOffset(canvas, player.x, player.y);
    return GameState.create({
      player,
      sprites,
      neighbors: sprites.getNeighbors(player),
      canvas,
      ctx: canvas.getContext("2d"),
      canvasOffset,
      mapWidth,
      mapHeight,
    });
  }
}
