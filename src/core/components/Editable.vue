<template>
	<div style="position: relative">
		<on-event-outside :do="close" event="mousedown">
			<transition name="fade">
				<div ref="toolbar" class="toolbar" v-show="isOpenToolbar" >
					<template v-if="showCreateLink">
						<div class="link-toolbar">
							<CaInput v-model="selectionLinkUrl" />
							<CaButton @click="createLink">Add</CaButton>
							<div class="link-divider"></div>
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

						<button v-if="this.block" @click.prevent="command('insertOrderedList')" class="button-icon" :class="{ 'ca-active': commandStatus.insertorderedlist }" type="button" tabindex="-1">
							<svg viewBox="0 0 18 18">
								<line class="ca-stroke" x1="7" x2="15" y1="4" y2="4"></line>
								<line class="ca-stroke" x1="7" x2="15" y1="9" y2="9"></line>
								<line class="ca-stroke" x1="7" x2="15" y1="14" y2="14"></line>
								<line class="ca-stroke ca-thin" x1="2.5" x2="4.5" y1="5.5" y2="5.5"></line>
								<path class="ca-fill" d="M3.5,6A0.5,0.5,0,0,1,3,5.5V3.085l-0.276.138A0.5,0.5,0,0,1,2.053,3c-0.124-.247-0.023-0.324.224-0.447l1-.5A0.5,0.5,0,0,1,4,2.5v3A0.5,0.5,0,0,1,3.5,6Z"></path>
								<path class="ca-stroke ca-thin" d="M4.5,10.5h-2c0-.234,1.85-1.076,1.85-2.234A0.959,0.959,0,0,0,2.5,8.156"></path>
								<path class="ca-stroke ca-thin" d="M2.5,14.846a0.959,0.959,0,0,0,1.85-.109A0.7,0.7,0,0,0,3.75,14a0.688,0.688,0,0,0,.6-0.736,0.959,0.959,0,0,0-1.85-.109"></path>
							</svg>
						</button>

						<button v-if="this.block" @click.prevent="command('insertUnorderedList')" class="button-icon" :class="{ 'ca-active': commandStatus.insertunorderedlist }" type="button" tabindex="-1">
							<svg viewBox="0 0 18 18">
								<line class="ca-stroke" x1="6" x2="15" y1="4" y2="4"></line>
								<line class="ca-stroke" x1="6" x2="15" y1="9" y2="9"></line>
								<line class="ca-stroke" x1="6" x2="15" y1="14" y2="14"></line>
								<line class="ca-stroke" x1="3" x2="3" y1="4" y2="4"></line>
								<line class="ca-stroke" x1="3" x2="3" y1="9" y2="9"></line>
								<line class="ca-stroke" x1="3" x2="3" y1="14" y2="14"></line>
							</svg>
						</button>

						<button @click.prevent="command('code')" class="button-icon" :class="{ 'ca-active': commandStatus.code }" type="button" tabindex="-1">
							<svg viewBox="0 0 18 18">
								<polyline class="ca-even ca-stroke" points="5 7 3 9 5 11"></polyline>
								<polyline class="ca-even ca-stroke" points="13 7 15 9 13 11"></polyline>
								<line class="ca-stroke" x1="10" x2="8" y1="5" y2="13"></line>
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
import { createPopper } from '@popperjs/core'
import OnEventOutside from "./OnEventOutside.vue"
import Util from "../scripts/Util.js"
import CaInput from "./CaInput.vue"
import Button from "./Button.vue"
import yaz from "yaz"

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

