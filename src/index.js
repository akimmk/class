const {
  app,
  BrowserWindow,
  desktopCapturer,
  ipcMain,
  session,
} = require("electron");
const path = require("node:path");
const started = require("electron-squirrel-startup");
const { exec, spawn } = require("child_process");
const { networkInterfaces } = require("os");

// mediasoup-client and socket.io-client logic moved to renderer process

function getIp() {
  const net = networkInterfaces();
  return Object.keys(net);
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    kiosk: false,
    alwaysOnTop: true,
    webPreferences: {
      // Point to the bundled preload script in the 'dist' directory
      preload: path.join(__dirname, "./preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      enableRemoteModule: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "index.html"));

  // const win = new BrowserWindow({
  //   width: wWidth,
  //   height: wHeight,
  //   alwaysOnTop: true,
  //   frame: true,
  // });
  // win.loadURL("data:text/html,<h1>Embedded App Test</h1>");
  //
  // win.once("ready-to-show", () => {
  //   setTimeout(() => {
  //     xid = win.getNativeWindowHandle().readUInt32LE(0); // Get native XID
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
  //         exec(
  //           `xdotool windowsize ${appWindowId} ${wWidth} ${wHeight}`,
  //           (err) => {
  //             if (err) {
  //               console.error("Failed to resize app:", err);
  //             } else {
  //               console.log("Successfully embedded resized inside Electron.");
  //             }
  //           },
  //         );
  //       });
  //     }, 3000); // Wait for the app to start
  //   }, 2000);
  // });

  // win.on("resize", () => {
  //   const [width, height] = win.getSize(); // Get new size of the window
  //   console.log(`Window resized: ${width}x${height}`);
  //   xid = win.getNativeWindowHandle().readUInt32LE(0); // Get native XID
  //   exec("xdotool search --onlyvisible --class vlc", (err, stdout) => {
  //     if (err || !stdout) {
  //       console.error("Failed to find Firefox window:", err);
  //       return;
  //     }
  //     appWindowId = stdout.trim().split("\n")[0]; // Ensure only the first window ID is used
  //
  //     // Adjust the size of the embedded app (Firefox) to match the resized window
  //     exec(`xdotool windowsize ${appWindowId} ${width} ${height}`, (err) => {
  //       if (err) {
  //         console.error("Failed to resize embedded app:", err);
  //       } else {
  //         console.log("Embedded app resized to match window.");
  //       }
  //     });
  //
  //     exec(`xdotool windowreparent ${appWindowId} ${xid}`, (err) => {
  //       if (err) {
  //         console.error("Failed to embed app:", err);
  //       } else {
  //         console.log("Successfully embedded app inside Electron.");
  //       }
  //     });
  //   });
  // });
  //
  // win.on("close", () => {
  //   appProcess.kill();
  // });
  //
  // win.on("minimize", () => {
  //   // TODO: add icon on mainWindow taskbar
  // });
  //
  // mainWindow.on("close", () => {
  //   win.close();
  // });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  ipcMain.handle("getIp", getIp);
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
  // ipcMain.handle("getRtpCapabilities", getRtpCapabilities); // Register the handler
  // ipcMain.handle("createDevice", createDevice);
  createWindow();
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
