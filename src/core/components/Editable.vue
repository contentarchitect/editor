<template>
	<div class="editable">
		<div
			contenteditable="true"
			:placeholder="placeholder"
			spellcheck="false"
			class="editable-body"
			:class="{ placeholder: showPlaceholder }"
			ref="body"
			@selectstart="selectStartHandler"
			@input="changeHandler" 
			@keydown="keydownHandler"
			@keyup="keyupHandler"
			@paste="pasteHandler"
		>
		</div>

		<div class="fake-ref" :style="fakeRefStyle" ref="fakeRef"></div>

		<on-event-outside :do="closeToolbar" event="mousedown">
			<transition name="fade">
				<div ref="toolbar" class="toolbar" v-show="isOpenToolbar" >
					<template v-if="showCreateLink">
						<div class="link-toolbar">
							<CaInput v-model="selectionLinkUrl" />
							<CaButton @click="createLink">Add</CaButton>
							<div class="divider"></div>
							<CaButton @click="removeLink" :disabled="selectionLinkUrl.trim() === ''">Remove</CaButton>
						</div>
					</template>
					<template v-else>
						<button @click.prevent="command('bold')" class="button-icon" :class="{ 'ca-active': commandStatus.bold }" type="button" tabindex="-1">
							<svg viewBox="0 0 18 18">
								<path class="ca-stroke" d="M5,4H9.5A2.5,2.5,0,0,1,12,6.5v0A2.5,2.5,0,0,1,9.5,9H5A0,0,0,0,1,5,9V4A0,0,0,0,1,5,4Z"></path>
								<path class="ca-stroke" d="M5,9h5.5A2.5,2.5,0,0,1,13,11.5v0A2.5,2.5,0,0,1,10.5,14H5a0,0,0,0,1,0,0V9A0,0,0,0,1,5,9Z"></path>
							</svg>
						</button>
						<button @click.prevent="command('italic')" class="button-icon" :class="{ 'ca-active': commandStatus.italic }" type="button" tabindex="-1">
							<svg viewBox="0 0 18 18">
								<line class="ca-stroke" x1="7" x2="13" y1="4" y2="4"></line>
								<line class="ca-stroke" x1="5" x2="11" y1="14" y2="14"></line>
								<line class="ca-stroke" x1="8" x2="10" y1="14" y2="4"></line>
							</svg>
						</button>
						<button @click.prevent="command('underline')" class="button-icon" :class="{ 'ca-active': commandStatus.underline }" type="button" tabindex="-1">
							<svg viewBox="0 0 18 18">
								<path class="ca-stroke" d="M5,3V9a4.012,4.012,0,0,0,4,4H9a4.012,4.012,0,0,0,4-4V3"></path>
								<rect class="ca-fill" height="1" rx="0.5" ry="0.5" width="12" x="3" y="15"></rect>
							</svg>
						</button>
						<button @click.prevent="command('strikethrough')" class="button-icon" :class="{ 'ca-active': commandStatus.strike }" type="button" tabindex="-1">
							<svg viewBox="0 0 18 18">
								<line class="ca-stroke ca-thin" x1="15.5" x2="2.5" y1="8.5" y2="9.5"></line>
								<path class="ca-fill" d="M9.007,8C6.542,7.791,6,7.519,6,6.5,6,5.792,7.283,5,9,5c1.571,0,2.765.679,2.969,1.309a1,1,0,0,0,1.9-.617C13.356,4.106,11.354,3,9,3,6.2,3,4,4.538,4,6.5a3.2,3.2,0,0,0,.5,1.843Z"></path>
								<path class="ca-fill" d="M8.984,10C11.457,10.208,12,10.479,12,11.5c0,0.708-1.283,1.5-3,1.5-1.571,0-2.765-.679-2.969-1.309a1,1,0,1,0-1.9.617C4.644,13.894,6.646,15,9,15c2.8,0,5-1.538,5-3.5a3.2,3.2,0,0,0-.5-1.843Z"></path>
							</svg>
						</button>

						<button @click.prevent="command('createLink')" class="button-icon" :class="{ 'ca-active': commandStatus.link }" type="button" tabindex="-1">
							<svg viewBox="0 0 18 18">
								<line class="ca-stroke" x1="7" x2="11" y1="7" y2="11"></line>
								<path class="ca-even ca-stroke" d="M8.9,4.577a3.476,3.476,0,0,1,.36,4.679A3.476,3.476,0,0,1,4.577,8.9C3.185,7.5,2.035,6.4,4.217,4.217S7.5,3.185,8.9,4.577Z"></path>
								<path class="ca-even ca-stroke" d="M13.423,9.1a3.476,3.476,0,0,0-4.679-.36,3.476,3.476,0,0,0,.36,4.679c1.392,1.392,2.5,2.542,4.679.36S14.815,10.5,13.423,9.1Z"></path>
							</svg>
						</button>

						<template v-for="className in appSettings.inlineClasses">
							<button
								@click.prevent="command('inline-class', className)"
								:class="{
									'ca-active': commandStatus[className]
								}"
								type="button"
								tabindex="-1"
								:key="className">
								.{{ className }}
							</button>
						</template>
					</template>

					<div class="toolbar-arrow"></div>
				</div>
			</transition>
		</on-event-outside>
	</div>
