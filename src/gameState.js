import * as R from "ramda";
import { Data } from "dataclass";
import { SpriteCollection } from "./sprites";
import { Map } from "./map";
import { LEVELS } from "./maps";
import { Point, Box } from "./point";
import { defaultZoom } from "./constants";
import { Projection } from "./projection";

export class GameState extends Data {
  setState = null;
  mapData = null;
  player = null;
  sprites = null;
  canvas = null;
  ctx = null;
  projection = null;
  mapBounds = null;
  gameOver = false;
  levelComplete = false;
  levelStart = true;
  gameOverReason = "";
  animateQueue = [];
  assets = null;
  levelName = 0;
  levelComplete = false;
  levelComment = "";
  maxScore = 0;
  zoom = null;
  levelNumber = 0;
  oldPlayerPos = null;
  movedSprite = null;

  static initialize(setState, levelNumber, canvas, assets) {
    const { name: levelName, map: mapString } = LEVELS[levelNumber];
    const mapData = Map.parse(mapString);
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
    console.log("[init] Player: ", player);
    const sprites = SpriteCollection.fromSprites(spriteList);
    const zoom = defaultZoom;
    const projection = Projection.buildOnCenter(
      canvas,
      mapBounds,
      zoom,
      player,
    );
    return GameState.create({
      setState,
      mapData,
      mapBounds,
      levelName,
      player,
      sprites,
      canvas,
      ctx: canvas.getContext("2d"),
      projection,
      assets,
      maxScore,
      levelComment: comment,
      zoom,
      levelNumber,
    });
  }
}
