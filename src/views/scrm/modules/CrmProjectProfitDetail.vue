<template>
  <a-card :bordered="false" class="assembly-container-col">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <!-- 表格区域 -->
      <div class="table">
        <a-table
          :columns="columns"
          :data-source="dataSource"
          bordered
          size="small"
          rowKey="id"
          :scroll="{ x: true }"
          :indentSize="10"
          :pagination="false"
        >
          <template #action="text, record">
            <a @click="handleDetail(record)">详情</a>
          </template>
        </a-table>
      </div>
    </div>
    <detail ref="productInfo"></detail>
  </a-card>
</template>

<script>
import { getProfitsListDetail, getLibrary } from '@/api/set-project/set-project.js'
// import detail from '@/views/project-management/foreign-price-management/project-profit/components/AddAndDetailDialog.vue'
import detail from '@/views/project-management/foreign-price-management/project-profit/components/ProductInfo.vue'
export default {
  components: { detail },
  props: {
    currnetId: {
      type: String,
      default: '',
    },
    // 项目信息
    formParams: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      // 查询参数
      param: {},
      // 利润表
      columns: [
        {
          title: '方案编号',
          dataIndex: 'code',
          width: '11%',
          key: 'code',
          ellipsis: true,
        },
        {
          title: '方案名称',
          dataIndex: 'name',
          width: '11%',
          ellipsis: true,
          align: 'center',
        },
        {
          title: '方案类型',
          dataIndex: 'type',
          width: '11%',
          ellipsis: true,
          align: 'center',
          customRender(text) {
            if (text == 1) {
              return '工程'
            } else if (text == 2) {
              return '软件'
            } else {
              return ''
            }
          },
        },
        {
          title: '采购金额',
          dataIndex: 'totalPurchase',
          width: '11%',
          ellipsis: true,
          align: 'center',
        },
        {
          title: '设计人',
          dataIndex: 'designPerson',
          width: '11%',
          ellipsis: true,
          align: 'center',
        },
        {
          title: '设计部门',
          dataIndex: 'designPersonDept',
          width: '11%',
          ellipsis: true,
          align: 'center',
        },
        {
          title: '报价人',
          dataIndex: 'profitsPeopleName',
          width: '11%',
          ellipsis: true,
          align: 'center',
        },
        {
          title: '报价人部门',
          dataIndex: 'profitsPeopleDept',
          width: '11%',
          ellipsis: true,
          align: 'center',
        },
        {
          title: '审批状态',
          dataIndex: 'status',
          width: '11%',
          ellipsis: true,
          align: 'center',
          customRender(text) {
            if (text == 1) {
              return '保存'
            } else if (text == 2) {
              return '已提交'
            } else if (text == 3) {
              return '询价中'
            } else if (text == 4) {
              return '询价完成'
            } else if (text == 5) {
              return '方案不通过'
            } else if (text == 6) {
              return '已选型'
            } else {
              return ''
            }
          },
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          fixed: 'right',
          width: 150,
          scopedSlots: { customRender: 'action' },
        },
      ],
      // columns: [
      //   {
      //     title: '方案编号',
      //     dataIndex: 'schemeCode',
      //     align: 'center',
      //     width: '12%',
      //   },
      //   {
      //     title: '选型人',
      //     dataIndex: 'selectPeopleName',
      //     align: 'center',
      //     width: '12%',
      //   },
      //   {
      //     title: '报价人',
      //     dataIndex: 'profitsPeopleName',
      //     align: 'center',
      //     width: '12%',
      //   },
      //   {
      //     title: '报价部门',
      //     dataIndex: 'profitsDepartment',
      //     align: 'center',
      //     width: '12%',
      //   },
      //   {
      //     title: '报价时间',
      //     dataIndex: 'profitsTime',
      //     align: 'center',
      //     width: '12%',
      //   },
      //   {
      //     title: '总金额',
      //     dataIndex: 'totlePrice',
      //     align: 'center',
      //     width: '12%',
      //   },
      //   {
      //     title: '利润率',
      //     dataIndex: 'profitMargin',
      //     align: 'center',
      //     width: '12%',
      //     customRender(value) {
      //       if (value) {
      //         return `${value}%`
      //       }
      //     },
      //   },
      //   {
      //     title: '状态',
      //     dataIndex: 'status',
      //     align: 'center',
      //     width: '12%',
      //     // 1-待审核，2审核通过，3-审核不通过，4-已选型，5-已报价
      //     customRender: (value) => getDictText('price_status', value),
      //   },
      //   {
      //     title: '操作',
      //     key: 'action',
      //     align: 'center',
      //     width: 80,
      //     scopedSlots: { customRender: 'action' },
      //   },
      // ],
      dataSource: [],
    }
  },
  watch: {
    currnetId: {
      handler(val) {
        this.getProfitsListDetail(val)
      },
      deep: true,
      // immediate: true,
    },
  },
  methods: {
    getProfitsListDetail(projectId) {
      getLibrary({ projectId }).then((res) => {
        if (res.success) {
          this.dataSource = res.result.records
        }
      })
    },
    close() {
      // this.currnetId = ''
      this.dataSource = []
    },
    handleDetail(record) {
      this.$refs.productInfo.detail(record, this.formParams)
      // this.$refs.detailForm.detail(record.id)
      // this.$refs.detailForm.type = 2
      // this.$refs.detailForm.readOnly = true
      // this.$refs.detailForm.disableSubmit = true
      // this.$refs.detailForm.title = '查看详情'
    },
  },
}
</script>

<style lang="less" scoped>
.button {
  margin-top: 15px;
  width: 100%;
  margin-bottom: 20px;
}
</style>