</template>

<script>
import Popper from 'popper.js'
import OnEventOutside from "./OnEventOutside.vue"
import Util from "../scripts/Util.js"
import CaInput from "./CaInput.vue"
import Button from "./Button.vue"

function isFirefox() {
	return typeof InstallTrigger !== 'undefined';
}

function takeToParagraph(body) {
	const childNodes = body.childNodes

	let index = Array.from(childNodes).findIndex(node => node.nodeType == 1 && node.tagName == "P")
	if (index < 1) index = childNodes.length

	const p = document.createElement("p")
	new Array(index).fill().forEach((el, ind) => p.appendChild(body.removeChild(childNodes[ind])))

	return p;
}

function isFirstElementParagraph(childNodes) {
	let result = false;

	Array.from(childNodes).reduce((acc, node, i, arr) => {
		if (node.nodeType == 1 && node.tagName == "P") {
			if (acc == "") {
				result = true
			}
			arr.splice(1);
		}

		if (node.nodeType == 3) {
			return acc + node.textContent.trim()
		}
	}, '')

	return result 
}

function unWrap(dom) {
	const parent = dom.parentNode;
	while (dom.firstChild) {
		parent.insertBefore(dom.firstChild, dom)
	}
	parent.removeChild(dom);
}

function isSelectedCustomTag(selection, cssClass, tagName = "SPAN") {
	if (!selection.rangeCount) return
	const range = selection.getRangeAt(0)
	const container = selectedContainer(range)

	if (!container) return;

	return container.nodeType == Node.ELEMENT_NODE
		&& container.tagName == tagName
		&& container.classList.contains(cssClass)
}

function selectedContainer(range) {
	const container = range.commonAncestorContainer.nodeType == Node.ELEMENT_NODE 
		? range.commonAncestorContainer
		: range.commonAncestorContainer.parentElement

	if (container.textContent == range.toString()) return container
}

// https://stackoverflow.com/a/7478420/7663430
function isCaretEnd (selection, el) {
	if (!selection.rangeCount || !selection.isCollapsed) return
	const selRange = selection.getRangeAt(0)
	const testRange = selRange.cloneRange()

	testRange.selectNodeContents(el)
	testRange.setStart(selRange.endContainer, selRange.endOffset);
	return testRange.toString().trim() == ""
}

// https://stackoverflow.com/a/7478420/7663430
function isCaretStart (selection, el) {
	if (!selection.rangeCount || !selection.isCollapsed) return
	const selRange = selection.getRangeAt(0)
	const testRange = selRange.cloneRange()

	testRange.selectNodeContents(el)
	testRange.setEnd(selRange.startContainer, selRange.startOffset);
	return testRange.toString().trim() == ""
}

