<!--
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-11-18 09:14:47
 * @LastEditors: JLX
 * @LastEditTime: 2022-11-18 16:30:27
-->
<template>
  <a-card :bordered="false" class="assembly-container-col">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form-model ref="ruleForm" v-model="param" layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-model-item label="项目名称" prop="projectName">
              <a-select v-model="param.projectName" placeholder="请选择项目名称">
                <a-select-option v-for="item in projectList" :key="item.id" :value="item.name">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="供应商名称" prop="supplierName">
              <a-select v-model="param.supplierId" placeholder="请选择产供应商">
                <a-select-option v-for="item in supplierNameList" :key="item.id" :value="item.id">
                  {{ item.supplier }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="申请时间" prop="doOrderTime">
              <a-range-picker v-model="times" style="width: 100%" @change="handleRangePickerChange" />
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
              <template v-if="row.status == 1">
                <a href="javascript:;" @click="handleEdit(row)">编辑</a>
                <a-divider type="vertical" />
              </template>
              <a href="javascript:;" @click="handleDetail(row)">详情</a>
            </a-space>
          </template>
        </a-table>
      </div>
    </div>

    <!-- 编辑详情弹窗 -->
    <detail-dialog ref="modalForm" @refresh="loadData(1)"></detail-dialog>
  </a-card>
</template>

<script>
// API
import { getProjectList } from '@/api/project-management/foreign-price-management/ProjectProfit.js'
import { getSupplierList } from '@/api/product-management/product-management/index'
// 组件
import detailDialog from '@/views/project-management/procurement/order/components/AfterDialog.vue'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin'
import { simpleDebounce } from '@/utils/util'
import { getDictText } from '@/api/api.js'
export default {
  mixins: [TableListMixin],
  components: { detailDialog },
  data() {
    return {
      // 查询参数
      param: {},
      // 表格配置
      columns: [
        {
          title: '项目名称',
          dataIndex: 'projectName',
          align: 'center',
          width: 190,
          ellipsis: true,
        },
        {
          title: '供应商名称',
          dataIndex: 'supplierName',
          align: 'center',
          width: 190,
          ellipsis: true,
        },
        {
          title: '申请人',
          dataIndex: 'applyPeople',
          align: 'center',
          width: 190,
          ellipsis: true,
        },
        {
          title: '申请时间',
          dataIndex: 'applyTime',
          align: 'center',
          width: 190,
          ellipsis: true,
        },
        {
          title: '处理人',
          dataIndex: 'principal',
          align: 'center',
          width: 190,
          ellipsis: true,
        },
        {
          title: '处理人电话',
          dataIndex: 'principalPhone',
          align: 'center',
          width: 190,
          ellipsis: true,
        },
        {
          title: '处理人时间',
          dataIndex: 'dealWithTime',
          align: 'center',
          width: 190,
          ellipsis: true,
        },
        {
          title: '状态',
          dataIndex: 'status',
          align: 'center',
          width: 190,
          ellipsis: true,
          //  售后状态：1-处理中，2-已结束
          customRender(value) {
            return value == 1 ? '处理中' : '已结束'
          },
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          fixed: 'right',
          width: 190,
          scopedSlots: { customRender: 'action' },
        },
      ],
      dataSource: [{ projectName: '测试' }],
      // 请求地址
      url: {
        list: '/prodOrderAfterSales/list', // 列表
        deleteBatch: '/prodOrderAfterSales/batch', //删除
      },
      // 时间
      times: [],
      projectList: [], //项目信息
      supplierNameList: [], //供应商列表
    }
  },

  created() {
    this.getProjectList()
    this.getbasicNameList()
  },

  methods: {
    // 获取项目列表
    getProjectList() {
      getProjectList().then(({ result, success }) => {
        if (success) {
          this.projectList = result.records
        }
      })
    },

    // 供应商名称列表
    getbasicNameList() {
      getSupplierList().then((res) => {
        this.supplierNameList = res.result.records
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
