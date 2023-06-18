import { runGame } from "./src/game.js";

function startGame() {
  const restartButton = document.querySelector("#restart");
  const helpButton = document.querySelector("#help");
  const scoreSpan = document.getElementById("score");
  const canvas = document.querySelector("canvas");

  // Fix canvas size
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  // const canvasHeight = dimensions ? dimensions.h : window.innerHeight;
  // const canvasWidth = dimensions ? dimensions.w : window.innerWidth;
  // const ratio = window.devicePixelRatio;

  // // fill screen with canvas
  // canvas.width = canvasWidth * ratio;
  // canvas.height = canvasHeight * ratio;
  // canvas.style.width = canvasWidth + "px";
  // canvas.style.height = canvasHeight + "px";

  runGame(canvas, scoreSpan, restartButton);
  helpButton.onclick = () => {
    alert("not implemented yet");
  };
}

startGame();
