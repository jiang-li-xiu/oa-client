<template>
  <a-card class="registration">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form-model ref="ruleForm" v-model="param" layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-model-item label="编号" prop="num">
              <j-input v-model="param.num" placeholder="请输入编号" />
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="回款日期" prop="practicalPaymentDate">
              <a-range-picker v-model="times" style="width: 100%" @change="handleRangePickerChange" />
            </a-form-model-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <span style="float: left; overflow: hidden" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">搜索</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form-model>

      <!-- 按钮区域 -->
      <div class="table-operator">
        <a-button type="primary" @click="handleAdd" icon="plus">新增</a-button>
      </div>

      <!-- tabs区域 -->
      <a-tabs v-model="currentTab" default-active-key="1" @change="handleTabsChange">
        <a-tab-pane :key="null" tab="全部"></a-tab-pane>
        <a-tab-pane :key="1" tab="本周回款"></a-tab-pane>
        <a-tab-pane :key="2" tab="本月回款"></a-tab-pane>
        <a-tab-pane :key="3" tab="上月回款"></a-tab-pane>
        <a-tab-pane :key="4" tab="坏账回款"></a-tab-pane>
      </a-tabs>

      <!-- 表格区域 -->
      <div class="table">
        <!--   <a-table
          ref="table"
          size="middle"
          bordered
          :scroll="{ x: true }"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="ipagination"
          :loading="loading"
          @change="handleTableChange"
        >
          <div class="overflowStyle" slot="receivableNums" slot-scope="text, record">
            <a-popover placement="top">
              <template slot="content">
                <span>{{ record.receivableNums }}</span>
              </template>
              <span>{{ record.receivableNums }}</span>
            </a-popover>
          </div>
          <div class="overflowStyle" slot="customerName" slot-scope="text, record">
            <a-popover placement="top">
              <template slot="content">
                <span>{{ record.customerName }}</span>
              </template>
              <span>{{ record.customerName }}</span>
            </a-popover>
          </div>
          <div class="overflowStyle" slot="contractCode" slot-scope="text, record">
            <a-popover placement="top">
              <template slot="content">
                <span>{{ record.contractCode }}</span>
              </template>
              <span>{{ record.contractCode }}</span>
            </a-popover>
          </div>

          <template #action="text, record">
            <!~~ 回款金额不为0 / 不是坏账 / 回款金额跟开票金额相等了  record.invoiceAmount >= record.returnedMoney~~>
            <a
              @click="handleAddInvoice(record)"
              :disabled="
                [2].includes(record.type) || record.returnedMoney == 0 || record.returnedMoney == record.invoiceAmount
              "
              >新建发票</a
            >
            <a-divider type="vertical" />
            <a @click="handleDetail(record)">详情</a>
            <a-divider type="vertical" />
            <a @click="batchPathDel(record.id)" :style="{ color: 'red' }">删除</a>
          </template>
        </a-table> -->

        <j-vxe-table
          ref="vTable"
          toolbar
          keep-source
          :loading="loading"
          :dataSource="dataSource"
          :columns="columns"
          style="margin-top: 8px"
          :toolbarConfig="{ btn: [] }"
          :pagination="ipagination"
          @pageChange="handleTableChange"
        >
          <template v-slot:paymentType="props">
            {{ getDictText('pay_methos', props.row.paymentType) }}
          </template>
          <template v-slot:type="props">
            {{ props.row.type == 1 ? '已核销' : props.row.type == 2 ? '坏账' : '' }}
          </template>
          <template v-slot:action="props">
            <!--  回款金额不为0 / 不是坏账 / 回款金额跟开票金额相等了  record.invoiceAmount >= record.returnedMoney -->
            <a
              @click="handleAddInvoice(props.row)"
              :disabled="
                [2].includes(props.row.type) ||
                props.row.returnedMoney == 0 ||
                props.row.returnedMoney == props.row.invoiceAmount
              "
              >新建发票</a
            >
            <a-divider type="vertical" />
            <a @click="handleDetail(props.row)">详情</a>
            <a-divider type="vertical" />
            <a @click="batchPathDel(props.row.id)" :style="{ color: 'red' }">删除</a>
          </template>
        </j-vxe-table>
      </div>

      <!--   <div class="subtotal" v-if="this.dataSource.length">
        <div class="left">汇总</div>
        <!~~ 回款金额 ~~>
        <div class="number">{{ returnTotal }}</div>
        <!~~ 核销金额 ~~>
        <div class="number">{{ cancelTotal }}</div>
        <!~~ 开票金额 ~~>
        <div class="number">{{ invoiceTotal }}</div>
        <div class="number"></div>
        <div class="number"></div>
        <div class="number"></div>
        <div class="number"></div>
        <div class="number"></div>
        <div class="number"></div>
        <div class="number"></div>
        <div class="number"></div>
        <div class="number"></div>
        <div class="number"></div>
        <!~~ <div class="number"></div> ~~>
        <!~~ 这个是为了占位，因为我的操作列固定在了右侧，避免滚动条滚不到最后一列，保持合计行的列数和表格列数一样 ~~>
      </div> -->
    </div>

    <!-- 新增回款单 -->
    <RefundAddModel ref="modalForm" @refresh="loadData(1)"></RefundAddModel>
    <!-- 回款单详情 -->
    <RefundDetail ref="detail" @refresh="loadData(1)"></RefundDetail>
    <!-- 新增发票 -->
    <AddInvoice ref="invoiceForm" @refresh="loadData(1)"></AddInvoice>
  </a-card>
