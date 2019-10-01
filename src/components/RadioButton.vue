<template>
	<label v-bind="$attrs" class="ca-radio-button">
		<input type="radio" :value="value" v-model="radioButtonsData.value">
		<span><slot /></span>
	</label>
</template>

<script>
export default {
	name: 'RadioButton',
	inheritAttrs: false,
	inject: ['radioButtonsData'],
	props: ['value'],
}
</script>

<style>
.ca-radio-button {
	display: flex;
	align-items: center;
}

.ca-radio-button input[type=radio] {
	margin-right: 5px;
}
</style>