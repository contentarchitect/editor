<template>
    <div style="position: relative" class="block" ref="block" @mouseenter="showToolbar = true" @mouseleave="showToolbar = false" :class="{ 'show-background': showBg || isPopoverActive }">

        <slot name="view" />

        <transition name="fade">
            <div class="control" v-show="isPopoverActive || showToolbar" @mouseenter="showBg = true" @mouseleave="showBg = false">
                <ui-button
                    square
                    v-tooltip="'Move down'"
                    @click="$emit('moveBlockDown')"
                    :disabled="disableMoveDown"
                >
                    ↓
                </ui-button>

                <ui-button
                    square
                    v-tooltip="'Move up'"
                    @click="$emit('moveBlockUp')"
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

                <template v-if="hasConfiguration">
                    <v-popover
                        class="settings-panel"
                        offset="8"
                        placement="right"
                        @show="isPopoverActive = true"
                        @hide="isPopoverActive = false"
                        >
                        <ui-button :active="isPopoverActive" square v-tooltip="'Settings'">
                            &hellip;
                        </ui-button>

                        <!-- This will be the content of the popover -->
                        <template slot="popover">
                            <slot name="conf" />
                        </template>
                    </v-popover>
                </template>

                <template v-else>
                    <ui-button square disabled v-tooltip="'No settings'">
                        &hellip;
                    </ui-button>
                </template>

            </div>
        </transition>
    </div>
</template>

<script>
import Button from '@/components/Button'
import ButtonGroup from '@/components/ButtonGroup'
import { VTooltip, VPopover } from 'v-tooltip'

export default {
    props: {
        disableMoveUp: {
            type: Boolean,
            default: false
        },
        disableMoveDown: {
            type: Boolean,
            default: false
        }
    },
    data () {
      return {
            showBg: false,
            showToolbar: false,
            isPopoverActive: false,
            showRemove: false,
            hasConfiguration: false,
        }
    },
    created () {
        this.hasConfiguration = !!this.$slots.conf;
    },
    methods: {
        removeBlock () {
            if (this.showRemove) {
                this.$emit('removeBlock');
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
        [Button.name]: Button,
        // [ButtonGroup.name]: ButtonGroup,
        "v-popover": VPopover,
    },
    directives: {
        tooltip: VTooltip
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
