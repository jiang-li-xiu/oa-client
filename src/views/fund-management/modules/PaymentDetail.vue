<template>
  <a-drawer
    :title="title"
    :maskClosable="true"
    width="70%"
    placement="right"
    :closable="true"
    @close="close"
    :visible="visible"
    style="overflow: auto; padding-bottom: 53px"
  >
    <a-spin tip="加载中..." :spinning="loading">
      <a-row>
        <!-- 付款详情 -->
        <a-tabs default-active-key="1" @change="handleChange" :activeKey="activeKey">
          <a-tab-pane key="1" tab="付款详情">
            <a-col :span="24" class="title">关联申请信息</a-col>
            <a-col :span="8" class="content">
              <!-- 1-采购下单申请，2-普通付款申请，3-项目付款申请 -->
              申请类别:
              <span>
                {{
                  formParams.applyCategory == 1
                    ? '采购下单申请'
                    : formParams.applyCategory == 2
                    ? '普通付款申请'
                    : '项目付款申请'
                }}
              </span>
            </a-col>
            <a-col :span="8" class="content">
              申请人: <span>{{ formParams.people }}</span>
            </a-col>
            <a-col :span="8" class="content">
              联系电话:<span>{{ formParams.phone }}</span>
            </a-col>
            <a-col :span="8" class="content">
              申请部门: <span>{{ formParams.dept }}</span>
            </a-col>
            <a-col :span="8" class="content">
              申请时间: <span>{{ formParams.createTime }}</span>
            </a-col>

            <a-col :span="24" class="title">付款详情</a-col>
            <a-col :span="8" class="content">
              客户名称: <span>{{ formParams.customerName }}</span>
            </a-col>
            <a-col :span="8" class="content">
              项目名称: <span>{{ formParams.projectName }}</span>
            </a-col>
            <a-col :span="8" class="content">
              付款类别: <span> {{ getDictText('payment_category', formParams.payCategory) }}</span>
            </a-col>
            <a-col :span="8" class="content">
              <!-- 1-计划内，2-计划外 -->
              类型:<span>{{ formParams.type == 1 ? '计划内' : '计划外' }}</span>
            </a-col>
            <a-col :span="8" class="content">
              收款单位: <span>{{ formParams.receivingUnit }}</span>
            </a-col>
            <a-col :span="8" class="content">
              开户银行: <span>{{ formParams.bank }}</span>
            </a-col>
            <a-col :span="8" class="content">
              银行账号: <span>{{ formParams.bankAccount }}</span>
            </a-col>
            <a-col :span="8" class="content">
              <!-- 1-电汇，2-转账，3-汇票，4-其他 -->
              付款方式:
              <span>{{
                formParams.payType == 1
                  ? '电汇'
                  : formParams.payType == 2
                  ? '转账'
                  : formParams.payType == 3
                  ? '汇票'
                  : '其他'
              }}</span>
            </a-col>
            <a-col :span="8" class="content">
              应付款金额: <span>{{ formParams.payableAmount }}</span>
            </a-col>
            <a-col :span="8" class="content">
              已付款金额: <span>{{ formParams.paidAmount }}</span>
            </a-col>
            <a-col :span="8" class="content">
              未付款金额: <span>{{ formParams.unpaidAmount }}</span>
            </a-col>
            <a-col :span="8" class="content">
              票据情况: <span>{{ formParams.billCondition }}</span>
            </a-col>
            <a-col :span="8" class="content">
              <!-- 1-未收齐，2-已收齐 -->
              发票状态: <span>{{ formParams.invoiceStatus == 1 ? '未收齐' : '已收齐' }}</span>
            </a-col>
            <a-col :span="8" class="content">
              <!-- 1-未付清，2-已付清 -->
              付款状态: <span>{{ formParams.payStatus == 1 ? '未付清' : '已付清' }}</span>
            </a-col>
            <a-col :span="24" class="content">
              付款内容描述: <span>{{ formParams.payContext }}</span>
            </a-col>
          </a-tab-pane>

          <!-- 付款单 -->
          <a-tab-pane key="2" tab="付款单" force-render>
            <a-col :span="24" class="title">付款单</a-col>
            <a-col :span="24">
              <a-button type="primary" @click="handleAdd" style="margin-bottom: 0.8rem">新增</a-button>
            </a-col>
            <a-col :span="24">
              <a-table
                :columns="columns"
                :data-source="dataSource"
                bordered
                size="small"
                rowKey="billId"
                :scroll="{ x: true }"
                :indentSize="10"
                :pagination="false"
              >
                <template #action="text, record, index">
                  <a @click="handleEdit(record, index)">编辑</a>
                  <a-divider type="vertical" />
                  <a @click="handleDelete(record)" :style="{ color: 'red' }">移除</a>
                </template>
                <template #certificateUrl="text, record">
                  <a @click="handleSee(record)">查看</a>
                </template>
              </a-table>
            </a-col>
          </a-tab-pane>

          <!-- 发票记录 -->
          <a-tab-pane key="3" tab="发票记录" force-render>
            <a-col :span="24" class="title">发票记录</a-col>
            <a-col :span="24">
              <a-button type="primary" @click="handleAddInvoice" style="margin-bottom: 0.8rem">新增</a-button>
            </a-col>
            <a-col :span="24">
              <a-table
                :columns="columnsInvoice"
                :data-source="dataSourceInvoice"
                bordered
                size="small"
                rowKey="invoiceId"
                :scroll="{ x: true }"
                :indentSize="10"
                :pagination="false"
              >
                <template #action="text, record, index">
                  <a @click="handleEditInvoice(record, index)">编辑</a>
                  <a-divider type="vertical" />
                  <a @click="handleDeleteInvoice(record)" :style="{ color: 'red' }">移除</a>
                </template>
                <template #invoiceUrl="text, record">
                  <a @click="handleSeeInvoice(record)">查看</a>
                </template>
              </a-table>
            </a-col>
          </a-tab-pane>
        </a-tabs>
      </a-row>
    </a-spin>
    <!-- 编辑付款单 -->
    <PayableModel ref="modelForm" @refresh="refresh"></PayableModel>
    <!-- 编辑发票 -->
    <PayUploadInvoice ref="invoiceForm" @refresh="refresh"></PayUploadInvoice>
  </a-drawer>
