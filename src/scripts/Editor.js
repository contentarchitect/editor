// import Vue from "vue";
// import App from '../App.vue'
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
	}
}

// new Editor({
//     blockSettings: {
//         Header: {
//             levels: [1,2],
//             defaultLevel: 3
//         },
//         // Spacer: {
//         //     defaultHeight: 50,
//         //     minHeight: 30,
//         //     maxHeight: 100
//         // }
//     }
// });