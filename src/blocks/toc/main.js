import { Block } from "@contentarchitect/core"
import view from "./view.vue"
import { serialize, treeToHTML } from "./serialize"

export default class Toc extends Block {
	static get viewComponent () {
		return view;
	}

	static defaultData = {
		tree: null
	}

	toString (blocks) {
		const headers = blocks.filter(block => block.constructor.name == "Header")
		return treeToHTML(serialize(headers).children)
	}

	static serializeFromHTML (doc) {
		return {}
	}
}