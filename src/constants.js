export const gridSize = 10;

// export const gridColor = "#027102";
export const gridColor = "rgb(0, 0, 0, .02)";

export const grassColor = "#047304";

export const directionMap = {
  up: { type: "move", direction: "up", x: 0, y: -1 },
  down: { type: "move", direction: "down", x: 0, y: 1 },
  left: { type: "move", direction: "left", x: -1, y: 0 },
  right: { type: "move", direction: "right", x: 1, y: 0 },
};

export const tickInterval = 250;

export const fastTickInterval = 100;
