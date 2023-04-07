<!--
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-08-23 17:32:23
 * @LastEditors: JLX
 * @LastEditTime: 2023-02-14 15:40:03
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
                  placeholder="请先选择产品类型"
                  :disabled="!param.productType"
                  @treeData="treeData"
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
                  placeholder="请先选择产品类型"
                  :disabled="!param.productType"
                  @treeData="treeData"
                />
              </a-form-model-item>
            </a-col>
          </template>

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

          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-model-item label="产品名称" prop="prodName">
                <j-input v-model="param.prodName" placeholder="请输入产品名称" />
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
        <!-- <a-button type="primary" @click="handleAdd" icon="plus">新增</a-button>
        <a-button icon="delete" type="danger" @click="batchPathDel" :disabled="selectedRowKeys.length === 0"
          >删除
        </a-button> -->
        <!-- <a-button type="primary" @click="handleImport">导入</a-button>
        <a-button icon="download" @click="download('产品管理模版', 'xls')">下载模板</a-button> -->
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
              <a href="javascript:;" @click="handleDetail(row)">详情</a>
              <a-divider type="vertical" />
              <!-- (0-待审批，1-已审批，2-审批通过，3审批不通过) -->
              <a @click="handleApproval(row)" :disabled="row.approval !== 0">审核</a>
            </a-space>
          </template>
        </a-table>
      </div>
    </div>

    <!-- 详情弹窗 -->
    <add-and-detail-dialog ref="modalForm" @refresh="loadData(1)"></add-and-detail-dialog>
    <!-- 审批弹窗 -->
    <approval-dialog ref="approvalForm" @refresh="loadData(1)"></approval-dialog>
  </a-card>
</template>

<script>
// API
import { deleteProdect } from '@/api/product-management/product-management/index'
import { getAllSupplierList } from '@/api/product-management/product-management/index'
// 组件
// import AddAndDetailDialog from './components/AddAndDetailDialog'
import AddAndDetailDialog from '@/views/product-management/components/AddAndDetailDialog'
import ApprovalDialog from './components/ApprovalDialog'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin'
// 字典
import { getDictText } from '@/api/api'
export default {
  mixins: [TableListMixin],
  components: { AddAndDetailDialog, ApprovalDialog },
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
          width: 100,
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
          // 审批状态(0-待审批，1-已审批，2-审批通过，3审批不通过)
          customRender: (value) => getDictText('approval_status', value),
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
      // 请求地址
      url: {
        list: `/jeecg-supplier/prodProduct/list?approval=${0}`, // 列表
      },
    }
  },

  created() {
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

    // 单价变更记录
    handlePrice(row) {
      this.$refs.modalForm.price(row)
    },

    // 产品分类数据
    treeData(data) {
      console.log(data)
      this.menuList = data
    },
    // 搜索
    filterOption(input, option) {
      console.log(input, option)
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    // 获取供应商名称列表
    getsupplierNameList() {
      getAllSupplierList().then((res) => {
        this.supplierNameList = res.result.records
      })
    },
    handleType(val) {
      this.param.productClassify = ''
      this.searchQuery()
    },
    // 审核
    handleApproval(row) {
      this.$refs.approvalForm.openApproval(row)
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
