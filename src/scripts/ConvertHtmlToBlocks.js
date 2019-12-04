import { Blocks } from "@contentarchitect/core"
import Unknown from "../blocks/unknown/main.js"

const convertHtmlToBlocks = function (html) {
	const parser = new DOMParser();
	var doc = parser.parseFromString(html, "text/html");

	let blocks = []

	doc.querySelectorAll("[data-block]").forEach(block => {
		const blockName = block.dataset.block;

		if (Object.prototype.hasOwnProperty.call(Blocks.registeredBlocks, blockName)) {
			const blockInstance = new Blocks.registeredBlocks[blockName]();
			
			blocks.push({
				name: blockName,
				id: blockInstance.id,
				classes: [...block.classList],
				...Blocks.registeredBlocks[blockName].serializeFromHTML(block)
			})
		} else {
			const blockInstance = new Unknown();

			blocks.push({
				name: "Unknown",
				id: blockInstance.id,
				classes: [...block.classList],
				...Unknown.serializeFromHTML(block)
			})
		}

		// STRUCTURE
		// {
		//     id: Number,
		//     name: String,
		//     classes: Array,
		//     ...Others
		// }
	})

	return blocks;
}

export default convertHtmlToBlocks;