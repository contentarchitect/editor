<template>
    <block
        ref="block"
        :ind="ind"
        :disable-move-up="ind == 0"
        :disable-move-down="ind == blocks.length - 1">

        <template slot="view">
            <component :is="dividerType" />
        </template>

        <template slot="conf">
            <label for="">Type</label>
            <div>
                <template v-for="dividerType in dividerTypes">
                    <label :for="dividerType" :key="dividerType">
                        <input :value="dividerType" type="radio" />
                        {{ dividerType }}
                    </label>
                </template>
            </div>
        </template>
    </block>
</template>

<script>
import { Block, Editable } from "@contentarchitect/base"

export default {
    mixins: [Block],
    data () {
        return {
            dividerTypes: ["star", "border"],
            dividerType: "star"
        }
    },
    methods: {
        renderedHtml () {
            let str;

            switch(this.dividerType) {
                case "star":
                    str = `<div class="divider divider-star">***</div>`;
                    break;
                case "border":
                    str = `<div class="divider divider-line"><div></div></div>`;
                    break;
            }

            return str;
        }
    },
    watch: {
        dividerType: "renderHtml"
    },
    computed: {
        typeClass () {
            return "divider-" + this.dividerType;
        }
    },
    components: {
        star: {
            render (createElement) {
                return createElement("div", { attrs: {  class: "divider divider-star" } }, "***")
            }
        },
        border: {
            render (h) {
                return h(
                    "div",
                    {
                        attrs: {
                            class: "divider divider-line"
                        }
                    },
                    [h("div", {}, "")]
                )
            }
        },
    }
}
</script>

<style>
.divider {
    padding: 10px 0;
    display: flex;
    justify-content: center;
    align-items: center;
}

.divider-star {
    letter-spacing: 5px;
}

.divider-line div {
    border-bottom: 1px solid #ccc;
}
</style>
