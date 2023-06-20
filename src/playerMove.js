import * as R from "ramda";
import { handleRockCollision, animateRock } from "./rockMove.js";
import { Point } from "./point.js";
import { animateArrow, handleArrowCollision } from "./arrowMove.js";

export function movePlayer(oldState, setState, command) {
  const { player, sprites, gameOver, animateQueue, mapBounds } = oldState;
  if (gameOver || animateQueue.length > 0) {
    return oldState;
  }

  const newPlayer = player.moveTo(Point.of(player).add(command));
  if (!mapBounds.containsPoint(newPlayer)) {
    return oldState;
  }

  const collidingSprite = sprites.getAt(newPlayer);
  if (collidingSprite && collidingSprite.spriteType === "exit") {
    return oldState.copy({
      player: newPlayer,
      levelComplete: true,
    });
  }

  if (collidingSprite && collidingSprite.impassible) {
    return oldState;
  }

  const newNeighbors = sprites.getNeighbors(newPlayer);
  if (collidingSprite && collidingSprite.canBeTrampled) {
    return oldState.copy({
      sprites: sprites.removeAt(newPlayer),
      player: newPlayer.addScore(collidingSprite.score),
    });
  }

  if (collidingSprite && collidingSprite.death) {
    return oldState.copy({
      player: newPlayer,
      gameOver: true,
      gameOverReason: collidingSprite.gameOverReason,
    });
  }

  if (collidingSprite && collidingSprite.isRock()) {
    return handleRockCollision({
      setState,
      oldState,
      newPlayer,
      collidingSprite,
      command,
    });
  }

  if (collidingSprite && collidingSprite.isArrow()) {
    return handleArrowCollision({
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
  });
}
