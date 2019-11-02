import Vue from 'vue'
import App from '@/App.vue'
import Block from "@/scripts/Block.js"
import Blocks from "@/scripts/Blocks.js"
import Button from "@/components/Button.vue"
import UiButton from "@/components/UiButton.vue"
import CaInput from "@/components/CaInput.vue"
import CssGrid from "@/components/CssGrid.vue"
import CssGridItem from "@/components/CssGridItem.vue"
import Editable from "@/components/Editable.vue"
import OnEventOutside from "@/components/OnEventOutside.vue"
import Checkbox from "@/components/Checkbox.vue"
import RadioButton from "@/components/RadioButton.vue"
import RadioButtons from "@/components/RadioButtons.vue"
import SectionTitle from "@/components/SectionTitle.vue"
import SettingsSection from "@/components/SettingsSection.vue"
import Tooltip from "@/components/Tooltip.vue"
import wrap from '@vue/web-component-wrapper'

const CustomElement = wrap(Vue, App)
window.customElements.define('content-architect', CustomElement)

window.blocksBase = Blocks

export {
	Block,
	Blocks,
	App,
	Button,
	UiButton,
	CaInput,
	CssGrid,
	CssGridItem,
	Editable,
	OnEventOutside,
	Checkbox,
	RadioButton,
	RadioButtons,
	SectionTitle,
	SettingsSection,
	Tooltip,
}