export default {
	name: "Editable",
	inject: [
		'appSettings',
		'nextBlockComponent',
		'nextEditableInView',
		'addWysiwygBlockAfter'
	],
	props: {
		value: {
			type: String
		},
		block: {
			type: Boolean,
			default: false
		},
		placeholder: {
			type: String
		},
	},
	components: { OnEventOutside, CaInput, CaButton: Button },
	data () {
		return {
			document: null,
			popperInstance: null,
			fakeRefStyle: {
				width: 0,
				height: 0,
				transform: 'translate(0)'
			},
			isOpenToolbar: false,
			showCreateLink: false,
			currentRange: null,
			commandStatus: {
				bold: false,
				italic: false,
				underline: false,
				strike: false,
				link: false
			},
			selectionLinkUrl: '',
			showPlaceholder: false
		}
	},
	mounted () {
		setTimeout(() => {
			if (isFirefox()) {
				this.document = document;
			} else {
				this.document = this.$el.getRootNode() || document;
			}

			this.setCaretStart()
		})
		this.$refs.body.innerHTML = this.value;

		this.popperInstance = new Popper(this.$refs.fakeRef, this.$refs.toolbar, {
			placement: 'bottom',
			modifiers: {
				offset: 10
			}
		});

		this.changeHandler()
		this.changeToBlock()

		this.$once("hook:beforeDestroy", () => {
			this.popperInstance.destroy();
			document.removeEventListener('selectionchange', this.selectionChangeHandler);
		})
	},
	watch: {
		showCreateLink () {
			this.$nextTick(() => {
				this.popperInstance.update()
			})
		},
	},
	methods: {
		selectStartHandler () {
			document.addEventListener("selectionchange", this.selectionChangeHandler)
		},
		selectionChangeHandler (e) {
			let selection = this.document.getSelection();
			if (selection.rangeCount == 0 || !this.$refs.body.contains(selection.anchorNode)) return;

			let selectionRect = selection.getRangeAt(0).getBoundingClientRect();

			if (selection.anchorNode === selection.focusNode && selection.anchorOffset === selection.focusOffset) {
				this.isSelected = false;
				this.isOpenToolbar = false;
				return;
			}


			let editableRect = this.$el.getBoundingClientRect();

			this.fakeRefStyle.width = selectionRect.width + "px";
			this.fakeRefStyle.height = selectionRect.height + "px";
			this.fakeRefStyle.transform = `translate(${selectionRect.x - editableRect.x}px,${selectionRect.y - editableRect.y}px)`;

			this.updateCommandStatus();

			this.isOpenToolbar = true;

			this.$nextTick(() => {
				this.popperInstance.update();
			});

			this.currentRange = this.document.getSelection().getRangeAt(0);
		},
		command (command, className) {
			switch(command) {
				case 'h1':
				case 'h2':
				case 'p':
					document.execCommand('formatBlock', false, command);
					break;
				case 'createLink':
					this.showCreateLink = true;
					const parentEl = this.document.getSelection().anchorNode.parentElement;
					if (parentEl.nodeType == 1 && parentEl.tagName === "A") {
						this.selectionLinkUrl = this.document.getSelection().anchorNode.parentElement.getAttribute("href");
					}
					break;
				case 'inline-class':
					const selection = this.document.getSelection()

					if (!selection.rangeCount) break;

					if (isSelectedCustomTag(selection, className)) {
						const container = selectedContainer(selection.getRangeAt(0))
						container.classList.remove(className)
						if (!container.classList.length) unWrap(container)
						break;
					}

					const span = document.createElement('span');
					span.classList.add(className);
					const range = selection.getRangeAt(0);
					const content = range.extractContents();
					span.append(content);
					range.insertNode(span);
					break;
				default:
					document.execCommand(command, false, null);
					break;
			}

			this.updateCommandStatus();
		},
		closeToolbar () {
			this.isOpenToolbar = false;
			this.showCreateLink = false;
			this.selectionLinkUrl = '';
		},
		changeToBlock () {
			const editable = this.$refs.body

			if (
				this.block
				&& !isFirstElementParagraph(editable.childNodes)
			) {
				const p = takeToParagraph(editable)
				editable.insertBefore(p, editable.firstChild)
			}
		},
		changeHandler () {
			const editable = this.$refs.body;

			if (
				this.block
				&& editable.children.length == 1
				&& editable.children[0].tagName == "P"
				&& editable.children[0].children.length == 0
			) {
				const br = document.createElement("br")
				editable.children[0].appendChild(br)
			}

			if (
				editable.innerText.trim() != ""
			) {
				this.showPlaceholder = false
			} else if (
				this.block
				&& editable.children.length > 1
			) {
				this.showPlaceholder = false
			} else if (
				this.block
				&& editable.children.length == 1
				&& editable.children[0].innerText.trim() == ""
			) {
				this.showPlaceholder = true
			} else if (
				!this.block
				&& editable.innerText.trim() == ""
			) {
				this.showPlaceholder = true
			}

			this.$emit('input', editable.innerHTML);
		},
		keydownHandler (e) {
			if (e.which === 13 && !this.block) {
				if (this.isLastEditableInView()) {
					let block = this;

					while(block.$options.name != "Block") {
						block = block.$parent
					}

					this.addWysiwygBlockAfter(block)
				}

				e.preventDefault();
			} else if (e.which === 8) {
				const range = this.document.getSelection().getRangeAt(0)

				if (
					range.startContainer.nodeType === Node.ELEMENT_NODE &&
					range.startContainer.innerText.trim() === "" &&
					range.startOffset == 0 &&
					!range.startContainer.previousElementSibling
				) {
					e.preventDefault();
				}
			}
			// else if (e.which == 37) {
			// 	if (this.isCaretStart()) {
			// 		this.focusEndPrevEditable()
			// 		e.preventDefault()
			// 	}
			// } else if (e.which == 39) {
			// 	if (this.isCaretEnd()) {
			// 		this.focusStartNextEditable()
			// 		e.preventDefault()
			// 	}
			// }
		},
		keyupHandler (e) {
			if (e.which === 13){
				if (this.block && !e.shiftKey) {
					document.execCommand('formatBlock', false, 'p');
					e.preventDefault();
				} else {
					e.preventDefault();
				}
			}
		},
		pasteHandler (event) {
			let paste = (event.clipboardData || window.clipboardData).getData('text');
			document.execCommand("insertText", false, paste);
			event.preventDefault();
		},
		updateCommandStatus () {
			this.commandStatus.bold = document.queryCommandState("bold");
			this.commandStatus.italic = document.queryCommandState("italic");
			this.commandStatus.underline = document.queryCommandState("underline");
			this.commandStatus.strikeThrough = document.queryCommandState("strikethrough");
			this.commandStatus.link = document.queryCommandState("link");
			
			this.appSettings.inlineClasses.forEach(className => {
				this.commandStatus[className] = isSelectedCustomTag(this.document.getSelection(), className);
			})
		},
		createLink () {
			this.document.getSelection().removeAllRanges();
			this.document.getSelection().addRange(this.currentRange);
			document.execCommand('createLink', false, this.selectionLinkUrl);
			this.showCreateLink = false;
			this.updateCommandStatus();
		},
		removeLink () {
			document.execCommand('unlink');
			this.showCreateLink = false;
			this.updateCommandStatus();
		},
		innerText () {
			return this.$refs.body.innerText;
		},
		isLastEditableInView () {
			return !this.nextEditableInView(this)
		},
		// focusEndPrevEditable () {
		// 	const editables = this.$root.$el.getElementsByClassName("editable")
		// 	const index = Array.from(editables).indexOf(this.$el)
		// 	const beforeEditableEl = editables[index-1]

		// 	if (!beforeEditableEl) return;

		// 	const editable = beforeEditableEl.__vue__
		// 	editable.setCaretEnd()
		// },
		focusStartNextEditable () {
			const editables = this.$root.$el.getElementsByClassName("editable")
			const index = Array.from(editables).indexOf(this.$el)
			const nexEditableEl = editables[index+1]

			if (!nexEditableEl) return;

			const editable = nexEditableEl.__vue__
			editable.setCaretStart()
		},
		setCaretStart () {
			const body = this.$refs.body
			const sel = this.document.getSelection()
			sel.selectAllChildren(body)
			const range = sel.getRangeAt(0)
			range.collapse(true)
			sel.removeAllRanges()
			sel.addRange(range)
			// const range = new Range()
			// range.selectNodeContents(body)
			// this.document.getSelection().removeAllRanges()
			// this.document.getSelection().addRange(range)
		},
		// setCaretEnd () {
		// 	const body = this.$refs.body
		// 	const sel = this.document.getSelection()
		// 	sel.selectAllChildren(body.lastChild)
		// 	const range = sel.getRangeAt(0)
		// 	range.collapse(false)
		// 	sel.removeAllRanges()
		// 	sel.addRange(range)
		// },
		// isCaretEnd () {
		// 	return isCaretEnd(this.document.getSelection(), this.$refs.body)
		// },
		// isCaretStart () {
		// 	return isCaretStart(this.document.getSelection(), this.$refs.body)
		// },

	}
}
</script>

