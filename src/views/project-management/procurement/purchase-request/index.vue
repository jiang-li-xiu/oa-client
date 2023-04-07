<template>
  <a-card class="registration">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form-model ref="ruleForm" v-model="param" layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
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
          <a-col :md="6" :sm="8">
            <a-form-model-item label="申请类别" prop="type">
              <a-select v-model="param.type" placeholder="请选择申请类别">
                <a-select-option value="1">部门采购申请</a-select-option>
                <a-select-option value="2">三方比价申请</a-select-option>
                <a-select-option value="3">采购下单申请</a-select-option>
              </a-select>
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

      <!-- 按钮区域 -->
      <div class="table-operator">
        <a-button type="primary" @click="handleAdd" icon="plus">提交申请</a-button>
      </div>

      <!-- tabs区域 -->
      <a-tabs v-model="currentTab" default-active-key="1" @change="handleTabsChange">
        <a-tab-pane :key="null" tab="全部"></a-tab-pane>
        <a-tab-pane :key="4" tab="待提交"></a-tab-pane>
        <a-tab-pane :key="1" tab="待审批"></a-tab-pane>
        <a-tab-pane :key="2" tab="审批通过"></a-tab-pane>
        <a-tab-pane :key="3" tab="不通过"></a-tab-pane>
        <a-tab-pane :key="5" tab="抄送"></a-tab-pane>
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
          <a @click="handleEdit(record)" :disabled="record.status !== 4">编辑</a>
          <a-divider type="vertical" />
          <a @click="handleDetail(record)">申请详情</a>
          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link"> 更多 <a-icon type="down" /> </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="batchPathDel(record.id)" :disabled="[2, 3].includes(record.status)">删除</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="handleCancel(record.id)">取消</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </template>
      </a-table>

      <AddAndDetailDialog ref="modalForm" @refresh="loadData(1)" />
    </div>
  </a-card>
</template>

<script>
import { cancel } from '@/api/project-management/PurchaseRequest.js'
import AddAndDetailDialog from './components/AddAndDetailDialog'
import moment from 'moment'
import { simpleDebounce } from '@/utils/util'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin'

export default {
  mixins: [TableListMixin],
  components: { AddAndDetailDialog },
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
          title: '申请时间',
          dataIndex: 'time',
          align: 'center',
          width: 220,
          ellipsis: true,
        },
        {
          align: 'center',
          title: '审批状态',
          dataIndex: 'status',
          width: 220,
          ellipsis: true,
          customRender: (d) => {
            // 1-审批中，2-审批通过，3-审批不通过 4-待提交
            if (d == 1) {
              return <a-tag color="blue">审批中</a-tag>
            } else if (d == 2) {
              return <a-tag color="#87d068">审批通过</a-tag>
            } else if (d == 3) {
              return <a-tag color="pink">审批不通过</a-tag>
            } else if (d == 4) {
              return <a-tag color="blue">待提交</a-tag>
            } else {
              return d
            }
          },
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
          dataIndex: 'people',
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
          // 1-部门申请，2-三方比价申请，3-采购下单申请
          customRender(text) {
            return text == 1 ? '部门采购申请' : text == 2 ? '三方比价申请' : text == 3 ? '采购下单申请' : ''
          },
        },
        {
          title: '客户名称',
          align: 'center',
          dataIndex: 'customerName',
          width: 220,
          ellipsis: true,
          customRender(text) {
            if (text && text !== 'null') {
              return text
            } else {
              return '无'
            }
          },
        },
        {
          align: 'center',
          title: '项目名称',
          dataIndex: 'projectName',
          width: 220,
          ellipsis: true,
          customRender(text) {
            if (text && text !== 'null') {
              return text
            } else {
              return '无'
            }
          },
        },
        {
          align: 'center',
          title: '审批人',
          dataIndex: 'approver',
          width: 220,
          ellipsis: true,
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
          width: 200,
          scopedSlots: { customRender: 'action' },
        },
      ],
      // 不执行混入中的created
      disableMixinCreated: true,
      // 创建时间
      times: [],
      // 接口地址
      url: {
        list: `/pcmProcurement/list?peopleId=${this.$store.getters.userInfo.id}`,
        deleteBatch: '/pcmProcurement/batch',
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
      if (key == 5) {
        this.url.list = `/pcmProcurement/list?ccPeople=${this.$store.getters.userInfo.id}`
        this.loadData(1)
      } else if (key == null) {
        this.url.list = `/pcmProcurement/list?peopleId=${this.$store.getters.userInfo.id}`
        this.loadData(1)
      } else {
        this.url.list = `/pcmProcurement/list?status=${key}&peopleId=${this.$store.getters.userInfo.id}`
        this.loadData(1)
      }
    },
    // 取消
    handleCancel(id) {
      let that = this
      this.$confirm({
        title: '确认取消',
        content: '是否取消申请?',
        onOk: function () {
          that.loading = true
          cancel(id)
            .then((res) => {
              if (res.success) {
                //重新计算分页问题
                that.reCalculatePage(that.selectedRowKeys.length)
                that.$message.success(res.message)
                that.loadData()
                that.onClearSelected()
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
.title {
  font-size: 16px;
  font-weight: 600;
  margin: 10px;
}
</style>
