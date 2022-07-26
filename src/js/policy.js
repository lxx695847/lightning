
import Vue from 'vue';
import { hasMobile } from '@/utils/index.js'
import { viewMixin } from './common.js'
import instance from "./http.js"
const isDev = process.env.NODE_ENV === "development";
const deviceName = hasMobile() ? 'wap' : 'pc'
const serviceAPI = '/getService'
if (isDev) {
  require(`raw-loader!@/scss/${deviceName}/policy.scss`);
  require("@/views/policy.html");
} else {
  require(`@/scss/${deviceName}/policy.scss`);
}
new Vue({
  el: '#appPolicy',
  mixins: [viewMixin],
  data() {
    return {
      content: ''
    }
  },
  async created() {
    const res = await instance.get(serviceAPI)
    if(res.code === 200) {
      const resData = res.data
      this.content = this.escape2Html(resData[`${this.$langPre}_content`])
    }
    this.initMeta()
  },
  methods: {
    initMeta() {
      const title = {
        zh: `隐私政策 - Lightning games`,
        en: `Privacy Policy - Lightning games`
      }
      document.title = title[this.$langPre]
    },
    escape2Html(str) {
      var arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'};
      return str.replace(/&(lt|gt|nbsp|amp|quot);/ig,function(all,t){return arrEntities[t];});
     }
  }
})
