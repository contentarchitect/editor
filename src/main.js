import Vue from 'vue'
import App from './App.vue'
import { Component } from "../dist/contentarchitect.common"
Vue.config.productionTip = false

new Vue({
  render: h => h(Component),
}).$mount('#app')

// new Vue({
//   render: h => h(App),
// }).$mount('#app')

class Editor {
  constructor () {
    new Vue({
      render: h => h(Component),
    }).$mount('#app')
  }
}

export { Editor, Component }