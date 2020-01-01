import { Blocks } from '@contentarchitect/core'

import Wysiwyg from './wysiwyg/main.js'
import Image from "./image/main.js"
import Spacer from "./spacer/main.js"
import Divider from "./divider/main.js"
import Table from "./table/main.js"
import Quote from "./quote/main.js"
import Code from './code/main.js'
import Header from '@contentarchitect/header'
import Toc from './toc/main.js'

import './wysiwyg/theme.extract.css'
import "./image/theme.extract.css"
import "./spacer/theme.extract.css"
import "./divider/theme.extract.css"
import "./table/theme.extract.css"
import "./quote/theme.extract.css"
import './code/theme.extract.css'
import '@contentarchitect/header/src/theme.extract.css'
import './toc/theme.extract.css'

Blocks.register(Wysiwyg)
Blocks.register(Image)
Blocks.register(Spacer)
Blocks.register(Divider)
Blocks.register(Table)
Blocks.register(Quote)
Blocks.register(Header)
Blocks.register(Code)
Blocks.register(Toc)

export {
    Wysiwyg,
    Image,
    Spacer,
    Divider,
    Table,
    Quote,
    Code,
    Header,
    Toc
}