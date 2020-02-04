<template>
	<table>
		<caption>
			<Editable
				v-model="value.caption"
				placeholder="Table caption"
			/>
		</caption>
		<thead v-if="value.thead">
			<tr>
				<th v-for="(col, i) in value.data[0]" :key="i">
					<Editable
						block
						v-model="col.value"
					/>
				</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="row in tbody" :key="row.id">
				<td v-for="(col, j) in row" :key="j">
					<Editable
						block
						v-model="col.value"
					/>
				</td>
			</tr>
		</tbody>
	</table>
</template>

<script>
import { Editable } from "@contentarchitect/core"

export default {
	props: ['value'],
	components: { Editable },
	created () {
		this.value.data.forEach(row => {
			row.id = Math.random()
		});
	},
	methods: {
		randomKey () {
			return Math.random()
		}
	},
	computed: {
		tbody () {
			return this.value.thead
				? this.value.data.slice(1, this.value.data.length)
				: this.value.data
		}
	}
}
</script>

<style>
</style>