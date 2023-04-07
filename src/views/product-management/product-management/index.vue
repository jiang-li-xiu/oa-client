<!--
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-08-23 17:32:23
 * @LastEditors: JLX
 * @LastEditTime: 2023-02-07 10:06:05
-->
<template>
  <a-card :bordered="false" class="assembly-container-col">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form-model ref="ruleForm" v-model="param" layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-model-item label="产品类型" prop="productType">
              <a-input-group>
                <a-select
                  v-model="param.productType"
                  style="width: 100%"
                  placeholder="请选择产品类型"
                  @change="handleType"
                >
                  <a-select-option value="1">设备</a-select-option>
                  <a-select-option value="2">劳务</a-select-option>
                </a-select>
              </a-input-group>
            </a-form-model-item>
          </a-col>

          <!-- 设备字典 -->
          <template v-if="param.productType == 1">
            <a-col :md="6" :sm="8">
              <a-form-model-item label="产品分类" prop="productClassify">
                <j-category-select
                  v-model="param.productClassify"
                  pcode="B03"
                  :multiple="false"
                  @change="searchQuery"
                  @treeData="treeData"
                  :disabled="!param.productType"
                  placeholder="请先选择产品类型"
                />
              </a-form-model-item>
            </a-col>
          </template>
          <!-- 劳务字典 -->
          <template v-else>
            <a-col :md="6" :sm="8">
              <a-form-model-item label="产品分类" prop="productClassify">
                <j-category-select
                  v-model="param.productClassify"
                  pcode="A01"
                  :multiple="false"
                  @change="searchQuery"
                  @treeData="treeData"
                  placeholder="请先选择产品类型"
                  :disabled="!param.productType"
                />
              </a-form-model-item>
            </a-col>
          </template>

          <a-col :md="6" :sm="8">
            <a-form-model-item label="产品名称" prop="prodName">
              <j-input v-model="param.prodName" placeholder="请输入产品名称" />
            </a-form-model-item>
          </a-col>

          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-model-item label="供应商" prop="supplierId">
                <a-select
                  v-model="param.supplierId"
                  placeholder="请选择产供应商"
                  show-search
                  :filter-option="filterOption"
                >
                  <a-select-option v-for="item in supplierNameList" :key="item.id" :value="item.id">
                    {{ item.supplier }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-model-item label="规格型号" prop="model">
                <j-input v-model="param.model" placeholder="请输入规格型号" />
              </a-form-model-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-model-item label="品牌" prop="brand">
                <j-input v-model="param.brand" placeholder="请输入品牌" />
              </a-form-model-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-model-item label="设备类型" prop="equipmentType">
                <j-dict-select-tag v-model="param.equipmentType" dictCode="product_type" placeholder="请选择设备类型" />
                <!-- <j-category-select v-model="param.type" pcode="B03" :multiple="false" placeholder="请选择类型" /> -->
              </a-form-model-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-model-item label="审批状态" prop="approval">
                <j-dict-select-tag v-model="param.approval" dictCode="approval_status" placeholder="请选择状态" />
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
        <a-button icon="delete" type="danger" @click="batchPathDel" :disabled="selectedRowKeys.length === 0"
          >删除
        </a-button>
        <a-button type="primary" @click="handleImport">导入</a-button>
        <a-button icon="download" @click="download('产品管理模版', 'xls')">下载模板</a-button>
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
          <div class="overflowStyle" slot="modelParameter" slot-scope="text, record">
            <a-popover placement="top">
              <template slot="content">
                <span>{{ record.modelParameter }}</span>
              </template>
              <span>{{ record.modelParameter }}</span>
            </a-popover>
          </div>
          <template #action="row">
            <a-space :size="12">
              <!-- <a href="javascript:;" :disabled="row.approval == 2" @click="handleEdit(row)">编辑</a> -->
              <a href="javascript:;" @click="handleEdit(row)">编辑</a>
              <a-divider type="vertical" />
              <a href="javascript:;" @click="handleDetail(row)">详情</a>
              <a-divider type="vertical" />
              <a href="javascript:;" @click="handleShelf(row)" :disabled="row.status == 1">上架</a>
              <!-- <template v-if="row.status !== 1">
                <a-divider type="vertical" />
                <a @click="handleApproval(row)">审核</a>
              </template> -->
              <!-- <a-divider type="vertical" />
              <a @click="handlePrice(row)">单价变更记录</a> -->
            </a-space>
          </template>
        </a-table>
      </div>
    </div>

    <!-- 新增详情弹窗 -->
    <add-and-detail-dialog ref="modalForm" @refresh="loadData(1)"></add-and-detail-dialog>
    <!-- 导入弹框 -->
    <import-excel-modal
      ref="importmodal"
      :url="url.importUrl"
      @ok="loadData"
      :list="supplierNameList"
      @getModel="getsupplierNameList()"
      :showModel="true"
    >
      <!-- <template #default>
        <a-form-model-item label="供应商名称" prop="supplierName">
          <a-select
            v-model="slotParams.supplierName"
            placeholder="请选择供应商名称"
            allowClear
            showSearch
            :filterOption="filterOption"
          >
            <a-select-option v-for="item in supplierNameList" :key="item.id" :value="item.id">
              {{ item.supplier }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </template> -->
    </import-excel-modal>
  </a-card>
</template>

<script>
// API
import { deleteProdect, getAllSupplierList, putShelf } from '@/api/product-management/product-management/index'
// 组件
import AddAndDetailDialog from '@/views/product-management/components/AddAndDetailDialog'
// 导入
import ImportExcelModal from '@/components/ImportExcelModal'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin'
// 字典
import { getDictText } from '@/api/api'
export default {
  mixins: [TableListMixin],
  components: { AddAndDetailDialog, ImportExcelModal },
  data() {
    return {
      // 查询参数
      param: {},
      // 表格配置
      columns: [
        {
          title: '产品名称',
          dataIndex: 'prodName',
          align: 'center',
          width: 150,
          ellipsis: true,
        },
        {
          title: '供应商',
          dataIndex: 'supplierName',
          align: 'center',
          width: 150,
          ellipsis: true,
        },
        {
          title: '品牌',
          dataIndex: 'brand',
          align: 'center',
          width: 150,
          ellipsis: true,
        },
        {
          title: '单位',
          dataIndex: 'unit',
          align: 'center',
          width: 150,
          ellipsis: true,
        },
        {
          title: '规格型号',
          dataIndex: 'model',
          align: 'center',
          width: 150,
          ellipsis: true,
        },
        {
          title: '规格参数',
          dataIndex: 'modelParameter',
          align: 'center',
          width: 150,
          ellipsis: true,
          scopedSlots: { customRender: 'modelParameter' },
        },
        {
          title: '单价（元）',
          dataIndex: 'price',
          align: 'center',
          width: 100,
          ellipsis: true,
        },
        {
          title: '到货周期（天）',
          dataIndex: 'supplyTime',
          align: 'center',
          width: 100,
          ellipsis: true,
        },
        {
          title: '付款周期（天）',
          dataIndex: 'paymentPeriod',
          align: 'center',
          width: 100,
          ellipsis: true,
        },
        {
          title: '单价有效期',
          dataIndex: 'priceValid',
          align: 'center',
          width: 150,
          ellipsis: true,
        },
        {
          title: '维修地址',
          dataIndex: 'serviceAddr',
          align: 'center',
          width: 150,
          ellipsis: true,
        },
        {
          title: '退货地址',
          dataIndex: 'returnAddress',
          align: 'center',
          width: 150,
          ellipsis: true,
        },
        {
          title: '运维周期',
          dataIndex: 'devops',
          align: 'center',
          width: 100,
          ellipsis: true,
        },
        {
          title: '质保时间',
          dataIndex: 'warranty',
          align: 'center',
          width: 100,
          ellipsis: true,
        },
        {
          title: '设备类型',
          dataIndex: 'equipmentType',
          align: 'center',
          width: 100,
          ellipsis: true,
          customRender: (value) => getDictText('product_type', value),
          // customRender(text) {
          //   return text == 1 ? '主材' : text == 2 ? '辅材' : '劳务'
          // }
        },
        {
          title: '含序列号',
          dataIndex: 'hasSerial',
          align: 'center',
          width: 100,
          ellipsis: true,
          customRender(text) {
            return text == 1 ? '是' : '否'
          },
        },
        {
          title: '审批状态',
          dataIndex: 'approval',
          align: 'center',
          width: 100,
          ellipsis: true,
          // // 审批状态(0-待审批，1-已审批，2-审批通过，3审批不通过)
          // customRender: value => getDictText('approval_status', value)
          // 审批状态(0-待审批，1-已保存，2-审批通过，3审批不通过)
          customRender(text) {
            return text == 0 ? '待审批' : text == 1 ? '已保存' : text == 2 ? '审批通过' : '审批不通过'
          },
        },
        {
          title: '状态',
          dataIndex: 'status',
          align: 'center',
          width: 100,
          //
          customRender(text) {
            return text == 1 ? '正常' : text == 2 ? '冻结' : ''
          },
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
      // 供应商名称列表
      supplierNameList: {},

      // 插槽数据
      slotParams: {
        supplierName: undefined,
      },
      // 请求地址
      url: {
        list: `/jeecg-supplier/prodProduct/list`, // 列表
        importUrl: `/prodProduct/import/manage`, //导入
        // downloadUrl: '/oa-base/product/export/model' //下载模板
        downloadGetUrl: '/jeecg-supplier/prodProduct/template', //下载模板
      },
    }
  },

  mounted() {
    this.$bus.$on('openProduct', this.open)
    if (this.$route.query.open) {
      console.log(this.$route)
      this.open(this.$route.query.supplierName, this.$route.query.id)
    }
  },
  beforeDestroy() {
    this.$bus.$off('openProduct', this.open)
  },

  created() {
    // 获取供应商名称列表
    this.getsupplierNameList()
    this.treeData()
  },

  methods: {
    // 点击基础信息管理的录入产品打开产品管理的新增
    open(name, id) {
      console.log(name, id)
      // 打开新增
      this.$refs.modalForm.add(name, id)
      // 填充名字
      this.$refs.modalForm.formParams.supplierName = name
      this.$nextTick(() => {
        console.log(id)
        this.$refs.modalForm.getInfo(id)
      })
    },
    handleType(val) {
      this.param.productClassify = ''
      this.searchQuery()
    },
    // 搜索
    filterOption(input, option) {
      console.log(input, option)
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },

    // 单价变更记录
    handlePrice(row) {
      this.$refs.modalForm.price(row)
    },

    // 获取供应商名称列表
    getsupplierNameList() {
      getAllSupplierList().then((res) => {
        // console.log(res)
        if (res.success) {
          this.supplierNameList = res.result.records
        }
      })
    },

    // 产品分类数据
    treeData(data) {
      // console.log(data)
      this.menuList = data
    },

    // 列表内容删除：多选或单选 || 路径传参
    batchPathDel: function () {
      let ids = this.selectedRowKeys.toString()
      let that = this
      console.log(ids)
      this.$confirm({
        title: '确认删除',
        content: '是否删除数据?',
        onOk: function () {
          that.loading = true
          deleteProdect(ids)
            .then((res) => {
              if (res.success) {
                //重新计算分页问题
                that.reCalculatePage(that.selectedRowKeys.length)
                that.$message.success('删除成功')
                that.loadData()
                that.onClearSelected()
              } else {
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              that.loading = false
            })
        },
      })
    },
    handleShelf(row) {
      let that = this
      this.$confirm({
        title: '确认上架',
        content: '是否上架该数据?',
        onOk: function () {
          that.loading = true
          putShelf(row.id)
            .then((res) => {
              if (res.success) {
                //重新计算分页问题
                that.reCalculatePage(that.selectedRowKeys.length)
                that.$message.success('上架成功')
                that.loadData()
                that.onClearSelected()
              } else {
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              that.loading = false
            })
        },
      })
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
