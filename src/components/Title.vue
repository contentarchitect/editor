<template>
    <block
        ref="block"
        :ind="ind"
        :disable-move-up="ind == 0"
        :disable-move-down="ind == blocks.length - 1">

        <template slot="view">
            <anchored-heading :level="level">
                <Editable v-model="value.content" />
                <!-- <quill-editor
                    v-model="value.content"
                    :options="editorOptions" /> -->
            </anchored-heading>
        </template>

        <template slot="conf">
            <vue-group v-model="level">
                <vue-group-button :value="1">H1</vue-group-button>
                <vue-group-button :value="2">H2</vue-group-button>
                <vue-group-button :value="3">H3</vue-group-button>
            </vue-group>
            Title ayarlari
        </template>
    </block>
</template>

<script>
import { Block, Editable } from "@contentarchitect/base"
import { quillEditor } from 'vue-quill-editor'

export default {
    mixins: [Block],
    data () {
        return {
            level: 1,
            editorOptions: {
                theme: "bubble",
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'code-block'],
                        [{ 'color': [] }, { 'background': [] }],
                        [{ 'align': [] }],
                    ],
                    keyboard: {
                        bindings: {
                            enter: {
                                key: 13,
                                handler (range, context) {
                                }
                            }
                        }
                    },
                }
            }
        }
    },
    methods: {
        renderedHtml () {
            return `<h${this.level}>${this.value.content}</h${this.level}>`
        }
    },
    watch: {
        level: "renderHtml"
    },
    components: {
        quillEditor,
        Editable,
        'anchored-heading': {
            render: function (createElement) {
                return createElement(
                    'h' + this.level,   // tag name
                    this.$slots.default // array of children
                )
            },
            props: {
                level: {
                    type: Number,
                    required: true
                }
            }
        }
    }
}
</script>
