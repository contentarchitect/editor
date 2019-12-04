<script>
export default {
  props: {
    do: {
      type: Function
    },
    event: {
      type: String,
      default: "click",
      validator (value) {
        return ['click', 'mousedown', 'mouseup', 'mouseenter', 'mouseleave'].indexOf(value) !== -1
      }
    }
  },
  mounted() {
    const listener = e => {
      let target = e.composedPath()[0];
      if (target === this.$el || this.$el.contains(target)) {
        return
      }

      this.do(e)
    }

    document.addEventListener(this.event, listener)
    this.$once("hook:beforeDestroy", () => {
      document.removeEventListener(this.event, listener)
    })
  },
  render() {
    return this.$slots.default[0]
  }
}
</script>
