<template>
  <div>
    <a-card :loading="loading" :bordered="false" title="">
      <a-row>
        <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
          <line-chart-multid :aliases="aliases" :fields="fields" :dataSource="visitInfo"></line-chart-multid>
        </a-col>
        <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24" class="log-content">
          <div class="log">
            <h3>日志</h3>
            <a-tooltip placement="topLeft" v-for="(item, index) in logList" :key="index" :mouseEnterDelay="0.6">
              <template slot="title">
                <span>{{ item.title }}</span>
              </template>
              <p class="log-info">{{ item.title }}</p>
            </a-tooltip>
          </div>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>
import Bar from '@/components/chart/Bar'
import LineChartMultid from '@/components/chart/LineChartMultid'
const barData = []
for (let i = 0; i < 12; i += 1) {
  barData.push({
    x: `${i + 1}月`,
    y: Math.floor(Math.random() * 1000) + 200
  })
}
export default {
  components: { Bar, LineChartMultid },
  data() {
    return {
      loading: true,
      barData,
      visitInfo: [
        { type: 'Jan', name: 7.0, sex: 3.9 },
        { type: 'Feb', name: 6.9, sex: 4.2 },
        { type: 'Mar', name: 9.5, sex: 5.7 },
        { type: 'Apr', name: 14.5, sex: 8.5 },
        { type: 'May', name: 18.4, sex: 11.9 },
        { type: 'Jun', name: 21.5, sex: 15.2 },
        { type: 'Jul', name: 25.2, sex: 17.0 },
        { type: 'Aug', name: 26.5, sex: 16.6 },
        { type: 'Sep', name: 23.3, sex: 14.2 },
        { type: 'Oct', name: 18.3, sex: 10.3 },
        { type: 'Nov', name: 13.9, sex: 6.6 },
        { type: 'Dec', name: 9.6, sex: 4.8 }
      ],
      logList: [
        { title: '登录登录 2022-09-01 10:00:00', id: 0 },
        { title: '我登录了admin账号, 你猜我要做什么,我登录了admin账号, 你猜我要做什么', id: 1 },
        { title: '我登录了admin账号, 你猜我要做什么', id: 3 },
        { title: '登录登录了', id: 2 }
      ],
      fields: ['name', 'sex'],
      aliases: [
        { field: 'name', alias: '某某' },
        { field: 'sex', alias: '代办数' }
      ]
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
.log-content {
  display: flex;
  justify-content: center;
  .log {
    width: 22vw;
    height: 22vh;
    margin: 30px;
    padding: 10px 30px 30px;
    box-shadow: 0px 0px 8px 1px rgba(83, 92, 108, 0.07);
    h3 {
      border-bottom: 1px solid #eff1f3;
      padding-bottom: 10px;
    }

    .log-info {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      cursor: pointer;
      &::before {
        content: '●';
        color: #51c41b;
        margin-right: 5px;
      }
    }
  }
}
</style>
