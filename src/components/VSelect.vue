<template>
	<select :value="value" @change="$emit('input', $event.target.value)">
		<slot />
	</select>
</template>

<script>
export default {
	props: ['value']
}
</script>

<style scoped>
select {
    color: rgb(204, 204, 204);
    background-color: rgb(38, 38, 38);
    border: 1px solid rgba(230, 230, 230, 0.2);
    border-radius: 2px;
    margin: 0;
    outline: none;
    padding-right: 20px;
    padding-left: 6px;
    min-height: 24px;
    min-width: 80px;
}

select:enabled:active,
select:enabled:focus,
select:enabled:hover {
	background-color:rgb(41, 41, 41);
	box-shadow:rgba(230, 230, 230, 0.1) 0px 1px 2px;
}

select:enabled:active {
    background-color:rgb(42, 42, 42);
}

select:enabled:focus {
	border-color: transparent;
	box-shadow:rgba(230, 230, 230, 0.1) 0px 1px 2px, rgba(11, 78, 189, 0.4) 0px 0px 0px 2px;
}

select:disabled {
    opacity: 0.38;
}

select optgroup, select option {
	background-color:rgb(44, 44, 44);
	color:rgb(213, 213, 213);
}
</style>