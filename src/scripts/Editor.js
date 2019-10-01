import Vue from "vue";
import App from '../App.vue'
import Blocks from '@/scripts/Blocks.js'

export default class Editor {
	constructor (idOrSettings) {
		let settings;
		if (typeof(idOrSettings) === "string") {
			settings = { mount: idOrSettings }
		} else {
			settings = idOrSettings
		}

		if (settings.blockSettings) {
			for (let blockName in settings.blockSettings) {
				if (settings.blockSettings.hasOwnProperty(blockName)) {
					Blocks.blocks[blockName].settings = settings.blockSettings[blockName]
				}
			}
		}

		
		window.contentarchitect = new Vue({
			render: h => h(App),
		})

		window.contentarchitect.$mount(settings.mount);
	}
}