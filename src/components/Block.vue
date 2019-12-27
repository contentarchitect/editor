<template>
	<on-event-outside :do="closeSettings">
		<div
			:data-block="block.constructor.name"
			v-bind="dataset"
			:class="[{ 'show-background': showBg || isSettingsOpen, 'unknown-block': block.constructor.name === 'Unknown' }, ...block.classes]"
			ref="block"
			@mouseenter="showToolbar = true"
			@mouseleave="showToolbar = false">

			<component :is="block.constructor.viewComponent" :settings="block.settings" :value="block" />

			<div class="control" v-show="showToolbar || (isSettingsOpen && !separatedPopover)">
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

				<Tooltip tooltip="Settings">
					<ui-button
						:active="isSettingsOpen"
						square
						class="settings-button"
						:disable="!block.constructor.settingsComponent"
						ref="settingsButton"
						@click="toggleSettings"
					>
						⋮
					</ui-button>
				</Tooltip>
			</div>

			<portal :to="`${block.id}`">
				<transition name="fade">
					<div v-show="isSettingsOpen || separatedPopover" ref="settings" class="settings-card">
						<div class="tooltip popover vue-popover-theme">
							<div class="vue-ui-dark-mode settings-panel">
								<div class="tooltip-inner popover-inner">
									<div class="settings-panel-header" @mousedown="mousedownHandler">
										{{block.constructor.name.toUpperCase() }} SETTINGS
										<Tooltip tooltip="Close the window">
											<a @click="closeBtnAction">✕</a>
										</Tooltip>
									</div>
									<div class="settings-panel-body">
										<settings-section :collapsed="false">
											<template v-slot:title="{ toggleSection, showSection }">
												<section-title @click="toggleSection" :collapsed="showSection">General</section-title>
											</template>
											<v-button @click="duplicate" primary>Duplicate</v-button>
											<v-button @click="immediatelyRemoveBlock">Remove</v-button>
										</settings-section>

										<settings-section :collapsed="true">
											<template v-slot:title="{ toggleSection, showSection }">
												<section-title @click="toggleSection" :collapsed="showSection">CSS class options</section-title>
											</template>
											<pre>{{	block.classOptions}}</pre>
											<template v-for="(humanName, className) in block.constructor.classOptions">
												<template v-if="isObject(humanName)">
													<div :key="className">
														<h3>{{ className }}</h3>
														<radio-buttons v-model="block.classOptions[className]">
															<radio-button :value="''">None</radio-button>
															<radio-button v-for="(humName, clsName) in humanName" :value="clsName" :key="clsName">
																{{humName}}
															</radio-button>
														</radio-buttons>
													</div>
												</template>
												<template v-else>
													<checkbox v-model="block.classOptions[className]" :key="className">
														{{ humanName }}
													</checkbox>
												</template>
											</template>
										</settings-section>

										<settings-section v-if="block.constructor.settingsComponent" :collapsed="false">
											<template v-slot:title="{ toggleSection, showSection }">
												<section-title @click="toggleSection" :collapsed="showSection">Block</section-title>
											</template>
											<component :is="block.constructor.settingsComponent" :settings="block.constructor.settings" :value="block" />
										</settings-section>
									</div>
								</div>
								<!-- <div class="tooltip-arrow popover-arrow" style="top: 3px;"></div> -->
							</div>
						</div>
					</div>
				</transition>
			</portal>
		</div>
	</on-event-outside>
</template>

<script>
import {
	Button,
	UiButton,
	Checkbox,
	RadioButtons,
	RadioButton,
	SectionTitle,
	SettingsSection,
	Tooltip,
	OnEventOutside,
	Util	
} from '@contentarchitect/core'
import { Portal } from 'portal-vue'


import { VTooltip, VPopover, VClosePopover } from 'v-tooltip'
import Popper from "popper.js";

