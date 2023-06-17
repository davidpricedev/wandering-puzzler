const handlers = [];

export const KEY_MAP = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  w: "up",
  s: "down",
  a: "left",
  d: "right",
  h: "left",
  j: "down",
  k: "up",
  l: "right",
};

function setup() {
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

setup();
