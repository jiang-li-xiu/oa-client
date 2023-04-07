<!--
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-09-19 17:18:04
 * @LastEditors: JLX
 * @LastEditTime: 2022-11-11 09:56:44
-->

<template>
  <a-card :bordered="false" class="assembly-container-col">
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
              <a href="javascript:;" @click="handleDetail(row)">详情</a>
              <!-- 1-报价中，2-报价完成，3-超时未报价，4-放弃，5-已撤回 6结束 -->
              <template v-if="type !== 2 && row.status == 1">
                <a-divider type="vertical" />
                <a href="javascript:;" @click="handleWithdraw(row)">撤回</a>
              </template>
              <template v-if="type !== 2 && ![3, 4, 6].includes(row.status)">
                <a-divider type="vertical" />
                <a href="javascript:;" :style="{ color: '#ff2439' }" @click="handleEnd(row)">结束</a>
              </template>
            </a-space>
          </template>
        </a-table>
        <a-button v-if="type !== 2" @click="handleAddInquiry()" class="button"> 添加询价 </a-button>
      </div>
    </div>

    <!-- 添加询价弹窗 -->
    <add-inquiry-dialog ref="modalForm" @refresh="loadData(1)" :data="data"></add-inquiry-dialog>
  </a-card>
</template>

<script>
// API
import { putWithdraw, putInquiryEnd } from '@/api/project-management/plan-management/PlanAskPrice.js'
// 组件
import AddInquiryDialog from './AddAndDetailInquiryDialog'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin'
import { getDictText } from '@/api/api.js'
export default {
  mixins: [TableListMixin],
  components: { AddInquiryDialog },
  props: {
    // 2-详情
    type: {
      type: Number,
      default: ''
    },
    // 产品数据
    data: {
      type: Array,
      default: () => []
    },
    // 当前行询价数据
    currentData: {
      type: [Object, Array],
      default: () => {}
    }
  },
  data() {
    return {
      // 查询参数
      param: {},
      // 询价表格
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          align: 'center',
          width: '20%',
          customRender(text, record, index) {
            return index + 1
          }
        },
        {
          title: '供应商名称',
          dataIndex: 'supplierName',
          align: 'center',
          width: '20%'
        },
        {
          title: '产品数量',
          dataIndex: 'num',
          align: 'center',
          width: '20%'
        },
        {
          title: '截止时间',
          dataIndex: 'deadline',
          align: 'center',
          width: '20%'
        },
        {
          title: '状态',
          dataIndex: 'status',
          align: 'center',
          width: '20%',
          // 1-报价中，2-报价完成，3-超时未报价，4-放弃，5-已撤回 6-结束
          customRender: value => getDictText('plan_type', value)
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
      // disableMixinCreated: true, //不执行混入
      // 询价表格数据
      dataSource: [],
      // 请求地址
      url: {
        list: `/prodSchemeSupplierInquiry/list?schemeInquiryId=${this.currentData.id}`, // 列表
        deleteBatch: '' //删除
      },
      schemeInquiryId: '' // 询价id
    }
  },

  watch: {
    currentData: {
      handler(val) {
        console.log('当前行询价数据id', val.id)
        this.schemeInquiryId = val.id
        this.url.list = `/prodSchemeSupplierInquiry/list?schemeInquiryId=${this.schemeInquiryId}`
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    // 撤回
    handleWithdraw(record) {
      console.log('撤回', record)
      let that = this
      this.$confirm({
        title: '确认撤回',
        content: '是否撤回该数据的询价?',
        onOk: function() {
          that.loading = true
          putWithdraw(record.id)
            .then(res => {
              if (res.success) {
                //重新计算分页问题
                that.reCalculatePage(that.selectedRowKeys.length)
                that.$message.success(res.message)
                that.loadData()
                that.$emit('refresh')
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
    },

    // 打开添加询价弹窗
    handleAddInquiry() {
      this.$refs.modalForm.add(this.currentData)
      // this.$refs.modalForm.onClearSelected()
    },

    // 结束
    handleEnd(row) {
      let that = this
      this.$confirm({
        title: '确认结束',
        content: '是否结束该数据的询价?',
        onOk: function() {
          that.loading = true
          putInquiryEnd(row.id)
            .then(res => {
              if (res.success) {
                //重新计算分页问题
                that.reCalculatePage(that.selectedRowKeys.length)
                that.$message.success(res.message)
                that.loadData()
                that.$emit('refresh')
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
.button {
  margin-top: 15px;
  width: 100%;
  margin-bottom: 20px;
}
</style>
