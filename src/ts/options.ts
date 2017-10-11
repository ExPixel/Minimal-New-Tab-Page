import m = require("mithril");
import MStorage from "./storage";
import { defaultThemeName, IMinimalTheme, defaultTheme, themeMap } from "./theming/theme-defs";
import { checkThemeMatch, loadMinimalThemeStylesheet } from "./theming/index";
import { clamp } from "./util";
import { FONT_SIZE_MIN, FONT_SIZE_MAX } from "./constants";

const OPTIONS_LS_KEY = "options";

export class Options {
    public displayHelp: boolean = true;
    public displayTime: boolean = true;
    public displayDate: boolean = true;
    public displayWeather: boolean = false;
    public displaySpeedDial: boolean = true;
    public displaySeconds: boolean = false;
    public selectedThemeName: string = defaultThemeName;

    public clockWeatherSeparator: boolean = true;
    public clockSpeedDialSeparator: boolean = true;

    public weatherService: string = "dark-sky";
    public weatherInfo = { latitude: 0, longitude: 0, units: "imperial" };
    public darkSky = { apiKey: "" };

    public weather = {
        showLastUpdateTime: true,
    };

    public speedDial = {
        itemWidth: 160,
        sectionWidth: 3,
        showURL: true,
        showFavIcon: true
    };

    public appearance = {
        fontSize: 13,
        fontFamily: ""
    };

    public customTheme: IMinimalTheme = Object.assign({}, defaultTheme, {
        name: "Custom Theme",
        shortname: "custom-theme",
    });

    public loadAppearanceStylesheet() {
        const remBase = 10;
        const fontSizePx = clamp(this.appearance.fontSize, FONT_SIZE_MIN, FONT_SIZE_MAX);
        const fontSize = (fontSizePx / remBase).toFixed(4);
        let fontFamily: string;
        if (this.appearance.fontFamily && this.appearance.fontFamily.trim().length > 0) {
            fontFamily = `"${this.appearance.fontFamily.trim()}", `;
        } else {
            fontFamily = "";
        }
        loadMinimalThemeStylesheet("minimal-appearance", `
            #minimal-app-main {
                font-family: ${fontFamily}-apple-system, BlinkMacSystemFont, "Segoe UI", 'Roboto', 'Helvetica', sans-serif;
                font-size: ${fontSize}rem;
            }
        `);
        console.log("Loaded appearance stylesheet.");
    }

    public edit(f: (o: Options) => any) {
        f(this);
        this.save();
    }

    public withAttr<T>(attr: string, f: (o: Options, v: T) => any) {
        return m.withAttr(attr, (val) => {
            f(this, val);
            this.save();
        });
    }

    public load() {
        const storedOptions = MStorage.get<any>(OPTIONS_LS_KEY);
        if (storedOptions) {
            Object.keys(storedOptions).forEach((key) => {
                if (key in this) {
                    (this as any)[key] = storedOptions[key];
                }
            });
        }
        themeMap.set(this.customTheme.shortname, this.customTheme);
        checkThemeMatch(this.selectedThemeName);
    }

    public save() {
        MStorage.set(OPTIONS_LS_KEY, this);
    }

    /**
     * I need a better name for this but it basically check checks that a condition
     * is true. If it's not this returns null. If the condition is true this returns the
     * second argument.
     */
    public static assert<T>(test: boolean, ret: T): T | null {
        if (test) return ret;
        else return null;
    }
};

export default new Options;