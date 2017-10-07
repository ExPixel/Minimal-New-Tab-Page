import m = require("mithril");
import MStorage from "./storage";
import { defaultThemeName } from "./theming/theme-defs";
import { checkThemeMatch } from "./theming/index";

const OPTIONS_LS_KEY = "options";

export class Options {
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

    public checkThemeMatch() {
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