const TEST_OWM_API_KEY = "";

export enum WeatherUnit { Celcius, Fahrenheit, Kelvin }
export enum WeatherIcon {  }

export interface WeatherService {
}

export interface CachedWeatherData {
    /** The time at which the weather data was cahced. */
    cacheTime: number;

    /** The weather data being cached. */
    weather: WeatherData;
}

export interface WeatherData {
    /** A description for this weather. */
    description: string;

    /** The icon used to represent this weather data. */
    icon: WeatherIcon;

    /** Temperature for this weather. */
    temp: number;

    /** Low temperature for this weather. */
    lowTemp: number;

    /** High temperature for this weather. */
    highTemp: number;

    /** The units that the temperatures of this weather data are in. */
    units: WeatherUnit;
}

// export default new WeatherService(TEST_API_KEY);