import m = require("mithril");

export interface SwitchAttrs {
    checked?: boolean;
    onchange: (evt: Event) => any;
    [others: string]: any;
}

export default class Switch implements m.Component<SwitchAttrs, any> {
    view(vnode: m.Vnode<SwitchAttrs, any>) {
        return m("label", [
            m("input", Object.assign({type: "checkbox"}, vnode.attrs)),
            vnode.children
        ]);
    }
}