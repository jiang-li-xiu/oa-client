<template>
  <a-card class="registration">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form-model ref="ruleForm" v-model="param" layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-model-item label="申请人" prop="applicat">
              <a-input v-model="param.applicat" placeholder="请输入申请人" />
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="申请时间" prop="buildDate">
              <a-range-picker v-model="times" style="width: 100%" @change="handleRangePickerChange" />
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="客户名称" prop="applicat">
              <a-input v-model="param.applicat" placeholder="请输入客户名称" />
            </a-form-model-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-model-item label="项目名称" prop="applicat">
                <a-input v-model="param.applicat" placeholder="请输入项目名称" />
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

      <!-- 按钮区域 -->
      <div class="table-operator">
        <a-button type="primary" @click="handleAdd" icon="plus">提交申请</a-button>
      </div>

      <!-- tabs区域 -->
      <a-tabs v-model="currentTab" default-active-key="1" @change="handleTabsChange">
        <a-tab-pane :key="null" tab="全部"></a-tab-pane>
        <a-tab-pane :key="1" tab="待提交"></a-tab-pane>
        <a-tab-pane :key="2" tab="待审批"></a-tab-pane>
        <a-tab-pane :key="3" tab="审批通过"></a-tab-pane>
        <a-tab-pane :key="4" tab="不通过"></a-tab-pane>
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
          <a @click="handleDetail(record)">申请详情</a>
          <a-divider type="vertical" />
          <a @click="handleDetail(record)">删除</a>
        </template>
      </a-table>

      <CrmApplicationModel ref="modalForm" @refresh="loadData(1)" />
    </div>
  </a-card>
</template>

<script>
import CrmApplicationModel from './modules/CrmApplicationModel'
import moment from 'moment'
import { simpleDebounce } from '@/utils/util'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin'

export default {
  mixins: [TableListMixin],
  components: { CrmApplicationModel },
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
      columns: [
        {
          title: '申请时间',
          dataIndex: 'projectName',
          align: 'center',
          width: 260,
          ellipsis: true,
        },
        {
          title: '申请部门',
          dataIndex: 'processName',
          align: 'center',
          width: 260,
          ellipsis: true,
        },
        {
          title: '申请人',
          dataIndex: 'approveName',
          align: 'center',
          width: 260,
          ellipsis: true,
        },
        {
          title: '申请类别',
          dataIndex: 'applicat',
          align: 'center',
          width: 260,
          ellipsis: true,
        },
        {
          title: '客户名称',
          align: 'center',
          dataIndex: 'time',
          width: 260,
          ellipsis: true,
        },
        {
          align: 'center',
          title: '项目名称',
          dataIndex: 'department',
          width: 260,
          ellipsis: true,
        },
        {
          align: 'center',
          title: '当前审批人',
          dataIndex: 'aaaa',
          width: 260,
          ellipsis: true,
        },
        {
          align: 'center',
          title: '审批状态',
          dataIndex: 'status',
          width: 260,
          ellipsis: true,
          // 1-待提交，2-待审批，3-审批通过，4-不通过
          customRender(text) {
            return text == 1 ? '待提交' : text == 2 ? '待审批' : text == 3 ? '审批通过' : '不通过'
          },
        },
        {
          align: 'center',
          title: '审批时间',
          dataIndex: 'bbb',
          width: 260,
          ellipsis: true,
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
      // 当前状态
      orderPattern: null,
      // 不执行混入中的created
      disableMixinCreated: true,
      // 创建时间
      times: [],
      // 接口地址
      url: {
        list: '',
      },
    }
  },
  created() {
    // 获取状态列表, null为全部
    this.handleTabsChange(null)
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
        let pendingId = this.$store.getters.userInfo.id
        // this.url.list = `/prodSchemeApprove/list?pendingId=${pendingId}`
        // this.loadData(1)
      } else if (key == 2) {
        // 已审批
        let approve = this.$store.getters.userInfo.id
        // this.url.list = `/prodSchemeApprove/list?approve=${approve}`
        // this.loadData(1)
      } else {
        // 全部
        // this.url.list = `/prodSchemeApprove/list`
        // this.loadData(1)
      }
    },

    // 点击查看审批详情
    handleDetail(record) {
      // 打开详情弹窗
      this.$refs.detail.approvalDetail(record)
      this.$refs.detail.disableSubmit = true
      this.$refs.detail.title = '详情'
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
