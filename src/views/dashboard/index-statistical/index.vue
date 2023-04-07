<template>
  <div class="page-header-index-wide">
    <a-row :gutter="24">
      <!-- 产品数量 -->
      <a-col :xxl="8" :lg="12" :md="24" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="产品数量">
          <div class="pie">
            <pie :data-source="chartData.sll" />
          </div>
        </chart-card>
      </a-col>

      <!-- 订单量 -->
      <a-col :xxl="8" :lg="12" :md="24" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="订单量" :total="cardCount.bjl | NumberFormat">
          <div>
            <mini-area :data-source="chartData.bjl" x="时间" y="订单" />
          </div>
          <!-- <template slot="footer">
            今日办结量：<span>{{ todayBjl }}</span>
          </template> -->
        </chart-card>
      </a-col>

      <!-- 销售总额 -->
      <a-col :xxl="8" :lg="12" :md="24" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="采购总额" total="￥126,560">
          <div style="margin-bottom: 20px">
            <trend flag="up" style="margin-right: 160px">
              <span slot="term">周同比</span>
              12%
            </trend>
            <trend flag="down">
              <span slot="term">日同比</span>
              11%
            </trend>
          </div>
          <div :style="{ fontSize: '18px' }">日均采购额<span>￥ 234.56</span></div>
          <!-- <template slot="footer">日均销售额<span>￥ 234.56</span></template> -->
        </chart-card>
      </a-col>
    </a-row>

    <a-row :gutter="12">
      <a-col :span="12">
        <a-card
          :loading="loading"
          :class="{ 'anty-list-cust': true }"
          :bordered="false"
          :style="{ marginTop: '24px' }"
          class="card"
        >
          <a-tabs v-model="indexBottomTab" size="large" :tab-bar-style="{ marginBottom: '24px', paddingLeft: '16px' }">
            <a-tab-pane loading="true" tab="代办" key="1">
              <a-table
                :dataSource="dataSource1"
                size="default"
                rowKey="id"
                :columns="columns"
                :pagination="ipagination1"
                @change="tableChange1"
                bordered
                :scroll="{ y: 350 }"
              >
              </a-table>
            </a-tab-pane>
            <a-tab-pane loading="true" tab="审核" key="2">
              <div class="total-content">
                <div>
                  <div class="number number-color">{{ 100 }}</div>
                  <div class="total-name">待审核产品</div>
                </div>
                <div>
                  <div class="number number-color">{{ 100 }}</div>
                  <div class="total-name">待审核供应商</div>
                </div>
              </div>
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </a-col>
      <!-- 快速入口 -->
      <a-col :span="12">
        <a-card
          :loading="loading"
          :class="{ 'anty-list-cust': true }"
          :bordered="false"
          :style="{ marginTop: '24px' }"
          class="card"
        >
          <div class="card-header">
            <div class="meta">
              <span class="card-title">快速入口</span>
            </div>
            <a-card-grid style="width:25%;text-align:center" v-for="(item, i) in entranceList" :key="i">
              <div class="card-content" @click="handleTo(item.path)">
                <img :src="item.img" :alt="item.img" />
                <div>{{ item.text }}</div>
              </div>
            </a-card-grid>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import ACol from 'ant-design-vue/es/grid/Col'
import ATooltip from 'ant-design-vue/es/tooltip/Tooltip'
import ChartCard from '@/components/ChartCard'
import MiniBar from '@/components/chart/MiniBar'
import MiniArea from '@/components/chart/MiniArea'
import Pie from '@/components/chart/Pie'
import IndexBar from '@/components/chart/IndexBar'
import BarMultid from '@/components/chart/BarMultid'
import DashChartDemo from '@/components/chart/DashChartDemo'

import Trend from '@/components/Trend'

