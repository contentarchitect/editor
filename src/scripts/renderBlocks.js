import Util from "./Util.js"

export default function renderBlocks (blocks) {
	let htmlStr = "";

	blocks.forEach(block => {
		if (!("toHTML" in block)) return;

		let blockConstructor = block.constructor
		let classes = block.classes.join(" ")
		let classStr = classes ? `class="${classes}"` : ''

		const dataset = block.dataset

		let datasetStr = Object.entries(dataset).reduce((acu, [key, value]) => {
			return acu + ` data-${Util.toKebabCase(key)}="${value}"`
		}, "")

		htmlStr += `<div data-block="${blockConstructor.name}" ${classStr} ${datasetStr}>`
		htmlStr += block.toHTML(blocks)
		htmlStr += `</div>`
	});

	return htmlStr;
}