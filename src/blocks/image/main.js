import { Block } from "@contentarchitect/core"
import view from "./view.vue"
import settings from "./settings.vue"

export default class Image extends Block {
	static get viewComponent () {
		return view;
	}

	static get settingsComponent () {
		return settings;
	}

	static defaultData = {
		images: [
			{ image: null, caption: null }
		]
	}

	static defaultSettings = {}

	toString () {
		let str = '';

		this.images.forEach(image => {
			str += `<figure><img src="${image.image}" />`
			if (image.caption && image.caption !== '') {
				str += `<figcaption>${image.caption}</figcaption>`
			}
			str += `</figure>`
		})

		return `<div>${str}</div>`;
	}

	static serializeFromHTML (doc) {
		let obj = { images: [] }

		Array.from(doc.getElementsByTagName("figure")).forEach(fig => {
			const img = fig.getElementByTagName("img");
			const src = img.getAttribute("src");
			const cpt = fig.getElementByTagName("figcaption").innerHTML;
			obj.images.push({ image: src, caption: cpt });
		})
		
		return obj
	}
}