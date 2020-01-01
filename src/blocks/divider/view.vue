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