const handlers = [];

export const KEY_MAP = {
  // arrow keys
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  // wasd/gaming keys
  w: "up",
  s: "down",
  a: "left",
  d: "right",
  // vim keys
  h: "left",
  j: "down",
  k: "up",
  l: "right",
  // Meta keys
  Escape: "restart",
  "-": "zoomOut",
  _: "zoomOut",
  "=": "zoomIn",
  "+": "zoomIn",
};

export function keyboardSetup() {
  window.addEventListener("keydown", (ev) => {
    handlers.forEach((handle) => {
      handle("keydown", ev);
    });
  });
  window.addEventListener("keyup", (ev) => {
    handlers.forEach((handle) => {
      handle("keyup", ev);
    });
  });
  window.addEventListener("keypress", (ev) => {
    handlers.forEach((handle) => {
      handle("keypress", ev);
    });
  });
}

export function subscribe(handler) {
  handlers.push(handler);
  return () => {
    const handleIndex = handlers.indexOf(handler);
    handlers.splice(handleIndex, 1);
  };
}

export const handleKeys = (callback) => (type, ev) => {
  if (type === "keypress") {
    return;
  }
  if (!KEY_MAP[ev.key]) {
    return;
  }
  callback(type, KEY_MAP[ev.key]);
};
