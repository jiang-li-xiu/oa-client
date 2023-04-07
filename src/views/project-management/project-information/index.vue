<!--
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-09-14 17:14:52
 * @LastEditors: JLX
 * @LastEditTime: 2022-10-31 14:12:45
-->

<template>
  <a-card :bordered="false" class="assembly-container-col">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form-model ref="ruleForm" v-model="param" layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-model-item label="项目名称" prop="name">
              <j-input v-model="param.name" placeholder="请输入项目名称" />
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="甲方名称" prop="companyName">
              <j-input v-model="param.companyName" placeholder="请输入甲方名称" />
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="立项时间" prop="createTime">
              <a-range-picker v-model="times" style="width: 100%" @change="handleRangePickerChange" />
            </a-form-model-item>
          </a-col>

          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-model-item label="项目状态" prop="status">
                <j-dict-select-tag v-model="param.status" placeholder="请选择项目状态" dictCode="project_status" />
              </a-form-model-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-model-item label="联系方式" prop="customerPhone">
                <j-input v-model="param.customerPhone" placeholder="请输入联系方式" />
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
        <a-button type="primary" @click="handleAdd" icon="plus">新增</a-button>
        <a-button type="primary" @click="handleImport">导入</a-button>
        <a-button icon="delete" type="danger" @click="batchPathDel()" :disabled="selectedRowKeys.length === 0"
          >删除
        </a-button>
        <a-button icon="download" @click="getDownload('项目信息模版', 'xls')">下载模板</a-button>
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
              <a href="javascript:;" @click="handleEdit(row)">编辑</a>
              <a-divider type="vertical" />
              <a href="javascript:;" @click="handleDetail(row)">详情</a>
            </a-space>
          </template>
        </a-table>
      </div>
    </div>

    <!-- 新增详情弹窗 -->
    <add-and-detail-dialog ref="modalForm" @refresh="loadData(1)"></add-and-detail-dialog>
    <!-- 导入弹框 -->
    <import-excel-modal ref="importmodal" :url="url.importUrl" @ok="loadData" :showModel="false" />
  </a-card>
</template>

<script>
// 组件
import AddAndDetailDialog from './components/AddAndDetailDialog'
// 导入
import ImportExcelModal from '@/components/ImportExcelModal'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin'
// 字典
import { getDictText } from '@/api/api.js'
import { simpleDebounce } from '@/utils/util'
export default {
  mixins: [TableListMixin],
  components: { AddAndDetailDialog, ImportExcelModal },
  data() {
    return {
      // 查询参数
      param: {},
      // 表格配置
      columns: [
        {
          title: '项目名称',
          dataIndex: 'name',
          align: 'center',
          width: 250,
          ellipsis: true,
        },
        {
          title: '项目类型',
          dataIndex: 'type',
          align: 'center',
          width: 250,
          ellipsis: true,
          customRender: (value) => getDictText('project_type', value),
        },
        {
          title: '项目编号',
          dataIndex: 'code',
          align: 'center',
          width: 250,
          ellipsis: true,
        },
        {
          title: '甲方',
          dataIndex: 'companyName',
          align: 'center',
          width: 250,
          ellipsis: true,
        },
        {
          title: '项目联系人',
          dataIndex: 'customerName',
          align: 'center',
          width: 250,
          ellipsis: true,
        },
        {
          title: '联系方式',
          dataIndex: 'customerPhone',
          align: 'center',
          width: 250,
          ellipsis: true,
        },
        {
          title: '立项时间',
          dataIndex: 'createTime',
          align: 'center',
          width: 250,
          ellipsis: true,
        },
        {
          title: '合同签订时间',
          dataIndex: 'signContractTime',
          align: 'center',
          width: 250,
          ellipsis: true,
        },
        {
          title: '项目状态',
          dataIndex: 'status',
          align: 'center',
          width: 250,
          ellipsis: true,
          customRender: (value) => getDictText('project_status', value),
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
      // 供应商名称列表
      // supplierNameList: {},
      // 请求地址
      url: {
        list: '/jeecg-supplier/prodProject/list', // 列表
        importUrl: `/jeecg-supplier/prodProject/import`, //导入
        downloadUrl: '/jeecg-supplier/prodProject/template', //下载模板
        deleteBatch: '/jeecg-supplier/prodProject/batch', //删除
      },
      // 立项时间
      times: [],
    }
  },

  methods: {
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
