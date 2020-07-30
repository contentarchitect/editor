import Vue from 'vue'
import wrap from '@vue/web-component-wrapper'

// Main Component
import App from './App.vue'

// Scripts
import Block from './scripts/Block'
import Blocks from './scripts/Blocks'
import Util from './scripts/Util'
import DirectiveUtil from './scripts/DirectiveUtil'

// Directives
import EditDirective from './directives/EditDirective'
import SelectImage from './directives/SelectImage'
import ClickOutside from './directives/ClickOutside'

// Components
import CssGrid from './components/CssGrid'
import CssGridItem from './components/CssGridItem'
import Button from './components/Button'
import VSelect from './components/VSelect'
import UiButton from './components/UiButton'
import CaInput from './components/CaInput'

import './assets/main.extract.css'

// Add app to customElements
window.customElements.define('content-architect', wrap(Vue, App))

export {
	App,
	Block,
	Blocks,
	Util,
	DirectiveUtil,
	EditDirective,
	SelectImage,
	ClickOutside,
	CssGrid,
	CssGridItem,
	Button,
	VSelect,
	UiButton,
	CaInput
}