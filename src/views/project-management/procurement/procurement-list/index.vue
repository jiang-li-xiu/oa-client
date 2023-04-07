<template>
  <a-card :bordered="false" class="assembly-container-col">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form-model ref="ruleForm" v-model="param" layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-model-item label="项目名称" prop="projectName">
              <a-select v-model="param.projectId" placeholder="请选择项目名称">
                <a-select-option v-for="item in projectList" :key="item.id" :value="item.id">
                  {{ item.projectName }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="客户名称" prop="companyName">
              <a-input v-model="param.companyName" placeholder="请输入客户名称" />
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="报价时间" prop="profitsTime">
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
              <a href="javascript:;" @click="handleEdit(row)">申请采购</a>
              <a-divider type="vertical" />
              <a href="javascript:;" @click="handleDetail(row)">详情</a>
              <a-divider type="vertical" />
              <a href="javascript:;" @click="batchPathDel(row.id)" :style="{ color: 'red' }">删除</a>
            </a-space>
          </template>
        </a-table>
      </div>
    </div>

    <!-- 申请采购弹窗 -->
    <apply-purchae-dialog ref="modalForm" @refresh="loadData(1)"></apply-purchae-dialog>

    <!-- 详情弹窗 -->
    <DetailDialog ref="detailForm" :columnsDetail="columnsDetail"></DetailDialog>
  </a-card>
</template>

<script>
import { getProjectList } from '@/api/procurement/ProcurementList.js'
// 组件
import ApplyPurchaeDialog from './components/applyPurchaeDialog'
import DetailDialog from '@/views/project-management/foreign-price-management/project-profit/components/AddAndDetailDialog.vue'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin'
// 字典
import { getDictText } from '@/api/api.js'
import { simpleDebounce } from '@/utils/util'
export default {
  mixins: [TableListMixin],
  components: { ApplyPurchaeDialog, DetailDialog },
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
          width: 230,
          ellipsis: true,
        },
        {
          title: '客户名称',
          dataIndex: 'companyName',
          align: 'center',
          width: 230,
          ellipsis: true,
        },
        {
          title: '客户联系人',
          dataIndex: 'customerName',
          align: 'center',
          width: 230,
          ellipsis: true,
          // customRender: (value) => getDictText('project_type', value),
        },
        {
          title: '客户联系方式',
          dataIndex: 'customerPhone',
          align: 'center',
          width: 230,
          ellipsis: true,
        },
        {
          title: '选型人',
          dataIndex: 'selectPeopleName',
          align: 'center',
          width: 230,
          ellipsis: true,
        },
        {
          title: '报价人',
          dataIndex: 'profitsName',
          align: 'center',
          width: 230,
          ellipsis: true,
        },
        {
          title: '报价部门',
          dataIndex: 'profitsDepartment',
          align: 'center',
          width: 230,
          ellipsis: true,
        },
        {
          title: '报价时间',
          dataIndex: 'profitsTime',
          align: 'center',
          width: 230,
          ellipsis: true,
        },
        {
          title: '总金额',
          dataIndex: 'totlePrice',
          align: 'center',
          width: 230,
          ellipsis: true,
        },
        {
          title: '状态',
          dataIndex: 'status',
          align: 'center',
          width: 230,
          ellipsis: true,
          // 0-待采购，1-采购中，2-已完成
          // customRender: value => getDictText('price_status', value)
          customRender(text) {
            return text == 0 ? '待采购' : text == 1 ? '采购中' : '已完成'
          },
        },
        {
          title: '操作',
          align: 'center',
          fixed: 'right',
          width: 250,
          scopedSlots: { customRender: 'action' },
        },
      ],
      // 详情表格
      columnsDetail: [
        {
          title: '细目名称',
          dataIndex: 'detailName',
          width: 150,
          ellipsis: true,
        },
        {
          title: '安装位置',
          dataIndex: 'position',
          width: 150,
          ellipsis: true,
        },
        {
          title: '技术规格、资质证书',
          dataIndex: 'technicalSpecifications',
          width: 200,
          ellipsis: true,
          scopedSlots: { customRender: 'technicalSpecifications' },
        },
        {
          title: '产品名称',
          dataIndex: 'prodName',
          width: 200,
          ellipsis: true,
          // scopedSlots: { customRender: 'productId' }
        },
        {
          title: '规格参数',
          dataIndex: 'specification',
          width: 100,
          ellipsis: true,
          scopedSlots: { customRender: 'specification' },
        },
        {
          title: '型号',
          dataIndex: 'model',
          width: 150,
          ellipsis: true,
        },
        {
          title: '供应商',
          dataIndex: 'supplier',
          width: 150,
          ellipsis: true,
        },
        {
          title: '单位',
          dataIndex: 'unit',
          width: 100,
          ellipsis: true,
        },
        {
          title: '数量',
          dataIndex: 'num',
          width: 100,
          ellipsis: true,
        },
        {
          title: '单价（元）',
          dataIndex: 'price',
          width: 100,
          ellipsis: true,
        },
        {
          title: '合价（元）',
          dataIndex: 'totalAmount',
          width: 100,
          ellipsis: true,
        },
        {
          title: '备注',
          dataIndex: 'remark',
          width: 200,
          ellipsis: true,
        },
      ],
      // 请求地址
      url: {
        list: '/jeecg-supplier/prodPurchaseList/list', // 列表
        deleteBatch: '/jeecg-supplier/prodPurchaseList/batch', //删除
      },
      // 时间
      times: [],
      projectList: [], //项目信息
    }
  },

  created() {
    this.getProjectList(1000)
  },

  methods: {
    // 查看详情：列表单行查看详情
    handleDetail: function (record) {
      this.$refs.detailForm.procurementDetail(record)
      this.$refs.detailForm.title = '采购详情'
      this.$refs.detailForm.disableSubmit = true
    },

    // 获取项目列表
    getProjectList(pageSize) {
      getProjectList({ pageSize: pageSize }).then(({ result, success }) => {
        if (success) {
          // console.log(result)
          this.projectList = result.records
        }
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
