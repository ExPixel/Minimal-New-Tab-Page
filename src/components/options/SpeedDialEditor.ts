import m = require("mithril");
import { icon, Icons } from "../icons/icons";
import dragula = require("dragula");
import SpeedDial from "../../ts/speed-dial";
import { extractURLHost } from "../../ts/util";

export interface SpeedDialEditorAttrs {
    isHidden: boolean;
    [extras: string]: any;
}

export default class SpeedDialEditor implements m.Component<SpeedDialEditorAttrs, any> {
    private drake: dragula.Drake | null = null;
    private editIndex: number = -1;
    private editing: boolean = false;
    private creating: boolean = false;

    constructor() {
        this.requestItemRemove = this.requestItemRemove.bind(this);
        this.startCreating = this.startCreating.bind(this);
        this.completeCreate = this.completeCreate.bind(this);
        this.cancelEdit = this.cancelEdit.bind(this);
        this.editItem = this.editItem.bind(this);
        this.completeEdit = this.completeEdit.bind(this);
    }

    /**
     * Cancels any editing action in progress.
     */
    public cancelEdit() {
        if (this.drake) { this.drake.cancel(); }
        this.creating = false;
        this.editing = false;
        this.editIndex = -1;
    }

    private startCreating() { this.creating = true; }
    private completeCreate(title: string, url: string) {
        SpeedDial.addItem({title, url});
        SpeedDial.save();
        this.creating = false;
    }

    private editItem(event: UIEvent) {
        if (event.target instanceof HTMLElement) {
            const itemKey = event.target.getAttribute("data-item-key");
            if (itemKey) {
                const itemIndex = SpeedDial.getIndexForKey(itemKey);
                if (itemIndex >= 0) {
                    this.editing = true;
                    this.editIndex = itemIndex;
                }
            }
        }
    }

    private completeEdit(title: string, url: string) {
        if (this.editIndex >= 0) {
            SpeedDial.replaceItemAt(this.editIndex, {title, url});
            SpeedDial.save();
            this.editing = false;
            this.editIndex = -1;
        }
    }

    private requestItemRemove(event: UIEvent) {
        if (event.target instanceof HTMLElement) {
            const itemKey = event.target.getAttribute("data-item-key");
            if (itemKey) {
                const itemIndex = SpeedDial.getIndexForKey(itemKey);
                if (itemIndex >= 0) {
                    const item = SpeedDial.getItems()[itemIndex];
                    if(confirm(`Are you sure you would like to delete the shortcut to "${item.title}"?`)) {
                        SpeedDial.removeItemAt(itemIndex);
                        SpeedDial.save();
                    }
                }
            }
        }
    }

    public oncreate(vnode: m.VnodeDOM<SpeedDialEditorAttrs, any>) {
        const dragRoot = vnode.dom.getElementsByClassName("speed-dial-items")![0];
        this.drake = dragula([dragRoot], {
            moves: (el, source, handle) => {
                return !this.editing && !this.creating && (handle as HTMLElement).classList.contains("sd-item-handle");
            },

            accepts: (el, target) => {
                return target === dragRoot;
            }
        });

        this.drake.on("drop", (el: HTMLElement, target: HTMLElement, source: HTMLElement, sibling: HTMLElement | null) => {
            const movedId = el.getAttribute("data-item-key");
            const movedBeforeId = sibling ? sibling.getAttribute("data-item-key") : null;

            let from: number; // index item is being moved from.
            let to: number; // index item is being moved to.

            if (movedId) {
                if (movedBeforeId) {
                    from = SpeedDial.getIndexForKey(movedId);
                    to = SpeedDial.getIndexForKey(movedBeforeId) - 1;
                } else {
                    from = SpeedDial.getIndexForKey(movedId);
                    to = SpeedDial.getItems().length - 1;
                }
                if (to < from) to += 1; // fixes a bug with moving items backwards.
                SpeedDial.moveItem(from, to);
                SpeedDial.save();
                m.redraw();
            }
        });
    }

    public onbeforeremove(vnode: m.VnodeDOM<SpeedDialEditorAttrs, any>) {
        if (this.drake) {
            this.drake.destroy();
            this.drake = null;
        }
    }

    public onbeforeupdate(vnode: m.Vnode<SpeedDialEditorAttrs, any>) {
        if (vnode.attrs.isHidden) {
            this.cancelEdit();
        }
    }

