<template>
    <block
        ref="block"
        :ind="ind"
        :disable-move-up="ind == 0"
        :disable-move-down="ind == blocks.length - 1">

        <template slot="view">
            <blockquote>
                <Editable v-model="value.content" />
            </blockquote>
        </template>

        <template slot="conf">
            as
        </template>
    </block>
</template>

<script>
import { Block, Editable } from "@contentarchitect/base"

export default {
    mixins: [Block],
    components: { Editable },
    data () {
        return {
        }
    },
    methods: {
        renderedHtml () {
            return "<blockquote></blockquote>";
        }
    }
}
</script>

<style>
</style>