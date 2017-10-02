export class _MStorage {
    constructor(private prefix: string) {}

    public set(key: string, value: any) {
        const json = JSON.stringify(value);
        localStorage.setItem(`${this.prefix}:${key}`, json);
    }

    public get<T>(key: string): T | undefined {
        const json = localStorage.getItem(`${this.prefix}:${key}`);
        if (json) {
            try {
                return JSON.parse(json);
            } catch(e) {
                console.error(`Error while parsing JSON for item "${this.prefix}:${key}"`, e);
                localStorage.removeItem(`${this.prefix}:${key}`);
            }
        }
        return undefined;
    }

    public getRaw(key: string): string | undefined {
        const json = localStorage.getItem(`${this.prefix}:${key}`);
        if (json) return json;
        else return undefined;
    }

    public remove(key: string) {
        localStorage.removeItem(`${this.prefix}:${key}`);
    }
}

export default new _MStorage("minimal");