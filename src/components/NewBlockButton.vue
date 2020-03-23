<template>
	<div
		class="add-block-button"
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
.add-block-button {
	display: flex;
	height: 2em;
	align-items: center;
	justify-content: center;
	background: azure;
	cursor: default;
	margin-top: 1em;
}

.add-block-button:hover {
	background: #dbf9f9;
}
</style>