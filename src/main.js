/** init domain config */
import './config'

import Vue from 'vue'
import App from './App.vue'
import Storage from 'vue-ls'
import router from './router'
import store from './store/'
import { VueAxios } from "@/utils/request"

require('@jeecg/antd-online-mini')
require('@jeecg/antd-online-mini/dist/OnlineForm.css')

import Antd, { version } from 'ant-design-vue'
console.log('ant-design-vue version:', version)

import Viser from 'viser-vue'
import 'ant-design-vue/dist/antd.less';  // or 'ant-design-vue/dist/antd.less'

import '@/permission' // permission control
import '@/utils/filter' // base filter
import Print from 'vue-print-nb-jeecg'
/*import '@babel/polyfill'*/
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
import SSO from '@/cas/sso.js'
//element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI/* , { i18n: (key, value) => i18n.t(key, value) } */);
import {
  ACCESS_TOKEN,
  DEFAULT_COLOR,
  DEFAULT_THEME,
  DEFAULT_LAYOUT_MODE,
  DEFAULT_COLOR_WEAK,
  SIDEBAR_TYPE,
  DEFAULT_FIXED_HEADER,
  DEFAULT_FIXED_HEADER_HIDDEN,
  DEFAULT_FIXED_SIDEMENU,
  DEFAULT_CONTENT_WIDTH_TYPE,
  DEFAULT_MULTI_PAGE
} from "@/store/mutation-types"
import config from '@/defaultSettings'

import JDictSelectTag from './components/dict/index.js'
import hasPermission from '@/utils/hasPermission'
import vueBus from '@/utils/vueBus';
import JeecgComponents from '@/components/jeecg/index'
import '@/assets/less/JAreaLinkage.less'
import VueAreaLinkage from 'vue-area-linkage'
import '@/components/jeecg/JVxeTable/install'
import '@/components/JVxeCells/install'
//绩效考核的分页
import Pagination from "@/components/performance/Pagination"
import RightToolbar from "@/components/performance/RightToolbar" // 自定义表格工具扩展
Vue.component('Pagination', Pagination)
Vue.component('RightToolbar', RightToolbar)
//表单验证
import { rules } from '@/utils/rules'
Vue.prototype.rules = rules
Vue.config.productionTip = false
Vue.use(Storage, config.storageOptions)
Vue.use(Antd)
Vue.use(VueAxios, router)
Vue.use(Viser)
Vue.use(hasPermission)
Vue.use(JDictSelectTag)
Vue.use(Print)
Vue.use(preview)
Vue.use(vueBus);
Vue.use(JeecgComponents);
Vue.use(VueAreaLinkage);

SSO.init(() => {
  main()
})
function main() {
  new Vue({
    router,
    store,
    mounted () {
      store.commit('SET_SIDEBAR_TYPE', Vue.ls.get(SIDEBAR_TYPE, true))
      store.commit('TOGGLE_THEME', Vue.ls.get(DEFAULT_THEME, config.navTheme))
      store.commit('TOGGLE_LAYOUT_MODE', Vue.ls.get(DEFAULT_LAYOUT_MODE, config.layout))
      store.commit('TOGGLE_FIXED_HEADER', Vue.ls.get(DEFAULT_FIXED_HEADER, config.fixedHeader))
      store.commit('TOGGLE_FIXED_SIDERBAR', Vue.ls.get(DEFAULT_FIXED_SIDEMENU, config.fixSiderbar))
      store.commit('TOGGLE_CONTENT_WIDTH', Vue.ls.get(DEFAULT_CONTENT_WIDTH_TYPE, config.contentWidth))
      store.commit('TOGGLE_FIXED_HEADER_HIDDEN', Vue.ls.get(DEFAULT_FIXED_HEADER_HIDDEN, config.autoHideHeader))
      store.commit('TOGGLE_WEAK', Vue.ls.get(DEFAULT_COLOR_WEAK, config.colorWeak))
      store.commit('TOGGLE_COLOR', Vue.ls.get(DEFAULT_COLOR, config.primaryColor))
      store.commit('SET_TOKEN', Vue.ls.get(ACCESS_TOKEN))
      store.commit('SET_MULTI_PAGE',Vue.ls.get(DEFAULT_MULTI_PAGE,config.multipage))
    },
    render: h => h(App)
  }).$mount('#app')
}

//flowable增加的
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import '@/icons'

import plugins from './plugins' // plugins
Vue.use(plugins)

/**
 * 注册表单设计器
 */
 Vue.config.productionTip = false
 Vue.config.devtools = false
 Vue.config.debug = false
 // 实现手写电子签名
import vueEsign from 'vue-esign'
Vue.use(vueEsign)
// import FormDesign from './components/elementFormDesign'
// import {
//   setFormOptions
// } from './components/elementFormDesign'
/* FormDesign.setDesignConfig({
  uploadImg: {
    // headers:""//给上传控件添加请求头信息
    // data:""//给上传文件添加一些携带参数
    // name:""//上传文件名
    // action:"www.baidu.com" // 默认的上传路径
  }
}) */
// Vue.use(FormDesign)
// Vue.prototype.setFormOptions = setFormOptions

// 自定义表格工具扩展
// import RightToolbar from '@/views/process/components/RightToolbar'
// Vue.component('RightToolbar', RightToolbar)