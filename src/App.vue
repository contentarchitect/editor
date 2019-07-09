<template>
  <div style="margin: 100px auto; width: 700px;">

    <ui-button @click="changeOrder" square>
        <svg width="16" height="16" viewBox="0 0 16 16" style="display: block; transform: translate(0px, 0px);"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.99 4L11 1 7 5l4 4-.01-3V4zM15 4h-4v2h4V4zm-9.99 6L5 7l4 4-4 4 .01-3v-2zM1 12h4v-2H1v2z" fill="currentColor"></path></svg>
    </ui-button>

    <transition-group name="flip-list">
        <template v-for="(block, i) in blocks">
            <Paragraph
                v-model="blocks[i]"
                :blocks="blocks"
                :ind="i"
                :key="block.id"
                @remove-block="removeBlock"
                @move-block-down="moveBlockDown"
                @move-block-up="moveBlockUp"
                @html-changed="blockHtmlChanged" />
        </template>
    </transition-group>

    <div class="add-new-block">

    </div>

  </div>
</template>

<script>
// import Block from "./components/Block"
import Paragraph from "@/components/Paragraph"
import Button from "@/components/Button"
import convertHtmlToBlocks from "@/scripts/ConvertHtmlToBlocks"

export default {
    name: 'ContentArchitect',
    props: {
        renderedHtml: String
    },
    data() {
        return {
            blocks: null
        }
    },
    created () {
        this.blocks = convertHtmlToBlocks(this.renderedHtml);
    },
    methods: {
        changeOrder () {
            this.blocks.splice(1, 0, this.blocks.splice(0, 1)[0]);
            this.reRender();
        },
        moveBlockDown (block) {
            const indexOfBlock = this.blocks.indexOf(block);
            this.blocks.splice(indexOfBlock + 1, 0, this.blocks.splice(indexOfBlock, 1)[0]);
            this.reRender();
        },
        moveBlockUp (block) {
            const indexOfBlock = this.blocks.indexOf(block);
            this.blocks.splice(indexOfBlock - 1, 0, this.blocks.splice(indexOfBlock, 1)[0]);
            this.reRender();
        },
        removeBlock (block) {
            const index = this.blocks.indexOf(block);

            if (index !== -1) {
            this.blocks.splice(index, 1)
            }
            this.reRender();
        },
        blockHtmlChanged () {
            this.reRender();
        },
        reRender () {
            const html = this.blocks.map((block) => block.renderedHtml).join('\n')
            // console.log(html);
            this.$emit("htmlrender", html)
            return html;
        }
    },
    components: {
        Paragraph,
        UiButton: Button
    }
}
</script>

<style>
@import "~normalize.css/normalize.css";
</style>


<style scoped>
.flip-list-move {
    transition: transform .2s;
}
</style>