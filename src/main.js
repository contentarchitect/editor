import Vue from 'vue'
import { Editor, Block, Blocks } from "@contentarchitect/editor"
import "@/blocks/index.js"

Vue.config.productionTip = false

if (process.env.NODE_ENV === "development") {
    window.ContentArchitect = {
        Editor,
        Blocks,
        Block
    }
}

window.blocksMain = Blocks;

export {
    Editor,
    Blocks,
    Block
}