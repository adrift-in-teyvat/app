import '../index.css';
import * as PIXI from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import { useEffect, useState } from 'react';

const maxZoomLevel = 6;

const giMapTiles =
  'https://cdn.jsdelivr.net/gh/adrift-in-teyvat/map-tiles@main';
const zoomLevelLinks = ['10', '11', '12', '13', '14', '15'];
const teyvatTiles = `${giMapTiles}/teyvat`;
let currentZoom = 0;

export function Map() {
  useEffect(() => {
    const app = new PIXI.Application();
    app
      .init({
        background: '#1f1e33',
        resizeTo: document.body,
        antialias: true,
        autoDensity: true,
        resolution: window.devicePixelRatio,
      })
      .then(() => {
        const container = document.getElementById(
          'map-container'
        ) as HTMLDivElement;
        container.appendChild(app.canvas);

        const viewport = new Viewport({
          screenWidth: window.innerWidth,
          screenHeight: window.innerHeight,
          events: app.renderer.events,
        });

        app.stage.addChild(viewport);
        viewport.drag().pinch().wheel().decelerate();

        const wTiles = Math.ceil(viewport.width / 256);
        const hTiles = Math.ceil(viewport.height / 256);

        for (let i = 0; i <= hTiles; i++) {
          let x = viewport.left; // Resets each time this loop restarts, but the nested for loop will be able to add onto it
          let y = viewport.top + i * 256; // Placing tiles from the top down, we'd be subtracting

          for (let j = 0; j <= wTiles; j++) {
            const url = `${teyvatTiles}/${zoomLevelLinks[currentZoom]}/${Math.ceil(x / 256)}_${Math.ceil(y / 256)}.jpg`;
            console.log(url);
            async () => {
              const texture = await PIXI.Assets.load(url);
              const sprite = new PIXI.Sprite(texture);
              const vpSprite = viewport.addChild(sprite);
              vpSprite.position.set(x, y);
              x += 256;
            };
          }
        }
      });
  }, []);

  return (
    <>
      <div
        id="map-container"
        className="w-screen h-screen overflow-hidden"
      ></div>
    </>
  );
}
