<template>
	<div 
		style="position: relative"
		class="block"
		:class="{ 'show-background': showBg || (isSettingsOpen && !separatedPopover) }"
		ref="block"
		@mouseenter="showToolbar = true"
		@mouseleave="showToolbar = false">

		<component :is="component.viewComponent" :settings="component.settings" :value="value" />

		<transition name="fade">
			<div class="control" v-show="showToolbar || (isSettingsOpen && !separatedPopover)" @mouseenter="showBg = true" @mouseleave="showBg = false">
				<Tooltip tooltip="Move down">
					<ui-button
						square
						@click="moveBlockDown"
						:disabled="disableMoveDown"
					>
						↓
					</ui-button>
				</Tooltip>

				<Tooltip tooltip="Move up">
					<ui-button
						square
						@click="moveBlockUp"
						:disabled="disableMoveUp">
						↑
					</ui-button>
				</Tooltip>


				<Tooltip tooltip="Remove">
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
				</Tooltip>

				<template>
					<v-popover
						ref="popper"
						popoverWrapperClass="vue-ui-dark-mode settings-panel"
						offset="8"
						placement="right-start"
						:container="$root.$el"
						trigger="manual"
						:autoHide="autoHide"
						>

						<Tooltip tooltip="Settings">
							<ui-button :active="isSettingsOpen" square class="settings-button" :disable="!component.settingsComponent" @click="isSettingsOpen = !isSettingsOpen">
								⋮
							</ui-button>
						</Tooltip>

						<!-- This will be the content of the popover -->
						<template slot="popover">
							<div ref="draggable" @mousedown="mousedownHandler" class="settings-panel-header">
								{{component.name.toUpperCase() }} SETTINGS
								<transition name="fade">
									<Tooltip tooltip="Close the window">
										<a v-show="separatedPopover" @click="closeSettingsPopover">✕</a>
									</Tooltip>
								</transition>
							</div>
							<div class="settings-panel-body">
								<settings-section>
									<template v-slot:title="{ toggleSection, showSection }">
										<section-title @click="toggleSection" :collapsed="showSection">General</section-title>
									</template>
									<VueButton @click="duplicate" style="grid-colomn: 1/-1">Duplicate</VueButton>
								</settings-section>

								<settings-section v-if="component.settingsComponent">
									<template v-slot:title="{ toggleSection, showSection }">
										<section-title @click="toggleSection" :collapsed="showSection">Block</section-title>
									</template>
									<component :is="component.settingsComponent" :settings="component.settings" :value="value" />
								</settings-section>
							</div>
						</template>
					</v-popover>
				</template>

			</div>
		</transition>
	</div>
</template>

<script>
import { Button } from '@contentarchitect/base'
import { VTooltip, VPopover, VClosePopover } from 'v-tooltip'
import SettingsSection from "./SettingsSection.vue"
import SectionTitle from "./SectionTitle.vue"
import Tooltip from "./Tooltip.vue"