    public view(vnode: m.Vnode<SpeedDialEditorAttrs, any>) {
        const disableChanges = this.editing || this.creating;

        const speedDialItems = SpeedDial.getItems().map((item, index) => {
            if (this.editing && this.editIndex === index) {
                return m(SpeedDialEditorInputs, {
                    onCommit: this.completeEdit,
                    title: item.title,
                    url: item.url,
                    onCancel: this.cancelEdit,
                    commitText: "Edit"
                });
            } else {
                return m(".sd-item", { key: item.key, "data-item-key": item.key }, [
                    m("div.sd-item-icon.sd-item-handle", {class: disableChanges ? "disabled" : ""}, icon(Icons.Menu)),
                    m("div.sd-item-body.flex-1", [
                        m("span.sd-item-title", item.title),
                        m("span.sd-item-meta", item.url ? extractURLHost(item.url) : "---")
                    ]),

                    m("div.sd-item-actions", [
                        m("button.icon-button..style-options-btn-blue", {
                            "data-item-key": item.key,
                            onclick: this.editItem,
                            disabled: disableChanges
                        }, [icon(Icons.Edit3)]),

                        m("button.icon-button.style-options-btn-red", {
                            "data-item-key": item.key,
                            onclick: this.requestItemRemove,
                            disabled: disableChanges
                        }, [icon(Icons.MinusSquare)])
                    ])
                ]);
            }
        });

        let createEditor = null;
        if (this.creating) {
            createEditor = m(SpeedDialEditorInputs, {
                onCommit: this.completeCreate,
                onCancel: this.cancelEdit,
                commitText: "Create"
            });
        }

        return m(".minimal-sd-editor", [
            m("div.speed-dial-items", speedDialItems),
            createEditor,
            m("button.margin-h.margin-top.float-right", {onclick: this.startCreating, disabled: disableChanges}, "Add Item")
        ]);
    }
}


interface SpeedDialEditorInputsAttrs {
    onCommit?: (title: string, url: string) => any;
    onCancel?: () => any;
    title?: string;
    url?: string;
    commitText?: string;
}

export class SpeedDialEditorInputs implements m.Component<SpeedDialEditorInputsAttrs, any> {
    static IDGEN: number = 0;
    private idNum: number;

    private title: string;
    private url: string;

    constructor() {
        this.idNum = SpeedDialEditorInputs.IDGEN++;
        this.setTitle = this.setTitle.bind(this);
        this.setURL = this.setURL.bind(this);
    }

    get titleId() { return "sdei-id-title-" + this.idNum; }
    get urlId() { return "sdei-id-url-" + this.idNum; }

    oninit(vnode: m.Vnode<SpeedDialEditorInputsAttrs, any>) {
        this.title = vnode.attrs.title || "";
        this.url = vnode.attrs.url || "";
    }

    private setTitle(val: string) { this.title = val; }
    private setURL(val: string) { this.url = val; }

    view(vnode: m.Vnode<SpeedDialEditorInputsAttrs, any>) {
        const onCommitAction = (event: Event) => {
            event.preventDefault();
            if (vnode.attrs.onCommit) vnode.attrs.onCommit(this.title, this.url);
            return false;
        };

        const onCancelAction = (event: Event) => {
            event.preventDefault();
            if (vnode.attrs.onCancel) vnode.attrs.onCancel();
            return false;
        };

        return m("form.padding-all.minimal-options-section", {onsubmit: onCommitAction}, [
            m(".form-group", [
                m("label.form-label", {for: this.titleId}, "Title"),
                m("input.form-input.style-options-input", {
                    type: "text",
                    id: this.titleId,
                    value: this.title,
                    oninput: m.withAttr("value", this.setTitle),
                }),
            ]),

            m(".form-group", [
                m("label.form-label", {for: this.urlId}, "URL"),
                m("input.form-input.style-options-input", {
                    type: "text",
                    id: this.urlId,
                    value: this.url,
                    oninput: m.withAttr("value", this.setURL),
                }),
            ]),

            m(".form-group.form-buttons", [
                m("button.btn", {type: "button", onclick: onCancelAction}, "Cancel"),
                m("button.btn", {type: "submit"}, vnode.attrs.commitText || "Create")
            ])
        ]);
    }
}