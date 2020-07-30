<template>
  <div class="ca-radio-buttons" :class="{ 'ca-radio-buttons--inline': inline }">
    <slot/>
  </div>
</template>

<script>
export default {
  name: 'RadioButtons',
  provide () {
    return {
      radioButtonsData: this.injection,
    }
  },
  props: {
    value: {},
    inline: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      injection: {
        value: this.value,
      },
    }
  },
  watch: {
    "injection.value": function (value, oldValue) {
      if (value !== oldValue) {
        this.$emit('input', value)
      }
    },
  },
}
</script>

<style>
.ca-radio-buttons {
	display: flex;
	flex-direction: column;
}

.ca-radio-buttons.ca-radio-buttons--inline {
	flex-direction: row;
}

.ca-radio-buttons.ca-radio-buttons--inline .ca-radio-button {
	margin-right: 10px;
}

.ca-radio-buttons.ca-radio-buttons--inline .ca-radio-button input[type=radio] {
	margin-right: 3px;
}
</style>