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
    window.Contentarchitect = {
        Editor
    }
}

export {
    Editor,
    Blocks,
}