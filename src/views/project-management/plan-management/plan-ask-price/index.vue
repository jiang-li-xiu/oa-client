<!--
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-09-19 17:18:04
 * @LastEditors: JLX
 * @LastEditTime: 2022-11-30 15:27:51
-->

<template>
  <a-card :bordered="false" class="assembly-container-col">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form-model ref="ruleForm" v-model="param" layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-model-item label="客户名称" prop="companyName">
              <j-input v-model="param.companyName" placeholder="请输入客户名称" />
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="客户联系方式" prop="customerPhone">
              <j-input v-model="param.customerPhone" placeholder="请输入客户联系方式" />
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="设计时间" prop="time">
              <a-range-picker v-model="times" style="width: 100%" @change="handleRangePickerChange" />
            </a-form-model-item>
          </a-col>

          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-model-item label="设计人" prop="peopleName">
                <j-input v-model="param.peopleName" placeholder="请输入设计人" />
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
              <!--  1-保存，2-已提交，3-询价中 4-结束-->
              <template v-if="[3].includes(row.status)">
                <a href="javascript:;" @click="handleEnd(row)">结束</a>
                <a-divider type="vertical" />
              </template>
              <a href="javascript:;" @click="handleDetail(row)">详情</a>
              <!-- <a-divider type="vertical" /> -->
              <!-- <a href="javascript:;" @click="handleSelect(row)">选型</a> -->
              <template v-if="[1, 2, 3].includes(row.status)">
                <a-divider type="vertical" />
                <a href="javascript:;" :style="{ color: '#ff2439' }" @click="handleQuirePrice(row)">询价</a>
              </template>
              <template v-if="[4].includes(row.status)">
                <a-divider type="vertical" />
                <a href="javascript:;" :style="{ color: '#ff2439' }" @click="handleInfo(row)">报价信息</a>
              </template>
            </a-space>
          </template>
        </a-table>
      </div>
    </div>

    <!-- 详情弹窗 -->
    <detail-dialog ref="modalForm" @refresh="loadData(1)"></detail-dialog>
    <!-- 报价信息 -->
    <quotation-info-dialog ref="quoForm"></quotation-info-dialog>
    <!-- 选型 -->
    <SelectionTypeDialog ref="selectTypeForm" @refresh="loadData(1)"></SelectionTypeDialog>
  </a-card>
</template>

<script>
// API
import { putInquiryListEnd } from '@/api/project-management/plan-management/PlanAskPrice.js'
// 组件
import DetailDialog from './components/DetailDialog'
import QuotationInfoDialog from './components/QuotationInfoDialog' //报价信息
import SelectionTypeDialog from './components/SelectionTypeDialog' //选型
// 混入
import { TableListMixin } from '@/mixins/TableListMixin'

import { simpleDebounce } from '@/utils/util'
export default {
  mixins: [TableListMixin],
  components: { DetailDialog, QuotationInfoDialog, SelectionTypeDialog },
  data() {
    return {
      // 查询参数
      param: {},
      // 表格配置
      columns: [
        {
          title: '客户名称',
          dataIndex: 'companyName',
          align: 'center',
          width: '14%'
        },
        {
          title: '客户联系人',
          dataIndex: 'customerName',
          align: 'center',
          width: '14%'
        },
        {
          title: '客户联系方式',
          dataIndex: 'customerPhone',
          align: 'center',
          width: '14%'
        },
        {
          title: '设计人',
          dataIndex: 'peopleName',
          align: 'center',
          width: '14%'
        },
        {
          title: '设计部门',
          dataIndex: 'department',
          align: 'center',
          width: '14%'
        },
        {
          title: '设计时间',
          dataIndex: 'time',
          align: 'center',
          width: '14%'
        },
        {
          title: '状态',
          dataIndex: 'status',
          align: 'center',
          width: '14%',
          // 1-保存，2-已提交，3-询价中 4结束
          customRender(text) {
            return text == 1 ? '保存' : text == 2 ? '已提交' : text == 3 ? '询价中' : '结束'
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          fixed: 'right',
          width: 150,
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 请求地址
      url: {
        list: '/prodSchemeInquiry/list', // 列表
        deleteBatch: '' //删除
      },
      // 时间
      times: []
    }
  },

  methods: {
    // 询价
    handleQuirePrice(record) {
      this.$refs.modalForm.title = '询价'
      this.$refs.modalForm.add(record)
    },

    // 报价信息
    handleInfo(record) {
      this.$refs.quoForm.open(record)
    },

    // 查看详情：列表单行查看详情
    handleDetail(record) {
      this.$refs.modalForm.detail(record)
      this.$refs.modalForm.title = '详情'
      this.$refs.modalForm.disableSubmit = true
    },

    // 选型
    handleSelect(row) {
      this.$refs.selectTypeForm.open(row)
    },

    // 结束
    handleEnd(row) {
      let that = this
      this.$confirm({
        title: '确认结束',
        content: '是否结束该数据的询价?',
        onOk: function() {
          that.loading = true
          putInquiryListEnd(row.id)
            .then(res => {
              if (res.success) {
                //重新计算分页问题
                that.reCalculatePage(that.selectedRowKeys.length)
                that.$message.success(res.message)
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
