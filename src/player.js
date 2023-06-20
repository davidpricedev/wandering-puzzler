import { Sprite } from "./sprite";

export class Player extends Sprite {
  color = "red";
  spriteType = "player";
  score = 0;
  char = "P";

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
}

function drawPlayer(ctx, projection, assets, sprite) {
  const scalex = 0.65;
  const { x, y, width, height } = projection.translateAndScale(sprite);
  ctx.strokeStyle = "white";
  ctx.strokeRect(x, y, width, height);
  ctx.drawImage(
    assets.player,
    x + width * (0.5 - scalex / 2),
    y,
    width * scalex,
    height,
  );
}
