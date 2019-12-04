import { Block } from "@contentarchitect/core"
import view from "./view.vue"

export default class Quote extends Block {
    static get viewComponent () {
        return view;
    }

    get data () {
        return {
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            cite: "Anonym"
        }
    }

    static renderHTML (value, settings) {
        let str = ""

        str += value.content

        if (value.cite && value.cite !== '') {
            str += `<cite>${value.cite}</cite>`
        }

		return `<blockquote>${str}</blockquote>`;
    }
    
    static serializeFromHTML (html) {
        let obj = { content: "", cite: "" }

        const blockquote = html.getElementsByTagName("blockquote")[0]
        const cite = blockquote ? blockquote.getElementsByTagName("cite")[0] : undefined

        if (cite) {
            blockquote.removeChild(cite);
            obj.cite = cite.innerHTML;
        }

        if (blockquote) {
            obj.content = blockquote.innerHTML;
        }

		return obj;
	}
}