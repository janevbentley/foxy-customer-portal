const path = require("path");
const replace = require("replace");

const customMap = {
  "--material-background-color": "--foxy-base-color",

  "--material-shadow-elevation-2dp": "--foxy-box-shadow-xxxs",
  "--material-shadow-elevation-3dp": "--foxy-box-shadow-xxs",
  "--material-shadow-elevation-4dp": "--foxy-box-shadow-xs",
  "--material-shadow-elevation-6dp": "--foxy-box-shadow-s",
  "--material-shadow-elevation-8dp": "--foxy-box-shadow-m",
  "--material-shadow-elevation-12dp": "--foxy-box-shadow-l",
  "--material-shadow-elevation-16dp": "--foxy-box-shadow-xl",
  "--material-shadow-elevation-24dp": "--foxy-box-shadow-xxl",

  "--material-caption-font-size": "--foxy-font-size-xxs",
  "--material-button-font-size": "--foxy-font-size-xs",
  "--material-small-font-size": "--foxy-font-size-s",
  "--material-body-font-size": "--foxy-font-size-m",
  "--material-h6-font-size": "--foxy-font-size-l",
  "--material-h5-font-size": "--foxy-font-size-xl",
  "--material-h4-font-size": "--foxy-font-size-xxl",
  "--material-h3-font-size": "--foxy-font-size-xxxl",
  "--material-h2-font-size": "--foxy-font-size-xxxxl",
  "--material-h1-font-size": "--foxy-font-size-xxxxxl"
};

const commonOptions = {
  paths: [path.resolve(__dirname, "node_modules", "@vaadin")],
  recursive: true,
  silent: true
};

Object.entries(customMap).forEach(([regex, replacement]) => {
  replace({ regex, replacement, ...commonOptions });
});

replace({ regex: "--lumo-", replacement: "--foxy-", ...commonOptions });
replace({ regex: "--material-", replacement: "--foxy-", ...commonOptions });
