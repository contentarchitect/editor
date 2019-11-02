<template>
	<div v-html="value.innerHTML" class="unknown-block-inner"></div>
</template>

<script>
export default {
	props: ['value']
}
</script>

<style>
.unknown-block-inner {
	opacity: .3;
}
</style>