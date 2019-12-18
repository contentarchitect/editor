<template>
	<ul>
		<TreeItem v-for="item in tree.children" :key="item.id" :item="item"></TreeItem>
	</ul>
</template>

<script>
import TreeItem from "./TreeItem.vue"
import { serialize } from "./serialize"

export default {
	components: {
		TreeItem
	},
	props: ['value'],
	inject: ['slottedBlocks'],
	data () {
		return {
			tree: null,
		}
	},
	watch: {
		slottedBlocks: {
			immediate: true,
			deep: true,
			handler () {
				const headers = this.slottedBlocks.filter(block => block.name === "Header");
				this.tree = serialize(headers);
			}
		}
	}
}
</script>

<style scoped>

</style>