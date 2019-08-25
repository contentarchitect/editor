<template>
    <anchored-heading :level="value.level">
        <Editable v-model="value.content" />
    </anchored-heading>
</template>

<script>
import { Editable } from "@contentarchitect/base";

export default {
    props: ['value'],
    components: {
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

<style>

</style>