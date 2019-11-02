<template>
	<label v-bind="$attrs" class="ca-checkbox">
		<input type="checkbox" :checked="value" @change="$emit('input', $event.target.checked)">
		<span><slot /></span>
	</label>
</template>

<script>
export default {
	name: 'Checkbox',
	inheritAttrs: false,
	props: ['value'],
}
</script>

<style>
.ca-checkbox {
	display: flex;
	align-items: center;
}

.ca-checkbox input[type=checkbox] {
	margin-right: 5px;
}
</style>