<template>
    <css-grid :columns="['1fr', '1fr']" gap="8px 0">
        <label for="">Type</label>
        <div>
            <template v-for="dividerType in value.constructor.settings.types">
                <label :for="dividerType" :key="dividerType" class="divider-type-options">
                    <input v-model="value.dividerType" :value="dividerType" type="radio" />
                    {{ dividerType }}
                </label>
            </template>
        </div>
    </css-grid>
</template>

<script>
import { CssGrid } from "@contentarchitect/core"

export default {
    components: { CssGrid },
    props: ['value'],
}
</script>

<style>
.divider-type-options {
    display: block;
}
</style>