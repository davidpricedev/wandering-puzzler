import * as R from "ramda";
import { drawGrid, drawCenterLine } from "./grid.js";
import { drawGrass, drawGameOver, drawBusy } from "./framing.js";
import { readStaticMap } from "./map.js";
import { handleKeys, keyboardSetup, subscribe } from "./keyboard.js";
import { directionMap, tickInterval } from "./constants.js";
import { GameState } from "./gameState.js";
import { movePlayer } from "./playerMove.js";
import { Point } from "./point.js";
import { animateArrow } from "./arrowMove.js";
import { animateRock } from "./rockMove.js";

export async function runGame(canvas, scoreSpan, restartButton) {
  const assets = await loadAssets();
  let state = GameState.initialize(readStaticMap(), canvas, assets);

  const setState = (stateChangeFn) => {
    const newState = stateChangeFn(state);
    state = handleProximityAnimation(setState, state, newState);
    console.log("state: ", state);
    drawGame(state);
    scoreSpan.textContent = state.player.score;
  };

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
  canvasOffset,
  mapWidth,
  mapHeight,
  gameOver,
  gameOverReason,
  assets,
  animateQueue,
}) {
  ctx.reset();
  drawGrass(ctx, canvasOffset, mapWidth, mapHeight);
  drawGrid(ctx, canvasOffset);
  sprites.forEach((sprite) => sprite.draw(ctx, canvasOffset, assets));
  player.draw(ctx, canvasOffset, assets);
  if (animateQueue.length > 0) {
    drawBusy(ctx, canvas);
  }
  if (gameOver) {
    drawGameOver(ctx, canvas, gameOverReason, player.score);
  }
}

const restartGame = (setState) => () => {
  setState((old) =>
    GameState.initialize(readStaticMap(), old.canvas, old.assets),
  );
};

const handleMovement = (setState) => (type, commandType) => {
  if (type !== "keydown") {
    return;
  }

  const direction = directionMap[commandType];
  const handleMove = () =>
    setState((old) => movePlayer(old, setState, direction));
  const directionTable = {
    restart: restartGame(setState),
    up: handleMove,
    down: handleMove,
    left: handleMove,
    right: handleMove,
  };
  directionTable[commandType]();
};

/**
 * Animate each of the 3 cardinal directions we were adjacent to previously
 */
function handleProximityAnimation(setState, oldState, newState) {
  const direction = Point.of(newState.player).subtract(oldState.player);
  if (direction.isZero()) {
    return newState;
  }

  const oldNeighbors = newState.sprites
    .getNeighbors(oldState.player)
    .filter((s) => !Point.of(s).equals(newState.player));
  const animateQueue = R.concat(
    newState.animateQueue,
    oldNeighbors.filter((s) => s.isMobile),
  );
  if (animateQueue.length > 0) {
    setTimeout(() => runAnimationQueue(setState, animateQueue), tickInterval);
  }
  return newState.copy({ animateQueue });
}

function runAnimationQueue(setState, animateQueue) {
  animateQueue.forEach((sprite) => {
    if (sprite.isRock()) {
      animateRock(setState, sprite);
    }
    if (sprite.isArrow()) {
      animateArrow(setState, sprite);
    }
  });
}

async function loadAssets() {
  const imagesToLoad = [
    ["rock", "assets/rock.svg"],
    ["arrow", "assets/arrow.svg"],
    ["player", "assets/player.svg"],
    ["cactus", "assets/bomb.svg"],
    ["shrubbery", "assets/shrub.svg"],
    ["wall", "assets/wallTexture.png"],
    ["coin", "assets/coin.svg"],
  ];
  const imgs = await Promise.all(
    imagesToLoad.map(([k, src]) => {
      const img = new Image();
      img.src = src;
      return new Promise((resolve) => {
        img.onload = () => resolve({ [k]: img });
      });
    }),
  );
  return R.reduce((acc, img_1) => ({ ...acc, ...img_1 }), {}, imgs);
}
