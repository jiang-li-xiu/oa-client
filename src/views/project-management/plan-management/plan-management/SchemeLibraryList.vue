<!--
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-09-19 17:17:44
 * @LastEditors: JLX
 * @LastEditTime: 2023-03-14 09:11:29
-->

<template>
  <a-card :bordered="false" class="assembly-container-col">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form-model ref="ruleForm" v-model="param" layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <!-- <template v-if="toggleSearchStatus"> -->
          <a-col :md="6" :sm="8">
            <a-form-model-item label="项目名称" prop="projectName">
              <a-input v-model="param.projectName" placeholder="请输入项目名称" />
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="方案名称" prop="name">
              <a-input v-model="param.name" placeholder="请输入方案名称" />
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
          <!-- <a-col :md="6" :sm="8">
            <a-form-model-item label="审批状态" prop="status">
              <a-select
                v-model="param.type"
                style="width: 100%"
                placeholder="请选择审批状态"
              >
                <a-select-option value="1">工程</a-select-option>
                <a-select-option value="2">软件</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col> -->
          <!-- </template> -->

          <a-col :md="6" :sm="8">
            <span style="float: left; overflow: hidden" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">搜索</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <!-- <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a> -->
            </span>
          </a-col>
        </a-row>
      </a-form-model>

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
              <a href="javascript:;" @click="handleDetail(row)">详情</a>
            </a-space>
          </template>
        </a-table>
      </div>
    </div>

    <add-engineering-scheme ref="engineering"></add-engineering-scheme>
    <add-software-scheme ref="software"> </add-software-scheme>
  </a-card>
</template>

<script>
// 组件
import AddEngineeringScheme from './components/AddEngineeringScheme'
import AddSoftwareScheme from './components/AddSoftwareScheme'
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
      // 表格配置
      columns: [
        {
          title: '方案编号',
          dataIndex: 'code',
          align: 'center',
          width: '14%',
        },
        {
          title: '项目名称',
          dataIndex: 'projectName',
          align: 'center',
          width: '14%',
        },
        {
          title: '方案名称',
          dataIndex: 'name',
          align: 'center',
          width: '14%',
        },
        {
          title: '方案类型',
          dataIndex: 'type',
          align: 'center',
          width: '14%',
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
          width: '14%',
        },
        {
          title: '设计部门',
          dataIndex: 'designPersonDept',
          align: 'center',
          width: '14%',
        },
        {
          title: '设计时间',
          dataIndex: 'designTime',
          align: 'center',
          width: '14%',
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
        list: '/scheme/prodSchemeLibrary/list', // 列表
        deleteBatch: '/prodScheme/batch', //删除
      },
      // 时间
      times: [],
    }
  },
  created() {
    this.handleTabsChange(null)
  },
  methods: {
    handleDetail(row) {
      if (row.type == 1) {
        this.$refs.engineering.edit(row, 2)
      } else if (row.type == 2) {
        this.$refs.software.edit(row, 2)
      }
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
