import Vue from 'vue'
import instance from "@/js/http.js"
// 订阅我们的新闻
// 提交你的邮箱来跟进我们后续的更新和新闻，我们保证绝对不会向你发送垃圾邮件
// 订阅
export default Vue.extend({
  name: 'Footer',
  template:`
    <div class="pc-footer">
      <div class="pc-footer_container">
        <div class="pc-footer_logos">
          <a v-for="(item, index) in footer.media"
            :key="index" :href="item.src" target="_blank">
            <img :src="item.icon" alt="">
          </a>
        </div>
        <div class="pc-footer_img"></div>
        <div class="pc-footer_intro">
          <p class="title">{{langs.subscribeTitle}}</p>
          <p class="desc">{{langs.subscribeTip}}</p>
          <p class="form">
            <input type="text" v-model="email" :placeholder="langs.email">
            <span @click="subscribe()">{{langs.subscribe}}</span>
          </p>
        </div>
        <div class="pc-footer_copyright">
          <a
            v-for="(item, index) in footer.copyright"
            :class="{'is-link': item.src}"
            :key="index" :href="item.src || 'javascript:void(0)'">
            {{item.title}}
          </a>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      footer: {
        copyright: [],
        media: []
      },
      email: '',
      zhLang: {
        email: '邮箱地址',
        subscribe: '订阅',
        subscribeTitle: '订阅我们的新闻',
        subscribeTip: '提交你的邮箱来跟进我们后续的更新和新闻，我们保证绝对不会向你发送垃圾邮件',
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
    }
  },
  async mounted() {
    const { footer } = this
    const res = await instance.get('/getFooter')
    if(res.code === 200) {
      const resData = res.data.copyright[this.$langPre]
      footer.copyright = resData.map(item => {
        return {
          title: item[`${this.$langPre}_title`],
          src: item[`${this.$langPre}_src`]
        }
      })
      footer.media = res.data.media.map((item) => {
        return {
          src: item[`${this.$langPre}_src`],
          icon: this.$imgBase + item.icon
        }
      })
    }
  },
  computed: {
    langs() {
      return this[`${this.$langPre}Lang`]
    }
  },
  methods: {
    async subscribe() {
      const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if(reg.test(this.email)) {
        const res = await instance.post('/emailSend', {
          email: this.email
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