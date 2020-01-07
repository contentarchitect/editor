<template>
	<transition-group name="flip-list" tag="div" style="position: relative;" data-blocks>
		<template v-for="(block, i) in blocks">
			<block
				v-model="blocks[i]"
				
				:key="block.id"
				:disable-move-down="i+1 === blocks.length"
				:disable-move-up="i === 0"
				@remove-block="removeBlock"
				@move-block-down="moveBlockDown"
				@move-block-up="moveBlockUp"
				@duplicate="duplicate" />			
			<div
				:key="block.id"
				v-show="showAddBlock(block)"
				class="add-block"
				@click="addNewBlockAfter(block)"
			>
				<div class="add-block-inner">
					<hr />
					<span>add block</span>
					<hr />
				</div>
			</div>
		</template>
	</transition-group>
</template>

<script>
import Vue from "vue"
import Block from "./Block.vue"
import { Blocks, Util } from "@contentarchitect/core"
import Unknown from "../blocks/unknown/main.js"

export default {
	inject: ['addNewBlockAfter'],
	model: {
		prop: 'blocks',
		event: 'change',
	},
	props: ['blocks'],
	components: {
		Block
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

			const isThisNewBlock = block.constructor.name == "New"
			const isNextBlockNew = nextBlock && nextBlock.constructor.name == "New"

			return isThisNewBlock || isNextBlockNew ? false : true
		}
	},
	watch: {
		blocks: {
			deep: true,
			handler () {
				let htmlStr = '';

	
				this.blocks.forEach(block => {
					if (!("toHTML" in block)) return;

					let blockConstructor = block.constructor
					let classes = block.classes.join(" ")
					let classStr = classes ? `class="${classes}"` : ''

					const dataset = block.dataset

					let datasetStr = Object.entries(dataset).reduce((acu, [key, value]) => {
						return acu + ` data-${Util.toKebabCase(key)}="${value}"`
					}, "")

					htmlStr += `<div data-block="${blockConstructor.name}" ${classStr} ${datasetStr}>`
					htmlStr += block.toHTML(this.blocks)
					htmlStr += `</div>`
				});

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


.add-block {
  height: 0px;
  position: relative;
}

.add-block-inner {
  position: absolute;
  display: flex;
  left: 0;
  right: 0;
  height: 20px;
  opacity: 0;
  margin-top: -10px;
}

.add-block-inner > hr:first-child {
  flex: 10;
  height: 1px;
  border: 0;
  background: #5cc7c7;
}

.add-block-inner > span {
  padding: 0 10px;
}

.add-block-inner > hr:last-child {
  flex: 1;
  height: 1px;
  border: 0;
  background: #5cc7c7;
}

.add-block-inner:hover {
  opacity: 1;
}
</style>