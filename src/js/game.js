
import Vue from 'vue'
import Swiper from 'swiper'
import { hasMobile } from '@/utils/index.js'
import { getQueryVariable, viewMixin, findVideoCover } from './common.js'
import instance from "./http.js"
import { formatDate } from '@/utils/dateUtil'
const isDev = process.env.NODE_ENV === "development";
const deviceName = hasMobile() ? 'wap' : 'pc'
if (isDev) {
  require(`raw-loader!@/scss/${deviceName}/game.scss`);
  require("@/views/game.html");
} else {
  require(`@/scss/${deviceName}/game.scss`);
}
const gamesAPI = {
  detail: '/gameDetail',
  newsList: '/getArticle'
}
const baseURL = process.env.VUE_APP_BASE_URL
const app = new Vue({
  el: '#appGame',
  mixins: [viewMixin],
  data() {
    return {
      detail: {
        banner: '',
        content: '',
        videoSrc: '',
        videoPoster: '',
        picGroup: [], // en_pic_group
        payInfo: []
      },
      relateNewsHref: `${this.$linkPre}/news.html`,
      news: [],
      preview: {
        visible: false,
        src: ''
      },
      video: {
        visible: false,
        src: '',
        post: '', // 第一帧图片
        isPlay: false
      },
      pc: {
        moreContent: {
          show: false, // 是否显示  show all
          isAll: false, // 当前是展开状态
          rangeHeight: 0
        }
      },
      wap: {
        showPayInfo: false, // 显示支付方式
        showVideo: false, // 弹窗播放视频
      },
      zhLang: {
        buy: '立即购买',
        gallery: '游戏截图',
        relatedNews: '相关新闻',
        releaseDate: '发布时间'
      },
      enLang: {
        buy: 'BUY NOW',
        gallery: 'GALLERY',
        relatedNews: 'Related News',
        releaseDate: 'Release Date'
      }
    }
  },
  created() {
    this.loadData()
  },
  // computed: {
  //   payInfoStyle() {
  //     const count = this.detail.payInfo.length
  //     return {
  //       transform: `translateX(-${(count*99 + (count - 1) * 15 - 217) / 2}px)`
  //     }
  //   }
  // },
  methods: {
    initDomEvent() {
      if (this.$isMobile) {
        this.$nextTick(() => {
          new Swiper(".wap-game_gallery-swiper", {
            pagination: {
              el: ".swiper-pagination",
            },
          });
        })
      } else {
        var swiper = new Swiper(".pc-game_gallery-thumbs", {
          loop: false,
          spaceBetween: 10,
          slidesPerView: 4,
          freeMode: true,
          watchSlidesProgress: true,
          scrollbar: {
            el: '.pc-game_gallery-scrollbar',
            draggable: true
          },
        });
        var swiper2 = new Swiper(".pc-game_gallery-top", {
          loop: true,
          spaceBetween: 10,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          },
          thumbs: {
            swiper: swiper,
          }
        });
        this.$refs.mediaPlay.addEventListener('play', () => {
          this.video.isPlay = true
        });
        this.$refs.mediaPlay.addEventListener('pause', () => {
          this.video.isPlay = false
        });
        this.$nextTick(() => {
          this.contentOpen()
        })
      }
    },
    // pc端展开关闭
    contentOpen() {
      const { moreContent } = this.pc
      const contentDom = this.$refs.contentText
      const range = document.createRange()
      range.setStart(contentDom, 0)
      range.setEnd(contentDom, contentDom.childNodes.length);
      const rangeHeight = range.getBoundingClientRect().height;
      moreContent.rangeHeight = rangeHeight
      if (rangeHeight > contentDom.offsetHeight) {
        moreContent.show = true
      }
    },
    showAllContent() {
      const { moreContent } = this.pc
      moreContent.isAll = !moreContent.isAll
      const contentText = this.$refs.contentText
      const contentBox = this.$refs.contentBox
      if (moreContent.isAll) {
        const className = contentText.className
        contentText.className = className + ' height-auto'
        contentBox.style.height = moreContent.rangeHeight + 'px'
      } else {
        this.$refs.contentText.className = ''
      }
    },
    loadData() {
      const gid = getQueryVariable('id')
      instance.get(gamesAPI.detail, {
        params: { gid }
      }).then(async res => {
        if (res.code === 200) {
          if (res.data.length === 0) {
            window.location.href = `${this.$linkPre}/404.html`
          } else {
            const { detail } = this
            const resData = res.data[0]
            detail.content = resData[`${this.$langPre}_intro`]
            detail.videoSrc = this.$imgBase + resData[`${this.$langPre}_video_src`]
            detail.picGroup = resData[`${this.$langPre}_pic_group`].map(item => {
              return {
                src: this.$imgBase + item.src
              }
            })
            detail.payInfo = resData.pay_info?.map(pay => {
              return {
                payUrl: pay.pay_url,
                thumb: this.$imgBase + pay.thumb
              }
            })
            detail.payInfo = [
              ...detail.payInfo,
              ...detail.payInfo,
              ...detail.payInfo
            ]
            detail.banner = this.$imgBase + resData[`${this.$langPre}_banner`]
            this.detail.videoPoster = findVideoCover.call(this, document.getElementById('videoBox'), 160)
            this.$nextTick(() => {
              this.initDomEvent()
            })
          }
        }
      })
      // 相关资讯列表
      instance.get(gamesAPI.newsList, {
        params: {
          gid,
          pageSize: 3
        }, 
      }).then(res => {
        if (res.code === 200) {
          this.news = res.data.list.map(item => {
            return {
              thumb: this.$imgBase + item[`${this.$langPre}_thumb`],
              id: item.id,
              href: `${this.$linkPre}/newsDetail.html?id=${item.id}`,
              title: item[`${this.$langPre}_title`],
              publishTime: formatDate(item.publish_time * 1000),
              intro: item[`${this.$langPre}_intro`]
            }
          })
        }
      })
    },
    previewImage(index) {
      this.preview.src = this.detail.picGroup[index].src
      this.preview.visible = true
      document.body.parentNode.style.overflow = 'hidden'
    },
    closePreview() {
      this.preview.src = ''
      document.body.parentNode.style.overflow = 'auto'
      this.preview.visible = false
    },
   
    // 显示视频播放框
    showVideoBox() {
      var videoElement = this.$refs.mediaPlay;
      this.video.visible = !this.video.visible
      // videoElement.currentTime = 0
      var videoElement = this.$refs.mediaPlay;
      videoElement.play()
      document.body.parentNode.style.overflow = 'hidden'
    },
    // 隐藏视频播放框
    hideVideoBox() {
      this.video.visible = !this.video.visible
      var videoElement = this.$refs.mediaPlay;
      videoElement.pause();
      document.body.parentNode.style.overflow = 'auto'
    },
    playVideo() {
      var videoElement = this.$refs.mediaPlay;
      videoElement.paused === true ? videoElement.play() : videoElement.pause();
    },
    // cumputeDate(time) {
    //   if (!time) return
    //   const dateTime = new Date(time * 1000)
    //   const day = allDate[dateTime.getDay()].slice(0, 3)
    //   const month = allMonth[dateTime.getMonth()].slice(0, 3)
    //   const date = dateTime.getDate()
    //   if (this.$langPre === 'en') {
    //     return `${day}, ${month} ${date}`
    //   }
    //   return `${month}月${date}日`
    // },
    initMeta() {
      const title = {
        zh: `全部游戏 - Lightning games`,
        en: `Games - Lightning games`
      }
      document.title = title[this.$langPre]
    }
  }
})
