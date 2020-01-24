import { Block } from "@contentarchitect/core"
import view from "./view.vue"
import settings from "./settings.vue"

export default class Divider extends Block {
	static get viewComponent () {
		return view;
	}

	static get settingsComponent () {
		return settings;
	}

	static defaultData () {
		return {
			dividerType: 'star'
		}
	}

	static defaultSettings = {
		types: ['star', 'border']
	}


	toHTML () {
		switch(this.dividerType) {
			case "star":
				return `<div class="divider divider-${this.dividerType}"></div>`
			case "border":
				return `<div class="divider divider-${this.dividerType}"><div></div></div>`
		}
	}

	static serializeFromHTML (html) {
		const classes = html.querySelector(".divider").classList;

		let dividerType;
		if (classes.contains("divider-" + "star")) {
			dividerType = "star"
		} else if (classes.contains("divider-" + "border")) {
			dividerType = "border"
		} else {
			dividerType = "star"
		}

		return {
			dividerType
		}
	}
}