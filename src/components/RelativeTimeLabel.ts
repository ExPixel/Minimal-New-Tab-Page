import m = require("mithril");
import { getDurationString } from "../ts/util";

export interface RelativeTimeLabelAttrs {
    prefix?: string;
    from: Date | number;
    to?: Date | number;
    span: any
}

export class RelativeTimeLabel implements m.Component<RelativeTimeLabelAttrs, any> {
    private _from: Date | number; // #FIXME(granular-redraw): Remove this
    private _to: Date | number | undefined = undefined; // #FIXME(granular-redraw): Remove this
    private _prefix: string | undefined = undefined;
    private _dom: HTMLElement | null = null; // #FIXME(granular-redraw): Remove this

    private updateInterval: number | null = null;

    private clearInterval() {
        if (this.updateInterval !== null) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    private initInterval() {
        if (this.updateInterval !== null) this.clearInterval();

        // #FIXME(granular-redraw) Change the code below to a redraw call.
        this.updateInterval = setInterval(() => {
            if (this._dom) {
                let durString = getDurationString(this._from, this._to || Date.now());
                let labelString = this._prefix ? `${this._prefix} ${durString}` : durString;
                this._dom.innerText = labelString;
            }
        }, 10);
    }

    oninit() {
        this.initInterval();
    }

    onupdate(vnode: m.VnodeDOM<RelativeTimeLabelAttrs, any>) {
        this._from = vnode.attrs.from; // #FIXME(granular-redraw): Remove this
        this._to = vnode.attrs.to; // #FIXME(granular-redraw): Remove this
        this._prefix = vnode.attrs.prefix; // #FIXME(granular-redraw): Remove this
        this._dom = vnode.dom as HTMLElement; // #FIXME(granular-redraw): Remove this
    }

    oncreate(vnode: m.VnodeDOM<RelativeTimeLabelAttrs, any>) {
        this.initInterval();
        this._from = vnode.attrs.from; // #FIXME(granular-redraw): Remove this
        this._to = vnode.attrs.to; // #FIXME(granular-redraw): Remove this
        this._prefix = vnode.attrs.prefix; // #FIXME(granular-redraw): Remove this
        this._dom = vnode.dom as HTMLElement; // #FIXME(granular-redraw): Remove this
    }

    public onbeforeremove() {
        this.clearInterval();
    }

    view(vnode: m.Vnode<RelativeTimeLabelAttrs, any>) {
        let durString = getDurationString(vnode.attrs.from, vnode.attrs.to || Date.now());
        let labelString = vnode.attrs.prefix ? `${vnode.attrs.prefix} ${durString}` : durString;
        return m("span", vnode.attrs.span, labelString);
    }
}