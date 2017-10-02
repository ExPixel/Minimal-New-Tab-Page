import m = require("mithril");
import WeatherService from "../../ts/weather";

export default class WeatherDisplay implements m.Component<any, any> {
    view() {
        return m(".weather-display", "Weather Display");
    }
}