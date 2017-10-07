import m = require("mithril");
import Options from "../../ts/options";
import Switch from "../misc/Switch";
import { icon, Icons } from "../icons/icons";
import SpeedDialEditor from "./SpeedDialEditor";
import { themeChangedByName } from "../../ts/theming/index";
import { themeMap } from "../../ts/theming/theme-defs";
import { weatherControl } from "../weather/WeatherDisplay";

export interface OptionsPaneAttrs {
    isHidden: boolean;
    [extras: string]: any;
}

export default class OptionsPane implements m.Component<OptionsPaneAttrs, any> {
    constructor() {
        this.onThemeSelected = this.onThemeSelected.bind(this);
        this.setDarkSkyAPIKey = this.setDarkSkyAPIKey.bind(this);
        this.setWeatherLatitude = this.setWeatherLatitude.bind(this);
        this.setWeatherLongitude = this.setWeatherLongitude.bind(this);
        this.onWeatherUnitSelected = this.onWeatherUnitSelected.bind(this);
    }

    private onThemeSelected(event: UIEvent) {
        if (event && event.target && typeof (event.target as any)["value"] === "string") {
            const value = (event.target as any)["value"] as string;
            Options.selectedThemeName = value;
            themeChangedByName(Options.selectedThemeName);
            Options.save();
        }
    }

    private onWeatherUnitSelected(event: UIEvent) {
        if (event && event.target && typeof (event.target as any)["value"] === "string") {
            weatherControl.weatherSettingsDirty = true;
            let unit = (event.target as any)["value"] as string;
            if (unit !== "imperial" && unit !== "si") unit = "imperial";
            Options.weatherInfo.units = unit;
            Options.save();
        }
    }

    private setDarkSkyAPIKey(key: string) {
        weatherControl.weatherSettingsDirty = true;
        Options.darkSky.apiKey = key;
        Options.save();

        // #FIXME: This causes a full render and a save to local storage everytime you type in a character :\
        //        Luckily it's not something anyone would be messing with often, but I should probably look
        //        at optimizing this just on principle.
    }

    private setWeatherLatitude(lat: string) {
        weatherControl.weatherSettingsDirty = true;
        lat = lat.replace(/[^0-9\.\-]+/g, "");
        let f = parseFloat(lat);
        if (!Number.isFinite(f)) f = 0;
        Options.weatherInfo.latitude = f;
        Options.save();

        // #FIXME: See FIXME of setDarkSkyAPIKey
    }

    private setWeatherLongitude(lon: string) {
        weatherControl.weatherSettingsDirty = true;
        lon = lon.replace(/[^0-9\.\-]+/g, "");
        let f = parseFloat(lon);
        if (!Number.isFinite(f)) f = 0;
        Options.weatherInfo.longitude = f;
        Options.save();

        // #FIXME: See FIXME of setDarkSkyAPIKey
    }

    view(vnode: m.Vnode<OptionsPaneAttrs, any>) {
        const newSection = (title: string, contents: m.Vnode<any, any>[]) => {
            return m("section.flex-column.margin-h", [m("h4", title)].concat(contents));
        };

        const themeOptions = [];
        for (const theme of themeMap.values()) {
            themeOptions.push(m("option", {
                value: theme.shortname,
                selected: Options.selectedThemeName === theme.shortname
            }, theme.name));
        }

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

                Options.displayWeather ? m(".margin-top", [
                    m(".form-group", [
                        m("label.form-label", "Units"),
                        m("select", {
                            value: Options.weatherInfo.units,
                            onchange: this.onWeatherUnitSelected
                        }, [
                            m("option", {
                                value: "imperial",
                                selected: Options.weatherInfo.units === "imperial"
                            }, "Imperial (Fahrenheit, Miles, ect..)"),

                            m("option", {
                                value: "si",
                                selected: Options.weatherInfo.units === "si"
                            }, "SI (Celcius, Kilometers, ect..)")
                        ])
                    ]),

                    m(".form-group", [
                        m("label.form-label", "Latitude"),
                        m("input.form-input.style-options-input", {
                            type: "text",
                            value: Options.weatherInfo.latitude,
                            onchange: m.withAttr("value", this.setWeatherLatitude),
                        })
                    ]),

                    m(".form-group", [
                        m("label.form-label", "Longitude"),
                        m("input.form-input.style-options-input", {
                            type: "text",
                            value: Options.weatherInfo.longitude,
                            onchange: m.withAttr("value", this.setWeatherLongitude),
                        })
                    ]),

                    m(".form-group", [
                        m("label.form-label", "Dark Sky API Key"),
                        m("input.form-input.style-options-input", {
                            type: "text",
                            value: Options.darkSky.apiKey,
                            oninput: m.withAttr("value", this.setDarkSkyAPIKey),
                        })
                    ]),

                    weatherControl.weatherSettingsDirty ? m("small.form-group", "Close Options To Update Weather") : null
                ]) : null
            ]),

            m("section.flex-column", [
                m(".margin-h", [
                    m("h4", "SpeedDial"),
                    m(".form-group", [
                        m(Switch, {
                            checked: Options.displaySpeedDial,
                            onchange: Options.withAttr<boolean>("checked", (o, v) => o.displaySpeedDial = v)
                        }, "Display Speed Dial"),
                    ]),

                    m(".form-group", [
                        m("label.form-label", "Item Width"),
                        m("input.form-input.style-options-input", {
                            value: Options.speedDialItemWidth,
                            type: "number", max: 1024, min: 32, step: 1,
                            onchange: Options.withAttr<string>("value", (o, v) => {
                                o.speedDialItemWidth = Math.max(Math.min(parseInt(v) || 160, 1024), 32);
                            })
                        }),
                    ])
                ]),
                m(SpeedDialEditor, {isHidden: vnode.attrs.isHidden})
            ]),

            m("section.flex-column.margin-h", [
                m("h4", "Theme"),
                m("select", {
                    value: Options.selectedThemeName,
                    onchange: this.onThemeSelected
                }, themeOptions)
            ]),

            m("section.flex-column", [
                m(".margin-h", [
                    m("h4", "Extra"),
                    m(".form-group", [
                        m(Switch, {
                            checked: Options.clockSpeedDialSeparator,
                            onchange: Options.withAttr<boolean>("checked", (o, v) => o.clockSpeedDialSeparator = v)
                        }, "Separator Between Clock And Speed Dial"),
                    ]),

                    m(".form-group", [
                        m(Switch, {
                            checked: Options.clockWeatherSeparator,
                            onchange: Options.withAttr<boolean>("checked", (o, v) => o.clockWeatherSeparator = v)
                        }, "Separator Between Weather And Clock"),
                    ]),
                ]),
            ]),
        ];

        return m(".minimal-options.mmt-style-options-pane", vnode.attrs, [
            m(".minimal-sections.margin-bottom", [
                m("section.margin-h", m("h2.margin-top", [icon(Icons.Settings, {style: "margin-right: 8px;"}), "Options"])),
                sections
            ])
        ]);
    }
}