<!--
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-08-23 17:32:23
 * @LastEditors: JLX
 * @LastEditTime: 2022-08-31 14:34:07
-->
<template>
  <a-card :bordered="false" class="assembly-container-col">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form-model ref="ruleForm" v-model="param" layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-model-item label="供应商" prop="supplierName">
              <j-input v-model="param.supplierName" placeholder="请输入供应商" />
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="商品名称" prop="productName">
              <j-input v-model="param.productName" placeholder="请输入商品名称" />
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="产品类型" prop="type">
              <!-- <a-select v-model="param.type" placeholder="请选择类型">
                <a-select-option value="0">主材</a-select-option>
                <a-select-option value="1">辅材</a-select-option>
                <a-select-option value="2">耗材</a-select-option>
              </a-select> -->
              <!-- <j-dict-select-tag v-model="param.type" dictCode="B03" placeholder="请选择类型" /> -->
              <j-category-select v-model="param.type" pcode="B03" :multiple="false" placeholder="请选择类型" />
            </a-form-model-item>
          </a-col>

          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-model-item label="状态" prop="industry">
                <a-select v-model="param.industry" placeholder="请选择状态">
                  <a-select-option value="0">待审批</a-select-option>
                  <a-select-option value="1">已审批</a-select-option>
                </a-select>
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
            fixed: true
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
              <a-divider type="vertical" />
              <a @click="handlePrice(row)">单价变更记录</a>
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
import AddAndDetailDialog from './components/AddAndDetailDialog'
// 导入
import ImportExcelModal from '@/components/ImportExcelModal'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin'
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
          dataIndex: 'productName',
          align: 'center',
          width: 200
        },
        {
          title: '供应商',
          dataIndex: 'supplierName',
          align: 'center',
          width: 200
        },
        {
          title: '品牌',
          dataIndex: 'brand',
          align: 'center',
          width: 200
        },
        {
          title: '规格型号',
          dataIndex: 'specificationParameter',
          align: 'center',
          width: 200
        },
        {
          title: '单价（元）',
          dataIndex: 'univalence',
          align: 'center',
          width: 200
        },
        {
          title: '到货周期',
          dataIndex: 'leadTime',
          align: 'center',
          width: 200
        },
        {
          title: '付款周期',
          dataIndex: 'payTime',
          align: 'center',
          width: 200
        },
        {
          title: '单价有效期',
          dataIndex: 'univalenceIndata',
          align: 'center',
          width: 200
        },
        {
          title: '维修地址',
          dataIndex: 'maintainAddress',
          align: 'center',
          width: 200
        },
        {
          title: '退货地址',
          dataIndex: 'returnsAddress',
          align: 'center',
          width: 200
        },
        {
          title: '运维周期',
          dataIndex: 'operationalCycle',
          align: 'center',
          width: 200
        },
        {
          title: '质保时间',
          dataIndex: 'warrantyPeriod',
          align: 'center',
          width: 200
        },
        {
          title: '产品类型',
          dataIndex: 'type',
          align: 'center',
          width: 200,
          customRender(text) {
            return text == 1 ? '主材' : text == 2 ? '辅材' : '耗材'
          }
        },
        {
          title: '含序列号',
          dataIndex: 'hasSerialNumber',
          align: 'center',
          width: 200
        },
        {
          title: '状态',
          dataIndex: 'status',
          align: 'center',
          width: 200,
          customRender(text) {
            return text == 1 ? '已审批' : '待审批'
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          fixed: 'right',
          width: 200,
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 供应商名称列表
      supplierNameList: {},
      // 请求地址
      url: {
        list: '/oa-base/product/list', // 列表
        importUrl: `/oa-base/product/import`, //导入
        downloadUrl: '/oa-base/product/export/model' //下载模板
      }
    }
  },

  mounted() {
    this.$bus.$on('openProduct', this.open)
    if (this.$route.query.open) {
      console.log(this.$route);
      this.open(this.$route.query.supplierName, this.$route.query.id)
    }
  },
  beforeDestroy() {
    this.$bus.$off('openProduct', this.open)
  },

  methods: {
    // 点击基础信息管理的录入产品打开产品管理的新增
    open(name, id) {
      console.log(name,id);
      // 打开新增
      this.$refs.modalForm.add(name, id)
      // 填充名字
      this.$refs.modalForm.formParams.supplierName = name
      this.$nextTick(() => {
        console.log(id);
        this.$refs.modalForm.getInfo(id)
      })
    },

    // 单价变更记录
    handlePrice(row) {
      this.$refs.modalForm.price(row)
    },

    // 获取供应商名称列表
    getsupplierNameList() {
      getSupplierList().then(res => {
        this.supplierNameList = res.result.records
      })
    },

    // 审核
    handleApproval(row) {
      let that = this
      this.$confirm({
        title: '请确认',
        content: '是否确认通过审核？',
        onOk: function() {
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
        }
      })
    },

    // 列表内容删除：多选或单选 || 路径传参
    batchPathDel: function() {
      let ids = this.selectedRowKeys.toString()
      let that = this
      console.log(ids)
      this.$confirm({
        title: '确认删除',
        content: '是否删除数据?',
        onOk: function() {
          that.loading = true
          deleteProdect(ids)
            .then(res => {
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
        }
      })
    }
  }
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