export default {
	inject: ['appSettings'],
	model: {
		prop: 'block',
	},
	props: {
		block: {
			type: Object,
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
		[UiButton.name]: UiButton,
		OnEventOutside,
		Tooltip,
		Portal,
		Checkbox,
		RadioButtons,
		RadioButton,
		'v-button': Button,
		"v-popover": VPopover,
	},
	directives: {
		tooltip: VTooltip,
		closePopover: VClosePopover,
	},
	data () {
	  	return {
			showBg: false,
			showToolbar: false,
			showRemove: false,
			isSettingsOpen: false,
			popperInstance: null,
			autoHide: true,
			separatedPopover: false,
			startDragPos: { x: 0, y: 0 },
			popperPos: { x: 0, y: 0 },
			popperModifiers: [],
		}
	},
	mounted () {
		const _this = this;

		this.$nextTick(() => {
			this.popperInstance = new Popper(this.$refs.settingsButton.$el, this.$refs.settings, {
				placement: "right-start",
				modifiers: {
					offset: {
						offset: '0, 10'
					},
					computeStyle: {
						fn (data, options) {
							_this.popperPos.x = data.popper.left;
							_this.popperPos.y = data.popper.top;
							if (!_this.separatedPopover) {
								return Popper.Defaults.modifiers['computeStyle'].fn(data, options);
							} else {
								return data;
							}
						}
					}
				}
			});
		});

		this.$once("hook:beforeDestroy", () => {
			this.popperInstance.destroy();
		})
	},
	computed: {
		dataset () {
			let obj = this.block.dataset
			let dataset = {};

			Object.keys(obj).forEach(datakey => {
				dataset["data-" + Util.toKebabCase(datakey)] = obj[datakey]
			});

			return dataset;
		}
	},
	watch: {
		showToolbar () {
			if (!this.showToolbar && this.showRemove) {
				this.showRemove = false
			}
		},
		isSettingsOpen () {
			if (this.isSettingsOpen) {
				this.popperInstance.update();
				// this.popperInstance.popper.style.display = "block";
			} else {
				// this.popperInstance.popper.style.display = "none";
				setTimeout(() => {
					this.popperInstance.update();
				}, 200)
			}
		},
		"block.classOptions": {
			immediate: true,
			deep: true,
			handler () {
				if (Util.isObjectEmpty(this.block.constructor.classOptions)) return;
				this.block.classes = [];


				for (let [className, val] of Object.entries(this.block.classOptions)) {
					if (typeof val === "string" &&  val !== "") {
						this.block.classes.push(className)
						this.block.classes.push(val)
					} else if (typeof val === "boolean" && val) {
						this.block.classes.push(className)
					}
				}
			},
		}
	},
	methods: {
		duplicate () {
			this.$emit('duplicate', this.block);
		},
		moveBlockDown () {
			this.$emit('move-block-down', this.block)
		},
		moveBlockUp () {
			this.$emit('move-block-up', this.block)
		},
		removeBlock () {
			if (this.showRemove) {
				this.$emit('remove-block', this.block)
			} else {
				this.showRemove = true;
			}
		},
		immediatelyRemoveBlock() {
			this.$emit('remove-block', this.block)
		},
		closeSettings (e, path) {
			if (path.find(el => el == this.$refs.settings)) return

			if (!this.separatedPopover && this.isSettingsOpen) {
				this.isSettingsOpen = false;
				this.separatedPopover = false;
			}
		},
		closeBtnAction () {
			this.isSettingsOpen = false;
			this.separatedPopover = false;
		},
		toggleSettings () {
			this.isSettingsOpen = !this.isSettingsOpen;

			if (!this.isSettingsOpen) this.separatedPopover = false
		},
		mousedownHandler (event) {
			this.startDragPos.x = event.pageX;
			this.startDragPos.y = event.pageY;
			window.addEventListener("mousemove", this.mousemoveHandler);
			window.addEventListener("mouseup", this.mouseupHandler);
			// this.hidePopoverArrow();
			this.autoHide = false;
			this.separatedPopover = true;
		},
		mousemoveHandler (event) {
			let transform = { x: 0, y: 0 };

			transform.x = this.popperPos.x + event.pageX - this.startDragPos.x;
			transform.y = this.popperPos.y + event.pageY - this.startDragPos.y;

			this.popperInstance.popper.style.transform = `translate(${transform.x}px, ${transform.y}px)`
		},
		mouseupHandler () {
			window.removeEventListener("mousemove", this.mousemoveHandler);
			window.removeEventListener("mouseup", this.mouseupHandler);
			const mat = new WebKitCSSMatrix(this.popperInstance.popper.style.transform);
			this.popperPos.x = mat.e;
			this.popperPos.y = mat.f;
		},
		isObject (obj) {
			return Util.isObject(obj)
		},
		renderHTML () {
			this.$emit('render-html', this.block.toString())
		}
	},
}
</script>

<style>
@import "../assets/text-button.css"; 

.tooltip.popover .popover-inner {
	background: #121212;
	border-radius: 3px;
}

.tooltip.popover .popover-arrow {
	border-color: #121212;
}

[data-block] {
	position: relative;
}

[data-block]::before {
	content: '';
	top: -10px;
	left: -10px;
	right: -10px;
	bottom: -10px;
	position: absolute;
	z-index: -1;
}

.show-background::before, [data-block]:hover::before {
	background-color: azure;
}

.unknown-block.show-background::before, .unknown-block[data-block]:hover::before {
	background-color: #fbeded;
}

.control {
	position: absolute;
	right: 0;
	top: 0;
	display: grid;
	grid-template-columns: auto auto auto auto;
	gap: 5px;
	align-items: start;
	z-index: 100;
}

.control > .has-tooltip {
	display: flex;
	align-items: flex-start;
}

.settings-button {
	width: 24px !important;
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
</style>