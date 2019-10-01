import Vue from 'vue'
import VueUi from '@vue/ui'
import App from './App.vue'
import Blocks from '@/scripts/Blocks.js'
import Editor from '@/scripts/Editor.js'

Vue.config.productionTip = false
Vue.use(VueUi)

import Header from '@contentarchitect/header'
import Title from "@/blocks/title/main.js"
import Image from "@/blocks/image/main.js"
import Spacer from "@/blocks/spacer/main.js"
import Divider from "@/blocks/divider/main.js"
import Table from "@/blocks/table/main.js"
Blocks.register(Header, {
  levels: [1,2]
})
Blocks.register(Title)
Blocks.register(Image)
Blocks.register(Spacer)
Blocks.register(Divider)
Blocks.register(Table)

export {
  Editor,
  App as EditorComponent,
  Blocks
}