import Vue from 'vue'
import instance from "@/js/http.js"
// 订阅我们的新闻
// 提交你的邮箱来跟进我们后续的更新和新闻，我们保证绝对不会向你发送垃圾邮件
// 订阅
export default Vue.extend({
  template:`
    <div class="pc-header">
      <div class="pc-header_container common-container">
        <a class="pc-header_logo" :href="$linkPre"></a>
        <div class="pc-header_navs-box">
          <div class="pc-header_navs-item" v-for="(item, index) in header.navs" :key="index">
            <div class="title">
              <a :href="item.url" target="_blank">
                {{item.title}}
                <span v-if="item.sub && item.sub.length > 0"></span>
              </a>
            </div>
            <div class="menus" v-if="item.sub && item.sub.length > 0" :style="{'--menus-height': item.menusHeight + 'px'}">
              <a v-for="(sub, subIndex) in item.sub" :key="sub.id" :ref="'menu' + index +subIndex" :href="sub.url" target="_blank" class="submenu">
                {{sub.title}}
              </a>
            </div>
          </div>
        </div>
        <div class="pc-header_lang">
          <p class="pc-header_lang-current">
            <span v-if="$langPre === 'en'">ENGLISH</span>
            <span v-else>中文</span>
            <i></i>
          </p>
          <div class="pc-header_lang-list">
            <a :href="langHref" target="_blank">
              <span v-if="$langPre === 'en'">中文</span>
              <span v-else>ENGLISH</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      header: {
        navs: []
      }
    }
  },
  computed: {
    langHref() {
      const toLang = `/${this.$langPre === 'zh' ? 'en' : 'zh'}`
      const pathname = location.pathname
      return pathname.replace(`/${this.$langPre}`, toLang) + location.search
    }
  },
  async created() {
    const { header } = this
    const res = await instance.get('/getNav')
    if(res.code === 200) {
      const resData = res.data[this.$langPre]
      header.navs = resData.map(item => {
        return {
          url: item[`${this.$langPre}_url`],
          title: item[`${this.$langPre}_title`],
          menusHeight: 0,
          sub: item.sub?.map(sub => {
            return {
              id: sub.id,
              title: sub[`${this.$langPre}_title`],
              url: sub[`${this.$langPre}_url`],
            }
          })
        }
      })
      this.$nextTick(() => {
        this.header.navs.forEach((item, index) => {
          if (item.sub && item.sub.length > 0) {
            item.sub.forEach((subItem, subIndex) => {
              item.menusHeight += this.$refs['menu' + index + subIndex][0].offsetHeight + 1
            })
          }
        })
      })
    }
  }
})


