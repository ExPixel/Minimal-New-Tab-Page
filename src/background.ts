import { getCurrentWeather, CurrentWeatherRequest } from "./ts/weather";
import { CMessage, isCMessage, CMessageType, CTimeRequest } from "./ts/messaging";
import { getCachedCurrentWeatherRequestResponse, setCachedCurrentWeatherRequestResponse } from "./ts/weather/cache";

async function handleCMessage(request: CMessage<any>, sendResponse: (resp: any) => any) {
    switch (request.type) {
        case CMessageType.TimeRequest: {
            // const timeRequest: CTimeRequest = request;
            sendResponse(Date.now());
            break;
        }

        case CMessageType.WeatherRequest: {
            const weatherRequest = request as CurrentWeatherRequest;
            const cachedResponse = getCachedCurrentWeatherRequestResponse(weatherRequest);
            if (cachedResponse) {
                sendResponse(cachedResponse);
            } else {
                const weather = await getCurrentWeather(weatherRequest);
                setCachedCurrentWeatherRequestResponse(weatherRequest, weather);
                sendResponse(weather);
            }
            break;
        }

        default: {
            console.error("Unhandled request type: ", request.type);
            sendResponse(null); // #TODO: Maybe I should send back some sort of error object :P
            break;
        }
    }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (!isCMessage(request)) {
        sendResponse("<<BAD MESSAGE>>");
        return false;
    } else {
        handleCMessage(request, sendResponse);
        return true;
    }
});