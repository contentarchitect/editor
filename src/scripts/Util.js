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

}