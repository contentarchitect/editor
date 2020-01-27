<template>
	<transition-group name="flip-list" tag="div" style="position: relative;" data-blocks>
		<template v-for="(block, i) in blocks">
			<block
				v-model="blocks[i]"
				ref="block"
				:key="'a-' + block.id"
				:disable-move-down="i+1 === blocks.length"
				:disable-move-up="i === 0"
				@remove-block="removeBlock"
				@move-block-down="moveBlockDown"
				@move-block-up="moveBlockUp"
				@duplicate="duplicate" />
			<insertion-placeholder
				:key="'b-' + block.id"
				@click="addNewBlockAfter(block)"
				v-show="showAddBlock(block)"	
			/>
		</template>
	</transition-group>
</template>

<script>
import Vue from "vue"
import Block from "./Block.vue"
import { Blocks, Util, renderBlocks } from "@contentarchitect/core"
import Unknown from "../blocks/unknown/main.js"
import InsertionPlaceholder from "./InsertionPlaceholder.vue"

export default {
	name: "Blocks",
	provide () {
		return {
			nextBlockComponent: this.nextBlockComponent
		}
	},
	inject: ['addNewBlockAfter'],
	model: {
		prop: 'blocks',
		event: 'change',
	},
	props: ['blocks'],
	components: {
		Block,
		InsertionPlaceholder
	},
	data () {
		return {
		}
	},
	methods: {
		removeBlock (block) {
			const index = this.blocks.indexOf(block);

			if (index !== -1) {
				this.blocks.splice(index, 1)
			}
			this.$emit("change", this.blocks);
		},
		moveBlockDown (block) {
			const indexOfBlock = this.blocks.indexOf(block);
			this.blocks.splice(indexOfBlock + 1, 0, this.blocks.splice(indexOfBlock, 1)[0]);
			this.$emit("change", this.blocks);
		},
		moveBlockUp (block) {
			const indexOfBlock = this.blocks.indexOf(block);
			this.blocks.splice(indexOfBlock - 1, 0, this.blocks.splice(indexOfBlock, 1)[0]);
			this.$emit("change", this.blocks);
		},
		duplicate (block) {
			const ind = this.blocks.indexOf(block);
			const newBlock = block.cloneSelf();
			this.blocks.splice(ind+1, 0, newBlock);
			this.$emit("change", this.blocks);
		},
		showAddBlock (block) {
			const ind = this.blocks.indexOf(block)
			const nextBlock = this.blocks[ind + 1]

			const isNewBlock = block.constructor.name == "New"
			const isNextBlockNew = nextBlock && nextBlock.constructor.name == "New"
			const isLastBlock = ind+1 == this.blocks.length

			return isNewBlock || isNextBlockNew || isLastBlock ? false : true
		},
		nextBlockComponent (blockComponent) {
			const index = this.$refs.block.indexOf(blockComponent)

			return this.$refs.block[index+1]
		}
	},
	watch: {
		blocks: {
			deep: true,
			handler () {
				const htmlStr = renderBlocks(this.blocks)

				this.$emit('htmlrender', htmlStr);
			}
		}
	}
}
</script>

<style>
[data-block] {
	transition: transform .2s, all .1s;
	box-sizing: border-box;
}

.flip-list-move {
	transition: transform .2s;
}

.flip-list-enter {
	opacity: 0;
	transform: translateX(-30px);
}

.flip-list-enter-to, .flip-list-leave {
	opacity: 1;
	transform: translateX(0);
}

.flip-list-leave-to {
	opacity: 0;
	transform: translateX(0);
}

.flip-list-leave-active {
	position: absolute !important;
}

[data-block]:hover + .add-block .add-block-inner {
	opacity: .2;
}
</style>