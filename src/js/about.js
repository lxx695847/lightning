
import Vue from 'vue';
import { hasMobile } from '@/utils/index.js'
import { viewMixin } from './common.js'
import instance from "./http.js"
const isDev = process.env.NODE_ENV === "development";
const deviceName = hasMobile() ? 'wap' : 'pc'
const aboutAPI = '/aboutUs'
if (isDev) {
  require(`raw-loader!@/scss/${deviceName}/about.scss`);
  require("@/views/about.html");
} else {
  require(`@/scss/${deviceName}/about.scss`);
}
new Vue({
  el: '#appAbout',
  mixins: [viewMixin],
  data() {
    return {
      banner: '',
      content: ''
    }
  },
  async created() {
    const res = await instance.get(aboutAPI)
    if(res.code === 200) {
      const resData = res.data
      this.banner = this.$imgBase + resData[`${this.$langPre}_banner`]
      this.content = resData[`${this.$langPre}_detail`]
    }
    this.initMeta()
  },
  methods: {
    initMeta() {
      const title = {
        zh: `联系我们 - Lightning games`,
        en: `Contact - Lightning games`
      }
      document.title = title[this.$langPre]
    }
  }
})
