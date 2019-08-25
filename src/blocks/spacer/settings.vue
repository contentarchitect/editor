<template>
    <div>
        <label for="">Height</label>
        <vue-input v-model="value.height" type="number" />
    </div>
</template>

<script>
export default {
    props: ['value']
}
</script>

<style>

</style>