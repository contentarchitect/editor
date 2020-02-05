<template>
	<pre ref="pre" class="code-pre" :class="['language-'+ value.language]"><code ref="code" class="code" :class="['language-'+ value.language]"><div class="textarea-container"><textarea ref="textarea" v-model="value.code" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" data-gramm="false"></textarea></div><span v-html="highlighted"></span></code></pre>
</template>

<script>
// https://css-tricks.com/snippets/javascript/htmlentities-for-javascript/
function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export default {
	props: ['value'],
	data () {
		return {
			highlighted: ''
		}
	},
	methods: {
		highlight () {
			let highlighted;
			if (typeof Prism != "undefined" && Prism.languages[this.value.language]) {
				// "\n" is necessary. Beacuse if textarea has an empty new line, <pre> doesn't add new line. In this situation, the heights aren't equal.
				highlighted = Prism.highlight(this.value.code + "\n", Prism.languages[this.value.language] || "", this.value.language || "")
			} else {
				highlighted = htmlEntities(this.value.code + "\n")
			}

			this.highlighted = highlighted
			let rendered = `<pre class="language-${this.value.language}"><code class="language-${this.value.language}">${highlighted}</code></pre>`
			this.value.highlighted = rendered
		}
	},
	watch: {
		"value.code": {
			immediate: true,
			handler: "highlight"
		},
		"value.language": "highlight"
	}
}
</script>

<style scoped>
.code {
	position: relative;
	display: inline-block !important;
	min-width: 100%;
}

.textarea-container {
	position: absolute;
	left: 0;
	top: 0;
	bottom: 0;
	right: 0;
	opacity: .6;
	z-index: 1;
}

.textarea-container > textarea {
	width: 100%;
	height: 100%;
	border: 0;
	padding: 0;
	margin: 0;
	opacity: .6;
	font-family: inherit;
	font-size: inherit;
	font-style: inherit;
	font-variant-ligatures: inherit;
	font-weight: inherit;
	letter-spacing: inherit;
	line-height: inherit;
	tab-size: inherit;
	text-indent: inherit;
	text-rendering: inherit;
	text-transform: inherit;
	color: inherit;
	-moz-osx-font-smoothing: grayscale;
	-webkit-font-smoothing: antialiased;
	-webkit-text-fill-color: transparent;
	outline: 0;
	background: none;
	overflow: hidden;
	resize: none;
}
</style>