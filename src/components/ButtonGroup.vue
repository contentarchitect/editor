<template>
  <div class="ui-button-group">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'UiButtonGroup'
  };
</script>

<style scoped>
.ui-button-group {
  display: flex;
  width: 100px
}

.ui-button-group > .ui-button:not(:first-child) {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.ui-button-group >.ui-button:not(:last-child) {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.ui-button-group > .ui-button:not(:first-child) {
    margin-left: -1px;
}
</style>
