import Blocks from "@/scripts/Blocks.js"

const convertHtmlToBlocks = function (html) {

    const parser = new DOMParser();
    var doc = parser.parseFromString(html, "text/html");

    let blocks = []

    doc.querySelectorAll(".block").forEach(block => {
        const blockName = block.dataset.blockName;

        const blockInstance = new Blocks.blocks[blockName]();

        blocks.push({
            name: blockName,
            id: blockInstance.id,
            ...Blocks.blocks[blockName].serializeFromHTML(block)
        })

        // YAPI
        // {
        //     id: Number,
        //     name: String,
        //     ...Others
        // }
    })

    return blocks;
}

export default convertHtmlToBlocks;