export default {
	name: "Editablee",
	inject: [
		'appSettings',
	],
	props: {
		block: {
			type: Boolean,
			default: true,
		},
		currentRange: {}
	},
	components: { OnEventOutside, CaInput, CaButton: Button },
	data () {
		return {
			popperInstance: null,
			showCreateLink: false,
			isOpenToolbar: false,
			commandStatus: {
				bold: false,
				italic: false,
				underline: false,
				strike: false,
				link: false
			},
			selectionLinkUrl: '',
			showPlaceholder: false,
			observer: null,
		}
	},
	mounted () {
		this.popperInstance = createPopper(
			{ 
				getBoundingClientRect() {
					const domRect = new DOMRect();
					return domRect.toJSON()
				}
			}, // reference
			this.$refs.toolbar, // tooltip
			{
				placement: 'bottom',
				modifiers: [
					{
						name: 'offset',
						options: {
							offset: [0, 7]
						}
					}
				]
			}
		);

		// this.changeHandler()
		// this.changeToBlock()

		// if (this.block) {
		// 		changeChildListToP(this.$refs.body);
		// 	this.observer = new MutationObserver(() => {
		// 		changeChildListToP(this.$refs.body);
		// 		const range = document.getSelection().getRangeAt(0)
		// 		if (range.startContainer == this.$refs.body) {
		// 			range.setStart(this.$refs.body.firstElementChild, 0)
		// 		}
		// 	});	

		// 	this.observer.observe(this.$refs.body, { childList: true });
		// }

		this.$once("hook:beforeDestroy", () => {
			this.popperInstance.destroy();
			// document.removeEventListener('selectionchange', this.selectionChangeHandler);
			// if (this.observer) {
			// 	this.observer.disconnect()
			// }
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
		open (range) {
			this.isOpenToolbar = true
			this.$nextTick(() => {
				this.popperInstance.state.elements.reference = range
				this.popperInstance.forceUpdate()
			})
		},
		close () {
			this.isOpenToolbar = false;
			this.showCreateLink = false;
			this.selectionLinkUrl = '';
		},
		command (command, className) {
			const sel = document.getSelection();

			switch(command) {
				case 'bold':
					if (yaz.Range.isWrappedWith("STRONG")) {
						yaz.Range.undo("STRONG")
					} else {
						const element = document.createElement('strong')
						yaz.Range.surround(element)
					}
					break;
				case 'italic':
					if (yaz.Range.isWrappedWith("EM")) {
						yaz.Range.undo("EM")
					} else {
						const element = document.createElement('em')
						yaz.Range.surround(element)
					}
					break;
				case 'underline':
					if (yaz.Range.isWrappedWith("U")) {
						yaz.Range.undo("U")
					} else {
						const element = document.createElement('u')
						yaz.Range.surround(element)
					}
					break;
				case 'strikethrough':
					if (yaz.Range.isWrappedWith("S")) {
						yaz.Range.undo("S")
					} else {
						const element = document.createElement('s')
						yaz.Range.surround(element)
					}
					break;
				case 'p':
					document.execCommand('formatBlock', false, command);
					break;
				case 'createLink':
					this.showCreateLink = true;
					const parentEl = document.getSelection().anchorNode.parentElement;
					if (parentEl.nodeType == 1 && parentEl.tagName === "A") {
						this.selectionLinkUrl = document.getSelection().anchorNode.parentElement.getAttribute("href");
					}
					break;
				case 'inline-class':
					// const selection = document.getSelection()

					// if (!selection.rangeCount) break;

					// if (isSelectedCustomTag(selection, className)) {
					// 	const container = selectedContainer(selection.getRangeAt(0))
					// 	container.classList.remove(className)
					// 	if (!container.classList.length) Util.unWrap(container)
					// 	break;
					// }

					// const span = document.createElement('span');
					// span.classList.add(className);
					// const range = selection.getRangeAt(0);
					// const content = range.extractContents();
					// span.append(content);
					// range.insertNode(span);
					
					if (yaz.Range.isWrappedWithClassName(className)) {
						yaz.Range.undo({ className, tagName: "SPAN" })
					} else {
						const element = document.createElement("span")
						element.classList.add(className)
						yaz.Range.surround(element)
					}
					break;
				case 'insertUnorderedList':
				case 'insertOrderedList':
					document.execCommand(command, false, null)
					if (sel.rangeCount) {
						const range = sel.getRangeAt(0)
						let list;

						list = range.commonAncestorContainer;

						if (list.tagName === "UL" || list.tagName === "OL") {
							
						} else if (command == 'insertOrderedList') {
							list = range.commonAncestorContainer.parentElement.closest('ol')
						} else if (command == 'insertUnorderedList') {
							list = range.commonAncestorContainer.parentElement.closest('ul')
						}

						if (list.parentElement.tagName == "P") {
							Util.unWrap(list.parentElement)
						}
					}
					break;
				case 'code':
					if (sel.rangeCount) {
						const range = sel.getRangeAt(0)
						let code = document.createElement('code');
						range.surroundContents(code);
					}
					break;
				default:
					document.execCommand(command, false, null);
					break;
			}

			this.updateCommandStatus();
		},
		updateCommandStatus () {
			this.commandStatus = {
				...this.commandStatus,
				bold: yaz.Range.isWrappedWith("STRONG"),
				italic: yaz.Range.isWrappedWith("EM"),
				underline: yaz.Range.isWrappedWith("U"),
				strike: yaz.Range.isWrappedWith("S"),
				link: document.queryCommandState("link"),
				insertorderedlist: document.queryCommandState("insertorderedlist"),
				insertunorderedlist: document.queryCommandState("insertunorderedlist"),
				code: true
			}
			
			this.appSettings.inlineClasses.forEach(className => {
				this.commandStatus[className] = yaz.Range.isWrappedWithClassName(className)
			})
		},
		createLink () {
			document.getSelection().removeAllRanges();
			document.getSelection().addRange(this.currentRange);
			document.execCommand('createLink', false, this.selectionLinkUrl);
			this.showCreateLink = false;
			this.updateCommandStatus();
		},
		removeLink () {
			document.execCommand('unlink');
			this.showCreateLink = false;
			this.updateCommandStatus();
		},
	}
}
</script>

<style>
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

.toolbar[data-popper-placement^="bottom"] {
	margin-top: 5px;
}

.toolbar[data-popper-placement^="bottom"] .toolbar-arrow {
    border-width: 0 5px 5px 5px;
    border-left-color: transparent !important;
    border-right-color: transparent !important;
    border-top-color: transparent !important;
    top: -5px;
    left: calc(50% - 5px);
    margin-top: 0;
    margin-bottom: 0;
}

.toolbar[data-popper-placement^="top"] {
	margin-bottom: 5px;
}

.toolbar[data-popper-placement^="top"] .toolbar-arrow {
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
</style>