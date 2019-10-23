import Blocks from "@/scripts/Blocks.js"

const convertHtmlToBlocks = function (html) {
	const parser = new DOMParser();
	var doc = parser.parseFromString(html, "text/html");

	let blocks = []

	doc.querySelectorAll(".block").forEach(block => {
		const blockName = block.dataset.blockName;

		if (Object.prototype.hasOwnProperty.call(Blocks.registeredBlocks, blockName)) {
			const blockInstance = new Blocks.registeredBlocks[blockName]();
			
			blocks.push({
				name: blockName,
				id: blockInstance.id,
				...Blocks.registeredBlocks[blockName].serializeFromHTML(block)
			})
		} else {
			const blockInstance = new Blocks.registeredBlocks["Unknown"]();

			blocks.push({
				name: "Unknown",
				id: blockInstance.id,
				...Blocks.registeredBlocks["Unknown"].serializeFromHTML(block)
			})
		}

		// STRUCTURE
		// {
		//     id: Number,
		//     name: String,
		//     ...Others
		// }
	})

	return blocks;
}

export default convertHtmlToBlocks;