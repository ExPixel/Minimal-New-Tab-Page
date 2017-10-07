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

    public getFavIconURL(url?: string | null) {
        if (url) {
            try {
                new URL(url); // just makes sure it's valid.
                const hashIndex = url.indexOf("#");
                if (hashIndex >= 0) { url = url.substring(0, hashIndex); }
                return "chrome://favicon/size/16@2x/" + url;
            } catch(e) {
                console.error("Failed to get FavIcon for URL: " + url);
            }
        }
        return "chrome://favicon";
    }

    public view(vnode: m.Vnode<ISpeedDialListItemAttrs, any>) {
        const width = clamp(Options.speedDial.itemWidth, 32, 1024);
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
            m("span.speed-dial-list-item-title.mmt-style-speed-item-title", {
                class: (!Options.speedDial.showFavIcon && !Options.speedDial.showURL) ? "half-padding-v" : ""
            }, vnode.attrs.itemTitle),
            m("span.speed-dial-list-item-url.mmt-style-speed-item-url", [
                Options.speedDial.showFavIcon ? m("img.speed-dial-list-favicon", {
                    class: Options.speedDial.showURL ? "add-margin" : "",
                    src: this.getFavIconURL(vnode.attrs.itemUrl)
                }) : null,

                Options.speedDial.showURL ? (vnode.attrs.itemUrl ? extractURLHost(vnode.attrs.itemUrl) : "———") : null
            ])
        ]);
    }
}