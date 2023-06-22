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

  return oldState.copy({
    player: newPlayer,
    sprites: newSprites,
    oldPlayerPos: Point.of(player),
    movedSprite: collidingSprite,
    animateQueue: [...oldState.animateQueue, newRock],
  });
}

function getFallDirection(sprite, sprites) {
  const down = Point.of(0, 1);
  const downleft = Point.of(-1, 1);
  const downright = Point.of(1, 1);

  const downSprite = sprites.getAt(down.add(sprite));
  if (!downSprite) {
    return down;
  }

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
  setState((oldState) => {
    const { sprites, player, animateQueue, mapBounds } = oldState;
    const fallDirection = getFallDirection(rock, sprites);
    const queueWithoutRock = animateQueue.filter((s) => !s.equals(rock));

    // if the rock can't fall anymore, remove it from the animate queue
    if (!fallDirection || !mapBounds.containsPoint(fallDirection.add(rock))) {
      return oldState.copy({
        animateQueue: queueWithoutRock,
      });
    }

    if (rock.hasInitialSupport(sprites)) {
      return oldState.copy({ animateQueue: queueWithoutRock });
    }

    const newRockPos = Point.of(rock).add(fallDirection);
    const newRock = rock.moveTo(newRockPos);
    if (newRockPos.equals(player)) {
      return oldState.copy({
        movedSprite: rock,
        animateQueue: queueWithoutRock,
        gameOver: true,
        gameOverReason: "You were bonked by a rock",
      });
    }

    console.log("rock moved from ", Point.of(rock), " to ", newRockPos);
    return oldState.copy({
      movedSprite: rock,
      sprites: sprites.move(rock, newRockPos),
      animateQueue: R.concat([newRock], queueWithoutRock),
    });
  });
}
