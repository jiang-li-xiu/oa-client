<template>
  <a-card :bordered="false" class="assembly-container-col">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form-model ref="ruleForm" v-model="param" layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-model-item label="提交时间" prop="createTime">
              <a-range-picker v-model="times" style="width: 100%" @change="handleRangePickerChange" />
            </a-form-model-item>
          </a-col>
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
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-model-item label="合同名称" prop="contract">
                <j-input v-model="param.contract" placeholder="请输入合同名称" />
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
        <!-- <a-button icon="delete" type="danger" @click="batchPathDel()" :disabled="selectedRowKeys.length === 0"
          >删除
        </a-button> -->
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
      <div class="table">
        <a-table
          :columns="columns"
          rowKey="id"
          :pagination="ipagination"
          :data-source="dataSource"
          bordered
          :scroll="{ x: true }"
          @change="handleTableChange"
          :loading="loading"
        >
          <template #action="row">
            <a-space :size="12">
              <a href="javascript:;" @click="handleEdit(row)" :disabled="row.status !== 1">编辑</a>
              <a-divider type="vertical" />
              <a href="javascript:;" @click="handleDetail(row)">详情</a>
              <a-divider type="vertical" />
              <a-dropdown>
                <a class="ant-dropdown-link"> 更多 <a-icon type="down" /> </a>
                <a-menu slot="overlay">
                  <a-menu-item>
                    <a href="javascript:;" @click="batchPathDel(row.id)" :disabled="[3, 4].includes(row.status)"
                      >删除
                    </a>
                  </a-menu-item>
                  <a-menu-item>
                    <a @click="handleCancel(row.id)">取消</a>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </a-space>
          </template>
        </a-table>
      </div>
    </div>

    <!-- 新增详情弹窗 -->
    <add-and-detail-dialog ref="modalForm" @refresh="loadData(1)"></add-and-detail-dialog>
  </a-card>
</template>

<script>
import { cancel } from '@/api/contract-management/ContractApplication.js'
// 组件
import AddAndDetailDialog from './components/AddAndDetailDialog.vue'
// 导入
import ImportExcelModal from '@/components/ImportExcelModal'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin'
import { getDictText } from '@/api/api.js'
import { simpleDebounce } from '@/utils/util'
export default {
  mixins: [TableListMixin],
  components: { AddAndDetailDialog, ImportExcelModal },
  data() {
    return {
      // 查询参数
      param: {},
      // 当前选中的tab页
      currentTab: null,
      // 表格配置
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          align: 'center',
          width: 80,
          customRender(text, record, index) {
            return index + 1
          },
        },
        {
          title: '提交时间',
          dataIndex: 'createTime',
          align: 'center',
          width: 200,
          ellipsis: true,
        },
        {
          title: '审批状态',
          dataIndex: 'status',
          align: 'center',
          width: 200,
          ellipsis: true,
          customRender: (d) => {
            // 1-待提交，2-审批中，3-审批通过，4-审批不通过
            if (d == 1) {
              return <a-tag color="blue">待提交</a-tag>
            } else if (d == 2) {
              return <a-tag color="blue">审批中</a-tag>
            } else if (d == 3) {
              return <a-tag color="#87d068">审批通过</a-tag>
            } else if (d == 4) {
              return <a-tag color="pink">审批不通过</a-tag>
            } else {
              return d
            }
          },
        },
        {
          title: '申请部门',
          dataIndex: 'applyInfo.dept',
          align: 'center',
          width: 200,
          ellipsis: true,
        },
        {
          title: '申请人',
          dataIndex: 'applyInfo.people',
          align: 'center',
          width: 200,
          ellipsis: true,
        },
        {
          title: '申请类别',
          dataIndex: 'type',
          align: 'center',
          width: 200,
          ellipsis: true,
          customRender(text) {
            //1-合同签署申请
            return text == 1 ? '合同签署申请' : ''
          },
        },
        {
          title: '客户名称',
          dataIndex: 'customerName',
          align: 'center',
          width: 200,
          ellipsis: true,
        },
        {
          title: '项目名称',
          dataIndex: 'projectName',
          align: 'center',
          width: 200,
          ellipsis: true,
        },
        {
          title: '供应商名称',
          dataIndex: 'supplierName',
          align: 'center',
          width: 200,
          ellipsis: true,
        },
        {
          title: '合同名称',
          dataIndex: 'contract',
          align: 'center',
          width: 200,
          ellipsis: true,
        },
        {
          title: '审批人',
          dataIndex: 'approver',
          align: 'center',
          width: 200,
          ellipsis: true,
        },
        {
          title: '审批时间',
          dataIndex: 'approveTime',
          align: 'center',
          width: 200,
          ellipsis: true,
        },
        {
          title: '审批备注',
          dataIndex: 'approveRemark',
          align: 'center',
          width: 200,
          ellipsis: true,
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          fixed: 'right',
          width: 250,
          scopedSlots: { customRender: 'action' },
        },
      ],
      // 请求地址
      url: {
        list: `/ctt/ContractLedger/list?peopleId=${this.$store.getters.userInfo.id}`, // 列表
        deleteBatch: '/ctt/ContractLedger/batch',
      },
      times: [],
    }
  },
  created() {
    // 获取状态列表, null为全部
    this.handleTabsChange(null)
  },
  methods: {
    // tabs切换tab回调
    handleTabsChange(key) {
      this.currentTab = key
      console.log(this.currentTab)
      // 清空选中的数据
      this.selectedRowKeys = []
      if (key) {
        this.url.list = `/ctt/ContractLedger/list?status=${key}&peopleId=${this.$store.getters.userInfo.id}`
        this.loadData(1)
      } else {
        // 全部
        this.url.list = `/ctt/ContractLedger/list?peopleId=${this.$store.getters.userInfo.id}`
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
      this.param.createTime_begin = dateStrings[0]
      this.param.createTime_end = dateStrings[1]
    },
    // 检索：重置按钮
    searchReset() {
      for (let key in this.param) {
        if (key != 'ids') {
          this.param[key] = null
        }
      }
      this.times = []
      simpleDebounce(this.loadData, 0)(1)
    },
  },
}
</script>

<style lang="less" scoped>
.assembly-container-col {
  min-height: calc(100vh - 135px);
  background-color: #fff;
}
::v-deep .ant-table td {
  white-space: nowrap;
}
</style>
