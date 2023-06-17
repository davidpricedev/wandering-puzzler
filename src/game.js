import * as R from 'ramda';
import { newPlayer, drawPlayer } from './player.js';
import { drawGrid, drawGrass } from './grid.js';
import { newSprite, drawSprite } from './sprite.js';
import { KEY_MAP, subscribe } from './keyboard.js';
import { canvasOffset } from './util.js';
import { readStaticMap } from './map.js';

export function runGame(canvas, ctx) {
  console.log("canvas dims: ", canvas.width, canvas.height)
  console.log("map: ", readStaticMap());
  const { sprites: allSprites, width: mapWidth, height: mapHeight } = readStaticMap();
  const [[player], sprites ] = R.partition(x => x.type === "player", allSprites);
  const spriteIndex = R.reduce((acc, sprite) => ({ ...acc, [`${sprite.x},${sprite.y}`]: sprite }), {}, sprites);
  console.log("canvasOffset: ", canvasOffset);
  let state = {}
  const setState = (stateChangeFn) => {
    state = stateChangeFn(state);
    drawGame(state);
  }
  state = {
    player: player,
    sprites,
    canvas,
    ctx,
    spriteIndex,
    setState,
    canvasOffset: canvasOffset(canvas, player.x, player.y),
    mapWidth,
    mapHeight,
  };

  drawGame(state);
  const removeSubscription = subscribe(handleKeys(state));
}

function drawGame({ player, sprites, canvas, ctx, canvasOffset, mapWidth, mapHeight }) {
    ctx.reset();
    drawGrass(ctx, canvasOffset, mapWidth, mapHeight);
    drawGrid(ctx, canvas);
    drawPlayer(ctx, canvasOffset, player);
    sprites.forEach(sprite => drawSprite(ctx, canvasOffset, sprite));
}

const handleKeys = (state) => (type, ev) => {
  if (type === "keypress") {
    return;
  }
  if (!KEY_MAP[ev.key]) {
    return;
  }
  handleMovement(state, type, KEY_MAP[ev.key]);
};

const handleMovement = (state, type, direction) => {
  if (type !== "keydown") {
    return;
  }

  console.log("direction: ", direction);
  const directionTable = {
    "up": () => movePlayer(state, { x: 0, y: -1 }),
    "down": () => movePlayer(state, { x: 0, y: 1 }),
    "left": () => movePlayer(state, { x: -1, y: 0 }),
    "right": () => movePlayer(state, { x: 1, y: 0 }),
  };
  directionTable[direction]();
};

function movePlayer (state, direction) {
  state.setState(oldState => {
    const { player, spriteIndex } = oldState;
    const newPosition = { x: player.x + direction.x, y: player.y + direction.y };
    const newPlayer = { ...player, ...newPosition };
    console.log(`(${player.x},${player.y}) -> (${player.x + direction.x},${player.y + direction.y})`);
    const collidingSprite = spriteIndex[`${newPlayer.x},${newPlayer.y}`];
    if (collidingSprite) {
      return oldState;
    }
    return {
      ...oldState,
      player: newPlayer,
    };
  });
}
