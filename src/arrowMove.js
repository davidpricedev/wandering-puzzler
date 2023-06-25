import * as R from "ramda";
import { Point } from "./point";
import { getSupportedBy } from "./supportCheck";

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

  const { sprites } = oldState;
  const newArrowPosition = Point.of(collidingSprite).add(command);
  if (sprites.getAt(newArrowPosition)) {
    // arrow can't move into a space occupied by another sprite
    return oldState;
  }

  const newSprites = sprites
    .move(collidingSprite, newArrowPosition)
    .move(sprites.getPlayer(), newPlayer);
  const newArrow = collidingSprite
    .moveTo(newArrowPosition)
    .setSupport(newSprites);

  return oldState.copy({
    sprites: newSprites.updateAt(newArrowPosition, newArrow),
    movedSprites: [sprites.getPlayer(), collidingSprite],
    animateQueue: [...oldState.animateQueue, newArrow],
  });
}

function getFlightDirection(sprites, sprite) {
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
  setState((oldState) => {
    const { sprites, animateQueue, mapBounds } = oldState;
    const flightDirection = getFlightDirection(sprites, arrow);
    const queueWithoutArrow = animateQueue.filter((s) => !s.equals(arrow));
    if (
      !flightDirection ||
      !mapBounds.containsPoint(flightDirection.add(arrow))
    ) {
      return oldState.copy({
        animateQueue: queueWithoutArrow,
        sprites: sprites.updateAt(
          arrow,
          arrow.copy({ supportedBy: getSupportedBy(sprites, arrow) }),
        ),
      });
    }

    if (arrow.hasSupport(sprites)) {
      return oldState.copy({ animateQueue: queueWithoutArrow });
    }

    const newArrowPos = Point.of(arrow).add(flightDirection);
    const newArrow = arrow.moveTo(newArrowPos);
    if (newArrowPos.equals(sprites.getPlayer())) {
      return oldState.copy({
        movedSprites: [arrow],
        animateQueue: queueWithoutArrow,
        gameOver: true,
        gameOverReason: "You were poked by a arrow",
      });
    }

    return oldState.copy({
      sprites: sprites.move(arrow, newArrowPos),
      movedSprites: [arrow],
      animateQueue: R.concat([newArrow], queueWithoutArrow),
    });
  });
}

// export function getArrowSupportedBy(sprites, sprite) {
//   const motionTable = {
//     rightArrow: Point.right(),
//     leftArrow: Point.left(),
//   };
//   const supportPos = motionTable[sprite.spriteType].add(sprite);
//   const supportSprite = sprites.find((s) => supportPos.equals(s));
//   // Easy case, we are supported directly
//   if (
//     !supportSprite ||
//     !["leftLeanWall", "rightLeanWall"].includes(supportSprite.spriteType)
//   ) {
//     return supportSprite;
//   }

//   // Supported by a leaning wall, so need to check other directions too...
//   const indirectTable = {
//     leftArrow: getIndirectLeftArrowSupportedBy,
//     rightArrow: getIndirectRightArrowSupportedBy,
//   };
//   return indirectTable[sprite.spriteType](sprites, sprite, supportSprite);
// }

// const supportTable = {
//   leftArrow: {
//     direct: Point.left(),
//     leftLeanWall: [Point.up(), Point.upLeft()],
//     rightLeanWall: [Point.down(), Point.downLeft()],
//   },
//   rightArrow: {
//     direct: Point.right(),
//     leftLeanWall: [Point.down(), Point.downRight()],
//     rightLeanWall: [Point.up(), Point.upRight()],
//   },
//   rock: {
//     direct: Point.down(),
//     leftLeanWall: [Point.right(), Point.downRight()],
//     rightLeanWall: [Point.left(), Point.downLeft()],
//   },
// };

// export function getSupportedBy(sprites, sprite) {
//   const supportPos = supportTable[sprite.spriteType]["direct"].add(sprite);
//   const supportSprite = sprites.find((s) => supportPos.equals(s));
//   // Easy case, we are supported directly
//   if (
//     !supportSprite ||
//     !["leftLeanWall", "rightLeanWall"].includes(supportSprite.spriteType)
//   ) {
//     return supportSprite;
//   }

//   // Supported by a leaning wall, so need to check other directions too...
//   return getIndirectSupport(sprites, sprite, supportSprite);
// }

// function getIndirectSupport(sprites, sprite, directSupport) {
//   const indirectSupports = supportTable[sprite.spriteType][
//     directSupport.spriteType
//   ].map((p) => p.add(sprite));
//   return indirectSupports.find((p) => sprites.find((s) => p.equals(s)));
// }
