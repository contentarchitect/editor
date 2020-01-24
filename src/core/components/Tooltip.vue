<script>
import { VTooltip } from 'v-tooltip'

VTooltip.options.defaultContainer = false;

export default {
	props: ['tooltip'],
	render (createElement) {
		return createElement("span", {
			directives: [
				{
					name: "tooltip",
					value: this.tooltip
				},
				{
					name: "tooltip-fix"
				}
			]
		}, this.$slots.default)
	},
	directives: {
		tooltip: VTooltip,
		'tooltip-fix': {
			bind: function (el, binding, vnode) {
				el.addEventListener('mouseleave', () => {
					if (el._tooltip) el._tooltip.hide();
				})
			}
		}
	}
}
</script>