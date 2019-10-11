<template>
  <Editable v-model="value.content" block />
</template>

<script>
import Editable from '@/components/Editable.vue'

export default {
	components: { Editable },
	props: ['value'],
}
</script>

<style>
</style>