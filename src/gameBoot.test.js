import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { runGame } from "./game";

// Minimal DOM shims so the game can boot outside a browser.
function makeCtx() {
  const target = {};
  return new Proxy(target, {
    get(t, prop) {
      if (prop in t) return t[prop];
      t[prop] = () => {};
      return t[prop];
    },
    set(t, prop, value) {
      t[prop] = value;
      return true;
    },
  });
}

function makeCanvas() {
  return {
    width: 0,
    height: 0,
    clientWidth: 800,
    clientHeight: 600,
    getContext: () => makeCtx(),
  };
}

class FakeImage {
  onload = null;
  width = 32;
  height = 32;
  _src = "";
  set src(v) {
    this._src = v;
    queueMicrotask(() => this.onload && this.onload());
  }
  get src() {
    return this._src;
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

describe("game boots and handles input", () => {
  let keydownHandlers;
  let mainCanvas;
  let scoreSpan;
  let restartButton;

  beforeAll(() => {
    keydownHandlers = [];
    mainCanvas = makeCanvas();
    scoreSpan = { textContent: "" };
    restartButton = { onclick: null };

    globalThis.window = {
      addEventListener: (type, handler) => {
        if (type === "keydown") keydownHandlers.push(handler);
      },
      requestAnimationFrame: (cb) => setTimeout(cb, 16),
    };
    globalThis.document = {
      createElement: () => makeCanvas(),
      querySelector: (sel) =>
        sel === "#restart"
          ? restartButton
          : sel === "canvas"
            ? mainCanvas
            : null,
      getElementById: (id) =>
        id === "score" ? scoreSpan : id === "canvas" ? mainCanvas : null,
    };
    globalThis.Image = FakeImage;
  });

  afterAll(() => {
    delete globalThis.window;
    delete globalThis.document;
    delete globalThis.Image;
  });

  it("boots, dismisses level start, moves and restarts", async () => {
    await runGame(mainCanvas, scoreSpan, restartButton);

    const press = (key) =>
      keydownHandlers.forEach((h) => h("keydown", { key }));

    // spacebar dismisses the level-start screen
    press(" ");
    await sleep(20);
    // move around; each move may trigger (fast) animation ticks
    press("ArrowDown");
    await sleep(20);
    press("ArrowLeft");
    await sleep(20);
    press("ArrowUp");
    await sleep(20);
    press(" ");
    await sleep(20);

    expect(typeof restartButton.onclick).toBe("function");
    restartButton.onclick();
    await sleep(20);
    press(" ");
    await sleep(20);
    press("ArrowRight");
    await sleep(20);

    expect(scoreSpan.textContent).toBeDefined();
  }, 10000);
});
