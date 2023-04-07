<template>
  <a-card class="registration">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form-model ref="ruleForm" v-model="param" layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-model-item label="申请类别" prop="type">
              <!-- <j-dict-select-tag v-model="param.type" dictCode="approval_category" placeholder="请选择申请类别" /> -->
              <a-select v-model="param.type" placeholder="请选择申请类别">
                <a-select-option value="1">方案审批</a-select-option>
                <a-select-option value="2">方案并选型审批</a-select-option>
                <a-select-option value="3">报价申请</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="申请人" prop="applyPeople">
              <j-input v-model="param.applyPeople" placeholder="请输入申请人" />
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="提交时间" prop="applyTime">
              <a-range-picker
                v-model="times"
                style="width: 100%"
                @change="handleRangePickerChange"
                format="YYYY-MM-DD HH:mm:ss"
                :show-time="{
                  hideDisabledOptions: true,
                  defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                }"
              />
            </a-form-model-item>
          </a-col>

          <template v-if="toggleSearchStatus">
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
        <!-- <a-tab-pane :key="null" tab="全部"></a-tab-pane> -->
        <a-tab-pane :key="1" tab="待审批"></a-tab-pane>
        <a-tab-pane :key="2" tab="已审批"></a-tab-pane>
        <!-- <a-tab-pane v-for="dict in taskStatusList" :key="dict.value" :tab="dict.title"></a-tab-pane> -->
      </a-tabs>

      <!-- 表格区域 -->
      <!-- <div class="title">审批列表</div> -->
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
          <!-- 提交方案 -->
          <template v-if="[1, 2].includes(record.type)">
            <a @click="handleApproval(record, 1)">{{ record.status == 1 ? '审批' : '详情' }}</a>
          </template>
          <template v-if="record.type == 3">
            <a @click="handleApproval(record, 3)">{{ record.status == 1 ? '审批' : '详情' }}</a>
          </template>
          <!-- <a-divider type="vertical" /> -->
          <!-- <a @click="handleDetail(record)">项目详情</a> -->
        </template>
      </a-table>

      <!-- 查看详情 -->
      <!-- <detail-dialog ref="detail" /> -->
      <!-- 审批 -->
      <!-- <ApprovalDialog ref="approvalFrom" @refresh="loadData(1)"></ApprovalDialog> -->
      <!-- 方案审批详情 -->
      <PlanApprovalForm ref="planForm" @refresh="loadData(1)"></PlanApprovalForm>
      <!-- 利润审批详情 -->
      <ProfitApprovalForm ref="profitForm" @refresh="loadData(1)"></ProfitApprovalForm>
      <!-- 项目详情 -->
      <CrmProjectDetail ref="projectForm" :is_show="false"></CrmProjectDetail>
    </div>
  </a-card>
</template>

<script>
// 组件
// import ApprovalDialog from './components/ApprovalDialog.vue'
import PlanApprovalForm from '@/views/project-management/plan-management/plan-management/components/AddSchemeSelectDialog.vue'
import ProfitApprovalForm from '@/views/project-management/foreign-price-management/project-profit/components/AddAndDetailDialog.vue'
import CrmProjectDetail from './modules/CrmProjectDetail'
import moment from 'moment'
import { simpleDebounce } from '@/utils/util'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin'
import { getDictText } from '@/api/api.js'
export default {
  components: { PlanApprovalForm, ProfitApprovalForm, CrmProjectDetail },
  mixins: [TableListMixin],
  props: {},
  data() {
    return {
      // 查询表单
      param: {},
      // 全部任务列表
      taskStatusList: [],
      // 当前选中的tab页
      currentTab: 1,
      // 表格配置
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          align: 'center',
          width: '11%',
          customRender(text, record, index) {
            return index + 1
          },
        },
        {
          title: '申请人',
          dataIndex: 'applyPeople',
          align: 'center',
          width: '11%',
          ellipsis: true,
        },
        {
          title: '申请时间',
          align: 'center',
          dataIndex: 'applyTime',
          width: '11%',
          ellipsis: true,
        },
        {
          title: '申请类别',
          align: 'center',
          dataIndex: 'type',
          width: '11%',
          ellipsis: true,
          //  1-方案审批-方案类型，2-方案审批-新增并选型，3-利润审批，4-采购审批
          customRender: (value) => getDictText('approval_type', value),
        },
        {
          title: '客户名称',
          align: 'center',
          dataIndex: 'customerName',
          width: '11%',
          ellipsis: true,
        },
        {
          title: '客户联系方式',
          align: 'center',
          dataIndex: 'customerPhone',
          width: '11%',
          ellipsis: true,
        },
        {
          title: '项目名称',
          dataIndex: 'projectName',
          align: 'center',
          width: '11%',
          ellipsis: true,
        },
        {
          align: 'center',
          title: '审批状态',
          dataIndex: 'status',
          width: '11%',
          ellipsis: true,
          customRender: (d) => {
            // 1-待审批，2-审批通过，3-审批不通过，4-申请通过
            if (d == 1) {
              return <a-tag color="blue">待审批</a-tag>
            } else if (d == 2) {
              return <a-tag color="#87d068">审批通过</a-tag>
            } else if (d == 3) {
              return <a-tag color="pink">审批不通过</a-tag>
            } else if (d == 4) {
              return <a-tag color="blue">申请通过</a-tag>
            } else {
              return d
            }
          },
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
      dataSource: [],
      // 当前状态
      orderPattern: null,
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
    // 获取状态列表
    this.handleTabsChange(1)
  },
  methods: {
    moment,
    // getDictText,

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
    // 审批
    handleApproval(record, type) {
      console.log(record)
      if (type == 1) {
        // 方案审批
        this.$refs.planForm.approvalDetail(record)
        this.$refs.planForm.title = '方案详情'
        this.$refs.planForm.type = 4
      } else if (type == 3) {
        // 利润表审批
        this.$refs.profitForm.officeDetail(record)
        this.$refs.profitForm.type = 3
      }
    },
    // 项目详情
    handleDetail(record) {
      this.$refs.projectForm.open(record)
      this.$refs.projectForm.currnetId = record.id
      this.$refs.projectForm.currnetRow = record
      this.$refs.projectForm.formParams = { ...record }
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
</style>
