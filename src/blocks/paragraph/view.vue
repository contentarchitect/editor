<template>
  <!-- <Editable v-model="value.content" block :placeholder="value.constructor.settings.placeholder" /> -->
  <div v-edit:[config].block="value.content"></div>
</template>

<script>
import { edit } from "@contentarchitect/core"

export default {
	directives: { edit },
	props: ['value'],
	data () {
		return {
			config: {
				placeholder: this.value.constructor.settings.placeholder
			}
		}
	}
}
</script>