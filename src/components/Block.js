import Util from "@/scripts/Util";

export default class Block {
    get id () {
        return this._id || (this._id = Util.generateID())
    }

    static get viewComponent () {
    }

    static get settingsComponent () {
    }

    static get settings () {
        if (!this._settings) this.setSettings();
        return this._settings;
    }

    static set settings (settings) {
        this._settings = { ...this.defaultSettings, ...settings };
    }

    static setSettings (settings) {
        this.settings = settings || {};
    }
}