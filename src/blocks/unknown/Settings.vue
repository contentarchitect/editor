<template>
	<css-grid :columns="['2fr', '3fr']" gap="8px 0">
		<label for="">Convert to</label>
		<select v-model="selectedBlock">
			<option
				v-for="block in Blocks.registeredBlocks"
				:value="block.name"
				:key="block.name"
			>
				{{ block.name }}
			</option>
		</select>
		<css-grid-item x="2">
			<v-button @click="convert">Convert</v-button>
		</css-grid-item>
	</css-grid>
</template>

<script>
import CssGrid from "../../components/CssGrid.vue"
import CssGridItem from "../../components/CssGridItem.vue"
import Button from "../../components/Button.vue"
import Blocks from "../../scripts/Blocks"

export default {
	props: ['value'],
	inject: ['replaceBlock'],
	components: { CssGrid, CssGridItem, 'v-button': Button },
	data () {
		return {
			Blocks,
			selectedBlock: null,
		}
	},
	methods: {
		convert () {
			this.value
			const parser = new DOMParser();
			const doc = parser.parseFromString(this.value.outerHTML, "text/html");
			const blockDom = doc.querySelector("[data-block]")
			const blockConstuctor = Blocks.registeredBlocks.find(block => block.name == this.selectedBlock) 
			this.replaceBlock(this.value, new blockConstuctor(blockDom))
		}
	}
}
</script>

<style scoped>
</style>