export enum CMessageType {
    WeatherRequest,
    TimeRequest
}

/**
 * Message passed using chrome message passing APIs.
 */
export interface CMessage<ResponseType> { type: CMessageType }
export class CTimeRequest implements CMessage<number> {
    public type = CMessageType.TimeRequest;
}

export function isCMessage(obj: any): obj is CMessage<any> {
    return obj && (typeof obj["type"] === "number");
}

// export interface CWeatherRequest extends CMessage<> {
//     type: CMessageType.WeatherRequest,
//     latitude: number,
//     longitude: number,
//     units: string
// }

export function sendTypedMessageCB<T>(message: CMessage<T>, responseCallback: (response: T) => any): void;
export function sendTypedMessageCB<T>(message: CMessage<T>, options: chrome.runtime.MessageOptions, responseCallback: (response: T) => any): void;
export function sendTypedMessageCB<T>(message: CMessage<T>) {
    let _options: undefined | chrome.runtime.MessageOptions;
    let _responseCallback: (response: T) => any;
    if (arguments.length === 2) {
        _options = undefined;
        _responseCallback = arguments[1];
    } else if (arguments.length === 3) {
        _options = arguments[1];
        _responseCallback = arguments[2];        
    } else {
        throw new Error("Wrong number of arguments passed to sendTypedMessageCB.");
    }

    if (_options) {
        chrome.runtime.sendMessage(message, _options, (response) => {
            _responseCallback(response as T);
        });
    } else {
        chrome.runtime.sendMessage(message, (response) => {
            _responseCallback(response as T);
        });
    }
}

export function sendTypedMessage<T>(message: CMessage<T>, options?: chrome.runtime.MessageOptions): Promise<T> {
    return new Promise((resolve, reject) => {
        if (options) { sendTypedMessageCB(message, options, resolve); }
        else { sendTypedMessageCB(message, resolve); }
    });
}