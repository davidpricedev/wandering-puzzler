import { runGame } from "./src/game.js";

function startGame() {
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  runGame(canvas, ctx);
}

startGame();
