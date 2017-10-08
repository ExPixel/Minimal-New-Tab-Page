export interface IMinimalTheme {
    name: string,
    shortname: string,
    backgroundColor: string;
    backgroundColorDark: string;
    textColor: string;
    metaColor: string;
    accentColor: string;
}

const ON_LIGHT_TEXT_COLOR = "#343a40";
const ON_LIGHT_META_COLOR = "rgba(52, 58, 64, 0.6)";

const ON_DARK_TEXT_COLOR = "#f8f9fa";
const ON_DARK_META_COLOR = "rgba(255, 255, 255, 0.6)";

export const themeKeys = [
    "backgroundColor",
    "backgroundColorDark",
    "textColor",
    "metaColor",
    "accentColor",
];

const darkTheme: IMinimalTheme = {
    name: "Dark Theme",
    shortname: "dark-theme",
    backgroundColor: "#343a40",
    backgroundColorDark: "#212529",
    textColor: ON_DARK_TEXT_COLOR,
    metaColor: ON_DARK_META_COLOR,
    accentColor: "#228ae6"
};

const lightTheme: IMinimalTheme = {
    name: "Light Theme",
    shortname: "light-theme",
    backgroundColor: "#f8f9fa",
    backgroundColorDark: "#e9ecef",
    textColor: ON_LIGHT_TEXT_COLOR,
    metaColor: ON_LIGHT_META_COLOR,
    accentColor: "#228ae6"
};

const purpleTheme: IMinimalTheme = {
    name: "Purple Theme",
    shortname: "purple-theme",
    backgroundColor: "#71397C",
    backgroundColorDark: "#60366F",
    textColor: ON_DARK_TEXT_COLOR,
    metaColor: ON_DARK_META_COLOR,
    accentColor: "#FFDF5A"
};

const darkBerryTheme: IMinimalTheme = {
    name: "Dark Berry Theme",
    shortname: "dark-berry-theme",
    backgroundColor: "#900C3F",
    backgroundColorDark: "#581845",
    textColor: "#f8f9fa",
    metaColor: "rgba(255, 255, 255, 0.6)",
    accentColor: "#FF5733"
};

const mignightRedTheme: IMinimalTheme = {
    name: "Midnight Red Theme",
    shortname: "midnight-red-theme",
    backgroundColor: "#2B2E4A",
    backgroundColorDark: "#53354A",
    textColor: ON_DARK_TEXT_COLOR,
    metaColor: ON_DARK_META_COLOR,
    accentColor: "#E84545"
};

const seaBlueTheme: IMinimalTheme = {
    name: "Sea Blue Theme",
    shortname: "sea-blue-theme",
    backgroundColor: "#0278AE",
    backgroundColorDark: "#01577e",
    textColor: ON_DARK_TEXT_COLOR,
    metaColor: ON_DARK_META_COLOR,
    accentColor: "#9EF5CF",
};

const forestTheme: IMinimalTheme = {
    name: "Forest Theme",
    shortname: "forest-theme",
    backgroundColor: "#CFB590",
    backgroundColorDark: "#c1a071",
    textColor: ON_LIGHT_TEXT_COLOR,
    metaColor: ON_LIGHT_META_COLOR,
    accentColor: "#758918"
};

const machuPicchuTheme: IMinimalTheme = {
    name: "Machu Picchu Theme",
    shortname: "machu-picchu-theme",
    backgroundColor: "#607848",
    backgroundColorDark: "#4d6039",
    textColor: ON_DARK_TEXT_COLOR,
    metaColor: ON_DARK_META_COLOR,
    accentColor: "#F0F0D8"
};

export const customTheme: IMinimalTheme = {
    name: "Custom Theme",
    shortname: "custom-theme",
    backgroundColor: "#f8f9fa",
    backgroundColorDark: "#e9ecef",
    textColor: "#f8f9fa",
    metaColor: "rgba(255, 255, 255, 0.6)",
    accentColor: "#228ae6"
};

export const themeMap = new Map([
    [darkTheme.shortname, darkTheme],
    [lightTheme.shortname, lightTheme],
    [purpleTheme.shortname, purpleTheme],
    [darkBerryTheme.shortname, darkBerryTheme],
    [mignightRedTheme.shortname, mignightRedTheme],
    [seaBlueTheme.shortname, seaBlueTheme],
    [forestTheme.shortname, forestTheme],
    [machuPicchuTheme.shortname, machuPicchuTheme]
]);

export const defaultThemeName = "dark-theme";
export const defaultTheme: IMinimalTheme = themeMap.get(defaultThemeName) as IMinimalTheme;

export function getThemeByName(name: string): IMinimalTheme | undefined {
    const map = themeMap;
    return themeMap.get(name);
}