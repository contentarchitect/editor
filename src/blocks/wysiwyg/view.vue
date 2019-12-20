<template>
  <Editable v-model="value.content" block :placeholder="value.constructor.settings.placeholder" />
</template>

<script>
import { Editable } from "@contentarchitect/core"

export default {
	components: { Editable },
	props: ['value'],
}
</script>

<style>
</style>