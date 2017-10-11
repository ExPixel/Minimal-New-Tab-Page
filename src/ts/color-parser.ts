type RGBA = [number, number, number, number];

function parsePercent(percent: string) {
    const trimmed = percent.trim();
    if (trimmed.endsWith("%")) {
        return parseFloat(trimmed.substr(0, trimmed.length - 1));
    }
    return NaN;
}

function hex(hexString: string): RGBA | null {
    if (hexString.length === 8) {
        // aarrggbb
        const col = parseInt(hexString, 16);
        return [
            (col >> 16) & 0xFF, // r
            (col >>  8) & 0xFF, // g
            (col      ) & 0xFF, // b
            ((col >> 24) & 0xFF) / 255  // a
        ];
    } else if (hexString.length === 6) {
        // rrggbb
        const col = parseInt(hexString, 16);
        return [
            (col >> 16) & 0xFF, // r
            (col >>  8) & 0xFF, // g
            (col      ) & 0xFF, // b
            1.0                 // a
        ];
    } else if (hexString.length === 3) {
        // rgb
        const col = parseInt(hexString, 16);
        const r = (col >> 8) & 0xF
            , g = (col >> 4) & 0xF
            , b = (col     ) & 0xF;
        return [
            r | (r << 4), // r
            g | (g << 4), // g
            b | (b << 4), // b
            1.0           // a
        ];
    } else {
        return null;
    }
}

function rgb(args: string): RGBA | null {
    const argsArr = args.split(",");
    if (argsArr.length === 3) {
        const r = parseInt(argsArr[0]);
        const g = parseInt(argsArr[1]);
        const b = parseInt(argsArr[2]);
        if (Number.isFinite(r) && Number.isFinite(g) && Number.isFinite(b)) {
            return [
                Math.min(Math.max(r, 0), 255), 
                Math.min(Math.max(g, 0), 255), 
                Math.min(Math.max(b, 0), 255), 
                1.0
            ];
        }
    }
    return null;
}

function rgba(args: string): RGBA | null {
    const argsArr = args.split(",");
    if (argsArr.length === 4) {
        const r = parseInt(argsArr[0]);
        const g = parseInt(argsArr[1]);
        const b = parseInt(argsArr[2]);
        const a = parseFloat(argsArr[3]);
        if (Number.isFinite(r) && Number.isFinite(g) && Number.isFinite(b) && Number.isFinite(a)) {
            return [
                Math.min(Math.max(r, 0), 255), 
                Math.min(Math.max(g, 0), 255), 
                Math.min(Math.max(b, 0), 255), 
                Math.min(Math.max(a, 0), 1.0)
            ];
        }
    }
    return null;
}

/**
 * Converts HSL to RGB with a precomputed alpha component.
 * @param h Hue
 * @param s Saturation
 * @param l Lightness
 * @param a A value that is just placed at the end of the array.
 */
function _hsl(h: number, s: number, l: number, a: number): RGBA | null {
    h = Math.min(Math.max(h, 0), 360 - Number.MIN_VALUE);
    s = Math.min(Math.max(s, 0), 100) / 100;
    l = Math.min(Math.max(l, 0), 100) / 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - (c / 2);
    let _r, _g, _b;

    if (h < 60)       {_r = c; _g = x; _b = 0;}
    else if (h < 120) {_r = x; _g = c; _b = 0;}
    else if (h < 180) {_r = 0; _g = c; _b = x;}
    else if (h < 240) {_r = 0; _g = x; _b = c;}
    else if (h < 300) {_r = x; _g = 0; _b = c;}
    else              {_r = c; _g = 0; _b = x;}

    return [
        Math.floor((_r + m) * 255),
        Math.floor((_g + m) * 255),
        Math.floor((_b + m) * 255),
        a
    ];
}

function hsl(args: string): RGBA | null {
    const argsArr = args.split(",");
    if (argsArr.length === 3) {
        let h = parseInt(argsArr[0]);
        let s = parsePercent(argsArr[1]);
        let l = parsePercent(argsArr[2]);
        if (Number.isFinite(h) && Number.isFinite(s) && Number.isFinite(l)) {
            return _hsl(h, s, l, 1.0);
        }
    }
    return null;
}

function hsla(args: string): RGBA | null {
    const argsArr = args.split(",");
    if (argsArr.length === 4) {
        let h = parseInt(argsArr[0]);
        let s = parsePercent(argsArr[1]);
        let l = parsePercent(argsArr[2]);
        const a = parseFloat(argsArr[3]);
        if (Number.isFinite(h) && Number.isFinite(s) && Number.isFinite(l)) {
            return _hsl(h, s, l, Math.min(Math.max(a, 0), 1.0));
        }
    }
    return null;
}

const CSSFunctions: { [f: string]: ((args: string) => RGBA | null) } = {
    "rgb": rgb,
    "rgba": rgba,
    "hsl": hsl,
    "hsla": hsla
};

/**
 * Parses an input color in the following formats and returns in array ([R, G, B, A]):
 * - "#rrggbb"
 * - "#aarrggbb"
 * - "#rgb"
 * - "rgb(R, G, B)"
 * - "rgba(R, G, B, A)"
 * - "hsl(H, S, L)"
 * - "hsla(H, S, L, A)"
 * 
 * Keep in mind that except in the case of "#aarrggbb" the A component is a float in the range [0, 1], not a byte like R, G, and B.
 * @param colorString The input color string to parse. Should be in the same format as colors used in CSS.
 */
export default function parseColor(colorString: string | number): RGBA | null {
    if (typeof colorString === "string") {
        const hexMatch = colorString.match(/^\#(\w{3,8})$/);
        if (hexMatch) { return hex(hexMatch[1]); }
        const cssFunctionMatch = colorString.match(/^(rgb|rgba|hsl|hsla)\(([\w\.\,\s\%]+)\)$/);
        if (cssFunctionMatch) {
            const cssFunctionName = cssFunctionMatch[1];
            const cssFunctionArgs = cssFunctionMatch[2];
            const cssFunction = CSSFunctions[cssFunctionName];
            if (cssFunction) {
                return cssFunction(cssFunctionArgs);
            } else {
                return null;
            }
        }
        return null;
    } else if (typeof colorString === "number") {
        return [
            (colorString >> 16) & 0xFF, // r
            (colorString >>  8) & 0xFF, // g
            (colorString      ) & 0xFF, // b
            (colorString >> 24) & 0xFF  // a
        ];
    } else {
        return null;
    }
}