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
}