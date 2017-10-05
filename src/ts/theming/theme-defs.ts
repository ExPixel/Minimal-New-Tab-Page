export interface IMinimalTheme {
    name: string,
    shortname: string,
    backgroundColor: string;
    backgroundColorDark: string;
    textColor: string;
    metaColor: string;
    accentColor: string;
}

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
    textColor: "#f8f9fa",
    metaColor: "#ced4da",
    accentColor: "#228ae6"
};

const lightTheme: IMinimalTheme = {
    name: "Light Theme",
    shortname: "light-theme",
    backgroundColor: "#f8f9fa",
    backgroundColorDark: "#e9ecef",
    textColor: "#343a40",
    metaColor: "#868e96",
    accentColor: "#228ae6"
};

const purpleTheme: IMinimalTheme = {
    name: "Purple Theme",
    shortname: "purple-theme",
    backgroundColor: "#71397C",
    backgroundColorDark: "#60366F",
    textColor: "#f8f9fa",
    metaColor: "#C582D5",
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
    textColor: "#f8f9fa",
    metaColor: "rgba(255, 255, 255, 0.6)",
    accentColor: "#E84545"
};

export const customTheme: IMinimalTheme = {
    name: "Custom Theme",
    shortname: "custom-theme",
    backgroundColor: "#f8f9fa",
    backgroundColorDark: "#e9ecef",
    textColor: "#343a40",
    metaColor: "#868e96",
    accentColor: "#228ae6"
};

export const themeMap = new Map([
    [darkTheme.shortname, darkTheme],
    [lightTheme.shortname, lightTheme],
    [purpleTheme.shortname, purpleTheme],
    [darkBerryTheme.shortname, darkBerryTheme],
    [mignightRedTheme.shortname, mignightRedTheme]
]);

export const defaultThemeName = "dark-theme";
export const defaultTheme: IMinimalTheme = themeMap.get(defaultThemeName) as IMinimalTheme;

export function getThemeByName(name: string): IMinimalTheme | undefined {
    return themeMap.get(name);
}