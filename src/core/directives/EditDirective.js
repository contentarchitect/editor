import Util from "../scripts/Util.js"
import DirectiveUtil from "../scripts/DirectiveUtil.js"

function selectStartHandler () {
	document.addEventListener("selectionchange", selectionChangeHandler.bind(this))
}

function selectionChangeHandler (e) {
	this.appComponent.updateCommandStatus();

	let selection = this.document.getSelection();
	if (selection.rangeCount == 0 || !this.el.contains(selection.anchorNode)) return;

	if (selection.getRangeAt(0).collapsed) {
		this.appComponent.hideEditableToolbar()	
		return;
	}
	const currentRange = this.document.getSelection().getRangeAt(0);
	this.appComponent.showEditableToolbar(
		selection.getRangeAt(0),
		{ 
			currentRange, 
			isBlock: this.isBlock
		}
	);
}

function changeHandler (event) {
	if (
		this.isBlock
		&& this.el.children.length == 0
	) {
			const p = document.createElement("p")
			p.innerHTML = this.el.innerHTML;
			this.el.innerHTML = '';
			this.el.appendChild(p)
	}
		
	if (
		this.isBlock
		&& this.el.children.length == 1
		&& this.el.children[0].tagName == "P"
		&& this.el.children[0].children.length == 0
	) {
		const br = document.createElement("br")
		this.el.children[0].appendChild(br)
	}		

	if (this.config.placeholder) {
		if (
			this.el.innerText.trim() != ""
		) {
			this.el.classList.remove('show-placeholder')
		} else if (
			this.isBlock
			&& this.el.children.length > 1
		) {
			this.el.classList.remove('show-placeholder')
		} else if (
			this.isBlock
			&& this.el.children.length == 1
			&& this.el.children[0].innerText.trim() == ""
		) {
			this.el.classList.add('show-placeholder')
		} else if (
			!this.isBlock
			&& this.el.innerText.trim() == ""
		) {
			this.el.classList.add('show-placeholder')
		}
	}

	if (this.binding.modifiers.complex) {
		this.binding.value.obj[this.binding.value.exp] = this.el.innerHTML
	} else {
		DirectiveUtil.setValue(this.vnode.context, this.binding.expression, this.el.innerHTML);
	}
}

function pasteHandler (event) {
	let paste = (event.clipboardData || window.clipboardData).getData('text');
	paste = paste.replace(/\n\s*\n/g, '\n');
	document.execCommand("insertText", false, paste);
	event.preventDefault();
}

function keydownHandler (e) {
	if (e.which === 13 && !this.isBlock) {
		// if (this.isLastEditableInView()) {
		// 	let block = this;

		// 	while(block.$options.name != "Block") {
		// 		block = block.$parent
		// 	}

		// 	this.addParagraphBlockAfter(block)
		// }

		e.preventDefault();
	} else if (e.which == 13 && this.isBlock && !e.shiftKey) {
		// setTimeout(() => {
		// 	document.execCommand('formatBlock', false, 'p');
		// }, 0)
		// e.preventDefault()
	} else if (e.which === 8) {
		const range = this.document.getSelection().getRangeAt(0)

		if (
			false &&
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
}

function changeToBlock () {
	if (
		this.isBlock
		&& !isFirstElementParagraph(this.el.childNodes)
	) {
		const p = takeToParagraph(this.el)
		this.el.insertBefore(p, this.el.firstChild)
	}
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

function changeChildListToP (editable) {
	for (let childDom of editable.childNodes) {
		if (childDom.nodeType == Node.ELEMENT_NODE && childDom.tagName == "DIV") {
			changeDomTagName(childDom, "p")
		} else if (childDom.nodeType == Node.ELEMENT_NODE && childDom.tagName == "BR") {
			childDom.remove()
		} else if (childDom.nodeType == Node.TEXT_NODE && childDom.textContent.trim() != "") {
			wrapTextNodeWithTag(childDom, "p")
		}
	}
}

// https://stackoverflow.com/a/15086834/7663430
function changeDomTagName (dom, tagName) {
	const newDom = document.createElement(tagName);
   
	// Copy the children
	while (dom.firstChild) {
		newDom.appendChild(dom.firstChild); // *Moves* the child
	}
  
	// Copy the attributes
	for (let index = dom.attributes.length - 1; index >= 0; --index) {
		newDom.attributes.setNamedItem(dom.attributes[index].cloneNode());
	}
  
	// Replace it
	dom.parentNode.replaceChild(newDom, dom);
}
  
function wrapTextNodeWithTag (textNode, tagName) {
	const dom = document.createElement(tagName)
	dom.appendChild(textNode.cloneNode())
	textNode.parentNode.replaceChild(dom, textNode)
}

function focusHandler (event) {
	this.vnode.context.$emit('focus')
}

function blurHandler (event) {
	this.vnode.context.$emit('blur')
}

function fixFirefoxBug () {
	if (!Util.isFirefox()) return
	const x = window.scrollX,
		  y = window.scrollY
	document.getElementById("firefoxindicator").focus()
	window.scrollTo(x, y)
}


export default {
	bind (el, binding, vnode) {
		const self = { 
			el, 
			binding,
			vnode,
			isBlock: !!binding.modifiers.block,
			config: binding.arg || {}
		}

		setTimeout(() => {
			
			let doc = document;
			if (Util.isFirefox()) {
			} else {
				doc = el.getRootNode() || document;
			}
			self.document = doc

			changeHandler.bind(self)()
			changeToBlock.bind(self)()
	
			if (self.isBlock) {
				changeChildListToP(el);
				self.observer = new MutationObserver(() => {
					changeChildListToP(el);
					const range = self.document.getSelection().getRangeAt(0)
					if (range.startContainer == self.el) {
						range.setStart(self.el.firstElementChild, 0)
					}
				});	
	
				self.observer.observe(self.el, { childList: true });
			}
		}, 0)


		el.classList.add("editable-body")

		if (self.isBlock) {
			el.classList.add("editable-block")
		}

		if (self.config.placeholder) {
			el.setAttribute("placeholder", self.config.placeholder)
		}

		if (binding.modifiers.complex) {
			el.innerHTML = binding.value.obj[binding.value.exp]
		} else {
			el.innerHTML = DirectiveUtil.getValue(vnode.context, binding.expression);
		}

		let appComponent = vnode.context;
		while (appComponent.$options.name != "ContentArchitect" && appComponent.$parent) {
			appComponent = appComponent.$parent
		}

		self.appComponent = appComponent

		el.contentEditable = true;
		el.setAttribute("spellcheck", false);
		el.addEventListener("selectstart", selectStartHandler.bind(self))
		el.addEventListener("input", changeHandler.bind(self))
		el.addEventListener("keydown", keydownHandler.bind(self))
		el.addEventListener("paste", pasteHandler)
		el.addEventListener("focus", focusHandler.bind(self))
		el.addEventListener("blur", blurHandler.bind(self))
		el.addEventListener("mousedown", fixFirefoxBug)
	},
}