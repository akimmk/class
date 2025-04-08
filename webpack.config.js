const path = require("path");
const webpack = require("webpack");

// Separate config for preload script
const preloadConfig = {
  entry: "./src/preload.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "preload.bundle.js",
  },
  target: "electron-preload", // Use 'electron-preload' target
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader", // Assuming you might want Babel for preload too
        },
      },
    ],
  },
  // Add node externals if preload needs Node built-ins directly
  // externals: [require('webpack-node-externals')()],
};

// Separate config for renderer script
const rendererConfig = {
  entry: "./src/render.js", // Entry point for renderer
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "renderer.bundle.js", // Output for renderer
  },
  target: "electron-renderer", // Use 'electron-renderer' target
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  resolve: {
    alias: {
      "mediasoup-client": path.resolve(
        __dirname,
        "node_modules/mediasoup-client",
      ), // Ensure it is resolved correctly
    },
  },
  // Add plugins if needed, e.g., HtmlWebpackPlugin
  plugins: [
    // Define process.env variables if needed by dependencies
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(
        process.env.NODE_ENV || "development",
      ),
    }),
  ],
  // Add node polyfills if needed for browser compatibility in renderer
  resolve: {
    fallback: {
      os: require.resolve("os-browserify/browser"),
      path: require.resolve("path-browserify"),
      buffer: require.resolve("buffer/"),
      // Add other Node core modules polyfills if needed by dependencies
    },
  },
};

// Export both configurations
module.exports = [rendererConfig];
