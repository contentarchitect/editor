<template>
    <div>

        <button @click="add">Add new</button>

        <template v-for="block in blocks">
            <div :key="block.name">{{ block.name }}</div>
        </template>
        
    </div>
</template>

<script>
import Util from "@/scripts/Util.js"


class Block {
    constructor () {
        this.name = Util.generateID();
    }


    static get name () {
        return this.name;
    }
}


export default {
    data () {
        return {
            blocks: [
                new Block(),
                new Block(),
                new Block(),
            ]
        }
    },
    methods: {
        add () {
            this.blocks.push(new Block())
        }
    }
}
</script>

<style>

</style>