export default {
	props: {
		value: {
			type: Object,
		},
		component: {
			type: Function
		},
		disableMoveUp: {
			type: Boolean,
			default: false
		},
		disableMoveDown: {
			type: Boolean,
			default: false
		}
	},
	components: {
		SettingsSection,
		SectionTitle,
		[Button.name]: Button,
		"v-popover": VPopover,
		Tooltip
	},
	directives: {
		tooltip: VTooltip,
		closePopover: VClosePopover
	},
	data () {
	  return {
			showBg: false,
			showToolbar: false,
			showRemove: false,
			autoHide: true,
			dragged: false,
			separatedPopover: false,
			isSettingsOpen: false,
			popperPos: {
				x: 0,
				y: 0
			},
			startDragPos: {
				x: 0,
				y: 0
			}
		}
	},
	mounted () {
		this.$refs.popper.$refs.popover.addEventListener('mouseenter', _ => {
			this.showBg = true;
		});

		this.$refs.popper.$refs.popover.addEventListener('mouseleave', _ => {
			this.showBg = false;
		});
	},
	methods: {
		duplicate () {
			this.$emit('duplicate', this.value);
		},
		moveBlockDown () {
			this.$emit('move-block-down', this.value)
		},
		moveBlockUp () {
			this.$emit('move-block-up', this.value)
		},
		removeBlock () {
			if (this.showRemove) {
				this.$emit('remove-block', this.value)
			} else {
				this.showRemove = true;
			}
		},
		popoverHideHandler () {
			this.autoHide = true;
			this.separatedPopover = false;
			// this.isSettingsOpen = false;
			let pop = this.$refs.popper;
			pop.$_hide()
			// popover kapatilirken okun gorunmesini onlemek icin.
			setTimeout(_ => {
				pop.popperInstance.update();
				this.showPopoperArrow()
			}, 300)
		},
		mousedownHandler (event) {
			const mat = new WebKitCSSMatrix(this.$refs.popper.$refs.popover.style.transform);
			this.popperPos.x = mat.e;
			this.popperPos.y = mat.f;
			
			this.startDragPos.x = event.pageX;
			this.startDragPos.y = event.pageY;
			window.addEventListener("mousemove", this.mousemoveHandler);
			window.addEventListener("mouseup", this.mouseupHandler);
			this.hidePopoverArrow();
			this.autoHide = false;
			this.separatedPopover = true;
		},
		mousemoveHandler (event) {
			let transform = { x: 0, y: 0 };

			transform.x = this.popperPos.x + event.pageX - this.startDragPos.x;
			transform.y = this.popperPos.y + event.pageY - this.startDragPos.y;

			this.$refs.popper.$refs.popover.style.transform = `translate(${transform.x}px, ${transform.y}px)`
		},
		mouseupHandler () {
			window.removeEventListener("mousemove", this.mousemoveHandler);
			window.removeEventListener("mouseup", this.mouseupHandler);
			const mat = new WebKitCSSMatrix(this.$refs.popper.$refs.popover.style.transform);
			this.popperPos.x = mat.e;
			this.popperPos.y = mat.f;
		},
		hidePopoverArrow () {
			this.$refs.popper.$refs.arrow.hidden = true;
		},
		showPopoperArrow () {
			this.$refs.popper.$refs.arrow.hidden = false;
		},
		closeSettingsPopover () {
			this.isSettingsOpen = false;
		}

	},
	watch: {
		showToolbar () {
			if (!this.showToolbar && this.showRemove) {
				this.showRemove = false
			}
		},
		isSettingsOpen () {
			let pop = this.$refs.popper;
			
			if (this.isSettingsOpen) {
				pop.$_show()
			} else {
				this.popoverHideHandler();
			}
		}
	}
}
</script>

<style>
@import "../assets/popover.custom.css"; 

.tooltip.popover .popover-inner {
  background: #121212;
  border-radius: 3px;
}

.tooltip.popover .popover-arrow {
  border-color: #121212;
}

.block::before {
	content: '';
	top: -10px;
	left: -10px;
	right: -10px;
	bottom: -10px;
	position: absolute;
	z-index: -1;
}

.show-background::before, .block:hover::before {
  background-color: azure;
}

.slide-leave-active,
.slide-enter-active {
  transition: .2s;
}
.slide-enter {
  transform: translate(100%, 0);
}
.slide-leave-to {
  transform: translate(-100%, 0);
}

.control {
	position: absolute;
	right: 0;
	top: 0;
	width: 200px;
	display: grid;
	grid-template-columns: auto auto auto auto;
	gap: 5px;
	z-index: 100;
}

.control > .ui-button {
	margin-right: 5px;
}

.settings-button {
	width: 24px !important;
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

.ui-button--remove {
	transition: width .2s;
	justify-content: flex-start;
}

.ui-button--remove.ui-button--remove-active {
	width: 100px !important;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .2s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.vue-ui-input {
	min-width: 70px !important;
}


.form-control {
	display: grid;
	gap: 8px 0;
	grid-template-columns: 1fr 2fr;
}

.form-control label {
	display: flex;
	align-items: center;
}
</style>