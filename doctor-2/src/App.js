import React from "react";
import { Routes } from './routes'
import { ResetCss } from "./styles/reset-css";
import { PopupProvider } from "./contexts/popup";

function App() {
  return (
    <PopupProvider>
      <Routes />
      <ResetCss />
    </PopupProvider>
  );
}

export default App;
