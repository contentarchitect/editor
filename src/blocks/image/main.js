import { Block, Util } from "@contentarchitect/core"
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
			{ image: null, caption: null, uploading: false, uploaded: false, data: {} }
		]
	}

	static defaultSettings = {
		uploadImages: false,
		upload: this.upload,
		remove: this.remove
	}

	static upload (image, block) {
		return undefined
	}

	static remove (image, block) {
		return undefined
	}

	toHTML () {
		let str = '';

		this.images.forEach(image => {
			let data = []
			Object.keys(image.data).forEach(key => {
				data.push(`data-${Util.toKebabCase(key)}="${image.data[key]}"`)
			})

			data = data.join(" ")

			str += `<figure><img src="${image.image}" ${data} />`
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
			obj.images.push({ image: src, caption: cpt, data: { ...img.dataset } });
		})
		
		return obj
	}
}