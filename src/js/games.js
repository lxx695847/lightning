
import Vue from 'vue';
import { viewMixin } from './common.js'
import instance from "./http.js"
import { hasMobile } from '@/utils/index.js'
import { formatDate } from '@/utils/dateUtil'
const isDev = process.env.NODE_ENV === "development";
const deviceName = hasMobile() ? 'wap' : 'pc'
if (isDev) {
  require(`raw-loader!@/scss/${deviceName}/games.scss`);
  require("@/views/games.html");
} else {
  require(`@/scss/${deviceName}/games.scss`);
}
const gamesAPI = {
  list: '/gameList'
}
const app = new Vue({
  el: '#appGames',
  mixins: [viewMixin],
  data() {
    return {
      gameList: [],
      zhLang: {
        releaseDate: '发布时间',
        developer: '开发者',
        keywords: '游戏类型'
      },
      enLang: {
        releaseDate: 'Release Date',
        developer: 'Developer',
        keywords: 'Keywords'
      }
    }
  },
  async created() {
    const res = await instance.get(gamesAPI.list)
    if (res.code === 200) {
      this.gameList = res.data.map(item => {
        return {
          id: item.id,
          href: `/${this.$langPre}/game.html?id=${item.id}`,
          thumb: this.$imgBase + item[`${this.$langPre}_thumb`],
          game: item[`${this.$langPre}_game`],
          publishTime: formatDate(item[`${this.$langPre}_publish_time`] * 1000, { hasHour: false}),
          develop: item[`${this.$langPre}_develop`],
          keyword: item[`${this.$langPre}_keyword`],
          intro: item[`${this.$langPre}_intro`]
        }
      })
    }
    this.initMeta()
  },
  directives: {
    // 自定义提示指令
    tooltip: {
      bind: function(el, binding) {
        // 鼠标移入时，将浮沉元素插入到body中
        el.onmouseenter = function(e) {
          // 创建浮层元素并设置样式
          const vcTooltipDom = document.createElement('div')
          vcTooltipDom.style.cssText = `
            overflow: auto;
            position:absolute;
            background: #FFFFFF;
            color:#666;
            box-shadow: rgba(168, 168, 168, 0.295) 1px 2px 10px;
            border-radius:5px;
            padding:10px 15px;
            display:inline-block;
            font-size:14px;
            z-index:2
          `
          // 设置id方便寻找
          vcTooltipDom.setAttribute('id', 'vc-tooltip')
          // 将浮层插入到body中
          document.body.appendChild(vcTooltipDom)
          // 浮层中的文字 通过属性值传递动态的显示文案
          const tipsDom = document.createElement('div')
          tipsDom.setAttribute('class', 'pc-games_tooltip')
          tipsDom.innerHTML = `${el.getAttribute('tips')}`
          document.getElementById('vc-tooltip').appendChild(tipsDom)
          // document.getElementById('vc-tooltip').innerHTML = `
          //   ${el.getAttribute('tips')}
          // `
        }
        // 鼠标移动时，动态修改浮沉的位置属性
        el.onmousemove = function(e) {
          const vcTooltipDom = document.getElementById('vc-tooltip')
          vcTooltipDom.style.top = e.pageY  + 15 + 'px'
          vcTooltipDom.style.left = e.pageX + 15 + 'px'
        }
        // 鼠标移出时将浮层元素销毁
        el.onmouseleave = function() {
          // 找到浮层元素并移出
          const vcTooltipDom = document.getElementById('vc-tooltip')
          vcTooltipDom && document.body.removeChild(vcTooltipDom)
        }
      }
    }
  },
  methods: {
    initMeta() {
      const title = {
        zh: `全部游戏 - Lightning games`,
        en: `Games - Lightning games`
      }
      document.title = title[this.$langPre]
    }
  }
})
