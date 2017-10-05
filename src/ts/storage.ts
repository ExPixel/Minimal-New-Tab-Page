export interface _MStorageTTL {
    storedTime: number;
    expiresIn: number;
}

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

    public ttlSet(key: string, ttl: number, value: any) {
        const ttlObj: _MStorageTTL = { storedTime: Date.now(), expiresIn: ttl };
        this.set(key, value);
        this.set(key + "::~ttl", ttlObj);
    }

    public ttlGet<T>(key: string): T | undefined {
        const ttlObj = this.get<_MStorageTTL>(key + "::~ttl");
        if (ttlObj) {
            const now = Date.now();
            if (now > (ttlObj.storedTime + ttlObj.expiresIn)) {
                this.ttlRemove(key);
                return undefined;
            }
        }
        return this.get<T>(key);
    }

    public ttlGetWithTTL<T>(key: string): [T | undefined, _MStorageTTL | undefined] {
        const ttlObj = this.get<_MStorageTTL>(key + "::~ttl");
        if (ttlObj) {
            const now = Date.now();
            if (now > (ttlObj.storedTime + ttlObj.expiresIn)) {
                this.ttlRemove(key);
                return [undefined, ttlObj];
            }
        }
        return [this.get<T>(key), ttlObj];
    }

    public ttlRemove<T>(key: string) {
        this.remove(key + "::~ttl");
        this.remove(key);
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