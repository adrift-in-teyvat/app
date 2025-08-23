import "../index.css";
import * as PIXI from "pixi.js";
import { Viewport } from "pixi-viewport";
import { useEffect } from "preact/hooks";
import { throttle } from "../utils/throttle";

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

class MapTile extends PIXI.Graphics {
  promiseReject: (reason?: string) => void;
  constructor(parent: PIXI.Container, url: string, x: number, y: number, size: number) {
    super();

    this.promiseReject = () => {};
    (async () => {
      try {
        await new Promise<void>((resolve, reject) => {
          this.promiseReject = reject;
          (async () => {
            await PIXI.Assets.load(url);
            this.texture(PIXI.Assets.get(url), 0xffffff, x, y, size, size);
            this.alpha = 0;
            parent.addChild(this);

            const fadeIn = (time?: number, prevTime?: number) => {
              if (time && prevTime) {
                this.alpha += (time - prevTime) / 200;
              }
              if (this.alpha < 1) {
                requestAnimationFrame((t) => fadeIn(t, time));
              } else {
                this.alpha = 1;
              }
            };
            fadeIn();
          })()
            .then(() => {
              resolve();
              this.promiseReject = () => {};
            })
            .catch(() => {
              reject();
              this.promiseReject = () => {};
            });
        });
      } catch {}
    })();
  }

  delete() {
    try {
      this.promiseReject();
      this.destroy();
    } catch {}
  }
}

let currentZoom = 0;
// stored in form of `${zoomLevel}_${x}_${y}`
const tiles: Record<string, MapTile> = {};

const drawMap = (viewport: Viewport, layers: PIXI.Container[], zoom: number) => {
  const xMin = Math.floor(viewport.left / zoomLevelSizes[zoom]);
  const xMax = Math.ceil(viewport.right / zoomLevelSizes[zoom]);
  const yMin = Math.floor(viewport.top / zoomLevelSizes[zoom]);
  const yMax = Math.ceil(viewport.bottom / zoomLevelSizes[zoom]);
  const xCount = xMax - xMin;
  const yCount = yMax - yMin;
  const xTiles = Array.from({ length: xCount * 2 + 1 }, (_, i) => xMin + i).filter((n) => {
    const [min, max] = tileRanges[zoom].x;
    return n >= min && n <= max;
  });
  const yTiles = Array.from({ length: yCount * 2 + 1 }, (_, i) => -1 * (yMin + i))
    .map((n) => (n === 0 ? 0 : n))
    .filter((n) => {
      const [min, max] = tileRanges[zoom].y;
      return n >= min && n <= max;
    });

  for (const [key, tile] of Object.entries(tiles)) {
    if (parseInt(key.split("_")[0]) !== zoom) {
      continue;
    }
    if (!xTiles.includes(parseInt(key.split("_")[1])) || !yTiles.includes(parseInt(key.split("_")[2]))) {
      tile.delete();
      delete tiles[key];
    }
  }

  const urls = [];
  for (const x of xTiles) {
    for (const y of yTiles) {
      urls.push(`${teyvatTiles}/${zoomLevelLinks[zoom]}/${x}_${y}.jpg`);
    }
  }
  PIXI.Assets.load(urls);
  for (const x of xTiles) {
    let xPos = zoomLevelSizes[zoom] * x;

    for (const y of yTiles) {
      const yPos = -1 * zoomLevelSizes[zoom] * (y + 1);

      const url = `${teyvatTiles}/${zoomLevelLinks[zoom]}/${x}_${y}.jpg`;

      if (!tiles[`${zoom}_${x}_${y}`]) {
        tiles[`${zoom}_${x}_${y}`] = new MapTile(layers[zoom], url, xPos, yPos, zoomLevelSizes[zoom]);
      }
    }
  }
};
const batchDrawMap = (viewport: Viewport, layers: PIXI.Container[], zoom: number) => {
  for (const i in layers) {
    layers[i].visible = zoom >= +i;
  }
  for (let i = 0; i <= zoom; i++) {
    drawMap(viewport, layers, i);
  }
};
const throttledDrawMap = throttle(batchDrawMap, 300, true);

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
          allowPreserveDragOutside: true,
          screenWidth: window.innerWidth,
          screenHeight: window.innerHeight,
          events: app.renderer.events,
        });

        const layers: PIXI.Container[] = [];
        for (const i in zoomLevelSizes) {
          layers[i] = new PIXI.Container();
          viewport.addChild(layers[i]);
        }

        let isDragging = false;
        viewport.addListener("drag-start", () => {
          isDragging = true;
        });
        viewport.addListener("drag-end", () => {
          isDragging = false;
        });
        viewport.addListener("pointermove", () => {
          if (isDragging) {
            throttledDrawMap(viewport, layers, currentZoom);
          }
        });
        viewport.addListener("zoomed-end", () => {
          currentZoom = Math.max(0, Math.min(4, Math.floor(Math.sqrt(viewport.scale.x - 1)) + 1));
          throttledDrawMap(viewport, layers, currentZoom);
        });

        app.stage.addChild(viewport);
        viewport
          .drag()
          .pinch()
          .wheel({
            smooth: 10,
          })
          .decelerate()
          .setZoom(1)
          .clampZoom({ maxScale: 18, minScale: 1 });
        app.renderer.addListener("resize", () => {
          viewport.screenHeight = window.innerHeight;
          viewport.screenWidth = window.innerWidth;
        });

        drawMap(viewport, layers, currentZoom);
        setInterval(() => {
          if (!viewport.moving) return;
          throttledDrawMap(viewport, layers, currentZoom);
        }, 300);
        setInterval(() => {
          throttledDrawMap(viewport, layers, currentZoom);
        }, 1000);
      });
  }, []);

  return (
    <>
      <div id="map-container" className="w-screen h-screen overflow-hidden" />
    </>
  );
}
