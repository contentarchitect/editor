<template>
	<div
		class="add-block"
		@click="$emit('click')"
	>
		Add block
	</div>
</template>

<script>
export default {
}
</script>

<style scoped>
.add-block {
	display: flex;
	height: 2em;
	align-items: center;
	justify-content: center;
	background: azure;
	cursor: default;
	margin-top: 1em;
}

.add-block:hover {
	background: #dbf9f9;
}
</style>