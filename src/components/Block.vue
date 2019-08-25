<template>
    <div 
        style="position: relative"
        class="block"
        :class="{ 'show-background': showBg || (isPopoverActive && !separatedPopover) }"
        ref="block"
        @mouseenter="showToolbar = true"
        @mouseleave="showToolbar = false">

        <component :is="component.viewComponent" :value="value" />

        <transition name="fade">
            <div class="control" v-show="showToolbar || (isPopoverActive && !separatedPopover)" @mouseenter="showBg = true" @mouseleave="showBg = false">
                <ui-button
                    square
                    v-tooltip="'Move down'"
                    @click="moveBlockDown"
                    :disabled="disableMoveDown"
                >
                    ↓
                </ui-button>

                <ui-button
                    square
                    v-tooltip="'Move up'"
                    @click="moveBlockUp"
                    :disabled="disableMoveUp">
                    ↑
                </ui-button>

                <ui-button
                    square
                    v-tooltip="'Remove'"
                    @click="removeBlock"
                    class="ui-button--remove"
                    :class="{ 'ui-button--remove-active ui-button--danger': showRemove }">
                    ✕
                    <div style="display: inline-block" v-show="showRemove">
                        Remove
                    </div>
                </ui-button>

                <template>
                    <v-popover
                        ref="popper"
                        popoverWrapperClass="vue-ui-dark-mode settings-panel"
                        offset="8"
                        placement="right-start"
                        :autoHide="autoHide"
                        @show="isPopoverActive = true"
                        @hide="popoverHideHandler"
                        :popperOptions="popperOptions"
                        >
                        <ui-button :active="isPopoverActive" square v-tooltip="'Settings'" class="settings-button">
                            ⋮
                        </ui-button>

                        <!-- This will be the content of the popover -->
                        <template slot="popover">
                            <div ref="draggable" @mousedown="mousedownHandler" class="settings-panel-header">
                                SETTINGS
                                <transition name="fade">
                                    <a v-close-popover v-show="separatedPopover" v-tooltip="'Close the window'">✕</a>
                                </transition>
                            </div>
                            <div class="settings-panel-body">
                                <div class="form-control">
                                    <span style="grid-column: 1 / -1">General Settings</span>
                                    <VueButton @click="duplicate" style="grid-colomn: 1/-1">Duplicate</VueButton>
                                    <span style="grid-column: 1 / -1">Custom Settings</span>
                                    <component :is="component.settingsComponent" :value="value" />
                                </div>
                            </div>
                        </template>
                    </v-popover>
                </template>

            </div>
        </transition>
    </div>
</template>

<script>
import { Button } from '@contentarchitect/base'
import { VTooltip, VPopover, VClosePopover } from 'v-tooltip'


