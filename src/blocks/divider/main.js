import { Block } from "@contentarchitect/editor"
import view from "./view.vue"
import settings from "./settings.vue"

export default class Divider extends Block {
	static get viewComponent () {
		return view;
	}

	static get settingsComponent () {
		return settings;
	}

	get data () {
		return {
			dividerType: this.constructor.settings.defaultType
		}
	}

	static get defaultSettings () {
		return {
			types: ['star', 'border'],
			defaultType: 'star'
		}
	}

	static renderHTML (value, settings) {
		switch(value.dividerType) {
			case "star":
				return `<div class="divider divider-${value.dividerType}"></div>`
			case "border":
				return `<div class="divider divider-${value.dividerType}"><div></div></div>`
		}
	}

	static serializeFromHTML (html) {
		const classes = html.querySelector(".divider").classList;

		let obj = { }

		if (classes.contains("divider-" + "star")) {
			obj.dividerType = "star"
		} else if (classes.contains("divider-" + "border")) {
			obj.dividerType = "border"
		} else {
			obj.dividerType = "star"
		}

		return obj
	}
}