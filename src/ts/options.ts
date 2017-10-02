import m = require("mithril");
import MStorage from "./storage";

const OPTIONS_LS_KEY = "options";

export class Options {
    public displayTime: boolean = true;
    public displayDate: boolean = true;
    public displayWeather: boolean = true;
    public displaySpeedDial: boolean = true;
    public displaySeconds: boolean = false;

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