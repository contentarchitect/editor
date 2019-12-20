<template>
	<div :style="{ height: value.height + 'px' }" class="spacer" :class="{ resizing: resizing }">
		<transition name="fade">
			<div v-if="resizing" class="spacer-height">{{ value.height }}px</div>
		</transition>

		<div class="spacer-handle" @mousedown="spacerMousedownHandler">
		</div>
	</div>
</template>

<script>
export default {
	props: ['value'],
	data () {
		return {
			startPosition: 0,
			resizing: false,
			startHeight: null,
		}
	},
	methods: {
		spacerMousedownHandler (e) {
			document.body.style.cursor = "n-resize";
			this.startPosition = e.pageY;
			this.startHeight = this.value.height;
			this.resizing = true;

			window.addEventListener("mousemove", this.resizeHandler)
			window.addEventListener("mouseup", this.endResizeHandler)
		},
		resizeHandler (e) {
			let height = this.startHeight + e.pageY - this.startPosition;
			
			if (height < this.value.constructor.settings.minHeight) {
				height = this.value.constructor.settings.minHeight;
			}

			if (height > this.value.constructor.settings.maxHeight) {
				height = this.value.constructor.settings.maxHeight;
			}

			this.value.height = Math.floor(height);
		},
		endResizeHandler () {
			document.body.style.cursor = "auto";
			this.resizing = false;

			window.removeEventListener("mousemove", this.resizeHandler)
			window.removeEventListener("mouseup", this.endResizeHandler);
		}
	}
}
</script>

<style>
.spacer {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	user-select: none;
}

.spacer-handle {
	visibility: hidden;
	position: absolute;
	height: 10px;
	left: 0;
	right: 0;
	bottom: 0;
	cursor: n-resize;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.spacer:hover .spacer-handle,
.spacer.resizing .spacer-handle {
	visibility: visible;
}

.spacer-handle::before,
.spacer-handle::after {
	content: "";
	width: 30px;
	height: 1px;
	background: #121212;
	margin: 0 auto;
	display: block;
}

.spacer-handle::after {
  margin-top: 2px;
}
</style>