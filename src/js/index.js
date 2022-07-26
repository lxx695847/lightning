import { hasMobile } from '@/utils/index.js'
const isDev = process.env.NODE_ENV === "development";
const deviceName = hasMobile() ? 'wap' : 'pc'
if (isDev) {
  require(`raw-loader!@/scss/${deviceName}/index.scss`);
  require("@/views/index.html");
} else {
  require(`@/scss/${deviceName}/index.scss`);
}
import Vue from 'vue';
import {viewMixin} from './common.js'
import instance from "./http.js"
import { allMonth } from '@/utils/dateUtil'
const homeAPI = {
  banner: '/firstBanner',
  recommend: '/firstRecommend'
}
const imgBase = process.env.VUE_APP_BASE_URL
new Vue({
  el: '#appIndex',
  mixins: [viewMixin],
  data() {
    return {
      banner: {
        bg: '',
        btns: [],
        outpost: ''
      },
      gamesTitle: {
        content: '',
        url: '',
        more: ''
      },
      gamesList: [],
      newsTitle: {
        content: '',
        url: '',
        more: ''
      },
      newsList: []
    }
  },
  async created() {
    instance.get(homeAPI.banner).then(res => {
      if (res.code === 200) {
        const resData = res.data[0]
        const { banner } = this
        banner.bg = `${imgBase}${resData[this.$langPre+'_src']}`
        banner.outpost = `${imgBase}/${resData[this.$langPre+'_extra_img']}`
        banner.btns = resData[`${this.$langPre}_btn`].map(item => {
          return {
            src: imgBase + item.btn_src,
            url: item.btn_url
          }
        })
      }
    })
    instance.get(homeAPI.recommend).then(res => {
      const { gamesTitle, newsTitle } = this
      if (res.code === 200) {
        const [gamesRes, newsRes] = res.data
        this.gamesList = gamesRes.list.map(item => {
          return {
            // url: item[`${this.$langPre}_url`],
            href: `${this.$linkPre}/game.html?id=${item.gid}`,
            id: item.id,
            src: imgBase + item[`${this.$langPre}_src`],
            title: item[`${this.$langPre}_title`]
          }
        })
        gamesTitle.content = gamesRes[`${this.$langPre}_caption`]
        gamesTitle.url = gamesRes[`${this.$langPre}_more_url`]
        gamesTitle.more = gamesRes[`${this.$langPre}_more_title`]
        this.newsList = newsRes.list.map(item => {
          return {
            url: item[`${this.$langPre}_url`],
            src: imgBase + item[`${this.$langPre}_src`],
            title: item[`${this.$langPre}_title`],
            openTime: this.cumputeDate(item.openTime),
            isVideo: item.sort === 2
          }
        })
        newsTitle.content = newsRes[`${this.$langPre}_caption`]
        newsTitle.url = newsRes[`${this.$langPre}_more_url`]
        newsTitle.more = newsRes[`${this.$langPre}_more_title`]
      }
    }) 
  },
  mounted() {
    if (!this.$isMobile) {
      let isPage2 = false
      let endTime = 0
      const containerStyle = this.$refs.bannerBox.style
      const bodyDom = document.body
      const className = bodyDom.className
      const scrollPage = (isDown, pageY, e) => {
        if (new Date() - endTime < 500) return
        if(isDown && !isPage2){
          isPage2 = !isPage2;
          containerStyle.marginTop = `-100vh`;
          setTimeout(() => {
            bodyDom.className = className + ' page2'
          }, 500)
        } else if(!isDown && isPage2) {
          isPage2 = !isPage2;
          bodyDom.className = className
          containerStyle.marginTop = `0`;
        }
        endTime = new Date()
      }
      // 浏览器兼容写法
      const handler = (e) => {
        let isDown;
        const scrollTop0 = document.body.scrollTop || document.documentElement.scrollTop
        if (e.wheelDelta) {
          isDown = e.wheelDelta < 0
        } else if (e.detail) {
          isDown = e.detail > 0
        }
        if (scrollTop0 === 0) {
          scrollPage(isDown)
        }
      }
      document.onmousewheel = handler;
      document.addEventListener('DOMMouseScroll', handler);
      const scrollTop = document.body.scrollTop || document.documentElement.scrollTop
      if (scrollTop === 0) {
        scrollPage(false)
      } else {
        scrollPage(true)
      }
    }
  },
  methods: {
    cumputeDate(time) {
      if (!time) return
      const publishDate = new Date(time * 1000)
      return `${allMonth[publishDate.getMonth()]} ${publishDate.getDate()}`
    }
  }
})
