import m = require("mithril");
import WeatherService from "./Weather";

export default class WeatherDisplay implements m.Component<any, any> {
    view() {
        return m(".weather-display", "Weather Display");
    }
}