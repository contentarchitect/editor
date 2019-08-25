<template>
  <div>
    <label for="">Count</label>
    <vue-group v-model="value.imageCount">
        <vue-group-button :value="1">1</vue-group-button>
        <vue-group-button :value="2">2</vue-group-button>
        <vue-group-button :value="3">3</vue-group-button>
    </vue-group>
  </div>
</template>

<script>
export default {
    props: ['value']
}
</script>

<style>

</style>