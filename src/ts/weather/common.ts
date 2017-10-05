export enum WeatherUnits { SI, Imperial }

export enum WeatherIcon {
    Unknown
}

export interface Weather {
    temp: number;
    lowTemp?: number;
    highTemp?: number;
    summary: string;
    icon: WeatherIcon;
    locationName?: string;
    units: WeatherUnits;
}

export interface WeatherService {
    getCurrentForecast(units: WeatherUnits, latitude: number, longitude: number): Promise<Weather>;
}