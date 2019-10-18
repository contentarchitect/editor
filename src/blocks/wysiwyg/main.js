import Block from "@/scripts/Block.js"
import view from "./view.vue"

export default class Wysiwyg extends Block {
    static get viewComponent () {
        return view;
    }

    get data () {
        return {
            content: "<p>Merhaba</p>"
        }
    }

    static renderHTML (data) {
        return data.content
    }

    static serializeFromHTML (blockDom) {
        let obj = { content: "" }

        obj.content = blockDom.innerHTML;
		return obj;
	}
}