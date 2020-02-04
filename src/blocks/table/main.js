import { Block } from "@contentarchitect/core"
import view from "./view.vue"
import settings from "./settings.vue"
import icon from "./icon.svg"

export default class Table extends Block {
    static get viewComponent () {
        return view;
    }

    static get settingsComponent () {
        return settings;
    }

    static get icon () {
        return icon;
    }

    static defaultData () {
		return {
            caption: "",
            thead: false,
            data: [
                [
                    { value: "" },
                    { value: "" },
                ],
                [
                    { value: "" },
                    { value: "" },
                ],
            ]
        }
    }
    
    toHTML () {
        let thead = this.thead && [this.data[0]].reduce((acc, row) => {
            return acc + "<tr>" + row.reduce((acc, col) => `${acc}\n<th>${col.value}</th>`, "") + "</tr>"
        }, "");
        
        let tbodyArray = this.thead ? this.data.slice(1, this.data.length) : this.data
        
        let tbody = tbodyArray.reduce((acc, row) => {
            return acc + "<tr>" + row.reduce((acc, col) => `${acc}\n<td>${col.value}</td>`, "") + "</tr>"
        }, "");
        
        if (thead) {
            thead = `<thead>${thead}</thead>`
            tbody = `<tbody>${tbody}</tbody>`
        } else {
            thead = ''
        }

        return `<table>
            <caption>${this.caption}</caption>
            ${thead}
            ${tbody}
        </table>`
    }
}