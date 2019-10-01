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
                return createElement("div", { attrs: {  class: "divider divider-star" } })
            }
        },
        border: {
            render (h) {
                return h(
                    "div",
                    {
                        attrs: {
                            class: "divider divider-line"
                        }
                    },
                    [h("div", {}, "")]
                )
            }
        },
    }
}
</script>

<style>
.divider {
    padding: 10px 0;
    display: flex;
    justify-content: center;
    align-items: center;
}

.divider-star::before {
    content: "***";
    letter-spacing: 15px;
    margin-right: -14px
}

.divider-line div {
    flex: 1;
    border-bottom: 1px solid #ccc;
}
</style>