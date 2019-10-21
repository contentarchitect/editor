<template>
  <css-grid :columns="['50px', '1fr']">
	<label for="">Level</label>
	<radio-buttons :options="options" v-model="value.level" />
  </css-grid >
</template>

<script>
import { CssGrid, RadioButtons } from "@contentarchitect/editor"


export default {
	components: { CssGrid, RadioButtons },
	props: ['value'],
	data () {
	  return {
		options: [
		  {
			value: 4,
			label: "H4"
		  },
		  {
			value: 5,
			label: "H5"
		  },
		]
	  }
	}
}
</script>

<style>

</style>