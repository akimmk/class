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
  entry: "./src/index.jsx", // Updated entry point for React
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "renderer.bundle.js", // Output for renderer
  },
  target: "electron-renderer", // Use 'electron-renderer' target
  module: {
    rules: [
      {
        test: /\.jsx?$/, // Support .js and .jsx files
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react"], // Add React preset
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"], // Resolve .jsx files
    alias: {
      "mediasoup-client": path.resolve(
        __dirname,
        "node_modules/mediasoup-client"
      ), // Ensure it is resolved correctly
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(
        process.env.NODE_ENV || "development"
      ),
    }),
  ],
};

// Export both configurations
module.exports = [rendererConfig];
