import MStorage from "./storage";
const SPEEDDIAL_LS_KEY = "speed-dial";

export interface ISpeedDialItem {
    title: string;
    url: string;
}

export interface IKeyedSpeedDialItem extends ISpeedDialItem {
    key: string;
}

export class SpeedDial {
    private static keyIdNum: number = 0;
    private items: Readonly<IKeyedSpeedDialItem>[] = [];

    /**
     * Moves the item at the given index {from} to the index {to}.
     * @param from Source index.
     * @param to Destination index.
     */
    public moveItem(from: number, to: number) {
        const item = this.items[from];
        this.items.splice(from, 1);
        // if (to > from) { SpeedDial.items.splice(to - 1, 0, item); }
        // else { SpeedDial.items.splice(to, 0, item); }
        this.items.splice(to, 0, item);
    }

    public getIndexForKey(key: string): number {
        return this.items.findIndex((item) => item.key === key);
    }

    public generateKey(): string {
        // These are not saved between sessions so this is fine.
        return `sdk_${SpeedDial.keyIdNum++}`;
    }

    public addItem(item: ISpeedDialItem) {
        this.items.push(Object.freeze({
            title: item.title,
            url: item.url,
            key: this.generateKey()
        }));
    }

    public replaceItemAt(index: number, item: ISpeedDialItem) {
        let key: string;
        const oldItem = this.items[index];
        if (oldItem) {
            key = oldItem.key;
        } else {
            key = this.generateKey();
        }
        this.items.splice(index, 1, Object.freeze({
            title: item.title,
            url: item.url,
            key
        }));
    }

    public removeItem(item: ISpeedDialItem) {
        const index = this.items.findIndex((cur) => (cur.title === item.title && cur.url === item.url));
        if (index >= 0) {
            this.items.splice(index, 1);
            return true;
        } else {
            return false;
        }
    }

    public removeItemAt(index: number): ISpeedDialItem | null {
        const items = this.items.splice(index, 1);
        if (items) return items[0];
        else return null;
    }

    public save() {
        MStorage.set(SPEEDDIAL_LS_KEY, this.items.map(
            (item) => ({
                title: item.title,
                url: item.url
            })
        ));
    }

    public load() {
        this.items = [];
        const storedSpeedDialItems = MStorage.get<any>(SPEEDDIAL_LS_KEY);
        if (storedSpeedDialItems && Array.isArray(storedSpeedDialItems)) {
            storedSpeedDialItems.map((item) => { this.addItem(item); });
        }
    }

    public getItems() { return this.items; }
}

export default new SpeedDial;