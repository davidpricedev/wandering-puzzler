import * as R from "ramda";
import { handleRockCollision, animateRock } from "./rockMove.js";
import { Point } from "./point.js";

export function movePlayer(oldState, setState, command) {
  const { player, sprites, gameOver, animateQueue, neighbors } = oldState;
  if (gameOver || animateQueue.length > 0) {
    return oldState;
  }

  const newPlayer = player.moveTo(Point.of(player).add(command));
  const collidingSprite = sprites.getAt(newPlayer);
  if (collidingSprite && collidingSprite.impassible) {
    return oldState;
  }

  const newAnimateQueue = neighbors.filter((s) => s.isMobile);
  setTimeout(() => runAnimationQueue(setState, newAnimateQueue), 1);

  const newNeighbors = sprites.getNeighbors(newPlayer);
  if (collidingSprite && collidingSprite.canBeTrampled) {
    return oldState.copy({
      neighbors: newNeighbors,
      sprites: sprites.removeAt(newPlayer),
      player: newPlayer.addScore(collidingSprite.score),
      animateQueue: newAnimateQueue,
    });
  }

  if (collidingSprite && collidingSprite.death) {
    return oldState.copy({
      player: newPlayer,
      neighbors: newNeighbors,
      gameOver: true,
      gameOverReason: collidingSprite.gameOverReason,
      animateQueue: newAnimateQueue,
    });
  }

  if (collidingSprite && collidingSprite.spriteType === "rock") {
    return handleRockCollision({
      setState,
      oldState,
      newPlayer,
      collidingSprite,
      command,
    });
  }

  // walk into empty space
  return oldState.copy({
    player: newPlayer,
    neighbors: newNeighbors,
    animateQueue: newAnimateQueue,
  });
}

function runAnimationQueue(setState, animateQueue) {
  animateQueue.forEach((sprite) => {
    if (sprite.spriteType === "rock") {
      animateRock(setState, sprite);
    }
  });
}
