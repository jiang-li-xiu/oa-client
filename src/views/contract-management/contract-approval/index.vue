<template>
  <a-card class="registration">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form-model ref="ruleForm" v-model="param" layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <!-- <a-col :md="6" :sm="8">
            <a-form-model-item label="申请类别" prop="type">
              <j-dict-select-tag v-model="param.type" dictCode="approval_category" placeholder="请选择申请类别" />
            </a-form-model-item>
          </a-col> -->
          <a-col :md="6" :sm="8">
            <a-form-model-item label="申请人" prop="applyPeople">
              <j-input v-model="param.applyPeople" placeholder="请输入申请人" />
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="提交时间" prop="applyTime">
              <a-range-picker v-model="times" style="width: 100%" @change="handleRangePickerChange" />
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="客户名称" prop="customerName">
              <j-input v-model="param.customerName" placeholder="请输入客户名称" />
            </a-form-model-item>
          </a-col>

          <template v-if="toggleSearchStatus">
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
          <!-- <template v-if="record.type == 5"> -->
          <a @click="handleApproval(record)">{{ record.status == 1 ? '审批' : '详情' }}</a>
        </template>
      </a-table>

      <!-- 合同审批 -->
      <ContractForm ref="contractForm" @refresh="loadData(1)"></ContractForm>
    </div>
  </a-card>
</template>

<script>
import ContractForm from '@/views/contract-management/contract-application/components/AddAndDetailDialog.vue' //合同审批
import moment from 'moment'
import { simpleDebounce } from '@/utils/util'
import { getDictText } from '@/api/api.js'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin'
export default {
  mixins: [TableListMixin],
  components: { ContractForm },
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
          dataIndex: 'applyPeopleDept',
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
        // {
        //   align: 'center',
        //   title: '当前审批人',
        //   dataIndex: 'approverName',
        //   width: 220,
        //   ellipsis: true,
        // },
        {
          align: 'center',
          title: '审批状态',
          dataIndex: 'status',
          width: 220,
          ellipsis: true,
          customRender: (d) => {
            // 1-审批中，2-审批通过，3-审批不通过
            if (d == 1) {
              return <a-tag color="blue">审批中</a-tag>
            } else if (d == 2) {
              return <a-tag color="#87d068">审批通过</a-tag>
            } else if (d == 3) {
              return <a-tag color="pink">审批不通过</a-tag>
            } else {
              return d
            }
          },
        },
        {
          align: 'center',
          title: '审批时间',
          dataIndex: 'approverTime',
          width: 220,
          ellipsis: true,
        },
        {
          align: 'center',
          title: '审批备注',
          dataIndex: 'remark',
          width: 220,
          ellipsis: true,
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          fixed: 'right',
          width: 150,
          scopedSlots: { customRender: 'action' },
        },
      ],
      // 不执行混入中的created
      disableMixinCreated: true,
      // 创建时间
      times: [],
      // 接口地址
      url: {
        list: `/prodApprove/list/contrant`,
      },
    }
  },
  created() {
    this.handleTabsChange(1)
  },
  methods: {
    moment,
    // 审批
    handleApproval(record) {
      // 合同审批
      this.$refs.contractForm.approvalDetail(record)
    },
    // tabs切换tab回调
    handleTabsChange(key) {
      this.currentTab = key
      console.log(this.currentTab)
      // 清空选中的数据
      this.selectedRowKeys = []
      if (key == 1) {
        // 待审批
        this.url.list = `/prodApprove/list/contrant?isApproved=1&approverId=*${this.$store.getters.userInfo.id}*`
        this.loadData(1)
      } else if (key == 2) {
        // 已审批
        this.url.list = `/prodApprove/list/contrant?isApproved=2&approverId=*${this.$store.getters.userInfo.id}*`
        this.loadData(1)
      } else {
        // 全部
        this.url.list = `/prodApprove/list/contrant`
        this.loadData(1)
      }
    },
    // 处理搜索时间
    handleRangePickerChange(dates, dateStrings) {
      this.param.applyTime_begin = dateStrings[0]
      this.param.applyTime_end = dateStrings[1]
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
