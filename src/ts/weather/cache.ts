import { Weather } from "./common";
import { CurrentWeatherRequest } from "./index";
import MStorage from "../storage";

const WEATHER_REQUEST_LS_KEY = "weather.cache.request";
const WEATHER_RESPONSE_LS_KEY = "weather.cache.response";
const WEATHER_REQUEST_CACHE_TIME = 3 * (3600000); // X (hours)

/**
 * Tries to get a weather request from the cache if it is available.
 * @param request The request to get from the cache.
 */
export function getCachedCurrentWeatherRequestResponse(request: CurrentWeatherRequest): Weather | undefined {
    const [rawLastCachedRequest, lastCachedRequestTTL] = MStorage.ttlGetWithTTL<any>(WEATHER_REQUEST_LS_KEY);
    if (rawLastCachedRequest && lastCachedRequestTTL) {
        // #TODO: check the TTL and make sure that the lastCachedRequestTTL is from the same day as today.
        const lastCachedRequest = new CurrentWeatherRequest(rawLastCachedRequest);
        if (lastCachedRequest.equals(request)) {
            return MStorage.get(WEATHER_RESPONSE_LS_KEY);
        } else {
            return undefined;
        }
    } else {
        return undefined;
    }
}

export function setCachedCurrentWeatherRequestResponse(request: CurrentWeatherRequest, response: Weather) {
    MStorage.ttlSet(WEATHER_REQUEST_LS_KEY, WEATHER_REQUEST_CACHE_TIME, request);
    MStorage.set(WEATHER_RESPONSE_LS_KEY, response);
}