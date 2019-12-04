<template>
    <css-grid :columns="['100px', 'auto']" gap="8px 0">
        <label for="">Cols</label>
        <vue-input v-model="value.cols" type="number" />

        <label for="">Rows</label>
        <vue-input v-model="value.rows" type="number" />

        <label for="">Dark</label>
        <VueSwitch v-model="value.dark" class="extend-right" />

        <label for="">Striped</label>
        <VueSwitch v-model="value.striped" class="extend-right" />

        <label for="">Bordered</label>
        <VueSwitch v-model="value.bordered" class="extend-right" />

        <label for="">Borderless</label>
        <VueSwitch v-model="value.borderless" class="extend-right" />

        <label for="">Hover</label>
        <VueSwitch v-model="value.hover" class="extend-right" />

        <label for="">Small</label>
        <VueSwitch v-model="value.sm" class="extend-right" />
    </css-grid>
</template>

<script>
import { CssGrid } from "@contentarchitect/core"
export default {
    components: { CssGrid },
    props: ['value']
}
</script>

<style>

</style>