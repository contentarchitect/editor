<template>
	<div
		class="add-block"
		@click="$emit('click')"
	>
		<div class="add-block-inner">
			<hr />
			<span>add block</span>
			<hr />
		</div>
	</div>
</template>

<script>
export default {
}
</script>

<style scoped>
.add-block {
	height: 0px;
	position: relative;
	z-index: 1;
}

.add-block-inner {
	position: absolute;
	display: flex;
	align-items: center;
	left: 0;
	right: 0;
	height: 14px;
	opacity: 0;
	margin-top: -7px;
	transition: opacity .1s;
}

.add-block-inner > hr:first-child,
.add-block-inner > hr:last-child {
	flex: 1;
	height: 1px;
	border: 0;
	border-bottom: 1px dashed #121212;
}

.add-block-inner > span {
	padding: 0 10px;
	background-color: #121212;
	color: #ccc;
	border-radius: 1em;
	cursor: default;
}

.add-block-inner > span:hover {
	background-color: #444;
}

.add-block-inner:hover {
  opacity: 1;
}
</style>