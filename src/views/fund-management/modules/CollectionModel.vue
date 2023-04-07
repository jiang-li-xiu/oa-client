<template>
  <a-drawer
    :title="title"
    :maskClosable="true"
    width="900"
    placement="right"
    :closable="true"
    @close="close"
    :visible="visible"
    style="overflow: auto; padding-bottom: 53px"
  >
    <a-spin tip="加载中..." :spinning="loading">
      <a-form-model ref="ruleForm" :model="formParams" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="关联客户" prop="customerId">
              <j-select-customer
                v-model="formParams.customerId"
                :multi="false"
                @change="handelChangeCustomer"
                :disabled="disableSubmit"
              ></j-select-customer>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="关联合同" prop="contractId">
              <a-select
                v-model="formParams.contractId"
                :disabled="disableSubmit || !formParams.customerId"
                placeholder="请选择关联合同"
                @change="handleChangeContract"
                show-search
                option-filter-prop="children"
                :filter-option="filterOption"
              >
                <a-select-option v-for="item in contractList" :key="item.id" :value="item.id">
                  {{ item.contract }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="添加应收款" prop="aaa">
              <a-dropdown :disabled="this.receivables <= 0 || !formParams.customerId || !formParams.contractId">
                <a-menu slot="overlay" @click="handleChangeReceivables">
                  <a-menu-item key="1">添加应收款</a-menu-item>
                  <a-menu-item key="2">批量添加应收款 </a-menu-item>
                </a-menu>
                <a-button> 请选择 <a-icon type="down" /> </a-button>
              </a-dropdown>
              <span v-if="this.totalAmount">
                （合同金额：{{ this.totalAmount }}，可添加金额：{{ receivable(this.dataSource) }}）
              </span>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <template>
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
                <template #action="text, record, index">
                  <!-- 已收款状态下的数据不可编辑 -->
                  <template>
                    <a @click="handleEdit(record, index)" :disabled="record.status == 2">编辑</a>
                  </template>
                  <!-- 回款状态为未收款时才可以删除 -->
                  <template>
                    <a-divider type="vertical" />
                    <a @click="batchDel(record, index)" :disabled="record.status !== 1">删除 </a>
                  </template>
                </template>
              </a-table>
            </template>
          </a-col>
        </a-row>
      </a-form-model>
    </a-spin>

    <div class="drawer-bootom-button" v-if="this.type !== 2">
      <a-button @click="close" style="margin-right: 0.8rem">取消</a-button>
      <a-button @click="handleOk" type="primary" :loading="loading">保存</a-button>
    </div>

    <!-- 添加应收款 -->
    <collection-add-received
      ref="modalForm"
      @addCollection="addCollection"
      @editCollection="editCollection"
      :receivables="receivables"
      :totalAmount="this.totalAmount"
    ></collection-add-received>
    <!-- 批量新增应收款 -->
    <collection-batch-received
      ref="receiveBatchForm"
      @addBatchCollection="addBatchCollection"
      :receivables="receivables"
    ></collection-batch-received>
  </a-drawer>
</template>

<script>
import {
  getContractList,
  addReceivable,
  editReceivable,
  deleteReceivable,
  getReceivableList,
  addReceivablebatch,
} from '@/api/fund-management/Collection.js'
// 组件
import JSelectCustomer from '@/views/scrm/modules/JSelectCustomer'
import CollectionAddReceived from './CollectionAddReceived'
import CollectionBatchReceived from './CollectionBatchReceived'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin'
//导入过滤对象中为空的属性、防抖方法
import { filterObj } from '@/utils/util'
import { getAction } from '@/api/manage'
import { getDictText } from '@/api/api.js'
export default {
  mixins: [TableListMixin],
  components: { JSelectCustomer, CollectionAddReceived, CollectionBatchReceived },
  data() {
    return {
      // 开关
      visible: false,
      // 是否禁用
      disableSubmit: false,
      // 标题
      title: '新增应收款',
      // 当前模式 0-添加 1-编辑 2-详情
      type: 0,
      // 表单配置
      labelCol: { span: 4 },
      wrapperCol: { span: 17 },

      // 表单参数
      formParams: {},
      // 表格配置
      columns: [
        {
          title: '编号',
          dataIndex: 'num',
          align: 'center',
          width: '16%',
          ellipsis: true,
        },
        {
          title: '应收金额',
          dataIndex: 'receivableMoney',
          align: 'center',
          width: '16%',
          ellipsis: true,
        },
        {
          title: '回款状态',
          dataIndex: 'status',
          align: 'center',
          width: '16%',
          ellipsis: true,
          // 1-未收款，2-已收款，3-部分收款，4-已坏账，5-部分坏账，6-已红冲
          customRender: (value) => getDictText('payment_collection_status', value),
        },
        {
          title: '预计回款日期',
          dataIndex: 'expectPaymentDate',
          align: 'center',
          width: '16%',
          ellipsis: true,
        },
        {
          title: '回款类型',
          dataIndex: 'receivableStatus',
          align: 'center',
          width: '16%',
          ellipsis: true,
          customRender: (value) => getDictText('payment_collection_type', value),
        },
        {
          title: '备注',
          dataIndex: 'remark',
          align: 'center',
          width: '16%',
          ellipsis: true,
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          // fixed: 'right',
          width: 100,
          scopedSlots: { customRender: 'action' },
        },
      ],
      disableMixinCreated: true,
      // 表单验证规则
      rules: {
        customerId: [{ required: true, message: '请选择关联客户', trigger: 'change' }],
        contractId: [{ required: true, message: '请选择关联合同', trigger: 'change' }],
      },
      // 加载动画开关
      loading: false,
      // 合同列表
      contractList: [],
      // 合同金额
      totalAmount: 0,
      receivables: this.totalAmount,
      contractId: '',
      customerId: '',
    }
  },

  computed: {
    receivable() {
      return (row) => {
        let data = row.reduce((p, c) => p + Number(c.receivableMoney), 0)
        console.log(data)
        this.receivables = this.totalAmount - Number(data)
        return this.totalAmount - Number(data)
      }
    },
  },

  methods: {
    // 客户事件
    handelChangeCustomer(val, rows) {
      console.log(val, rows)
      this.$nextTick(() => {
        this.getContractLists(`*${rows[0].id}*`) //获取合同列表
        this.customerId = rows[0].id //*客户id
      })
    },
    // 关联合同事件
    handleChangeContract(val) {
      let data = this.contractList.filter((item) => item.id == val)
      console.log('关联合同', data)
      this.totalAmount = data[0].totalAmount //合同金额
      this.contractId = data[0].id //*合同id
      this.getReceivableList(this.contractId, this.customerId)
    },
    // 合同列表 partnerBId
    getContractLists(ids) {
      getContractList({ customerId: ids }).then((res) => {
        console.log(res)
        if (res.success) {
          this.contractList = res.result.records
        }
      })
    },

    // 已经添加的应收款
    getReceivableList(contractId, customerId) {
      getReceivableList(contractId, customerId).then((res) => {
        if (res.success) {
          console.log('应收款-----', res)
          this.dataSource = res.result.records
        }
      })
    },
    // 添加应收款
    handleChangeReceivables(item) {
      console.log(item)
      if (item.key == 1) {
        this.$refs.modalForm.add()
      } else if (item.key == 2) {
        this.$refs.receiveBatchForm.add()
      }
    },
    // 接收添加的应收款
    addCollection(data) {
      console.log(data)
      this.dataSource.push(...data)
    },
    // 接收编辑的应收款
    editCollection(data, index) {
      console.log(data, index)
      if (data && data[0].id) {
        // 编辑的请求
        editReceivable({
          expectPaymentDate: data[0].expectPaymentDate,
          receivableStatus: data[0].receivableStatus,
          remark: data[0].remark,
          chargePeople: data[0].chargePeople.toString(),
          synergyPeople: data[0].synergyPeople.toString(),
          id: data[0].id,
        }).then((res) => {
          if (res.success) {
            this.$message.success(res.message)
            this.dataSource.splice(index, 1, data[0])
          } else {
            this.$message.error(res.message)
            return false
          }
        })
      } else {
        this.dataSource[index] = data[0]
        this.dataSource = JSON.parse(JSON.stringify(this.dataSource))
      }
    },
    handleEdit(record, index) {
      this.$refs.modalForm.edit(record, index)
      this.$refs.modalForm.title = '编辑'
    },
    // 接收批量添加的应收款
    addBatchCollection(data) {
      console.log('批量添加', data)
      this.dataSource.push(...data)
    },
    // 删除
    batchDel(row, index) {
      if (row.id) {
        deleteReceivable(row.id).then((res) => {
          if (res.success) {
            this.$message.success(res.message)
            this.dataSource.splice(index, 1)
          } else {
            this.$message.warning(res.message)
          }
        })
      } else {
        this.dataSource.splice(index, 1)
      }
    },

    open(row) {
      this.visible = true
    },
    close() {
      this.visible = false
      // 重置表单
      this.$refs.ruleForm.resetFields()
      this.formParams = {}
      this.dataSource = []
      this.contractList = []
      this.totalAmount = 0
      this.receivable = 0
      this.receivables = 0
    },
    add() {
      // 当前为添加模式
      this.type = 0
      this.open()
    },
    edit(record) {
      this.type = 1
      this.open()
    },
    detail(record) {
      console.log(record)
      this.type = 2
      this.open()
    },

    filterOption(input, option) {
      return option.componentOptions.children[0].children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },

    //提交
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // 判断当前模式
          if (this.type === 0) {
            let data = this.dataSource.map((item) => {
              return {
                ...item,
                synergyPeople: item.synergyPeople.toString(),
                chargePeople: item.chargePeople.toString(),
                customerId: this.formParams.customerId,
                contractId: this.formParams.contractId,
              }
            })
            console.log('提交', data)
            addReceivable(data).then((res) => {
              if (res.success) {
                this.$message.success('成功')
                this.$emit('refresh')
                this.close()
              } else {
                this.$message.warning(res.message)
              }
              return res
            })
          } else {
            // 编辑
          }
        } else {
          return false
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
.title {
  background-color: #f8faff;
  padding: 10px;
  margin-bottom: 10px;
  font-weight: 600;
}
.button {
  margin-top: 15px;
  width: 100%;
  margin-bottom: 20px;
}
</style>
