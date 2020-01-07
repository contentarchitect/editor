import { Block } from "@contentarchitect/core"
import view from "./view.vue"

export default class New extends Block {
	static get viewComponent () {
		return view;
	}
}