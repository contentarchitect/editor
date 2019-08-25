import Block from "@/components/Block.js"
import view from "./view.vue"
import settings from "./settings.vue"

export default class Image extends Block {
    static get viewComponent () {
        return view;
    }

    static get settingsComponent () {
        return settings;
    }

    get block () {
        return {
            content: "Merhaba"
        }
    }
}