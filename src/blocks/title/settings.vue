<template>
  <div>
    <vue-group v-model="value.level">
        <vue-group-button :value="1">H1</vue-group-button>
        <vue-group-button :value="2">H2</vue-group-button>
        <vue-group-button :value="3">H3</vue-group-button>
    </vue-group>
    Title ayarlari
  </div>
</template>

<script>
export default {
    props: ['value']
}
</script>

<style>

</style>