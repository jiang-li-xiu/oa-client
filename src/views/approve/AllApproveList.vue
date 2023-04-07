<template>
  <a-card class="registration">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form-model ref="ruleForm" v-model="param" layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-model-item label="申请类别" prop="people">
              <j-dict-select-tag v-model="param.people" dictCode="approval_category" placeholder="请选择申请类别" />
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="申请人" prop="people">
              <a-input v-model="param.people" placeholder="请输入申请人" />
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="申请时间" prop="time">
              <a-range-picker v-model="times" style="width: 100%" @change="handleRangePickerChange" />
            </a-form-model-item>
          </a-col>

          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-model-item label="客户名称" prop="customerName">
                <a-input v-model="param.customerName" placeholder="请输入客户名称" />
              </a-form-model-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-model-item label="项目名称" prop="projectName">
                <a-input v-model="param.projectName" placeholder="请输入项目名称" />
              </a-form-model-item>
            </a-col>
          </template>
          <a-col :md="6" :sm="8">
            <span style="float: left; overflow: hidden" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">搜索</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form-model>

      <!-- tabs区域 -->
      <a-tabs v-model="currentTab" default-active-key="1" @change="handleTabsChange">
        <a-tab-pane :key="1" tab="待审批"></a-tab-pane>
        <a-tab-pane :key="2" tab="已审批"></a-tab-pane>
      </a-tabs>

      <!-- 表格区域 -->
      <a-table
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
        <template #action="text, record">
          <a @click="handleApproval(record, 1)">审批-方案</a>
          <a-divider type="vertical" />
          <a @click="handleApproval(record, 3)">审批-报价</a>
          <a-divider type="vertical" />
          <a @click="handleApproval(record, 4)">审批-采购</a>
          <a-divider type="vertical" />
          <a @click="handleApproval(record, 5)">审批-合同</a>
          <a-divider type="vertical" />
          <a @click="handleApproval(record, 6)">审批-合约</a>
        </template>
      </a-table>

      <!-- 方案审批详情 -->
      <PlanApprovalForm ref="planForm" @refresh="loadData(1)"></PlanApprovalForm>
      <!-- 利润/报价审批详情 -->
      <ProfitApprovalForm ref="profitForm" @refresh="loadData(1)"></ProfitApprovalForm>
      <!-- 采购审批 -->
      <PurchaseRequestForm ref="purchaseForm" @refresh="loadData(1)"></PurchaseRequestForm>
      <!-- 合同审批 -->
      <ContractForm ref="contractForm" @refresh="loadData(1)"></ContractForm>
      <!-- 合约项目申请 -->
      <CrmApplicationModel ref="applicationForm" @refresh="loadData(1)"></CrmApplicationModel>
    </div>
  </a-card>
</template>

<script>
import PlanApprovalForm from '@/views/project-management/plan-management/plan-management/components/AddSchemeSelectDialog.vue'
import ProfitApprovalForm from '@/views/project-management/foreign-price-management/project-profit/components/AddAndDetailDialog.vue'
import PurchaseRequestForm from '@/views/project-management/procurement/purchase-request/components/AddAndDetailDialog.vue' //采购审批
import ContractForm from '@/views/contract-management/contract-application/components/AddAndDetailDialog.vue' //合同审批
import CrmApplicationModel from '@/views/scrm/modules/CrmApplicationModel.vue' //合约项目申请
import moment from 'moment'
import { simpleDebounce } from '@/utils/util'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin'

export default {
  mixins: [TableListMixin],
  components: { PlanApprovalForm, ProfitApprovalForm, PurchaseRequestForm, ContractForm, CrmApplicationModel },
  props: {},
  data() {
    return {
      // 查询表单
      param: {},
      // 当前选中的tab页
      currentTab: null,
      // 表格配置
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          align: 'center',
          width: 60,
          customRender(text, record, index) {
            return index + 1
          },
        },
        {
          title: '提交时间',
          dataIndex: 'applyTime',
          align: 'center',
          width: 220,
          ellipsis: true,
        },
        {
          title: '申请部门',
          dataIndex: 'department',
          align: 'center',
          width: 220,
          ellipsis: true,
        },
        {
          title: '申请人',
          dataIndex: 'applyPeople',
          align: 'center',
          width: 220,
          ellipsis: true,
        },
        {
          title: '申请类别',
          dataIndex: 'type',
          align: 'center',
          width: 220,
          ellipsis: true,
          //  1-方案审批-方案类型，2-方案审批-新增并选型，3-利润审批，4-采购审批
          customRender: (value) => getDictText('approval_type', value),
        },
        {
          title: '客户名称',
          align: 'center',
          dataIndex: 'customerName',
          width: 220,
          ellipsis: true,
        },
        {
          align: 'center',
          title: '项目名称',
          dataIndex: 'projectName',
          width: 220,
          ellipsis: true,
        },
        {
          align: 'center',
          title: '当前审批人',
          dataIndex: 'approver',
          width: 220,
          ellipsis: true,
        },
        {
          align: 'center',
          title: '审批状态',
          dataIndex: 'status',
          width: 220,
          ellipsis: true,
          // 1-审批中，2-审批通过，3-审批不通过
          customRender(text) {
            return text == 1 ? '审批中' : text == 2 ? '审批通过' : text == 3 ? '审批不通过' : ''
          },
        },
        {
          align: 'center',
          title: '审批时间',
          dataIndex: 'approveTime',
          width: 220,
          ellipsis: true,
        },
        {
          align: 'center',
          title: '审批备注',
          dataIndex: 'approveRemark',
          width: 220,
          ellipsis: true,
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          fixed: 'right',
          width: 450,
          scopedSlots: { customRender: 'action' },
        },
      ],
      // 不执行混入中的created
      disableMixinCreated: true,
      // 创建时间
      times: [],
      // 接口地址
      url: {
        list: '/prodApprove/list',
      },
    }
  },
  created() {
    this.handleTabsChange(1)
  },
  methods: {
    moment,
    // 审批
    handleApproval(record, type) {
      if (type == 1) {
        // 方案审批
        this.$refs.planForm.approvalDetail(record)
        this.$refs.planForm.title = '方案详情'
        this.$refs.planForm.type = 4
      } else if (type == 3) {
        // 利润表/报价审批
        this.$refs.profitForm.officeDetail(record)
        this.$refs.profitForm.type = 3
      } else if (type == 4) {
        // 采购审批
        this.$refs.purchaseForm.approvalDetail(record)
      } else if (type == 5) {
        // 合同审批
        this.$refs.contractForm.approvalDetail(record)
      } else if (type == 6) {
        this.$refs.applicationForm.approvalDetail(record)
      }
    },
    // tabs切换tab回调
    handleTabsChange(key) {
      this.currentTab = key
      console.log(this.currentTab)
      // 清空选中的数据
      this.selectedRowKeys = []
      if (key == 1) {
        // 待审批
        this.url.list = `/prodApprove/list?isApproved=1&approverId=*${this.$store.getters.userInfo.id}*`
        this.loadData(1)
      } else if (key == 2) {
        // 已审批
        this.url.list = `/prodApprove/list?isApproved=2&approverId=*${this.$store.getters.userInfo.id}*`
        this.loadData(1)
      } else {
        // 全部
        this.url.list = `/prodApprove/list`
        this.loadData(1)
      }
    },
    // 处理搜索时间
    handleRangePickerChange(dates, dateStrings) {
      this.param.time_begin = dateStrings[0]
      this.param.time_end = dateStrings[1]
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
</style>
