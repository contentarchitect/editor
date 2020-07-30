<template>
    <button @click="$emit('click', $event)" class="ui-button" :class="{ 'ui-button--square': square, 'ui-button--active': active }">
        <div class="ui-button--inner">
            <slot />
        </div>
    </button>
</template>

<script>
export default {
    name: "ui-button",
    props: {
        square: {
            type: Boolean,
            default: false
        },
        active: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<style scoped>
.ui-button {
    outline: 0px;
    cursor: default;
    user-select: none;
    padding: 0px;
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 24px;
    color: #888;
    background: linear-gradient(to bottom, #fff 0%, #e5e5e5 100%);
    font-family: Arial, sans-serif;
    border-width: 1px;
    border-style: solid;
    border-color: #ccc;
    border-radius: 2px;
    box-sizing: border-box;
}

.ui-button--danger {
    background: linear-gradient(to bottom, #ff7070 0%, #e64848 100%);
    border-color: #cc3131;
    color: #fff;
    text-shadow: 0 -1px #d80000;
}

.ui-button.ui-button--square {
    width: 24px;
}

.ui-button:hover:not(:disabled) {
    border: 1px solid #bbbbbb;
    color: #777;
    box-shadow: 0 1px 2px #ddd;
}

.ui-button--danger:hover:not(:disabled) {
    border: 1px solid #b31a1a;
    color: #fff;
    box-shadow: 0 1px 2px #e09494;
}

.ui-button:active:not(:disabled),
.ui-button.ui-button--active {
    box-shadow: 0 1px 1px 0 #ccc inset;
    text-shadow: 0 1px 0 white;
    background: #e5e5e5;
}

.ui-button--danger:active:not(:disabled),
.ui-button--danger.ui-button--active {
    box-shadow: none;
    text-shadow: none;
    background: #e64848;
}

.ui-button .ui-button--inner {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.ui-button:disabled {
    opacity: .65;
}
</style>