const dataCol1 = [
  {
    title: '编号',
    align: 'center',
    dataIndex: 'reBizCode'
  },
  {
    title: '消息标题',
    align: 'center',
    dataIndex: 'type'
  },
  {
    title: '摘要',
    align: 'center',
    dataIndex: 'acceptBy'
  },
  {
    title: '发送时间',
    align: 'center',
    dataIndex: 'acceptDate'
  }
]
const dataSource1 = [
  { reBizCode: '1', type: '转移登记', acceptBy: '张三', acceptDate: '2019-01-22', curNode: '任务分派', flowRate: 60 },
  { reBizCode: '2', type: '抵押登记', acceptBy: '李四', acceptDate: '2019-01-23', curNode: '领导审核', flowRate: 30 },
  { reBizCode: '3', type: '转移登记', acceptBy: '王武', acceptDate: '2019-01-25', curNode: '任务处理', flowRate: 20 },
  { reBizCode: '4', type: '转移登记', acceptBy: '赵楼', acceptDate: '2019-11-22', curNode: '部门审核', flowRate: 80 },
  { reBizCode: '5', type: '转移登记', acceptBy: '钱就', acceptDate: '2019-12-12', curNode: '任务分派', flowRate: 90 },
  { reBizCode: '6', type: '转移登记', acceptBy: '孙吧', acceptDate: '2019-03-06', curNode: '任务处理', flowRate: 10 },
  { reBizCode: '7', type: '抵押登记', acceptBy: '周大', acceptDate: '2019-04-13', curNode: '任务分派', flowRate: 100 },
  { reBizCode: '8', type: '抵押登记', acceptBy: '吴二', acceptDate: '2019-05-09', curNode: '任务上报', flowRate: 50 },
  { reBizCode: '9', type: '抵押登记', acceptBy: '郑爽', acceptDate: '2019-07-12', curNode: '任务处理', flowRate: 63 },
  { reBizCode: '20', type: '抵押登记', acceptBy: '林有', acceptDate: '2019-12-12', curNode: '任务打回', flowRate: 59 },
  { reBizCode: '11', type: '转移登记', acceptBy: '码云', acceptDate: '2019-09-10', curNode: '任务签收', flowRate: 87 },
  { reBizCode: '11', type: '转移登记', acceptBy: '码云', acceptDate: '2019-09-10', curNode: '任务签收', flowRate: 87 },
  { reBizCode: '11', type: '转移登记', acceptBy: '码云', acceptDate: '2019-09-10', curNode: '任务签收', flowRate: 87 },
  { reBizCode: '11', type: '转移登记', acceptBy: '码云', acceptDate: '2019-09-10', curNode: '任务签收', flowRate: 87 },
  { reBizCode: '11', type: '转移登记', acceptBy: '码云', acceptDate: '2019-09-10', curNode: '任务签收', flowRate: 87 },
  { reBizCode: '11', type: '转移登记', acceptBy: '码云', acceptDate: '2019-09-10', curNode: '任务签收', flowRate: 87 },
  { reBizCode: '11', type: '转移登记', acceptBy: '码云', acceptDate: '2019-09-10', curNode: '任务签收', flowRate: 87 }
]

export default {
  name: 'IndexBdc',
  components: {
    ATooltip,
    ACol,
    ChartCard,
    MiniArea,
    Pie,
    MiniBar,
    DashChartDemo,
    BarMultid,
    IndexBar,
    Trend
  },
  data() {
    return {
      loading: true,
      cardCount: {
        sll: 100,
        bjl: 87,
        isll: 15,
        ibjl: 9
      },

      todaySll: 60,
      todayBjl: 54,
      todayISll: 13,
      todayIBjl: 7,

      chartData: {
        sll: [
          { item: '设备', count: 40 },
          { item: '辅材劳务', count: 40 }
        ],
        bjl: [
          // {
          //   时间: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
          //   订单: Math.round(Math.random() * 10),
          // },
        ],
        isll: [],
        ibjl: []
      },

      dataSource1: [],
      columns: dataCol1,
      ipagination1: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },

      indexRegisterType: '转移登记',
      indexBottomTab: '1',
      // 快速入口
      entranceList: [
        {
          img: require('../../../assets/home/product.png'),
          text: '产品库',
          path: '/product-management/product-library'
        },
        {
          img: require('../../../assets/home/supplier.png'),
          text: '供应商管理',
          path: '/supplier-management/account-management'
        },
        {
          img: require('../../../assets/home/profit.png'),
          text: '利润表',
          path: '/project-management/foreign-price-management/project-profit'
        },
        {
          img: require('../../../assets/home/content.png'),
          text: '合同管理',
          path: '/contract-management/contract-parameter'
        },
        {
          img: require('../../../assets/home/content.png'),
          text: '订单管理',
          path: '/project-management/procurement/order'
        },
        {
          img: require('../../../assets/home/approval.png'),
          text: '采购申请',
          path: '/project-management/procurement/procurement-list'
        }
      ]
    }
  },
  methods: {
    // 跳转
    handleTo(url) {
      this.$router.push({
        path: url
      })
    },

    goPage() {
      this.$message.success('根据业务自行处理跳转页面!')
    },
    changeRegisterType(e) {
      this.indexRegisterType = e.target.value
      if (this.indexBottomTab == '1') {
        this.loadDataSource1()
      }
    },
    tableChange1(pagination) {
      this.ipagination1.current = pagination.current
      this.ipagination1.pageSize = pagination.pageSize
    },

    getPercentFormat(value) {
      if (value == 100) {
        return '超时'
      } else {
        return value + '%'
      }
    },

    loadDataSource1() {
      this.dataSource1 = dataSource1.filter(item => {
        if (!this.indexRegisterType) {
          return true
        }
        return item.type == this.indexRegisterType
      })
    }
  },
  created() {
    this.loadDataSource1()
    setTimeout(() => {
      this.loading = !this.loading
    }, 1000)
  }
}
</script>

