<template>
	<div
		ref="block"
		:data-block="block.constructor.name"
		v-bind="dataset"
		:class="[{ 'show-background': showBg || isSettingsOpen }, ...block.classes]"
		@mouseenter="showBackground"
		@mouseleave="!focused && hideBackground()"
		@click="focusHandler"
		v-click-outside="clickOutsideHandler"
	>	
		<component
			ref="view"
			:is="block.constructor.viewComponent"
			:settings="block.settings"
			:value="block"
			@focus="focusHandler"
		/>

		<portal :to="block.id">
			<div
				ref="background"
				:style="backgroundStyle"
				v-show="isBackgroundVisible"
				class="block-background"
				:class="{ focused, 'unknown-block': block.constructor.name === 'Unknown' }"
			>
			</div>

			<div
				ref="controlButtons"	
				class="control"
				v-show="isControlButtonsVisible"
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
			</div>

			<transition name="fade">
				<div v-show="isSettingsOpen || separatedPopover" ref="settings" class="settings-card">
					<div class="tooltip popover vue-popover-theme">
						<div class="settings-panel">
							<div class="tooltip-inner popover-inner">
								<div class="settings-panel-header" @mousedown="mousedownHandler">
									{{block.constructor.name.toUpperCase() }} SETTINGS
									<a @click="closeBtnAction">✕</a>
								</div>
								<div class="settings-panel-body">
									<settings-section :collapsed="false" :disabled="true">
										<template v-slot:title="{ toggleSection, showSection, disabled }">
											<section-title @click="toggleSection" :collapsed="showSection" :disabled="disabled">General</section-title>
										</template>
									</settings-section>

									<settings-section :collapsed="true" :disabled="isObjectEmpty(block.constructor.classOptions)">
										<template v-slot:title="{ toggleSection, showSection, disabled }">
											<section-title
												@click="() => !disabled && toggleSection()"
												:collapsed="showSection"
												:disabled="disabled"
											>
												CSS class options
											</section-title>
										</template>
										<template v-for="(humanName, className) in block.constructor.classOptions">
											<css-grid :columns="['2fr', '3fr']" :key="className" :style="{ marginBottom: '8px' }">
												<template v-if="isObject(humanName)">
													<span>{{ capitalized(className) }}</span>
													<v-select v-model="block.classOptions[className]">
														<option value=""></option>
														<option v-for="(humName, clsName) in humanName" :value="clsName" :key="clsName">
															{{humName}}
														</option>
													</v-select>
												</template>
												<template v-else>
													<span>{{ humanName }}</span>
													<checkbox v-model="block.classOptions[className]" />
												</template>
											</css-grid>
										</template>
									</settings-section>

									<settings-section
										:collapsed="false"
										:disabled="!block.constructor.settingsComponent"
									>
										<template v-slot:title="{ toggleSection, showSection, disabled }">
											<section-title
												@click="() => !disabled && toggleSection()"
												:collapsed="showSection"
												:disabled="disabled"
											>
												Block
											</section-title>
										</template>
										<component :is="block.constructor.settingsComponent" :settings="block.constructor.settings" :value="block" />
									</settings-section>
								</div>
								<div class="settings-panel-footer">
									<!-- <Tooltip tooltip="Duplicate"> -->
										<copy-icon @click="duplicate" fill="#ccc" />
									<!-- </Tooltip> -->

									<!-- <Tooltip tooltip="Remove Block"> -->
										<delete-icon @click="immediatelyRemoveBlock" fill="#e64848" />
									<!-- </Tooltip> -->
								</div>
							</div>
							<!-- <div class="tooltip-arrow popover-arrow" style="top: 3px;"></div> -->
						</div>
					</div>
				</div>
			</transition>
		</portal>
	</div>
</template>

<script>
import {
	Button,
	UiButton,
	Checkbox,
	RadioButtons,
	RadioButton,
	CssGrid,
	SectionTitle,
	SettingsSection,
	VSelect,
	// Tooltip,
	OnEventOutside,
	Util,
	ClickOutside,
} from '@contentarchitect/core'
import { Portal } from 'portal-vue'

