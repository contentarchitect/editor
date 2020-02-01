import { Block } from "@contentarchitect/core"
import view from "./view.vue"
import settings from "./settings.vue"
import icon from "./icon.svg"

export default class Table extends Block {
    static get viewComponent () {
        return view;
    }

    static get settingsComponent () {
        return settings;
    }

    static get icon () {
        return icon;
    }

    get block () {
        return {
            height: 50
        }
    }
}