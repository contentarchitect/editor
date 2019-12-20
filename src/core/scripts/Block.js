import Util from "./Util.js";

export default class Block {
	constructor (domOrObject) {
		let obj, classes;
		
		if (Util.isElement(domOrObject)) {
			obj = this.constructor.serializeFromHTML(domOrObject)
			classes = this.constructor.getCssClassesFromDoc(domOrObject)
			return new this.constructor({ classes, ...obj })
		} else {
			obj = domOrObject;
			Object.assign(this, this.constructor.defaultData, obj)
			this.classes = this.classes || []
		}
	}

	static defaultData = {}
	static defaultSettings = {}

	static setSettings (set) {
		this._settings = this._settings || {}
		Object.assign(this._settings, this.defaultSettings, set)
	}

	static get settings () {
		if  (!this._settings) this.setSettings({})
		return this._settings;
	}
	
	get id () {
		return this._id || (this._id = Util.generateID())
	}

	set id (id) {
		this._id = id
	}

	static get viewComponent () {
	}

	static get settingsComponent () {
	}

	static toString () {
	}

	get dataset () {
		return {}
	}

	cloneSelf () {
		const cloned = Object.assign(Object.create(Object.getPrototypeOf(this)), this)
		cloned.id = Util.generateID()
		return cloned
	}

	static getCssClassesFromDoc (doc) {
		return [...doc.classList]
	}
}