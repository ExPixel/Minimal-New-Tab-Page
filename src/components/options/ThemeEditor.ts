import m = require("mithril");
import { IMinimalTheme } from "../../ts/theming/theme-defs";
import { colorToRGBString } from "../../ts/util";

export interface ThemeEditorAttrs {
    theme: IMinimalTheme,
    onchange: (theme: IMinimalTheme) => any;
    _class?: string;
}

export interface ColorEditorAttrs {
    value: string;
    name: string;
    onchange: (color: string) => any;
}

export interface ColorCircleAttrs {
    color?: string | number | null;
}

export class ColorCircle implements m.Component<ColorCircleAttrs, any> {
    view(vnode: m.Vnode<ColorCircleAttrs, any>) {
        const color = vnode.attrs.color ? colorToRGBString(vnode.attrs.color) : "#000000";
        return m("span.theme-editor-color-circle", {
            style: `background-color: ${color};`
        });
    }
}

export class ColorEditor implements m.Component<ColorEditorAttrs, any> {
    static ColorEditorIdGen = 0;
    private id: string;

    constructor() {
        this.id = "coloreditor-" + (ColorEditor.ColorEditorIdGen++);
    }
    
    view(vnode: m.Vnode<ColorEditorAttrs, any>) {
        let onchange = null;
        if (vnode.attrs.onchange) {
            onchange = (event: UIEvent) => {
                vnode.attrs.onchange((event.target as HTMLInputElement).value);
                return false;
            }
        }

        return m(".minimal-theme-color-editor.form-group", [
            m("label.form-label", vnode.attrs.name),
            m(".flex-row.flex-center-cross", [
                m(ColorCircle, { color: vnode.attrs.value }),
                m("input.form-input.style-options-input.flex-1", {
                    style: "margin-left: 8px;",
                    value: vnode.attrs.value,
                    onchange
                })
            ])
        ])
    }
}

export default class ThemeEditor implements m.Component<ThemeEditorAttrs, any> {

    public view(vnode: m.Vnode<ThemeEditorAttrs, any>) {
        const colorProperties: [string, string][] = [
            ["backgroundColor", "Background Color"], 
            ["backgroundColorDark", "Dark Background Color"],
            ["textColor", "Text Color"],
            ["metaColor", "Meta Text Color"],
            ["accentColor", "Accent Color"],
        ];

        const colorInputs = colorProperties.map(([prop, name]) => {
            const value = (vnode.attrs.theme as any)[prop] as string;
            return m(ColorEditor, {
                name,
                value,
                onchange: (color: string) => {
                    const newTheme = Object.assign({}, vnode.attrs.theme);
                    (newTheme as any)[prop] = color;
                    vnode.attrs.onchange(newTheme);
                }
            });
        });

        return m(".theme-editor", {class: vnode.attrs._class || ""}, [
            ...colorInputs
        ]);
    }
}