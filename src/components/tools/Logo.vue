<!--
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-08-22 16:37:44
 * @LastEditors: JLX
 * @LastEditTime: 2023-01-09 09:50:19
-->
<template>
  <div class="logo">
    <router-link :to="routerLinkTo">

      <!-- update-begin- author:sunjianlei --- date:20190814 --- for: logo颜色根据主题颜色变化 -->
      <img v-if="navTheme === 'dark'" src="~@/assets/new_logo.png" alt="logo" class="new_logo">
      <img v-else src="~@/assets/new_logo.png" alt="logo" class="new_logo">
      <!-- update-begin- author:sunjianlei --- date:20190814 --- for: logo颜色根据主题颜色变化 -->

      <h1 v-if="showTitle">{{ title }}</h1>
    </router-link>
  </div>
</template>

<script>
  import { mixin } from '@/utils/mixin.js'

  export default {
    name: 'Logo',
    mixins: [mixin],
    props: {
      title: {
        type: String,
        default: '路盛通企业管理系统',
        required: false
      },
      showTitle: {
        type: Boolean,
        default: true,
        required: false
      },
      // 点击Logo跳转地址
      routerLinkTo: {
        type: Object,
        default: () => ({name: 'dashboard'}),
      },
    }
  }
</script>
<style lang="less" scoped>
  /*缩小首页布 局顶部的高度*/
  @height: 59px;

  .sider {
    box-shadow: none !important;
    .logo {
      height: @height !important;
      line-height: @height !important;
      box-shadow: none !important;
      transition: background 300ms;

      a {
        color: white;
        &:hover {
          color: rgba(255, 255, 255, 0.8);
        }
      }

      .new_logo{
        width: 150px;
        height: 48px;
      }
    }

    &.light .logo {
      background-color: @primary-color;
    }
  }
</style>