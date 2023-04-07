<!--
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-09-01 10:31:06
 * @LastEditors: JLX
 * @LastEditTime: 2022-09-01 14:37:07
-->
<template>
  <a-card :loading="loading" :bordered="false">
    <div class="salesCard">
      <a-row>
        <a-col :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
          <bar title="供应商供货量统计" :dataSource="barData" />
        </a-col>
        <a-col :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
          <bar title="产品采购统计" :dataSource="barData" yaxisText='x'/>
        </a-col>
      </a-row>
    </div>
  </a-card>
</template>

<script>
import Bar from '@/components/chart/Bar'

const barData = []
for (let i = 0; i < 5; i += 1) {
  barData.push({
    x: `${i + 1}月`,
    y: Math.floor(Math.random() * 1000) + 200
  })
}
export default {
  components: { Bar },
  data() {
    return {
      loading: true,
      barData
    }
  },
  created() {
    setTimeout(() => {
      this.loading = !this.loading
    }, 1000)
  }
}
</script>

<style lang="less" scoped>
.salesCard {
  padding: 2010px;
}
</style>
