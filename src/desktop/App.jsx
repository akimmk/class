import React, { useState } from "react";
import { AppDrawer } from "./components/AppDrawer.jsx";
import { Desktop } from "./components/Desktop.jsx";
import { Taskbar } from "./components/Taskbar.jsx";

const App = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="h-screen w-screen flex bg-gray-100 relative">
      <Desktop />
      <Taskbar onStartClick={() => setDrawerOpen((open) => !open)} />
      {drawerOpen && <AppDrawer />}
    </div>
  );
};

export default App;
