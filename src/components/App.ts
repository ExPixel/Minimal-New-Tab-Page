import m = require("mithril");

import TimeDisplay from "./TimeDisplay";
import DateDisplay from "./DateDisplay";
import WeatherDisplay from "./weather/WeatherDisplay";
import SpeedDialList from "./speed-dial/SpeedDialList";
import OptionsPane from "./options/OptionsPane";
import Options from "../ts/options";
import SpeedDial from "../ts/speed-dial";
import { icon, Icons } from "./icons/icons";

export default class App implements m.Component<any, any> {
    private optionsOpen: boolean = false;

    /**
     * This is true if the options page has been generated at least
     * once and is therefore already in the DOM.
     */
    private optionsPageGenerated: boolean = false;

    constructor() {
        this.toggleOptions = this.toggleOptions.bind(this);
    }

    oninit() {
    }

    private toggleOptions() {
        this.optionsOpen = !this.optionsOpen;
    }

    view() {
        let weatherSection = null;
        if (Options.displayWeather) {
            weatherSection = m("section.minimal-section-weather", [
                m(WeatherDisplay)
            ])
        }

        let clocksSection = null;
        if (Options.displayDate || Options.displayTime) {
            clocksSection = m("section.minimal-section-clocks", [
                m(".margin-h2", [
                    Options.displayTime ? m(TimeDisplay, { showSeconds: Options.displaySeconds }) : null,
                    Options.displayDate ? m(DateDisplay, {}) : null,
                ]),
                m(".minimal-main-separator.mmt-style-main-separator"),
            ])
        }

        let speedDialSection = null;
        if (Options.displaySpeedDial && SpeedDial.getItems().length > 0) {
            speedDialSection = m("section.minimal-section-speed-dial.flex-stretch-self.flex-row", [
                m("div.flex-1.hide-lt-sm"),
                m("div.flex-2.flex-layout",
                    m(".flex-1.flex-row.flex-center", [m(SpeedDialList)])
                ),
                m("div.flex-1.hide-lt-sm"),
            ])
        }

        let optionsPage = null;
        if (this.optionsOpen) {
            optionsPage = m(OptionsPane, { class: "minimal-options-show", isHidden: false });
            this.optionsPageGenerated = true;
        } else if (this.optionsPageGenerated) {
            // #TODO: Only make the page disappear but leave it in the DOM.
            optionsPage = m(OptionsPane, { class: "minimal-options-hide", isHidden: true });
        }

        return m("div.app-container.mmt-style-app.flex-row", [
             optionsPage,

            m("div.flex-1.flex-column", 
                // Main Content In Center
                m("div.flex-1.flex-column.flex-center.flex-center-cross.minimal-sections.scroll-y", [
                    weatherSection,
                    clocksSection,
                    speedDialSection
                ]),

                m("div.minimal-footer.flex-row", [
                    m("button.icon-button.icon-rotate-selected.btn-large.mmt-style-icon-button", {
                        onclick: this.toggleOptions,
                        class: "" + (this.optionsOpen ? "selected" : "")
                    }, icon(Icons.Settings))
                ])
            )
        ]);
    }
}