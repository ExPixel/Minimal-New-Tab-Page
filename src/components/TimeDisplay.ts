import m = require("mithril");
import { getUserLocale } from "../ts/util";

export interface ITimeDisplayAttrs {
    updateInterval?: number;
    showSeconds?: boolean;
    [extraProp: string]: any;
}

const DEFAULT_TIME_DISPLAY_INTERVAL = 1000 * 3;

function isDifferentTimeDisplay(a: Date, b: Date, checkSeconds: boolean) {
    if (checkSeconds && a.getSeconds() !== b.getSeconds())  return true;
    if (a.getMinutes() !== b.getMinutes()) return true;
    if (a.getHours() !== b.getHours()) return true;
}

export default class TimeDisplay implements m.Component<ITimeDisplayAttrs, any> {
    private timeFormatter: Intl.DateTimeFormat;
    private updateTimer: number | null = null;
    private showingSeconds: boolean = false;

    private lastDate: Date | null = null;

    constructor(vnode: m.Vnode<ITimeDisplayAttrs, any>) {
        this.showingSeconds = !!vnode.attrs.showSeconds;
    }

    private initFormatter() {
        if (this.showingSeconds) {
            this.timeFormatter = new Intl.DateTimeFormat(getUserLocale(), { hour: "2-digit", minute: "2-digit", second: "2-digit" });
        } else {
            this.timeFormatter = new Intl.DateTimeFormat(getUserLocale(), { hour: "2-digit", minute: "2-digit" });
        }
    }

    private initUpdateTimer(interval?: number | null) {
        this.clearUpdateTimer();
        const defaultInterval = this.showingSeconds ? 500 : DEFAULT_TIME_DISPLAY_INTERVAL;
        this.updateTimer = setInterval(() => {
            const check = new Date;
            if (this.lastDate === null || isDifferentTimeDisplay(this.lastDate, check, this.showingSeconds)) {
                m.redraw();
            }
            this.lastDate = check;
        }, interval || defaultInterval);
    }

    private clearUpdateTimer() {
        if (this.updateTimer) {
            clearInterval(this.updateTimer);
            this.updateTimer = null;
        }
    }

    public oninit(vnode: m.Vnode<ITimeDisplayAttrs, any>) {
        this.initFormatter();
        this.initUpdateTimer(vnode.attrs.updateInterval);
    }

    public oncreate(vnode: m.Vnode<ITimeDisplayAttrs, any>) {
        if (!this.updateTimer) {
            this.initUpdateTimer(vnode.attrs.updateInterval);
        }
    }

    public onbeforeupdate(vnode: m.Vnode<ITimeDisplayAttrs, any>) {
        if (this.showingSeconds != (!!vnode.attrs.showSeconds)) {
            this.showingSeconds = !!vnode.attrs.showSeconds;
            this.initFormatter();
            this.initUpdateTimer();
        }
    }

    public onbeforeremove() {
        this.clearUpdateTimer();
    }

    public view(vnode: m.Vnode<ITimeDisplayAttrs, any>) {
        const d = new Date;
        return m("div.minimal-time.mmt-style-time", vnode.attrs, this.timeFormatter.format(new Date));
    }
}