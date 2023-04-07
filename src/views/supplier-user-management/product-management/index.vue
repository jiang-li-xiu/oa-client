<!--
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-08-23 17:32:23
 * @LastEditors: JLX
 * @LastEditTime: 2022-09-30 09:12:37
-->
<template>
  <a-card :bordered="false" class="assembly-container-col">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form-model ref="ruleForm" v-model="param" layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
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
            <span style="float: left; overflow: hidden" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">搜索</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form-model>

      <!-- 按钮区域 -->
      <div class="table-operator">
        <a-button type="primary" @click="handleAdd" icon="plus">新增</a-button>
        <a-button type="primary" @click="handleImport">导入</a-button>
        <a-button icon="delete" type="danger" @click="batchPathDel" :disabled="selectedRowKeys.length === 0"
          >删除
        </a-button>
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
          <template #action="row">
            <a-space :size="12">
              <a href="javascript:;" @click="handleEdit(row)">编辑</a>
              <a-divider type="vertical" />
              <a href="javascript:;" @click="handleDetail(row)">详情</a>
              <!-- <template v-if="row.status !== 1">
                <a-divider type="vertical" />
                <a @click="handleApproval(row)">审核</a>
              </template> -->
              <!-- <a-divider type="vertical" /> -->
              <!-- <a @click="handlePrice(row)">单价变更记录</a> -->
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
    />
  </a-card>
</template>

<script>
// API
import { deleteProdect, getSupplierList } from '@/api/supplier-management/productManagement'
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
          title: '商品名称',
          dataIndex: 'prodName',
          align: 'center',
          width: '6%',
        },
        {
          title: '供应商',
          dataIndex: 'supplierName',
          align: 'center',
          width: '6%',
        },
        {
          title: '品牌',
          dataIndex: 'brand',
          align: 'center',
          width: '6%',
        },
        {
          title: '规格型号',
          dataIndex: 'model',
          align: 'center',
          width: '6%',
        },
        {
          title: '单价（元）',
          dataIndex: 'price',
          align: 'center',
          width: '6%',
        },
        {
          title: '到货周期',
          dataIndex: 'supplyTime',
          align: 'center',
          width: '6%',
        },
        {
          title: '付款周期',
          dataIndex: 'paymentPeriod',
          align: 'center',
          width: '6%',
        },
        {
          title: '单价有效期',
          dataIndex: 'priceValid',
          align: 'center',
          width: '6%',
        },
        {
          title: '维修地址',
          dataIndex: 'serviceAddr',
          align: 'center',
          width: '6%',
        },
        {
          title: '退货地址',
          dataIndex: 'returnAddress',
          align: 'center',
          width: '6%',
        },
        {
          title: '运维周期',
          dataIndex: 'devops',
          align: 'center',
          width: '6%',
        },
        {
          title: '质保时间',
          dataIndex: 'warranty',
          align: 'center',
          width: '6%',
        },
        {
          title: '产品类型',
          dataIndex: 'productType',
          align: 'center',
          width: '6%',
          customRender(text) {
            return text == 1 ? '主材' : text == 2 ? '辅材' : '劳务'
          },
        },
        {
          title: '含序列号',
          dataIndex: 'hasSerial',
          align: 'center',
          width: '6%',
          customRender(text) {
            return text == 1 ? '是' : '否'
          },
        },
        {
          title: '审批状态',
          dataIndex: 'status',
          align: 'center',
          width: '6%',
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
        list: '/jeecg-supplier/prodProduct/list', // 列表
        importUrl: `/jeecg-supplier/prodProduct/import`, //导入
        downloadGetUrl: '/jeecg-supplier/prodProduct/template', //下载模板
      },
      dataSource: [{ supplierName: '1' }],
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

    // 获取供应商名称列表
    getsupplierNameList() {
      // getSupplierList().then(res => {
      //   this.supplierNameList = res.result.records
      // })
    },

    // 审核
    handleApproval(row) {
      let that = this
      this.$confirm({
        title: '请确认',
        content: '是否确认通过审核？',
        onOk: function () {
          // that.loading = true
          // deleteAction(that.url.deleteBatch, { ids: ids })
          //   .then(res => {
          //     if (res.success) {
          //       //重新计算分页问题
          //       that.reCalculatePage(that.selectedRowKeys.length)
          //       that.$message.success(res.message)
          //       that.loadData()
          //       that.onClearSelected()
          //     } else {
          //       that.$message.warning(res.message)
          //     }
          //   })
          // .finally(() => {
          //   that.loading = false
          // })
        },
      })
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
</style>
