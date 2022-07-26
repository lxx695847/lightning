
import Vue from 'vue';
import { hasMobile } from '@/utils/index.js'
import { viewMixin } from './common.js'
const isDev = process.env.NODE_ENV === "development";
const deviceName = hasMobile() ? 'wap' : 'pc'
if (isDev) {
  require(`raw-loader!@/scss/${deviceName}/404.scss`);
  require("@/views/404.html");
} else {
  require(`@/scss/${deviceName}/404.scss`);
}
new Vue({
  el: '#appNotFound',
  mixins: [viewMixin],
  async created() {
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
