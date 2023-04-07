<!--
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-09-01 09:39:05
 * @LastEditors: JLX
 * @LastEditTime: 2022-10-18 09:03:47
-->
<template>
  <div class="container">
    <a-skeleton :loading="loading">
      <div class="title">
        <span>{{ title }}</span>
        <a @click="handleTo">更多</a>
      </div>
      <div class="content-list">
        <div v-for="(item, index) in contentList" :key="index" class="content">
          <p>{{ item.title }}</p>
          <p>{{ item.creationTime }}</p>
        </div>
      </div>
    </a-skeleton>
  </div>
</template>

<script>
export default {
  props: {
    // 标题
    title: {
      type: String,
      default: ''
    },
    // 内容列表
    contentList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: true
    }
  },
  created() {
    setTimeout(() => {
      this.loading = !this.loading
    }, 1000)
  },
  methods: {
    handleTo() {
      this.$emit('handleDetail')
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  background-color: #fff;
  height: 280px;
  padding: 5px;
  .title {
    display: flex;
    justify-content: space-between;
    margin: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eff1f3;
    span {
      font-size: 16px;
      color: #101026;
    }
  }
  .content-list {
    height: 200px;
    overflow-y: scroll;
    // &:hover {
    //   box-shadow: 0px 0px 8.28px 0.72px rgba(111, 121, 138, 0.1);
    // }
    .content {
      display: flex;
      justify-content: space-between;
      margin: 0 20px;
      p:first-child {
        color: #101026;
      }
    }
  }
}

.content-list::-webkit-scrollbar {
  width: 2px;
}
/*定义滚动条轨道*/
::-webkit-scrollbar-track {
  background-color: transparent;
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}
/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  background-color: rgba(84, 112, 155, 0.1);
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}
</style>