<style lang="less" scoped>
.page-header-index-wide {
  min-height: calc(100vh - 135px);
  // background-color: #fff;
}
.extra-wrapper {
  line-height: 55px;
  padding-right: 24px;

  .extra-item {
    display: inline-block;
    margin-right: 24px;

    a {
      margin-left: 24px;
    }
  }
}

.item-group {
  padding: 20px 0 8px 24px;
  font-size: 0;
  a {
    color: rgba(0, 0, 0, 0.65);
    display: inline-block;
    font-size: 14px;
    margin-bottom: 13px;
    width: 25%;
  }
}

.item-group {
  .more-btn {
    margin-bottom: 13px;
    text-align: center;
  }
}

.list-content-item {
  color: rgba(0, 0, 0, 0.45);
  display: inline-block;
  vertical-align: middle;
  font-size: 14px;
  margin-left: 40px;
}

@media only screen and (min-width: 1600px) {
  .list-content-item {
    margin-left: 60px;
  }
}

@media only screen and (max-width: 1300px) {
  .list-content-item {
    margin-left: 20px;
  }
  .width-hidden4 {
    display: none;
  }
}
.list-content-item {
  span {
    line-height: 20px;
  }
}
.list-content-item {
  p {
    margin-top: 4px;
    margin-bottom: 0;
    line-height: 22px;
  }
}
.anty-list-cust {
  .ant-list-item-meta {
    flex: 0.3 !important;
  }
}
.anty-list-cust {
  .ant-list-item-content {
    flex: 1 !important;
    justify-content: flex-start !important;
    margin-left: 20px;
  }
}
.pie {
  height: 190px;
}

.total-content {
  display: flex;
  flex-direction: row; //横轴
  align-items: center;
  justify-content: space-around; //两端对齐
  height: 30%;
  margin: 25px 0;
  .number {
    text-align: center;
    font-size: 24px;
    margin-bottom: 8px;
  }
  .number-color {
    color: #38acf5;
  }
  .total-name {
    color: #666666;
  }
}

.card-header {
  position: relative;
  overflow: hidden;
  width: 100%;

  .meta {
    position: relative;
    overflow: hidden;
    width: 100%;
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    line-height: 22px;
    margin-bottom: 18px;
    margin-top: 18px;
    border-bottom: 1px solid rgba(36, 36, 36, 0.1);
    padding-bottom: 16px;

    .card-title {
      font-size: 20px;
      color: #383838;
      // font-weight: 600;
    }
  }

  .card-content {
    img {
      width: 3vw;
    }
    div {
      font-size: 14px;
      margin-top: 10px;
    }
  }
}
/deep/ .ant-card-grid {
  box-shadow: none;
}
.card {
  height: 600px;
}
/* 表格 */
/*.table 为全局表格自定义样式*/
.table .ant-table-body,
.table .ant-table-header {
  overflow-y: auto !important;
}
</style>
