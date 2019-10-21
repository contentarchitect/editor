import { Block } from "@contentarchitect/editor"
import view from "./view.vue"
import settings from "./settings.vue"

export default class Table extends Block {
    static get viewComponent () {
        return view;
    }

    static get settingsComponent () {
        return settings;
    }

    get block () {
        return {
            height: 50
        }
    }
}