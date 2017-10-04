import m = require("mithril");
import Options from "../../ts/options";
import Switch from "../misc/Switch";
import { icon, Icons } from "../icons/icons";
import SpeedDialEditor from "./SpeedDialEditor";

export interface OptionsPaneAttrs {
    isHidden: boolean;
    [extras: string]: any;
}

export default class OptionsPane implements m.Component<OptionsPaneAttrs, any> {
    constructor() {
        this.onThemeSelected = this.onThemeSelected.bind(this);
    }

    private onThemeSelected(event: UIEvent) {
    }

    view(vnode: m.Vnode<OptionsPaneAttrs, any>) {
        const newSection = (title: string, contents: m.Vnode<any, any>[]) => {
            return m("section.flex-column.margin-h", [m("h4", title)].concat(contents));
        };

        const newThemeOption = (shortname: string, longname: string) => {
            return m("option", {
                value: shortname,
                selected: Options.selectedThemeName === shortname,
            }, longname);
        };

        const sections = [
            m("section.flex-column.margin-h", [
                m("h4", "Clock"),
                m(Switch, {
                    checked: Options.displayTime,
                    onchange: Options.withAttr<boolean>("checked", (o, v) => o.displayTime = v)
                }, "Display Time"),

                m(Switch, {
                    checked: Options.displaySeconds, 
                    onchange: Options.withAttr<boolean>("checked", (o, v) => o.displaySeconds = v),
                    disabled: !Options.displayTime
                }, "Display Seconds"),

                m(Switch, {
                    checked: Options.displayDate, 
                    onchange: Options.withAttr<boolean>("checked", (o, v) => o.displayDate = v)
                }, "Display Date"),
            ]),

            m("section.flex-column.margin-h", [
                m("h4", "Weather"),
                m(Switch, {
                    checked: Options.displayWeather,
                    onchange: Options.withAttr<boolean>("checked", (o, v) => o.displayWeather = v)
                }, "Display Weather"),
            ]),

            m("section.flex-column", [
                m(".margin-h", [
                    m("h4", "SpeedDial"),
                    m(Switch, {
                        checked: Options.displaySpeedDial,
                        onchange: Options.withAttr<boolean>("checked", (o, v) => o.displaySpeedDial = v)
                    }, "Display Speed Dial"),
                ]),

                m(SpeedDialEditor, {isHidden: vnode.attrs.isHidden})
            ]),

            m("section.flex-column.margin-h", [
                m("h4", "Theme"),
                m("select", {}, [
                    newThemeOption("dark-theme", "Dark Theme"),
                    newThemeOption("light-theme", "Light Theme"),
                    newThemeOption("purple-theme", "Purple Theme"),
                ])
            ])
        ];

        return m(".minimal-options.mmt-style-options-pane", vnode.attrs, [
            m(".minimal-sections.margin-bottom", [
                m("section.margin-h", m("h2.margin-top", [icon(Icons.Settings, {style: "margin-right: 8px;"}), "Options"])),
                sections
            ])
        ]);
    }
}