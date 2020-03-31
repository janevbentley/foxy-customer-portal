const fs = require("fs");
const path = require("path");

fs.copyFileSync(
  path.resolve(__dirname, "package.json"),
  path.resolve(__dirname, "package.json.bak")
);
  
const package = JSON.parse(fs.readFileSync(
  path.resolve(__dirname, "package.json"),
  { encoding: "utf-8" }
));
    
const theme = process.env.VAADIN_THEME || "lumo";

Object.assign(package, {
  "main": `dist/${theme}/index.js`,
  "module": `dist/${theme}/index.mjs`,
  "es2015": `dist/${theme}/esm/index.mjs`,
  "es2017": `dist/${theme}/esm/index.mjs`,
  "collection": `dist/${theme}/collection/collection-manifest.json`,
  "collection:main": `dist/${theme}/collection/index.js`,
  "unpkg": `dist/${theme}/foxy/foxy.js`,
  "types": `dist/${theme}/types/components.d.ts`,
  "files": [
    "dist/",
    `dist/${theme}/`
  ],
});

fs.writeFileSync(
  path.resolve(__dirname, "package.json"),
  JSON.stringify(package, null, 2)
);
