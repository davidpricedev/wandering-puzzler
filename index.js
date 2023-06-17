import { runGame } from "./src/game.js";

function startGame() {
  const restartButton = document.querySelector("#restart");
  const helpButton = document.querySelector("#help");
  const scoreSpan = document.getElementById("score");
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  runGame(canvas, ctx, scoreSpan, restartButton);
  helpButton.onclick = () => {
    alert("not implemented yet");
  };
}

startGame();
