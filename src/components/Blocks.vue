<template>
    <div class="blocks">
        <transition-group name="flip-list" tag="div">
            <block
                v-model="blocks[i]"
                :component="registeredBlocks[block.name]"
                v-for="(block, i) in blocks"
                :key="block.id"
                @remove-block="removeBlock"
                @move-block-down="moveBlockDown"
                @move-block-up="moveBlockUp"
                @duplicate="duplicate" />
        </transition-group>
  </div>
</template>

<script>
import Block from "@/components/Block.vue"
import Blocks from "@/scripts/Blocks.js"

export default {
    model: {
        prop: 'blocks',
        event: 'change',
    },
    props: ['blocks'],
    components: { block: Block },
    data () {
        return {
            registeredBlocks: Blocks.blocks
        }
    },
    methods: {
        removeBlock (block) {
            const index = this.blocks.indexOf(block);

            if (index !== -1) {
            this.blocks.splice(index, 1)
            }
            this.$emit("change", this.blocks);
            this.reRender();
        },
        moveBlockDown (block) {
            const indexOfBlock = this.blocks.indexOf(block);
            this.blocks.splice(indexOfBlock + 1, 0, this.blocks.splice(indexOfBlock, 1)[0]);
            this.$emit("change", this.blocks);
            this.reRender();
        },
        moveBlockUp (block) {
            const indexOfBlock = this.blocks.indexOf(block);
            this.blocks.splice(indexOfBlock - 1, 0, this.blocks.splice(indexOfBlock, 1)[0]);
            this.$emit("change", this.blocks);
            this.reRender();
        },
        duplicate (block) {
            const ind = this.blocks.indexOf(block);
            let newBlock = { ...block };
            newBlock.id = Util.generateID();
            // debugger;
            this.blocks.splice(ind+1, 0, Vue.util.extend({}, newBlock));
            this.$emit("change", this.blocks);
        },
        reRender () {

        }
    }
}
</script>

<style>
.flip-list-move {
    transition: transform .2s;
}
</style>