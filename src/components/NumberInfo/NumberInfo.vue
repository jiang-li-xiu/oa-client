<!--
 * @Author       : Humility
 * @Date         : 2022-08-12 11:59:17
 * @LastEditTime : 2022-08-22 14:30:55
 * @LastEditors  : Humility
 * @FilePath     : \oa-client\src\components\NumberInfo\NumberInfo.vue
 * @Description  : 
-->
<template>
  <div :class="[prefixCls]">
    <slot name="subtitle">
      <div :class="[`${prefixCls}-subtitle`]">{{ typeof subTitle === 'string' ? subTitle : subTitle() }}</div>
    </slot>
    <div class="number-info-value">
      <span>{{ total }}</span>
      <span class="sub-total">
        {{ subTotal }}
        <icon :type="`caret-${status}`" />
      </span>
    </div>
  </div>
</template>

<script>
import Icon from 'ant-design-vue/es/icon'

export default {
  name: 'NumberInfo',
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-number-info'
    },
    total: {
      type: Number,
      required: true
    },
    subTotal: {
      type: Number,
      required: true
    },
    subTitle: {
      type: [String, Function],
      default: ''
    },
    status: {
      type: String,
      default: 'up'
    }
  },
  components: {
    Icon
  },
  data() {
    return {}
  }
}
</script>

<style lang="less" scoped>
// @import "index";
</style>