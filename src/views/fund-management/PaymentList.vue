<template>
  <a-card class="registration">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form-model ref="ruleForm" v-model="param" layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-model-item label="客户名称" prop="customerName">
              <j-input v-model="param.customerName" placeholder="请输入客户名称" />
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="项目名称" prop="projectName">
              <j-input v-model="param.projectName" placeholder="请输入项目名称" />
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="发票状态" prop="invoiceStatus">
              <a-select v-model="param.invoiceStatus" placeholder="请选择发票状态">
                <a-select-option :value="1"> 未收齐 </a-select-option>
                <a-select-option :value="2"> 已收齐 </a-select-option>
              </a-select>
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
        <!-- <a-button type="primary" @click="handleAdd" icon="plus">新增</a-button> -->
      </div>

      <!-- tabs区域 -->
      <a-tabs v-model="currentTab" default-active-key="1" @change="handleTabsChange">
        <a-tab-pane :key="null" tab="全部"></a-tab-pane>
        <a-tab-pane :key="1" tab="未付清"></a-tab-pane>
        <a-tab-pane :key="2" tab="已付清"></a-tab-pane>
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
          <div class="overflowStyle" slot="projectName" slot-scope="text, record">
            <a-popover placement="top">
              <template slot="content">
                <span>{{ record.projectName }}</span>
              </template>
              <span>{{ record.projectName }}</span>
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
          <div class="overflowStyle" slot="payContext" slot-scope="text, record">
            <a-popover placement="top">
              <template slot="content">
                <span>{{ record.payContext }}</span>
              </template>
              <span>{{ record.payContext }}</span>
            </a-popover>
          </div>

          <template #action="text, record">
            <template v-if="record.payStatus == 1 && record.applyCategory!==1">
              <a @click="handleAdd(record)">付款</a>
              <a-divider type="vertical" />
            </template>
            <template v-if="record.invoiceStatus == 1">
              <a @click="handleInvoice(record)">上传发票</a>
              <a-divider type="vertical" />
            </template>
            <a @click="handleDetail(record)">详情</a>
            <!~~ <a-divider type="vertical" /> ~~>
            <!~~ <a @click="batchPathDel(record.id)" :style="{ color: 'red' }">删除</a> ~~>
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
          <template v-slot:payCategory="props">
            <!-- {{ props.row.payCategory == 1 ? '采购付款（首次）' : '采购付款（非首次）' }} -->
            {{ getDictText('payment_category', props.row.payCategory) }}
          </template>
          <template v-slot:invoiceStatus="props">
            {{ props.row.invoiceStatus == 1 ? '未收齐' : '已收齐' }}
          </template>
          <template v-slot:payStatus="props">
            {{ props.row.payStatus == 1 ? '未付清' : '已付清' }}
          </template>
          <template v-slot:action="props">
            <template v-if="props.row.payStatus == 1 && props.row.applyCategory !== 1">
              <a @click="handleAdd(props.row)">付款</a>
              <a-divider type="vertical" />
            </template>
            <template v-if="props.row.invoiceStatus == 1">
              <a @click="handleInvoice(props.row)">上传发票</a>
              <a-divider type="vertical" />
            </template>
            <a @click="handleDetail(props.row)">详情</a>
            <!-- <a-divider type="vertical" />
            <a @click="batchPathDel(props.row.id)" :style="{ color: 'red' }">删除</a> -->
          </template>
        </j-vxe-table>
      </div>

      <!--  <div class="subtotal" v-if="this.dataSource.length">
        <div class="left">汇总</div>
        <!~~ 应付金额 ~~>
        <div class="number">{{ amountPayable }}</div>
        <!~~ 实付金额 ~~>
        <div class="number">{{ amountPaid }}</div>
        <!~~ 未付金额 ~~>
        <div class="number">{{ amountOutstanding }}</div>
        <div class="number"></div>
        <div class="number"></div>
        <div class="number"></div>
        <div class="number"></div>
        <div class="number"></div>
        <!~~ <div class="number"></div> ~~>
        <!~~ 这个是为了占位，因为我的操作列固定在了右侧，避免滚动条滚不到最后一列，保持合计行的列数和表格列数一样 ~~>
      </div> -->
    </div>

    <!-- 付款 -->
    <PayableModel ref="modalForm" @refresh="loadData(1)"></PayableModel>
    <!-- 上传发票 -->
    <PayUploadInvoice ref="invoiceForm" @refresh="loadData(1)"></PayUploadInvoice>
    <!-- 详情 -->
    <PaymentDetail ref="detail" @refresh="loadData(1)"></PaymentDetail>
  </a-card>
