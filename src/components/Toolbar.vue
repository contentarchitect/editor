<template>
    <div class="toolbar" :style="{ transform: translate }" v-show="show">
        <slot />
    </div>
</template>


<script>
import Dom from "@/scripts/Dom"

export default {
    props: {
        rf: String,
        show: Boolean,
        position: {
            type: String,
            default: "right",
            validator (value) {
                return value == "right"
            }
        }
    },
    data () {
        return {
            translateX: "-10px",
            translateY: "-100px"
        }
    },
    mounted () {
        this.$parent.$el.style.position = "relative";
        this.$parent.$refs[this.ref]
    },
    computed: {
        translate () {
            if (!this.$el) return;
            let toolbar = this.$el;
            debugger;
            let rect = this.$parent.$refs[this.rf].getBoundingClientRect();
            let left = rect.left + rect.width / 2 - toolbar.offsetWidth / 2
            let top = rect.bottom - rect.height - toolbar.offsetHeight - 14

            let calc_pos = Dom.position(this.$parent.$refs[this.rf], document)
            calc_pos.x += left
            calc_pos.y += top

            if (calc_pos.y < 0) {
                top = rect.top + rect.height + 14
                this.toolbarVReverse = true
            } else {
                this.toolbarVReverse = false
            }

            if (calc_pos.x < 0) {
                let over = Math.abs(calc_pos.x)
                left += over
                // this.$refs.toolbarTriangle.style.left = `calc(50% - ${over}px)`
            } else if (
                calc_pos.x + toolbar.offsetWidth >
                document.documentElement.clientWidth
            ) {
                let over =
                    calc_pos.x +
                    toolbar.offsetWidth -
                    document.documentElement.clientWidth
                left -= over
                // this.$refs.toolbarTriangle.style.left = `calc(50% + ${over}px)`
            } else {
                // this.$refs.toolbarTriangle.style.left = null
            }
            // return `translate(${this.translateX},${this.translateY})`
            return `translate(${left}px, ${top}px)`
        }
    }
}
</script>

<style>
.toolbar {
    position: absolute;
    width: 200px;
    background: red;
    left: 0;
    top: 0;
}
</style>
