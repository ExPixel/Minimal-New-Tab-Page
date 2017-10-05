import m = require("mithril");
import { Weather, WeatherUnits } from "../../ts/weather/common";
import { sendTypedMessage, CMessage } from "../../ts/messaging";
import { CurrentWeatherRequest, WeatherRequestMetadata, WeatherServiceType } from "../../ts/weather/index";
import Options from "../../ts/options";
import { icon, Icons } from "../icons/icons";
// import WeatherService from "../../ts/weather";

export const weatherControl = {
    weatherIsDirty: false
};

export default class WeatherDisplay implements m.Component<any, any> {
    private loading: boolean = false;
    private weatherIconSvg: string | null = null;
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

    public onbeforeupdate() {
        if (weatherControl.weatherIsDirty) {
            weatherControl.weatherIsDirty = false;
            this.getCurrentWeather();
            this.setupInterval();
        }
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

        const weatherIconUrl = `img/weather/${this.weather.icon}.svg`;
        const weatherIconSvg = await fetch(weatherIconUrl).then(r => r.text());
        this.weatherIconSvg = weatherIconSvg;
        

        this.loading = false;
        weatherControl.weatherIsDirty = false;
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

            return m(".weather-display.flex-column.flex-center", [
                m(".flex-row.flex-center-cross", [
                    m(".weather-icon.margin-right", icon(this.weatherIconSvg || Icons.SimpleWeatherCloudy)),
                    m(".weather-temp", `${this.weather.temp.toFixed(0)} ${unitText}`)
                ]),

                m(".flex-row.flex-center", [
                    m(".weather-summary", this.weather.summary)
                ])
            ]);
        }
    }
}