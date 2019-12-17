<template>
  <Editable v-model="value.content" block :placeholder="settings.placeholder" />
</template>

<script>
import { Editable } from "@contentarchitect/core"

export default {
	components: { Editable },
	props: ['value', 'settings'],
}
</script>

<style>
</style>