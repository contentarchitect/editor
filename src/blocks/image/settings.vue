<template>
  <css-grid :columns="['50px', '1fr']" gap="8px">
	<label for="">Image Count</label>
	<radio-buttons v-model="imageCount" inline>
		<radio-button :value="1">1</radio-button>
		<radio-button :value="2">2</radio-button>
		<radio-button :value="3">3</radio-button>
	</radio-buttons>
  </css-grid>
</template>

<script>
import { CssGrid, RadioButtons, RadioButton } from "@contentarchitect/core"

export default {
	components: { CssGrid, RadioButtons, RadioButton },
	props: ['value'],
	data () {
		return {
			emptyImage: { url: null, caption: null },
		}
	},
	computed: {
		imageCount: {
			get () {
				return this.value.images.length;
			},
			set (newImageCount) {
				let oldImageCount = this.value.images.length;
				if (newImageCount > oldImageCount) {
					let addCount = newImageCount - oldImageCount;
					this.value.images.push(...Array(addCount).fill().map(_ => { return { ...this.emptyImage } }));
				} else {
					this.value.images.splice(newImageCount)
				}	
			}
		}
	}
}
</script>

<style>

</style>