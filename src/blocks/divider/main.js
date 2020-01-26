import { Block } from "@contentarchitect/core"
import View from "./view.vue"

export default class Divider extends Block {
	static get viewComponent () {
		return View;
	}

	toHTML () {
		return `<div class="divider"></div>`
	}
}