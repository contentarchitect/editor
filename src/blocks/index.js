import { Blocks } from '@contentarchitect/editor'
import Wysiwyg from '@/blocks/wysiwyg/main.js'
import Title from "@/blocks/title/main.js"
import Image from "@/blocks/image/main.js"
import Spacer from "@/blocks/spacer/main.js"
import Divider from "@/blocks/divider/main.js"
import Table from "@/blocks/table/main.js"
import Quote from "@/blocks/quote/main.js"
import Header from '@contentarchitect/header'

Blocks.register(Wysiwyg)
Blocks.register(Title)
Blocks.register(Image)
Blocks.register(Spacer)
Blocks.register(Divider)
Blocks.register(Table)
Blocks.register(Quote)
Blocks.register(Header)