<template>
    <div>
        <label for="">Cols</label>
        <vue-input v-model="value.cols" type="number" />
        <label for="">Rows</label>
        <vue-input v-model="value.rows" type="number" />

        <label for="">Dark</label>
        <VueSwitch v-model="value.dark" class="extend-left" />

        <label for="">Striped</label>
        <VueSwitch v-model="value.striped" class="extend-left" />

        <label for="">Bordered</label>
        <VueSwitch v-model="value.bordered" class="extend-left" />

        <label for="">Borderless</label>
        <VueSwitch v-model="value.borderless" class="extend-left" />

        <label for="">Hover</label>
        <VueSwitch v-model="value.hover" class="extend-left" />

        <label for="">Small</label>
        <VueSwitch v-model="value.sm" class="extend-left" />
    </div>
</template>

<script>
export default {
    props: ['value']
}
</script>

<style>

</style>