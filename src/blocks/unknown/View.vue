<template>
	<div v-html="value.innerHTML" class="unknown-block"></div>
</template>

<script>
export default {
	props: ['value']
}
</script>

<style>
.unknown-block {
	background-color: #ffe7e7
}
</style>