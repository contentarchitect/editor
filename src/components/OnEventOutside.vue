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
		// https://gist.github.com/rockinghelvetica/00b9f7b5c97a16d3de75ba99192ff05c
		// POLYFILLS
		// Event.composedPath
		// Possibly normalize to add window to Safari's chain, as it does not?
		(function(E, d, w) {
		if(!E.composedPath) {
			E.composedPath = function() {
			if (this.path) {
				return this.path;
			} 
			var target = this.target;
			
			this.path = [];
			while (target.parentNode !== null) {
			this.path.push(target);
			target = target.parentNode;
			}
			this.path.push(d, w);
			return this.path;
			}
		}
		})(Event.prototype, document, window);

		const listener = e => {
			const path = e.composedPath();

			if (path.find(el => el == this.$el)) return

			this.do(e, path)
		}

		setTimeout(() => {
			document.addEventListener(this.event, listener)
		}, 0)

		this.$once("hook:beforeDestroy", () => {
			document.removeEventListener(this.event, listener)
		})
	},
	render() {
		return this.$slots.default[0]
	}
}
</script>
