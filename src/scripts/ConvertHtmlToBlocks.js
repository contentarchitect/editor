import { Blocks } from "@contentarchitect/core"
import Unknown from "../blocks/unknown/main.js"

const convertHtmlToBlocks = function (html) {
	const parser = new DOMParser();
	var doc = parser.parseFromString(html, "text/html");

	return Array.from(doc.querySelectorAll("[data-block]")).map(blockDom => {
		const blockName = blockDom.dataset.block;

		let blockConstructor, block;
		if (blockConstructor = Blocks.registeredBlocks.find(blockConstructor => blockConstructor.name === blockName)) {
			block = new blockConstructor(blockDom);
		} else {
			block = new Unknown(blockDom);
		}

		return block;
	})
}

export default convertHtmlToBlocks;