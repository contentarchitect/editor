import Vue from 'vue';
import Unknown from "@/blocks/unknown/main.js"

const Blocks = new Vue({
	data() {
		return {
			registeredBlocks: [],
			editors: []
		}
	},
	methods: {
		register (blockConstructor) {
			this.registeredBlocks.push(blockConstructor)
			this.editors.forEach(editor => this.findUnknownBlocks(blockConstructor, editor.slotBlocks))
		},
		findUnknownBlocks (blockConstructor, blocks) {
			const newRegisteredBlockName = blockConstructor.name;

			const parser = new DOMParser();

			blocks.forEach((block, index) => {
				if (block instanceof Unknown && block.holderBlockName === newRegisteredBlockName) {
					const blockDom = parser.parseFromString(block.outerHTML, "text/html")
										   .querySelector("[data-block]");
					const newBlock = new blockConstructor(blockDom);
					Vue.set(blocks, index, newBlock)
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