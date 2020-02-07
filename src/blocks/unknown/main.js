import Block from "../../core/scripts/Block.js"
import View from "./View.vue"
import Settings from "./Settings.vue"

export default class Unknown extends Block {
	static get viewComponent () {
		return View;
	}

	static get settingsComponent () {
		return Settings;
	}

	static defaultData () {
		return {
			holderBlockName: null,
			innerHTML: "",
			outerHTML: ""
		}
	}

	toHTML () {
		return this.innerHTML
	}

	static serializeFromHTML (blockDom) {
		let holderBlockName, innerHTML, outerHTML;
		holderBlockName = blockDom.dataset.block
		innerHTML = blockDom.innerHTML;
		outerHTML = blockDom.outerHTML;

		return {
			holderBlockName,
			innerHTML,
			outerHTML
		};
	}
}