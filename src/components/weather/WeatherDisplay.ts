import m = require("mithril");
import { Weather, WeatherUnits } from "../../ts/weather/common";
import { sendTypedMessage, CMessage } from "../../ts/messaging";
import { CurrentWeatherRequest, WeatherRequestMetadata, WeatherServiceType } from "../../ts/weather/index";
import Options from "../../ts/options";
import { icon, Icons } from "../icons/icons";
// import WeatherService from "../../ts/weather";

export default class WeatherDisplay implements m.Component<any, any> {
    private loading: boolean = false;
    private weather: Weather | null = null;
    private errorString: string | null = null;
    private weatherUpdatingInterval: number | null = null;

    constructor() {
    }

    private setupInterval() {
        this.clearInterval();
        this.weatherUpdatingInterval = setInterval(() => {
            this.getCurrentWeather();
        }, 30 * (1000 * 60));
    }

    private clearInterval() {
        if(typeof this.weatherUpdatingInterval === "number") {
            clearInterval(this.weatherUpdatingInterval);
            this.weatherUpdatingInterval = null;
        }
    }

    public oninit() {
        if(typeof this.weatherUpdatingInterval !== "number") {
            this.getCurrentWeather();
            this.setupInterval();
        }
    }

    public oncreate() {
        if(typeof this.weatherUpdatingInterval !== "number") {
            this.getCurrentWeather();
            this.setupInterval();
        }
    }

    public onbeforeremove() {
        this.clearInterval();
    }

    private async getCurrentWeather() {
        if (this.loading) return;
        this.loading = true;
        this.errorString = null;

        const units = Options.weatherInfo.units === "imperial" ? WeatherUnits.Imperial : WeatherUnits.SI;
        let meta: WeatherRequestMetadata;
        let service: WeatherServiceType;
        switch (Options.weatherService) {
            default: // #TODO: temporary...or not.
            case "dark-sky": {
                if (!Options.darkSky.apiKey || Options.darkSky.apiKey.length < 1) {
                    // #FIXME: Don't really like how this is written at the moment.
                    this.errorString = "Dark Sky requires an API key.";
                    this.loading = false;
                    m.redraw();
                    return;
                }
                meta = { apiKey: Options.darkSky.apiKey };
                service = WeatherServiceType.DarkSky;
            }
        }

        const weatherRequest = new CurrentWeatherRequest({
            latitude: Options.weatherInfo.latitude,
            longitude: Options.weatherInfo.longitude,
            units: units,
            meta,
            service
        });
        const response = await sendTypedMessage(weatherRequest as CMessage<Weather>);
        this.weather = response;

        this.loading = false;
        m.redraw();
    }

    view() {
        if (this.errorString) {
            return m(".weather-display", [
                m("span", icon(Icons.AlertCircle)),
                m("span", this.errorString)
            ]);
        } else if (this.weather) {
            const unitText = this.weather.units === WeatherUnits.Imperial ? "˚F" : "˚C"
            const weatherIconSrc = `img/weather/${this.weather.icon}.svg`;

            return m(".weather-display.flex-column", [
                m(".flex-row", [
                    m("img.weather-icon", {src: weatherIconSrc}),
                    m(".weather-temp", `${this.weather.temp.toFixed(0)} ${unitText}`)
                ]),

                m(".flex-row", [
                    m(".weather-summary", this.weather.summary)
                ])
            ]);
        }
    }
}