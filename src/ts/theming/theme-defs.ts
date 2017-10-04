export interface IMinimalTheme {
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
    backgroundColor: "#343a40",
    backgroundColorDark: "#212529",
    textColor: "#f8f9fa",
    metaColor: "#ced4da",
    accentColor: "#228ae6"
};

const lightTheme: IMinimalTheme = {
    backgroundColor: "#f8f9fa",
    backgroundColorDark: "#e9ecef",
    textColor: "#343a40",
    metaColor: "#868e96",
    accentColor: "#228ae6"
};

const purpleTheme: IMinimalTheme = {
    backgroundColor: "#71397C",
    backgroundColorDark: "#60366F",
    textColor: "#f8f9fa",
    metaColor: "#C582D5",
    accentColor: "#FFDF5A"
};

const darkBerryTheme: IMinimalTheme = {
    backgroundColor: "#900C3F",
    backgroundColorDark: "#581845",
    textColor: "#f8f9fa",
    metaColor: "rgba(255, 255, 255, 0.6)",
    accentColor: "#FF5733"
};

export const customTheme: IMinimalTheme = {
    backgroundColor: "#f8f9fa",
    backgroundColorDark: "#e9ecef",
    textColor: "#343a40",
    metaColor: "#868e96",
    accentColor: "#228ae6"
};

export const themeMap = new Map([
    ["dark-theme", darkTheme],
    ["light-theme", lightTheme],
    ["purple-theme", purpleTheme],
    ["dark-berry-theme", darkBerryTheme]
]);

export const defaultThemeName = "dark-theme";
export const defaultTheme: IMinimalTheme = themeMap.get(defaultThemeName) as IMinimalTheme;

export function getThemeByName(name: string): IMinimalTheme | undefined {
    return themeMap.get(name);
}