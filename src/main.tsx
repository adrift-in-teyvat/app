import { LocationProvider, Router, Route, hydrate, prerender as ssr } from "preact-iso";

import "./index.css";
import Home from "./routes/Home/Home.tsx";
import Game from "./routes/Game/Game.tsx";

export const App = () => {
  return (
    <LocationProvider>
      <main>
        <Router>
          <Route path="/" component={Home} />
          <Route path="/game" component={Game} />
        </Router>
      </main>
    </LocationProvider>
  );
};

if (typeof window !== "undefined") {
  hydrate(<App />, document.getElementById("app")!);
}

export async function prerender(data: Record<string, any>) {
  return await ssr(<App {...data} />);
}
