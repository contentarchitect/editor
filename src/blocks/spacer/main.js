import { Block } from "@contentarchitect/editor"
import view from "./view.vue"
import settings from "./settings.vue"

export default class Spacer extends Block {
	static get viewComponent () {
		return view;
	}

	static get settingsComponent () {
		return settings;
	}

	get data () {
		return {
			height: this.constructor.settings.defaultHeight
		}
	}

	static get defaultSettings () {
		return {
			defaultHeight: 30,
			minHeight: 5,
			maxHeight: Infinity
		}
	}

	static renderHTML (value, settings) {
		return `<div style="height: ${value.height}px"></div>`;
	}
	
	static serializeFromHTML (html) {
		let obj = { height: 0 },
			cssString = html.getElementsByTagName("div")[0].getAttribute("style"),
			height;
		

		function css2obj (css) {
			const r = /(?<=^|;)\s*([^:]+)\s*:\s*([^;]+)\s*/g,
				  o = {}

			css.replace(r, (m,p,v) => o[p] = v)
			return o;
		}

		height = css2obj(cssString)["height"]
		height = Number(/\d+/.exec(height)[0])

		obj.height = height

		return obj
	}
}