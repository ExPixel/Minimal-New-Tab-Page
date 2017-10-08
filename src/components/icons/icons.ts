declare const __dirname: string;
declare function require(name:string): any;
declare interface FileSystem { readFileSync: (filename: string, encoding: string) => string; }

import m = require("mithril");
const fs: FileSystem = require("fs");

export const Icons  = {
    Settings: fs.readFileSync(__dirname + "/img/settings.svg", "utf8") as string,
    Menu: fs.readFileSync(__dirname + "/img/menu.svg", "utf8") as string,
    PlusSquare: fs.readFileSync(__dirname + "/img/plus-square.svg", "utf8") as string,
    MinusSquare: fs.readFileSync(__dirname + "/img/minus-square.svg", "utf8") as string,
    Edit3: fs.readFileSync(__dirname + "/img/edit-3.svg", "utf8") as string,
    AlertCircle: fs.readFileSync(__dirname + "/img/alert-circle.svg", "utf8") as string,
    SimpleWeatherCloudy: fs.readFileSync(__dirname + "/img/sw-cloudy.svg", "utf8") as string,
    ExternalLink: fs.readFileSync(__dirname + "/img/external-link.svg", "utf8") as string,
};

export function icon(svg: string, attrs?: any) {
    if (attrs) return m("i.icon", attrs, m.trust(svg));
    else return m("i.icon", m.trust(svg));
}