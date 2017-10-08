import m = require("mithril");
import Options from "../ts/options";
import { icon, Icons } from "./icons/icons";

function _link(url: string, text?: string) {
    let utext = text || url;
    return m("a.mmt-accent-link", { href: url, target:"_blank" }, [utext, m("sup", icon(Icons.ExternalLink))]);
}

function _code(code: string) {
    return m("span.code.mmt-dark-bg", code);
}

function closeHelp(event: Event): boolean {
    Options.displayHelp = false;
    Options.save();
    event.preventDefault();
    return false;
}

export default class Help implements m.Component<any, any> {
    public view() {
        return m(".help-container", [
            m("h1", "Welcome"),

            m("p.indent", [m.trust(`

                Thank your for installing <strong>Minimal New Tab Page</strong>.
                Below you will find some documentation to help you get started.
                You can get rid of this text and start using the new tab page
                by opening the options menu using the button (`),
                icon(Icons.Settings),
                m.trust(`) at the bottom left of the page. From there you can uncheck
                <strong>Show Help Text</strong> which should be the first option.`)
            ]),
            
            m("h2", "Weather (Dark Sky)"),

            m("p.aside.indent",[
                m.trust(`At the moment Dark Sky is the only weather API that is supported by
                <strong>Minimal New Tab Page</strong>. I'm currently looking into supporting more.`)
            ]),

            m("p.indent", [
                m.trust(`To use Dark Sky, you're going to need to get yourself an API key.
                You will have to make an account by navigating to `),
                _link("https://darksky.net/dev"),
                m.trust(` and signing up. Next you must navigate to the console (`),
                _link("https://darksky.net/dev/account"),
                m.trust(`) and from there you can retrieve your API secret key which you can place into the weather options.`)
            ]),

            m("p.indent", [
                m.trust(`You're also going to need to get the latitude and longitude for the address or city you want
                the weather to be displayed for. You can get this information from this service: `),
                _link("https://www.latlong.net/convert-address-to-lat-long.html"),
                m.trust(".")
            ]),

            m("h2", "Fav Icon Not Working?"),
            m("p.indent", [
                `Unfortunately this is just an issue that comes with using `,
                _code("chrome://favicon"),
                `. The URLs required to get the correct favicon can be very specific. I would try adding `,
                _code("https://"),
                `, `,
                _code("http://"),
                `, or some other protocol if you haven't already. You should also try adding `,
                _code("www."),
                ` to the beginning of a URL if it will still continue working after you do so. This fixes the favicon in the case of `,
                _code("google.com"),
                `. `,
                _code("https://google.com"),
                ` probably won't work but `,
                _code("https://www.google.com"),
                ` will.`
            ]),

            m("p", [
                m("a.mmt-accent-link", {href: "#", onclick: closeHelp}, "Hide Help Text")
            ])
        ]);
    }
}