<!--
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-11-23 10:18:07
 * @LastEditors: JLX
 * @LastEditTime: 2022-11-28 10:23:48
-->

<template>
  <a-card :bordered="false" class="assembly-container-col">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form-model ref="ruleForm" v-model="param" layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-model-item label="客户名称" prop="customName">
              <j-input v-model="param.customName" placeholder="请输入客户名称" />
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="客户联系人方式" prop="customLiaisonPhone">
              <j-input v-model="param.customLiaisonPhone" placeholder="请输入客户联系人方式" />
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="报价截止日期" prop="quoteStopTime">
              <a-range-picker v-model="times" style="width: 100%" @change="handleRangePickerChange" />
            </a-form-model-item>
          </a-col>

          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-model-item label="申请人" prop="applyPeopleName">
                <j-input v-model="param.applyPeopleName" placeholder="请输入申请人" />
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
        <a-button icon="delete" type="danger" @click="batchPathDel()" :disabled="selectedRowKeys.length === 0"
          >批量删除
        </a-button>
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
            fixed: true,
          }"
          @change="handleTableChange"
          :loading="loading"
        >
          <template #action="row">
            <a-space :size="12">
              <template v-if="row.status == 3">
                <a href="javascript:;" @click="handleAddScheme(row)">添加方案</a>
                <a-divider type="vertical" />
                <a href="javascript:;" @click="handleAddSelection(row)">添加方案并选型</a>
                <a-divider type="vertical" />
              </template>
              <a href="javascript:;" @click="handleEdit(row)" :disabled="[2,3].includes(row.status)">编辑</a>
              <a-divider type="vertical" />
              <a href="javascript:;" @click="handleDetail(row)">详情</a>
            </a-space>
          </template>
        </a-table>
      </div>
    </div>

    <!-- 新增详情弹窗 -->
    <add-and-detail-dialog ref="modalForm" @refresh="loadData(1)"></add-and-detail-dialog>
    <!-- 方案/选型 -->
    <AddSchemeSelectDialog ref="schemeForm" @refresh="loadData(1)"></AddSchemeSelectDialog>
  </a-card>
</template>

<script>
// 组件
import AddAndDetailDialog from './components/AddAndDetailDialog'
import AddSchemeSelectDialog from '@/views/project-management/plan-management/plan-management/components/AddSchemeSelectDialog.vue'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin'
// 字典
import { getDictText } from '@/api/api.js'
import { simpleDebounce } from '@/utils/util'
export default {
  mixins: [TableListMixin],
  components: { AddAndDetailDialog, AddSchemeSelectDialog },
  data() {
    return {
      // 查询参数
      param: {},
      // 表格配置
      columns: [
        {
          title: '客户名称',
          dataIndex: 'customName',
          align: 'center',
          width: '12%',
        },
        {
          title: '项目名称',
          dataIndex: 'projectName',
          align: 'center',
          width: '12%',
          // customRender: (value) => getDictText('project_type', value),
        },
        {
          title: '客户联系人',
          dataIndex: 'customLiaison',
          align: 'center',
          width: '12%',
        },
        {
          title: '客户联系人方式',
          dataIndex: 'customLiaisonPhone',
          align: 'center',
          width: '12%',
        },
        {
          title: '申请人',
          dataIndex: 'applyPeopleName',
          align: 'center',
          width: '12%',
        },
        {
          title: '需求部门',
          dataIndex: 'department',
          align: 'center',
          width: '12%',
        },
        {
          title: '报价截至时间',
          dataIndex: 'quoteStopTime',
          align: 'center',
          width: '12%',
        },
        {
          title: '状态',
          dataIndex: 'status',
          align: 'center',
          width: '12%',
          // 1-保存，2-已提交，3-审核通过，4-审核不通过
          customRender(text) {
            return text == 1 ? '保存' : text == 2 ? '已提交' : text == 3 ? '审核通过' : '审核不通过'
          },
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
      // 请求地址
      url: {
        list: '/prodQuoteApply/list', // 列表
        deleteBatch: '/prodQuoteApply/batch', //删除
      },
      // 时间
      times: [],
    }
  },

  methods: {
    // 添加方案
    handleAddScheme(row) {
      this.$refs.schemeForm.add(1, row)
      this.$refs.schemeForm.title = '添加方案'
    },

    //添加方案并选型
    handleAddSelection(row) {
      this.$refs.schemeForm.addPlan(2, row)
      this.$refs.schemeForm.title = '设计并选型'
    },
    // 处理搜索时间
    handleRangePickerChange(dates, dateStrings) {
      this.param.quoteStopTime_begin = dateStrings[0]
      this.param.quoteStopTime_end = dateStrings[1]
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
