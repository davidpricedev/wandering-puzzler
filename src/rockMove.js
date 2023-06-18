import * as R from "ramda";
import { fastTickInterval, tickInterval } from "./constants";
import { Point } from "./point";

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

  const { sprites, neighbors, player } = oldState;
  const newRockPosition = Point.of(collidingSprite).add(command);
  if (sprites.getAt(newRockPosition)) {
    // rock can't move into a space occupied by another sprite
    return oldState;
  }

  const newRock = collidingSprite.moveTo(newRockPosition);
  const newSprites = sprites.move(collidingSprite, newRockPosition);

  setTimeout(() => animateRock(setState, newRock), fastTickInterval);

  return oldState.copy({
    player: newPlayer,
    sprites: newSprites,
  });
}

function getFallDirection(sprite, sprites) {
  const down = Point.of({ x: 0, y: 1 });
  const downleft = Point.of({ x: -1, y: 1 });
  const downright = Point.of({ x: 1, y: 1 });

  const downSprite = sprites.getAt(down.add(sprite));
  if (!downSprite) {
    return down;
  }

  console.log("downSprite.allowedFlows: ", downSprite.allowedFlows);
  console.log(
    "can downLeft: ",
    downSprite.allowedFlows.includes(downleft),
    Point.arrayInclues(downleft, downSprite.allowedFlows),
  );
  console.log(
    "can downRight: ",
    downSprite.allowedFlows.includes(downright),
    Point.arrayInclues(downright, downSprite.allowedFlows),
  );

  if (
    !sprites.getAt(downleft.add(sprite)) &&
    !sprites.getAt(Point.left().add(sprite)) &&
    Point.arrayInclues(downleft, downSprite.allowedFlows)
  ) {
    return downleft;
  }

  if (
    !sprites.getAt(downright.add(sprite)) &&
    !sprites.getAt(Point.right().add(sprite)) &&
    Point.arrayInclues(downright, downSprite.allowedFlows)
  ) {
    return downright;
  }

  return false;
}

/** Once we've started a rock moving it moves on its own until it can't move anymore */
export function animateRock(setState, rock) {
  console.log("animateRock: ", rock);
  setState((oldState) => {
    const { sprites, player, animateQueue } = oldState;
    const fallDirection = getFallDirection(rock, sprites);
    const queueWithoutRock = animateQueue.filter((s) => !s.equals(rock));
    if (!fallDirection) {
      console.log("cleaning up rock", rock, queueWithoutRock);
      return oldState.copy({
        animateQueue: queueWithoutRock,
      });
    }

    const newRockPos = Point.of(rock).add(fallDirection);
    const newRock = rock.moveTo(newRockPos);
    if (newRockPos.equals(player)) {
      return oldState.copy({
        animateQueue: queueWithoutRock,
        gameOver: true,
        gameOverReason: "You were bonked by a rock",
      });
    }

    setTimeout(() => animateRock(setState, newRock), tickInterval);
    return oldState.copy({
      sprites: sprites.move(rock, newRockPos),
      animateQueue: R.concat(queueWithoutRock, [newRock]),
    });
  });
}
