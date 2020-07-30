<template>
	<div class="settings-section" >
		<slot name="title" :toggle-section="toggleSection" :show-section="showSection" :disabled="disabled" />
		<div class="settings-section-body" v-if="showSection">
			<slot  />
		</div>
	</div>
</template>

<script>
export default {
	props: {
		collapsed: {
			type: Boolean,
			default: true
		},
		disabled: {
			type: Boolean,
			default: false
		}
	},
	data () {
		return {
			showSection: this.collapsed && !this.disabled
		}
	},
	methods: {
		toggleSection () {
			this.showSection = !this.showSection;
		}
	}
}
</script>

<style>
.settings-section-body {
	background: #404040;
	padding: 6px 8px;
	font-size: .75rem;
}
</style>