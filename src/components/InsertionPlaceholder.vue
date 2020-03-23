<template>
	<div
		class="add-block"
		:class="{ 'show-blocks': showBlocks, 'last-add-block': isLastBlock }"
	>
		<div class="add-block-inner" @click="show" v-show="!showBlocks">
			<hr />
			<span>add block</span>
			<hr />
		</div>

		<div v-show="showBlocks" ref="blocksPlaceholder" style="position: relative;">
			&nbsp;
		</div>
	</div>
</template>

<script>
export default {
	name: "insertionPlaceholder",
	inject: ['showNewBlock', 'hideNewBlock', 'newBlockEventBus'],
	props: ['index', 'isLastBlock'],
	data () {
		return {
			showBlocks: false
		}
	},
	created () {
		this.newBlockEventBus.$on('click', () => {
			this.hide()
		})

		this.newBlockEventBus.$on('close', () => {
			this.hide()
		})
	},
	watch: {
		isLastBlock: {
			immediate: true,
			handler () {
				if (this.isLastBlock)
					this.newBlockEventBus.lastInsertionPlaceholderComponent = this
			}
		}
	},
	methods: {
		show () {
			this.newBlockEventBus.$emit('click')

			if (!this.showBlocks) {
				this.showBlocks = true
				this.$nextTick(() => {
					this.showNewBlock(this.$refs.blocksPlaceholder, this.index)
				})
			}
		},
		hide () {
			this.hideNewBlock()
			this.showBlocks = false
		}
	},
}
</script>

<style>

</style>