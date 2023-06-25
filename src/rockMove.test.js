import { describe, it, expect } from "vitest";
import { Sprite } from "./sprite";
import { SpriteCollection } from "./sprites";
import { getFallDirection } from "./rockMove";
import { Point } from "./point";

describe("rockMove", () => {
  describe("getFallDirection", () => {
    it("Will be down when there is nothing below", () => {
      const sprites = SpriteCollection.fromSprites([
        Sprite.fromType(100, 100, "player"),
        Sprite.fromType(0, 0, "rock"),
      ]);
      const result = getFallDirection(sprites, Point.of(0, 0));
      expect(result).toEqual(Point.of(0, 1));
    });

    it("Will be downLeft if above a right-leaning wall and left and downleft are empty", () => {
      const sprites = SpriteCollection.fromSprites([
        Sprite.fromType(100, 100, "player"),
        Sprite.fromType(0, 0, "rock"),
        Sprite.fromType(0, 1, "rightLeanWall"),
      ]);
      const result = getFallDirection(sprites, Point.of(0, 0));
      expect(result).toEqual(Point.of(-1, 1));
    });

    it("Will be downRight if above a left-leaning wall and right and downRight are empty", () => {
      const sprites = SpriteCollection.fromSprites([
        Sprite.fromType(100, 100, "player"),
        Sprite.fromType(0, 0, "rock"),
        Sprite.fromType(0, 1, "leftLeanWall"),
      ]);
      const result = getFallDirection(sprites, Point.of(0, 0));
      expect(result).toEqual(Point.of(1, 1));
    });

    it("Will be false if above a left-leaning wall and right is not empty", () => {
      const sprites = SpriteCollection.fromSprites([
        Sprite.fromType(100, 100, "player"),
        Sprite.fromType(0, 0, "rock"),
        Sprite.fromType(0, 1, "leftLeanWall"),
        Sprite.fromType(1, 0, "shrubbery"),
      ]);
      const result = getFallDirection(sprites, Point.of(0, 0));
      expect(result).toBeFalsy();
    });

    it("Will be downRight if above a right-leaning wall and left is not empty", () => {
      const sprites = SpriteCollection.fromSprites([
        Sprite.fromType(100, 100, "player"),
        Sprite.fromType(0, 0, "rock"),
        Sprite.fromType(0, 1, "rightLeanWall"),
        Sprite.fromType(-1, 0, "shrubbery"),
      ]);
      const result = getFallDirection(sprites, Point.of(0, 0));
      expect(result).toBeFalsy();
    });
  });
});
