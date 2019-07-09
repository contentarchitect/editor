import Block from "@/components/Block.vue"

export default {
    props: {
        value: Object,
        blocks: Array,
        ind: Number,
    },
    data () {
        return {
            block: null
        }
    },
    mounted () {
        this.block = this.$refs.block;
        this.block.$on("moveBlockUp", this.moveBlockUp)
        this.block.$on("moveBlockDown", this.moveBlockDown)
        this.block.$on("removeBlock", this.removeBlock)
    },
    components: {
        block: Block
    },
    methods: {
        moveBlockDown () {
            this.$emit('move-block-down', this.value)
        },
        moveBlockUp () {
            this.$emit('move-block-up', this.value)
        },
        removeBlock () {
            this.$emit('remove-block', this.value)
        },
        renderHtml () {
            this.value.renderedHtml = this.renderedHtml();
            this.$emit('html-changed');
        },
        renderedHtml () {
            console.warn("You must crate a method called renderHtml() your block component.");
        }
    },
    watch: {
        value: {
            handler: 'renderHtml',
            deep: true,
            immediate: true
        }
    }
}