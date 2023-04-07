<template>
  <a-card :bordered="false" class="assembly-container-col">
    <div class="table">
      <a-table
        :columns="columns"
        rowKey="id"
        :data-source="dataSourcePurchase"
        bordered
        :scroll="{ x: true }"
        :loading="loading"
      >
        <template slot="action" slot-scope="text, record">
          <template v-if="![2, 3].includes(record.status)">
            <a slot="action" href="javascript:;" @click="handleApproval(record)">审批</a>
            <a-divider type="vertical" />
          </template>
          <a slot="action" href="javascript:;" @click="handleDetail(record)">详情</a>
        </template>
      </a-table>
    </div>

    <!-- 采购单信息详情弹窗 -->
    <PurchaseOrderDetail ref="modalForm"></PurchaseOrderDetail>
    <!-- /审批信息弹窗 -->
    <approval-dialog ref="approvalFrom" :type="4"></approval-dialog>
  </a-card>
</template>

<script>
// 采购审批
import { postProcurementApproval } from '@/api/procurement/ProcurementList.js'
// 组件
import ApprovalDialog from '@/components/ApprovalDialog'
import PurchaseOrderDetail from './PurchaseOrderDetail.vue' //采购单里面的详情
// API
import { getDictText } from '@/api/api.js'

export default {
  components: { PurchaseOrderDetail, ApprovalDialog },
  props: {
    // 采购单表格数据
    dataSourcePurchase: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      // 查询参数
      param: {},
      loading: false,
      disableMixinCreated: true,
      columns: [
        {
          title: '采购部门',
          dataIndex: 'purchaseDepartment',
          width: '14%',
          align: 'center',
        },
        {
          title: '采购人',
          dataIndex: 'purchasePeople',
          width: '14%',
          align: 'center',
        },
        {
          title: '填报时间',
          dataIndex: 'createTime',
          width: '14%',
          align: 'center',
        },
        {
          title: '紧急程度',
          dataIndex: 'degree',
          width: '14%',
          align: 'center',
          // 1-紧急，2-一般
          customRender(text) {
            return text == 1 ? '紧急' : '一般'
          },
        },
        {
          title: '采购类别',
          dataIndex: 'type',
          width: '14%',
          align: 'center',
          customRender: (value) => getDictText('procurement_categories', value),
        },
        {
          title: '到位时间',
          dataIndex: 'inPlaceTime',
          width: '14%',
          align: 'center',
        },
        {
          title: '状态',
          dataIndex: 'status',
          width: '14%',
          align: 'center',
          // 1-待审核，2-审核中，3-审核通过，4-审核不通过
          customRender(text) {
            return text == 1 ? '待审核' : text == 2 ? '审核中' : text == 3 ? '审核通过' : '审核不通过'
          },
        },
        {
          title: '操作',
          dataIndex: 'action',
          fixed: 'right',
          align: 'center',
          width: 150,
          scopedSlots: { customRender: 'action' },
        },
      ],
    }
  },

  methods: {
    // 查看详情：列表单行查看详情
    handleDetail(record) {
      console.log('详情-------')
      this.$refs.modalForm.detail(record)
      this.$refs.modalForm.title = '详情'
      this.$refs.modalForm.disableSubmit = true
    },

    // 审批弹窗
    handleApproval(record) {
      // 审批的id
      // this.$refs.approvalFrom.open(record.id)

      let data = {
        applicat: this.$store.getters.userInfo.realname, //当前申请人
        department: this.$store.getters.userInfo.orgCodeTxt, //当前申请人所在部门
        details: record.id,
      }
      // 采购审批接口
      postProcurementApproval(this.$store.getters.userInfo.realname, data).then((res) => {
        if (res.success) {
          this.$message.success(res.message)
          this.$emit('refreshClose')
        } else {
          this.$message.error(res.message)
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
.assembly-container-col {
  // min-height: calc(100vh - 135px);
  background-color: #fff;
}
::v-deep .ant-table td {
  white-space: nowrap;
}
</style>
