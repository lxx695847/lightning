import Vue from 'vue'
export default Vue.extend({
  template:`
    <li class="pc-pagination_page">
      <span v-if="page === null" class="dots">...</span>
      <span
        v-else
        class="item"
        type="button"
        :aria-label="'Go to page' + page"
        :class="{ 'is-active': isActive }"
        @click="clickHandler"
      >
        {{ page }}
      </span>
    </li>
  `,
  props: {
    isActive: {
      type: Boolean,
      default: false
    },
    page: {
      type: Number,
      default: null
    }
  },
  inject: ['loading'],
  methods: {
    clickHandler() {
      const props = this.$props;
      if (!this.loading) {
        this.$emit("update", props.page);
      }
    }
  },
})