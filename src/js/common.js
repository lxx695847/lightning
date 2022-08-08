import Vue from 'vue';
import { Col, Row } from 'vant';
import { Popover } from 'vant';
import instance from "./http.js"
import SvgIcon from '@/component/wap/SvgIcon.js'// svg组件
import wapFooter from '@/component/wap/footer.js'
import wapHeader from '@/component/wap/header.js'
import PcFooter from '@/component/pc/footer.js'
import PCHeader from '@/component/pc/header.js'
import cookieTip from '../component/cookie-tip.js'
import { hasMobile } from '@/utils/index.js'
import { isWeixn } from '@/utils/helper.js'
import eventBus from '@/utils/EventBus.js'
import '@/utils/dateUtil'
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
Vue.prototype.$isWeixin = isWeixn()
const bodyClass = document.body.className
if (!Vue.prototype.$isMobile) {
  document.body.className = bodyClass + ' pc-body pc-body-init'
} else {
  document.body.style.overflowY = 'auto'
  document.getElementsByTagName('html')[0].style.fontSize = '13.33vw'
  document.body.className = bodyClass + ' h-style'
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

// 获取第一帧图片
export function findVideoCover (video, width, height) {
  // 获取video节点
  video.currentTime = 1 // 第一帧
  //创建canvas对象
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  video.play();
  this.$nextTick(()=>{
    // 利用canvas对象方法绘图
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    // 转换成base64形式
    const img = canvas.toDataURL("image/jpeg") // 这个就是图片的base64
    return img
  })
}
Vue.directive("ready", {
  // 当被绑定的元素插入到 DOM 中时……
  bind (el, binding, vnode) {
    el.style.display = 'none'
    // 聚焦元素
    var div = document.createElement('div');
		div.innerHTML = `
      <img src="../images/logo.png" />
    `; //设置显示的数据，可以是标签．
		div.className = "page-loading";//设置div的属性，如：class，title，id 等等
		var body = document.body; //获取body对象.
    // body.scrollTop = 0
		//动态插入到body中
		body.insertBefore(div, body.firstChild);
    // let isComplete = false
    // let timeOut = false
    // setTimeout(() => {
    //   if (isComplete) {
    //     div.className = 'hide-page-loading'
    //     el.style.display = 'block'
    //     el.scrollTop = 0
    //     eventBus.$emit('showCallback')
    //   }
    //   timeOut = true
    // }, 1000)
    document.onreadystatechange = () => {
      if (document.readyState === 'complete') {
        // document ready
        // isComplete = true
        vnode.context.ready.state = true
        console.log(vnode.context.ready)
        // if (timeOut) {
        //   div.className = 'hide-page-loading'
        //   el.style.display = 'block'
        //   el.scrollTop = 0
        //   eventBus.$emit('showCallback')
        // }
      }
    };
  },
});
// const bannerAPI = `/commonBanner`
export const viewMixin = {
  data() {
    return {
      // banner: '',
      ready: {
        request: false,
        state: false
      },
      zhLang: {
        newsDate: '发布日期：',
        more: '加载更多',
        nomore: '- 已全部加载 -',
        readMore: '查看更多',
        publishTime: '发布日期',
        noPublish: '敬请期待'
      },
      enLang: {
        newsDate: 'Date Published : ',
        more: 'Read More',
        nomore: '- THE END -',
        readMore: 'Read More',
        publishTime: 'Date Published',
        noPublish: 'Coming Soon'
      }
    }
  },
  watch: {
    ready: {
      handler() {
        if (this.ready.request && this.ready.state) {
          setTimeout(() => {
            const div = document.querySelector('.page-loading')
            if (div) {
              div.className = 'hide-page-loading'
              this.$el.style.display = 'block'
              this.$el.scrollTop = 0
              eventBus.$emit('showCallback')
            }
          }, 1000)
        }
      },
      deep: true
    },
  },
  // created() {
  //   if (Object.prototype.toString.call(this.banner) === '[object String]') {
  //     instance.get(bannerAPI).then(async res => {
  //       if (res.code === 200) {
  //           this.banner = this.$imgBase + res.data[`${this.$langPre}_banner`]
  //         }
  //     })
  //   }
  // },
  components: {
    wapFooter,
    wapHeader,
    PcFooter,
    'pc-header': PCHeader,
    'cookie-tip': cookieTip
  },
  computed: {
    langs() {
      return this[`${this.$langPre}Lang`]
    }
  }
}
