import * as R from "ramda";
import { drawGrid, drawCenterLine } from "./canvas/drawGrid.js";
import {
  drawGrass,
  drawGameOver,
  drawBusy,
  // drawCanvasViewport,
  drawMapEdge,
  drawLevelComplete,
  drawLevelStart,
  loadAssets,
} from "./canvas";
import { handleKeys, keyboardSetup, subscribe } from "./keyboard.js";
import {
  cardinalDirectionMap,
  fastTickInterval,
  tickInterval,
  zoomChange,
} from "./constants.js";
import { GameState } from "./gameState.js";
import { movePlayer } from "./playerMove.js";
import { Box, Point } from "./point.js";
import { animateArrow } from "./arrowMove.js";
import { animateRock } from "./rockMove.js";
import { LEVELS } from "./maps/index.js";

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
    console.log("state: ", state);
    console.log("== key rock: ", state.sprites.getAt(Point.of(21, 1)));
    drawGame(state);
    scoreSpan.textContent = state.player.score;
    handleNextAnimation(state);
  };

  state = GameState.initialize(setState, 7, canvas, assets);

  keyboardSetup();
  drawGame(state);
  const removeSubscription = subscribe(handleKeys(handleMovement(setState)));
  restartButton.onclick = restartGame(setState);
}

function drawGame({
  player,
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
  ctx.reset();
  drawGrass(ctx, projection);
  drawGrid(ctx, projection);
  sprites
    .filterToViewport(projection.mapViewport)
    .forEach((s) => s.draw(ctx, projection, assets));
  // drawCanvasViewport(ctx, projection.canvasViewport);
  player.draw(ctx, projection, assets);
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
    GameState.initialize(setState, old.levelNumber, old.canvas, old.assets),
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
  const { player, mapBounds } = newState;
  console.log("handleMapEdge: ", mapBounds.containsPoint(player));
  return mapBounds.containsPoint(player) ? newState : oldState;
};

/**
 * recenter the map viewport on the player when the player is near the edge
 */
const handleMovingViewport = (oldState) => (newState) => {
  const { player, projection } = newState;
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
  const { sprites, oldPlayerPos, movedSprite, animateQueue, player } = newState;
  const playerNeighbors = oldPlayerPos
    ? getNeighborsOfMovedPlayer(sprites, Point.of(oldPlayerPos))
    : [];

  const spriteNeighbors = movedSprite
    ? getNeighborsOfMovedSprite(sprites, Point.of(movedSprite), player)
    : [];

  console.log("----neighbors: ", playerNeighbors, spriteNeighbors, movedSprite);
  const newAnimateQueue = [
    ...animateQueue,
    ...playerNeighbors,
    ...spriteNeighbors,
  ];
  return newState.copy({
    animateQueue: newAnimateQueue,
    movedSprite: null,
    oldPlayerPos: null,
  });
};

function getNeighborsOfMovedPlayer(sprites, oldPos) {
  return sprites
    .getCardinalNeighbors(oldPos)
    .filter((s) => !Point.of(s).equals(oldPos) && s.isMobile);
}

function getNeighborsOfMovedSprite(sprites, oldPos, player) {
  return sprites
    .getAllNeighbors(oldPos)
    .filter(
      (s) =>
        s.supportedBy && oldPos.equals(s.supportedBy) && !oldPos.equals(player),
    );
}
// handleSpriteChange(oldPos) {
//   this.setState((oldState) => {
//     const player = oldState.player;
//     console.log("oldPos, player: ", oldPos, player);
//     console.log("old neighbors: ", oldState.sprites.getNeighbors(oldPos));
//     const spritesToAnimate = oldState.sprites
//       .getNeighbors(oldPos)
//       .filter(
//         (s) =>
//           s.supportedBy &&
//           oldPos.equals(s.supportedBy) &&
//           !oldPos.equals(player),
//       );
//     console.log("spritesToAnimate", spritesToAnimate);
//     return oldState.copy({
//       animateQueue: oldState.animateQueue.concat(spritesToAnimate),
//     });
//   });
// }

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
      return GameState.initialize(old.levelNumber + 1, old.canvas, old.assets);
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
  console.log("runnning animation queue: ", animateQueue);
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
