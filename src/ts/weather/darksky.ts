import MStorage from "../storage";
import { WeatherService, Weather, WeatherUnits, WeatherIcon } from "./common";

export enum DSWeatherUnit {
    /** Automatically select units based on geographic location */
    Auto="auto",

    /** Same as si, except that windSpeed is in kilometers per hour */
    Canada="ca",

    /** Same as si, except that nearestStormDistance and visibility are in miles and windSpeed is in miles per hour */
    UK="uk2",

    /** Imperial units (the default) */
    Imperial="us",

    /** SI units */
    SI="si"
}

export enum DSWeatherIcon {
    ClearDay = "clear-day",
    ClearNight = "clear-night",
    Rain = "rain",
    Snow = "snow",
    Sleet = "sleet",
    Wind = "wind",
    Fog = "fog",
    Cloudy = "cloudy",
    PartlyCloudyDay = "partly-cloudy-day",
    PartlyCloudyNight = "partly-cloudy-night",
}

export enum DSAlertSeverity {
    /** An individual should be aware of potentially severe weather */
    Advisory = "advisory",
    /** An individual should prepare for potentially severe weather */
    Watch = "watch",
    /** An individual should take immediate action to protect themselves and others from potentially severe weather */
    Warning = "warning"
}

const DSSupportedLanguages: string[] = [
    "ar", "az", "be", "bg", "bs", "ca", "cs", "de",
    "el", "en", "es", "et", "fr", "hr", "hu", "id",
    "it", "is", "kw", "nb", "nl", "pl", "pt", "ru",
    "sk", "sl", "sr", "sv", "te", "tr", "uk",
    "x-pig-latin", "zh", "zh-tw"
];

export interface DSResponseDataPoint {
    apparentTemperature?: number;
    apparentTemperatureHigh?: number;
    apparentTemperatureHighTime?: number;
    apparentTemperatureLow?: number;
    apparentTemperatureLowTime: number;
    cloudCover?: number;
    dewPoint?: number;
    humidity?: number;
    icon?: DSWeatherIcon;
    moonPhase?: number;
    nearestStormBearing?: number;
    nearestStormDistance?: number;
    ozone?: number;
    precipAccumulation?: number;
    precipIntensity?: number;
    precipIntensityMax?: number;
    precipIntensityMaxTime?: number;
    precipProbability?: number;
    precipType?: string;
    pressure?: number;
    summary?: string;
    sunriseTime?: number;
    sunsetTime?: number;
    temperature?: number;
    temperatureHigh?: number;
    temperatureHighTime?: number;
    temperatureLow?: number;
    temperatureLowTime?: number;
    temperatureMax?: number;
    temperatureMaxTime?: number;
    temperatureMin?: number;
    temperatureMinTime?: number;
    time: number;
    uvIndex?: number;
    uvIndexTime?: number;
    visibility?: number;
    windBearing?: number;
    windGust?: number;
    windSpeed?: number;
}

export interface DSResponseDataBlock {
    data: DSResponseDataPoint[];
    summary?: string;
    icon?: DSWeatherIcon;
}

export interface DSAlert {
    description: string;
    expires: number;
    regions: string[];
    severity: DSAlertSeverity;
    time: number;
    title: string;
    uri: string;
}

export interface DSFlags {
    "darksky-unavailable"?: string;
    sources: string[];
    units: DSWeatherUnit;
}

export interface DSResponse {
    latitude: number;
    longitude: number;
    timezone: string;
    currently?: DSResponseDataPoint;
    minutely?: DSResponseDataBlock;
    hourly?: DSResponseDataBlock;
    daily?: DSResponseDataBlock;
    alerts?: DSAlert[];
    flags?: DSFlags;
}

export function isDSResponse(obj: any): obj is DSResponse {
    return obj && typeof obj === "object" && obj.hasOwnProperty("latitude") && obj.hasOwnProperty("longitude") && obj.hasOwnProperty("timezone");
}

export interface DSForecastRequestOptions {
    longitude: number;
    latitude: number;
    exclude?: ("currently"|"minutely"|"hourly"|"daily"|"alerts"|"flags")[];
    extend?: "hourly";
    language?: string;
    units?: DSWeatherUnit;
}

export class DarkSkyAPI {
    constructor(private key: string) {}

    public async forcast(options: DSForecastRequestOptions): Promise<DSResponse> {
        const requestData: any = {};
        if (options.exclude) requestData["exclude"] = options.exclude.join(",");
        if (options.extend) requestData["extend"] = options.extend;
        if (options.language) requestData["lang"] = options.language;
        if (options.units) requestData["units"] = options.units as string;

        const fullURL = Object.keys(requestData).reduce((acc, cur, idx) => {
            const key = encodeURIComponent(cur);
            const val = encodeURIComponent(requestData[cur]);
            return acc + (idx > 0 ? `&${key}=${val}` : `${key}=${val}`);
        }, `https://api.darksky.net/forecast/${this.key}/${options.latitude},${options.longitude}?`);

        const response = await fetch(fullURL, {
            method: "GET"
        }).then((resp) => resp.json());

        if (isDSResponse(response)) {
            return response;
        } else {
            throw new Error("Received a bad weather response.");
        }
    }
}

// #FIXME: These could probably just be free functions.
export class DSWeatherService implements WeatherService {
    private api: DarkSkyAPI;

    constructor(apiKey: string) {
        this.api = new DarkSkyAPI(apiKey);
    }

    private convertToDSUnits(wunits: WeatherUnits): DSWeatherUnit {
        switch (wunits) {
            case WeatherUnits.SI: return DSWeatherUnit.SI;
            case WeatherUnits.Imperial:
            default: return DSWeatherUnit.Imperial;
        }
    }

    private convertDSIconToMIcon(dsIcon?: DSWeatherIcon): WeatherIcon {
        if (dsIcon) {
            switch (dsIcon) {
                case DSWeatherIcon.ClearDay: return WeatherIcon.ClearDay;
                case DSWeatherIcon.ClearNight: return WeatherIcon.ClearNight;
                case DSWeatherIcon.Rain: return WeatherIcon.RainDay;
                case DSWeatherIcon.Snow: return WeatherIcon.SnowDay;
                case DSWeatherIcon.Sleet: return WeatherIcon.SleetDay;
                case DSWeatherIcon.Wind: return WeatherIcon.WindDay;
                case DSWeatherIcon.Fog: return WeatherIcon.Fog;
                case DSWeatherIcon.Cloudy: return WeatherIcon.Cloudy;
                case DSWeatherIcon.PartlyCloudyDay: return WeatherIcon.PartlyCloudyDay;
                case DSWeatherIcon.PartlyCloudyNight: return WeatherIcon.PartlyCloudyNight;
            }
        }

        // #FIXME: Should have a better default than this one.
        return WeatherIcon.Cloudy;
    }

    public async getCurrentForecast(units: WeatherUnits, latitude: number, longitude: number): Promise<Weather> {
        const dsWeather = await this.api.forcast({
            latitude,
            longitude,
            units: this.convertToDSUnits(units),
            exclude: ["daily", "hourly", "minutely", "alerts"],
        });

        if (!dsWeather.currently) throw new Error("Error while getting DarkSky Weather. No current weather info.");

        return {
            temp: dsWeather.currently.temperature!,
            highTemp: dsWeather.currently.temperatureHigh,
            lowTemp: dsWeather.currently.temperatureLow,
            icon: this.convertDSIconToMIcon(dsWeather.currently.icon),
            units,
            summary: dsWeather.currently.summary!,
            created: Date.now()
        };
    }
}