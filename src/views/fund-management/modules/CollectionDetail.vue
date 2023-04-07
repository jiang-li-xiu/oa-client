<template>
  <a-drawer
    :title="title"
    :maskClosable="true"
    width="70%"
    placement="right"
    :closable="true"
    @close="close"
    :visible="visible"
    style="overflow: auto; padding-bottom: 53px"
  >
    <a-spin tip="加载中..." :spinning="loading">
      <a-row>
        <a-col :span="8" class="content">
          应收款单号:<span>{{ formParams.num }}</span>
        </a-col>
        <a-col :span="8" class="content">
          关联合同: <span>{{ formParams.contractCode }}</span>
        </a-col>
        <a-col :span="8" class="content">
          关联客户:<span>{{ formParams.customName }}</span>
        </a-col>
        <a-col :span="8" class="content">
          负责人:<span>{{ formParams.chargePeople }}</span>
        </a-col>
        <a-col :span="8" class="content">
          预计回款日期: <span>{{ formParams.expectPaymentDate }}</span>
        </a-col>
      </a-row>

      <a-row>
        <!-- 基础信息 -->
        <a-tabs default-active-key="1" @change="handleChange" :activeKey="activeKey">
          <a-tab-pane key="1" tab="基础信息">
            <a-col :span="24" class="title">基础信息</a-col>
            <a-col :span="8" class="content">
              编号: <span>{{ formParams.num }}</span>
            </a-col>
            <a-col :span="8" class="content">
              应收金额: <span>{{ formParams.receivableMoney }}</span>
            </a-col>
            <a-col :span="8" class="content">
              实收金额:<span>{{ formParams.actualReceiptMoney }}</span>
            </a-col>
            <a-col :span="8" class="content">
              未收金额:<span>{{ formParams.notReceiptMoney }}</span>
            </a-col>
            <a-col :span="8" class="content">
              坏账金额: <span>{{ formParams.badDebts }}</span>
            </a-col>
            <a-col :span="8" class="content">
              <!-- 1-未收款，2-已收款，3-部分收款，4-已坏账，5-部分坏账，6-已红冲 -->
              回款状态: <span>{{ getDictText('payment_collection_status', formParams.status) }}</span>
            </a-col>
            <a-col :span="8" class="content">
              应收生成日期: <span>{{ formParams.generateTime }}</span>
            </a-col>
            <a-col :span="8" class="content">
              应收账期:<span>{{ formParams.receivablePaymentDate }}</span>
            </a-col>
            <a-col :span="8" class="content">
              预计回款日期: <span>{{ formParams.expectPaymentDate }}</span>
            </a-col>
            <a-col :span="8" class="content">
              关联客户:
              <a-tag color="#fff4ea">
                <div :style="{ color: '#ff943c' }">
                  {{ formParams.customName }}
                </div>
              </a-tag>
            </a-col>
            <a-col :span="12" class="content">
              关联合同:
              <a-tag a-tag color="#fff4ea" v-for="item in this.contractCode" :key="item">
                <div :style="{ color: '#ff943c' }">
                  {{ item }}
                </div>
              </a-tag>
            </a-col>
            <a-col :span="8" class="content">
              <!-- 1-常规，2-预收款，3-尾款，4-保证金 -->
              回款类型: <span>{{ getDictText('payment_collection_type', formParams.receivableStatus) }}</span>
            </a-col>
            <a-col :span="8" class="content">
              实际回款日期: <span>{{ formParams.practicalPaymentDate || '-' }}</span>
            </a-col>
            <a-col :span="8" class="content">
              开票金额: <span>{{ formParams.invoiceAmount }}</span>
            </a-col>
            <a-col :span="24" class="content">
              备注:<span>{{ formParams.remark }}</span>
            </a-col>

            <a-col :span="24" class="title">扩展信息</a-col>
            <a-col :span="8" class="content">
              创建人: <span>{{ formParams.createByName }}</span>
            </a-col>
            <a-col :span="8" class="content">
              创建时间: <span>{{ formParams.createTime }}</span>
            </a-col>
            <a-col :span="8" class="content">
              更新时间: <span>{{ formParams.updateTime }}</span>
            </a-col>
            <a-col :span="8" class="content">
              负责人:<span>{{ formParams.chargePeople }}</span>
            </a-col>
            <a-col :span="8" class="content">
              协同人: <span>{{ formParams.synergyPeople }}</span>
            </a-col>
          </a-tab-pane>

          <!-- 负责团队 -->
          <a-tab-pane key="2" tab="负责团队" force-render>
            <a-col :span="24" class="title">团队负责人</a-col>
            <a-col :span="6" v-for="item in this.chargePeople" :key="item" :value="item">
              <div class="charge_people">
                <div class="left">{{ item.substr(-1) }}</div>
                <div class="rigth">
                  <div class="name">{{ item }}</div>
                  <div class="type">@负责人</div>
                </div>
                <a-icon type="delete" class="icon" @click="handleDeletePeople(1, item)" />
              </div>
            </a-col>
            <a-col :span="6">
              <div class="charge_add" @click="handleAddPeople(1)">+ 负责人</div>
            </a-col>
            <a-col :span="24" class="title">团队协同人 </a-col>
            <a-col :span="6" v-for="(item, index) in this.synergyPeople" :key="index" :value="item">
              <div class="charge_people">
                <div class="left">{{ item.substr(-1) }}</div>
                <div class="rigth">
                  <div class="name">{{ item }}</div>
                  <div class="type">@协同人</div>
                </div>
                <a-icon type="delete" class="icon" @click="handleDeletePeople(2, item)" />
              </div>
            </a-col>
            <a-col :span="6">
              <div class="charge_add" @click="handleAddPeople(2)">+ 协同人</div>
            </a-col>
          </a-tab-pane>

          <!-- 回款单 -->
          <a-tab-pane key="3" tab="回款单" force-render>
            <a-col :span="24" class="title amount"
              >实收金额:{{ this.actualReceiptMoney }} 元, 未收金额:{{ this.notReceiptMoney }} 元</a-col
            >
            <a-col :span="24">
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
                <template #num="text, record">
                  <a @click="handleReturnDetail(record)">{{ text }}</a>
                </template>
              </a-table>
            </a-col>
          </a-tab-pane>

          <!-- 开票历史 -->
          <a-tab-pane key="4" tab="开票历史" force-render>
            <a-col :span="24">
              <a-col :span="24">
                <a-table
                  :columns="columnsHistory"
                  :data-source="dataSourceHistory"
                  bordered
                  size="small"
                  rowKey="id"
                  :scroll="{ x: true }"
                  :indentSize="10"
                  :pagination="false"
                >
                  <template #num="text, record">
                    <a @click="handleInvoiceDetail(record)">{{ text }}</a>
                  </template>
                </a-table>
              </a-col>
            </a-col>
          </a-tab-pane>
        </a-tabs>
      </a-row>
    </a-spin>

    <SelectUserByDeppModal
      ref="selectUser"
      :modalWidth="1200"
      :multi="true"
      @ok="handleSelectUser"
    ></SelectUserByDeppModal>
    <!-- 查看开票历史详情 -->
    <InvoiceDetail ref="invoiceDetail"></InvoiceDetail>
    <!-- 回款单详情 -->
    <RefundDetail ref="returnDetail"></RefundDetail>
  </a-drawer>
