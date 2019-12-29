<template>
  <component :is="value.dividerType" />
</template>

<script>
export default {
    props: ['value'],
    computed: {
        typeClass () {
            return "divider-" + this.dividerType;
        }
    },
    components: {
        star: {
            render (createElement) {
                return createElement("hr", { attrs: {  class: "divider divider-star" } })
            }
        },
        border: {
            render (h) {
                return h("hr", { attrs: { class: "divider divider-border" } })
            }
        },
    }
}
</script>

<style>
/* .divider {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 0;
    padding: 10px 0;
} */

/* .divider-star::before {
    content: "***";
    letter-spacing: 15px;
    margin-right: -14px
}

.divider-border {
    flex: 1;
    border-bottom: 1px solid #ccc;
} */
</style>