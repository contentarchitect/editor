<template>
	<div class="new-block-inner" :style="style" v-show="showThis" style="z-index: 1; position: absolute">
		<div v-if="!registeredBlocks.length" class="no-blocks">
			There are no blocks.
		</div>
		<div v-else>
			<ul>
				<li v-for="blockConstructor in registeredBlocks" :key="blockConstructor.name">
					<a @click.prevent="addNewBlock(blockConstructor)">
						<span class="block-icon">
							<component :is="blockConstructor.icon" />
						</span>
						<span class="block-name">{{blockConstructor.name}}</span>
					</a>
				</li>
			</ul>
		</div>
		<ui-button square @click="removeThis">✕</ui-button>
	</div>
</template>

<script>
import OnEventOutside from "./OnEventOutside"
import UiButton from "./UiButton"
import Blocks from "../scripts/Blocks"

export default {
	components: { OnEventOutside, UiButton },
	inject: ['addBlock', 'newBlockEventBus'],
	data () {
		return {
			showThis: false,
			style: {},
			index: -1,
			registeredBlocks: Blocks.registeredBlocks
		}
	},
	methods: {
		addNewBlock (blockConstructor) {
			this.addBlock(blockConstructor, this.index)
			this.newBlockEventBus.$emit('close')
		},
		removeThis () {
			// this.removeBlock(this.value)
			this.hide()
			this.newBlockEventBus.$emit('close')
		},
		show (placeholderEl, index) {
			if (this.showThis) {
				this.hide()
			}

			this.index = index
			this.showThis = true

			this.$nextTick(() => {
				const thisRect = this.$el.getBoundingClientRect();
				const placeholderRect = placeholderEl.getBoundingClientRect();
	
				const translateX = placeholderRect.x - thisRect.x
				const translateY = placeholderRect.y - thisRect.y
	
				const transform = `translate(${translateX}px, ${translateY}px)`

				const width = placeholderRect.width
	
				this.style = { 
					transform,
					width: width + "px"
				}
			})
		},
		hide () {
			this.showThis = false
			this.style = {}
			this.index = -1
		}
	}
}
</script>

<style scoped>
ul, li {
	list-style-type: none;
	margin: 0;
}

ul {
	display: flex;
	padding: 10px;
	align-items: stretch;
}

li {
	display: flex;
	align-items: stretch;
}

li a {
	padding: 10px 10px 5px;
	color: aliceblue;
	font-size: .8em;
	display: inline-flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex;
	border-radius: 0.2em;
	user-select: none;
	width: 40px;
}

span.block-icon {
	flex: 1;
}

span.block-name {
	margin-top: 5px;
}

li a:hover {
	background-color: #222;
}

.new-block-inner {
	background: #121212;
	border-radius: 3px;
	position: relative;
	margin: 10px 0;
}

.new-block-inner > div {
	overflow-x: auto;
}

.new-block-inner button {
	position: absolute;
	right: 10px;
	top: 10px;
}

.no-blocks {
	display: flex;
	align-items: center;
	justify-content: center;
	color: #ccc;
	padding: 2em;
}
</style>

<style>
.block-icon > svg {
	fill: #ccc;
}
</style>