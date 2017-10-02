declare const __dirname: string;
declare function require(name:string): any;
declare interface FileSystem { readFileSync: (filename: string, encoding: string) => string; }

import MStorage from "./storage";
const fs: FileSystem = require("fs");

/** Local Storage Key  */
const THEME_LS_KEY = "theme";
const MINIMAL_THEME_STYLESHEET_ID = "mmt-theming";

export interface IMinimalTheme {
    backgroundColor: string;
    backgroundColorDark: string;
    textColor: string;
    metaColor: string;
    accentColor: string;
}

const darkTheme: IMinimalTheme = {
    backgroundColor: "#343a40",
    backgroundColorDark: "#212529",
    textColor: "#f8f9fa",
    metaColor: "#ced4da",
    accentColor: "#228ae6"
};

const lightTheme: IMinimalTheme = {
    backgroundColor: "#f8f9fa",
    backgroundColorDark: "#e9ecef",
    textColor: "#343a40",
    metaColor: "#868e96",
    accentColor: "#228ae6"
};

const purpleTheme: IMinimalTheme = {
    backgroundColor: "#71397C",
    backgroundColorDark: "#60366F",
    textColor: "#f8f9fa",
    metaColor: "#C582D5",
    accentColor: "#FFDF5A"
};

const defaultTheme = purpleTheme;

function loadMinimalThemeStylesheet(sheetId: string, source: string) {
    const found = document.querySelector(`head > style[data-sheetId="${sheetId}"]`);
    if (found) {
        found.innerHTML = source;
        console.log("Found and replaced stylesheet.");
    } else {
        const headElement = document.getElementsByTagName("head")[0];
        const styleElement = document.createElement("style");
        styleElement.setAttribute("data-sheetId", sheetId);
        styleElement.innerHTML = source;
        headElement.appendChild(styleElement);
        console.log("Added new stylesheet.");
    }
}

// First thing I do here is attempt to preload the background color of theme.
(function() {
    let minimalTheme = MStorage.get<IMinimalTheme>(THEME_LS_KEY) || defaultTheme;;
    try {
        loadMinimalThemeStylesheet(MINIMAL_THEME_STYLESHEET_ID, `body { background-color: ${minimalTheme.backgroundColor}; }`);
        console.log("Loaded body background");
    } catch(e) {
        MStorage.remove(THEME_LS_KEY);
        console.error("Bad theme in local storage.", e);
    }
})();

const themeSource = (function() {
    const THEME_START_MARKER = "//##MINIMAL-THEME-CSS-BEGIN##";
    const THEME_END_MARKER = "//##MINIMAL-THEME-CSS-END##";

    const source = fs.readFileSync(__dirname + "/../sass/minimal-theme.scss", "utf8");
    const begin = source.indexOf(THEME_START_MARKER) + THEME_START_MARKER.length;
    const end = source.indexOf(THEME_END_MARKER);

    console.assert(begin >= 0, "Failed to find the start of the theme.");
    console.assert(end > begin, "Failed to find the end of the theme.");

    return source.substring(begin, end);
})();

const THEME_VAR_MAP = new Map([
    ["$mmt-bg-color",       "backgroundColor"],
    ["$mmt-bg-dark-color",  "backgroundColorDark"],
    ["$mmt-text-color",     "textColor"],
    ["$mmt-meta-color",     "metaColor"],
    ["$mmt-accent-color",   "accentColor"],
]);

export function loadTheme(newTheme?: any) {
    const theme = newTheme ? Object.assign({}, defaultTheme, newTheme) : defaultTheme;
    const replacedSource = themeSource.replace(/(\$[\w-_]+)/g, (_: string, varname: string) => {
        if (THEME_VAR_MAP.has(varname)) {
            const mapped = THEME_VAR_MAP.get(varname)!;
            return (theme as any)[mapped];
        } else {
            console.error("Variable %s not found in theme variable map.", varname);
            return "";
        }
    });
    loadMinimalThemeStylesheet(MINIMAL_THEME_STYLESHEET_ID, replacedSource);
}

loadTheme(MStorage.get(THEME_LS_KEY));
