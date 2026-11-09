import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { initAudio, preloadAudio, setMuted } from "@/audio/audioEngine";
import { useGameStore } from "@/store/gameStore";
import "./styles/tokens.css";
import "./styles/themes.css";
import "./styles/base.css";

setMuted(useGameStore.getState().muted);
preloadAudio();

const unlock = () => {
    initAudio();
    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("keydown", unlock);
};

window.addEventListener("pointerdown", unlock);
window.addEventListener("keydown", unlock);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
