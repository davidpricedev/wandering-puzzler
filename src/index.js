import { runGame } from "./game";

function startGame() {
  const restartButton = document.querySelector("#restart");
  const scoreSpan = document.getElementById("score");
  const canvas = document.querySelector("canvas");

  // Fix canvas size
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  runGame(canvas, scoreSpan, restartButton);
}

startGame();
