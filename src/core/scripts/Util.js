export default class Util {
	static generateID(len, type) {
		if (typeof len === 'undefined') len = 8
		if (typeof type === 'undefined') type = 'alphanumeric'

		let chars
		if (type === 'alphanumeric') chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
		else if (type === 'numeric') chars = '0123456789'

		const clen = chars.length
		let r = ""
		for (let i = 0; i < len; i++) {
			r += chars[Math.floor(Math.random() * clen)]
		}
		return r
	}

	/**
	* Get all of an element's parent elements up the DOM tree until a matching parent is found
	* @param  {Node}   elem     The element
	* @param  {String} parent   The selector for the parent to stop at
	* @param  {String} selector The selector to filter against [optionals]
	* @return {Array}           The parent elements
	*/
	static getParentsUntil ( elem, parent, selector ) {
		let root = elem.getRootNode();
		// Element.matches() polyfill
		if (!Element.prototype.matches) {
			Element.prototype.matches =
				Element.prototype.matchesSelector ||
				Element.prototype.mozMatchesSelector ||
				Element.prototype.msMatchesSelector ||
				Element.prototype.oMatchesSelector ||
				Element.prototype.webkitMatchesSelector ||
				function(s) {
					const matches = (this.document || this.ownerDocument || this.getRootNode()).querySelectorAll(s);
					let i = matches.length;
					while (--i >= 0 && matches.item(i) !== this) {}
					return i > -1;
				};
		}

		// Setup parents array
		let parents = [];

		// Get matching parent elements
		for ( ; elem && elem !== root; elem = elem.parentNode ) {

			if ( parent ) {
				if ( elem.matches( parent ) ) break;
			}

			if ( selector ) {
				if ( elem.matches( selector ) ) {
					parents.push( elem );
				}
				break;
			}

			parents.push( elem );

		}

		return parents;

	}


	static isObject (obj) {
		return Object.prototype.toString.call(obj) === "[object Object]"
	}

	static isObjectEmpty (obj) {
		return Object.keys(obj).length === 0 && obj.constructor === Object
	}

	// https://stackoverflow.com/a/384380/7663430
	// Returns true if it is a DOM node
	static isNode(o){
		return (
			typeof Node === "object" ? o instanceof Node : 
			o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string"
		);
	}

	// Returns true if it is a DOM element
	static isElement(o){
		return (
			typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
			o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName === "string"
		);
	}

	static intersectionOf (array1, array2) {
		return array1.filter(value => array2.includes(value))
	}

	static toKebabCase (str) {
		return str &&
			str.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
				.map(x => x.toLowerCase())
				.join('-');
	}

	static cloneBlock (block) {
		const clonedBlock = Object.assign(Object.create(Object.getPrototypeOf(block)), block)
		clonedBlock.id = Util.generateID()
		return clonedBlock
	}

	static isFirefox () {
		return typeof InstallTrigger !== 'undefined';
	}

}