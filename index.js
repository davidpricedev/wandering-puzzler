import { runGame } from "./src/game";

function startGame() {
  const restartButton = document.querySelector("#restart");
  const levelsButton = document.querySelector("#levels");
  const scoreSpan = document.getElementById("score");
  const canvas = document.querySelector("canvas");

  // Fix canvas size
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  runGame(canvas, scoreSpan, restartButton);
  levelsButton.onclick = () => {
    alert("not implemented yet");
    // pull up list of levels to pick from
  };
}

startGame();
