import Vue from 'vue';

const Blocks = new Vue({
  data() {
    return {
      blocks: [],
      rows: []
    }
  }
});

const requireComponent = require.context('@/blocks', true, /main\.js$/)

requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName)
  Blocks.blocks.push(componentConfig.default)
})

export default Blocks;