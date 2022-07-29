import Vue from 'vue'
import instance from "@/js/http.js"
import { getCookie, setCookie } from '@/utils/helper.js'
const cookieName = 'cookie_accpet'
// 订阅我们的新闻
// 提交你的邮箱来跟进我们后续的更新和新闻，我们保证绝对不会向你发送垃圾邮件
// 订阅
export default Vue.extend({
  name: 'CookieTip',
  template:`
    <div class="cookie-box" :class="{'is-mobile': $isMobile}" :style="{display: acceptValue ? 'block' : 'none'}">
      <div class="cookie-con" :class="{'is-en': $langPre === 'en'}">
        {{langs.tips}}
        <a class="cookie-more" :href="policyHref" target="_blank">{{langs.more}}</a>
        <a v-if="!$isMobile" class="cookie-agree" href="javascript:;" @click="agree">{{langs.agree}}</a>
        <a v-if="!$isMobile" class="cookie-agree cookie-agree-x" href="javascript:;" @click="close">{{langs.close}}</a>
      </div>
      <div v-if="$isMobile" class="cookie-agree-box">
        <a class="cookie-agree" href="javascript:;" @click="agree">{{langs.agree}}</a>
        <a class="cookie-agree cookie-agree-x" href="javascript:;" @click="close">{{langs.close}}</a>
      </div>
    </div>
    `,
  data() {
    return {
      acceptValue: false,
      policyHref: `/${this.$langPre}/policy.html`,
      zhLang: {
        tips: '感谢您对我们的关注，请同意我们使用Cookies来提高您的体验质量。Cookies是什么？能吃吗？点击',
        more: '这里了解更多',
        close: '关闭',
        agree: '同意'
      },
      enLang: {
        tips: 'Hi web-surfer! Finally got you here. By continuing with our site, you are agreeing to our standard uses of cookies.',
        more: 'To learn more please read our Privacy Policy',
        close: 'CLOSE',
        agree: 'AGREE'
      }
    }
  },
  async mounted() {
    this.acceptValue = !getCookie(cookieName)
  },
  computed: {
    langs() {
      return this[`${this.$langPre}Lang`]
    }
  },
  methods: {
    agree() {
      setCookie(cookieName, true)
      this.acceptValue = false
    },
    close() {
      // setCookie(cookieName, false)
      this.acceptValue = false
    }
  }
})