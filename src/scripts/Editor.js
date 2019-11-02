// import Vue from "vue";
// import App from '../App.vue'
import Blocks from '@/scripts/Blocks.js'
// import Settings from "@/scripts/Settings.js"
import Util from "@/scripts/Util.js"

export default class Editor {
	constructor (settings) {
		if (settings.blockSettings) {
			for (let blockName in settings.blockSettings) {
				if (settings.blockSettings.hasOwnProperty(blockName)) {
					Blocks.registeredBlocks[blockName].settings = settings.blockSettings[blockName]
				}
			}
		}

		
		if (settings.cssClasses) {
			let cssClasses;

			if (Util.isObject(settings.cssClasses)) {
				cssClasses = settings.cssClasses
			} else if (Array.isArray(settings.cssClasses)) {
				cssClasses = {
					classes: settings.cssClasses
				}
			} else {
				console.warn("cssClasses must be an array or object")
			}

		}
	}
}

// new Editor({
// 	cssClasses: {
// 		asd: "asd",
// 		"bfg": "bfg",
// 		"group1": {
// 			masa: "Masa",
// 			sandalye: "Sandalye"
// 		},
// 	},
// 	blockSettings: {
// 		Header: {
// 			levels: [1,2],
// 			defaultLevel: 3
// 		},
// 		Spacer: {
// 		    defaultHeight: 50,
// 		    minHeight: 30,
// 		    maxHeight: 100
// 		}
// 	}
// });

// var css = {
// 	alert: {
// 		"alert-primary": "Primary",
// 		"alert-secondary": "Secondary",
// 		"alert-success": "Success",
// 		"alert-danger": "Danger",
// 		"alert-warning": "Warning",
// 		"alert-info": "Info",
// 	},
// 	"*alert": {

// 	}
// }