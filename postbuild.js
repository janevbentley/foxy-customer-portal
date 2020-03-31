const fs = require("fs");
const path = require("path");

fs.copyFileSync(
  path.resolve(__dirname, "package.json.bak"),
  path.resolve(__dirname, "package.json")
);

fs.unlinkSync(
  path.resolve(__dirname, "package.json.bak")
);
