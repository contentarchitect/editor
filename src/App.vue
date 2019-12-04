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
					<li v-for="(_, blockName) in Blocks.registeredBlocks" :key="blockName" @click="addBlock(blockName)">
						{{blockName}}
					</li>
				</ul>
			</template>
		</v-popover>

		<!-- <pre>{{ slotBlocks }}</pre> -->
	</div>
</template>

<script>
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

export default {
	name: 'ContentArchitect',
	components: {
		UiButton,
		VPopover,
		Tooltip,
		PortalTarget,
		blocks: BlocksComponent
	},
	props: {
		blockSettings: {
			type: Object
		},
		classOptions: {
			type: [Object, Array]
		},
		input: {},
		blockStyles: {
			type: String
		},
	},
	provide() {
		const _this = this;

		return {
			appSettings: {
				blockSettings: this.blockSettings,
				get classOptions () {
					return _this.classOptions
				},
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
		this.slotBlocks = convertHtmlToBlocks(this.$root.$options.customElement.innerHTML);

		var _this = this;

		if (this.$root && this.$root.$options.customElement) {
			// console.log(this.$root.$options.customElement)
			Object.defineProperty(this.$root.$options.customElement, "blocks", { value: this.slotBlocks })
			Object.defineProperty(this.$root.$options.customElement, "renderedHTML", {
				get () {
					return _this.renderedHTML;
				}
			})
		}

		if (this.blockStyles) {
			let clonedStyle = document.getElementById(this.blockStyles).cloneNode(true);
			this.$root.$options.customElement.shadowRoot.appendChild(clonedStyle)
		}
	},
	mounted () {
	},
	methods: {
		addBlock (name) {
			this.isNewBlockPopoverActive = false
			const blockConstructor = Blocks.registeredBlocks[name];
			const block = new blockConstructor();
			
			this.slotBlocks.push({
				id: block.id,
				name: name,
				classes: [],
				...block.data
			})
		},
		reRender (html) {
			this.$emit('htmlrender', html)
			this.renderedHTML = html;	
			if (this.input) {
				document.getElementById(this.input).value = html
			}
		}
	},
	watch: {
		blockSettings: {
			immediate: true,
			handler () {
				if (this.blockSettings) {
					for (let blockName in this.blockSettings) {
						if (this.blockSettings.hasOwnProperty(blockName)) {
							Blocks.registeredBlocks[blockName].settings = this.blockSettings[blockName]
						}
					}
				}
			}
		},
		classOptions () {
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
	--focus-bg-color: hsl(214, 19%, 27%);
	--toolbar-bg-color: #333333;
	--toolbar-hover-bg-color: #202020;
	--selection-fg-color: #cdcdcd;
	--selection-inactive-fg-color: #cdcdcd;
	--selection-inactive-bg-color: hsl(0, 0%, 28%);
	--tab-selected-fg-color: #eaeaea;
	--tab-selected-bg-color: black;
	--drop-shadow: 0 0 0 1px rgba(255, 255, 255, 0.2),
				   0 2px 4px 2px rgba(0, 0, 0, 0.2),
				   0 2px 6px 2px rgba(0, 0, 0, 0.1);
	--divider-color: #525252;
	--focus-ring-inactive-shadow: 0 0 0 1px #5a5a5a;
	--editor-selection-bg-color: hsl(207, 88%, 22%);
	--editor-selection-inactive-bg-color: #454545;
	--focus-ring-active-shadow: 0 0 0 1px var(--accent-color);
	--selection-bg-color: var(--accent-color);
	--divider-border: 1px solid var(--divider-color);
}

:host {
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
	font-size: 1rem;
	font-weight: 400;
	line-height: 1.5;
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
