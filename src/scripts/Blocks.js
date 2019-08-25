import Vue from 'vue';

const Blocks = new Vue({
  data() {
    return {
      blocks: {}
    }
  },
  methods: {
    register (component) {
      this.blocks[component.name] = component;
    },
  }
});

// const requireComponent = require.context('@/blocks', true, /main\.js$/)

// requireComponent.keys().forEach(fileName => {
//   const componentConfig = requireComponent(fileName)
//   Blocks.blocks.push(componentConfig.default)
// })

export default Blocks;