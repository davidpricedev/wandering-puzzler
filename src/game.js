import * as R from "ramda";
import { drawGrid, drawCenterLine } from "./canvas/drawGrid";
import {
  drawGrass,
  drawGameOver,
  drawBusy,
  drawMapEdge,
  drawLevelComplete,
  drawLevelStart,
  loadAssets,
} from "./canvas";
import { handleKeys, keyboardSetup, subscribe } from "./keyboard";
import {
  cardinalDirectionMap,
  fastTickInterval,
  tickInterval,
  zoomChange,
} from "./constants";
import { LevelState } from "./levelState";
import { movePlayer } from "./playerMove";
import { Box, Point } from "./point";
import { animateArrow } from "./arrowMove";
import { animateRock } from "./rockMove";
import { LEVELS } from "./maps/index";

export async function runGame(canvas, scoreSpan, restartButton) {
  const assets = await loadAssets();
  let state;

  const setState = (stateChangeFn) => {
    state = R.pipe(
      stateChangeFn,
      // inspect("stateChangeFn"),
      handleProximityChecks(state),
      handleMapEdge(state),
      handleMovingViewport(state),
    )(state);
    drawGame(state);
    scoreSpan.textContent = state.sprites.getPlayer().score;
    handleNextAnimation(state);
  };

  state = LevelState.initialize(setState, 7, canvas, assets);

  keyboardSetup();
  drawGame(state);
  const removeSubscription = subscribe(handleKeys(handleMovement(setState)));
  restartButton.onclick = restartGame(setState);
}

function drawGame({
  sprites,
  canvas,
  ctx,
  projection,
  levelName,
  gameOver,
  mapData,
  levelComplete,
  levelStart,
  gameOverReason,
  assets,
  animateQueue,
}) {
  const player = sprites.getPlayer();
  ctx.reset();
  drawGrass(ctx, projection);
  drawGrid(ctx, projection);
  sprites
    .filterToViewport(projection.mapViewport)
    .forEach((s) => s.draw(ctx, projection, assets));
  // drawCanvasViewport(ctx, projection.canvasViewport);
  // drawCenterLine(ctx, projection);
  if (animateQueue.length > 0) {
    drawBusy(ctx, canvas);
  }
  if (gameOver) {
    drawGameOver(ctx, canvas, gameOverReason, player.score);
  }
  if (levelComplete) {
    drawLevelComplete({
      ctx,
      canvas,
      score: player.score,
      maxScore: mapData.maxScore,
      moves: player.moves,
      maxMoves: mapData.maxMoves,
    });
  }
  if (levelStart) {
    drawLevelStart(ctx, canvas, levelName, mapData.comment);
  }

  drawMapEdge(ctx, projection);
}

const restartGame = (setState) => () => {
  setState((old) =>
    LevelState.initialize(setState, old.levelNumber, old.canvas, old.assets),
  );
};

const handleMovement = (setState) => (type, commandType) => {
  if (type !== "keydown") {
    return;
  }

  const direction = cardinalDirectionMap[commandType];
  const handleMove = () =>
    setState((old) => {
      if (old.levelStart) {
        return old.copy({ levelStart: false });
      }

      return old.copy(movePlayer(old, setState, direction));
    });
  const directionTable = {
    restart: restartGame(setState),
    up: handleMove,
    down: handleMove,
    left: handleMove,
    right: handleMove,
    zoomIn: handleZoom(setState, zoomChange.scale(-1)),
    zoomOut: handleZoom(setState, zoomChange),
    space: handleSpacebar(setState),
  };
  directionTable[commandType]();
};

/**
 * prevent player from walking off the map
 */
const handleMapEdge = (oldState) => (newState) => {
  const { sprites, mapBounds } = newState;
  return mapBounds.containsPoint(sprites.getPlayer()) ? newState : oldState;
};

/**
 * recenter the map viewport on the player when the player is near the edge
 */
