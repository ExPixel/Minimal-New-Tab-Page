// import m = require("mithril");
// import MStorage from "./storage";

// export enum WeatherUnit {
//     /** Automatically select units based on geographic location */
//     Auto="auto",

//     /** Same as si, except that windSpeed is in kilometers per hour */
//     Canada="ca",

//     /** Same as si, except that nearestStormDistance and visibility are in miles and windSpeed is in miles per hour */
//     UK="uk2",

//     /** Imperial units (the default) */
//     Imperial="us",

//     /** SI units */
//     SI="si"
// }

// export enum WeatherIcon {
//     ClearDay = "clear-day",
//     ClearNight = "clear-night",
//     Rain = "rain",
//     Snow = "snow",
//     Sleet = "sleet",
//     Wind = "wind",
//     Fog = "fog",
//     Cloudy = "cloudy",
//     PartlyCloudyDay = "partly-cloudy-day",
//     PartlyCloudyNight = "partly-cloudy-night",
// }

// export enum WeatherAlertSeverity {
//     /** An individual should be aware of potentially severe weather */
//     Advisory = "advisory",
//     /** An individual should prepare for potentially severe weather */
//     Watch = "watch",
//     /** An individual should take immediate action to protect themselves and others from potentially severe weather */
//     Warning = "warning"
// }

// const supportedLanguages: string[] = [
//     "ar", "az", "be", "bg", "bs", "ca", "cs", "de",
//     "el", "en", "es", "et", "fr", "hr", "hu", "id",
//     "it", "is", "kw", "nb", "nl", "pl", "pt", "ru",
//     "sk", "sl", "sr", "sv", "te", "tr", "uk",
//     "x-pig-latin", "zh", "zh-tw"
// ];

// export interface WeatherResponseDataPoint {
//     apparentTemperature?: number;
//     apparentTemperatureHigh?: number;
//     apparentTemperatureHighTime?: number;
//     apparentTemperatureLow?: number;
//     apparentTemperatureLowTime: number;
//     cloudCover?: number;
//     dewPoint?: number;
//     humidity?: number;
//     icon?: WeatherIcon;
//     moonPhase?: number;
//     nearestStormBearing?: number;
//     nearestStormDistance?: number;
//     ozone?: number;
//     precipAccumulation?: number;
//     precipIntensity?: number;
//     precipIntensityMax?: number;
//     precipIntensityMaxTime?: number;
//     precipProbability?: number;
//     precipType?: string;
//     pressure?: number;
//     summary?: string;
//     sunriseTime?: number;
//     sunsetTime?: number;
//     temperature?: number;
//     temperatureHigh?: number;
//     temperatureHighTime?: number;
//     temperatureLow?: number;
//     temperatureLowTime?: number;
//     temperatureMax?: number;
//     temperatureMaxTime?: number;
//     temperatureMin?: number;
//     temperatureMinTime?: number;
//     time: number;
//     uvIndex?: number;
//     uvIndexTime?: number;
//     visibility?: number;
//     windBearing?: number;
//     windGust?: number;
//     windSpeed?: number;
// }

// export interface WeatherResponseDataBlock {
//     data: WeatherResponseDataPoint[];
//     summary?: string;
//     icon?: WeatherIcon;
// }

// export interface WeatherAlert {
//     description: string;
//     expires: number;
//     regions: string[];
//     severity: WeatherAlertSeverity;
//     time: number;
//     title: string;
//     uri: string;
// }

// export interface WeatherFlags {
//     "darksky-unavailable"?: string;
//     sources: string[];
//     units: WeatherUnit;
// }

// export interface WeatherResponse {
//     latitude: number;
//     longitude: number;
//     timezone: string;
//     currently?: WeatherResponseDataPoint;
//     minutely?: WeatherResponseDataBlock;
//     hourly?: WeatherResponseDataBlock;
//     daily?: WeatherResponseDataBlock;
//     alerts?: WeatherAlert[];
//     flags?: WeatherFlags;
// }

// export function isWeatherResponse(obj: any): obj is WeatherResponse {
//     return obj && typeof obj === "object" && obj.hasOwnProperty("latitude") && obj.hasOwnProperty("longitude") && obj.hasOwnProperty("timezone");
// }

// export interface DarkSkyForecastRequestOptions {
//     longitude: number;
//     latitude: number;
//     exclude?: ("currently"|"minutely"|"hourly"|"daily"|"alerts"|"flags")[];
//     extend?: "hourly";
//     language?: string;
//     units?: WeatherUnit;
// }

// export class DarkSkyAPI {
//     constructor(private key: string) {}

//     public async forcast(options: DarkSkyForecastRequestOptions): Promise<WeatherResponse> {
//         const requestData: any = {};
//         if (options.exclude) requestData["exclude"] = options.exclude.join(",");
//         if (options.extend) requestData["extend"] = options.extend;
//         if (options.language) requestData["lang"] = options.language;
//         if (options.units) requestData["units"] = options.units as string;

//         const response = await m.request({
//             method: "GET",
//             url: `https://api.darksky.net/forecast/${this.key}/${options.latitude},${options.longitude}`,
//             data: requestData,
//             background: true
//         });

//         if (isWeatherResponse(response)) {
//             return response;
//         } else {
//             throw new Error("Received a bad weather response.");
//         }
//     }
// }

// export class CachedForecastRequest {
//     longitude: number;
//     latitude: number;
//     units: WeatherUnit;
//     response: WeatherResponse;
// }

// export default class Weather {
//     private api: DarkSkyAPI;

//     constructor(apiKey: string) {
//         this.api = new DarkSkyAPI(apiKey);
//     }

//     public async getCurrentForecast(units: WeatherUnit, latitude: number, longitude: number): Promise<WeatherResponse> {
//         const cached = MStorage.ttlGet<CachedForecastRequest>("weather.forecast");

//         // #TODO: invalidate a forecast if it was made the day before as well.
//         if (cached &&
//             cached.latitude === latitude &&
//             cached.longitude === longitude &&
//             cached.units === units) {
//             return cached.response;
//         } else {
//             const storageTime = (1000 * 60 * 60 * 3); // 3 hours.
//             const response = await this.api.forcast({
//                 longitude,
//                 latitude,
//                 exclude: ["daily", "hourly", "minutely", "alerts"]
//             });
//             const cachedResponse: CachedForecastRequest = { longitude, latitude, units, response };
//             MStorage.ttlSet("weather.forecast", storageTime, cachedResponse);
//             return response;
//         }
//     }
// }