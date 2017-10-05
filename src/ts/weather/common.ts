export enum WeatherUnits { SI, Imperial }

export enum WeatherIcon {
    ClearDay = "sw-01",
    ClearNight = "sw-02",
    RainDay = "sw-12",
    SnowDay = "sw-14",
    SleetDay = "sw-16",
    WindDay = "sw-40",
    Fog = "sw-10",
    Cloudy = "sw-06",
    PartlyCloudyDay="sw-03",
    PartlyCloudyNight = "sw-07"
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