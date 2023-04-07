<template>
  <a-drawer
    title="报价信息"
    :maskClosable="true"
    width="85%"
    placement="right"
    :closable="true"
    @close="close"
    :visible="visible"
    style="overflow: auto; padding-bottom: 53px"
  >
    <a-card :bordered="false" class="assembly-container-col">
      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <a-form-model ref="ruleForm" v-model="param" layout="inline" @keyup.enter.native="searchQuery">
          <a-row :gutter="24">
            <a-col :md="6" :sm="8">
              <a-form-model-item label="供应商名称" prop="supplierName">
                <a-input v-model="param.supplierName" placeholder="请输入供应商名称" />
              </a-form-model-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-model-item label="产品名称" prop="prodName">
                <a-input v-model="param.prodName" placeholder="请输入产品名称" />
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
            :pagination="false"
            :data-source="dataSource"
            bordered
            :scroll="{ x: true }"
            :loading="loading"
            @change="handleTableChange"
          >
            <div class="overflowStyle" slot="technicalSpecifications" slot-scope="text, record">
              <a-popover placement="top">
                <template slot="content">
                  <span>{{ record.technicalSpecifications }}</span>
                </template>
                <span>{{ record.technicalSpecifications }}</span>
              </a-popover>
            </div>
            <div class="overflowStyle" slot="modelParameter" slot-scope="text, record">
              <a-popover placement="top">
                <template slot="content">
                  <span>{{ record.modelParameter }}</span>
                </template>
                <span>{{ record.modelParameter }}</span>
              </a-popover>
            </div>
            <div class="overflowStyle" slot="detailName" slot-scope="text, record">
              <a-popover placement="top">
                <template slot="content">
                  <span>{{ record.detailName }}</span>
                </template>
                <span>{{ record.detailName }}</span>
              </a-popover>
            </div>
            <div class="overflowStyle" slot="position" slot-scope="text, record">
              <a-popover placement="top">
                <template slot="content">
                  <span>{{ record.position }}</span>
                </template>
                <span>{{ record.position }}</span>
              </a-popover>
            </div>
            <div class="overflowStyle" slot="supplierRemark" slot-scope="text, record">
              <a-popover placement="top">
                <template slot="content">
                  <span>{{ record.supplierRemark }}</span>
                </template>
                <span>{{ record.supplierRemark }}</span>
              </a-popover>
            </div>
            <div class="overflowStyle" slot="remark" slot-scope="text, record">
              <a-popover placement="top">
                <template slot="content">
                  <span>{{ record.remark }}</span>
                </template>
                <span>{{ record.remark }}</span>
              </a-popover>
            </div>
          </a-table>
        </div>
      </div>
    </a-card>

    <!-- 选型 -->
    <SelectionTypeDialog
      ref="selectTypeForm"
      @refresh="loadData(1)"
      :quotationId="this.currentData.id"
    ></SelectionTypeDialog>

    <div class="drawer-bootom-button">
      <a-button @click="handleOk" type="primary" style="margin-right: 0.8rem">报价选型</a-button>
      <a-button @click="close">取消</a-button>
    </div>
  </a-drawer>
</template>

