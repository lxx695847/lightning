
import Vue from 'vue';
import { getQueryVariable, viewMixin } from './common.js'
import instance from "./http.js"
import QRCode from 'qrcodejs2'
import { hasMobile } from '@/utils/index.js'
import { formatDate } from '@/utils/dateUtil'
const isDev = process.env.NODE_ENV === "development";
const deviceName = hasMobile() ? 'wap' : 'pc'
if (isDev) {
  require(`raw-loader!@/scss/${deviceName}/newsDetail.scss`);
  require("@/views/newsDetail.html");
} else {
  require(`@/scss/${deviceName}/newsDetail.scss`);
}
const newsAPI = {
  detail: '/articleDetail'
}
new Vue({
  el: '#newsDetailApp',
  mixins: [viewMixin],
  data() {
    return {
      detail: {
        banner: '',
        title: '',
        intro: '',
        publishTime: '',
        content: ''
      },
      share: {
        height: 500,
        width: 750
      }
    }
  },
  created() {
    this.loadData()
  },
  computed: {
    shareTop() {
      return (screen.height - this.share.height) / 2
    },
    shareLeft() {
      return (screen.width - this.share.width) / 2
    },
    shareWindow() {
      const { height, width } = this.share
      const top = this.shareTop
      const left = this.shareLeft
      return `height=${height}, width=${width}, top=${top}, left=${left}, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no`
    }
  },
  methods: {
    async loadData() {
      const aid = getQueryVariable('id')
      const res = await instance.get(newsAPI.detail, {
        params: { aid }
      })
      if (res.code === 200) {
        if (!res.data) {
          window.location.href = `${this.$linkPre}/404.html`
        } else {
          const resData = res.data
          const { detail } = this
          detail.title = resData[`${this.$langPre}_title`]
          detail.intro = resData[`${this.$langPre}_intro`]
          detail.publishTime = formatDate(resData.publish_time * 1000),
          detail.content = resData[`${this.$langPre}_detail`]
          detail.banner = this.$imgBase + resData[`${this.$langPre}_banner`]
          this.initMeta()
          this.$nextTick(() => {
            this.markQrCode()
          })
        }
      }
    },
    markQrCode() {
      // 生成二维码
      new QRCode("qrcode", {
        text: location.href,
        width: 100,
        height: 100,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });
    },
    shareWeibo() {
      const shareTitle = this.detail.title
      const shareText = this.detail.intro
      const params = {
        url: window.location.href,
        // type: '3',
        // count: '1', /** 是否显示分享数，1显示(可选)*/
        // appkey: '', /** 您申请的应用appkey,显示分享来源(可选)*/
        title: shareTitle, /** 分享的文字内容(可选，默认为所在页面的title)*/
        // pic: '', /**分享图片的路径(可选)*/ 
        // ralateUid:'', /**关联用户的UID，分享微博会@该用户(可选)*/
        rnd: new Date().valueOf()
      }
      var temp = [];
      for( var p in params ) {
        temp.push(p + '=' +encodeURIComponent(params[p] || ''))
      }
      var targetUrl = 'http://service.weibo.com/share/share.php?' + temp.join('&');
      window.open(targetUrl, 'sinaweibo', this.shareWindow);
    },
    shareTwitter() {
      const path = encodeURIComponent(location.href)
      const twitterHost = "http://twitter.com/share"
      const shareTitle = this.detail.title
      const shareText = this.detail.intro
      var targetUrl = `${twitterHost}?url=${path}&text=${shareTitle}\n${shareText}&display=popup&ref=plugin&src=share_button`
      window.open(targetUrl, 'twitter', this.shareWindow);
    },
    shareFacebook() {
      const path = encodeURIComponent(location.href)
      const facebookHost = 'http://www.facebook.com/sharer.php'
      const shareTitle = this.detail.title
      const shareText = this.detail.intro
      let metaArr = [
        'og:url', location.host,
        'og:title', shareTitle,
        'og:description', shareText,
        // 'og:image', 'http://gg.chendahai.cn/static/image/apple.jpg',
        'og:type', 'website'
      ]
      let metaParams = metaArr.toString()
      var targetUrl = `${facebookHost}?u=${path}?meta=${metaParams}`
      window.open(targetUrl, 'facebook', this.shareWindow);  
    },
    initMeta() {
      const title = {
        zh: `${this.detail.title} - Lightning games`,
        en: `${this.detail.title} - Lightning games`
      }
      document.title = title[this.$langPre]
    }
  }
})