import Vue from 'vue'
import App from './App.vue'

Vue.filter('cap', (value) => {
  if (!value) { return '' }

  return `${value.substring(0, 1).toUpperCase()}${value.substring(1)}`
})

new Vue({ // eslint-disable-line
  el: '#app',
  render: h => h(App)
})