<script>
// API
import { getQuotationInfo } from '@/api/project-management/plan-management/PlanAskPrice.js'
// 组件
import SelectionTypeDialog from './SelectionTypeDialog' //选型
import { filterObj, simpleDebounce } from '@/utils/util'
export default {
  components: { SelectionTypeDialog },
  data() {
    return {
      // 开关
      visible: false,
      // 加载动画开关
      loading: false,
      // 是否禁用
      disableSubmit: false,
      // 标题
      title: '新增',
      // 当前模式
      type: 0,
      // 表单配置
      labelCol: { span: 6 },
      wrapperCol: { span: 17 },
      disableMixinCreated: true, //不执行混入
      // 表格配置
      columns: [
        {
          title: '编号',
          dataIndex: 'codeNum',
          align: 'center',
          ellipsis: true,
          width: '6%'
        },
        {
          title: '细目名称',
          dataIndex: 'detailName',
          width: '6%',
          ellipsis: true,
          scopedSlots: { customRender: 'detailName' },
          sorter: (a, b) => a.detailName.localeCompare(b.detailName)
        },
        {
          title: '安装位置',
          dataIndex: 'position',
          width: '6%',
          ellipsis: true,
          scopedSlots: { customRender: 'position' },
          align: 'center'
        },
        {
          title: '技术规格、资质证书',
          dataIndex: 'technicalSpecifications',
          width: '6%',
          ellipsis: true,
          align: 'center',
          scopedSlots: { customRender: 'technicalSpecifications' }
        },
        {
          title: '产品名称',
          dataIndex: 'prodName',
          width: '6%',
          ellipsis: true,
          align: 'center',
          sorter: (a, b) => a.prodName.localeCompare(b.prodName)
        },
        {
          title: '规格参数',
          dataIndex: 'modelParameter',
          width: '6%',
          ellipsis: true,
          align: 'center',
          scopedSlots: { customRender: 'modelParameter' },
          key: 'modelParameter',
          sorter: (a, b) => a.modelParameter.localeCompare(b.modelParameter)
        },
        {
          title: '型号',
          dataIndex: 'model',
          width: '6%',
          ellipsis: true,
          align: 'center'
        },
        {
          title: '供应商',
          dataIndex: 'supplierName',
          width: '6%',
          ellipsis: true,
          align: 'center',
          sorter: (a, b) => a.supplierName.localeCompare(b.supplierName)
        },
        {
          title: '单位',
          dataIndex: 'unit',
          width: '6%',
          ellipsis: true,
          align: 'center'
        },
        {
          title: '数量',
          dataIndex: 'num',
          width: '6%',
          ellipsis: true,
          align: 'center'
        },
        {
          title: '单价（元）',
          dataIndex: 'price',
          width: '6%',
          ellipsis: true,
          align: 'center',
          sorter: (a, b) => a.price - b.price
        },
        {
          title: '合价（元）',
          dataIndex: 'allPrice',
          width: '6%',
          ellipsis: true,
          align: 'center',
          sorter: (a, b) => a.allPrice - b.allPrice
        },
        {
          title: '是否偏离',
          dataIndex: 'isDeviateFrom',
          width: '6%',
          ellipsis: true,
          align: 'center',
          sorter: (a, b) => a.isDeviateFrom.localeCompare(b.isDeviateFrom)
        },
        {
          title: '供应商备注',
          dataIndex: 'supplierRemark',
          width: '6%',
          ellipsis: true,
          align: 'center',
          scopedSlots: { customRender: 'supplierRemark' }
        },
        {
          title: '备注',
          dataIndex: 'remark',
          width: '6%',
          ellipsis: true,
          align: 'center',
          scopedSlots: { customRender: 'remark' }
        }
      ],
      dataSource: [],
      param: {},
      currentData: [],
      // 排序
      isorter: {
        column: 'modelParameter',
        order: 'desc'
      }
    }
  },

  mounted() {
    // this.fetch()
  },

  methods: {
    // 打开弹窗
    open(record) {
      this.visible = true
      this.currentData = record
      this.getQuotationList(record.id)
    },

    // 关闭弹窗，点击遮罩层或右上角叉或取消按钮时触发
    close() {
      this.visible = false
      // 重置表单
      this.$refs.ruleForm.resetFields()
      this.dataSource = []
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
      this.getQuotationList(this.currentData.id)
    },

    //打开报价选型
    handleOk() {
      this.$refs.selectTypeForm.open(this.currentData)
    },

    // 获取报价信息详情
    getQuotationList(id) {
      let params = this.getQueryParams() //查询条件
      this.loading = true
      getQuotationInfo(id, params)
        .then(res => {
          console.log(res)
          if (res.success) {
            this.dataSource = res.result
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
      this.columns.forEach(function(value) {
        str += ',' + value.dataIndex
      })
      return str
    },

    // 检索：查询按钮
    searchQuery() {
      this.getQuotationList(this.currentData.id)
    },
    // 检索：重置按钮
    searchReset() {
      for (let key in this.param) {
        if (key != 'ids') {
          this.param[key] = null
        }
      }
      console.log(this.param)
      simpleDebounce(this.getQuotationList(this.currentData.id), 0)(1)
    }
  }
}
</script>

<style lang="less" scoped>
.title {
  background-color: #f8faff;
  padding: 10px;
  margin-bottom: 10px;
  font-weight: 600;
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
