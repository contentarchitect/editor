import { Block } from "@contentarchitect/core"
import view from "./view.vue"

export default class Paragraph extends Block {
	static get viewComponent () {
		return view;
	}

	static defaultData () {
		return {
			content: "<p></p>"
		}
	}

	static defaultSettings = {
		placeholder: "Type your text"
	}

	toHTML () {
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