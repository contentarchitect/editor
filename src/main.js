import Vue from 'vue'
import Blocks from '@/scripts/Blocks.js'
import Editor from '@/scripts/Editor.js'
Vue.config.productionTip = false

import CssGrid from "@/components/CssGrid.vue"
import CssGridItem from "@/components/CssGridItem.vue"
import RadioButtons from "@/components/RadioButtons.vue"
import RadioButton from "@/components/RadioButton.vue"
import CaInput from "@/components/CaInput.vue"
Vue.component("CssGrid", CssGrid);
Vue.component("CssGridItem", CssGridItem);
Vue.component("RadioButtons", RadioButtons);
Vue.component("RadioButton", RadioButton);
Vue.component("CaInput", CaInput);


// Blocks
import Wysiwyg from '@/blocks/wysiwyg/main.js'
import Title from "@/blocks/title/main.js"
import Image from "@/blocks/image/main.js"
import Spacer from "@/blocks/spacer/main.js"
import Divider from "@/blocks/divider/main.js"
import Table from "@/blocks/table/main.js"
import Quote from "@/blocks/quote/main.js"
import Header from '@contentarchitect/header'

Blocks.register(Wysiwyg);
Blocks.register(Title)
Blocks.register(Image)
Blocks.register(Spacer)
Blocks.register(Divider)
Blocks.register(Table)
Blocks.register(Quote)
Blocks.register(Header);


// Custom Element Register
import wrap from '@vue/web-component-wrapper'
import App from '@/App.vue'

const CustomElement = wrap(Vue, App)
window.customElements.define('content-architect', CustomElement)


// new Editor({
//     blockSettings: {
//         Header: {
//             levels: [1,2],
//             defaultLevel: 3
//         },
//         // Spacer: {
//         //     defaultHeight: 50,
//         //     minHeight: 30,
//         //     maxHeight: 100
//         // }
//     }
// });


if (process.env.NODE_ENV === "development") {
    window.ContentArchitect = {
        Editor,
        Blocks
    }
}

export {
    Editor,
    Blocks
}