import '../index.css';
import * as PIXI from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import { useEffect } from 'react';

const maxZoomLevel = 6;

const giMapTiles = 'https://cdn.jsdelivr.net/gh/ChakornK/gi-map-tiles@main';
const zoomLevelLinks = ['10', '11', '12', '13', '14', '15'];
const teyvatTiles = `${giMapTiles}/teyvat`;

export function Map() {
  useEffect(() => {
    const app = new PIXI.Application();
    app
      .init({
        background: "#1f1e33",
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

        app.stage.addChild(viewport);
        viewport.drag().pinch().wheel().decelerate();
        console.log("Map Rendered?");
      });
  },[]);

  return (
    <>
      <div id="map-container" className="w-screen h-screen overflow-hidden">

      </div>
    </>
  );
}
