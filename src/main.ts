performance.mark("script-start");

import "./ts/theming";
import m = require("mithril");
import SpeedDial from "./ts/speed-dial";
import Options from "./ts/options";
import App from "./components/App";

// import Weather from "./ts/weather";
// (window as any).Weather = Weather;

Options.load();
Options.loadAppearanceStylesheet();
SpeedDial.load();
const root = document.getElementById('app')!;
m.mount(root, App);
