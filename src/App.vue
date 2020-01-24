<template>
	<div style="margin: 0 auto; width: 100%;">
		<!-- portal-target, multiple ile kullanildiginda bug oluyor -->
		<!-- bug yuzunden dongu yapildi -->
		<portal-target v-for="block in slotBlocks" :name="`${block.id}`" :key="block.id" />

		<blocks v-model='slotBlocks' @htmlrender="reRender" />

		<div style="margin-top: 20px;"></div>

		<v-popover
			popoverClass="new-block-panel"
			offset="8"
			:open="isNewBlockPopoverActive"
			placement="bottom"
			:container="false"
			@show="isNewBlockPopoverActive = true"
			@hide="isNewBlockPopoverActive = false"
			:handle-resize="false">

			<Tooltip tooltip="Add new block">
				<ui-button :active="isNewBlockPopoverActive">+</ui-button>
			</Tooltip>

			<template slot="popover">
				<ul class="block-list">
					<li v-for="usableBlock in usableBlocks" :key="usableBlock.name" @click="addBlock(usableBlock)">
						{{usableBlock.name}}
					</li>
				</ul>
			</template>
		</v-popover>

		<!-- <pre>{{ slotBlocks }}</pre> -->
	</div>
</template>

<script>
import Vue from "vue"
import {
	UiButton,
	Util,
	Tooltip,
	Blocks,
} from "@contentarchitect/core"

import convertHtmlToBlocks from "./scripts/ConvertHtmlToBlocks"
import { VPopover, VTooltip } from 'v-tooltip'
import BlocksComponent from "./components/Blocks.vue"
import { PortalTarget } from 'portal-vue'
import NewBlock from "./blocks/new/main.js"

export default {
	name: 'ContentArchitect',
	components: {
		UiButton,
		VPopover,
		Tooltip,
		PortalTarget,
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
		blockStyles: {
			type: String
		},
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

			addNewBlockAfter: this.addNewBlockAfter,
			addWysiwygBlockAfter: this.addWysiwygBlockAfter,
			replaceBlock: this.replaceBlock,
			removeBlock: this.removeBlock,

			get usableBlocks () {
				return _this.usableBlocks
			}
		}
	},
	data() {
		return {
			Blocks: Blocks,
			isNewBlockPopoverActive: false,
			slotBlocks: [],
			renderedHTML: ""
		}
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

		if (this.blockStyles) {
			document.querySelectorAll(this.blockStyles).forEach(style => {
				let clonedStyle = style.cloneNode(true);
				this.$root.$options.customElement.shadowRoot.appendChild(clonedStyle)
			})
		}
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
	},
	methods: {
		addBlock (usableBlock) {
			const newBlock = new usableBlock();
			this.slotBlocks.push(newBlock)
		},
		removeBlock (block) {
			const index = this.slotBlocks.indexOf(block);

			if (index !== -1) {
				this.slotBlocks.splice(index, 1)
			}
		},
		reRender (html) {
			this.$emit('change', html)
			this.renderedHTML = html;
			if (this.output) {
				document.getElementById(this.output).value = html
			}
		},
		addNewBlockAfter (block) {
			const ind = this.slotBlocks.indexOf(block) + 1;
			this.slotBlocks.splice(ind, 0, new NewBlock())
		},
		addWysiwygBlockAfter (blockVueComponent) {
			const Wysiwyg = this.usableBlocks.find(blockConstructor => blockConstructor.name == "Wysiwyg")
			if (!Wysiwyg) return
			if (!blockVueComponent._isVue) return
			const index = this.slotBlocks.indexOf(blockVueComponent.block)
			this.slotBlocks.splice(index + 1, 0, new Wysiwyg())
		},
		replaceBlock (block, newBlock) {
			debugger;
			const ind = this.slotBlocks.indexOf(block)
			Vue.set(this.slotBlocks, ind, newBlock)
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