<style>
.editable {
	position: relative;
}

.editable .toolbar {
	font-size: 1rem;
	font-weight: normal;
}

.editable .divider {
	display: inline-block;
	width: 1px;
	border-right: 1px solid #333;
}

.editable-body:focus {
	outline: none;
}

.fake-ref {
	position: absolute;
	left: 0;
	top: 0;
	visibility: hidden;
}

.toolbar {
	display: inline-flex;
	background: #121212;
	border-radius: 3px;
	z-index: 101;
	padding: 8px 12px;
	color: #e4e4e4;
}

.toolbar .toolbar-arrow {
    width: 0;
    height: 0;
    border-style: solid;
    position: absolute;
    margin: 5px;
    border-color: #121212;
    z-index: 1;
}

.toolbar[x-placement^="bottom"] {
	margin-top: 5px;
}

.toolbar[x-placement^="bottom"] .toolbar-arrow {
    border-width: 0 5px 5px 5px;
    border-left-color: transparent !important;
    border-right-color: transparent !important;
    border-top-color: transparent !important;
    top: -5px;
    left: calc(50% - 5px);
    margin-top: 0;
    margin-bottom: 0;
}

.toolbar[x-placement^="top"] {
	margin-bottom: 5px;
}

.toolbar[x-placement^="top"] .toolbar-arrow {
    border-width: 5px 5px 0 5px;
    border-left-color: transparent !important;
    border-right-color: transparent !important;
    border-bottom-color: transparent !important;
    bottom: -5px;
    left: calc(50% - 5px);
    margin-top: 0;
    margin-bottom: 0;
}