import * as Popper from "@popperjs/core";
import CopyIcon from "../assets/copy.svg"
import DeleteIcon from "../assets/delete.svg"

export default {
	name: "Block",
	components: {
		SettingsSection,
		SectionTitle,
		[UiButton.name]: UiButton,
		OnEventOutside,
		Portal,
		Checkbox,
		RadioButtons,
		RadioButton,
		CssGrid,
		CopyIcon,
		DeleteIcon,
		VSelect,
		'v-button': Button,
	},
	directives: {
		ClickOutside
	},
	provide() {
		return {
			nextEditableInView: this.nextEditableInView
		}
	},
	inject: [
		'slottedBlocks',
		'appSettings',
		'nextBlockComponent',
		'showControl',
		'hideControl',
	],
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
	data () {
	  	return {
			showBg: false,
			showRemove: false,
			isSettingsOpen: false,
			separatedPopover: false,
			startDragPos: { x: 0, y: 0 },
			popperPos: { x: 0, y: 0 },
			popperModifiers: [],
			isObjectEmpty: Util.isObjectEmpty,
			settingsPopper: null,
			focused: false,
			backgroundStyle: {},
			backgroundVisible: false,
		}
	},
	mounted () {
		const _this = this;
		this.$once("hook:beforeDestroy", () => {
			this.settingsPopper && this.settingsPopper.destroy();
		})
		

		const resizeObserver = new ResizeObserver(entries => {
			if (_this.isBackgroundVisible) {
				entries.forEach(entry => {
					const { width, height  } = entry.contentRect

					Object.assign(_this.$refs.background.style, {
						width: width+20+'px',
						height: height+20+'px'
					})

					_this.$refs.background.style.removeProperty('transform')

					const { diffX: x, diffY: y } = Util.matchTransformMatrix({
						a: _this.$refs.background,
						b: _this.$el
					})

					Object.assign(_this.$refs.background.style, {
						transform: Util.transformStyle({ x: x - 10, y: y - 10 })
					})
				})
			}
		})
		resizeObserver.observe(this.$el)
	},
	computed: {
		dataset () {
			let obj = this.block.dataset
			let dataset = {};

			Object.keys(obj).forEach(datakey => {
				dataset["data-" + Util.toKebabCase(datakey)] = obj[datakey]
			});

			return dataset;
		},
		isBackgroundVisible () {
			return this.focused || this.backgroundVisible
		},
		isControlButtonsVisible () {
			return this.focused
				   || (this.isSettingsOpen && !this.separatedPopover)
		}
	},
	watch: {
		isControlButtonsVisible () {
			if (this.isControlButtonsVisible) {
				this.showControlButtons()
			} else {
				this.hideBackground()
			}

			if (!this.isControlButtonsVisible && this.showRemove) {
				this.showRemove = false
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
		},
	},
	methods: {
		duplicate () {
			this.$emit('duplicate', this.block);
		},
		moveBlockDown () {
			this.focused = false
			this.isSettingsOpen = false
			this.$emit('move-block-down', this.block)
		},
		moveBlockUp () {
			this.focused = false
			this.isSettingsOpen = false
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
		closeBtnAction () {
			this.isSettingsOpen = false;
			this.separatedPopover = false;
		},
		toggleSettings () {
			this.isSettingsOpen = !this.isSettingsOpen;

			if (this.isSettingsOpen) {
				this.focused = true
			} else {
				this.separatedPopover = false
			}

			this.$nextTick(() => {
				if (this.isSettingsOpen) {
					this.$refs.settings.style.removeProperty('display')
					const _this = this;
					this.settingsPopper = Popper.createPopper(
						this.$refs.settingsButton.$el,
						this.$refs.settings,
						{
							placement: "right-start",
							modifiers: [
								{
									name: "offset",
									options: { offset: [0, 5] }
								},
								{
									name: "applyStyles",
									fn () {
										if (_this.separatedPopover) return;
										const applyStyles = Popper.defaultModifiers.find(mod => mod.name == "applyStyles")
										applyStyles.fn(...arguments)
									}
								}
							]
						}
					)
					this.settingsPopper.update()
				}
			})
		},
		mousedownHandler (event) {
			this.startDragPos.x = event.pageX;
			this.startDragPos.y = event.pageY;
			window.addEventListener("mousemove", this.mousemoveHandler);
			window.addEventListener("mouseup", this.mouseupHandler);
			this.separatedPopover = true;

			this.$nextTick(() => {
				const mat = new WebKitCSSMatrix(this.$refs.settings.style.transform);
				this.popperPos.x = mat.e;
				this.popperPos.y = mat.f;
			})
		},
		mousemoveHandler (event) {
			const x = this.popperPos.x + event.pageX - this.startDragPos.x,
				  y = this.popperPos.y + event.pageY - this.startDragPos.y;

			this.$refs.settings.style.transform = `translate(${x}px, ${y}px)`
		},
		mouseupHandler () {
			window.removeEventListener("mousemove", this.mousemoveHandler);
			window.removeEventListener("mouseup", this.mouseupHandler);
			const mat = new WebKitCSSMatrix(this.$refs.settings.style.transform);
			this.popperPos.x = mat.e;
			this.popperPos.y = mat.f;
		},
		isObject (obj) {
			return Util.isObject(obj)
		},
		renderHTML () {
			this.$emit('render-html', this.block.toHTML())
		},
		capitalized (str) {
			if (typeof str !== 'string') return ''
			return str.charAt(0).toUpperCase() + str.slice(1)
		},
		nextEditableInView (editable) {
			const editables = this.$refs.view.$children.filter(comp => comp.$options.name == "Editable")
			const index = editables.indexOf(editable)
			return editables[index+1]
		},
		showControlButtons () {
			this.$refs.controlButtons.style.removeProperty("display");
			this.$refs.controlButtons.style.removeProperty("transform");
			Object.assign(this.$refs.controlButtons.style, {
				width: this.$el.offsetWidth+'px'
			})
			const diff = Util.matchTransformMatrix({
				a: this.$refs.controlButtons,
				b: this.$el
			})
			const transform = Util.transformStyle({ x: diff.diffX, y: diff.diffY })
			Object.assign(this.$refs.controlButtons.style, { transform })
		},
		clickOutsideHandler (e) {
			if (e.path.includes(this.$refs.controlButtons) 
				|| e.path.includes(this.$refs.settings)) return;

			this.focused = false
			this.isSettingsOpen = false
			this.hideBackground()
		},
		focusHandler () {
			this.focused = true
		},
		showBackground () {
			if (this.backgroundVisible) return
			this.backgroundVisible = true

			this.$nextTick(() => {
				const blockRect = this.$el.getBoundingClientRect();

				this.$refs.background.style.removeProperty("display");
				this.$refs.background.style.removeProperty("transform");
				const bgRect = this.$refs.background.getBoundingClientRect();
	
				const translateX = blockRect.x - bgRect.x - 10
				const translateY = blockRect.y - bgRect.y - 10
				
				const transform = `translate(${translateX}px,${translateY}px)`;

				const width = blockRect.width + 20
				const height = blockRect.height + 20
	
				this.backgroundStyle = {
					transform,
					width: `${width}px`,
					height: `${height}px`
				}
			})
		},
		hideBackground () {
			this.backgroundVisible = false
			this.backgroundStyle = {}
		}
	},
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

.block-background.unknown-block {
	background-color: #fbeded;
}

.control {
	position: absolute;
	display: grid;
	grid-template-columns: auto auto auto auto;
	gap: 5px;
	align-items: start;
	justify-content: end;
	z-index: 100;
	pointer-events: none;
}

.control > * {
	pointer-events: all;
}

.control > .has-tooltip {
	display: flex;
	align-items: flex-start;
}


.settings-button {
	width: 24px !important;
}
</style>