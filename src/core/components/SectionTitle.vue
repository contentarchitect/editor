<template>
	<div class="settings-section-title" v-on="$listeners">
		<div>
			<slot />
		</div>
		<div class="collapsible-icon">
			<ArrowLeftIcon v-if="!collapsed" />
			<ArrowDownIcon v-if="collapsed" />
		</div>
	</div>
</template>

<script>
import ArrowLeftIcon from '../../assets/arrow-left.svg';
import ArrowDownIcon from '../../assets/arrow-down.svg';

export default {
	components: {
		ArrowLeftIcon,
		ArrowDownIcon
	},
	props: {
		collapsed: {
			type: Boolean,
			default: true
		}
	},
}
</script>

<style>
.settings-section-title {
	user-select: none;
	display: flex;
	padding: 4px 8px;
	background-color: #2b2b2b;
	border-bottom: 1px solid #212121;
	justify-content: space-between;
}
/* 
&-enter-active,
&-leave-active { transition: opacity 350ms }

&-enter,
&-leave-to { opacity: 0 }

&-leave,
&-enter-to { opacity: 1 } */

.collapsible-icon {
	display: flex;
	align-items: center;
}

.collapsible-icon svg {
	width: 8px;
	fill: #ccc;
}
</style>