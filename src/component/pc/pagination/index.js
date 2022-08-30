import Vue from 'vue'
import Page from './page.js'
export default Vue.extend({
  template:`
    <ul class="pc-pagination">
      <div :class="{ 'is-disabled': currentPage === 1 }" class="pc-pagination_prev" @click="goToPrev">
        <img :src="prevImg" alt="">
      </div>
      <page
        v-for="page in pagination"
        :key="'pagination-page-' + page"
        :is-active="currentPage === page"
        :page="page"
        @update="updatePageHandler"
      />
      <div
        :class="{ 'is-disabled': currentPage === pages }"
        class="pc-pagination_prev pc-pagination_next"
        @click="goToNext"
      >
        <img :src="prevImg" alt="">
      </div>
    </ul>
  `,
  name: "LtPagination",
  components: {
    Page
  },
  props: {
    pages: {
      type: Number,
      default: 0
    },
    rangeSize: {
      type: Number,
      default: 2
    },
    loading: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      currentPage: 1,
      prevImg: require('../../../images/pc-page-prev.png'),
    }
  },
  computed: {
    pagination() {
      const res = [];
      const props = this.$props
      const minPaginationElems = 5 + props.rangeSize * 2;
      let rangeStart = props.pages <= minPaginationElems ? 1 : this.currentPage - props.rangeSize;
      let rangeEnd = props.pages <= minPaginationElems ? props.pages : this.currentPage + props.rangeSize;
      rangeEnd = rangeEnd > props.pages ? props.pages : rangeEnd;
      rangeStart = rangeStart < 1 ? 1 : rangeStart;
      if (props.pages > minPaginationElems) {
        const isStartBoundaryReached = rangeStart - 1 < 3;
        const isEndBoundaryReached = props.pages - rangeEnd < 3;
        if (isStartBoundaryReached) {
          rangeEnd = minPaginationElems - 2;
          for (let i = 1; i < rangeStart; i++) {
            res.push(i);
          }
        } else {
          res.push(1);
          res.push(undefined);
        }
        if (isEndBoundaryReached) {
          rangeStart = props.pages - (minPaginationElems - 3);
          for (let i = rangeStart; i <= props.pages; i++) {
            res.push(i);
          }
        } else {
          for (let i = rangeStart; i <= rangeEnd; i++) {
            res.push(i);
          }
          res.push(undefined);
          res.push(props.pages);
        }
      } else {
        for (let i = rangeStart; i <= rangeEnd; i++) {
          res.push(i);
        }
      }
      return res;
    }
  },
  methods: {
    updatePageHandler(params) {
      this.currentPage = params;
      this.$emit("update:model:value", params);
    },
    goToPrev() {
      const props = this.$props
      if (this.currentPage > 1) {
        this.currentPage -= 1
        this.$emit("update:model:value", this.currentPage - 1);
      }
    },
    goToNext() {
      const props = this.$props
      if (this.currentPage < props.pages) {
        this.currentPage += 1
        this.$emit("update:model:value", this.currentPage);
      }
    }
  },
})
