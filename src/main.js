const {
  app,
  BrowserWindow,
  ipcMain,
  session,
  desktopCapturer,
} = require("electron");
const path = require("node:path");
const { exec, spawn } = require("child_process");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: true,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  //Remove the default menu bar
  mainWindow.removeMenu();

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // const kioskWindow = new BrowserWindow({
  //   width: 800,
  //   height: 600,
  //   webPreferences: {
  //     preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
  //     nodeIntegration: true,
  //   },
  // });
  //
  // // and load the index.html of the app.
  // kioskWindow.loadURL(KIOSK_WINDOW_WEBPACK_ENTRY);
  //
  // // kioskWindow.loadURL("data:text/html,<h1>Embedded App Test</h1>");
  // //Remove the default menu bar
  // kioskWindow.removeMenu();
  //
  // kioskWindow.once("ready-to-show", () => {
  //   setTimeout(() => {
  //     xid = kioskWindow.getNativeWindowHandle().readUInt32LE(0); // Get native XID
  //     console.log("Found XID:", xid);
  //
  //     // Launch Firefox inside the Electron window (as an example)
  //     appProcess = spawn("firefox");
  //
  //     setTimeout(() => {
  //       // Get the window ID of the newly launched Firefox window
  //       exec("xdotool search --onlyvisible --class firefox", (err, stdout) => {
  //         if (err || !stdout) {
  //           console.error("Failed to find Firefox window:", err);
  //           return;
  //         }
  //
  //         appWindowId = stdout.trim().split("\n")[0]; // Ensure only the first window ID is used
  //         console.log("Found App Window ID:", appWindowId);
  //
  //         // Reparent Firefox inside Electron
  //         exec(`xdotool windowreparent ${appWindowId} ${xid}`, (err) => {
  //           if (err) {
  //             console.error("Failed to embed app:", err);
  //           } else {
  //             console.log("Successfully embedded app inside Electron.");
  //           }
  //         });
  //
  //         exec(`xdotool windowsize ${appWindowId} 400 300`, (err) => {
  //           if (err) {
  //             console.error("Failed to resize app:", err);
  //           } else {
  //             console.log("Successfully embedded resized inside Electron.");
  //           }
  //         });
  //       });
  //     }, 3000); // Wait for the app to start
  //   }, 2000);
  // });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  ipcMain.handle("getScreenSources", async () => {
    const sources = await desktopCapturer.getSources({
      types: ["window", "screen"],
      thumbnailSize: { width: 320, height: 240 },
    });

    // Convert native images to data URLs (e.g., base64) so they can be used in renderer
    return sources.map((source) => ({
      id: source.id,
      name: source.name,
      thumbnail: source.thumbnail.toDataURL(),
    }));
  });

  createWindow();

  // ipcMain.handle("startKiosk", () => {
  //   if (!kioskWindow) {
  //     createKioskWindow();
  //   } else {
  //     kioskWindow.focus();
  //   }
  // });

  session.defaultSession.setDisplayMediaRequestHandler(
    (request, callback) => {
      desktopCapturer
        .getSources({ types: ["window", "screen"] })
        .then((sources) => {
          // Grant access to the first screen found.
          console.log(sources);
          callback({ video: sources[0], audio: "loopback" });
        });
      // If true, use the system picker if available.
      // Note: this is currently experimental. If the system picker
      // is available, it will be used and the media request handler
      // will not be invoked.
    },
    { useSystemPicker: true },
  );
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
