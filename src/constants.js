export const gridSize = 50;

// export const gridColor = "#027102";
export const gridColor = "rgb(0, 0, 0, .2)";

export const grassColor = "#047304";

export const directionMap = {
  up: { type: "move", direction: "up", x: 0, y: -1 },
  down: { type: "move", direction: "down", x: 0, y: 1 },
  left: { type: "move", direction: "left", x: -1, y: 0 },
  right: { type: "move", direction: "right", x: 1, y: 0 },
};

export const tickInterval = 150;

export const fastTickInterval = 0;

export const charToType = {
  "#": "wall",
  "@": "player",
  ":": "shrubbery",
  "!": "cactus",
  "*": "coin",
  "/": "rightLeanWall",
  "\\": "leftLeanWall",
  O: "rock",
  ">": "rightArrow",
  "<": "leftArrow",
  X: "flag",
};

export const charAliases = {
  "=": "#",
  "-": "#",
};
