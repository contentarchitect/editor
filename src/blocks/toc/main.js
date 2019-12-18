import { Block } from "@contentarchitect/core"
import view from "./view.vue"
import { serialize, treeToHTML } from "./serialize"

export default class Toc extends Block {
	static get viewComponent () {
		return view;
	}

	static renderHTML (value, settings, blocks) {
		const headers = blocks.filter(block => block.name == "Header")
		return treeToHTML(serialize(headers).children)
	}
}