import * as R from "ramda";
import { drawGrid, drawCenterLine } from "./grid.js";
import { drawGrass, drawGameOver } from "./framing.js";
import { vectorAdd, getNeighboringSprites } from "./util.js";
import { readStaticMap } from "./map.js";
import { handleKeys, keyboardSetup, subscribe } from "./keyboard.js";
import { directionMap } from "./constants.js";
import { handleRockCollision } from "./rockMove.js";
import { GameState } from "./gameState.js";

export function runGame(canvas, ctx, scoreSpan, restartButton) {
  let state = GameState.initialize(readStaticMap(), canvas);

  const setState = (stateChangeFn) => {
    state = stateChangeFn(state);
    drawGame(state);
    scoreSpan.textContent = state.player.score;
  };

  keyboardSetup();
  drawGame(state);
  const removeSubscription = subscribe(handleKeys(handleMovement(setState)));
  restartButton.onclick = () => restartGame(setState);
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

const handleMovement = (setState) => (type, commandType) => {
  if (type !== "keydown") {
    return;
  }

  const direction = directionMap[commandType];
  const directionTable = {
    restart: () => restartGame(setState),
    up: () => movePlayer(setState, direction),
    down: () => movePlayer(setState, direction),
    left: () => movePlayer(setState, direction),
    right: () => movePlayer(setState, direction),
  };
  directionTable[commandType]();
};

function restartGame(setState) {
  setState((oldState) =>
    GameState.initialize(readStaticMap(), oldState.canvas),
  );
}

function movePlayer(setState, command) {
  setState((oldState) => {
    const { player, sprites, gameOver } = oldState;
    if (gameOver) {
      return oldState;
    }

    const newPosition = vectorAdd(player, command);
    const newPlayer = player.moveTo(newPosition);
    const newNeighbors = getNeighboringSprites(newPlayer, oldState.sprites);
    const collidingSprite = sprites.getAt(newPlayer);
    if (collidingSprite && collidingSprite.impassible) {
      return oldState;
    }
    if (collidingSprite && collidingSprite.canBeTrampled) {
      console.log("newScore: ", newPlayer.score + collidingSprite.score);
      return oldState.copy({
        sprites: sprites.removeAt(newPlayer),
        player: newPlayer.addScore(collidingSprite.score),
      });
    }
    if (collidingSprite && collidingSprite.death) {
      return oldState.copy({
        player: newPlayer,
        neighbors: newNeighbors,
        gameOver: true,
        gameOverReason: collidingSprite.gameOverReason,
      });
    }
    if (collidingSprite && collidingSprite.spriteType === "rock") {
      return handleRockCollision({
        setState,
        oldState,
        newPlayer,
        collidingSprite,
        command,
      });
    }
    return oldState.copy({
      player: newPlayer,
      neighbors: newNeighbors,
    });
  });
}
