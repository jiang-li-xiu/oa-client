<template>
  <div :class="{'hidden':hidden}" class="pagination-container">
    <el-pagination
      :background="background"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { scrollTo } from '@/utils/performance/scroll-to'
import { mapGetters } from "vuex";

export default {
  name: 'Pagination',
  props: {
    total: {
      required: false,
      type: Number,
      default: 0
    },
    page: {
      type: [Number, String],
      default: 1
    },
    limit: {
      type: [Number, String],
      default: 15,
      required: false
    },
    pageSizes: {
      type: Array,
      default() {
        return [15, 30, 50, 100, 150]
      }
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    background: {
      type: Boolean,
      default: true
    },
    autoScroll: {
      type: Boolean,
      default: true
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ]),
    currentPage: {
      get() {
        return Number(this.page)
      },
      set(val) {
        this.$emit('update:page', Number(val))
      }
    },
    pageSize: {
      get() {
        return Number(this.limit)
      },
      set(val) {
        this.$emit('update:limit', Number(val))
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('pagination', { page: this.currentPage, limit: val })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
    handleCurrentChange(val) {
      this.$emit('pagination', { page: val, limit: this.pageSize })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    }
  }
}
</script>

<style scoped>
.pagination-container {
  height: 35px;
  background: #fff;
  padding: 32px 16px;
}
.pagination-container.hidden {
  display: none;
}
.pagination-container .el-pagination {
	right: 0;
	position: absolute;
}
</style>
