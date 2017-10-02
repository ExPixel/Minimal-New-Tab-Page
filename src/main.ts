performance.mark("script-start");

import "./ts/theming";
import m = require("mithril");
import SpeedDial from "./ts/speed-dial";
import Options from "./ts/options";
import App from "./components/App";

Options.load();
SpeedDial.load();
const root = document.getElementById('app')!;
m.mount(root, App);
