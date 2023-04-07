<template>
  <a-drawer
    :title="title"
    :maskClosable="true"
    width="1100"
    placement="right"
    :closable="true"
    @close="close"
    :visible="visible"
    style="overflow: auto; padding-bottom: 53px"
  >
    <a-spin tip="加载中..." :spinning="loading">
      <a-form-model ref="ruleForm" :model="formParams" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row>
          <a-col :span="24" class="title">基础信息</a-col>
          <template v-if="this.type !== 0">
            <a-col :span="12">
              <a-form-model-item label="单据编号" prop="code">
                <span>{{ formParams.code }}</span>
              </a-form-model-item>
            </a-col>
          </template>
          <a-col :span="12">
            <a-form-model-item label="发票号码" prop="code">
              <a-input v-model="formParams.code" placeholder="请输入发票号码"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="申请人" prop="applyPeopleId">
              <!-- <a-input v-model="formParams.applyPeopleId" placeholder="请输入申请人" :disabled="disableSubmit" /> -->
              <a-tree-select
                v-model="formParams.applyPeopleId"
                show-search
                style="width: 100%"
                :dropdown-style="{ maxHeight: '500px', overflow: 'auto' }"
                placeholder="请选择"
                allow-clear
                tree-default-expand-all
                tree-node-filter-prop="title"
                @change="handleApplyPeople"
              >
                <a-tree-select-node
                  v-for="item in principalPersonList"
                  :key="item.id"
                  :value="item.id"
                  :title="item.title"
                >
                  <a-tree-select-node
                    v-for="child in item.children"
                    :key="child.id"
                    :value="child.id"
                    :title="child.title"
                    disabled
                  >
                    <a-tree-select-node
                      v-for="userList in child.userList"
                      :key="userList.id"
                      :value="userList.id"
                      :title="userList.realname"
                    >
                    </a-tree-select-node>
                  </a-tree-select-node>
                </a-tree-select-node>
              </a-tree-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="关联客户" prop="customId">
              <j-select-customer
                v-model="formParams.customId"
                :multi="false"
                @change="handelChangeCustomer"
                :disabled="disableSubmit"
              ></j-select-customer>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="关联合同" prop="contractId">
              <a-tag color="#fff4ea" v-for="(item, index) in this.contractList" :key="index">
                <div :style="{ color: '#ff943c' }">
                  {{ item.contractCode }}
                </div>
              </a-tag>
              <a type="primary" @click="handleContract" :style="{ width: '20%' }">选择</a>
              <!-- <a-select
                v-model="formParams.contractId"
                :disabled="disableSubmit"
                placeholder="请选择关联合同"
                mode="multiple"
                @change="handleChangeContract"
              >
                <a-select-option v-for="item in contractList" :key="item.id" :value="item.id">
                  {{ item.contractName }}
                </a-select-option>
              </a-select> -->
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="关联回款类型" prop="type">
              <a-select
                v-model="formParams.type"
                :disabled="disableSubmit"
                placeholder="请选择关联回款类型"
                @change="handleChange"
              >
                <a-select-option :value="1"> 应收款</a-select-option>
                <a-select-option :value="2"> 回款单</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <!---------- 回款单显示 ------------->
          <template v-if="formParams.type == 2">
            <a-col :span="24">
              <a-form-model-item label="回款单" prop="items" :label-col="{ span: 3 }" :wrapper-col="{ span: 17 }">
                <a-tag color="#fff4ea" v-for="item in this.associatedReceivables" :key="item">
                  <div :style="{ color: '#ff943c' }">
                    {{ item }}
                  </div>
                </a-tag>
                <!-- <a-select
                  mode="multiple"
                  v-model="formParams.items"
                  :disabled="disableSubmit"
                  placeholder="请选择回款单"
                  :style="{ width: '80%' }"
                >
                  <a-select-option v-for="item in associatedReceivables" :key="item" :value="item"
                    >{{ item }}
                  </a-select-option>
                </a-select> -->
                <a type="primary" @click="handleItems(2)" :style="{ width: '20%' }">选择</a>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <div class="details" @click="handleExpand" v-if="dataSource.length > 1">
                {{ toggleSearch ? '收起明细' : '展开明细' }}<a-icon :type="toggleSearch ? 'up' : 'down'" />
              </div>
            </a-col>
            <template v-if="dataSource.length > 1 && toggleSearch">
              <a-col :span="24">
                <div class="table">
                  <a-table
                    :columns="columns"
                    :data-source="dataSource"
                    :rowKey="(record) => record.id"
                    bordered
                    size="small"
                    :scroll="{ x: true }"
                    :indentSize="10"
                    :pagination="false"
                  >
                    <template slot="invoiceAmount" slot-scope="text, record">
                      <!-- 开票金额 -->
                      <a-input-number
                        :defaultValue="record.notInvoiceAmount"
                        v-model="record.invoiceAmount"
                        :max="record.notInvoiceAmount"
                        :min="0"
                        placeholder="请输入"
                        :disabled="disableSubmit"
                        :style="{ width: '100%' }"
                      />
                    </template>
                    <template #action="text, record, index">
                      <a @click="handleDelete(record, index)" :style="{ color: 'red' }">删除</a>
                    </template>
                  </a-table>
                </div>
              </a-col>
            </template>
          </template>

          <!-- 应收款显示 -->
          <template v-if="formParams.type == 1">
            <a-col :span="24">
              <a-form-model-item label="应收款" prop="items" :label-col="{ span: 3 }" :wrapper-col="{ span: 17 }">
                <a-tag color="#fff4ea" v-for="item in this.associatedReceivables" :key="item">
                  <div :style="{ color: '#ff943c' }">
                    {{ item }}
                  </div>
                </a-tag>
                <a type="primary" @click="handleItems(1)" :style="{ width: '20%' }">选择</a>
                <!-- <a-select
                  mode="multiple"
                  v-model="formParams.items"
                  :disabled="disableSubmit"
                  placeholder="请选择应收款"
                  :style="{ width: '80%' }"
                >
                  <a-select-option v-for="item in associatedReceivables" :key="item" :value="item"
                    >{{ item }}
                  </a-select-option>
                </a-select> -->
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <div class="details" @click="handleExpand" v-if="dataSource.length > 1">
                {{ toggleSearch ? '收起明细' : '展开明细' }} <a-icon :type="toggleSearch ? 'up' : 'down'" />
              </div>
            </a-col>
            <template v-if="dataSource.length > 1 && toggleSearch">
              <a-col :span="24">
                <div class="table">
                  <a-table
                    :columns="columns"
                    :data-source="dataSource"
                    :rowKey="(record) => record.id"
                    bordered
                    size="small"
                    :scroll="{ x: true }"
                    :indentSize="10"
                    :pagination="false"
                  >
                    <template slot="invoiceAmount" slot-scope="text, record">
                      <!-- 开票金额 -->
                      <a-input-number
                        :defaultValue="record.notInvoiceAmount"
                        v-model="record.invoiceAmount"
                        :max="record.notInvoiceAmount"
                        :min="0"
                        placeholder="请输入"
                        :style="{ width: '100%' }"
                      />
                    </template>
                    <template #action="text, record, index">
                      <a @click="handleDelete(record, index)" :style="{ color: 'red' }">删除</a>
                    </template>
                  </a-table>
                </div>
              </a-col>
            </template>
          </template>

          <a-col :span="12">
            <a-form-model-item label="开票日期" prop="invoiceDate">
              <j-date
                v-model="formParams.invoiceDate"
                :showTime="true"
                dateFormat="YYYY-MM-DD"
                :style="{ width: '100%' }"
                placeholder="请选择开票日期"
                :disabled="disableSubmit"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="开票金额" prop="invoiceAmount">
              <!-- 回款单/应收款数据大于1 就在明细里改 -->
              <template v-if="this.associatedReceivables.length > 1">
                <span>{{ formParams.invoiceAmount }}</span>
              </template>
              <template v-else>
                <a-input-number
                  v-model="formParams.invoiceAmount"
                  :min="0"
                  :max="this.amountTotalInvoice"
                  placeholder="请输入开票金额"
                  :disabled="disableSubmit"
                  :style="{ width: '100%' }"
                />
              </template>
            </a-form-model-item>
          </a-col>

          <a-col :span="24" class="title">扩展信息</a-col>
          <a-col :span="12">
            <a-form-model-item label="发票类型" prop="invoiceType">
              <!-- 1-增值税普通发票，2-增值税专用发票，3-国税通用机打发票，4-地税通用机打发票，5-收据 -->
              <j-dict-select-tag
                v-model="formParams.invoiceType"
                dictCode="invoice_type"
                placeholder="请选择发票类型"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="附件" prop="attachmentUrl" :label-col="{ span: 3 }" :wrapper-col="{ span: 17 }">
              <a-upload
                :action="uploadUrl"
                :multiple="true"
                :file-list="attachmentUrl"
                :headers="headers"
                :disabled="disableSubmit"
                @change="handleUploadChange"
                :remove="handleRemoveImage"
              >
                <a-button v-if="attachmentUrl.length < 9" type="primary" icon="upload" :disabled="disableSubmit"
                  >上传
                </a-button>
              </a-upload>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="备注" prop="remark" :label-col="{ span: 3 }" :wrapper-col="{ span: 17 }">
              <a-textarea v-model="formParams.remark" rows="4" placeholder="请输入备注" />
            </a-form-model-item>
          </a-col>

          <a-col :span="24" class="title">发票信息</a-col>
          <a-col :span="12">
            <a-form-model-item label="抬头类型" prop="titleType">
              <a-select v-model="formParams.titleType" :disabled="disableSubmit" placeholder="请选择抬头类型">
                <a-select-option value="1"> 企业</a-select-option>
                <a-select-option value="2"> 个人</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="发票抬头" prop="titleInvoice">
              <a-input v-model="formParams.titleInvoice" placeholder="请输入发票抬头" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="纳税识别号" prop="taxIdentificationNumber">
              <a-input v-model="formParams.taxIdentificationNumber" placeholder="请输入纳税识别号" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="注册电话" prop="registerPhone">
              <a-input-number
                v-model="formParams.registerPhone"
                placeholder="请输入注册电话"
                :maxLength="11"
                :style="{ width: '100%' }"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="开票地址" prop="invoiceAddress">
              <a-input v-model="formParams.invoiceAddress" placeholder="请输入开票地址" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="开户行" prop="bankOfDeposit">
              <a-input v-model="formParams.bankOfDeposit" placeholder="请输入开户行" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="开户账号" prop="accountNumber">
              <a-input v-model="formParams.accountNumber" placeholder="请输入开户账号" />
            </a-form-model-item>
          </a-col>

          <a-col :span="24" class="title">寄送信息</a-col>
          <a-col :span="12">
            <a-form-model-item label="地址名称" prop="addressName">
              <a-input v-model="formParams.addressName" placeholder="请输入地址名称" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="联系人" prop="contactPerson">
              <a-input v-model="formParams.contactPerson" placeholder="请输入联系人" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="联系电话" prop="contactPhone">
              <a-input-number
                v-model="formParams.contactPhone"
                placeholder="请输入联系电话"
                :maxLength="11"
                :style="{ width: '100%' }"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="邮政编码" prop="postalCode">
              <a-input v-model="formParams.postalCode" placeholder="请输入邮政编码" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="详细地址" prop="fullAddress">
              <a-input v-model="formParams.fullAddress" placeholder="请输入详细地址" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-spin>

    <div class="drawer-bootom-button" v-if="this.type !== 2">
      <a-button @click="close" style="margin-right: 0.8rem">取消</a-button>
      <a-button @click="handleOk" type="primary" :loading="loading">保存</a-button>
    </div>
    <!-- 选择收款 -->
    <SelectReceivableDialog
      ref="selectReceivable"
      selectType="checkbox"
      :contractId="contractIdEcho.toString()"
      :customerId="customerId"
      :modalTitle="modalTitle"
      :columns="columnsReceivab"
      :type="receivabType"
      @select="handleSelectReceivable"
    ></SelectReceivableDialog>
    <!-- 选择合同 -->
    <ContractModel
      ref="selectContract"
      selectType="checkbox"
      :contractId="contractIdEcho"
      :customerId="customerId"
      @select="handleSelectContract"
    ></ContractModel>
  </a-drawer>
