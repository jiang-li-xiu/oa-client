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
            <a-form-model-item label="应收生成日期" prop="generateTime">
              <a-range-picker v-model="times" style="width: 100%" @change="handleRangePickerChange" />
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="预计回款日期" prop="expectPaymentDate">
              <a-range-picker v-model="expectTimes" style="width: 100%" @change="handleRangePicker" />
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
        <a-tab-pane :key="1" tab="已收款"></a-tab-pane>
        <a-tab-pane :key="2" tab="全部未收"></a-tab-pane>
        <a-tab-pane :key="3" tab="全部逾期未收"></a-tab-pane>
        <a-tab-pane :key="4" tab="本月未收"></a-tab-pane>
        <a-tab-pane :key="5" tab="本周已收"></a-tab-pane>
        <a-tab-pane :key="6" tab="本周未收"></a-tab-pane>
        <a-tab-pane :key="7" tab="部分已收"></a-tab-pane>
        <a-tab-pane :key="8" tab="坏账"></a-tab-pane>
      </a-tabs>

      <!-- 表格区域 -->
      <div class="table">
        <!--  <a-table
          ref="table"
          size="middle"
          key="id"
          bordered
          :scroll="{ x: true }"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="ipagination"
          :loading="loading"
          @change="handleTableChange"
        >
          <div class="overflowStyle" slot="customName" slot-scope="text, record">
            <a-popover placement="top">
              <template slot="content">
                <span>{{ record.customName }}</span>
              </template>
              <span>{{ record.customName }}</span>
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
            <!~~ 应收款金额=已开发票金额 4-已坏账不能建发票   4-已坏账不能建回款单 还有未收金额才能建回款单 ~~>
            <template v-if="![4].includes(record.status) && record.notReceiptMoney !== 0">
              <a @click="handleAddReceipt(record, 1)">新建回款单</a>
              <a-divider type="vertical" />
            </template>
            <!~~ 7预期 / 应收=实收~~>
            <template v-if="![7].includes(record.status) && record.receivableMoney != record.actualReceiptMoney">
              <a @click="handleAddReceipt(record, 2)">新建坏账</a>
              <a-divider type="vertical" />
            </template>
            <!~~ 实收不为0 / 不是坏账 / 实收跟开票金额相等了  record.invoiceAmount >= record.actualReceiptMoney~~>
            <a
              @click="handleAddInvoice(record)"
              :disabled="
                [4].includes(record.status) ||
                record.actualReceiptMoney == 0 ||
                record.actualReceiptMoney == record.invoiceAmount
              "
              >新建发票
            </a>
            <a-divider type="vertical" />

            <a @click="handleDetail(record)">详情</a>
            <!~~ <a-divider type="vertical" />
          <a @click="handleDetail(record)" :style="{ color: 'red' }">删除</a> ~~>
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
          <template v-slot:status="props">
            {{ getDictText('payment_collection_status', props.row.status) }}
          </template>
          <template v-slot:receivableStatus="props">
            {{ getDictText('payment_collection_type', props.row.receivableStatus),}}
          </template>
          <template v-slot:overdueStatus="props">
            {{ props.row.overdueStatus == 1 ? '已逾期' : '未逾期' }}
          </template>
          <template v-slot:action="props">
            <!-- <! 应收款金额=已开发票金额 4-已坏账不能建发票   4-已坏账不能建回款单 还有未收金额才能建回款单 > -->
            <template v-if="![4].includes(props.row.status) && props.row.notReceiptMoney !== 0">
              <a @click="handleAddReceipt(props.row, 1)">新建回款单</a>
              <a-divider type="vertical" />
            </template>
            <!-- <! 7预期 / 应收=实收> -->
            <template
              v-if="![7].includes(props.row.status) && props.row.receivableMoney != props.row.actualReceiptMoney"
            >
              <a
                @click="handleAddReceipt(props.row, 2)"
                :disabled="props.row.badDebts >= props.row.receivableMoney || props.row.notReceiptMoney == 0"
                >新建坏账
              </a>
              <a-divider type="vertical" />
            </template>
            <!-- <! 实收不为0 / 不是坏账 / 实收跟开票金额相等了  props.row.invoiceAmount >= props.row.actualReceiptMoney> -->
            <a
              @click="handleAddInvoice(props.row)"
              :disabled="
                [4].includes(props.row.status) ||
                props.row.actualReceiptMoney == 0 ||
                props.row.actualReceiptMoney == props.row.invoiceAmount
              "
              >新建发票
            </a>
            <a-divider type="vertical" />
            <a @click="handleDetail(props.row)">详情</a>
            <!-- <a-divider type="vertical" />
            <a @click="handleDetail(props.row)" :style="{ color: 'red' }">删除</a> -->
          </template>
        </j-vxe-table>
      </div>

      <!--  <div class="subtotal">
        <div class="left">汇总</div>
        <!~~ 应收金额 ~~>
        <div class="number">{{ receivable }}</div>
        <!~~ 实收金额 ~~>
        <div class="number">{{ actualReceipt }}</div>
        <!~~ 未收金额 ~~>
        <div class="number">{{ notReceipt }}</div>
        <!~~ 坏账金额 ~~>
        <div class="number">{{ badDebtsTotal }}</div>
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
        <div class="number"></div>
        <div class="number"></div>
        <div class="number"></div>
        <div class="number"></div>
        <div class="number"></div>
        <!~~ 这个是为了占位，因为我的操作列固定在了右侧，避免滚动条滚不到最后一列，保持合计行的列数和表格列数一样 ~~>
      </div> -->
    </div>

    <!-- 新增应收款 -->
    <CollectionModel ref="modalForm" @refresh="loadData(1)"></CollectionModel>
    <!-- 应收款详情 -->
    <CollectionDetail ref="detail" @refresh="loadData(1)"></CollectionDetail>
    <!-- 新增发票 -->
    <AddInvoice ref="invoiceForm" @refresh="loadData(1)"></AddInvoice>
    <!-- 新增回款单 -->
    <RefundAddModel ref="refundForm" :num="true" @refresh="loadData(1)"></RefundAddModel>
  </a-card>
