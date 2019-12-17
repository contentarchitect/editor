import { Blocks } from "@contentarchitect/core"
import Unknown from "../blocks/unknown/main.js"

const convertHtmlToBlocks = function (html) {
	const parser = new DOMParser();
	var doc = parser.parseFromString(html, "text/html");

	let blocks = []

	doc.querySelectorAll("[data-block]").forEach(block => {
		const blockName = block.dataset.block;

		if (Object.prototype.hasOwnProperty.call(Blocks.registeredBlocks, blockName)) {
			const blockConstructor = Blocks.registeredBlocks[blockName]
			const blockInstance = new blockConstructor();

			const blockObject = "serializeFromHTML" in blockConstructor
				? blockConstructor.serializeFromHTML(block)
				: {}

			blocks.push({
				name: blockName,
				id: blockInstance.id,
				classes: [...block.classList],
				...blockObject
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