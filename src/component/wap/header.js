import Vue from 'vue'
import instance from "@/js/http.js"
// 订阅我们的新闻
// 提交你的邮箱来跟进我们后续的更新和新闻，我们保证绝对不会向你发送垃圾邮件
// 订阅
export default Vue.extend({
  template:`
    <div class="wap-header" id="wapHeader">
      <van-popover v-model="openMenu" placement="bottom-start" get-container="#wapHeader">
        <template v-slot:reference>
          <div class="wap-header_menu" @click="showMenus"></div>
        </template>
        <div class="wap-header_popup">
          <a class="wap-header_popup-menu"
            v-for="(item, index) in menus"
          :class="{'is-active': activeIndex === index}"
          :key="index" :href="item.url">{{item.title}}</span>
        </div>
      </van-popover>
      <div class="wap-header_logo">
        <a class="img-box" :href="$linkPre"></a>
      </div>
      <a class="wap-header_lang" :href="langHref">
        <img :src="langImg" @click="goHome"/>
      </a>
    </div>
  `,
  data() {
    return {
      langImg: require(`../../images/wap-lang-${this.$langPre === 'zh' ? 'en' : 'zh'}.png`),
      openMenu: false,
      activeIndex: 0,
      menus: []
    }
  },
  async created() {
    const res = await instance.get('/getNav')
    if(res.code === 200) {
      const resData = res.data[this.$langPre]
      const homeMenu = {
        url: this.$linkPre,
        title: '首页'
      }
      this.menus = [
        homeMenu,
        ...resData.map(item => {
          return {
            url: item[`${this.$langPre}_url`],
            title: item[`${this.$langPre}_title`],
            sub: item.sub?.map(sub => {
              return {
                id: sub.id,
                title: sub[`${this.$langPre}_title`],
                url: sub[`${this.$langPre}_url`],
              }
            })
          }
        })
      ]
    }
  },
  methods: {
    showMenus() {
      this.openMenu = !this.openMenu
    },
    goHome() {}
  },
  computed: {
    langHref() {
      const toLang = `/${this.$langPre === 'zh' ? 'en' : 'zh'}`
      const pathname = location.pathname
      return pathname.replace(`/${this.$langPre}`, toLang) + location.search
    }
  }
})



