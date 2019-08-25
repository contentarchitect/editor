<template>
    <block
        ref="block"
        :ind="ind"
        :disable-move-up="ind == 0"
        :disable-move-down="ind == blocks.length - 1">

        <template slot="view">
            <div :style="{ height: height + 'px' }" class="spacer">

                <div class="spacer-handle" @mousedown="spacerMousedownHandler">
                    <transition name="fade">
                        <span v-if="resizing">{{ height }} px</span>
                    </transition>
                </div>
            </div>
        </template>

        <template slot="conf">
            <label for="">Height</label>
            <vue-input v-model="height" type="number" />
        </template>
    </block>
</template>

<script>
import { Block, Editable } from "@contentarchitect/base"
import { quillEditor } from 'vue-quill-editor'

export default {
    mixins: [Block],
    created () {
        debugger;
    },
    data () {
        return {
            height: 50,
            startPosition: 0,
            resizing: false,
            startHeight: null,
        }
    },
    methods: {
        spacerMousedownHandler (e) {
            this.startPosition = e.pageY;
            this.startHeight = this.height;
            this.resizing = true;

            window.addEventListener("mousemove", this.resizeHandler)
            window.addEventListener("mouseup", this.endResizeHandler)
        },
        resizeHandler (e) {
            this.height = this.startHeight + e.pageY - this.startPosition;
        },
        endResizeHandler () {
            this.resizing = false;

            window.removeEventListener("mousemove", this.resizeHandler)
            window.removeEventListener("mouseup", this.endResizeHandler);
        },
        renderedHtml () {
            return `<div style="height: ${this.height}px"></div>`
        }
    },
    components: {
        
    }
}
</script>

<style>
.spacer {
    position: relative;
}

.spacer:hover .spacer-handle {
    background-color: #ddd;
}

.spacer-handle {
    position: absolute;
    height: 10px;
    left: 0;
    right: 0;
    bottom: 0;
    cursor: n-resize;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
