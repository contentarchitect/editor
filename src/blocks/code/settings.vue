<template>
	<css-grid :columns="['1fr', '1fr']" gap="8px 0">
		<label for="">Mode</label>
		<select v-model="value.language">
			<option :value="''" v-if="languages.length"></option>
			<option v-for="language in languages" :value="language" :key="language">{{ language }}</option>
		</select>
	</css-grid>
</template>

<script>
import { CssGrid } from "@contentarchitect/core"

export default {
	components: { CssGrid },
	props: ['value'],
	data () {
		return {
			languages: Object.keys(Prism.languages).filter(lang => typeof Prism.languages[lang] !== "function")
		}
	}
}
</script>

<style>
</style>