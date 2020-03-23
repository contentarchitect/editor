<template>
	<div style="margin: 0 auto; width: 100%; position: relative;">
		<control-buttons
			ref="blockControl"
			@remove-block="removeBlock"
			@move-block-down="moveBlockDown"
			@move-block-up="moveBlockUp"
		/>
		<!-- <block-bg ref="blockBg" /> -->

		<new-block ref="newBlock" />

		<!-- portal-target, multiple ile kullanildiginda bug oluyor -->
		<!-- bug yuzunden dongu yapildi -->
		<portal-target v-for="block in slotBlocks" :name="`${block.id}`" :key="block.id" />

		<Editable
			ref="editableToolbar"
			:currentRange="currentRange"
			:block="currentEditableIsBlock"
		/>

		<!-- Step 1 - placeholder for <slot /> -->
		<div ref="slotBlocks" class="slot-blocks">
		</div>

		<!-- <blocks v-model='slotBlocks' @htmlrender="reRender" /> -->

		<!-- Step 2 - send blocks to the <content-architect>'s slot -->
		<MountingPortal :mount-to="'#' + mountTo" :name="'source-' + mountTo" append>
			<blocks ref="blocks" v-model='slotBlocks' @htmlrender="reRender" />
		</MountingPortal>

		<new-block-button @click="showAddNewBlock" />
		<!-- <pre>{{ slotBlocks }}</pre> -->
	</div>
</template>

<script>
import Vue from "vue"
import {
	UiButton,
	Util,
	Blocks,
	Editable,
} from "@contentarchitect/core"

import convertHtmlToBlocks from "./scripts/ConvertHtmlToBlocks"
import BlocksComponent from "./components/Blocks.vue"
// import NewBlock from "./blocks/new/main.js"
import NewBlock from "./components/NewBlock.vue"
import NewBlockButton from "./components/NewBlockButton.vue"
import ControlButtons from "./components/ControlButtons.vue"
// import BlockBg from "./components/BlockBg.vue"
import { PortalTarget, MountingPortal } from 'portal-vue'

