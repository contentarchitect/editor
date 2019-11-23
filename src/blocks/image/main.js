import { Block } from "@contentarchitect/editor"
import view from "./view.vue"
import settings from "./settings.vue"

export default class Image extends Block {
	static get viewComponent () {
		return view;
	}

	static get settingsComponent () {
		return settings;
	}

	get data () {
		let images = Array(this.constructor.settings.defaultImageCount).fill().map(() => {
			return { image: null, caption: null }
		});

		return {
			images
		}
	}

	static get defaultSettings () {
		return {
			defaultImageCount: 1
		}
	}

	static renderHTML (value, settings) {
		let str = '';

		value.images.forEach(image => {
			str += `<figure><img src="${image.image}" />`
			if (image.caption && image.caption !== '') {
				str += `<figcaption>${image.caption}</figcaption>`
			}
			str += `</figure>`
		})

		return `<div>${str}</div>`;
	}

	static serializeFromHTML (html) {
		let obj = { images: [] }

		Array.from(html.getElementsByTagName("figure")).forEach(fig => {
			const img = fig.getElementByTagName("img");
			const src = img.getAttribute("src");
			const cpt = fig.getElementByTagName("figcaption").innerHTML;
			obj.images.push({ image: src, caption: cpt });
		})
		
		return obj
	}
}