import { WeatherUnits, Weather } from "./common";
import { DSWeatherService } from "./darksky";
import { CMessage, CMessageType } from "../messaging";

export enum WeatherServiceType {
    DarkSky
}

export interface WeatherRequestMetadata {
    apiKey?: string;
}

export class CurrentWeatherRequest implements CMessage<Weather>  {
    public type = CMessageType.WeatherRequest

    latitude: number;
    longitide: number;
    units: WeatherUnits;
    service: WeatherServiceType;
    meta: WeatherRequestMetadata;

    constructor(options: {
        latitude: number,
        longitide: number,
        units: WeatherUnits,
        service: WeatherServiceType,
        meta: WeatherRequestMetadata,
    }) {
        this.latitude = options.latitude;
        this.longitide = options.longitide;
        this.units = options.units;
        this.service = options.service;
        this.meta = options.meta;
    }
}

export async function getCurrentWeather(request: CurrentWeatherRequest): Promise<Weather> {
    switch (request.service) {
        case WeatherServiceType.DarkSky: {
            if (!request.meta.apiKey) throw Error("Must provide an API key for Dark Sky.");
            const darkSky = new DSWeatherService(request.meta.apiKey);
            return await darkSky.getCurrentForecast(request.units, request.latitude, request.longitide);
        }
        default:
            throw Error("Bad weather request service type.");
    }
}