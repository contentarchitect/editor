import { Block } from "@contentarchitect/core"
import view from "./view.vue"
import icon from "./icon.svg"

export default class Paragraph extends Block {
	static get viewComponent () {
		return view;
	}

	static get icon () {
		return icon;
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