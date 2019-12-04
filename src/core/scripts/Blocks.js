import Vue from 'vue';
import Unknown from "@/blocks/unknown/main.js"

const Blocks = new Vue({
	data() {
		return {
			registeredBlocks: {
			},
			editors: []
		}
	},
	methods: {
		register (blockConstructor) {
			this.$set(this.registeredBlocks, blockConstructor.name, blockConstructor)
			this.editors.forEach(editor => this.findUnknownBlocks(blockConstructor, editor.slotBlocks))
		},
		findUnknownBlocks (blockConstructor) {
			const newRegisteredBlockName = blockConstructor.name;
	
			const parser = new DOMParser();

			this.slotBlocks.filter(block => block.name === "Unknown" && block.holderBlockName === newRegisteredBlockName).forEach(block => {
				var doc = parser.parseFromString(block.outerHTML, "text/html").querySelector("[data-block]");

				const blockObject = this.registeredBlocks[newRegisteredBlockName].serializeFromHTML(doc)

				// for reactivity look at: https://vuejs.org/v2/guide/reactivity.html
				// Delete unknown properties from object
				const unknownProperties = Object.keys(new Unknown().data)
				unknownProperties.forEach(prop => {
					Vue.delete(block, prop)
				})

				// for reactivity look at: https://vuejs.org/v2/guide/reactivity.html
				// Set new block properties
				Vue.set(block, "name", newRegisteredBlockName)
				for (var prop in blockObject) {
					if (blockObject.hasOwnProperty(prop)) {
						Vue.set(block, prop, blockObject[prop])
					}
				}
			})
		}
	}
});

// const requireComponent = require.context('@/blocks', true, /main\.js$/)

// requireComponent.keys().forEach(fileName => {
//   const componentConfig = requireComponent(fileName)
//   Blocks.blocks.push(componentConfig.default)
// })

export default Blocks;