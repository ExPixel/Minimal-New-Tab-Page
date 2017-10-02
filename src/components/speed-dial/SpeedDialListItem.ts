import m = require("mithril");
import { extractURLHost } from "../../ts/util";

export interface ISpeedDialListItemAttrs {
    itemTitle?: string | m.Vnode<any, any> | null;
    itemUrl?: string | null;
}

export default class SpeedDialListItem implements m.Component<ISpeedDialListItemAttrs, any> {
    constructor() {
    }

    public view(vnode: m.Vnode<ISpeedDialListItemAttrs, any>) {
        return m("li.speed-dial-list-item.mmt-style-speed-item", {
            onclick: () => {
                if (vnode.attrs.itemUrl) {
                    window.location.href = vnode.attrs.itemUrl;
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