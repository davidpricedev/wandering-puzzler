import * as R from "ramda";
import { Data } from "dataclass";
import { Point, Box } from "./point";
import { defaultZoom } from "./constants";

// point.subtract(viewCenter).subtract(halfCellSize).scale(cellSize).add(canvasCenter);
// translate and scale a map coord into a canvas coord relative to the canvas/view center
const translateAndScale =
  (viewCenter, cellW, cellH, canvasCenter) =>
  ({ x, y }) => ({
    x: Math.floor((x - viewCenter.x - 0.5) * cellW + canvasCenter.x),
    y: Math.floor((y - viewCenter.y - 0.5) * cellH + canvasCenter.y),
    width: cellW,
    height: cellH,
  });

/**
 * Contains all the information needed to project the game onto the canvas.
 * Tracks position of the map relative to the canvas, and any clipping around the edges of the map
 */
export class Projection extends Data {
  canvas = null;
  mapBounds = null;
  canvasCenter = null;
  mapViewCenter = null;
  cellW = 0;
  cellH = 0;
  canvasW = 0;
  canvasH = 0;
  // the part of the canvas that we will paint the game onto
  canvasViewport = null;
  // the part of the map that we will paint onto the canvas
  mapViewport = null;
  // canvasViewport clipped to the part of the map that we will be displaying
  clippedCanvasViewport = null;
  _translateAndScale = null;

  static buildOnCenter(canvas, mapBounds, zoom, viewCenter) {
    const canvasCenter = getCenter(canvas);
    const cellSize = getCellSize(canvas, zoom);
    const canvasViewport = getCanvasViewport(canvas, cellSize);
    const mapViewport = getMapViewport(canvasViewport, cellSize, viewCenter);
    const _translateAndScale = translateAndScale(
      viewCenter,
      cellSize,
      cellSize,
      canvasCenter,
    );
    const clippedCanvasViewport = Box.fromPoints([
      // top left
      _translateAndScale({
        x: Math.max(0, mapViewport.left),
        y: Math.max(0, mapViewport.top),
      }),
      // bottom right
      _translateAndScale({
        x: Math.min(mapBounds.width(), mapViewport.right + 1),
        y: Math.min(mapBounds.height(), mapViewport.bottom + 1),
      }),
    ]);
    return Projection.create({
      canvas,
      mapBounds,
      canvasCenter,
      mapViewCenter: viewCenter,
      cellW: cellSize,
      cellH: cellSize,
      canvasW: canvas.width,
      canvasH: canvas.height,
      canvasViewport,
      mapViewport,
      clippedCanvasViewport,
      _translateAndScale,
    });
  }

  recenter(viewCenter) {
    return Projection.buildOnCenter(
      this.canvas,
      this.mapBounds,
      this.zoom,
      viewCenter,
    );
  }

  zoomTo(zoom) {
    return Projection.buildOnCenter(
      this.canvas,
      this.mapBounds,
      zoom,
      this.mapViewCenter,
    );
  }

  translateAndScale(point) {
    return this._translateAndScale(point);
  }
}

const getCenter = (canvas) =>
  Point.of(Math.round(canvas.width / 2), Math.round(canvas.height / 2));

const getCellSize = (canvas, zoom = defaultZoom) => {
  const sx = Math.floor(canvas.width / zoom.x);
  const sy = Math.floor(canvas.height / zoom.y);
  return Math.min(sx, sy);
};

const getCanvasViewport = (canvas, cellSize) => {
  const halfCellSize = Math.floor(cellSize / 2);
  const topLeft = getCenter(canvas)
    // move to top-left of central grid cell
    .subtract(Point.of(halfCellSize, halfCellSize))
    // left over amount from whole grid cells between canvas (0,0) and top-left of central grid cell
    .modulo(cellSize);
  return Box.create({
    left: topLeft.x,
    top: topLeft.y,
    right:
      topLeft.x + cellSize * Math.floor((canvas.width - topLeft.x) / cellSize),
    bottom:
      topLeft.y + cellSize * Math.floor((canvas.height - topLeft.y) / cellSize),
  });
};

const getMapViewport = (canvasViewport, cellSize, viewCenter) =>
  Box.fromCenter(
    viewCenter,
    Math.floor((0.5 * canvasViewport.width()) / cellSize),
    Math.floor((0.5 * canvasViewport.height()) / cellSize),
  );

// const getClippedCanvasViewport = ({ mapViewport, mapBounds }) => {
//   const { mapViewport: mv, mapBounds } = projection;
//   const topLeft = projection.translateAndScale({
//     x: Math.max(0, mv.left),
//     y: Math.max(0, mv.top),
//   });
//   const bottomRight = projection.translateAndScale({
//     x: Math.min(mapBounds.width(), mv.right + 1),
//     y: Math.min(mapBounds.height(), mv.bottom + 1),
//   });

//   return Box.fromPoints([topLeft, bottomRight]);
// };
