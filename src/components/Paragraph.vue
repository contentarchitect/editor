<template>
    <block
        ref="block"
        :ind="ind"
        :disable-move-up="ind == 0"
        :disable-move-down="ind == blocks.length - 1">

        <template slot="view">
            <quill-editor
                v-model="value.content"
                :options="editorOptions" />
        </template>

        <template slot="conf">
            Her hangi bir ayar yok.
        </template>
    </block>
</template>

<script>
import Block from "@/mixins/Block.js"
import { quillEditor } from 'vue-quill-editor'

export default {
    mixins: [Block],
    components: {
        quillEditor
    },
    data () {
        return {
            editorOptions: {
                theme: "bubble",
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'code-block'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        [{ 'color': [] }, { 'background': [] }],
                        [{ 'align': [] }],
                    ],
                    keyboard: {
                        bindings: {
                            // enter: {
                            // key: 13,
                            // handler (range, context) {
                            //     vue.$emit('enter')
                            //     return false
                            // }
                            // }
                        },
                    }
                }
            }
        }
    },
    methods: {
        renderedHtml () {
            return this.value.content
        }
    }
}
</script>

<style>
@import '../assets/quill.bubble.custom.css';

.ql-container, .ql-editor {
    height: auto;
}

.ql-bubble .ql-tooltip {
  border-radius: 3px;
  background-color: #121212;
}

.ql-bubble .ql-tooltip:not(.ql-flip) .ql-tooltip-arrow {
  border-bottom-color: #121212;
}

.ql-tooltip {
  z-index: 1;
}

.ql-clipboard {
  display: none;
}
</style>