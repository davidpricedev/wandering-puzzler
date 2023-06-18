import * as R from "ramda";
import { drawGrid, drawCenterLine } from "./grid.js";
import { drawGrass, drawGameOver } from "./framing.js";
import { readStaticMap } from "./map.js";
import { handleKeys, keyboardSetup, subscribe } from "./keyboard.js";
import { directionMap } from "./constants.js";
import { GameState } from "./gameState.js";
import { movePlayer } from "./playerMove.js";

export function runGame(canvas, ctx, scoreSpan, restartButton) {
  let state = GameState.initialize(readStaticMap(), canvas);

  const setState = (stateChangeFn) => {
    state = stateChangeFn(state);
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
}) {
  ctx.reset();
  drawGrass(ctx, canvasOffset, mapWidth, mapHeight);
  drawGrid(ctx, canvasOffset);
  drawCenterLine(ctx, canvasOffset);
  sprites.forEach((sprite) => sprite.draw(ctx, canvasOffset));
  player.draw(ctx, canvasOffset);
  if (gameOver) {
    drawGameOver(ctx, canvas, gameOverReason, player.score);
  }
}

const restartGame = (setState) => () => {
  setState((old) => GameState.initialize(readStaticMap(), old.canvas));
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
