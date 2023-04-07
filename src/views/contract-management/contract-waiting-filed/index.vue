<!--
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-09-14 17:20:59
 * @LastEditors: JLX
 * @LastEditTime: 2022-10-31 14:16:44
-->

<template>
  <a-card :bordered="false" class="assembly-container-col">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form-model ref="ruleForm" v-model="param" layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-model-item label="合同名称" prop="contractName">
              <j-input v-model="param.contractName" placeholder="请输入合同名称" />
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="合同编号" prop="contractCode">
              <j-input v-model="param.contractCode" placeholder="请输入合同编号" />
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="签订日期" prop="signTime">
              <a-range-picker v-model="times" style="width: 100%" @change="handleRangePickerChange" />
            </a-form-model-item>
          </a-col>

          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-model-item label="合同类型" prop="contractType">
                <j-dict-select-tag v-model="param.contractType" placeholder="请选择合同类型" dictCode="contract_type" />
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
              <a href="javascript:;" @click="handleDetail(row)">详情</a>
              <a-divider type="vertical" />
              <a href="javascript:;" @click="handleArchives(row)">归档</a>
            </a-space>
          </template>
        </a-table>
      </div>
    </div>

    <!-- 详情弹窗 -->
    <detail-dialog ref="modalForm" @refresh="loadData(1)" :is_archives="true"></detail-dialog>
  </a-card>
</template>

<script>
// API
import { postArchive } from '@/api/contract-management/index.js'
// 组件
import DetailDialog from '../components/AddAndDetailDialog.vue'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin'
import { getDictText } from '@/api/api.js'
import { simpleDebounce } from '@/utils/util'
export default {
  mixins: [TableListMixin],
  components: { DetailDialog },
  data() {
    return {
      // 查询参数
      param: {},
      // 表格配置
      columns: [
        {
          title: '合同编号',
          dataIndex: 'contractCode',
          align: 'center',
          width: 230,
          ellipsis: true
        },
        {
          title: '合同名称',
          dataIndex: 'contractName',
          align: 'center',
          width: 230,
          ellipsis: true
        },
        {
          title: '合同负责人',
          dataIndex: 'principalPersonId',
          align: 'center',
          width: 230,
          ellipsis: true
        },
        {
          title: '合同类型',
          dataIndex: 'contractType',
          align: 'center',
          width: 230,
          ellipsis: true,
          customRender: value => getDictText('contract_type', value)
        },
        {
          title: '总金额（元）',
          dataIndex: 'totalAmount',
          align: 'center',
          width: 230,
          ellipsis: true
        },
        {
          title: '生效时间',
          dataIndex: 'startTime',
          align: 'center',
          width: 230,
          ellipsis: true
        },
        {
          title: '终止时间',
          dataIndex: 'endTime',
          align: 'center',
          width: 230,
          ellipsis: true
        },
        {
          title: '合同状态',
          dataIndex: 'status',
          align: 'center',
          width: 230,
          ellipsis: true,
          customRender(text) {
            // 1-执行中，2-已结束，3-作废终止
            return text == 1 ? '执行中' : text == 2 ? '已结束' : text == 3 ? '作废终止' : ''
          }
        },
        {
          title: '创建人',
          dataIndex: 'createBy',
          align: 'center',
          width: 230,
          ellipsis: true
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          fixed: 'right',
          width: 180,
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 请求地址
      url: {
        list: '/jeecg-supplier/prodContract/not/entrepot/list' // 列表
      },
      times: []
    }
  },

  methods: {
    // 归档
    handleArchives(row) {
      console.log(row)
      let that = this
      this.$confirm({
        title: '确认归档',
        content: '确认是否进行此操作?',
        onOk: function() {
          that.loading = true
          postArchive({ id: row.id })
            .then(res => {
              if (res.success) {
                //重新计算分页问题
                that.reCalculatePage(that.selectedRowKeys.length)
                that.$message.success('归档成功')
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
      this.param.signTime_begin = dateStrings[0]
      this.param.signTime_end = dateStrings[1]
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
