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
      <a-form-model ref="ruleForm" :model="formParams" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="回款单号" prop="num">
              <span>{{ formParams.num }}</span>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="关联合同" prop="contractCode">
              <span>{{ formParams.contractCode }}</span>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="回款金额" prop="returnedMoney">
              <span>{{ formParams.returnedMoney }}</span>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="归属人" prop="belongers">
              <span>{{ formParams.belongers }}</span>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="回款日期" prop="practicalPaymentDate">
              <span>{{ formParams.practicalPaymentDate }}</span>
            </a-form-model-item>
          </a-col>
        </a-row>

        <a-row>
          <!-- 基础信息 -->
          <a-tabs default-active-key="1" @change="handleChange" :activeKey="activeKey">
            <a-tab-pane key="1" tab="基础信息">
              <a-col :span="24" class="title">基础信息</a-col>
              <a-col :span="8">
                <a-form-model-item label="编号" prop="num">
                  <span>{{ formParams.num }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item
                  label="回款金额"
                  prop="returnedMoney"
                  :label-col="{ span: 2 }"
                  :wrapper-col="{ span: 17 }"
                >
                  <span>{{ formParams.returnedMoney }}</span>
                  <a-table
                    :columns="columns"
                    :data-source="formParams.returnedAssociateds"
                    :rowKey="(record) => record.id"
                    bordered
                    size="middle"
                    :scroll="{ x: true }"
                    :indentSize="10"
                    :pagination="false"
                  >
                  </a-table>
                </a-form-model-item>
              </a-col>

              <a-col :span="8">
                <a-form-model-item label="核销金额" prop="amountWrittenOff">
                  <span>{{ formParams.amountWrittenOff }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="开票金额" prop="invoiceAmount">
                  <span>{{ formParams.invoiceAmount }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="类型" prop="type">
                  <span>{{ formParams.type == 1 ? '已核销' : '坏账' }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="归属人" prop="belongers">
                  <span>{{ formParams.belongers }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="支付方式" prop="paymentType">
                  <span>{{ getDictText('pay_methos', formParams.paymentType) }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="回款日期" prop="practicalPaymentDate">
                  <span>{{ formParams.practicalPaymentDate }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="关联客户" prop="customerName">
                  <a-tag color="#fff4ea">
                    <div :style="{ color: '#ff943c' }">
                      {{ formParams.customerName }}
                    </div>
                  </a-tag>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="关联合同" prop="contractCode">
                  <a-tag color="#fff4ea" v-for="item in this.contractCode" :key="item">
                    <div :style="{ color: '#ff943c' }">
                      {{ item }}
                    </div>
                  </a-tag>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="关联应收" prop="receivableNums">
                  <a-tag color="#fff4ea" v-for="item in this.receivableNums" :key="item">
                    <div :style="{ color: '#ff943c' }">
                      {{ item }}
                    </div>
                  </a-tag>
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item label="备注" prop="remark" :label-col="{ span: 2 }" :wrapper-col="{ span: 17 }">
                  <span>{{ formParams.remark }}</span>
                </a-form-model-item>
              </a-col>

              <a-col :span="24" class="title">扩展信息</a-col>
              <a-col :span="8">
                <a-form-model-item label="创建人" prop="peopleName">
                  <span>{{ formParams.createBy }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="创建时间" prop="createTime">
                  <span>{{ formParams.createTime }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="更新时间" prop="updateTime">
                  <span>{{ formParams.updateTime }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="负责人" prop="chargePeople">
                  <span>{{ formParams.chargePeople }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="协同人" prop="synergyPeople">
                  <span>{{ formParams.synergyPeople }}</span>
                </a-form-model-item>
              </a-col>

              <a-col :span="24">
                <a-form-model-item
                  label="附件"
                  prop="accessoryUrl"
                  :label-col="{ span: 2 }"
                  :wrapper-col="{ span: 17 }"
                >
                  <a-upload
                    :action="uploadUrl"
                    :multiple="true"
                    :file-list="accessoryUrl"
                    :headers="headers"
                    :disabled="disableSubmit"
                  >
                  </a-upload>
                </a-form-model-item>
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

            <!-- 开票历史 -->
            <a-tab-pane key="3" tab="开票历史" force-render>
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
      </a-form-model>
    </a-spin>

    <SelectUserByDeppModal
      ref="selectUser"
      :modalWidth="1200"
      :multi="true"
      @ok="handleSelectUser"
    ></SelectUserByDeppModal>
    <!-- 查看开票历史详情 -->
    <InvoiceDetail ref="invoiceDetail"></InvoiceDetail>
  </a-drawer>
</template>

<script>
import { getContractList, getInvoiceHistory } from '@/api/fund-management/Collection.js'
import { getDetail, putReturnedMoney } from '@/api/fund-management/Refund.js'
// 组件
import JSelectCustomer from '@/views/scrm/modules/JSelectCustomer'
import SelectUserByDeppModal from './SelectUserByDeppModal.vue'
import InvoiceDetail from './InvoiceDetail'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin'
import { getDictText } from '@/api/api.js'
export default {
  mixins: [TableListMixin],
  components: { JSelectCustomer, SelectUserByDeppModal, InvoiceDetail },
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
      // 上传地址
      uploadUrl: process.env.VUE_APP_API_BASE_URL + '/sys/common/upload',
      // 上传请求头
      headers: {
        'X-Access-Token': this.$ls.get('Access-Token'),
      },
      accessoryUrl: [], //合同文件上传列表
      pictureTempListImage: [],
      // 表格配置
      columns: [
        {
          title: '关联合同',
          dataIndex: 'contractCode',
          align: 'center',
          width: '14%',
        },
        {
          title: '关联应收',
          dataIndex: 'receivableNum',
          align: 'center',
          width: '14%',
        },
        {
          title: '回款金额',
          dataIndex: 'returnedMoney',
          align: 'center',
          width: '14%',
        },
        {
          title: '归属人',
          dataIndex: 'belonger',
          align: 'center',
          width: '14%',
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
      dataSourceHistory: [],
      activeKey: '1',
      disableMixinCreated: true,
      // 表单验证规则
      rules: {
        supplierName: [{ required: true, message: '请输入供应商名称', trigger: 'change' }],
      },
      // 加载动画开关
      loading: false,
      // 合同列表
      contractList: [],
      chargePeople: [], //负责人
      synergyPeople: [], //协同人
      currnetRow: [],
      receivableNums: [],
      contractCode: [],
      currnetId: '',
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
    // 查看开票历史详情
    handleInvoiceDetail(record) {
      this.$refs.invoiceDetail.open(record)
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
        this.getInvoiceHistory(this.currnetRow.num)
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
      this.accessoryUrl = []
      this.pictureTempListImage = []
      this.chargePeople = []
      this.synergyPeople = []
      this.receivableNums = []
      this.contractCode = []
      this.currnetRow = []
      this.activeKey = '1'
      this.syn = []
      this.char = []
      this.currnetId = ''
    },
    detail(record) {
      console.log(record)
      this.currnetId = record.id
      this.currnetRow = record
      this.type = 2
      this.getDetail(record.id)
      this.open()
    },

    // 获取详情
    getDetail(id) {
      getDetail(id).then((res) => {
        if (res.success) {
          this.formParams = res.result
          this.chargePeople = res.result.chargePeople ? res.result.chargePeople.split(',') : []
          this.synergyPeople = res.result.synergyPeople ? res.result.synergyPeople.split(',') : []
          let accessoryUrl = res.result.accessoryUrl ? res.result.accessoryUrl : []
          this.receivableNums = res.result.receivableNums ? res.result.receivableNums.split(',') : []
          this.contractCode = res.result.contractCode ? res.result.contractCode.split(',') : []
          this.syn = res.result.synergyPeople ? res.result.synergyPeople.split(',') : [] //*用来禁用协同人/负责人
          this.char = res.result.chargePeople ? res.result.chargePeople.split(',') : [] //*用来禁用协同人/负责人
          this.accessoryUrl = accessoryUrl.map((item, index) => {
            console.log(item)
            return {
              uid: item.uid,
              status: 'done',
              name: item.name,
              url: item.url,
            }
          })
          this.pictureTempListImage = this.accessoryUrl
        }
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
        putReturnedMoney({ id: this.currnetId, chargePeople: newChargePeople.toString() }).then((res) => {
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
        putReturnedMoney({ id: this.currnetId, synergyPeople: newSynergyPeople.toString() }).then((res) => {
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
      // console.log(type)
      this.peopleType = type
      this.$refs.selectUser.showModal(type == 1 ? this.syn : this.char)
    },
    handleSelectUser(data) {
      // console.log(data)
      if (this.peopleType == 1) {
        let people = [
          ...[this.formParams.chargePeople].filter((item) => item && item.trim()),
          ...[data[0].realname],
        ].toString()
        this.syn = people
        console.log(people)
        putReturnedMoney({ id: this.currnetId, chargePeople: people }).then((res) => {
          if (res.success) {
            this.$message.success(res.message)
            this.chargePeople.push(data[0].realname)
            this.getDetail(this.currnetId)
          } else {
            return false
          }
        })
      } else {
        let people = [
          ...[this.formParams.synergyPeople].filter((item) => item && item.trim()),
          ...[data[0].realname],
        ].toString()
        this.char = people
        putReturnedMoney({ id: this.currnetId, synergyPeople: people }).then((res) => {
          if (res.success) {
            this.$message.success(res.message)
            this.synergyPeople.push(data[0].realname)
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
  margin-bottom: 10px;
  font-weight: 600;
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
</style>
