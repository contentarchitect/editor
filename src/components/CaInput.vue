<template>
    <input class="ca-input" v-model="input" />
</template>

<script>
export default {
    props: ['value'],
    data () {
        return {
            input: this.value
        }
    },
    watch: {
        value () {
            this.input = this.value;
        },
        input () {
            let val = this.input;

            if (this.$el.type === "number") {
                val = Number(val);
            }
            
            this.$emit('input', val);
        }
    }
}
</script>

<style>
.ca-input {
    outline: none !important;
    border: none;
    width: 100%;
    background: rgb(36, 36, 36);
    padding: 3px 6px;
    color: inherit;
    height: 24px;
    box-sizing: border-box;
}

.ca-input:hover {
    box-shadow: var(--focus-ring-inactive-shadow);
}

.ca-input:focus {
    box-shadow: var(--focus-ring-active-shadow);
}
</style>