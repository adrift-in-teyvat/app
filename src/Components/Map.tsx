import "../index.css";
import * as PIXI from "pixi.js";
import { Viewport } from "pixi-viewport";
import { useEffect } from "preact/hooks";

const giMapTiles = "https://cdn.jsdelivr.net/gh/adrift-in-teyvat/map-tiles@refs/heads/main";
const zoomLevelLinks = ["10", "11", "12", "13", "14", "15"];
const tileRanges = [
  {
    x: [-2, 1],
    y: [-2, 1],
  },
  {
    x: [-4, 3],
    y: [-4, 2],
  },
  {
    x: [-8, 7],
    y: [-8, 5],
  },
  {
    x: [-16, 15],
    y: [-16, 10],
  },
  {
    x: [-32, 31],
    y: [-32, 20],
  },
  {
    x: [-64, 63],
    y: [-64, 41],
  },
];
const zoomLevelSizes = [256, 128, 64, 32, 16, 8];
const teyvatTiles = `${giMapTiles}/teyvat`;
let currentZoom = 0;

function drawMap(viewport: Viewport) {
  viewport.removeChildren();
  const xMin = Math.floor(viewport.left / zoomLevelSizes[currentZoom]);
  const xMax = Math.ceil(viewport.right / zoomLevelSizes[currentZoom]);
  const yMin = Math.floor(viewport.top / zoomLevelSizes[currentZoom]);
  const yMax = Math.ceil(viewport.bottom / zoomLevelSizes[currentZoom]);
  const xCount = xMax - xMin;
  const yCount = yMax - yMin;
  const xTiles = Array.from({ length: xCount * 2 + 1 }, (_, i) => xMin + i).filter((n) => {
    const [min, max] = tileRanges[currentZoom].x;
    return n >= min && n <= max;
  });
  const yTiles = Array.from({ length: yCount * 2 + 1 }, (_, i) => -1 * (yMin + i)).filter((n) => {
    const [min, max] = tileRanges[currentZoom].y;
    return n >= min && n <= max;
  });
  for (const x of xTiles) {
    let xPos = zoomLevelSizes[currentZoom] * x;

    for (const y of yTiles) {
      const yPos = -1 * zoomLevelSizes[currentZoom] * (y + 1);

      const url = `${teyvatTiles}/${zoomLevelLinks[currentZoom]}/${x}_${y}.jpg`;

      (async (z) => {
        await PIXI.Assets.load(url);
        if (z !== currentZoom) {
          return;
        }
        const tile = new PIXI.Graphics();
        tile.texture(PIXI.Assets.get(url));
        viewport.addChild(tile);
        tile.position.set(xPos, yPos);
        tile.setSize(zoomLevelSizes[currentZoom], zoomLevelSizes[currentZoom]);
      })(currentZoom);
    }
  }
}

export function Map() {
  useEffect(() => {
    const app = new PIXI.Application();
    app
      .init({
        background: "#000000",
        resizeTo: document.body,
        antialias: true,
        autoDensity: true,
        resolution: window.devicePixelRatio,
      })
      .then(() => {
        const container = document.getElementById("map-container") as HTMLDivElement;
        container.appendChild(app.canvas);

        const viewport = new Viewport({
          screenWidth: window.innerWidth,
          screenHeight: window.innerHeight,
          events: app.renderer.events,
        });
        let isDragging = false;
        viewport.addListener("drag-start", () => {
          isDragging = true;
        });
        viewport.addListener("drag-end", () => {
          isDragging = false;
        });
        viewport.addListener("pointermove", () => {
          drawMap(viewport);
        });
        viewport.addListener("zoomed-end", () => {
          currentZoom = Math.max(0, Math.min(5, Math.round((viewport.scale.x + 2) / 4)));
          drawMap(viewport);
        });

        app.stage.addChild(viewport);
        viewport.drag().pinch().wheel().decelerate().setZoom(1).clampZoom({ maxScale: 12, minScale: 0 });
        drawMap(viewport);
      });
  }, []);

  return (
    <>
      <div id="map-container" className="w-screen h-screen overflow-hidden" />
    </>
  );
}
