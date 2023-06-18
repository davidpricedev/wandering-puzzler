import * as R from "ramda";
import { fastTickInterval, tickInterval } from "./constants";
import { Point } from "./point";

export function handleArrowCollision({
  setState,
  oldState,
  newPlayer,
  collidingSprite,
  command,
}) {
  if (["left", "right"].includes(command.direction)) {
    // player can't push arrow left or right
    return oldState;
  }

  const { sprites, neighbors, player } = oldState;
  const newArrowPosition = Point.of(collidingSprite).add(command);
  if (sprites.getAt(newArrowPosition)) {
    // arrow can't move into a space occupied by another sprite
    return oldState;
  }

  const newArrow = collidingSprite.moveTo(newArrowPosition);
  const newSprites = sprites.move(collidingSprite, newArrowPosition);

  setTimeout(() => animateArrow(setState, newArrow), fastTickInterval);

  return oldState.copy({
    player: newPlayer,
    sprites: newSprites,
  });
}

function getFlightDirection(sprite, sprites) {
  const direction =
    sprite.spriteType === "leftArrow" ? Point.left() : Point.right();
  const diagUp = direction.add(Point.up());
  const diagDown = direction.add(Point.down());

  const directionSprite = sprites.getAt(direction.add(sprite));
  if (!directionSprite) {
    return direction;
  }

  if (
    !sprites.getAt(diagUp.add(sprite)) &&
    !sprites.getAt(Point.up().add(sprite)) &&
    Point.arrayInclues(diagUp, directionSprite.allowedFlows)
  ) {
    return diagUp;
  }

  if (
    !sprites.getAt(diagDown.add(sprite)) &&
    !sprites.getAt(Point.down().add(sprite)) &&
    Point.arrayInclues(diagDown, directionSprite.allowedFlows)
  ) {
    return diagDown;
  }

  return false;
}

/** Once we've started a arrow moving it moves on its own until it can't move anymore */
export function animateArrow(setState, arrow) {
  console.log("animateArrow: ", arrow);
  setState((oldState) => {
    const { sprites, player, animateQueue } = oldState;
    const flightDirection = getFlightDirection(arrow, sprites);
    const queueWithoutArrow = animateQueue.filter((s) => !s.equals(arrow));
    if (!flightDirection) {
      console.log("cleaning up arrow", arrow, queueWithoutArrow);
      return oldState.copy({
        animateQueue: queueWithoutArrow,
      });
    }

    const newArrowPos = Point.of(arrow).add(flightDirection);
    const newArrow = arrow.moveTo(newArrowPos);
    if (newArrowPos.equals(player)) {
      return oldState.copy({
        animateQueue: queueWithoutArrow,
        gameOver: true,
        gameOverReason: "You were poked by a arrow",
      });
    }

    setTimeout(() => animateArrow(setState, newArrow), tickInterval);
    return oldState.copy({
      sprites: sprites.move(arrow, newArrowPos),
      animateQueue: R.concat(queueWithoutArrow, [newArrow]),
    });
  });
}
