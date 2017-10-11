import parseColor from "./color-parser";

export function getUserLocale(): string {
    let language: string | undefined = undefined;
    if (window.navigator.languages && window.navigator.languages.length > 0) {
        language = window.navigator.languages[0];
    } else {
        if (typeof (window.navigator as any)["userLanguage"] === "string") {
            language = (window.navigator as any)["userLanguage"];
        } else if (typeof window.navigator.language === "string") {
            language = window.navigator.language;
        }
    }
    return language || "en-US";
}

export function extractURLHost(urlstring: string): string {
    try {
        const url = new URL(urlstring);
        return url.hostname || url.host || urlstring;
    } catch(e) {
        // in case we get an invalid url.
        return urlstring;
    }
}

export function clamp(x: number, min: number, max: number) {
    return Math.min(Math.max(x, min), max);
}

type TimeUnits = "ms" | "seconds" | "minutes" | "hours" | "days";
const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
export function reduceTime(time: number): [number, TimeUnits] {
    if (time >= DAY)       return [time / DAY, "days"];
    if (time >= HOUR)      return [time / HOUR, "hours"];
    if (time >= MINUTE)    return [time / MINUTE, "minutes"];
    if (time >= SECOND)    return [time / SECOND, "seconds"];
    return [time, "ms"];
}

/**
 * Poorly named but it's just a way for me to map
 * plural and singular time unit names to their units.
 */
const timeUnitStringMap: { [x: string]: {singular: string, plural: string} } = {
    ms: { plural: "milliseconds", singular: "millisecond" },
    seconds: { plural: "seconds", singular: "second" },
    minutes: { plural: "minutes", singular: "minute" },
    hours: { plural: "hours", singular: "hour" },
    days: { plural: "days", singular: "day" }
};

export function getDurationString(from: Date | number, to: Date | number) {
    const fromTime = (typeof from === "number" ? from : from.getTime());
    const toTime = (typeof to === "number" ? to : to.getTime());
    const ms = toTime - fromTime;
    let [value, units] = reduceTime(ms);
    value = Math.round(value);
    if (units === "ms") return "moments ago";
    if (units === "seconds") return "moments ago";
    const unitText = timeUnitStringMap[units];

    if (value === 1) { return `1 ${unitText.singular} ago`; }
    else { return `${value} ${unitText.plural} ago`; }
}

export function colorToRGBString(colorString: string | number): string {
    const parsed = parseColor(colorString);
    if (parsed) {
        const [r, g, b, a] = parsed;
        if (a === 1.0) return `rgb(${r}, ${g}, ${b})`;
        else return `rgb(${r}, ${g}, ${b}, ${a.toFixed(3)})`;
    } else {
        return "rgb(255, 255, 255, 0.0)";
    }
}