import m = require("mithril");
import { getUserLocale } from "../ts/util";

export interface IDateDisplayAttrs {
    updateInterval?: number;
    [extraProp: string]: any;
}

const DEFAULT_DATE_DISPLAY_INTERVAL = 1000 * 60 * 60;

export default class DateDisplay implements m.Component<IDateDisplayAttrs, any> {
    private dateFormatter: Intl.DateTimeFormat;
    private updateTimer: number | null = null;

    constructor() {
        this.dateFormatter = new Intl.DateTimeFormat(getUserLocale(), { month: "long", weekday: "long", day: "numeric" });
    }

    private initUpdateTimer(interval?: number | null) {
        this.clearUpdateTimer();
        this.updateTimer = setInterval(() => {
            m.redraw();
        }, interval || DEFAULT_DATE_DISPLAY_INTERVAL);
    }

    private clearUpdateTimer() {
        if (this.updateTimer) {
            clearInterval(this.updateTimer);
            this.updateTimer = null;
        }
    }

    public oninit(vnode: m.Vnode<IDateDisplayAttrs, any>) {
        this.initUpdateTimer(vnode.attrs.updateInterval);
    }

    public oncreate(vnode: m.Vnode<IDateDisplayAttrs, any>) {
        if (!this.updateTimer) {
            this.initUpdateTimer(vnode.attrs.updateInterval);
        }
    }

    public onbeforeremove() {
        this.clearUpdateTimer();
    }

    public view(vnode: m.Vnode<IDateDisplayAttrs, any>) {
        return m("div.minimal-date.mmt-style-date", vnode.attrs, this.dateFormatter.format(new Date));
    }
}