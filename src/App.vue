<template>
  <div style="margin: 0 auto; width: 100%;">

    <ui-button @click="changeOrder" square>
        <svg width="16" height="16" viewBox="0 0 16 16" style="display: block; transform: translate(0px, 0px);"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.99 4L11 1 7 5l4 4-.01-3V4zM15 4h-4v2h4V4zm-9.99 6L5 7l4 4-4 4 .01-3v-2zM1 12h4v-2H1v2z" fill="currentColor"></path></svg>
    </ui-button>

    <blocks v-model='blocks' />

    <div style="margin-top: 20px;"></div>

    <v-popover
        popoverClass="new-block-panel"
        offset="8"
        :open="isNewBlockPopoverActive"
        placement="bottom"
        @show="isNewBlockPopoverActive = true"
        @hide="isNewBlockPopoverActive = false">

        <ui-button :active="isNewBlockPopoverActive" v-tooltip="'Add new block'" square>+</ui-button>

        <template  slot="popover">
            <ul class="block-list">
                <li v-for="(_, blockName) in registeredBlocks" :key="blockName" @click="addBlock(blockName)">
                    {{blockName}}
                </li>
            </ul>
        </template>
    </v-popover>

  </div>
</template>

<script>
import Blocks from "@/scripts/Blocks"
import { Button } from "@contentarchitect/base"
import convertHtmlToBlocks from "@/scripts/ConvertHtmlToBlocks"
import Util from "@/scripts/Util"
import { VPopover, VTooltip } from 'v-tooltip'
import Vue from "vue"
import blocks from "@/components/Blocks.vue"

export default {
    name: 'ContentArchitect',
    props: {
        renderedHtml: String
    },
    data() {
        return {
            registeredBlocks: Blocks.blocks,
            blocks: null,
            isNewBlockPopoverActive: false,
        }
    },
    created () {
        this.blocks = convertHtmlToBlocks(this.renderedHtml);
    },
    methods: {
        addBlock (name) {
            this.isNewBlockPopoverActive = false
            const block = Blocks.blocks[name];
            debugger;
            this.blocks.push({
                id: Util.generateID(),
                name: name,
                ...new block().blockData
            })
        },
        changeOrder () {
            this.blocks.splice(1, 0, this.blocks.splice(0, 1)[0]);
            this.reRender();
        },
        blockHtmlChanged () {
            this.reRender();
        },
        reRender () {
            const html = this.blocks.map((block) => block.renderedHtml).join('\n')
            console.log(html);
            this.$emit("htmlrender", html)
            return html;
        }
    },
    components: {
        UiButton: Button,
        VPopover,
        blocks
    },
    directives: {
        tooltip: VTooltip
    }
}
</script>

<style>
@import '~@vue/ui/dist/vue-ui.css';
@import "~normalize.css/normalize.css";
@import "~@contentarchitect/base/dist/contentarchitect-base.css";

.new-block-panel.tooltip.popover .popover-inner {
    min-width: 200px;
    padding: 0
}

.block-list {
    margin: 0;
    padding: 0;
}

.block-list li {
    list-style: none;
    padding: 8px 20px 8px 10px;
    border-bottom: 1px solid #303030;
}

.block-list li:hover {
    background: #333;
    cursor: default;
}
</style>