</template>

<script>
import { addInvoice, getDetail } from '@/api/fund-management/AddInvoice.js'
import { getContractList, getDepartmentList } from '@/api/fund-management/Collection.js'
import { getReceivableReturnList } from '@/api/fund-management/Refund.js'
// 组件
import JSelectCustomer from '@/views/scrm/modules/JSelectCustomer'
import SelectReceivableDialog from './SelectReceivableDialog'
import ContractModel from './ContractModel'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin'
export default {
  mixins: [TableListMixin],
  components: { JSelectCustomer, SelectReceivableDialog, ContractModel },
  data() {
    return {
      // 开关
      visible: false,
      // 是否禁用
      disableSubmit: false,
      // 标题
      title: '新建销项发票',
      // 当前模式 0-添加 1-编辑 2-详情
      type: 0,
      // 表单配置
      labelCol: { span: 6 },
      wrapperCol: { span: 17 },

      // 表单参数
      formParams: {
        type: 2,
      },
      // 上传地址
      uploadUrl: process.env.VUE_APP_API_BASE_URL + '/sys/common/upload',
      // 上传请求头
      headers: {
        'X-Access-Token': this.$ls.get('Access-Token'),
      },
      attachmentUrl: [], //合同文件上传列表
      pictureTempListImage: [],
      // 表格配置
      columns: [
        {
          title: '关联合同',
          dataIndex: 'contractCode',
          align: 'center',
          width: '33%',
        },
        {
          title: '关联应收',
          dataIndex: 'num',
          align: 'center',
          width: '33%',
        },
        {
          title: '开票金额',
          dataIndex: 'invoiceAmount',
          align: 'center',
          width: '33%',
          scopedSlots: { customRender: 'invoiceAmount' },
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          fixed: 'right',
          width: 200,
          scopedSlots: { customRender: 'action' },
        },
      ],
      columnsReceivab: [],
      receivabType: 2, //1应收/2回款
      disableMixinCreated: true,
      // 表单验证规则
      rules: {
        invoiceAmount: [{ required: true, message: '请输入开票金额', trigger: 'blur' }],
        invoiceDate: [{ required: true, message: '请选择开票日期', trigger: 'change' }],
        applyPeopleId: [{ required: true, message: '请选择申请人', trigger: 'change' }],
        registerPhone: [
          { required: false, message: '请输入注册电话', trigger: 'blur' },
          { validator: this.validateMobile },
        ],
        contactPhone: [
          { required: false, message: '请输入联系电话', trigger: 'blur' },
          { validator: this.validateMobile },
        ],
      },
      // 加载动画开关
      loading: false,
      // 合同列表
      contractList: [],
      principalPersonList: [], // 人员列表
      amountTotalInvoice: 0, //开票总金额
      associatedReceivables: [], //回款单
      customerId: '',
      contractId: '',
      toggleSearch: true, //明细折叠
      collectedTotalAmount: 0,
      newAssociateds: [], //初始表格数据
      associatedId: '',
      modalTitle: '',
      contractIdEcho: '', //回显选择的合同id
    }
  },
  watch: {
    dataSource: {
      handler(val, old) {
        console.log(val)
        // 更改开票总金额
        if (val) {
          this.amountTotalInvoice = val.reduce((p, c) => p + c.invoiceAmount, 0) //*
          this.$set(this.formParams, 'invoiceAmount', this.amountTotalInvoice)
        }
      },
      deep: true,
      // immediate: true,
    },
  },

  methods: {
    validateMobile(rule, value, callback) {
      if (!value || new RegExp(/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/).test(value)) {
        callback()
      } else {
        callback('您的手机号码格式不正确!')
      }
    },
    // 选择应收/回款
    handleItems(type) {
      this.receivabType = type
      if (type == 1) {
        // 应收款
        this.modalTitle = '应收款'
        this.columnsReceivab = [
          {
            title: '编号',
            dataIndex: 'num',
            align: 'center',
            ellipsis: true,
          },
          {
            title: '应收金额',
            dataIndex: 'receivableMoney',
            align: 'center',
            ellipsis: true,
          },
          {
            title: '预计回款日期',
            dataIndex: 'expectPaymentDate',
            align: 'center',
            ellipsis: true,
          },
        ]
      } else {
        // 回款单
        this.modalTitle = '回款单'
        this.columnsReceivab = [
          {
            title: '类型',
            dataIndex: 'type',
            align: 'center',
            ellipsis: true,
            customRender(text) {
              return text == 1 ? '已核销' : '坏账'
            },
          },
          {
            title: '编号',
            dataIndex: 'num',
            align: 'center',
            ellipsis: true,
          },
          {
            title: '回款金额',
            dataIndex: 'returnedMoney',
            align: 'center',
            ellipsis: true,
          },
          {
            title: '核销金额',
            dataIndex: 'amountWrittenOff',
            align: 'center',
            ellipsis: true,
          },
          {
            title: '回款日期',
            dataIndex: 'practicalPaymentDate',
            align: 'center',
            ellipsis: true,
          },
        ]
      }
      this.$refs.selectReceivable.open(this.associatedId, this.dataSource)
    },
    // 接收应收/回款
    handleSelectReceivable(data) {
      console.log(data)
      this.dataSource = data.selectionRows
      console.log(this.dataSource)
      // * 应收/回款列表
      // this.getReceivableList(this.contractIdEcho.toString(), this.customerId, this.receivabType)
      this.associatedReceivables = data.selectionRows.map((item) => item.num)
      this.$set(this.formParams, 'items', this.associatedReceivables)
      this.associatedId = data.selectionRows.map((item) => item.id) //回显id
      // 开票金额
      this.dataSource.map((item, index) => {
        this.$set(this.dataSource[index], 'invoiceAmount', this.dataSource[index].notInvoiceAmount)
      })
      // 开票总金额 应收金额:receivableMoney 回款金额:returnedMoney
      // this.amountTotalInvoice =
      //   receivabType == 1
      //     ? this.dataSource.reduce((p, c) => p + c.receivableMoney, 0)
      //     : this.dataSource.reduce((p, c) => p + c.returnedMoney, 0)
      // this.$set(this.formParams, 'invoiceAmount', this.amountTotalInvoice)
      // console.log(this.amountTotalInvoice);
    },
    // 展开明细
    handleExpand() {
      this.toggleSearch = !this.toggleSearch
    },
    // 客户事件
    handelChangeCustomer(val, rows) {
      console.log(val, rows)
      this.$nextTick(() => {
        this.getContractLists(rows[0].id) //获取合同列表
        this.customerId = rows[0].id //*客户id
      })
      this.associatedReceivables = []
      this.contractList = []
      this.contractIdEcho = ''
      this.dataSource = []
      this.formParams = {
        customId: val,
      }
    },
    // 合同列表partnerBId
    getContractLists(ids) {
      getContractList({ customerId: ids }).then((res) => {
        console.log(res)
        if (res.success) {
          this.contractList = res.result.records
          this.contractIdEcho = res.result.records.map((item) => item.id)
          console.log('合同列表--', this.contractList, '合同id', this.contractIdEcho)
        }
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
    // 已经添加的应收款/回款单
    getReceivableList(contractId, customerId, receivabType = 2) {
      // 1应收款 / 2回款单
      getReceivableReturnList(contractId, customerId, receivabType).then((res) => {
        if (res.success) {
          console.log('已添加的应收款-----', res)
          this.dataSource = res.result
          this.newAssociateds = res.result
          // 开票总金额 应收金额:receivableMoney 回款金额:returnedMoney
          this.amountTotalInvoice = res.result.reduce((p, c) => p + c.notInvoiceAmount, 0)
          this.$set(this.formParams, 'invoiceAmount', this.amountTotalInvoice)
          // 应收款/回款单
          this.associatedReceivables = res.result.map((item) => item.num)
          this.associatedId = res.result.map((item) => item.id) //回显id
          this.$set(this.formParams, 'items', this.associatedReceivables)
          // 开票金额
          this.dataSource.map((item, index) => {
            this.$set(this.dataSource[index], 'invoiceAmount', res.result[index].notInvoiceAmount) //*未开票金额
          })
          // console.log(this.dataSource)
        }
      })
    },
    // 选择合同
    handleContract() {
      this.$refs.selectContract.open(this.contractIdEcho, this.contractList)
    },
    // 接收合同
    handleSelectContract(data) {
      console.log(data)
      this.contractIdEcho = data.selectedRowKeys //回显id
      this.contractList = data.selectionRows //合同数据
      // * 应收/回款列表
      this.getReceivableList(this.contractIdEcho.toString(), this.customerId, this.receivabType)
    },
    // 删除合同
    handleDelete(row, index) {
      this.dataSource.splice(index, 1)
      // 开票总金额
      // this.amountTotalInvoice = this.dataSource.reduce((p, c) => p + c.receivableMoney, 0)
      this.associatedReceivables = this.dataSource.map((item) => item.num) //应收/回款
      this.associatedId = this.dataSource.map((item) => item.id) //应收/回款回显id
      this.amountTotalInvoice = this.dataSource.reduce((p, c) => p + c.notInvoiceAmount, 0)
      this.$set(this.formParams, 'invoiceAmount', this.amountTotalInvoice)
    },
    // 获取部门树形
    getDepartmentList() {
      getDepartmentList().then((res) => {
        if (res.success) {
          this.principalPersonList = res.result
          // console.log(this.principalPersonList)
          // 增加选择管理员
          this.principalPersonList.push({
            title: '管理员',
            realname: '管理员',
            // id: this.principalPersonList[0].userList[0].id
            id: 'e9ca23d68d884d4ebb19d07889727dae',
          })
        }
      })
    },
    // 回款类型事件
    handleChange(val) {
      // this.associatedReceivables = []
      this.formParams.type = val
      this.receivabType = val
      // * 应收/回款列表
      this.getReceivableList(this.contractIdEcho.toString(), this.customerId, val)
      this.formParams.invoiceAmount = 0
      this.formParams.items = []
      this.associatedId = ''
      this.dataSource = []
    },
    // 申请人事件
    handleApplyPeople(value, label) {
      // console.log(value, label)
      this.formParams.applyPeopleId = value
      this.formParams.applyPeopleName = label.toString()
    },
    open(row) {
      this.visible = true
      this.getDepartmentList()
    },
    close() {
      this.visible = false
      // 重置表单
      this.$refs.ruleForm.resetFields()
      this.formParams = {
        type: 2,
      }
      this.attachmentUrl = []
      this.pictureTempListImage = []
      this.amountTotalInvoice = 0
      this.associatedReceivables = []
      this.newAssociateds = []
      this.dataSource = []
      this.customerId = ''
      this.contractId = ''
      this.receivabType = 2
      this.contractIdEcho = ''
      this.contractList = []
    },
    add(record) {
      // 当前为添加模式
      this.type = 0
      console.log(record)
      if (record) {
        this.contractIdEcho = [record.contractId] //回显选中合同id
        // this.getContractLists(`*${record.customerId}*`) //合同列表
        this.getReceivableList(record.contractId, record.customerId, 2) //回款单列表
        this.formParams = {
          customId: record.customerId,
          contractId: record.contractId,
          items: this.associatedReceivables,
          type: 2, //关联回款类型默认回款单
          items: record.num,
          applyPeopleId: this.$store.getters.userInfo.id, //申请人id
          applyPeopleName: this.$store.getters.userInfo.realname, //申请人名字
        }
        this.customerId = record.customerId
        this.contractId = record.contractId
        this.contractList = record.contractCode ? [record] : [] //默认选择的合同
      }
      this.open()
    },
    edit(record) {
      this.type = 1
      // this.getDetail(record.id)
      this.open()
    },
    detail(record) {
      console.log(record)
      this.type = 2
      // this.getDetail(record.id)
      this.open()
    },
    // 获取详情
    getDetail(id) {},
    // 上传文件改变时的状态
    handleUploadChange(info) {
      console.log(info)

      let fileList = [...info.fileList]
      this.attachmentUrl = fileList

      if (info.file.status === 'uploading') {
        return
      }
      if (info.file.status === 'done') {
        let a = fileList[fileList.length - 1]
        this.pictureTempListImage.push({
          uid: a.uid,
          status: 'done',
          name: a.name,
          url: a.response.message,
        })

        this.attachmentUrl = this.pictureTempListImage
        const data = this.attachmentUrl.map((item) => item.url).toString()
        this.formParams.attachmentUrl = data
      }
    },
    // 移除
    handleRemoveImage(file) {
      this.pictureTempListImage.splice(this.pictureTempListImage.indexOf(file), 1)
    },
    //提交
    handleOk() {
      console.log(this.dataSource)
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let itemsInfo =
            this.dataSource.length > 1
              ? this.dataSource.map((item) => {
                  return {
                    itemNum: item.num,
                    itemInvoiceAmount: item.invoiceAmount,
                    itemContract: item.contractCode,
                  }
                })
              : this.dataSource.map((item) => {
                  return {
                    itemNum: item.num,
                    itemInvoiceAmount: this.formParams.invoiceAmount,
                    itemContract: item.contractCode,
                  }
                })
          let data = {
            ...this.formParams,
            items: this.formParams.items.toString(),
            itemsInfo: itemsInfo,
            type: this.formParams.type,
          }
          console.log('提交的数据', data)
          addInvoice(data).then((res) => {
            if (res.success) {
              this.$message.success(res.message)
              this.$emit('refresh')
              this.close()
            } else {
              this.$message.warning(res.message)
            }
            return res
          })
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
.details {
  color: #e65b07;
  margin: 0 0 10px 40px;
  cursor: pointer;
}
.table {
  margin-bottom: 20px;
}
</style>
