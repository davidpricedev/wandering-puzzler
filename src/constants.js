import { Point } from "./point";

export const gridColor = "rgb(0, 0, 0, .06)";

export const grassColor = "#047304";
export const wallColor = "#444";

export const cardinalDirectionMap = {
  up: { type: "move", direction: "up", x: 0, y: -1 },
  down: { type: "move", direction: "down", x: 0, y: 1 },
  left: { type: "move", direction: "left", x: -1, y: 0 },
  right: { type: "move", direction: "right", x: 1, y: 0 },
};

export const allDirections = [
  Point.left(),
  Point.right(),
  Point.up(),
  Point.down(),
  Point.upLeft(),
  Point.upRight(),
  Point.downLeft(),
  Point.downRight(),
];

export const tickInterval = 80;

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
  X: "exit",
  A: "teleportDestination",
  T: "teleporter",
};

export const charAliases = {
  "=": "#",
  "-": "#",
};

export const defaultZoom = Point.of(11, 7);

export const zoomChange = Point.of(2, 2);
