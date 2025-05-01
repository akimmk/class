import * as React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Mediaclass from "./pages/Mediaclass.jsx";

const root = createRoot(document.body);

const App = () => {
  return <Mediaclass />;
};

root.render(<App />);