</template>

<script>
import {
  getContractList,
  getDetail,
  putReceivable,
  getInvoiceHistory,
  getInvoiceDetail,
  getReturnList,
} from '@/api/fund-management/Collection.js'
// 组件
import JSelectCustomer from '@/views/scrm/modules/JSelectCustomer'
import SelectUserByDeppModal from './SelectUserByDeppModal'
import InvoiceDetail from './InvoiceDetail'
import RefundDetail from './RefundDetail'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin'
import { getDictText } from '@/api/api.js'
export default {
  mixins: [TableListMixin],
  components: { JSelectCustomer, SelectUserByDeppModal, InvoiceDetail,RefundDetail },
  data() {
    return {
      // 开关
      visible: false,
      // 是否禁用
      disableSubmit: false,
      // 标题
      title: '新增发票',
      // 当前模式 0-添加 1-编辑 2-详情
      type: 0,
      // 表单配置
      labelCol: { span: 6 },
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
          scopedSlots: { customRender: 'num' },
        },
        {
          title: '类型',
          dataIndex: 'type',
          align: 'center',
          width: '16%',
          customRender(text) {
            return text == 1 ? '已核销' : text == 2 ? '坏账' : ''
          },
        },
        {
          title: '回款金额',
          dataIndex: 'returnedMoney',
          align: 'center',
          width: '16%',
        },
        {
          title: '核销金额',
          dataIndex: 'amountWrittenOff',
          align: 'center',
          width: '16%',
        },
        {
          title: '归属人',
          dataIndex: 'belongers',
          align: 'center',
          width: '16%',
          scopedSlots: { customRender: 'belongers' },
        },
        {
          title: '回款日期',
          dataIndex: 'practicalPaymentDate',
          align: 'center',
          width: '16%',
        },
      ],
      // 开票历史
      columnsHistory: [
        {
          title: '编号',
          dataIndex: 'num',
          align: 'center',
          width: '33%',
          scopedSlots: { customRender: 'num' },
        },
        {
          title: '开票金额',
          dataIndex: 'invoiceAmount',
          align: 'center',
          width: '33%',
        },
        {
          title: '开票时间',
          dataIndex: 'invoiceDate',
          align: 'center',
          width: '33%',
        },
      ],
      dataSourceHistory: [{ num: '110' }],
      disableMixinCreated: true,
      activeKey: '1',
      // 表单验证规则
      rules: {
        supplierName: [{ required: true, message: '请输入供应商名称', trigger: 'change' }],
      },
      // 加载动画开关
      loading: false,
      // 合同列表
      contractList: [],
      dataSource: [
        {
          code: '1',
        },
      ],
      chargePeople: [], //负责人
      synergyPeople: [], //协同人
      peopleType: '',
      currnetId: '',
      currnetRow: [],
      contractCode: [],
      actualReceiptMoney: 0,
      notReceiptMoney: 0,
      syn: [],
      char: [],
    }
  },

  methods: {
    getDictText,
    // 客户事件
    handelChangeCustomer(val, rows) {
      console.log(val, rows)
      this.$nextTick(() => {
        this.getContractLists(rows[0].id) //获取合同列表
      })
    },
    // 合同列表
    getContractLists(ids) {
      getContractList({ id: ids }).then((res) => {
        console.log(res)
        if (res.success) {
          this.contractList = res.result.records
        }
      })
    },
    // 开票历史
    getInvoiceHistory(item) {
      getInvoiceHistory(item).then((res) => {
        // console.log(res)
        this.dataSourceHistory = res.result.records
      })
    },
    // 切换tab
    handleChange(key) {
      this.activeKey = key
      if (key == 3) {
        let row = this.currnetRow
        this.getReturnList(row.id)
      }
      if (key == 4) {
        this.getInvoiceHistory(this.currnetRow.num)
      }
    },
    // 查看开票历史详情
    handleInvoiceDetail(record) {
      this.$refs.invoiceDetail.open(record)
    },
    // 查看回款单详情
    handleReturnDetail(record) {
      console.log(record);
      this.$refs.returnDetail.detail(record)
      this.$refs.returnDetail.title = '回款详情'
    },
    // 回款单详情
    getReturnList(id) {
      getReturnList({ id }).then((res) => {
        if (res.success) {
          this.dataSource = res.result.returnedMoneys
          this.actualReceiptMoney = res.result.actualReceiptMoney
          this.notReceiptMoney = res.result.notReceiptMoney
        }
      })
    },
    close() {
      this.visible = false
      this.formParams = {}
      this.peopleType = ''
      this.chargePeople = []
      this.synergyPeople = []
      this.contractCode = []
      this.currnetRow = []
      this.syn = []
      this.char = []
      this.activeKey = '1'
      this.currnetId = ''
      this.actualReceiptMoney = 0
      this.notReceiptMoney = 0
      this.actualReceiptMoney = 0
    },
    detail(record) {
      console.log(record)
      this.type = 2
      this.currnetId = record.id
      this.currnetRow = record
      this.getDetail(record.id)
      this.visible = true
    },
    // 获取详情
    getDetail(id) {
      this.loading = true
      getDetail(id)
        .then((res) => {
          if (res.success) {
            this.formParams = res.result
            this.chargePeople = res.result.chargePeople ? res.result.chargePeople.split(',') : []
            this.synergyPeople = res.result.synergyPeople ? res.result.synergyPeople.split(',') : []
            this.contractCode = res.result.contractCode ? res.result.contractCode.split(',') : []
            this.syn = res.result.synergyPeople ? res.result.synergyPeople.split(',') : [] //*用来禁用协同人/负责人
            this.char = res.result.chargePeople ? res.result.chargePeople.split(',') : [] //*用来禁用协同人/负责人
          } else {
            return false
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleChangeContract() {},
    // 删除负责/协同人
    handleDeletePeople(type, name) {
      console.log(type, name)
      if (type == 1) {
        // 删负责人
        let newChargePeople = this.chargePeople
          .map((item) => {
            if (item !== name) {
              return item
            }
          })
          .filter((item2) => item2 !== undefined)
        putReceivable({ id: this.currnetId, chargePeople: newChargePeople.toString() }).then((res) => {
          if (res.success) {
            this.$message.success(res.message)
            this.chargePeople = newChargePeople
            this.getDetail(this.currnetId)
          } else {
            return false
          }
        })
      } else {
        // 删协同人
        let newSynergyPeople = this.synergyPeople
          .map((item) => {
            if (item !== name) {
              return item
            }
          })
          .filter((item2) => item2 !== undefined)
        putReceivable({ id: this.currnetId, synergyPeople: newSynergyPeople.toString() }).then((res) => {
          if (res.success) {
            this.$message.success(res.message)
            this.synergyPeople = newSynergyPeople
            this.getDetail(this.currnetId)
          } else {
            return false
          }
        })
      }
    },
    // 添加负责/协同人
    handleAddPeople(type) {
      this.peopleType = type
      this.$refs.selectUser.showModal(type == 1 ? this.syn : this.char)
    },
    handleSelectUser(data) {
      let realname = data.map((item) => {
        return item.realname
      })
      // console.log(realname)
      if (this.peopleType == 1) {
        let people = [...[this.formParams.chargePeople].filter((item) => item && item.trim()), ...[realname]].toString()
        this.syn = people
        // console.log(people)
        putReceivable({ id: this.currnetId, chargePeople: people }).then((res) => {
          if (res.success) {
            this.$message.success(res.message)
            this.chargePeople.push(...realname)
            // console.log(this.chargePeople)
            this.getDetail(this.currnetId)
          } else {
            return false
          }
        })
      } else {
        let people = [
          ...[this.formParams.synergyPeople].filter((item) => item && item.trim()),
          ...[realname],
        ].toString()
        this.char = people
        putReceivable({ id: this.currnetId, synergyPeople: people }).then((res) => {
          if (res.success) {
            this.$message.success(res.message)
            this.synergyPeople.push(...realname)
            // console.log(this.synergyPeople)
            this.getDetail(this.currnetId)
          } else {
            return false
          }
        })
      }
    },
  },
}
</script>

<style lang="less" scoped>
.title {
  background-color: #f8faff;
  padding: 10px;
  margin: 20px 0;
  font-weight: 600;
}
.content {
  padding: 0 20px;
  margin: 20px 0;
}
.charge_people {
  display: flex;
  flex-direction: row;
  padding: 10px;
  margin: 10px;
  width: 180px;
  height: 80px;
  border-radius: 5px;
  border: 2px solid #f3f5f5;
  .left {
    width: 60px;
    height: 60px;
    color: #f8faff;
    text-align: center;
    line-height: 60px;
    border-radius: 5px;
    background-color: #6bb5ce;
    margin-right: 6px;
  }
  .rigth {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .name {
      font-size: 16px;
      font-weight: 600;
    }
    .type {
      color: #ff8c2e;
    }
  }
  .icon {
    margin-left: 10px;
  }

  &:hover {
    border: 2px solid #ff8c2e;
  }
}
.charge_add {
  box-sizing: border-box;
  color: #ff8c2e;
  text-align: center;
  margin: 10px;
  width: 180px;
  height: 80px;
  line-height: 80px;
  border-radius: 5px;
  border: 2px solid #f3f5f5;
  &:hover {
    border: 2px solid #ff8c2e;
  }
}

.amount {
  color: #ff8c2e;
}
</style>
