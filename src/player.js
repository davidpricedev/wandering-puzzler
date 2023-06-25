import { Sprite } from "./sprite";

export class Player extends Sprite {
  color = "red";
  spriteType = "player";
  score = 0;
  char = "P";
  moves = 0;

  static from(x, y) {
    return Player.create({
      x,
      y,
    });
  }

  addScore(score) {
    return this.copy({ score: this.score + score });
  }

  draw(ctx, projection, assets) {
    drawPlayer(ctx, projection, assets, this);
  }

  moveTo(pos) {
    return this.copy({ x: pos.x, y: pos.y, moves: this.moves + 1 });
  }
}

function drawPlayer(ctx, projection, assets, sprite) {
  const scalex = 1;
  const {
    x,
    y,
    width: cellW,
    height: cellH,
  } = projection.translateAndScale(sprite);
  // ctx.strokeStyle = "white";
  // ctx.strokeRect(x, y, width, height);
  ctx.drawImage(
    assets.player,
    x + cellW * 0.5 * (1 - scalex), // adjust start to center the scaled image
    y,
    cellW * scalex,
    cellH,
  );
}
