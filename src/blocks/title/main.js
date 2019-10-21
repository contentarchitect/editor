import { Block } from "@contentarchitect/editor"
import view from "./view.vue"
import settings from "./settings.vue"

export default class Title extends Block {
    static get viewComponent () {
        return view;
    }

    static get settingsComponent () {
        return settings;
    }

    get data () {
        return {
            content: "Merhaba",
            level: 4
        }
    }

    static renderHTML (value, settings) {
        return `<h${value.level}>${value.content}</h${value.level}>`
    }
    
    static serializeFromHTML (html) {
		let obj = { content: "", level: null }

        const headerName = html.firstElementChild.tagName
        obj.content = headerName.innerHTML;
        
        const level = Number(/\d/.exec(headerName)[0])
        obj.level = level;
        
		return obj
	}
}