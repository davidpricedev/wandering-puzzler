import * as R from "ramda";
import { Data } from "dataclass";
import { SpriteCollection } from "./sprites";
import { Map } from "./map";
import { LEVELS } from "./maps";
import { Point, Box } from "./point";
import { defaultZoom } from "./constants";
import { Projection } from "./projection";

export class LevelState extends Data {
  setState = null;
  mapData = null;
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
  // oldPlayerPos = null;
  movedSprites = [];

  static initialize(setState, levelNumber, canvas, assets) {
    console.log("Levels: ", LEVELS);
    console.log("Level Number: ", levelNumber);
    const { name: levelName, map: mapString } = LEVELS[levelNumber];
    const mapData = Map.parse(mapString);
    const {
      sprites: allSprites,
      bounds: mapBounds,
      maxScore,
      comment,
    } = mapData;
    const sprites = SpriteCollection.fromSprites(allSprites);
    const zoom = defaultZoom;
    const projection = Projection.buildOnCenter(
      canvas,
      mapBounds,
      zoom,
      sprites.getPlayer(),
    );
    return LevelState.create({
      setState,
      mapData,
      mapBounds,
      levelName,
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