</template>

<script>
// 组件
import CollectionModel from './modules/CollectionModel'
import CollectionDetail from './modules/CollectionDetail'
import AddInvoice from './modules/AddInvoice'
import RefundAddModel from './modules/RefundAddModel' //回款单
import moment from 'moment'
import { simpleDebounce } from '@/utils/util'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin'
import { getDictText } from '@/api/api.js'
import { JVXETypes } from '@/components/jeecg/JVxeTable'
export default {
  mixins: [TableListMixin],
  components: { CollectionModel, AddInvoice, CollectionDetail, RefundAddModel },
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
      //     dataIndex: 'customName',
      //     align: 'center',
      //     width: 150,
      //     ellipsis: true,
      //     scopedSlots: { customRender: 'customName' },
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
      //     title: '应收金额',
      //     align: 'center',
      //     dataIndex: 'receivableMoney',
      //     width: 150,
      //     ellipsis: true,
      //   },
      //   {
      //     align: 'center',
      //     title: '实收金额',
      //     dataIndex: 'actualReceiptMoney',
      //     width: 150,
      //     ellipsis: true,
      //   },
      //   {
      //     align: 'center',
      //     title: '未收金额',
      //     dataIndex: 'notReceiptMoney',
      //     width: 150,
      //     ellipsis: true,
      //   },
      //   {
      //     align: 'center',
      //     title: '坏账金额',
      //     dataIndex: 'badDebts',
      //     width: 150,
      //     ellipsis: true,
      //   },
      //   {
      //     align: 'center',
      //     title: '回款状态',
      //     dataIndex: 'status',
      //     width: 150,
      //     ellipsis: true,
      //     //  1-未收款，2-已收款，3-部分收款，4-已坏账，5-部分坏账，6-已红冲，7-已逾期
      //     customRender: (value) => getDictText('payment_collection_status', value),
      //   },
      //   {
      //     align: 'center',
      //     title: '应收生成日期',
      //     dataIndex: 'generateTime',
      //     width: 150,
      //     ellipsis: true,
      //   },
      //   {
      //     align: 'center',
      //     title: '应收账期',
      //     dataIndex: 'receivablePaymentDate',
      //     width: 150,
      //     ellipsis: true,
      //   },
      //   {
      //     align: 'center',
      //     title: '预计回款日期',
      //     dataIndex: 'expectPaymentDate',
      //     width: 150,
      //     ellipsis: true,
      //   },
      //   {
      //     align: 'center',
      //     title: '实际回款日期',
      //     dataIndex: 'practicalPaymentDate',
      //     width: 150,
      //     ellipsis: true,
      //   },
      //   {
      //     align: 'center',
      //     title: '回款类型',
      //     dataIndex: 'receivableStatus',
      //     width: 150,
      //     ellipsis: true, // 1-常规，2-预收款，3-尾款，4-保证金
      //     customRender: (value) => getDictText('payment_collection_type', value),
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
      //     title: '逾期状态',
      //     dataIndex: 'overdueStatus',
      //     width: 150,
      //     ellipsis: true,
      //     // 0-未逾期，1-已逾期
      //     customRender(text) {
      //       return text == 1 ? '已逾期' : '未逾期'
      //     },
      //   },
      //   {
      //     align: 'center',
      //     title: '创建人',
      //     dataIndex: 'createByName',
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
          key: 'customName',
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
          title: '应收金额',
          key: 'receivableMoney',
          align: 'center',
          width: '120px',
          statistics: ['sum'],
        },
        {
          title: '实收金额',
          key: 'actualReceiptMoney',
          width: '120px',
          type: JVXETypes.text,
          width: '180px',
          // 【统计列】sum = 求和
          statistics: ['sum'],
          align: 'center',
        },
        {
          title: '未收金额',
          key: 'notReceiptMoney',
          width: '120px',
          type: JVXETypes.text,
          width: '180px',
          // 【统计列】sum = 求和
          statistics: ['sum'],
          align: 'center',
        },
        {
          title: '坏账金额',
          key: 'badDebts',
          width: '120px',
          type: JVXETypes.text,
          width: '180px',
          // 【统计列】sum = 求和
          statistics: ['sum'],
          align: 'center',
        },
        {
          title: '回款状态',
          key: 'status',
          width: '120px',
          align: 'center',
          //  1-未收款，2-已收款，3-部分收款，4-已坏账，5-部分坏账，6-已红冲，7-已逾期
          // customRender: (value) => getDictText('payment_collection_status', value),
          type: JVXETypes.slot,
          slotName: 'status',
        },
        {
          title: '应收生成日期',
          key: 'generateTime',
          type: JVXETypes.text,
          align: 'center',
          width: '120px',
        },
        {
          title: '应收账期',
          key: 'receivablePaymentDate',
          type: JVXETypes.text,
          width: '200px',
          align: 'center',
        },
        {
          title: '预计回款日期',
          key: 'expectPaymentDate',
          type: JVXETypes.text,
          width: '120px',
          align: 'center',
        },
        {
          title: '实际回款日期',
          key: 'practicalPaymentDate',
          type: JVXETypes.text,
          width: '120px',
          align: 'center',
        },
        {
          title: '回款类型',
          key: 'receivableStatus',
          width: '120px',
          align: 'center',
          type: JVXETypes.slot,
          slotName: 'receivableStatus',
          customRender: (value) => getDictText('payment_collection_type', value),
        },
        {
          title: '开票金额',
          key: 'invoiceAmount',
          type: JVXETypes.text,
          width: '120px',
          align: 'center',
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
          type: JVXETypes.text,
          width: '120px',
          align: 'center',
        },
        {
          title: '逾期状态',
          key: 'overdueStatus',
          width: '120px',
          align: 'center',
          type: JVXETypes.slot,
          slotName: 'overdueStatus',
        },
        {
          title: '创建人',
          key: 'createByName',
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
          width: 350,
          slotName: 'action',
        },
      ],
      // 当前状态
      orderPattern: null,
      // 不执行混入中的created
      disableMixinCreated: true,
      // 时间
      times: [],
      expectTimes: [],
      // 接口地址
      url: {
        list: '/prodReceivable/list',
      },
    }
  },
  computed: {
    receivable() {
      return this.dataSource.reduce((p, c) => p + c.receivableMoney, 0).toFixed(2)
    },
    actualReceipt() {
      return this.dataSource.reduce((p, c) => p + c.actualReceiptMoney, 0).toFixed(2)
    },
    notReceipt() {
      return this.dataSource.reduce((p, c) => p + c.notReceiptMoney, 0).toFixed(2)
    },
    badDebtsTotal() {
      return this.dataSource.reduce((p, c) => p + c.badDebts, 0).toFixed(2)
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
    // 新建回款单
    handleAddReceipt(record, type) {
      this.$refs.refundForm.add(record, type)
    },

    // tabs切换tab回调
    handleTabsChange(key) {
      this.currentTab = key
      console.log(this.currentTab)
      // 清空选中的数据
      this.selectedRowKeys = []
      switch (key) {
        //1-未收款，2-已收款，3-部分收款，4-已坏账，5-部分坏账，6-已红冲
        case 1:
          this.url.list = `/prodReceivable/list?status=${2}`
          this.loadData(1)
          break
        case 2:
          this.url.list = `/prodReceivable/list?status=${1}`
          this.loadData(1)
          break
        case 3: //全部逾期未收
          this.url.list = `/prodReceivable/list?status=${1}&overdueStatus=${1}`
          this.loadData(1)
          break
        case 4: // 本月到期未收
          this.url.list = `/prodReceivable/list?conditions=monthReceived`
          this.loadData(1)
          break
        case 5: // 本周到期已收
          this.url.list = `/prodReceivable/list?conditions=weekReceived`
          this.loadData(1)
          break
        case 6: // 本周到期未收
          this.url.list = `/prodReceivable/list?conditions=weekNotReceived`
          this.loadData(1)
          break
        case 7: // 部分已收
          this.url.list = `/prodReceivable/list?status=${3}`
          this.loadData(1)
          break
        case 8: //坏账
          this.url.list = `/prodReceivable/list?status=${4}`
          this.loadData(1)
          break
        default:
          this.url.list = `/prodReceivable/list`
          this.loadData(1)
          break
      }
    },

    // 点击查看详情
    handleDetail(record) {
      // 打开详情弹窗
      this.$refs.detail.detail(record)
      this.$refs.detail.disableSubmit = true
      this.$refs.detail.title = '详情'
    },

    // 处理搜索时间
    handleRangePickerChange(dates, dateStrings) {
      this.param.generateTime_begin = dateStrings[0]
      this.param.generateTime_end = dateStrings[1]
    },
    // 处理搜索时间
    handleRangePicker(dates, dateStrings) {
      this.param.expectPaymentDate_begin = dateStrings[0]
      this.param.expectPaymentDate_end = dateStrings[1]
    },
    // 检索：重置按钮
    searchReset() {
      for (let key in this.param) {
        if (key != 'ids') {
          this.param[key] = null
        }
      }
      this.times = []
      this.expectTimes = []
      this.roleAndPeople = undefined
      simpleDebounce(this.loadData, 0)(1)
    },
  },
  watch: {
    // 监听滚动条(把表格的滚动条隐藏了，只显示一条滚动条，监听滚动条滚动的时候，表格和尾部可以一起滑动)
    // dataSource() {
    //   const dom = this.$refs.table.$el.getElementsByClassName('ant-table-body')[0]
    //   const footerDom = document.getElementsByClassName('subtotal')[0]
    //   footerDom.addEventListener(
    //     'scroll',
    //     () => {
    //       dom.scrollLeft = footerDom.scrollLeft
    //     },
    //     true
    //   )
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
.title {
  font-size: 16px;
  font-weight: 600;
  margin: 10px;
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
    width: 391px;
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