export default {
	name: 'ContentArchitect',
	components: {
		UiButton,
		NewBlockButton,
		NewBlock,
		Editable,
		ControlButtons,
		PortalTarget,
		MountingPortal,
		blocks: BlocksComponent
	},
	model: {
		event: "change"
	},
	props: {
		blockSettings: {
			type: Object,
			default () {
				return {}
			}
		},
		classOptions: {
			type: [Object, Array]
		},
		inlineClasses: {
			type: [Array],
			default () {
				return []
			}
		},
		output: {},
		value: {},
		usableBlocks: {
			type: Array,
			default() {
				return Blocks.registeredBlocks.slice().map(blockConstructor => {
					return new Proxy(blockConstructor, {})
				});
			}
		}
	},
	provide() {
		const _this = this;

		return {
			appSettings: {
				blockSettings: this.blockSettings,
				get classOptions () {
					return _this.classOptions
				},
				get inlineClasses() {
					return _this.inlineClasses;
				}
			},
			// $slotBlocks: () => this.slotBlocks
			get slottedBlocks () {
				return _this.slotBlocks
			},

			addParagraphBlockAfter: this.addParagraphBlockAfter,
			addBlock: this.addBlock,
			removeBlock: this.removeBlock,
			replaceBlock: this.replaceBlock,

			get usableBlocks () {
				return _this.usableBlocks
			},
			showControl: this.showControl,
			hideControl: this.hideControl,
			showNewBlock: this.showNewBlock,
			hideNewBlock: this.hideNewBlock,
			newBlockEventBus: this.newBlockEventBus
		}
	},
	data() {
		return {
			Blocks: Blocks,
			isNewBlockPopoverActive: false,
			slotBlocks: [],
			renderedHTML: "",
			selectionRectangle: {
				x: 0,
				y: 0,
				width: 10,
				height: 10
			},
			currentRange: null,
			currentEditableIsBlock: false,
			mountTo: Util.generateID(3, 'alphabetic'),
			newBlockEventBus: new Vue({ 
				data() {
					return {
						lastInsertionPlaceholderComponent: null
					}
				}
			})
		}
	},
	beforeCreate () {
	},
	created () {
		Blocks.editors.push(this);

		this.slotBlocks = this.value 
			? convertHtmlToBlocks(this.value)
			: convertHtmlToBlocks(this.$root.$options.customElement.innerHTML);

		if (this.$root.$options.customElement) {
			Object.defineProperties(this.$root.$options.customElement, {
				blocks: { get: () => this.slotBlocks },
				value: { get: () => this.renderedHTML },
			})
		}

		// Step 3 - Remove <content-architect>'s inside
		this.$root.$options.customElement.innerHTML = `<div id="${this.mountTo}"></div>`
	},
	mounted () {
		// For Firefox bug: https://bugzilla.mozilla.org/show_bug.cgi?id=1066965
		if (Util.isFirefox()) {
			const input = document.createElement("input")
			input.setAttribute("id", "firefoxindicator")
			input.type = "text"
			input.style.position = "relative"
			input.style.left = "-99999px"
			document.body.append(input)
		}

		// Step 4 - put slot to slotBlocks ref
		this.$refs.slotBlocks.innerHTML = "<slot />"
	},
	methods: {
		addBlock (usableBlock, index) {
			const newBlock = new usableBlock();

			if (index !== undefined) {
				this.slotBlocks.splice(index+1, 0, newBlock)
			} else {
				this.slotBlocks.push(newBlock)
			}
		},
		removeBlock (block) {
			const index = this.slotBlocks.indexOf(block);

			if (index !== -1) {
				this.slotBlocks.splice(index, 1)
			}

			this.$emit("change", this.slotBlocks);
		},
		moveBlockDown (block) {
			const indexOfBlock = this.slotBlocks.indexOf(block);
			this.slotBlocks.splice(indexOfBlock + 1, 0, this.slotBlocks.splice(indexOfBlock, 1)[0]);
			this.$emit("change", this.slotBlocks);
		},
		moveBlockUp (block) {
			const indexOfBlock = this.slotBlocks.indexOf(block);
			this.slotBlocks.splice(indexOfBlock - 1, 0, this.slotBlocks.splice(indexOfBlock, 1)[0]);
			this.$emit("change", this.slotBlocks);
		},
		reRender (html) {
			this.$emit('change', html)
			this.renderedHTML = html;
			if (this.output) {
				document.getElementById(this.output).value = html
			}
		},
		addParagraphBlockAfter (blockVueComponent) {
			const Paragraph = this.usableBlocks.find(blockConstructor => blockConstructor.name == "Paragraph")
			if (!Paragraph) return
			if (!blockVueComponent._isVue) return
			const index = this.slotBlocks.indexOf(blockVueComponent.block)
			this.slotBlocks.splice(index + 1, 0, new Paragraph())
		},
		replaceBlock (block, newBlock) {
			const ind = this.slotBlocks.indexOf(block)
			Vue.set(this.slotBlocks, ind, newBlock)
		},
		showEditableToolbar(range, { currentRange, isBlock }) {
			this.currentRange = currentRange
			this.currentEditableIsBlock = isBlock
			this.$refs.editableToolbar.open(range)
		},
		hideEditableToolbar () {
			this.$refs.editableToolbar.close()
		},
		showControl (blockComponent) {
			this.$refs.blockControl.show(blockComponent)
			// this.$refs.blockBg.show(blockComponent)
		},
		hideControl () {
			this.$refs.blockControl.hide()
			// this.$refs.blockBg.hide()
		},
		showAddNewBlock () {
			this.newBlockEventBus.lastInsertionPlaceholderComponent.show()
		},
		showNewBlock (el, index) {
			this.$refs.newBlock.show(el, index)
		},
		hideNewBlock (el) {
			this.$refs.newBlock.hide()
		}
	},
	watch: {
		blockSettings: {
			immediate: true,
			handler () {
				Object.entries(this.blockSettings).forEach(([blockName, settings]) => {
					let usableBlock;

					if (usableBlock = this.usableBlocks.find(blk => blk.name === blockName)) {
						usableBlock.setSettings(settings)
					}
				})
			}
		},
		classOptions: {
			immediate: true,
			handler () {
				if (!this.classOptions) return;
				let classOptions = this.classOptions

				if (Util.isObject(this.classOptions)) {
					classOptions = Array.from({ classes: this.classOptions })
				}

				classOptions.forEach(optionsSetting => {
					let blockConstructors = optionsSetting.blocks
						? this.usableBlocks.filter(blockConstructor => optionsSetting.blocks.includes(blockConstructor.name))
						: this.usableBlocks
					const classOptionsMap = optionsSetting.classes

					blockConstructors.forEach(blockConstructor => {
						// set classOptions to class constructor
						blockConstructor.setSettings({ classOptions: classOptionsMap })

						// set classOptions to block instance
						this.slotBlocks.filter(block => block instanceof blockConstructor).forEach(block => {

							Object.keys(classOptionsMap).forEach(key => {
								if (typeof classOptionsMap[key] === "string") {
									Vue.set(block.classOptions, key, block.classes.includes(key))
								} else if (Util.isObject(classOptionsMap[key])) {
									Vue.set(block.classOptions, key, "")
									Object.keys(classOptionsMap[key]).forEach(k => {
										if (block.classes.includes(k)) Vue.set(block.classOptions, key, k)
									})
								}
							})
						})
					});
				});
			}
		}
	},
}
</script>

<style>
@import "~normalize.css/normalize.css";
@import "./assets/popover.custom.css";

:host {
	--accent-color: #0e639c;
	--accent-fg-color: #cccccc;
	--accent-color-hover: rgb(17, 119, 187);
	--toolbar-bg-color: #333333;
	--toolbar-hover-bg-color: #202020;
	--selection-fg-color: #cdcdcd;
	--selection-inactive-fg-color: #cdcdcd;
	--selection-inactive-bg-color: hsl(0, 0%, 28%);
	--divider-color: #525252;
	--focus-ring-inactive-shadow: 0 0 0 1px #5a5a5a;
	--focus-ring-active-shadow: 0 0 0 1px var(--accent-color);
}

:host {
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
	font-size: 1rem;
	font-weight: 400;
	line-height: 1.5;
	display: block;
}

.new-block-panel.tooltip.popover .popover-inner {
	min-width: 200px;
	padding: 0
}

.block-list {
	margin: 0;
	padding: 0;
}

.block-list li {
	list-style: none;
	padding: 8px 20px 8px 10px;
	border-bottom: 1px solid #303030;
}

.block-list li:hover {
	background: #333;
	cursor: default;
}
</style>
