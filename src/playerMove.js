import * as R from "ramda";
import { handleRockCollision } from "./rockMove";
import { Point } from "./point";
import { handleArrowCollision } from "./arrowMove";

export function movePlayer(oldState, setState, command) {
  const { sprites, gameOver, animateQueue, mapBounds } = oldState;
  const player = sprites.getPlayer();
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
      levelComplete: true,
      movedSprites: [player],
      sprites: sprites.move(player, newPlayer),
    });
  }

  if (collidingSprite && collidingSprite.spriteType === "teleporter") {
    const teleportDest = sprites.find(
      (a) => a.spriteType === "teleportDestination",
    );
    return oldState.copy({
      projection: oldState.projection.recenter(teleportDest),
      movedSprites: [player],
      sprites: sprites.move(player, teleportDest),
    });
  }

  if (collidingSprite && collidingSprite.impassible) {
    return oldState;
  }

  if (collidingSprite && collidingSprite.canBeTrampled) {
    return oldState.copy({
      sprites: sprites
        .removeAt(newPlayer)
        .moveAndUpdate(player, newPlayer.addScore(collidingSprite.score)),
      movedSprites: [player, collidingSprite],
    });
  }

  if (collidingSprite && collidingSprite.death) {
    return oldState.copy({
      movedSprites: [player, collidingSprite],
      gameOver: true,
      gameOverReason: collidingSprite.gameOverReason,
      sprites: sprites.move(player, newPlayer),
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
    movedSprites: [player],
    sprites: sprites.move(player, newPlayer),
  });
}
