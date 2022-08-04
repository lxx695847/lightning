
import Vue from 'vue';
import { viewMixin } from './common.js'
import instance from "./http.js"
import { hasMobile } from '@/utils/index.js'
import { formatDate } from '@/utils/dateUtil'
import PCPagination from '@/component/pc/pagination'
const isDev = process.env.NODE_ENV === "development";
const deviceName = hasMobile() ? 'wap' : 'pc'
if (isDev) {
  require(`raw-loader!@/scss/${deviceName}/news.scss`);
  require("@/views/news.html");
} else {
  require(`@/scss/${deviceName}/news.scss`);
}
const newsAPI = {
  list: '/getArticle'
}
const app = new Vue({
  el: '#appNews',
  mixins: [viewMixin],
  components: {
    'pc-pagination': PCPagination
  },
  data() {
    return {
      banner: '',
      page: {
        data: [],
        loading: false,
        currentPage: 1,
        pageSize: 5,
        total: 0
      },
      zhLang: {
        loading: '加载中'
      },
      enLang: {
        loading: 'loading...'
      }
    }
  },
  created() {
    this.loadData(1)
    this.initMeta()
  },
  methods: {
    async loadData(currentPage = this.page.currentPage) {
      const { page } = this
      if (page.loading) return
      page.loading = true
      if (document && !this.$isMobile) {
        // document.body.scrollTop = '111px'
        document.documentElement.scrollTop = document.getElementById('bannerBox').offsetHeight;
      }
      const res = await instance.get(newsAPI.list, {
        params: {
          page: currentPage,
          pageSize: page.pageSize
        }
      })
      if (res.code === 200) {
        this.banner = this.$imgBase + res.data.banner[`${this.$langPre}_banner`]
        const result = res.data.list.map(item => {
          return {
            id: item.id,
            href: `/${this.$langPre}/newsDetail.html?id=${item.id}`,
            publishTime: item.publish_time ? formatDate(item.publish_time * 1000) : this.langs.noPublish,
            thumb: this.$imgBase + item[`${this.$langPre}_thumb`],
            title: item[`${this.$langPre}_title`],
            intro: item[`${this.$langPre}_intro`]
          }
        })
        if (this.$isMobile) {
          page.data.push(...result)
        } else {
          page.data = result
        }
        page.total = res.data.totalCount
      }
      page.loading = false
    },
    loadMore() {
      this.page.currentPage += 1
      this.loadData()
    },
    initMeta() {
      const title = {
        zh: '最近新闻 - Lightning games',
        en: 'News - Lightning games'
      }
      document.title = title[this.$langPre]
    }
  }
})