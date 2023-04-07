<!--
 * @Descripttion: 项目利润
 * @Author: JLX
 * @Date: 2022-09-19 17:17:44
 * @LastEditors: JLX
 * @LastEditTime: 2023-03-20 16:12:23
-->
<template>
  <a-card :bordered="false" class="assembly-container-col">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form-model ref="ruleForm" v-model="param" layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-model-item label="客户名称" prop="customerName">
              <j-input v-model="param.customerName" placeholder="请输入客户名称" />
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="客户联系方式" prop="customerPhone">
              <j-input v-model="param.customerPhone" placeholder="请输入客户联系方式" />
            </a-form-model-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-model-item label="报价时间" prop="profitsTime">
              <!-- <a-range-picker v-model="times" style="width: 100%" @change="handleRangePickerChange" /> -->
              <a-range-picker
                v-model="times"
                style="width: 100%"
                @change="handleRangePickerChange"
                format="YYYY-MM-DD HH:mm:ss"
                :show-time="{
                  hideDisabledOptions: true,
                  defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                }"
              />
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
        <!-- <a-button type="primary" @click="handleAdd" icon="plus">新增</a-button> -->
        <a-button icon="delete" type="danger" @click="batchPathDel()" :disabled="selectedRowKeys.length === 0"
          >删除
        </a-button>
        <!-- <a-button type="primary" icon="download" @click="handleExportXls('角色管理')">导出</a-button> -->
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
              <!-- 已选型4/审核不通过3状态才能修改 -->
              <!-- <template v-if="[3, 4].includes(row.status)">
                <a href="javascript:;" @click="handleEdit(row)">编辑</a>
                <a-divider type="vertical" />
              </template> -->
              <a href="javascript:;" @click="handleDetail(row)">详情</a>
              <template v-if="row.status == 3">
                <a-divider type="vertical" />
                <a href="javascript:;" @click="batchPathDel(row.id)" :style="{ color: 'red' }">删除</a>
              </template>
            </a-space>
          </template>
        </a-table>
      </div>
    </div>

    <!-- 新增详情弹窗 -->
    <add-and-detail-dialog ref="modalForm" @refresh="loadData(1)"></add-and-detail-dialog>
  </a-card>
</template>

<script>
import { getProjectList } from '@/api/project-management/foreign-price-management/ProjectProfit.js'
// 组件
import AddAndDetailDialog from './components/AddAndDetailDialog'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin'
import moment from 'moment'
import { simpleDebounce } from '@/utils/util'
export default {
  mixins: [TableListMixin],
  components: { AddAndDetailDialog },
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
          width: 210,
          ellipsis: true,
        },
        {
          title: '客户名称',
          dataIndex: 'customerName',
          align: 'center',
          width: 210,
          ellipsis: true,
        },
        {
          title: '客户联系人',
          dataIndex: 'customerLiaison',
          align: 'center',
          width: 210,
          ellipsis: true,
          // customRender: (value) => getDictText('project_type', value),
        },
        {
          title: '客户联系方式',
          dataIndex: 'customerPhone',
          align: 'center',
          width: 210,
          ellipsis: true,
        },
        // {
        //   title: '选型人',
        //   dataIndex: 'selectPeopleName',
        //   align: 'center',
        //   width: 210,
        //   ellipsis: true,
        // },
        {
          title: '报价人',
          dataIndex: 'profitsPeopleName',
          align: 'center',
          width: 210,
          ellipsis: true,
        },
        {
          title: '报价部门',
          dataIndex: 'profitsPeopleDept',
          align: 'center',
          width: 210,
          ellipsis: true,
        },
        {
          title: '报价时间',
          dataIndex: 'profitsTime',
          align: 'center',
          width: 210,
          ellipsis: true,
        },
        {
          title: '总金额',
          dataIndex: 'totalSell',
          align: 'center',
          width: 210,
          ellipsis: true,
        },
        {
          title: '利润率',
          dataIndex: 'avgProfit',
          align: 'center',
          width: 210,
          ellipsis: true,
          customRender(value) {
            if (value) {
              return `${value}%`
            }
          },
        },
        // {
        //   title: '审核状态',
        //   dataIndex: 'status',
        //   align: 'center',
        //   width: 210,
        //   ellipsis: true,
        //   // 1-待审核，2审核通过，3-审核不通过，4-已选型，5-已报价
        //   customRender: (value) => getDictText('price_status', value),
        // },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          fixed: 'right',
          width: 200,
          scopedSlots: { customRender: 'action' },
        },
      ],
      // 请求地址
      url: {
        list: `/jeecg-supplier/prodProfits/list`, // 列表
        // list: `/jeecg-supplier/prodProfits/list?departId=${this.$store.getters.userInfo.departIds}&profitsPeopleId=${this.$store.getters.userInfo.id}`, // 列表
        deleteBatch: '/jeecg-supplier/prodProfits/batch', //删除
      },
      // 时间
      times: [],
      projectList: [], //项目信息
    }
  },

  created() {
    // this.getProjectList()
    console.log(this.$store.getters.userInfo)
  },

  methods: {
    moment,
    handleDetail(row) {
      // this.$refs.modalForm.detail(row, 'projectId')
      this.$refs.modalForm.profitDetail(row)
      this.$refs.modalForm.title = '详情'
      this.$refs.modalForm.disableSubmit = true
    },
    // 获取项目列表
    getProjectList() {
      getProjectList().then(({ result, success }) => {
        if (success) {
          // console.log(result)
          this.projectList = result.records
        }
      })
    },

    // 处理搜索时间
    handleRangePickerChange(dates, dateStrings) {
      this.param.profitsTime_begin = dateStrings[0]
      this.param.profitsTime_end = dateStrings[1]
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
</style>
