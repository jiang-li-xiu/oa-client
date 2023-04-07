<!--
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2023-02-28 11:24:58
 * @LastEditors: JLX
 * @LastEditTime: 2023-03-13 15:01:54
-->
<template>
  <j-modal
    :title="title"
    :width="width"
    :visible="visible"
    switchFullscreen
    :fullscreen="true"
    @ok="handleOk"
    :okButtonProps="{ class: { 'jee-hidden': disableSubmit } }"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin tip="加载中..." :spinning="loading">
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

        <!-- 表格区域 -->
        <div class="table">
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
                <a href="javascript:;" @click="handleDetail(row)">详情</a>
              </a-space>
            </template>
          </a-table>
        </div>
      </div>
    </a-spin>

    <div class="drawer-bootom-button">
      <a-button key="submit" type="primary" @click="handleOk" style="margin-right: 0.8rem"> 确定 </a-button>
      <a-button @click="handleCancel">取消</a-button>
    </div>

    <add-software-scheme ref="soft"> </add-software-scheme>
    <add-engineering-scheme ref="engineering"></add-engineering-scheme>
  </j-modal>
</template>

<script>
import { importSchem, importTemplateSchem } from '@/api/project-management/plan-management/PlanManagement.js'
import AddSoftwareScheme from './AddSoftwareScheme'
// import AddEngineeringScheme from './AddEngineeringScheme'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin'
export default {
  mixins: [TableListMixin],
  name: 'SchemeLibraryModel',
  components: { AddSoftwareScheme, AddEngineeringScheme: () => import('./AddEngineeringScheme.vue') },
  props: {
    // 详情
    projectId: {
      type: String,
      default: '',
    },
    // 表格配置
    columns: {
      type: Array,
      default: () => [
        {
          title: '方案名称',
          dataIndex: 'name',
          align: 'center',
          width: '14%',
          ellipsis: true,
        },
        {
          title: '方案类型',
          dataIndex: 'type',
          align: 'center',
          width: '14%',
          ellipsis: true,
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
          title: '项目名称',
          dataIndex: 'projectName',
          align: 'center',
          ellipsis: true,
          width: '14%',
        },
        {
          title: '细目数量',
          dataIndex: 'detailNum',
          align: 'center',
          ellipsis: true,
          width: '14%',
        },
        {
          title: '设计人',
          dataIndex: 'designPerson',
          align: 'center',
          ellipsis: true,
          width: '14%',
        },
        {
          title: '设计部门',
          dataIndex: 'designPersonDept',
          ellipsis: true,
          align: 'center',
          width: '14%',
        },
        {
          title: '设计时间',
          dataIndex: 'designTime',
          ellipsis: true,
          align: 'center',
          width: '14%',
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          fixed: 'right',
          width: 100,
          scopedSlots: { customRender: 'action' },
        },
      ],
    },
  },
  data() {
    return {
      title: '',
      width: 800,
      visible: false,
      disableSubmit: false,
      disableMixinCreated: true,
      param: {},
      url: {
        list: `/scheme/prodSchemeLibrary/list?category=${1}`,
      },
      // 1.方案库导入 2方案模板导入
      type: 1,
    }
  },
  methods: {
    open(type) {
      if (type == 1) {
        this.url.list = `/scheme/prodSchemeLibrary/list?category=${1}`
        this.type = 1
      } else if (type == 2) {
        this.url.list = `/prod/prodSchemeTemplate/list`
        this.type = 2
      }
      this.visible = true
      this.loadData(1)
    },
    handleDetail(row) {
      if (row.type == 1) {
        this.$refs.engineering.templateDetail(row, 2, this.type)
      } else if (row.type == 2) {
        this.$refs.soft.templateDetail(row, 2, this.type)
      }
    },
    add() {
      this.visible = true
      this.$nextTick(() => {
        this.$refs.realForm.add()
      })
    },
    edit(record) {
      this.visible = true
      this.$nextTick(() => {
        this.$refs.realForm.edit(record)
      })
    },
    close() {
      this.$emit('close')
      this.onClearSelected()
      this.visible = false
    },
    handleOk() {
      console.log(this.selectedRowKeys, this.selectionRows, this.projectId)
      let data = {
        projectId: this.projectId,
        schemeLibraryIds: this.selectedRowKeys,
      }
      let templateData = {
        projectId: this.projectId,
        templateIds: this.selectedRowKeys,
      }
      // 方案库导入
      if (this.type == 1) {
        importSchem(data)
          .then((res) => {
            if (res.success) {
              this.$message.success(res.message)
              this.$emit('refresh')
            } else {
              this.$message.error(res.message)
            }
            this.close()
          })
          .finally(() => {
            setTimeout(() => {
              this.okLoading = false
            }, 2000)
          })
      } else {
        // 方案模板导入
        importTemplateSchem(templateData)
          .then((res) => {
            if (res.success) {
              this.$message.success(res.message)
              this.$emit('refresh')
            } else {
              this.$message.error(res.message)
            }
            this.close()
          })
          .finally(() => {
            setTimeout(() => {
              this.okLoading = false
            }, 2000)
          })
      }
    },
    handleCancel() {
      this.close()
    },
  },
}
</script>
