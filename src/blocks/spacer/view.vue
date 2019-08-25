<template>
    <div :style="{ height: value.height + 'px' }" class="spacer">
        <div class="spacer-handle" @mousedown="spacerMousedownHandler">
            <transition name="fade">
                <span v-if="resizing">{{ value.height }} px</span>
            </transition>
        </div>
    </div>
</template>

<script>
export default {
    props: ['value'],
    data () {
        return {
            startPosition: 0,
            resizing: false,
            startHeight: null,
        }
    },
    methods: {
        spacerMousedownHandler (e) {
            this.startPosition = e.pageY;
            this.startHeight = this.value.height;
            this.resizing = true;

            window.addEventListener("mousemove", this.resizeHandler)
            window.addEventListener("mouseup", this.endResizeHandler)
        },
        resizeHandler (e) {
            this.value.height = this.startHeight + e.pageY - this.startPosition;
        },
        endResizeHandler () {
            this.resizing = false;

            window.removeEventListener("mousemove", this.resizeHandler)
            window.removeEventListener("mouseup", this.endResizeHandler);
        }
    },
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