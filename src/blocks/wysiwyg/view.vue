<template>
	<!-- <quill-editor
		v-model="value.content"
		:options="editorOptions" /> -->
  <Editable v-model="value.content" block />
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
import Editable from '@/components/Editable.vue'

export default {
	components: { quillEditor, Editable },
	props: ['value'],
	data () {
		return {
			editorOptions: {
                theme: "bubble",
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'code-block'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        [{ 'color': [] }, { 'background': [] }],
                        [{ 'align': [] }],
                    ],
                    keyboard: {
                        bindings: {
                            // enter: {
                            // key: 13,
                            // handler (range, context) {
                            //     vue.$emit('enter')
                            //     return false
                            // }
                            // }
                        },
                    }
                }
            }
		}
	}
}
</script>

<style>
@import '../../assets/quill.bubble.custom.css';

.ql-container, .ql-editor {
    height: auto;
    padding: 0;
}

.ql-editor.ql-blank::before {
    left: 0;
}

.ql-bubble .ql-tooltip {
  border-radius: 3px;
  background-color: #121212;
}

.ql-bubble .ql-tooltip:not(.ql-flip) .ql-tooltip-arrow {
  border-bottom-color: #121212;
}

.ql-tooltip {
  z-index: 10;
}

.ql-clipboard {
  display: none;
}
</style>