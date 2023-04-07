<!--
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-09-19 17:17:44
 * @LastEditors: JLX
 * @LastEditTime: 2023-03-08 14:14:24
-->

<template>
  <a-card :bordered="false" class="assembly-container-col">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form-model ref="ruleForm" v-model="param" layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-model-item label="方案名称" prop="name">
              <j-input v-model="param.name" placeholder="请输入方案名称" />
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="方案类型" prop="type">
              <a-select v-model="param.type" style="width: 100%" placeholder="请选择方案类型">
                <a-select-option value="1">工程</a-select-option>
                <a-select-option value="2">软件</a-select-option>
              </a-select>
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

      <!-- 按钮区域 -->
      <div class="table-operator">
        <a-button type="primary" @click="handleOpen" icon="plus">新增模板</a-button>
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
              <a href="javascript:;" @click="handleEdit(row)">编辑</a>
              <a-divider type="vertical" />
              <a href="javascript:;" @click="handleDetail(row)">详情</a>
              <a-divider type="vertical" />
              <a href="javascript:;" @click="batchPathDel(row.id)" :style="{ color: 'red' }">删除</a>
            </a-space>
          </template>
        </a-table>
      </div>
    </div>

    <a-modal title="方案类型" :width="600" :visible.sync="visible" :confirmLoading="loading" @cancel="close">
      <a-spin tip="加载中..." :spinning="loading">
        <a-form-model ref="ruleForm2" :model="modelForm" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-row>
            <a-col :span="24">
              <a-form-model-item label="方案类型" prop="schemeType">
                <a-select v-model="modelForm.schemeType" show-search placeholder="请选择" readOnly>
                  <a-select-option :value="1">工程</a-select-option>
                  <a-select-option :value="2">软件</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </a-spin>

      <template slot="footer">
        <a-button type="dashed" @click="close">取消</a-button>
        <a-button type="primary" @click="handleAdd" :loading="loading">确认</a-button>
      </template>
    </a-modal>

    <!-- 工程方案 -->
    <add-engineering-scheme ref="engineering" @refresh="refresh"></add-engineering-scheme>
    <!-- 软件方案 -->
    <add-software-scheme ref="software" @refresh="refresh"></add-software-scheme>
  </a-card>
</template>

<script>
// 组件
import AddEngineeringScheme from '@/views/project-management/plan-management/plan-management/components/AddEngineeringScheme.vue'
import AddSoftwareScheme from '@/views/project-management/plan-management/plan-management/components/AddSoftwareScheme.vue'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin'
// 字典
import { getDictText } from '@/api/api.js'
export default {
  mixins: [TableListMixin],
  components: { AddEngineeringScheme, AddSoftwareScheme },
  data() {
    return {
      // 查询参数
      param: {},
      modelForm: {},
      visible: false,
      // 表单配置
      labelCol: { span: 4 },
      wrapperCol: { span: 17 },
      // 表格配置
      columns: [
        {
          title: '方案名称',
          dataIndex: 'name',
          align: 'center',
          width: '35%',
        },
        {
          title: '方案类型',
          dataIndex: 'type',
          align: 'center',
          width: '15%',
          customRender(text) {
            if (text == 1) {
              return '工程'
            } else if (text == 2) {
              return '软件'
            } else {
              return ''
            }
          },
        },
        {
          title: '设计人',
          dataIndex: 'designPerson',
          align: 'center',
          width: '15%',
        },
        {
          title: '设计部门',
          dataIndex: 'designPersonDept',
          align: 'center',
          width: '15%',
        },
        {
          title: '设计时间',
          dataIndex: 'designTime',
          align: 'center',
          width: '15%',
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
        list: '/prod/prodSchemeTemplate/list', // 列表
        deleteBatch: '/prod/prodSchemeTemplate/batch',
      },
      dataSource: [],
    }
  },
  created() {
    this.handleTabsChange(null)
  },
  methods: {
    handleOpen() {
      this.visible = true
    },
    handleAdd() {
      if (this.modelForm.schemeType == 1) {
        this.$refs.engineering.templateAdd(true)
      } else {
        this.$refs.software.templateAdd(true)
      }
      this.close()
    },
    handleEdit(row) {
      if (row.type == 1) {
        this.$refs.engineering.templateEdit(row)
      } else {
        this.$refs.software.templateEdit(row)
      }
      this.close()
    },
    handleDetail(row) {
      if (row.type == 1) {
        this.$refs.engineering.templateEdit(row, 2)
      } else {
        this.$refs.software.templateEdit(row, 2)
      }
    },
    close() {
      this.visible = false
      this.modelForm = {}
    },
    refresh() {
      this.close()
      this.loadData(1)
    },
    handleTabsChange(key) {
      this.currentTab = key
      if (key == null) {
        // this.url.list = `/scrm/crmProject/list2`
        this.loadData(1)
      } else {
        // this.url.list = `/scrm/crmProject/list2?flowStatus=${key}`
        this.loadData(1)
      }
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