export default {
    props: {
        value: {
            type: Object,
        },
        component: {
            type: Function
        },
        disableMoveUp: {
            type: Boolean,
            default: false
        },
        disableMoveDown: {
            type: Boolean,
            default: false
        }
    },
    components: {
        [Button.name]: Button,
        "v-popover": VPopover,
    },
    directives: {
        tooltip: VTooltip,
        closePopover: VClosePopover
    },
    data () {
      return {
            showBg: false,
            showToolbar: false,
            isPopoverActive: false,
            showRemove: false,
            autoHide: true,
            popperOptions: null,
            dragged: false,
            separatedPopover: false,
            popperPos: {
                x: 0,
                y: 0
            },
            startDragPos: {
                x: 0,
                y: 0
            }
        }
    },
    created () {
        var _this = this;

        this.popperOptions = {
            modifiers: {
                deneme: {
                    enabled: true,
                    order: 849,
                    fn (data) {
                        _this.popperPos.x = data.offsets.popper.left;
                        _this.popperPos.y = data.offsets.popper.top;

                        if (!_this.separatedPopover) {
                            return data;
                        }
                    }
                } 
            }
        }
    },
    mounted () {
        this.$refs.popper.$refs.popover.addEventListener('mouseenter', _ => {
            this.showBg = true;
        });

        this.$refs.popper.$refs.popover.addEventListener('mouseleave', _ => {
            this.showBg = false;
        });
    },
    methods: {
        duplicate () {
            this.$emit('duplicate', this.value);
        },
        moveBlockDown () {
            this.$emit('move-block-down', this.value)
        },
        moveBlockUp () {
            this.$emit('move-block-up', this.value)
        },
        removeBlock () {
            if (this.showRemove) {
                this.$emit('remove-block', this.value)
            } else {
                this.showRemove = true;
            }
        },
        popoverHideHandler () {
            this.isPopoverActive = false;
            this.autoHide = true;
            this.separatedPopover = false;

            // popover kapatilirken okun gorunmesini onlemek icin.
            setTimeout(_ => {
                this.showPopoperArrow()
            }, 100)
        },
        mousedownHandler (event) {
            this.startDragPos.x = event.pageX;
            this.startDragPos.y = event.pageY;
            window.addEventListener("mousemove", this.mousemoveHandler);
            window.addEventListener("mouseup", this.mouseupHandler);
            this.hidePopoverArrow();
            this.autoHide = false;
            this.separatedPopover = true;
        },
        mousemoveHandler (event) {
            let transform = { x: 0, y: 0 };

            transform.x = this.popperPos.x + event.pageX - this.startDragPos.x;
            transform.y = this.popperPos.y + event.pageY - this.startDragPos.y;

            this.$refs.popper.$refs.popover.style.transform = `translate(${transform.x}px, ${transform.y}px)`
        },
        mouseupHandler () {
            window.removeEventListener("mousemove", this.mousemoveHandler);
            window.removeEventListener("mouseup", this.mouseupHandler);
            const mat = new WebKitCSSMatrix(this.$refs.popper.$refs.popover.style.transform);
            this.popperPos.x = mat.e;
            this.popperPos.y = mat.f;
        },
        hidePopoverArrow () {
            this.$refs.popper.$refs.arrow.hidden = true;
        },
        showPopoperArrow () {
            this.$refs.popper.$refs.arrow.hidden = false;
        }

    },
    watch: {
      showToolbar () {
        if (!this.showToolbar && this.showRemove) {
          this.showRemove = false
        }
      },
    }
}
</script>

<style>
@import "../assets/popover.custom.css"; 

.tooltip.popover .popover-inner {
  background: #121212;
  border-radius: 3px;
}

.tooltip.popover .popover-arrow {
  border-color: #121212;
}

.block::before {
    content: '';
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    position: absolute;
    z-index: -1;
}

.show-background::before, .block:hover::before {
  background-color: azure;
}

.slide-leave-active,
.slide-enter-active {
  transition: .2s;
}
.slide-enter {
  transform: translate(100%, 0);
}
.slide-leave-to {
  transform: translate(-100%, 0);
}

.control {
    position: absolute;
    right: 0;
    top: 0;
    width: 200px;
    display: flex;
    justify-content: flex-end;
    z-index: 100;
}

.control > .ui-button {
    margin-right: 5px;
}

.settings-button {
    width: 24px !important;
}

.settings-panel.vue-ui-dark-mode {
    background: #121212;
    border-radius: 3px;
}

.settings-panel {
    /* padding: 10px; */
    width: 200px;
}

.settings-panel > .tooltip-inner.popover-inner {
    padding: 0 !important;
}

.settings-panel-header {
    user-select: none;
    border-radius: 3px 3px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 8px;
    border-bottom: 1px solid #000;
    background: #323232;
    line-height: 16px;
}

.settings-panel-body {
    padding: 8px 8px 20px;
}

.ui-button--remove {
    transition: width .2s;
    justify-content: flex-start;
}

.ui-button--remove.ui-button--remove-active {
    width: 100px !important;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .2s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.vue-ui-input {
    min-width: 70px !important;
}


.form-control {
    display: grid;
    gap: 8px 0;
    grid-template-columns: 1fr 2fr;
}

.form-control label {
    display: flex;
    align-items: center;
}
</style>