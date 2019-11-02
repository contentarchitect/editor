<template>
	<css-grid :columns="['1fr', '1fr']" gap="8px 0">
		<label for="">Mode</label>
		<!-- <select v-model="value.mode">
			<option v-for="mode in modes" v-for="">	A</option>
		</select> -->
	</css-grid>
</template>

<script>
import { CssGrid } from "@contentarchitect/editor"

export default {
	components: { CssGrid },
	props: ['value', 'settings'],
	data () {
		return {
			// modes: CodeMirror.modes
		}
	}
}
</script>

<style>
</style>