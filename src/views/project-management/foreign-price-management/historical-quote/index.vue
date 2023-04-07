<template>
  <a-card :bordered="false" class="assembly-container-col">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form-model ref="ruleForm" v-model="param" layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-model-item label="项目名称" prop="projectName">
              <a-input v-model="param.projectName" placeholder="请输入项目名称" />
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="供应商" prop="supplierName">
              <a-input v-model="param.supplierName" placeholder="请输入供应商" />
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="品牌" prop="brand">
              <a-input v-model="param.brand" placeholder="请输入品牌" />
            </a-form-model-item>
          </a-col>

          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-model-item label="产品名称" prop="productName">
                <a-input v-model="param.productName" placeholder="请输入产品名称" />
              </a-form-model-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-model-item label="报价时间" prop="quoteTime">
                <a-range-picker v-model="times" style="width: 100%" @change="handleRangePickerChange" />
              </a-form-model-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-model-item label="型号" prop="model">
                <a-input v-model="param.model" placeholder="请输入型号" />
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
        <a-button type="primary" @click="handleImport">导入</a-button>
        <a-button icon="download" @click="download('历史报价模版', 'xls')">下载模板</a-button>
      </div>

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
          <div class="overflowStyle" slot="specification" slot-scope="text, record">
            <a-popover placement="top">
              <template slot="content">
                <span>{{ record.specification }}</span>
              </template>
              <span>{{ record.specification }}</span>
            </a-popover>
          </div>
        </a-table>
      </div>
    </div>

    <!-- 导入弹框 -->
    <import-excel-modal ref="importmodal" :url="url.importUrl" @ok="loadData" :showModel="false"></import-excel-modal>
  </a-card>
</template>

<script>
import ImportExcelModal from '@/components/ImportExcelModal'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin'
import { simpleDebounce } from '@/utils/util'
export default {
  mixins: [TableListMixin],
  components: { ImportExcelModal },
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
          width: 220,
          ellipsis: true,
        },
        {
          title: '客户名称',
          dataIndex: 'companyName',
          align: 'center',
          width: 220,
          ellipsis: true,
        },
        {
          title: '供应商',
          dataIndex: 'supplierName',
          align: 'center',
          width: 220,
          ellipsis: true,
        },
        {
          title: '品牌',
          dataIndex: 'brand',
          align: 'center',
          width: 220,
          ellipsis: true,
        },
        {
          title: '产品名称',
          dataIndex: 'productName',
          align: 'center',
          width: 220,
          ellipsis: true,
          // customRender: (value) => getDictText('project_type', value),
        },
        {
          title: '型号',
          dataIndex: 'model',
          align: 'center',
          width: 220,
          ellipsis: true,
        },
        {
          title: '规格参数',
          dataIndex: 'specification',
          align: 'center',
          width: 220,
          ellipsis: true,
          scopedSlots: { customRender: 'specification' },
        },
        {
          title: '单位',
          dataIndex: 'unit',
          align: 'center',
          width: 220,
          ellipsis: true,
        },
        {
          title: '销售单价',
          dataIndex: 'salesPrice',
          align: 'center',
          width: 220,
          ellipsis: true,
        },
        {
          title: '采购单价',
          dataIndex: 'purchasePrice',
          align: 'center',
          width: 220,
          ellipsis: true,
        },
        {
          title: '报价时间',
          dataIndex: 'quoteTime',
          align: 'center',
          width: 220,
          ellipsis: true,
        },
        {
          title: '毛利润',
          dataIndex: 'grossProfitRate',
          align: 'center',
          width: 220,
          ellipsis: true,
          customRender(text) {
            return `${(text * 100).toFixed(2)}%`
          },
        },
      ],
      // 请求地址
      url: {
        list: '/jeecg-supplier/prodProductQuoteHistory/list', // 列表
        downloadGetUrl: '/prodProductQuoteHistory/template/download',
        importUrl: `/prodProductQuoteHistory/import`, //导入
      },
      // 时间
      times: [],
    }
  },

  methods: {
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

/*统一table表格的尺寸*/
.ant-table {
  table-layout: fixed;
}
.ant-table-tbody > tr > td {
  max-width: 200px;
  min-width: 70px;
  height: 70px;
  border-bottom: 0;
  /*text-align: center !important;*/
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
  word-break: break-all;
}
.overflowStyle {
  max-width: 150px !important;
  max-height: 70px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-wrap: break-word;
  word-break: break-all;
}
</style>
