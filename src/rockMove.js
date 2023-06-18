import * as R from "ramda";
import { directionMap, fastTickInterval, tickInterval } from "./constants";
import { vectorAdd } from "./util";

export function handleRockCollision({
  setState,
  oldState,
  newPlayer,
  collidingSprite,
  command,
}) {
  console.log("command: ", command);
  if (["up", "down"].includes(command.direction)) {
    // player can't push rock up or down
    return oldState;
  }

  const { sprites } = oldState;
  const newRockPosition = vectorAdd(collidingSprite, command);
  if (sprites.getAt(newRockPosition)) {
    // rock can't move into a space occupied by another sprite
    return oldState;
  }

  const newRock = { ...collidingSprite, ...newRockPosition };
  const newSprites = sprites.move(collidingSprite, newRockPosition);

  setTimeout(() => animateRock(setState, newRock), fastTickInterval);

  return oldState.copy({
    player: newPlayer,
    sprites: newSprites,
  });
}

function canFall(sprite, sprites) {
  const downleft = { type: "move", direction: "downleft", x: -1, y: 1 };
  const downright = { type: "move", direction: "downright", x: +1, y: 1 };

  const downSprite = sprites.getAt(vectorAdd(sprite, directionMap.down));
  if (!downSprite) {
    return directionMap.down;
  }

  if (downSprite.spriteType === "wall") {
    return false;
  }

  if (!sprites.getAt(vectorAdd(sprite, downleft))) {
    return downleft;
  }

  if (!sprites.getAt(vectorAdd(sprite, downright))) {
    return downright;
  }

  return false;
}

/** Once we've started a rock moving it moves on its own until it can't move anymore */
function animateRock(setState, rock) {
  setState((oldState) => {
    console.log("animating before state: ", oldState);
    const { sprites } = oldState;
    if (sprites.getAt(vectorAdd(rock, directionMap.down))) {
      return oldState;
    }

    const newRockPos = vectorAdd(rock, directionMap.down);
    const newRock = { ...rock, ...newRockPos };
    setTimeout(() => animateRock(setState, newRock), tickInterval);
    return oldState.copy({
      sprites: sprites.move(rock, newRockPos),
    });
  });
}
