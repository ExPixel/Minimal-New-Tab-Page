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