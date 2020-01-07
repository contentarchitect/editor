import Util from "./Util.js";
import clonedeep from "lodash.clonedeep"

export default class Block {
	constructor (domOrObject) {
		let obj, classes;
		
		if (Util.isElement(domOrObject)) {
			obj = this.constructor.serializeFromHTML(domOrObject)
			classes = this.constructor.getCssClassesFromDoc(domOrObject)
			return new this.constructor({ classes, ...obj })
		} else {
			obj = domOrObject;
			this.classOptions = this.constructor.getInitialClassOptions()
			Object.assign(this, this.constructor.defaultData, obj)
		}
	}

	static defaultData = {}
	static defaultSettings = {}
	static defaultClassOptions = {}
	classes = []

	static setSettings (settings) {
		this._settings = this._settings || {}
		this._classOptions = this._classOptions || {}
		const { classOptions, ...sets } = settings
		Object.assign(this._classOptions, this.defaultClassOptions, classOptions)
		Object.assign(this._settings, this.defaultSettings, sets)
	}

	static get settings () {
		if (!this._settings) this.setSettings({})
		return this._settings;
	}

	static get classOptions () {
		if  (!this._classOptions) this.setSettings({ classOptions: {} })
		return this._classOptions;
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

	get dataset () {
		return {}
	}

	static getInitialClassOptions () {
		const options = {}

		Object.keys(this.classOptions).forEach(key => {
			if (typeof this.classOptions[key] === "string") {
				options[key] = false
			} else if (Util.isObject(this.classOptions[key])) {
				options[key] = ""
			}
		})

		return options;
	}

	cloneSelf () {
		const cloned = clonedeep(this)
		cloned.id = Util.generateID()
		return cloned
	}

	static getCssClassesFromDoc (doc) {
		return [...doc.classList]
	}
}