const handleMovingViewport = (oldState) => (newState) => {
  const { sprites, projection } = newState;
  const player = sprites.getPlayer();
  const mv = projection.mapViewport;
  if (
    player.x - mv.left < 1 ||
    mv.right - player.x < 1 ||
    player.y - mv.top < 1 ||
    mv.bottom - player.y < 1
  ) {
    return newState.copy({
      projection: projection.recenter(player),
    });
  }

  return newState;
};

/**
 * Animate each of the 3 cardinal directions we were adjacent to previously
 */
const handleProximityChecks = (oldState) => (newState) => {
  const { sprites, movedSprites, animateQueue } = newState;
  const spriteNeighbors = movedSprites.flatMap((sprite) =>
    sprite.spriteType === "player"
      ? getNeighborsOfMovedPlayer(sprites, sprite).concat(
          getNeighborsOfMovedSprite(sprites, sprite),
        )
      : getNeighborsOfMovedSprite(sprites, sprite),
  );

  const newAnimateQueue = [...animateQueue, ...spriteNeighbors];
  return newState.copy({
    animateQueue: newAnimateQueue,
    movedSprites: [],
  });
};

/**
 * player walking by an unsupported mobile sprite will jostle it - triggering it to move
 * strip off the support for moving sprites
 */
function getNeighborsOfMovedPlayer(sprites, oldPlayerPos) {
  return sprites
    .getCardinalNeighbors(oldPlayerPos)
    .filter(isTriggeredByPlayerProximity(sprites))
    .map((s) => s.copy({ supportedBy: null }));
}

/**
 * a change in sprite might remove support from another sprite - triggering it to move
 * strip off the support for moving sprites
 */
function getNeighborsOfMovedSprite(sprites, oldPos) {
  return sprites
    .getAllNeighbors(oldPos)
    .filter(isTriggeredBySpriteChange(sprites, oldPos))
    .map((s) => s.copy({ supportedBy: null }));
}

const isTriggeredByPlayerProximity = (sprites) => (sprite) => {
  // filter out player themselves and non-mobile sprites
  if (!sprite.isMobile || sprite.spriteType === "player") {
    return false;
  }

  // true if sprite is not supported by anything or if support no longer exists
  return !sprite.supportedBy || !sprites.getAt(sprite.supportedBy);
};

const isTriggeredBySpriteChange = (sprites, oldPos) => (sprite) =>
  sprite.supportedBy &&
  Point.of(oldPos).equals(sprite.supportedBy) &&
  !sprites.getAt(oldPos);

const handleZoom = (setState, direction) => () => {
  setState((old) => {
    const zoom = old.zoom.add(direction);
    if (zoom.x <= 7 || zoom.y <= 5) {
      return old;
    }

    return old.copy({
      zoom,
      projection: old.projection.zoomTo(zoom),
    });
  });
};

const handleSpacebar = (setState) => () => {
  setState((old) => {
    if (old.levelStart) {
      return old.copy({ levelStart: false });
    } else if (old.levelComplete && LEVELS.length > old.levelNumber + 1) {
      return LevelState.initialize(
        setState,
        old.levelNumber + 1,
        old.canvas,
        old.assets,
      );
    }

    return old;
  });
};

function handleNextAnimation(state) {
  // if we are done animating one item and have more items to animate
  if (state.animateQueue.length > 0) {
    // this must be the ONLY setTimeout in the entire program
    // otherwise we will have race conditions
    // technically race conditions are still possible due to keyboard triggers...
    setTimeout(
      () => runAnimationQueue(state.setState, state.animateQueue),
      fastTickInterval,
    );
  }
}

function runAnimationQueue(setState, animateQueue) {
  if (animateQueue.length === 0) {
    return;
  }

  const sprite = animateQueue[0];
  const actionTable = {
    rock: animateRock,
    leftArrow: animateArrow,
    rightArrow: animateArrow,
  };
  actionTable[sprite.spriteType](setState, sprite);
}