</template>

<script>
// 组件
import RefundAddModel from './modules/RefundAddModel'
import AddInvoice from './modules/AddInvoice'
import RefundDetail from './modules/RefundDetail'
import moment from 'moment'
import { simpleDebounce } from '@/utils/util'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin'
import { getDictText } from '@/api/api.js'
import { JVXETypes } from '@/components/jeecg/JVxeTable'
export default {
  mixins: [TableListMixin],
  components: { RefundAddModel, AddInvoice, RefundDetail },
  props: {},
  data() {
    return {
      // 查询表单
      param: {},
      // 全部任务列表
      taskStatusList: [],
      // 当前选中的tab页
      currentTab: null,
      // 表格配置
      // columns: [
      //   {
      //     title: '编号',
      //     dataIndex: 'num',
      //     align: 'center',
      //     width: 150,
      //     ellipsis: true,
      //   },
      //   {
      //     title: '关联客户',
      //     dataIndex: 'customerName',
      //     align: 'center',
      //     width: 150,
      //     ellipsis: true,
      //     scopedSlots: { customRender: 'customerName' },
      //   },
      //   {
      //     title: '关联合同',
      //     dataIndex: 'contractCode',
      //     align: 'center',
      //     width: 150,
      //     ellipsis: true,
      //     scopedSlots: { customRender: 'contractCode' },
      //   },
      //   {
      //     title: '关联应收款',
      //     align: 'center',
      //     dataIndex: 'receivableNums',
      //     width: 150,
      //     ellipsis: true,
      //     scopedSlots: { customRender: 'receivableNums' },
      //   },
      //   {
      //     align: 'center',
      //     title: '回款金额',
      //     dataIndex: 'returnedMoney',
      //     width: 150,
      //     ellipsis: true,
      //   },
      //   {
      //     align: 'center',
      //     title: '核销金额',
      //     dataIndex: 'amountWrittenOff',
      //     width: 150,
      //     ellipsis: true,
      //   },
      //   {
      //     align: 'center',
      //     title: '开票金额',
      //     dataIndex: 'invoiceAmount',
      //     width: 150,
      //     ellipsis: true,
      //   },
      //   {
      //     align: 'center',
      //     title: '归属人',
      //     dataIndex: 'belongers',
      //     width: 150,
      //     ellipsis: true,
      //   },
      //   // {
      //   //   align: 'center',
      //   //   title: '回款状态',
      //   //   dataIndex: 'ddd',
      //   //   width: 150,
      //   //   ellipsis: true,
      //   // },
      //   {
      //     align: 'center',
      //     title: '回款日期',
      //     dataIndex: 'practicalPaymentDate',
      //     width: 150,
      //     ellipsis: true,
      //   },
      //   {
      //     align: 'center',
      //     title: '支付方式',
      //     dataIndex: 'paymentType',
      //     width: 150,
      //     ellipsis: true,
      //     customRender: (value) => getDictText('pay_methos', value),
      //   },
      //   {
      //     align: 'center',
      //     title: '类型',
      //     dataIndex: 'type',
      //     width: 150,
      //     ellipsis: true,
      //     // 1-已核销，2-坏账
      //     customRender(text) {
      //       return text == 1 ? '已核销' : text == 2 ? '坏账' : ''
      //     },
      //   },
      //   {
      //     align: 'center',
      //     title: '负责人',
      //     dataIndex: 'chargePeople',
      //     width: 150,
      //     ellipsis: true,
      //   },
      //   {
      //     align: 'center',
      //     title: '协同人',
      //     dataIndex: 'synergyPeople',
      //     width: 150,
      //     ellipsis: true,
      //   },
      //   {
      //     align: 'center',
      //     title: '创建人',
      //     dataIndex: 'createBy',
      //     width: 150,
      //     ellipsis: true,
      //   },
      //   {
      //     align: 'center',
      //     title: '创建时间',
      //     dataIndex: 'createTime',
      //     width: 150,
      //     ellipsis: true,
      //   },
      //   {
      //     title: '操作',
      //     key: 'action',
      //     align: 'center',
      //     fixed: 'right',
      //     width: 300,
      //     scopedSlots: { customRender: 'action' },
      //   },
      // ],

      columns: [
        {
          title: '编号',
          key: 'num',
          type: JVXETypes.text,
          align: 'center',
          width: '200px',
        },
        {
          title: '关联客户',
          key: 'customerName',
          type: JVXETypes.text,
          align: 'center',
          width: '250px',
        },
        {
          title: '关联合同',
          key: 'contractCode',
          type: JVXETypes.text,
          align: 'center',
          width: '250px',
        },
        {
          title: '关联应收款',
          key: 'receivableNums',
          align: 'center',
          width: '200px',
          type: JVXETypes.text,
        },
        {
          title: '回款金额',
          key: 'returnedMoney',
          width: '120px',
          type: JVXETypes.text,
          width: '180px',
          // 【统计列】sum = 求和
          statistics: ['sum'],
          align: 'center',
        },
        {
          title: '核销金额',
          key: 'amountWrittenOff',
          width: '120px',
          type: JVXETypes.text,
          width: '180px',
          // 【统计列】sum = 求和
          statistics: ['sum'],
          align: 'center',
        },
        {
          title: '开票金额',
          key: 'invoiceAmount',
          width: '120px',
          type: JVXETypes.text,
          width: '180px',
          // 【统计列】sum = 求和
          statistics: ['sum'],
          align: 'center',
        },
        {
          title: '归属人',
          key: 'belongers',
          width: '120px',
          align: 'center',
          type: JVXETypes.text,
        },
        {
          title: '回款日期',
          key: 'practicalPaymentDate',
          type: JVXETypes.text,
          align: 'center',
          width: '120px',
        },
        {
          title: '支付方式',
          key: 'paymentType',
          width: '200px',
          align: 'center',
          type: JVXETypes.slot,
          slotName: 'paymentType',
        },
        {
          title: '类型',
          key: 'type',
          width: '120px',
          align: 'center',
          type: JVXETypes.slot,
          slotName: 'type',
        },
        {
          title: '负责人',
          key: 'chargePeople',
          type: JVXETypes.text,
          width: '120px',
          align: 'center',
        },
        {
          title: '协同人',
          key: 'synergyPeople',
          width: '120px',
          align: 'center',
          type: JVXETypes.text,
        },
        {
          title: '创建人',
          key: 'createBy',
          type: JVXETypes.text,
          width: '120px',
          align: 'center',
        },
        {
          title: '创建时间',
          key: 'createTime',
          type: JVXETypes.text,
          width: '200px',
          align: 'center',
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          type: JVXETypes.slot,
          fixed: 'right',
          width: 200,
          slotName: 'action',
        },
      ],
      // 当前状态
      orderPattern: null,
      // 创建时间
      times: [],
      // 接口地址
      url: {
        list: '/prodReturnedMoney/list',
        deleteBatch: '/prodReturnedMoney',
      },
    }
  },
  computed: {
    returnTotal() {
      //回款金额
      return this.dataSource.reduce((p, c) => p + c.returnedMoney, 0).toFixed(2)
    },
    cancelTotal() {
      //核销金额
      return this.dataSource.reduce((p, c) => p + c.amountWrittenOff, 0).toFixed(2)
    },
    invoiceTotal() {
      //开票金额
      return this.dataSource.reduce((p, c) => p + c.invoiceAmount, 0).toFixed(2)
    },
  },
  created() {
    // 获取状态列表, null为全部
    this.handleTabsChange(null)
  },
  methods: {
    moment,
    getDictText,
    handleTableChange(event) {
      console.log(event)
      // 重新赋值
      this.ipagination.current = event.current
      this.ipagination.pageSize = event.pageSize
      // 查询数据
      this.loadData()
    },
    // 新增按钮：给列表添加数据
    handleAdd: function () {
      this.$refs.modalForm.add()
      this.$refs.modalForm.title = '新增应收款'
      this.$refs.modalForm.disableSubmit = false
    },

    // 新增发票
    handleAddInvoice(record) {
      this.$refs.invoiceForm.add(record)
    },

    // 查看详情：列表单行查看详情
    handleDetail: function (record) {
      this.$refs.detail.detail(record)
      this.$refs.detail.title = '详情'
      this.$refs.detail.disableSubmit = true
    },

    // tabs切换tab回调
    handleTabsChange(key) {
      this.currentTab = key
      console.log(this.currentTab)
      // 清空选中的数据
      this.selectedRowKeys = []
      switch (key) {
        //1-本周回款，2-本月回款，3-上月回款，4-坏账回款
        case 1:
          this.url.list = `/prodReturnedMoney/list?conditions=thisWeek`
          this.loadData(1)
          break
        case 2:
          this.url.list = `/prodReturnedMoney/list?conditions=thisMonth`
          this.loadData(1)
          break
        case 3:
          this.url.list = `/prodReturnedMoney/list?conditions=lastMonth`
          this.loadData(1)
          break
        case 4: //1-已核销，2-坏账
          this.url.list = `/prodReturnedMoney/list?type=${2}`
          this.loadData(1)
          break
        default:
          this.url.list = `/prodReturnedMoney/list`
          this.loadData(1)
          break
      }
    },

    // 处理搜索时间
    handleRangePickerChange(dates, dateStrings) {
      this.param.practicalPaymentDate_begin = dateStrings[0]
      this.param.practicalPaymentDate_end = dateStrings[1]
    },
    // 检索：重置按钮
    searchReset() {
      for (let key in this.param) {
        if (key != 'ids') {
          this.param[key] = null
        }
      }
      this.times = []
      this.roleAndPeople = undefined
      simpleDebounce(this.loadData, 0)(1)
    },
  },
  watch: {
    // 监听滚动条(把表格的滚动条隐藏了，只显示一条滚动条，监听滚动条滚动的时候，表格和尾部可以一起滑动)
    // dataSource() {
    //   const dom = this.$refs.table.$el.getElementsByClassName('ant-table-body')[0]
    //   const footerDom = document.getElementsByClassName('subtotal')[0]
    //   footerDom
    //     ? footerDom.addEventListener(
    //         'scroll',
    //         () => {
    //           dom.scrollLeft = footerDom.scrollLeft
    //         },
    //         true
    //       )
    //     : ''
    // },
  },
}
</script>
<style scoped lang="less">
.registration {
  min-height: calc(100vh - 135px);
  background-color: #fff;
}

::v-deep .ant-table {
  .isTimeout {
    color: #f40;
  }
}

.subtotal {
  height: 50px;
  position: absolute;
  // bottom: 10px;
  width: 97%;
  border: 1px solid #e8e8e8;
  background: #fafafa;
  display: flex;
  align-items: center;
  font-weight: 700;
  overflow-x: scroll;
  overflow-y: hidden;
  .left {
    flex: none; /* div显示滚动条的重点 */
    width: 540px;
    margin-left: 75px;
  }
  .number {
    flex: none;
    color: #666666;
    height: 100%;
    width: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-left: 5px;
  }
}
//隐藏a-table组件的滚动条
/deep/.ant-table-body {
  overflow: hidden !important;
}
/deep/.ant-table-footer {
  margin: 0;
}

.overflowStyle {
  max-width: 150px !important;
  max-height: 70px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-wrap: break-word;
  word-break: break-all;
}
</style>
