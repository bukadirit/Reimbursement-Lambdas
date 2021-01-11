const nodeExternals = require("webpack-node-externals");

module.exports = {
  target: "node",
  externals: [
    nodeExternals({
      allowlist: ["uuid"],
    }),
  ],
  mode: "none",
};