</template>

<script>
// 组件
import PayableModel from './modules/PayableModel'
import PayUploadInvoice from './modules/PayUploadInvoice'
import PaymentDetail from './modules/PaymentDetail'
import moment from 'moment'
import { simpleDebounce } from '@/utils/util'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin'
import { getDictText } from '@/api/api.js'
import { JVXETypes } from '@/components/jeecg/JVxeTable'
export default {
  mixins: [TableListMixin],
  components: { PayableModel, PayUploadInvoice, PaymentDetail },
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
      //   // {
      //   //   title: '序号',
      //   //   dataIndex: 'index',
      //   //   align: 'center',
      //   //   width: 60,
      //   //   customRender(text, record, index) {
      //   //     return index + 1
      //   //   },
      //   // },
      //   {
      //     title: '创建时间',
      //     dataIndex: 'createTime',
      //     align: 'center',
      //     width: 150,
      //     ellipsis: true,
      //   },
      //   {
      //     title: '客户名称',
      //     dataIndex: 'customerName',
      //     align: 'center',
      //     width: 150,
      //     ellipsis: true,
      //     scopedSlots: { customRender: 'customerName' },
      //   },
      //   {
      //     title: '项目名称',
      //     align: 'center',
      //     dataIndex: 'projectName',
      //     width: 150,
      //     ellipsis: true,
      //     scopedSlots: { customRender: 'projectName' },
      //   },
      //   {
      //     align: 'center',
      //     title: '付款类别',
      //     dataIndex: 'payCategory',
      //     width: 150,
      //     ellipsis: true,
      //     // 1-采购付款（首次），2-采购付款（非首次）
      //     customRender(text) {
      //       return text == 1 ? '采购付款（首次）' : '采购付款（非首次）'
      //     },
      //   },
      //   {
      //     align: 'center',
      //     title: '付款内容描述',
      //     dataIndex: 'payContext',
      //     width: 150,
      //     ellipsis: true,
      //     scopedSlots: { customRender: 'payContext' },
      //   },
      //   {
      //     align: 'center',
      //     title: '收款单位',
      //     dataIndex: 'receivingUnit',
      //     width: 150,
      //     ellipsis: true,
      //   },
      //   {
      //     align: 'center',
      //     title: '应付款金额',
      //     dataIndex: 'payableAmount',
      //     width: 150,
      //     ellipsis: true,
      //   },
      //   {
      //     align: 'center',
      //     title: '已付款金额',
      //     dataIndex: 'paidAmount',
      //     width: 150,
      //     ellipsis: true,
      //     // customRender: (value) => getDictText('pay_methos', value),
      //   },
      //   {
      //     align: 'center',
      //     title: '未付款金额',
      //     dataIndex: 'unpaidAmount',
      //     width: 150,
      //     ellipsis: true,
      //   },
      //   {
      //     align: 'center',
      //     title: '票据情况',
      //     dataIndex: 'billCondition',
      //     width: 150,
      //     ellipsis: true,
      //   },
      //   {
      //     align: 'center',
      //     title: '发票状态',
      //     dataIndex: 'invoiceStatus',
      //     width: 150,
      //     ellipsis: true,
      //     // 1-未收齐，2-已收齐
      //     customRender(text) {
      //       return text == 1 ? '未收齐' : '已收齐'
      //     },
      //   },
      //   {
      //     align: 'center',
      //     title: '付款状态',
      //     dataIndex: 'payStatus',
      //     width: 150,
      //     ellipsis: true,
      //     // 1-未付清，2-已付清
      //     customRender(text) {
      //       return text == 1 ? '未付清' : '已付清'
      //     },
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
          title: '创建时间',
          key: 'createTime',
          type: JVXETypes.text,
          align: 'center',
          width: '200px',
        },
        {
          title: '客户名称',
          key: 'customerName',
          type: JVXETypes.text,
          align: 'center',
          width: '250px',
        },
        {
          title: '项目名称',
          key: 'projectName',
          type: JVXETypes.text,
          align: 'center',
          width: '250px',
        },
        {
          title: '付款类别',
          key: 'payCategory',
          align: 'center',
          width: '150px',
          type: JVXETypes.slot,
          slotName: 'payCategory',
        },
        {
          title: '付款内容描述',
          key: 'payContext',
          width: '120px',
          type: JVXETypes.text,
          width: '180px',
          align: 'center',
        },
        {
          title: '收款单位',
          key: 'receivingUnit',
          width: '120px',
          type: JVXETypes.text,
          width: '180px',
          align: 'center',
        },
        {
          title: '应付款金额',
          key: 'payableAmount',
          width: '120px',
          type: JVXETypes.text,
          width: '180px',
          // 【统计列】sum = 求和
          statistics: ['sum'],
          align: 'center',
        },
        {
          title: '已付款金额',
          key: 'paidAmount',
          width: '120px',
          align: 'center',
          type: JVXETypes.text,
          // 【统计列】sum = 求和
          statistics: ['sum'],
        },
        {
          title: '未付款金额',
          key: 'unpaidAmount',
          type: JVXETypes.text,
          // 【统计列】sum = 求和
          statistics: ['sum'],
          align: 'center',
          width: '120px',
        },
        {
          title: '票据情况',
          key: 'billCondition',
          type: JVXETypes.text,
          width: '200px',
          align: 'center',
        },
        {
          title: '发票状态',
          key: 'invoiceStatus',
          width: '120px',
          align: 'center',
          type: JVXETypes.slot,
          slotName: 'invoiceStatus',
        },
        {
          title: '付款状态',
          key: 'payStatus',
          width: '120px',
          align: 'center',
          type: JVXETypes.slot,
          slotName: 'payStatus',
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          type: JVXETypes.slot,
          fixed: 'right',
          width: 300,
          slotName: 'action',
        },
      ],
      // 当前状态
      orderPattern: null,
      // 创建时间
      times: [],
      // 接口地址
      url: {
        list: '/prod/prodPayable/list',
        deleteBatch: '',
      },
    }
  },
  computed: {
    amountPayable() {
      //应付金额
      return this.dataSource.reduce((p, c) => p + c.payableAmount, 0).toFixed(2)
    },
    amountPaid() {
      //已付金额
      return this.dataSource.reduce((p, c) => p + c.paidAmount, 0).toFixed(2)
    },
    amountOutstanding() {
      //未付金额
      return this.dataSource.reduce((p, c) => p + c.unpaidAmount, 0).toFixed(2)
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
      console.log(event);
      // 重新赋值
      this.ipagination.current = event.current
      this.ipagination.pageSize = event.pageSize
      // 查询数据
      this.loadData()
    },

    handleInvoice(record) {
      this.$refs.invoiceForm.add(record)
    },
    // 新增按钮：给列表添加数据
    handleAdd: function (record) {
      this.$refs.modalForm.add(record)
      this.$refs.modalForm.title = '付款'
      this.$refs.modalForm.disableSubmit = false
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

      if (key) {
        // 未付清
        this.url.list = `/prod/prodPayable/list?payStatus=${key}`
        this.loadData(1)
      } else {
        // 全部
        this.url.list = `/prod/prodPayable/list`
        this.loadData(1)
      }
    },

    // 处理搜索时间
    handleRangePickerChange(dates, dateStrings) {
      this.param.createdTime_begin = dateStrings[0]
      this.param.createdTime_end = dateStrings[1]
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
    width: 870px;
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
