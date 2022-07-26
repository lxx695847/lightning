import Vue from 'vue';
import { Col, Row } from 'vant';
import { Popover } from 'vant';
import instance from "./http.js"
import SvgIcon from '@/component/wap/SvgIcon.js'// svg组件
import wapFooter from '@/component/wap/footer.js'
import wapHeader from '@/component/wap/header.js'
import PcFooter from '@/component/pc/footer.js'
import PCHeader from '@/component/pc/header.js'
import { hasMobile } from '@/utils/index.js'
import VueMeta from 'vue-meta'
Vue.use(VueMeta)
Vue.use(Popover)
Vue.use(Col)
Vue.use(Row)
// Vue.component('svg-icon', SvgIcon)
// const req = require.context('@/images/wap/svg', false, /\.svg$/)
// const requireAll = requireContext => requireContext.keys().map(requireContext)
// requireAll(req)

const RadioBox = Vue.extend({
  template:`
    <div class="pc-radio-box" :style="{paddingBottom: radios + '%'}">
      <slot name="custom"></slot>
      <div class="pc-radio-box_container">
        <slot></slot>
      </div>
    </div>
  `,
  props: {
    radios: {
      type: Number,
      default: 56.25 // 16:9
    }
  }
})
Vue.component('radio-box', RadioBox)
Vue.filter('imgPath', (url) => {
  return process.env.VUE_APP_BASE_URL + '/' + url
})

Vue.prototype.$langPre = location.pathname.startsWith('/zh') ? 'zh' : 'en'
Vue.prototype.$linkPre = '/' + Vue.prototype.$langPre
Vue.prototype.$imgBase = process.env.VUE_APP_BASE_URL
Vue.prototype.$isMobile = hasMobile()
if (!Vue.prototype.$isMobile) {
  document.body.className = 'pc-body pc-body-init'
} else {
  document.body.style.overflowY = 'auto'
}
// 监听resize
// var resizeTimer = null;
// window.onresize = function(){
//   if (resizeTimer) clearTimeout(resizeTimer);
//   resizeTimer = setTimeout(function(){
//     Vue.prototype.$isMobile = hasMobile() 
//     console.log(hasMobile())  
//   }, 100);
// }
export const getQueryVariable = (variable) => {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=")
      if (pair[0] === variable) { return pair[1]; }
  }
  return ''
}

Vue.directive("ready", {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    var div = document.createElement('div');
		div.innerHTML = `
      <img src="../images/logo.png" />
    `; //设置显示的数据，可以是标签．
		div.className = "page-loading";//设置div的属性，如：class，title，id 等等
		var body = document.body; //获取body对象.
		//动态插入到body中
		body.insertBefore(div, body.firstChild);
    let isComplete = false
    let timeOut = false
    setTimeout(() => {
      if (isComplete) {
        div.className = 'hide-page-loading'
      }
      timeOut = true
    }, 1000)
    document.onreadystatechange = () => {
      if (document.readyState === 'complete') {
        // document ready
        isComplete = true
        if (timeOut) {
          div.className = 'hide-page-loading'
        }
      }
    };
  },
});
const bannerAPI = `/commonBanner`
export const viewMixin = {
  data() {
    return {
      banner: '',
      zhLang: {
        newsDate: '发布日期：',
        more: '加载更多',
        nomore: '- 已全部加载 -',
        readMore: '查看更多'
      },
      enLang: {
        newsDate: 'Date Published : ',
        more: 'Read More',
        nomore: '- THE END -',
        readMore: 'Read More'
      }
    }
  },
  created() {
    if (Object.prototype.toString.call(this.banner) === '[object String]') {
      instance.get(bannerAPI).then(async res => {
        if (res.code === 200) {
            this.banner = this.$imgBase + res.data[`${this.$langPre}_banner`]
          }
      })
    }
  },
  components: {
    wapFooter,
    wapHeader,
    PcFooter,
    'pc-header': PCHeader
  },
  computed: {
    langs() {
      return this[`${this.$langPre}Lang`]
    }
  }
}
