<template>
	<div class="blocks">
		<transition-group name="flip-list" tag="div" style="position: relative;">
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
import Vue from "vue"
import Block from "@/components/Block.vue"
import Blocks from "@/scripts/Blocks.js"
import Util from "@/scripts/Util.js"

export default {
	model: {
		prop: 'blocks',
		event: 'change',
	},
	props: ['blocks'],
	components: {
		block: Block
	},
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
	},
	watch: {
		blocks: {
			deep: true,
			handler () {
				let htmlStr = '';
	
					this.blocks.forEach(block => {
						htmlStr += `<div class="block" data-block-name="${block.name}">`
						htmlStr += this.registeredBlocks[block.name].renderHTML(block)
						htmlStr += `</div>`
					});
	
					this.$emit('htmlrender', htmlStr);

			}
		}
	}
}
</script>

<style>
.block-anim {
	transition: all .2s;
	width: 100%;
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
</style>