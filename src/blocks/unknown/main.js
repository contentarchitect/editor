import Block from "../../core/scripts/Block.js"
import View from "./View.vue"

export default class Unknown extends Block {
    static get viewComponent () {
        return View;
    }

    get data () {
        return {
			holderBlockName: null,
			innerHTML: "",
			outerHTML: ""
        }
    }

    static renderHTML (data) {
        return data.innerHTML
    }

    static serializeFromHTML (blockDom) {
        let obj = { content: "" }
		obj.holderBlockName = blockDom.dataset.block
		obj.innerHTML = blockDom.innerHTML;
		obj.outerHTML = blockDom.outerHTML;
		return obj;
	}
}