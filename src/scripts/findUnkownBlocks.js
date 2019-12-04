import Vue from "vue"
import { Blocks } from "@contentarchitect/core"
import Unknown from "../blocks/unknown/main.js"

export default function findUnknownBlocks (blockConstructor, slotBlocks) {
	const newRegisteredBlockName = blockConstructor.name;

	const parser = new DOMParser();

	slotBlocks.filter(block => block.name === "Unknown" && block.holderBlockName === newRegisteredBlockName).forEach(block => {
		var doc = parser.parseFromString(block.outerHTML, "text/html").querySelector("[data-block]");

		const blockObject = Blocks.registeredBlocks[newRegisteredBlockName].serializeFromHTML(doc)

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