</template>

<script>
import { editPayment, deletePayment, getDetail, editInvoice, deleteInvoice } from '@/api/fund-management/PaymentList.js'
import PayableModel from './PayableModel'
import PayUploadInvoice from './PayUploadInvoice'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin'
import { getDictText } from '@/api/api.js'
export default {
  mixins: [TableListMixin],
  components: { PayableModel, PayUploadInvoice },
  data() {
    return {
      // 开关
      visible: false,
      // 是否禁用
      disableSubmit: false,
      // 标题
      title: '详情',
      // 当前模式 0-添加 1-编辑 2-详情
      type: 0,
      // 表单配置
      labelCol: { span: 6 },
      wrapperCol: { span: 17 },

      // 表单参数
      formParams: {},
      // 付款单表格配置
      columns: [
        {
          title: '付款时间',
          dataIndex: 'time',
          align: 'center',
          width: '16%',
        },
        {
          title: '操作人',
          dataIndex: 'operator',
          align: 'center',
          width: '16%',
        },
        {
          title: '付款金额',
          dataIndex: 'amount',
          align: 'center',
          width: '16%',
        },
        {
          title: '付款方式',
          dataIndex: 'type',
          align: 'center',
          width: '16%',
          // 1-电汇，2-转账，3-汇票，4-其他
          customRender(text) {
            if (text == 1) {
              return '电汇'
            } else if (text == 2) {
              return '转账'
            } else if (text == 3) {
              return '汇票'
            } else if (text == 4) {
              return '其他'
            } else {
              return ''
            }
          },
        },
        {
          title: '付款凭证',
          dataIndex: 'certificateUrl',
          align: 'center',
          width: '16%',
          scopedSlots: { customRender: 'certificateUrl' },
        },
        {
          title: '备注',
          dataIndex: 'remark',
          align: 'center',
          width: '16%',
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          fixed: 'right',
          width: 200,
          scopedSlots: { customRender: 'action' },
        },
      ],
      // 发票记录
      columnsInvoice: [
        {
          title: '操作时间',
          dataIndex: 'time',
          align: 'center',
          width: '33%',
        },
        {
          title: '操作人',
          dataIndex: 'operator',
          align: 'center',
          width: '33%',
        },
        {
          title: '发票票据',
          dataIndex: 'invoiceUrl',
          align: 'center',
          width: '33%',
          scopedSlots: { customRender: 'invoiceUrl' },
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          fixed: 'right',
          width: 200,
          scopedSlots: { customRender: 'action' },
        },
      ],
      dataSourceInvoice: [{ num: '110' }],
      disableMixinCreated: true,
      activeKey: '1',
      // 表单验证规则
      rules: {
        supplierName: [{ required: true, message: '请输入供应商名称', trigger: 'change' }],
      },
      // 加载动画开关
      loading: false,
      dataSource: [],
      currnetId: '',
      currnetRow: [],
    }
  },

  methods: {
    getDictText,
    // 切换tab
    handleChange(key) {
      this.activeKey = key
    },
    // 新增付款单
    handleAdd() {
      this.$refs.modelForm.add(this.currnetId)
      this.$refs.modelForm.type = 0
    },
    // 编辑付款单
    handleEdit(record, index) {
      this.$refs.modelForm.edit(record, index, this.currnetId)
      this.$refs.modelForm.type = 1
    },
    // 移除付款单
    handleDelete(record) {
      console.log(this.currnetId)
      let that = this
      this.$confirm({
        title: '确认移除',
        content: '是否移除付款单?',
        onOk: function () {
          that.loading = true
          deletePayment({ id: that.currnetId, billId: record.billId })
            .then((res) => {
              if (res.success) {
                that.$message.success('移除成功')
                that.getDetail(that.currnetId)
              } else {
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              that.loading = false
            })
        },
      })
    },
    handleSee(record) {
      console.log(record)
      window.open(record.certificateUrl)
    },
    // 新增发票
    handleAddInvoice() {
      this.$refs.invoiceForm.add(this.currnetId)
      this.$refs.invoiceForm.type = 0
    },
    // 编辑发票
    handleEditInvoice(record, index) {
      this.$refs.invoiceForm.edit(record, index, this.currnetId)
      this.$refs.invoiceForm.type = 1
    },
    // 查看发票单
    handleSeeInvoice(record) {
      console.log(record)
      window.open(record.invoiceUrl)
    },
    // 移除发票
    handleDeleteInvoice(record) {
      let that = this
      this.$confirm({
        title: '确认移除',
        content: '是否移除发票?',
        onOk: function () {
          that.loading = true
          deleteInvoice({ id: that.currnetId, invoiceId: record.invoiceId })
            .then((res) => {
              if (res.success) {
                that.$message.success('移除成功')
                that.getDetail(that.currnetId)
              } else {
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              that.loading = false
            })
        },
      })
    },
    refresh() {
      this.getDetail(this.currnetId)
    },
    close() {
      this.visible = false
      this.formParams = {}
      this.dataSource = []
      this.dataSourceInvoice = []
      this.currnetId = ''
      this.currnetRow = []
      this.activeKey = '1'
    },
    detail(record) {
      console.log(record)
      this.type = 2
      this.currnetId = record.id
      this.currnetRow = record
      this.getDetail(record.id)
      this.visible = true
    },
    // 获取详情
    getDetail(id) {
      console.log('-----')
      this.loading = true
      getDetail(id)
        .then((res) => {
          if (res.success) {
            this.formParams = res.result
            this.dataSource = res.result.bill
            this.dataSourceInvoice = res.result.invoice
          } else {
            return false
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>

<style lang="less" scoped>
.title {
  background-color: #f8faff;
  padding: 10px;
  margin: 20px 0;
  font-weight: 600;
}
.content {
  padding: 0 20px;
  margin: 20px 0;
}
</style>
