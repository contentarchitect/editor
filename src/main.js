import Vue from 'vue'
import { Block, Blocks } from "@contentarchitect/editor"
import "@/blocks/index.js"

Vue.config.productionTip = false

if (process.env.NODE_ENV === "development") {
    window.ContentArchitect = {
        Blocks,
        Block
    }
}

window.blocksMain = Blocks;

export {
    Blocks,
    Block
}