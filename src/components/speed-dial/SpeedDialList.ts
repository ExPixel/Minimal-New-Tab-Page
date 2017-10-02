import m = require("mithril");
import SpeedDial from "../../ts/speed-dial";
import SpeedDialListItem from "./SpeedDialListItem";

export default class SpeedDialList implements m.Component<any, any> {
    public view() {
        const itemNodes = SpeedDial.getItems().map((item) => {
            return m(SpeedDialListItem, { itemTitle: item.title, itemUrl: item.url });
        });
        return m("ul.speed-dial-list", itemNodes);
    }
}