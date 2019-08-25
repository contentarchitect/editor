<template>
    <div>
        <label for="">Type</label>
        <div>
            <template v-for="dividerType in dividerTypes">
                <label :for="dividerType" :key="dividerType">
                    <input v-model="value.dividerType" :value="dividerType" type="radio" />
                    {{ dividerType }}
                </label>
            </template>
        </div>
    </div>
</template>

<script>
export default {
    props: ['value'],
    data () {
        return {
            dividerTypes: ["star", "border"],
        }
    }
}
</script>

<style>

</style>