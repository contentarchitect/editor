import { Block } from "@contentarchitect/editor"
import view from "./view.vue"
import settings from "./settings.vue"

export default class Code extends Block {
	static get viewComponent () {
		return view;
	}

	static get settingsComponent () {
		return settings;
	}

	get data () {
		return {
			language: '',
			code: '',
			highlighted: ''
		}
	}

	static get defaultSettings () {
		return {
			defaultLanguage: "txt",
		}
	}

	static renderHTML (value, settings) {
		return value.highlighted
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

	static dataset (block) {
		const { language } = block

		return {
			language
		}
	}
}