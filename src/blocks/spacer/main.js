import { Block } from "@contentarchitect/core"
import view from "./view.vue"
import settings from "./settings.vue"

export default class Spacer extends Block {
	static get viewComponent () {
		return view;
	}

	static get settingsComponent () {
		return settings;
	}

	static defaultData = {
		height: 30
	}

	static defaultSettings = {
		minHeight: 5,
		maxHeight: Infinity
	}

	toHTML () {
		return `<div style="height: ${this.height}px"></div>`;
	}
	
	static serializeFromHTML (html) {
		let height = 0,
			cssString = html.getElementsByTagName("div")[0].getAttribute("style");
		

		function css2obj (css) {
			const r = /(?<=^|;)\s*([^:]+)\s*:\s*([^;]+)\s*/g,
				  o = {}

			css.replace(r, (m,p,v) => o[p] = v)
			return o;
		}

		height = css2obj(cssString)["height"]
		height = Number(/\d+/.exec(height)[0])

		return {
			height
		}
	}
}