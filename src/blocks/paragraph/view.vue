<template>
  <!-- <Editable v-model="value.content" block :placeholder="value.constructor.settings.placeholder" /> -->
  <div v-edit:[config].block="value.content"></div>
</template>

<script>
import { EditDirective } from "@contentarchitect/core"

export default {
	directives: {
		edit: EditDirective
	},
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