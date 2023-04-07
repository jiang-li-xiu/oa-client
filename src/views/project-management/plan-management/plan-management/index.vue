<!--
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-09-19 17:17:44
 * @LastEditors: JLX
 * @LastEditTime: 2023-02-15 17:30:54
-->

<template>
  <a-card :bordered="false" class="assembly-container-col">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form-model ref="ruleForm" v-model="param" layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-model-item label="客户名称" prop="companyName">
              <j-input v-model="param.companyName" placeholder="请输入客户名称" />
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="客户联系方式" prop="customerPhone">
              <j-input v-model="param.customerPhone" placeholder="请输入客户联系方式" />
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="设计时间" prop="time">
              <a-range-picker v-model="times" style="width: 100%" @change="handleRangePickerChange" />
            </a-form-model-item>
          </a-col>

          <template v-if="toggleSearchStatus">
            <!-- <a-col :md="6" :sm="8">
              <a-form-model-item label="项目状态" prop="status">
                <j-dict-select-tag v-model="param.status" placeholder="请选择项目状态" dictCode="project_status" />
              </a-form-model-item>
            </a-col> -->
            <a-col :md="6" :sm="8">
              <a-form-model-item label="设计人" prop="peopleName">
                <j-input v-model="param.peopleName" placeholder="请输入设计人" />
              </a-form-model-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-model-item label="项目名称" prop="projectName">
                <j-input v-model="param.projectName" placeholder="请输入项目名称" />
              </a-form-model-item>
            </a-col>
            <!-- <a-col :md="6" :sm="8">
              <a-form-model-item label="采购内容" prop="purchaseContext">
                <j-input v-model="param.purchaseContext" placeholder="请输入采购内容" />
              </a-form-model-item>
            </a-col> -->
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
        <!-- <a-button type="primary" @click="handleAdd" icon="plus">添加方案</a-button>
        <a-button type="primary" @click="handleAddAndSelect" icon="plus">添加方案并选型</a-button> -->
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
              <!-- 询价中不能编辑 -->
              <a href="javascript:;" @click="handleEdit(row)" :disabled="![1, 4].includes(row.status)">编辑</a>
              <a-divider type="vertical" />
              <a href="javascript:;" @click="handleDetail(row)">详情</a>
              <!-- <a-divider type="vertical" /> -->
              <!-- <a href="javascript:;" @click="handleDetail(row)">询价</a>
              <a-divider type="vertical" />
              <a href="javascript:;" @click="handleDetail(row)">报价详情</a>
              <a-divider type="vertical" />
              <a href="javascript:;" @click="handleDetail(row)">撤回</a> -->
            </a-space>
          </template>
        </a-table>
      </div>
    </div>

    <!-- 新增详情弹窗 -->
    <!-- <add-and-detail-dialog ref="modalForm" @refresh="loadData(1)"></add-and-detail-dialog> -->

    <!-- 方案并选型 -->
    <AddSchemeSelectDialog ref="modalForm" @refresh="loadData(1)"></AddSchemeSelectDialog>
  </a-card>
</template>

<script>
// 组件
import AddAndDetailDialog from './components/AddAndDetailDialog'
import AddSchemeSelectDialog from './components/AddSchemeSelectDialog' //添加方案并选型
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
          title: '方案编号',
          dataIndex: 'schemeCode',
          align: 'center',
          width: '11%',
        },
        {
          title: '项目名称',
          dataIndex: 'project.projectName',
          align: 'center',
          width: '11%',
          // customRender: (value) => getDictText('project_type', value),
        },
        {
          title: '客户名称',
          dataIndex: 'project.customerName',
          align: 'center',
          width: '11%',
        },
        {
          title: '客户联系人',
          dataIndex: 'project.liaison',
          align: 'center',
          width: '11%',
        },
        {
          title: '客户联系方式',
          dataIndex: 'project.phone',
          align: 'center',
          width: '11%',
        },
        {
          title: '设计人',
          dataIndex: 'peopleName',
          align: 'center',
          width: '11%',
        },
        {
          title: '设计部门',
          dataIndex: 'department',
          align: 'center',
          width: '11%',
        },
        {
          title: '设计时间',
          dataIndex: 'time',
          align: 'center',
          width: '11%',
        },
        {
          title: '状态',
          dataIndex: 'status',
          align: 'center',
          width: '11%',
          // 1-保存，2-已提交，3-询价中，4-审批不通过，5-结束
          customRender(text) {
            if (text == 1) {
              return '保存'
            } else if (text == 2) {
              return '已提交'
            } else if (text == 3) {
              return '询价中'
            } else if (text == 4) {
              return '审批不通过'
            } else if (text == 5) {
              return '结束'
            } else {
              return ''
            }
            // return text == 1 ? '保存' : text == 2 ? '已提交' : text == 3 ? '询价中' : '审批不通过'
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
        list: '/jeecg-supplier/prodScheme/list', // 列表
        deleteBatch: '/prodScheme/batch', //删除
      },
      // 时间
      times: [],
    }
  },

  methods: {
    //添加方案并选型
    handleAddAndSelect() {
      // this.$refs.modalSelectForm.addPlan()
      this.$refs.modalForm.addPlan(2, {})
      this.$refs.modalForm.title = '设计并选型'
    },

    // 添加方案
    handleAdd() {
      this.$refs.modalForm.add(1, {})
      this.$refs.modalForm.title = '添加方案'
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