.toolbar > button {
	background: none;
    border: none;
    cursor: pointer;
    padding: 3px 5px;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: center;
	outline: none;
	color: #ccc;
	font-size: .9em;
	line-height: .9em;
}

.toolbar > button.button-icon {
    height: 24px;
    width: 28px;
}

.toolbar > button:hover,
.toolbar > button:focus,
.toolbar > button.ca-active,
.ca-active {
	color: #fff
}

.toolbar > button svg {
	width: 100%;
	height: 100%;
}

.toolbar > button:hover .ca-stroke,
.toolbar > button:focus .ca-stroke,
.toolbar > button.ca-active .ca-stroke,
.ca-active .ca-stroke 	{
	stroke: #fff
}

.link-toolbar {
	display: flex;
}

.link-toolbar > * {
	margin-right: 5px;
}

.ca-active .ca-fill {
	fill: #fff;
}

.ca-stroke {
	fill: none;
	stroke: #ccc;
	stroke-linecap: round;
	stroke-linejoin: round;
	stroke-width: 2;
}

.ca-thin, .ca-stroke.ca-thin {
    stroke-width: 1;
}

.ca-fill, .ca-stroke.ca-fill {
    fill: #ccc;
}

.ca-even {
    fill-rule: evenodd;
}

.placeholder[placeholder] {
	position: relative;
}

.placeholder[placeholder]:before {
	position: absolute;
    content: attr(placeholder);
	font-style: italic;
	opacity: .5;
    padding: inherit;
    margin: inherit;
}
</style>