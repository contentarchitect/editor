import { Block } from "@contentarchitect/core"
import view from "./view.vue"

export default class Wysiwyg extends Block {
	static get viewComponent () {
		return view;
	}

	static defaultData = {
		content: "<p></p>"
	}

	static defaultSettings = {
		placeholder: "Type your text"
	}

	toString () {
		return this.content
	}

	static serializeFromHTML (blockDom) {
		let content;
		content = blockDom.innerHTML.trim();

		return {
			content
		};
	}
}