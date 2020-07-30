import Vue from "vue"
import ImageControl from "../components/ImageControl"

// https://stackoverflow.com/questions/10934664/convert-string-in-dot-notation-to-get-the-object-reference/10934946#10934946
function setValue(obj, str, val) {
	str = str.split('.');
	while (str.length > 1) {
		obj = obj[str.shift()];
	}
	return obj[str.shift()] = val;
}

function getValue(obj, str) {
    str = str.split(".");
    for (var i = 0; i < str.length; i++)
        obj = obj[str[i]];
    return obj;
}

export default {
	bind (el, binding, vnode) {
		const props = {
			imageElement: el,
			isSelectable: !!binding.modifiers.select,
			uploadImage: !!binding.modifiers.upload,
			url: binding.modifiers.complex ?
				binding.value.obj[binding.value.exp]
				: getValue(vnode.context, binding.expression),
			...(binding.arg || {})
		}

		const parentApp = new Vue({
			render (createElement) {
				return createElement(
					{
						root: vnode.context.$root,
						...ImageControl
					},
					{ props }
				)
			}
		}).$mount()
		vnode.context.$root.$el.prepend(parentApp.$el)

		const imageControlApp = el.__vueImageControl__ = parentApp.$children[0]

		imageControlApp.$on('change', (e) => {
			if (binding.modifiers.complex) {
				binding.value.obj[binding.value.exp] = e
			} else {
				setValue(vnode.context, binding.expression, e);
			}

			vnode.context.$nextTick(() => {
				imageControlApp.updateComponentPosition()
			})
		})

		// const resizeObserver = el.__resizeObserver__ = new ResizeObserver(imageControlApp.updateComponentPosition)
		// resizeObserver.observe(el)

		el.addEventListener('mouseenter', imageControlApp.show)
		el.addEventListener('dragover', imageControlApp.show)
	},

	unbind (el) {
		const imageControlApp = el.__vueImageControl__.$children[0]

		el.removeEventListener('mouseenter', imageControlApp.show)
		el.removeEventListener('dragover', imageControlApp.show)
		el.__vueImageControl__.$destroy()
	}
}