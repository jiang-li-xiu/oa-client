<template>
  <a-card :bordered="false" class="assembly-container-col">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form-model ref="ruleForm" v-model="param" layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-model-item label="项目名称" prop="projectName">
              <a-select v-model="param.projectName" placeholder="请选择项目名称">
                <a-select-option v-for="item in projectList" :key="item.id" :value="item.name">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="供应商名称" prop="supplierName">
              <!-- <a-input v-model="param.supplierName" placeholder="请输入供应商名称" /> -->
              <a-select v-model="param.supplierId" placeholder="请选择产供应商">
                <a-select-option v-for="item in supplierNameList" :key="item.id" :value="item.id">
                  {{ item.supplier }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="下单时间" prop="doOrderTime">
              <a-range-picker v-model="times" style="width: 100%" @change="handleRangePickerChange" />
            </a-form-model-item>
          </a-col>

          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-model-item label="需求到货时间" prop="demandArriveTime">
                <a-range-picker v-model="times" style="width: 100%" @change="handleRangePickerChange" />
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
        <!-- <a-button icon="delete" type="danger" @click="batchPathDel()" :disabled="selectedRowKeys.length === 0"
          >批量删除
        </a-button> -->
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
            <!-- orderStatus 1-备货中，2-待收货，3-已收货，4-已完成，5-已拒单， -->
            <a-space :size="12">
              <template v-if="row.orderStatus == 1">
                <a href="javascript:;" @click="handleEdit(row)">编辑</a>
                <a-divider type="vertical" />
              </template>
              <template v-if="row.orderStatus == 2">
                <a href="javascript:;" @click="handleGoods(row, 1)">收货 </a>
                <a-divider type="vertical" />
              </template>
              <template v-if="row.orderStatus == 3">
                <a href="javascript:;" @click="handleGoods(row, 2)">签收 </a>
                <a-divider type="vertical" />
              </template>
              <!-- <a href="javascript:;" @click="handleAfter(row)">售后 </a> -->
              <a href="javascript:;" @click="handleDetail(row)">详情</a>
              <template v-if="row.orderStatus == 4">
                <a-divider type="vertical" />
                <a href="javascript:;" @click="handleAfter(row)">售后 </a>
                <a-divider type="vertical" />
                <a href="javascript:;" @click="batchPathDel(row.id)" :style="{ color: 'red' }">删除</a>
              </template>
            </a-space>
          </template>
        </a-table>
      </div>
    </div>

    <!-- 编辑详情弹窗 -->
    <edit-and-detail-dialog ref="modalForm" @refresh="loadData(1)"></edit-and-detail-dialog>

    <!-- 收货/签收上传照片 -->
    <confirm-goods ref="confirm" @refresh="loadData(1)"></confirm-goods>
    <!-- 售后 -->
    <after-dialog ref="after" @refresh="loadData(1)"></after-dialog>
  </a-card>
</template>

<script>
// API
import { getProjectList } from '@/api/project-management/foreign-price-management/ProjectProfit.js'
import { getSupplierList } from '@/api/product-management/product-management/index'
// 组件
import EditAndDetailDialog from './components/EditAndDetailDialog'
import ConfirmGoods from './components/ConfirmGoods'
import AfterDialog from './components/AfterDialog'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin'
// 字典
import { getDictText } from '@/api/api.js'
import { simpleDebounce } from '@/utils/util'
import { postAction, putAction } from '@/api/manage'
export default {
  mixins: [TableListMixin],
  components: { EditAndDetailDialog, ConfirmGoods, AfterDialog },
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
          width: 190,
          ellipsis: true,
        },
        {
          title: '供应商名称',
          dataIndex: 'supplierName',
          align: 'center',
          width: 190,
          ellipsis: true,
        },
        {
          title: '申请人',
          dataIndex: 'applyPeople',
          align: 'center',
          width: 190,
          ellipsis: true,
        },
        {
          title: '采购部门',
          dataIndex: 'department',
          align: 'center',
          width: 190,
          ellipsis: true,
        },

        {
          title: '收货地址及联系人',
          dataIndex: 'consignee',
          align: 'center',
          width: 190,
          ellipsis: true,
        },
        {
          title: '订单金额',
          dataIndex: 'orderTotlePrice',
          align: 'center',
          width: 190,
          ellipsis: true,
        },
        {
          title: '需求到货时间',
          dataIndex: 'demandArriveTime',
          align: 'center',
          width: 190,
          ellipsis: true,
        },
        {
          title: '下单时间',
          dataIndex: 'doOrderTime',
          align: 'center',
          width: 190,
          ellipsis: true,
        },
        {
          title: '物流单号',
          dataIndex: 'logisticsSingleNumber',
          align: 'center',
          width: 190,
          ellipsis: true,
        },
        {
          title: '收货时间',
          dataIndex: 'takeDeliveryTime',
          align: 'center',
          width: 190,
          ellipsis: true,
        },
        {
          title: '付款状态',
          dataIndex: 'payStatus',
          align: 'center',
          width: 190,
          ellipsis: true,
          // 0-未付款，1-已付款
          customRender(text) {
            return text == 1 ? '已付款' : '未付款'
          },
        },
        {
          title: '订单状态',
          dataIndex: 'orderStatus',
          align: 'center',
          width: 190,
          ellipsis: true,
          // 1-备货中，2-待收货，3-已收货，4-已完成，5-已拒单，
          customRender: (value) => getDictText('order_type', value),
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          fixed: 'right',
          width: 190,
          scopedSlots: { customRender: 'action' },
        },
      ],
      // 请求地址
      url: {
        list: '/jeecg-supplier/prodOrder/list', // 列表
        deleteBatch: '/jeecg-supplier/prodOrder', //删除
      },
      // 时间
      times: [],
      projectList: [], //项目信息
      supplierNameList: [], //供应商列表
    }
  },

  created() {
    this.getProjectList()
    this.getbasicNameList()
  },

  methods: {
    // 获取项目列表
    getProjectList() {
      getProjectList().then(({ result, success }) => {
        if (success) {
          // console.log(result)
          this.projectList = result.records
        }
      })
    },

    // 供应商名称列表
    getbasicNameList() {
      getSupplierList().then((res) => {
        this.supplierNameList = res.result.records
        console.log(this.supplierNameList)
      })
    },

    // 收货/签收
    handleGoods(row, type) {
      this.$refs.confirm.open(row, type)
    },

    // 售后
    handleAfter(row) {
      this.$refs.after.add(row)
    },

    // 签收
    handleReceive() {
      let ids = id || this.selectedRowKeys.toString()
      let that = this
      console.log(that.url.deleteBatch)
      this.$confirm({
        title: '确认签收',
        content: '是否签收数据?',
        onOk: function () {
          that.loading = true
          putAction(that.url.deleteBatch, ids)
            .then((res) => {
              if (res.success) {
                //重新计算分页问题
                that.reCalculatePage(that.selectedRowKeys.length)
                that.$message.success('签收成功')
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
