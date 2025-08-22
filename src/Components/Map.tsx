import "../index.css";
import * as PIXI from "pixi.js";
import { Viewport } from "pixi-viewport";
import { useEffect } from "preact/hooks";

const giMapTiles = "https://cdn.jsdelivr.net/gh/adrift-in-teyvat/map-tiles@main";
const zoomLevelLinks = ["10", "11", "12", "13", "14", "15"];
const teyvatTiles = `${giMapTiles}/teyvat`;
let currentZoom = 0;

function drawMap(viewport: Viewport) {
  viewport.removeChildren();
  const wTiles = Math.ceil(window.innerWidth / 256);
  const hTiles = Math.ceil(window.innerHeight / 256);
  for (let i = 0; i <= hTiles; i++) {
    let x = viewport.left;
    let y = viewport.bottom - i * 256;

    for (let j = 0; j <= wTiles; j++) {
      const url = `${teyvatTiles}/${zoomLevelLinks[currentZoom]}/${Math.ceil(x / 256)}_${-Math.ceil(y / 256)}.webp`;

      const loadImage = async (targetX: number, targetY: number) => {
        const texture = await PIXI.Assets.load(url);
        const sprite = new PIXI.Sprite(texture);
        const vpSprite = viewport.addChild(sprite);
        vpSprite.position.set(targetX, targetY);
      };
      loadImage(x, y); // No need to wait
      x += 256;
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
        viewport.addListener("drag-end", () => drawMap(viewport));
        viewport.addListener("moved", () => "");
        viewport.addListener("zoomed-end", () => {
          currentZoom = Math.round(viewport.scale.x / 2);
          drawMap(viewport);
        });
        viewport.cullable = true;

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
