<template>
  <div style="position: relative" class="block" ref="block" @mouseenter="showToolbar = true" @mouseleave="showToolbar = false" :class="{ 'show-background': showBg || isPopoverActive }">
    <Contenteditable
        v-model="value.content"
        @add-new-block="addNewBlock()"
        @remove-block="removeBlck()"
        @move-caret-up="moveCaretUp"
        @move-caret-down="moveCaretDown"
        ref="contenteditable" />
    <transition name="fade">
        <div class="control" v-show="isPopoverActive || showToolbar" @mouseenter="showBg = true" @mouseleave="showBg = false">
            <ui-button
                square
                @click="moveDown"
                :disabled="blocks.length - 1 == ind"
            >
                ↓
            </ui-button>

            <ui-button
                square
                @click="moveUp"
                :disabled="ind == 0">
                ↑
            </ui-button>
            <!-- <ui-button-group>

            </ui-button-group> -->

            <ui-button
                square
                @click="removeBlock"
                class="ui-button--remove"
                :class="{ 'ui-button--remove-active ui-button--danger': showRemove }">
                ✕
                <div style="display: inline-block" v-show="showRemove">
                    Remove
                </div>
            </ui-button>


            <v-popover
                class="settings-panel"
                offset="8"
                placement="right"
                @show="isPopoverActive = true"
                @hide="isPopoverActive = false"
                >
                <ui-button :active="isPopoverActive" square>
                    &hellip;
                </ui-button>

                <!-- This will be the content of the popover -->
                <template slot="popover">
                    Deneme
                </template>
            </v-popover>

        </div>
    </transition>
  </div>
</template>

<script>
import Contenteditable from "@/components/Contenteditable"
import Button from '@/components/Button'
import ButtonGroup from '@/components/ButtonGroup'
import { VPopover } from 'v-tooltip'
import Util from '@/scripts/Util.js'

export default {
    props: {
        value: Object,
        blocks: Array,
        ind: Number,
    },
    data () {
      return {
            showBg: false,
            showToolbar: false,
            isPopoverActive: false,
            showRemove: false
        }
    },
    created () {
        this.value.__component = this
    },
    methods: {
        moveDown () {
            this.blocks.splice(this.ind + 1, 0, this.blocks.splice(this.ind, 1)[0]);
        },
        moveUp () {
            this.blocks.splice(this.ind - 1, 0, this.blocks.splice(this.ind, 1)[0]);
        },

        addNewBlock () {
            this.blocks.splice(this.ind + 1, 0, {
                id: Util.generateID(),
                name: "Contenteditable",
                content: ""
            });
        },

        removeBlck () {
            this.prevBlockComponent().setCaretLast()
            this.blocks.splice(this.ind, 1);
        },

        prevBlockComponent () {
            return this.blocks[this.ind - 1].__component
        },

        nextBlockComponent () {
            return this.blocks[this.ind + 1].__component
        },

        setCaretLast () {
            this.$refs.contenteditable.setCaretLast()
        },

        moveCaretUp () {
            this.prevBlockComponent().setCaretLast()
        },

        moveCaretDown () {
            this.nextBlockComponent().setCaretLast()
        },

        removeBlock () {
            // debugger;
            if (this.showRemove) {
                this.$emit('remove-block', this.value);
            } else {
                this.showRemove = true;
            }
        }

    },
    watch: {
      showToolbar () {
        if (!this.showToolbar && this.showRemove) {
          this.showRemove = false
        }
      }
    },
    components: {
        Contenteditable,
        [Button.name]: Button,
        [ButtonGroup.name]: ButtonGroup,
        "v-popover": VPopover,
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

.show-background {
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
}

.control > .ui-button {
    margin-right: 5px;
}

.control > .settings-panel {
    display: inline-block;
    width: 24px;
}



.ui-button--remove {
    transition: width .2s;
    justify-content: flex-start;
}

.ui-button--remove.ui-button--remove-active {
    width: 100px !important;
}
</style>

<style scoped>
</style>
