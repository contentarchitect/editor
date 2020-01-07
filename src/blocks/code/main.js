import { Block } from "@contentarchitect/core"
import view from "./view.vue"
import settings from "./settings.vue"

export default class Code extends Block {
	static get viewComponent () {
		return view;
	}

	static get settingsComponent () {
		return settings;
	}

	static defaultSettings = {
		defaultLanguage: "txt",
	}

	static defaultData = {
		language: '',
		code: '',
		highlighted: ''
	}

	toHTML () {
		return this.highlighted
	}

	static serializeFromHTML (html) {
		const languageClass = Array.from(html.querySelector("pre").classList).find(str => str.startsWith("language-"));

		// const language = /language-(.+)$/.exec(languageClass)[1]
		const language = html.dataset.language;

		let code = Array.from(html.querySelectorAll("pre")).map(line => {
			return line.innerText
		}).join("\n")

		return {
			language,
			code,
			highlighted: ''
		}
	}

	get dataset () {
		return {
			language: this.language
		}
	}
}