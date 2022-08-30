import Vue from 'vue'
import instance from "@/js/http.js"
// 订阅我们的新闻
// 提交你的邮箱来跟进我们后续的更新和新闻，我们保证绝对不会向你发送垃圾邮件
// 订阅
export default Vue.extend({
  name: 'wapFooter',
  template:`
    <div class="wap-footer" id="wapFooter">
      <div class="wap-footer_container">
        <div class="wap-footer_logo">
          <a v-for="(mItem, index) in footer.media" :key="index" :href="mItem.src">
            <img :src="mItem.icon" alt="">
          </a>
        </div>
        <div class="wap-footer_img">
          <img :src="footer.footerLogo" alt="">
        </div>
        <div class="wap-footer_subscribe">
          <p class="title">{{langs.subscribeTitle}}</p>
          <p class="subtitle"><span>{{langs.subscribeTip}}</span></p>
          <p class="email">
            <input type="text" :placeholder="langs.email" v-model="footer.email">
            <span @click="subscribe()">{{langs.subscribe}}</span>
          </p>
        </div>
        <div class="wap-footer_copyright">
          <a v-for="(item, index) in footer.copyright" :key="index" :href="item.src || 'javascript:void(0)'">
            {{item.title}}
          </a>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      footer: {
        footerLogo: require('../../../images/wap/footer-logo.png'),
        copyright: [],
        media: [],
        email: '',
        zhLang: {
          email: '邮箱地址',
          subscribe: '订阅',
          subscribeTitle: '订阅我们的新闻',
          subscribeTip: '提交你的邮箱来跟进我们后续的更新和新闻，我们保证绝对不会想你发送垃圾邮件',
          subscribeThanks: '感谢！',
          subscribeSuccess: '，已开启订阅。',
          subscribeError: '电子邮件格式不正确，请重新输入!'
        },
        enLang: {
          email: 'E-mail Address',
          subscribe: 'Subscribe',
          subscribeTitle: 'Follow Us',
          subscribeTip: 'Subscribe to our newsletter for the latest news & updates',
          subscribeThanks: 'Thank you! ',
          subscribeSuccess: ' has been confirmed.',
          subscribeError: 'Email format is incorrect, please re-enter!'
        }
      },
    }
  },
  async created() {
    const { footer } = this
    const footerRes = await instance.get('/getFooter')
    if(footerRes.code === 200) {
      const resData = footerRes.data.copyright[this.$langPre]
      footer.copyright = resData.map(item => {
        return {
          title: item[`${this.$langPre}_title`],
          src: item[`${this.$langPre}_src`]
        }
      })
      footer.media = footerRes.data.media.map(item => {
        return {
          src: item[`${this.$langPre}_src`],
          icon: this.$imgBase + item.icon
        }
      })
    }
  },
  computed: {
    isEn() {
      return this.header.locale === 'en'
    },
    langs() {
      return this.footer[`${this.$langPre}Lang`]
    }
  },
  methods: {
    async subscribe() {
      const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if(reg.test(this.footer.email)) {
        const res = await instance.post('/emailSend', {
          email: this.footer.email
        })
        if (res.status === 1) {
          alert(`${this.langs.subscribeThanks}${this.email}${this.langs.subscribeSuccess}`)
        }
      } else {
        alert(this.langs.subscribeError)
      }
    }
  }
})
