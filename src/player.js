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
}
