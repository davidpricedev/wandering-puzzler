import * as R from "ramda";
import { fastTickInterval, tickInterval } from "./constants";
import { Point } from "./point";
import { getSupportedBy } from "./supportCheck";

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

  const { sprites } = oldState;
  const newRockPosition = Point.of(collidingSprite).add(command);
  if (sprites.getAt(newRockPosition)) {
    // rock can't move into a space occupied by another sprite
    return oldState;
  }

  const newSprites = sprites
    .move(collidingSprite, newRockPosition)
    .move(sprites.getPlayer(), newPlayer);
  const newRock = collidingSprite
    .moveTo(newRockPosition)
    .setSupport(newSprites);

  return oldState.copy({
    sprites: newSprites.updateAt(newRockPosition, newRock),
    movedSprites: [sprites.getPlayer(), collidingSprite],
    animateQueue: [...oldState.animateQueue, newRock],
  });
}

function getFallDirection(sprites, sprite) {
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
    const { sprites, animateQueue, mapBounds } = oldState;
    const fallDirection = getFallDirection(sprites, rock);
    const queueWithoutRock = animateQueue.filter((s) => !s.equals(rock));

    // if the rock can't fall anymore, remove it from the animate queue
    if (!fallDirection || !mapBounds.containsPoint(fallDirection.add(rock))) {
      return oldState.copy({
        animateQueue: queueWithoutRock,
        sprites: sprites.updateAt(
          rock,
          rock.copy({ supportedBy: getSupportedBy(sprites, rock) }),
        ),
      });
    }

    if (rock.hasSupport(sprites)) {
      return oldState.copy({ animateQueue: queueWithoutRock });
    }

    const newRockPos = Point.of(rock).add(fallDirection);
    const newRock = rock.moveTo(newRockPos);
    if (newRockPos.equals(sprites.getPlayer())) {
      return oldState.copy({
        movedSprites: [rock],
        animateQueue: queueWithoutRock,
        gameOver: true,
        gameOverReason: "You were bonked by a rock",
      });
    }

    return oldState.copy({
      movedSprites: [rock],
      sprites: sprites.move(rock, newRockPos),
      animateQueue: R.concat([newRock], queueWithoutRock),
    });
  });
}

// export function getRockSupportedBy(sprites, rock) {
//   const supportPos = Point.down().add(rock);
//   const supportSprite = sprites.find((s) => supportPos.equals(s));
//   // Easy case, we are supported directly
//   if (
//     !supportSprite ||
//     !["leftLeanWall", "rightLeanWall"].includes(supportSprite.spriteType)
//   ) {
//     return supportSprite;
//   }

//   // Supported by a leaning wall, so need to check other directions too...
//   return getIndirectRockSupportedBy(sprites, rock, supportSprite);
// }

// const getIndirectRockSupportedBy = (sprites, sprite, directSupport) => {
//   if (directSupport.spriteType === "leftLeanWall") {
//     const rightSupport = sprites.find((s) =>
//       Point.right().add(sprite).equals(s),
//     );
//     if (rightSupport) {
//       return rightSupport;
//     } else {
//       return sprites.find((s) => Point.downRight().add(sprite).equals(s));
//     }
//   }

//   if (directSupport.spriteType === "rightLeanWall") {
//     const leftSupport = sprites.find((s) => Point.left().add(sprite).equals(s));
//     if (leftSupport) {
//       return leftSupport;
//     } else {
//       return sprites.find((s) => Point.downLeft().add(sprite).equals(s));
//     }
//   }
// };
