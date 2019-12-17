import { Blocks } from '@contentarchitect/core'

import Wysiwyg from './wysiwyg/main.js'
import Image from "./image/main.js"
import Spacer from "./spacer/main.js"
import Divider from "./divider/main.js"
import Table from "./table/main.js"
import Quote from "./quote/main.js"
import Code from './code/main.js'
import Header from '@contentarchitect/header'
import Index from './index/main.js'

Blocks.register(Wysiwyg)
Blocks.register(Image)
Blocks.register(Spacer)
Blocks.register(Divider)
Blocks.register(Table)
Blocks.register(Quote)
Blocks.register(Header)
Blocks.register(Code)
Blocks.register(Index)

export {
    Wysiwyg,
    Image,
    Spacer,
    Divider,
    Table,
    Quote,
    Code,
    Header,
    Index
}