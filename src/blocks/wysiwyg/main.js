import { Block } from "@contentarchitect/core"
import view from "./view.vue"

export default class Wysiwyg extends Block {
    static get viewComponent () {
        return view;
    }

    get data () {
        return {
            content: "<p>&nbsp;</p>"
        }
    }

    static renderHTML (data) {
        return data.content
    }

    static get defaultSettings () {
		return {
			placeholder: "Type your text"
		}
	}

    static serializeFromHTML (blockDom) {
        let obj = { content: "" }

        obj.content = blockDom.innerHTML.trim();
		return obj;
	}
}