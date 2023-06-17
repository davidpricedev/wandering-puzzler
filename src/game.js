import * as R from "ramda";
import { drawGrid, drawGrass, drawGameOver, drawCenterLine } from "./grid.js";
import { drawSprite } from "./sprite.js";
import {
  canvasOffset,
  vectorAdd,
  getNeighboringSprites,
  vectorPairString,
} from "./util.js";
import { readStaticMap } from "./map.js";
import { handleKeys, keyboardSetup, subscribe } from "./keyboard.js";
import { directionMap } from "./constants.js";
import { handleRockCollision } from "./rockMove.js";

export function runGame(canvas, ctx, scoreSpan, restartButton) {
  const {
    sprites: allSprites,
    width: mapWidth,
    height: mapHeight,
  } = readStaticMap();
  const [[player], sprites] = R.partition(
    (x) => x.type === "player",
    allSprites,
  );
  const spriteIndex = R.reduce(
    (acc, sprite) => ({ ...acc, [vectorPairString(sprite)]: sprite }),
    {},
    sprites,
  );
  const initialState = {
    player: player,
    sprites,
    canvas,
    ctx,
    spriteIndex,
    canvasOffset: canvasOffset(canvas, player.x, player.y),
    mapWidth,
    mapHeight,
  };
  let state = {
    initialState,
    ...initialState,
  };
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
  sprites.forEach((sprite) => drawSprite(ctx, canvasOffset, sprite));
  drawSprite(ctx, canvasOffset, player);
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
  setState((oldState) => ({
    initialState: oldState.initialState,
    ...oldState.initialState,
  }));
}

function movePlayer(setState, command) {
  setState((oldState) => {
    const { player, spriteIndex, gameOver } = oldState;
    if (gameOver) {
      return oldState;
    }

    const newPosition = vectorAdd(player, command);
    const newPlayer = { ...player, ...newPosition };
    const newNeighbors = getNeighboringSprites(newPlayer, oldState.spriteIndex);
    const collidingSprite = spriteIndex[vectorPairString(newPlayer)];
    if (collidingSprite && collidingSprite.impassible) {
      return oldState;
    }
    if (collidingSprite && collidingSprite.canBeTrampled) {
      const newSpriteIndex = R.omit([vectorPairString(newPlayer)])(spriteIndex);
      const newSprites = R.reject(
        (sprite) => sprite.x === newPlayer.x && sprite.y === newPlayer.y,
      )(oldState.sprites);
      console.log("newScore: ", newPlayer.score + collidingSprite.score);
      return {
        ...oldState,
        sprites: newSprites,
        player: {
          ...newPlayer,
          score: newPlayer.score + collidingSprite.score,
        },
        spriteIndex: newSpriteIndex,
      };
    }
    if (collidingSprite && collidingSprite.death) {
      return {
        ...oldState,
        player: newPlayer,
        neighbors: newNeighbors,
        gameOver: true,
        gameOverReason: collidingSprite.gameOverReason,
      };
    }
    if (collidingSprite && collidingSprite.type === "rock") {
      return handleRockCollision({
        setState,
        oldState,
        newPlayer,
        collidingSprite,
        command,
      });
    }
    return {
      ...oldState,
      player: newPlayer,
      neighbors: newNeighbors,
    };
  });
}
