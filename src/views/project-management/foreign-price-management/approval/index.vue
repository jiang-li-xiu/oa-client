<!--
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-09-21 16:04:48
 * @LastEditors: JLX
 * @LastEditTime: 2022-12-26 14:14:34
-->

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
            <span style="float: left; overflow: hidden" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">搜索</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form-model>

      <!-- tabs区域 -->
      <a-tabs v-model="currentTab" default-active-key="1" @change="handleTabsChange">
        <a-tab-pane :key="null" tab="全部"></a-tab-pane>
        <a-tab-pane :key="1" tab="待审批"></a-tab-pane>
        <a-tab-pane :key="2" tab="已审批"></a-tab-pane>
        <!-- <a-tab-pane v-for="dict in taskStatusList" :key="dict.value" :tab="dict.title"></a-tab-pane> -->
      </a-tabs>

      <!-- 表格区域 -->
      <div class="title">审批列表</div>
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
          <template v-if="currentTab == 1">
            <a @click="handleBack(record)">回退</a>
            <a-divider type="vertical" />
            <a @click="handleApproval(record)">审批</a>
            <a-divider type="vertical" />
          </template>
          <a @click="handleDetail(record)">详情</a>
        </template>
      </a-table>

      <!-- 查看详情 -->
      <detail-dialog ref="detail" />
      <!-- 审批 -->
      <ApprovalDialog ref="approvalFrom" @refresh="loadData(1)"></ApprovalDialog>
      <!-- 回退 -->
      <BackDialog ref="backFrom" @refresh="loadData(1)"></BackDialog>
    </div>
  </a-card>
</template>

<script>
// 组件
import ApprovalDialog from './components/ApprovalDialog.vue'
import BackDialog from './components/BackDialog.vue'
import detailDialog from '@/views/project-management/foreign-price-management/project-profit/components/AddAndDetailDialog.vue'
import moment from 'moment'
import { simpleDebounce } from '@/utils/util'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin'

export default {
  components: { detailDialog, ApprovalDialog, BackDialog },
  mixins: [TableListMixin],
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
          title: '项目名称',
          dataIndex: 'projectName',
          align: 'center',
          width: 380,
          ellipsis: true
        },
        {
          title: '当前审批人',
          dataIndex: 'approveName',
          align: 'center',
          width: 380,
          ellipsis: true
        },
        {
          title: '申请人',
          dataIndex: 'applicat',
          align: 'center',
          width: 380,
          ellipsis: true
        },
        {
          title: '申请时间',
          align: 'center',
          dataIndex: 'time',
          width: 380,
          ellipsis: true
        },
        {
          align: 'center',
          title: '所属部门',
          dataIndex: 'department',
          width: 380,
          ellipsis: true
        },
        {
          align: 'center',
          title: '审批状态',
          dataIndex: 'status',
          width: 380,
          ellipsis: true,
          // 1-审批中，2-已撤销，3-已通过，4-不通过
          customRender(text) {
            return text == 1 ? '审批中' : text == 2 ? '已撤销' : text == 3 ? '已通过' : '不通过'
          }
          // scopedSlots: { customRender: 'taskStatus' },
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          fixed: 'right',
          width: 200,
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 当前状态
      orderPattern: null,
      // 不执行混入中的created
      disableMixinCreated: true,
      // 创建时间
      times: [],
      // 接口地址
      url: {
        list: '/jeecg-supplier/ProdProfitsApprove/list'
      }
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
        this.url.list = `/jeecg-supplier/ProdProfitsApprove/list?pendingId=${pendingId}`
        this.loadData(1)
      } else if (key == 2) {
        // 已审批
        let approve = this.$store.getters.userInfo.id
        this.url.list = `/jeecg-supplier/ProdProfitsApprove/list?approve=${approve}`
        this.loadData(1)
      } else {
        // 全部
        this.url.list = `/jeecg-supplier/ProdProfitsApprove/list`
        this.loadData(1)
      }
    },

    // 回退
    handleBack(record) {
      this.$refs.backFrom.open(record)
    },

    // 审批
    handleApproval(record) {
      this.$refs.approvalFrom.openApproval(record)
    },

    // 点击查看详情
    handleDetail(record) {
      // 打开详情弹窗
      this.$refs.detail.officeDetail(record.details)
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
    }
  }
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
