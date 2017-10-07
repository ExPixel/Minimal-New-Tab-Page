import m = require("mithril");
import { extractURLHost, clamp } from "../../ts/util";
import Options from "../../ts/options";

export interface ISpeedDialListItemAttrs {
    itemTitle?: string | m.Vnode<any, any> | null;
    itemUrl?: string | null;
}

export default class SpeedDialListItem implements m.Component<ISpeedDialListItemAttrs, any> {
    constructor() {
    }

    public view(vnode: m.Vnode<ISpeedDialListItemAttrs, any>) {
        const width = clamp(Options.speedDialItemWidth, 32, 1024);
        return m("li.speed-dial-list-item.mmt-style-speed-item", {
            style: `width: ${width}px; max-width: ${width}px;`,
            onclick: (event: MouseEvent) => {
                if (vnode.attrs.itemUrl) {
                    if (event.ctrlKey || event.metaKey) {
                        window.open(vnode.attrs.itemUrl, "_blank");
                    } else {
                        window.location.href = vnode.attrs.itemUrl;
                    }
                }
            },
            title: vnode.attrs.itemTitle
        }, [
            m("span.speed-dial-list-item-title.mmt-style-speed-item-title", vnode.attrs.itemTitle),
            m("span.speed-dial-list-item-url.mmt-style-speed-item-url",
                vnode.attrs.itemUrl ? extractURLHost(vnode.attrs.itemUrl) : "———")
        ]);
    }
}