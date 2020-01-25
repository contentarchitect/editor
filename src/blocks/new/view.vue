<template>
	<on-event-outside :do="removeThis">
		<div class="new-block-inner">
			<ul>
				<li v-for="blockConstructor in usableBlocks" :key="blockConstructor.name" @click="addBlock(blockConstructor)">
					{{blockConstructor.name}}
				</li>
			</ul>

			<ui-button
				square
				@click="removeThis"
				:disabled="disableMoveUp">
				✕
			</ui-button>
		</div>
	</on-event-outside>
</template>

<script>
import { OnEventOutside, UiButton } from "@contentarchitect/core"

export default {
	components: { OnEventOutside, UiButton },
	props: ['value'],
	inject: ['slottedBlocks', 'usableBlocks', 'replaceBlock', 'removeBlock'],
	methods: {
		addBlock (blockConstructor) {
			const newBlock = new blockConstructor()
			this.replaceBlock(this.value, newBlock)
		},
		removeThis () {
			this.removeBlock(this.value)
		}
	}
}
</script>

<style scoped>
ul, li {
	list-style-type: none;
	margin: 0;
	padding: 0;
}

ul {
	display: flex;
	background: #121212;
	border-radius: 3px;
}

li {
	padding: 20px;
	color: aliceblue;
}

.new-block-inner {
	position: relative;
	margin: 10px 0;
}

.new-block-inner button {
	position: absolute;
	right: 10px;
	top: 10px;
}
</style>