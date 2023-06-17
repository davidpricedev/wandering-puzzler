import * as R from "ramda";
import { newPlayer, drawPlayer } from "./player.js";
import { drawGrid, drawGrass, drawGameOver } from "./grid.js";
import { newSprite, drawSprite } from "./sprite.js";
import { canvasOffset } from "./util.js";
import { readStaticMap } from "./map.js";
import { handleKeys, keyboardSetup, subscribe } from "./keyboard.js";
import { directionMap } from "./constants.js";

export function runGame(canvas, ctx) {
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
    (acc, sprite) => ({ ...acc, [`${sprite.x},${sprite.y}`]: sprite }),
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
  };

  keyboardSetup();
  drawGame(state);
  const removeSubscription = subscribe(handleKeys(handleMovement(setState)));
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
}) {
  ctx.reset();
  drawGrass(ctx, canvasOffset, mapWidth, mapHeight);
  drawGrid(ctx, canvas);
  sprites.forEach((sprite) => drawSprite(ctx, canvasOffset, sprite));
  drawPlayer(ctx, canvasOffset, player);
  if (gameOver) {
    drawGameOver(ctx, canvas);
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

    const newPosition = {
      x: player.x + command.x,
      y: player.y + command.y,
    };
    const newPlayer = { ...player, ...newPosition };
    const collidingSprite = spriteIndex[`${newPlayer.x},${newPlayer.y}`];
    if (collidingSprite && collidingSprite.impassible) {
      return oldState;
    }
    if (collidingSprite && collidingSprite.canBeTrampled) {
      const newSpriteIndex = R.omit([`${newPlayer.x},${newPlayer.y}`])(
        spriteIndex,
      );
      const newSprites = R.reject(
        (sprite) => sprite.x === newPlayer.x && sprite.y === newPlayer.y,
      )(oldState.sprites);
      return {
        ...oldState,
        sprites: newSprites,
        player: newPlayer,
        spriteIndex: newSpriteIndex,
      };
    }
    if (collidingSprite && collidingSprite.death) {
      return {
        ...oldState,
        player: newPlayer,
        gameOver: true,
      };
    }
    return {
      ...oldState,
      player: newPlayer,
    };
  });
}
