<template>
  <a-drawer
    title="询价列表"
    :maskClosable="true"
    width="80%"
    placement="right"
    :closable="true"
    @close="close"
    :visible="visible"
    style="overflow: auto; padding-bottom: 53px"
  >
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form-model ref="ruleForm" v-model="param" layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-model-item label="供应商名称" prop="supplierName">
              <j-input v-model="param.supplierName" placeholder="请输入供应商名称" />
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="状态" prop="status">
              <j-dict-select-tag v-model="param.status" dictCode="plan_type" placeholder="请选择状态" />
            </a-form-model-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <span style="float: left; overflow: hidden" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">搜索</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置 </a-button>
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
    <detail ref="modalForm" @refresh="loadData(1)" :data="data"></detail>
  </a-drawer>
</template>

<script>
import { getInquiryList } from '@/api/set-project/set-project.js'
import detail from '@/views/project-management/plan-management/plan-ask-price/components/AddAndDetailInquiryDialog.vue'
// 混入
// import { TableListMixin } from '@/mixins/TableListMixin'
import { getDictText } from '@/api/api.js'
import { filterObj, simpleDebounce } from '@/utils/util'
export default {
  // mixins: [TableListMixin],
  components: { detail },
  props: {
    // 产品数据
    data: {
      type: Array,
      default: () => [],
    },
    // 当前code
    schemeCode: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      // 查询参数
      param: {},
      visible: false,
      // 询价表格
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          align: 'center',
          width: '20%',
          customRender(text, record, index) {
            return index + 1
          },
        },
        {
          title: '供应商名称',
          dataIndex: 'supplierName',
          align: 'center',
          width: '20%',
        },
        {
          title: '产品数量',
          dataIndex: 'num',
          align: 'center',
          width: '20%',
        },
        {
          title: '截止时间',
          dataIndex: 'deadline',
          align: 'center',
          width: '20%',
        },
        {
          title: '状态',
          dataIndex: 'status',
          align: 'center',
          width: '20%',
          // 1-报价中，2-报价完成，3-超时未报价，4-放弃，5-已撤回 6-结束
          customRender: (value) => getDictText('plan_type', value),
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          fixed: 'right',
          width: 200,
          scopedSlots: { customRender: 'action' },
        },
      ],
      // 询价表格数据
      dataSource: [],
      loading: false,
      ipagination: {
        current: 1,
        pageSize: 15,
        pageSizeOptions: ['15', '30', '50', '100'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0,
      },
      // 请求地址
      // url: {
      //   list: `/prodSchemeSupplierInquiry/schemeCode/${this.schemeCode}`, // 列表
      //   deleteBatch: '', //删除
      // },
    }
  },

  watch: {
    schemeCode: {
      handler(val) {
        console.log('当前行询价code', val)
        this.loadData(val) 
        // this.url.list = `/prodSchemeSupplierInquiry/schemeCode/${val}`
      },
      deep: true,
      // immediate: true,
    },
  },

  methods: {
    // getInquiryList(schemeCode) {
    //   getInquiryList(schemeCode).then((res) => {
    //     if (res.success) {
    //       this.dataSource = res.result.records
    //     }
    //   })
    // },
    handleDetail: function (record) {
      this.$refs.modalForm.detail(record)
      this.$refs.modalForm.title = '询价详情'
      this.$refs.modalForm.disableSubmit = true
    },
    close() {
      this.visible = false
      this.currnetRow = {}
      this.currnetId = ''
    },
    open(record) {
      this.visible = true
      console.log(record)
      this.currnetId = record.id
      this.currnetRow = record
    },
    // 检索：查询按钮
    searchQuery() {
      this.loadData(1)
    },
    // 检索：重置按钮
    searchReset() {
      for (let key in this.queryParam) {
        if (key != 'ids') {
          this.queryParam[key] = null
        }
      }
      console.log(this.queryParam)

      for (let key in this.param) {
        if (key != 'ids') {
          this.param[key] = null
        }
      }
      console.log(this.param)
      simpleDebounce(this.loadData, 0)(1)
    },
    // 获取列表数据
    loadData(schemeCode) {
      let params = this.getQueryParams() //查询条件
      this.loading = true
      getInquiryList(schemeCode, params)
        .then((res) => {
          if (res.success) {
            //update-begin---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
            this.dataSource = res.result.records || res.result
            if (res.result.total) {
              this.ipagination.total = res.result.total
            } else {
              this.ipagination.total = 0
            }
            //update-end---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
          } else {
            this.$message.warning(res.message)
          }
        })
        .finally(() => {
          this.loading = false
        })
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
      // param.pageNo = this.ipagination.current
      // param.pageSize = this.ipagination.pageSize
      return filterObj(param)
    },
    getQueryField() {
      //TODO 字段权限控制
      let str = 'id,'
      this.columns.forEach(function (value) {
        str += ',' + value.dataIndex
      })
      return str
    },
    //分页、排序、筛选变化时触发
    handleTableChange(pagination, filters, sorter) {
      //分页、排序、筛选变化时触发
      //TODO 筛选
      console.log(pagination)
      if (Object.keys(sorter).length > 0) {
        this.isorter.column = sorter.field
        this.isorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
      }
      this.ipagination = pagination
      this.loadData()
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
.button {
  margin-top: 15px;
  width: 100%;
  margin-bottom: 20px;
}
</style>
