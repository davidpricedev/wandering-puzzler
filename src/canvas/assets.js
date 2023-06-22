import * as R from "ramda";

export async function loadAssets() {
  const imagesToLoad = [
    ["rock", "assets/rock.svg"],
    ["arrow", "assets/arrow.svg"],
    ["player", "assets/player.svg"],
    ["cactus", "assets/bomb.svg"],
    ["shrubbery", "assets/shrub.svg"],
    ["wall", "assets/wallTexture.png"],
    ["coin", "assets/coin.svg"],
    ["exit", "assets/exit.svg"],
    ["teleporter", "assets/teleporter.svg"],
    ["teleportDestination", "assets/teleportDestination.svg"],
  ];
  const imgs = await Promise.all(
    imagesToLoad.map(([k, src]) => {
      const img = new Image();
      img.src = src;
      return new Promise((resolve) => {
        img.onload = () => resolve({ [k]: img });
      });
    }),
  );
  return R.reduce((acc, img_1) => ({ ...acc, ...img_1 }), {}, imgs);
}
