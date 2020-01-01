<template>
	<blockquote>
		<Editable v-model="value.content" block placeholder="Type your text" />
		<cite class="cite">
			<Editable v-model="value.cite" placeholder="Type the citation" />
		</cite>
	</blockquote>
</template>

<script>
import { Editable } from "@contentarchitect/core"

export default {
	components: { Editable },
	props: ['value']
}
</script>