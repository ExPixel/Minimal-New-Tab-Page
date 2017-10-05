import { WeatherUnits, Weather } from "./common";
import { DSWeatherService } from "./darksky";
import { CMessage, CMessageType } from "../messaging";
import { WEATHER_API_VERSION } from "../constants";

export enum WeatherServiceType {
    DarkSky = 0
}

export interface WeatherRequestMetadata {
    apiKey?: string;
}

export class CurrentWeatherRequest implements CMessage<Weather>  {
    public type = CMessageType.WeatherRequest

    latitude: number;
    longitude: number;
    units: WeatherUnits;
    service: WeatherServiceType;
    meta: WeatherRequestMetadata;
    version: number;

    constructor(options: {
        latitude: number,
        longitude: number,
        units: WeatherUnits,
        service: WeatherServiceType,
        meta: WeatherRequestMetadata,
        version?: number
    }) {
        this.latitude = options.latitude;
        this.longitude = options.longitude;
        this.units = options.units;
        this.service = options.service;
        this.meta = options.meta;

        if (typeof options.version === "number") {
            this.version = options.version;
        } else {
            this.version = WEATHER_API_VERSION;
        }
    }

    public equals(other: CurrentWeatherRequest): boolean {
        return (this.version === other.version) &&
            (this.latitude === other.latitude) &&
            (this.longitude === other.longitude) &&
            (this.units === other.units) &&
            (this.service === other.service) &&
            (this.meta.apiKey === other.meta.apiKey);
    }
}

export async function getCurrentWeather(request: CurrentWeatherRequest): Promise<Weather> {
    switch (request.service) {
        case WeatherServiceType.DarkSky: {
            if (!request.meta.apiKey) throw Error("Must provide an API key for Dark Sky.");
            const darkSky = new DSWeatherService(request.meta.apiKey);
            return await darkSky.getCurrentForecast(request.units, request.latitude, request.longitude);
        }
        default:
            throw Error("Bad weather request service type.");
    }
}