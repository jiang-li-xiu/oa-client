<!--
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-08-23 09:13:54
 * @LastEditors: JLX
 * @LastEditTime: 2022-11-09 10:20:29
-->
<template>
  <a-card :bordered="false" class="assembly-container-col">
    <!-- <a-tabs default-active-key="1">
      <a-tab-pane key="1" tab="供应商账号"> -->
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form-model ref="ruleForm" :model="param" layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-model-item label="企业名称" prop="supplier">
              <j-input v-model="param.supplier" placeholder="请输入企业名称" />
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="用户账号" prop="account">
              <j-input v-model="param.account" placeholder="请输入用户账号" />
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="手机号" prop="phone">
              <j-input v-model="param.phone" placeholder="请输入手机号" />
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
    </div>

    <!-- 表格区域 -->
    <div class="table">
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择
        <a style="font-weight: 600">{{ selectedRowKeys.length }}</a
        >项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        :columns="columns"
        rowKey="id"
        :pagination="ipagination"
        :data-source="dataSource"
        bordered
        :scroll="{ x: true }"
        :rowSelection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
          fixed: true
        }"
        @change="handleTableChange"
        :loading="loading"
      >
        <template #action="row">
          <a-space :size="12">
            <a href="javascript:;" @click="handleDetail(row)">详情</a>
            <!-- 待审批 0 已审批 1 审批通过 2 审批不通过 3 -->
            <template v-if="row.approval == 0 || row.approval == 3">
              <a-divider type="vertical" />
              <a @click="handleApprovalOpen(row)">审核</a>
            </template>
          </a-space>
        </template>
      </a-table>
    </div>

    <!-- 详情 -->
    <detailDialog ref="detailForm" @refresh="loadData(1)"></detailDialog>

    <!-- 审核 -->
    <approval-dialog ref="approvalForm" @refresh="loadData(1)"></approval-dialog>

    <!-- </a-tab-pane>
    </a-tabs> -->
  </a-card>
</template>

<script>
// api
import { passProduct } from '@api/supplier-management/approvalManagement.js'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin'
// 组件
import ApprovalDialog from './components/ApprovalDialog'
import detailDialog from '@/views/supplier-user-management/basic-information-management/components/EditDialog.vue'
//导入过滤对象中为空的属性、防抖方法
import { filterObj, simpleDebounce } from '@/utils/util'
// 字典
import { getDictText } from '@/api/api'
export default {
  mixins: [TableListMixin],
  components: { detailDialog, ApprovalDialog },
  data() {
    return {
      // 查询参数
      param: {
        industry: null
      },
      info: [],
      // 表格配置
      columns: [
        {
          title: '用户账号',
          dataIndex: 'account',
          align: 'center',
          width: 300,
          ellipsis: true
        },
        {
          title: '企业名称',
          dataIndex: 'supplier',
          align: 'center',
          width: 300,
          ellipsis: true
        },
        {
          title: '手机号',
          dataIndex: 'phone',
          align: 'center',
          width: 300,
          ellipsis: true
        },
        {
          title: '统一社会信用代码',
          dataIndex: 'creditCode',
          align: 'center',
          width: 300,
          ellipsis: true
        },
        {
          title: '用户类型',
          dataIndex: 'trade',
          align: 'center',
          width: 300,
          ellipsis: true,
          customRender: value => getDictText('supplier_type', value)
        },
        {
          title: '审批状态',
          dataIndex: 'approval',
          align: 'center',
          width: 300,
          ellipsis: true,
          customRender: value => getDictText('approval_status', value)
        },
        // {
        //   title: '服务范围',
        //   dataIndex: 'serviceArea',
        //   align: 'center',
        //   width: 250,
        //   ellipsis: true
        // },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          fixed: 'right',
          width: 250,
          ellipsis: true,
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 请求地址
      url: {
        // 列表
        list: '/jeecg-supplier/prodSupplier/notPass/list'
      }
    }
  },
  created() {
    this.$bus.$on('refreshApprovalList', this.refreshList)
  },
  beforeDestroy() {
    this.$bus.$off('refreshApprovalList', this.refreshList)
  },
  methods: {
    // 刷新审批管理的列表
    refreshList() {
      this.loadData(1)
    },

    // 详情
    handleDetail(row) {
      console.log(row)
      this.$refs.detailForm.detailApproval(row)
      this.$refs.detailForm.disableSubmit = true
      this.$refs.detailForm.title = '详情'
    },

    // 打开审核
    handleApprovalOpen(row) {
      this.$refs.approvalForm.openApproval(row.id)
    },

    // 查询参数渲染
    getQueryParams() {
      //获取高级查询条件
      let sqp = {}
      if (this.superQueryParams) {
        sqp['superQueryParams'] = encodeURI(this.superQueryParams)
        sqp['superQueryMatchType'] = this.superQueryMatchType
      }
      let param = Object.assign(sqp, this.param, this.isorter, this.filters)
      param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      param.roleCode = 'gongying'
      return filterObj(param)
    },
    getQueryField() {
      //TODO 字段权限控制
      let str = 'id,'
      this.columns.forEach(function(value) {
        str += ',' + value.dataIndex
      })
      return str
    }
  }
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
