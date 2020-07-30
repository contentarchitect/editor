<template>
	<div
		class="control"
		:style="style"
		v-show="isShow"
		style="z-index: 1000"
		@mouseenter="onControl = true"
		@mouseleave="onControl = false"
	>
		<ui-button
			square
			@click="moveBlockDown"
			:disabled="disableMoveDown"
		>
			↓
		</ui-button>

		<ui-button
			square
			@click="moveBlockUp"
			:disabled="disableMoveUp">
			↑
		</ui-button>

		<ui-button
			square
			@click="removeBlock"
			class="ui-button--remove"
			:class="{ 'ui-button--remove-active ui-button--danger': showRemove }">
			✕
			<div style="display: inline-block" v-show="showRemove">
				Remove
			</div>
		</ui-button>

		<!-- <ui-button
			:active="isSettingsOpen"
			square
			class="settings-button"
			:disable="!currentBlock.constructor.settingsComponent"
			ref="settingsButton"
			@click="toggleSettings"
		>
			⋮
		</ui-button> -->
		<ui-button
			:active="isSettingsOpen"
			square
			class="settings-button"
			:disable="false"
			ref="settingsButton"
			@click="toggleSettings"
		>
			⋮
		</ui-button>
	</div>
</template>

<script>
import UiButton from './UiButton'
import * as Popper from '@popperjs/core'
// import preventOverflow from '@popperjs/core/lib/modifiers/preventOverflow';

export default {
	components: {
		UiButton
	},
	data () {
		return {
			disableMoveDown: false,
			disableMoveUp: false,
			currentBlock: null,
			currentBlockEl: null,
			showRemove: false,
			isSettingsOpen: false,
			visible: false,
			onControl: false,
			style: {},
			popper: null
		}
	},
	watch: {
		onControl () {
			if (this.onControl) {
				this.show(this.currentBlockComponent)
			} else {
				this.hide(true)
			}
		}
	},
	computed: {
		isShow () {
			return this.visible
		}
	},
	methods: {
		show (blockComponent) {
			this.visible = true
			this.currentBlockComponent = blockComponent;

			this.$nextTick(() => {
				if (this.popper) {
					this.popper.state.elements.reference = blockComponent.$el
					this.popper.forceUpdate()
				} else {
					this.popper = Popper.createPopper(blockComponent.$el, this.$el, {
						placement: "top-end",
						// defaultModifiers: [...Popper.defaultModifiers, preventOverflow],
						modifiers: [
							{
								name: "offset",
								options: {
									offset: [0, -this.$el.offsetHeight]
								}
							},
							{
								name: 'flip',
								enabled: false,
							},
						]
					})
				}
				// const blockRect = blockEl.getBoundingClientRect();
				// const controlRect = this.$el.getBoundingClientRect();

				// // top righ
				// const translateX = blockRect.x - controlRect.x + blockRect.width - controlRect.width
				// const translateY = blockRect.y - controlRect.y
				
				// const transform = `translate(${translateX}px,${translateY}px)`;

				// this.style = {
				// 	transform
				// }
			})
		},
		hide (removeCurrentBlock) {
			this.visible = false

			if (removeCurrentBlock) {
				this.currentBlockComponent = null
			}

			this.showRemove = false
			this.style = {}
		},
		moveBlockDown () {
			this.onControl = false

			const currentBlock = this.currentBlockComponent.block

			this.hide(true)

			this.$nextTick(() => {
				this.$emit('move-block-down', currentBlock)
			})
		},
		moveBlockUp () {
			this.onControl = false
			const currentBlock = this.currentBlockComponent.block
			this.hide(true)
			this.$nextTick(() => {
				this.$emit('move-block-up', currentBlock)
			})
		},
		removeBlock () {
			if (this.showRemove) {
				this.$emit('remove-block', this.currentBlockComponent.block)
				this.hide(true)
			} else {
				this.showRemove = true;
			}
		},
		toggleSettings () {
			this.currentBlockComponent.toggleSettings(this.$refs.settingsButton.$el)
		}

	}
}
</script>

<style>
@import "../assets/text-button.css";

.tooltip.popover .popover-inner {
	background: #2b2b2b;
	border-radius: 3px;
}

.tooltip.popover .popover-arrow {
	border-color: #121212;
}

.settings-card {
	z-index: 101;
	font-size: .875rem;
}

.settings-panel.vue-ui-dark-mode {
	background: #121212;
	border-radius: 3px;
}

.settings-panel {
	/* padding: 10px; */
	width: 200px;
}

.settings-panel > .tooltip-inner.popover-inner {
	padding: 0 !important;
}

.settings-panel-header {
	user-select: none;
	border-radius: 3px 3px 0 0;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 6px 8px;
	border-bottom: 1px solid #000;
	background: #404040;
	line-height: 16px;
}

.settings-panel-body {
	padding-bottom: 20px;
}

.settings-panel-footer {
	display: flex;
	padding: 6px 8px;
	align-items: center;
	justify-content: flex-end;
	border-top: 1px solid #000;
}

.settings-panel-footer > * {
	margin-left: 5px;
}

.ui-button--remove {
	transition: width .2s;
	justify-content: flex-start;
}

.ui-button--remove.ui-button--remove-active {
	width: 100px !important;
}
</style>