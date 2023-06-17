import * as R from "ramda";
import { directionMap, fastTickInterval, tickInterval } from "./constants";
import { vectorAdd, vectorEqual, vectorPairString } from "./util";

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

  const { spriteIndex } = oldState;
  const newRockPosition = vectorAdd(collidingSprite, command);
  if (spriteIndex[`${newRockPosition.x},${newRockPosition.y}`]) {
    // rock can't move into a space occupied by another sprite
    return oldState;
  }

  const newRock = { ...collidingSprite, ...newRockPosition };
  const newSpriteIndex = R.omit([`${collidingSprite.x},${collidingSprite.y}`])(
    spriteIndex,
  );
  const newSpriteIndexWithRock = {
    ...newSpriteIndex,
    [`${newRockPosition.x},${newRockPosition.y}`]: newRock,
  };
  const newSprites = R.map((sprite) =>
    vectorEqual(collidingSprite, sprite) ? newRock : sprite,
  )(oldState.sprites);

  setTimeout(() => animateRock(setState, newRock), fastTickInterval);

  return {
    ...oldState,
    player: newPlayer,
    sprites: newSprites,
    spriteIndex: newSpriteIndexWithRock,
  };
}

/** Once we've started a rock moving it moves on its own until it can't move anymore */
function animateRock(setState, rock) {
  setState((oldState) => {
    console.log("animating before state: ", oldState);
    const { spriteIndex } = oldState;
    if (spriteIndex[vectorPairString(vectorAdd(rock, directionMap.down))]) {
      return oldState;
    } else {
      const newRockPos = vectorAdd(rock, directionMap.down);
      const newRock = { ...rock, ...newRockPos };
      setTimeout(() => animateRock(setState, newRock), tickInterval);
      return {
        ...oldState,
        sprites: oldState.sprites.map((sprite) =>
          vectorEqual(rock, sprite) ? newRock : sprite,
        ),
        spriteIndex: {
          ...R.omit([vectorPairString(rock)], oldState.spriteIndex),
          [vectorPairString(vectorAdd(rock, directionMap.down))]: rock,
        },
      };
    }
  });
}
