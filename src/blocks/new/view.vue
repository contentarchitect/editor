<template>
	<on-event-outside :do="removeThis">
		<div class="new-block-inner">
			<div>
				<ul>
					<li v-for="blockConstructor in usableBlocks" :key="blockConstructor.name">
						<a @click.prevent="addBlock(blockConstructor)">
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
</style>

<style>
.block-icon > svg {
	fill: #ccc;
}
</style>