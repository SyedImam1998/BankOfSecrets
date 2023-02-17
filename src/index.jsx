import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { Buffer } from 'buffer';
// globalThis.Buffer = Buffer;

const container = document.getElementById("root");

const root = createRoot(container);
// (window as any).process = { env: { DEBUG: undefined }, };

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);