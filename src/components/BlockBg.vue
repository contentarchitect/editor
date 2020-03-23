<template>
	<div
		:style="style"
		v-show="focused || visible"
		class="block-background"
		:class="{ focused }"
	>
	</div>
</template>

<script>
export default {
	data () {
		return {
			visible: false,
			style: {},
			currentBlock: null,
		}
	},
	computed: {
		focused () {
			return this.currentBlock && this.currentBlock.focused
		}
	},
	methods: {
		show (blockComponent) {
			this.visible = true
			this.currentBlock = blockComponent

			this.$nextTick(() => {
				const blockRect = blockComponent.$el.getBoundingClientRect();
				const bgRect = this.$el.getBoundingClientRect();
	
				// top righ
				const translateX = blockRect.x - bgRect.x - 10
				const translateY = blockRect.y - bgRect.y - 10
				
				const transform = `translate(${translateX}px,${translateY}px)`;

				const width = blockRect.width + 20
				const height = blockRect.height + 20
	
				this.style = {
					transform,
					width: `${width}px`,
					height: `${height}px`
				}
			})
		},
		hide () {
			this.visible = false
			this.$nextTick(() => {
				this.style = {}
			})
		},

	}
}
</script>

<style scoped>
.block-background {
	position: absolute;
	z-index: 0;
	background: #f7ffff;
}

.block-background.focused {
	background: azure;
}
</style>