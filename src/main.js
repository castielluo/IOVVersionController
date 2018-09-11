// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import utils from './utils/utils'
/* ydui */
import {NavBar, NavBarBackIcon, NavBarNextIcon} from 'vue-ydui/dist/lib.rem/navbar'
import {CellGroup, CellItem} from 'vue-ydui/dist/lib.rem/cell'
import {ActionSheet} from 'vue-ydui/dist/lib.rem/actionsheet'
import 'vue-ydui/dist/ydui.base.css'
/* iview */
import {Row, Col, Button, Dropdown, DropdownItem, DropdownMenu, TimePicker, Submenu, Icon, Menu, MenuGroup, Switch, MenuItem, Table, Select, Option, Input, Upload, Modal, RadioGroup, Radio, Card, Spin, Checkbox, Form, FormItem, DatePicker} from 'iview'
import 'iview/dist/styles/iview.css'
/* modals */
import Mymodal from './components/backend/modal'
import rightModal from './components/backend/rightModal'

Vue.use(utils)
Vue.component(CellGroup.name, CellGroup)
Vue.component(CellItem.name, CellItem)
Vue.component(NavBar.name, NavBar)
Vue.component(NavBarBackIcon.name, NavBarBackIcon)
Vue.component(NavBarNextIcon.name, NavBarNextIcon)
Vue.component(ActionSheet.name, ActionSheet)
Vue.component('Row', Row)
Vue.component('Col', Col)
Vue.component('Card', Card)
Vue.component('Dropdown', Dropdown)
Vue.component('DropdownMenu', DropdownMenu)
Vue.component('DropdownItem', DropdownItem)
Vue.component('Button', Button)
Vue.component('Submenu', Submenu)
Vue.component('Icon', Icon)
Vue.component('Menu', Menu)
Vue.component('MenuGroup', MenuGroup)
Vue.component('MenuItem', MenuItem)
Vue.component('Table', Table)
Vue.component('Spin', Spin)
Vue.component('Select', Select)
Vue.component('Option', Option)
Vue.component('Input', Input)
Vue.component('Upload', Upload)
Vue.component('Switchs', Switch)
Vue.component('Modal', Modal)
Vue.component('TimePicker', TimePicker)
Vue.component('RadioGroup', RadioGroup)
Vue.component('Radio', Radio)
Vue.component('Checkbox', Checkbox)
Vue.component('Form', Form)
Vue.component('FormItem', FormItem)
Vue.component('DatePicker', DatePicker)
Vue.component('Mymodal', Mymodal)
Vue.component('rightModal', rightModal)
Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  if (to.meta.needLogin) {
    if (window.sessionStorage.getItem('token')) {
      if ((from.name === 'Login') && (to.name !== 'Login') && (window.localStorage.originPath)) {
        var redirectTo = window.localStorage.getItem('originPath')
        window.localStorage.removeItem('originPath')
        next(redirectTo)
      } else {
        next()
      }
    } else {
      window.localStorage.setItem('originPath', to.path)
      next('/login')
    }
  } else {
    next()
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
