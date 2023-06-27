import { wallColor } from "../constants";

/** draw an SVG or other existing image */
export const drawImage = (ctx, projection, image, sprite) => {
  const { x, y, width, height } = projection.translateAndScale(sprite);
  ctx.drawImage(
    image, // 0, 0, image.width, image.height,
    x,
    y,
    width,
    height,
  );
};

/** draw a filled square and put a texture on top of it */
export function drawWallTile(ctx, projection, assets, sprite) {
  const { color } = sprite;
  ctx.fillStyle = color;
  const { x, y, width, height } = projection.translateAndScale(sprite);
  ctx.fillRect(x, y, width, height);
  ctx.drawImage(assets.wall, x, y, width, height);
}

/** scale the svg to only take up 1/3 of the vertical space */
export function drawLeftArrowTile(ctx, projection, assets, sprite) {
  const scaley = 1;
  const { x, y, width, height } = projection.translateAndScale(sprite);
  ctx.drawImage(assets.arrow, x, y, width, height * scaley);
}

/** scale the svg to only take up 1/3 of the vertical space, mirror the arrow around the y axis */
export function drawRightArrowTile(ctx, projection, assets, sprite) {
  const scaley = 1;
  const { x, y, width, height } = projection.translateAndScale(sprite);
  ctx.save();
  ctx.scale(-1, 1);
  // ctx.translate(-sprite.x, sprite.y);
  ctx.drawImage(
    assets.arrow,
    // 0, 0, assets.arrow.width, assets.arrow.height,
    -x - width,
    y,
    width,
    height * scaley,
  );
  ctx.restore();
}

export function drawLeaningWallTile(ctx, projection, assets, sprite) {
  const { x, y, width, height } = projection.translateAndScale(sprite);
  ctx.drawImage(
    getLeaningWallImage(sprite.spriteType, width, assets["wall"]),
    x,
    y,
    width,
    height,
  );
}

/**
 * draw a filled rectangle and put a texture on top of it
 * Use an off-screen canvas to draw everything at a 45% angle
 */
export function getLeaningWallImage(spriteType, scale, image) {
  const scratch = document.createElement("canvas");
  scratch.width = scale;
  scratch.height = scale;
  const ctx = scratch.getContext("2d");
  ctx.fillStyle = wallColor;
  ctx.translate(scale / 2, scale / 2);
  ctx.rotate(spriteType === "leftLeanWall" ? -Math.PI / 4 : Math.PI / 4);
  ctx.translate(-scale / 2, -scale / 2);
  const x = (scale * 3) / 8;
  const w = scale / 4;
  ctx.fillRect(x, -50, w, scale + 300);
  ctx.drawImage(image, x, -50, w, scale + 300);
  ctx.restore();
  return scratch;
}

/**
 * Fallback for when we don't have an svg defined yet for a sprite
 */
export const drawSquare = (ctx, projection, sprite) => {
  const { color, char } = sprite;
  ctx.fillStyle = color;
  const { x, y, width, height } = projection.translateAndScale(sprite);
  ctx.fillRect(x, y, width, height);
  ctx.font = `${width}px serif`;
  ctx.textAlign = "center";
  ctx.fillStyle = "#DDD";
  ctx.fillText(char, x + width * 0.5, y + height * 0.85);
};
