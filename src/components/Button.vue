<template>
	<button v-bind="$attrs"
		v-on="$listeners"
        type="button"
		class="text-button"
		:class="{ 'primary-button': primary }">
		<slot />
	</button>
</template>

<script>
export default {
    name: "v-button",
    inheritAttrs: false,
	props: {
		primary: {
			type: Boolean,
			default: false
		},
	}
}
</script>

<style>
/*
 * Copyright (c) 2014 The Chromium Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

.text-button {
    height: 24px;
    font-size: 12px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    padding: 0px 12px;
    font-weight: 500;
    color: var(--accent-fg-color);
    background-color: #fff;
    flex: none;
    white-space: nowrap;
}

.text-button:not(:disabled):focus,
.text-button:not(:disabled):hover,
.text-button:not(:disabled):active {
    background-color: var(--toolbar-bg-color);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    cursor: pointer;
}

.text-button:not(:disabled):active {
    background-color: #f2f2f2;
}

.text-button:not(:disabled):focus {
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1), 0 0 0 2px rgba(66, 133, 244, 0.4);
}

.text-button:disabled {
    opacity: 0.38;
}

.text-button.primary-button, -theme-preserve {
    background-color: var(--accent-color);
    border: none;
    color: #fff;
}

.text-button.primary-button:not(:disabled):focus,
.text-button.primary-button:not(:disabled):hover,
.text-button.primary-button:not(:disabled):active, -theme-preserve {
    background-color: var(--accent-color-hover);
}

.-theme-with-dark-background .text-button:not(.primary-button):not(:disabled):focus,
.-theme-with-dark-background .text-button:not(.primary-button):not(:disabled):hover,
.-theme-with-dark-background .text-button:not(.primary-button):not(:disabled):active {
    background-color: #313131;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.-theme-with-dark-background .text-button:not(.primary-button):not(:disabled):focus {
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1), 0 0 0 2px rgba(94, 151, 246, 0.6);
}

.-theme-with-dark-background .text-button:not(.primary-button):not(:disabled):active {
    background-color: #3e3e3e;
}


/* for Dark Theme */
.text-button {
	border-top-color: rgba(230, 230, 230, 0.2);
	border-right-color: rgba(230, 230, 230, 0.2);
	border-bottom-color: rgba(230, 230, 230, 0.2);
	border-left-color: rgba(230, 230, 230, 0.2);
	color: var(--accent-fg-color);
	background-color: rgb(36, 36, 36);
}

.text-button:not(:disabled):focus,
.text-button:not(:disabled):hover,
.text-button:not(:disabled):active {
	background-color: var(--toolbar-bg-color);
	box-shadow: rgba(230, 230, 230, 0.1) 0px 1px 2px;
}

.text-button:not(:disabled):active {
	background-color: rgb(42, 42, 42);
}

.text-button:not(:disabled):focus {
	box-shadow: rgba(230, 230, 230, 0.1) 0px 1px 2px, rgba(11, 78, 189, 0.4) 0px 0px 0px 2px;
}
</style>