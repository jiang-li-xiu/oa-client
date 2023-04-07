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
          <a-col :span="24" class="title">基础信息</a-col>
          <template v-if="this.num">
            <a-col :span="24">
              <a-form-model-item label="编号" prop="num">
                <span>{{ this.nums }}</span>
              </a-form-model-item>
            </a-col>
          </template>
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
                @change="handleChangeContract"
              >
                <a-select-option v-for="item in contractList" :key="item.id" :value="item.id">
                  {{ item.contractName }}
                </a-select-option>
              </a-select> -->
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="关联应收款" prop="receivableNums">
              <a-tag color="#fff4ea" v-for="item in this.associatedReceivables" :key="item">
                <div :style="{ color: '#ff943c' }">
                  {{ item }}
                </div>
              </a-tag>
              <a type="primary" @click="handleItems(1)" :style="{ width: '20%' }">选择</a>
              <!-- <a-select
                mode="multiple"
                v-model="formParams.receivableNums"
                :disabled="disableSubmit"
                placeholder="请选择关联应收款"
                @change="handleReceivableNums"
              >
                <a-select-option v-for="item in associatedReceivables" :key="item" :value="item"
                  >{{ item }}
                </a-select-option>
              </a-select> -->
            </a-form-model-item>
          </a-col>

          <a-col :span="24">
            <a-form-model-item label="回款金额" prop="returnedMoney">
              <!-- 关联应收款大于1不能改这个金额 -->
              <template v-if="this.associatedReceivables.length > 1">
                <span>{{ formParams.returnedMoney }}</span>
              </template>
              <template v-else>
                <a-input-number
                  v-model="formParams.returnedMoney"
                  :min="0"
                  :max="this.collectedTotalAmount"
                  placeholder="请输入回款金额"
                  :disabled="disableSubmit"
                  :style="{ width: '100%' }"
                />
              </template>
            </a-form-model-item>
          </a-col>

          <div class="details" @click="handleExpand" v-if="associatedReceivables.length > 1">
            {{ toggleSearch ? '收起明细' : '展开明细' }} <a-icon :type="toggleSearch ? 'up' : 'down'" />
          </div>
          <template v-if="associatedReceivables.length > 1 && toggleSearch">
            <a-col :span="24">
              <a-form-model ref="tableformRef" :model="form">
                <div class="table">
                  <a-table
                    :columns="columns"
                    :data-source="form.dataSource"
                    :rowKey="(record) => record.id"
                    bordered
                    size="small"
                    :scroll="{ x: true }"
                    :indentSize="10"
                    :pagination="false"
                  >
                    <template slot="returnedMoney" slot-scope="text, record, index">
                      <a-form-model-item
                        :prop="'dataSource.' + index + '.returnedMoney'"
                        :rules="rulesdata.returnedMoney"
                      >
                        <a-input-number
                          :defaultValue="record.notReceiptMoney"
                          v-model="record.returnedMoney"
                          :max="record.notReceiptMoney"
                          :min="0"
                          placeholder="请输入"
                          :disabled="disableSubmit"
                          :style="{ width: '100%' }"
                        />
                      </a-form-model-item>
                    </template>

                    <template slot="belonger" slot-scope="text, record, index">
                      <a-form-model-item :prop="'dataSource.' + index + '.belonger'" :rules="rulesdata.belonger">
                        <a-select
                          mode="multiple"
                          v-model="record.belonger"
                          disabled
                          placeholder="请选择"
                          :style="{ width: '70%' }"
                        >
                          <a-select-option v-for="(item, index) in form.dataSource" :key="index" :value="item.belonger"
                            >{{ item.belonger }}
                          </a-select-option>
                        </a-select>
                        <a @click="handleAddPeople(record, index)">选择人员</a>
                      </a-form-model-item>
                    </template>
                  </a-table>
                </div>
              </a-form-model>
            </a-col>
          </template>

          <a-col :span="24">
            <a-form-model-item label="归属人" prop="belongers">
              <a-tree-select
                v-model="formParams.belongers"
                show-search
                style="width: 100%"
                :dropdown-style="{ maxHeight: '500px', overflow: 'auto' }"
                placeholder="请选择"
                allow-clear
                tree-default-expand-all
                tree-node-filter-prop="title"
                multiple
                :disabled="!formParams.receivableNums && associatedReceivables.length >= 1"
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
                      :value="userList.realname"
                      :title="userList.realname"
                    >
                    </a-tree-select-node>
                  </a-tree-select-node>
                </a-tree-select-node>
              </a-tree-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="收款日期" prop="practicalPaymentDate">
              <j-date
                v-model="formParams.practicalPaymentDate"
                :showTime="true"
                dateFormat="YYYY-MM-DD"
                :style="{ width: '100%' }"
                placeholder="请选择收款日期"
                :disabled="disableSubmit"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="收款账户" prop="paymentAccount">
              <a-select
                v-model="formParams.paymentAccount"
                disabled
                placeholder="请选择收款账户"
                @change="handleChangeContract"
              >
                <a-select-option v-for="item in contractList" :key="item.id" :value="item.id">
                  {{ item.contractName }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="支付方式" prop="paymentType">
              <j-dict-select-tag v-model="formParams.paymentType" dictCode="pay_methos" placeholder="请选择支付方式" />
            </a-form-model-item>
          </a-col>

          <a-col :span="24" class="title">扩展信息</a-col>
          <a-col :span="24">
            <a-form-model-item label="备注" prop="remark">
              <a-textarea v-model="formParams.remark" rows="4" placeholder="请输入备注" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="附件" prop="accessoryUrl">
              <a-upload
                :action="uploadUrl"
                :multiple="true"
                :file-list="accessoryUrl"
                :headers="headers"
                :disabled="disableSubmit"
                @change="handleUploadChange"
                :remove="handleRemoveImage"
              >
                <a-button v-if="accessoryUrl.length < 9" type="primary" icon="upload" :disabled="disableSubmit"
                  >上传
                </a-button>
                <div class="tip">注意：最多上传9份</div>
              </a-upload>
            </a-form-model-item>
          </a-col>

          <a-col :span="24">
            <a-form-model-item label="负责人" prop="chargePeople">
              <a-tree-select
                v-model="formParams.chargePeople"
                show-search
                style="width: 100%"
                :dropdown-style="{ maxHeight: '500px', overflow: 'auto' }"
                placeholder="请选择"
                allow-clear
                tree-default-expand-all
                tree-node-filter-prop="title"
                multiple
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
                      :value="userList.realname"
                      :title="userList.realname"
                    >
                    </a-tree-select-node>
                  </a-tree-select-node>
                </a-tree-select-node>
              </a-tree-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="协同人" prop="synergyPeople">
              <a-tree-select
                v-model="formParams.synergyPeople"
                show-search
                style="width: 100%"
                :dropdown-style="{ maxHeight: '500px', overflow: 'auto' }"
                placeholder="请选择"
                allow-clear
                tree-default-expand-all
                tree-node-filter-prop="title"
                multiple
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
                      :value="userList.realname"
                      :title="userList.realname"
                    >
                    </a-tree-select-node>
                  </a-tree-select-node>
                </a-tree-select-node>
              </a-tree-select>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-spin>

    <div class="drawer-bootom-button" v-if="this.type !== 2">
      <a-button @click="close" style="margin-right: 0.8rem">取消</a-button>
      <a-button @click="handleOk" type="primary" :loading="loading">保存</a-button>
    </div>
    <!-- 添加人员 -->
    <SelectUserByDeppModal ref="selectUser" :modalWidth="1200" @ok="handleSelectUser"></SelectUserByDeppModal>
    <!-- 归属人员 -->
    <SelectUserByDeppModal
      ref="selectBelonger"
      :modalWidth="1200"
      :multi="true"
      @ok="handleSelectBelonger"
    ></SelectUserByDeppModal>
    <!-- 选择应收 -->
    <SelectReceivableDialog
      ref="selectReceivable"
      selectType="checkbox"
      :contractId="contractIdEcho.toString()"
      :customerId="customerId"
      modalTitle="应收款"
      listUrl="/prodReceivable/return/list"
      :is_type="false"
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
import { getContractList, getDepartmentList } from '@/api/fund-management/Collection.js'
import { addReturnedMoney, getDetail, getReceivableList } from '@/api/fund-management/Refund.js'
// 组件
import JSelectCustomer from '@/views/scrm/modules/JSelectCustomer'
import SelectUserByDeppModal from './SelectUserByDeppModal.vue'
import SelectReceivableDialog from './SelectReceivableDialog'
import ContractModel from './ContractModel'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin'
// 数组对象去重
import { uniqBy, uniq } from 'lodash'
export default {
  mixins: [TableListMixin],
  components: { JSelectCustomer, SelectUserByDeppModal, SelectReceivableDialog, ContractModel },
  props: {
    // 是否有编号
    num: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // 开关
      visible: false,
      // 是否禁用
      disableSubmit: false,
      // 标题
      title: '新增回款单',
      // 当前模式 0-添加 1-编辑 2-详情
      type: 0,
      // 表单配置
      labelCol: { span: 4 },
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
          dataIndex: 'num',
          align: 'center',
          width: '14%',
        },
        {
          title: '回款金额',
          dataIndex: 'returnedMoney',
          align: 'center',
          width: '14%',
          scopedSlots: { customRender: 'returnedMoney' },
        },
        {
          title: '归属人',
          dataIndex: 'belonger',
          align: 'center',
          width: '14%',
          scopedSlots: { customRender: 'belonger' },
        },
        // {
        //   title: '编号',
        //   dataIndex: 'num',
        //   align: 'center',
        //   ellipsis: true,
        // },
        // {
        //   title: '应收金额',
        //   dataIndex: 'receivableMoney',
        //   align: 'center',
        //   ellipsis: true,
        // },
        // {
        //   title: '预计回款日期',
        //   dataIndex: 'expectPaymentDate',
        //   align: 'center',
        //   ellipsis: true,
        // },
      ],
      disableMixinCreated: true,
      // 表单验证规则
      rules: {
        customerId: [{ required: true, message: '请选择关联客户', trigger: 'change' }],
        contractId: [{ required: true, message: '请选择关联合同', trigger: 'change' }],
        returnedMoney: [{ required: true, message: '请输入回款金额', trigger: 'blur' }],
        belongers: [{ required: true, message: '请选择归属人', trigger: 'change' }],
        practicalPaymentDate: [{ required: true, message: '请选择收款日期', trigger: 'change' }],
        chargePeople: [{ required: true, message: '请选择负责人', trigger: 'change' }],
      },
      form: {
        dataSource: [],
      },
      rulesdata: {
        returnedMoney: [{ required: true, message: '请输入', trigger: 'blur' }],
        belongers: [{ required: true, message: '请选择', trigger: 'change' }],
      },
      // 加载动画开关
      loading: false,
      // 合同列表
      contractList: [],
      principalPersonList: [], // 人员列表
      customerId: '',
      contractId: '',
      associatedId: '',
      contractIdEcho: '', //回显选择的合同id
      associatedReceivables: [], //应收款
      associated: '',
      collectedTotalAmount: 0, //回款总金额
      dataSourceIndex: '',
      belongers: [],
      nums: '', //编号
      receivableType: '', //1-已核销，2-坏账
      toggleSearch: true, //明细折叠
      currentRecord: {},
    }
  },
  watch: {
    'form.dataSource': {
      handler(val, old) {
        // console.log('改变了datasource!!!!!!!', val, '当前应收', this.associatedReceivables)
        // if (old?.[0]?.num && old?.[0]?.num.toString() == this.associatedReceivables) {
        if (val.length > 1) {
          //多条应收款 回款总额=多条应收填写的总额
          this.collectedTotalAmount = val.reduce((p, c) => p + c.returnedMoney, 0) //*填写金额
          this.$set(this.formParams, 'returnedMoney', this.collectedTotalAmount)
        } else {
          // 只关联一条应收款时 更改回款总金额 =未收金额
          this.collectedTotalAmount = val.reduce((p, c) => p + c.notReceiptMoney, 0) //*未收金额
          this.$set(this.formParams, 'returnedMoney', this.collectedTotalAmount)
        }
        // 归属人
        let belongers = val.map((item) => {
          return item.belonger
        })
        this.$set(this.formParams, 'belongers', uniq(belongers))
      },
      deep: true,
      // immediate: true,
    },
  },

  methods: {
    // 展开明细
    handleExpand() {
      this.toggleSearch = !this.toggleSearch
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
    // 客户事件
    handelChangeCustomer(val, rows) {
      console.log(val, rows)
      this.$nextTick(() => {
        this.getContractLists(`*${rows[0].id}*`) //获取合同列表
        this.customerId = rows[0].id //*客户id
      })
      // 改变客户其他内容清空
      // this.formParams.contractId = undefined
      // this.formParams.receivableNums = undefined
      this.associatedReceivables = []
      this.contractList = []
      this.form.dataSource = []
      this.associatedId = ''
      this.formParams = {
        customerId: val,
      }
    },
    // 合同列表 partnerBId
    getContractLists(ids) {
      getContractList({ customerId: ids }).then((res) => {
        console.log(res)
        if (res.success) {
          let filterData = res.result.records.filter((item) => item.id == this.currentRecord.contractId) //当前合同的应收款
          console.log(filterData)
          this.contractIdEcho = filterData.map((item) => item.id)
          this.contractList = filterData
          this.$set(this.formParams, 'contractId', this.contractIdEcho.toString())
          console.log('合同列表--', this.contractList, '合同id', this.contractIdEcho)
        }
      })
    },
    // 关联合同事件
    handleChangeContract(val) {
      // let data = this.contractList.filter((item) => item.id == val)
      // console.log('关联合同', data)
      // this.totalAmount = data[0].totalAmount //合同金额
      // this.contractId = data[0].id //*合同id
      // this.getReceivableList(this.contractId, this.customerId)
      // // 负责人
      // this.$set(this.formParams, 'chargePeople', data[0].principalPersonName)
    },
    // 已经添加的应收款
    getReceivableList(contractId, customerId) {
      getReceivableList(contractId, customerId).then((res) => {
        if (res.success) {
          console.log('应收款-----', res)
          let filterData = res.result.filter((item) => item.id == this.currentRecord.id) //当前编号的应收款
          this.form.dataSource = filterData
          this.associatedId = filterData.map((item) => item.id) //回显id
          // 回款总金额
          this.collectedTotalAmount = filterData.reduce((p, c) => p + c.notReceiptMoney, 0) //*未收金额
          this.$set(this.formParams, 'returnedMoney', this.collectedTotalAmount)
          // 关联应收款
          this.associatedReceivables = this.form.dataSource.map((item) => item.num)
          // console.log(this.associatedReceivables)
          this.$set(this.formParams, 'receivableNums', this.associatedReceivables)
          // 明细的回款金额、归属人
          this.form.dataSource.map((item, index) => {
            this.$set(this.form.dataSource[index], 'returnedMoney', res.result[index].notReceiptMoney)
            this.$set(this.form.dataSource[index], 'belonger', res.result[index].chargePeople)
          })

          console.log(this.form.dataSource)
          // 归属人
          let belongers = this.form.dataSource.map((item) => {
            return item.belonger
          })
          this.$set(this.formParams, 'belongers', uniq(belongers))
          // console.log(this.formParams.belongers)
        }
      })
    },
    // 关联应收款事件
    handleReceivableNums(data) {
      console.log(data)
      // this.dataSource.filter((item) => item.num == data.toString())
    },
    // 添加人员
    handleAddPeople(record, index) {
      this.dataSourceIndex = index
      this.$refs.selectUser.showModal()
    },
    // 接收人员
    handleSelectUser(data) {
      console.log(data)
      this.$nextTick(() => {
        this.$set(this.form.dataSource[this.dataSourceIndex], 'belonger', data[0].realname)
      })
      console.log(this.form.dataSource)
    },
    // 选择归属人
    handleAddBelonger() {
      this.$refs.selectBelonger.showModal()
    },
    // 接收归属人
    handleSelectBelonger(data) {
      console.log(data)
      this.$set(this.formParams, 'belongers', data[0].realname)
      console.log(this.formParams)
    },
    // 选择关联应收
    handleItems() {
      this.$refs.selectReceivable.open(this.associatedId, this.form.dataSource)
    },
    // 接收应收
    handleSelectReceivable(data) {
      console.log(data)
      this.form.dataSource = data.selectionRows

      this.associatedReceivables = data.selectionRows.map((item) => item.num)
      this.$set(this.formParams, 'receivableNums', this.associatedReceivables)

      // this.$nextTick(() => {
      //   this.getReceivableList(this.contractIdEcho.toString(), this.customerId)
      // })

      this.$nextTick(() => {
        // 回款金额
        this.collectedTotalAmount = data.selectionRows.reduce((p, c) => p + c.notReceiptMoney, 0) //*未收金额
        this.$set(this.formParams, 'returnedMoney', this.collectedTotalAmount)
        // 归属人
        let belongers = data.selectionRows.map((item) => {
          return item.chargePeople
        })
        this.$set(this.formParams, 'belongers', uniq(belongers))
        // 回款金额、归属人
        this.form.dataSource.map((item, index) => {
          this.$set(this.form.dataSource[index], 'returnedMoney', data.selectionRows[index].notReceiptMoney)
          this.$set(this.form.dataSource[index], 'belonger', data.selectionRows[index].chargePeople)
        })
      })

      this.associatedId = data.selectionRows.map((item) => item.id) //回显id
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
      this.$set(this.formParams, 'contractId', data.selectedRowKeys.toString()) //合同id
      // * 应收/回款列表
      this.getReceivableList(this.contractIdEcho.toString(), this.customerId)
    },
    open(row) {
      this.visible = true
      this.getDepartmentList()
    },
    close() {
      this.visible = false
      // 重置表单
      this.$refs.ruleForm.resetFields()
      this.formParams = {}
      this.accessoryUrl = []
      this.pictureTempListImage = []
      this.associatedReceivables = []
      this.collectedTotalAmount = 0
      this.nums = ''
      this.receivableType = ''
      this.customerId = ''
      this.contractId = ''
      this.contractIdEcho = ''
      this.contractList = []
      this.currentRecord = {}
    },
    // type 1-已核销，2-坏账
    add(record, type) {
      this.currentRecord = record
      // 当前为添加模式
      this.type = 0
      if (type == 2) {
        this.title = '新建坏账'
      } else {
        this.title = '新建回款单'
      }
      this.receivableType = type
      if (record) {
        // this.contractIdEcho = [record.contractId] //回显选中合同id
        this.nums = record.num
        this.getContractLists(`*${record.customerId}*`) //合同列表
        this.getReceivableList(record.contractId, record.customerId) //应收款列表
        this.formParams = {
          customerId: record.customerId,
          contractId: record.contractId,
          receivableNums: record.num,
          chargePeople: record.chargePeople,
          returnedMoney: record.notReceiptMoney,
        }
        this.customerId = record.customerId
        this.contractId = record.contractId
      }
      this.open()
    },
    edit(record) {
      this.type = 1
      this.getDetail(record.id)
      this.open()
    },
    detail(record) {
      this.type = 2
      this.getDetail(record.id)
      this.open()
    },
    // 获取详情
    getDetail(id) {
      getDetail(id).then((res) => {
        if (res.success) {
          this.formParams = res.result
          let accessoryUrl = res.result.accessoryUrl ? res.result.accessoryUrl : []
          this.accessoryUrl = accessoryUrl.map((item, index) => {
            return {
              uid: item.uid,
              status: 'done',
              name: item.name,
              url: item.url,
            }
          })
          this.pictureTempListImage = res.result.accessoryUrl
        }
      })
    },
    // 上传文件改变时的状态
    handleUploadChange(info) {
      let fileList = [...info.fileList]
      this.accessoryUrl = fileList

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

        this.accessoryUrl = this.pictureTempListImage
        // const data = this.accessoryUrl.map((item) => item.url).toString()
        this.formParams.accessoryUrl = this.accessoryUrl
        console.log(this.formParams.accessoryUrl)
      }
    },
    // 移除
    handleRemoveImage(file) {
      this.pictureTempListImage.splice(this.pictureTempListImage.indexOf(file), 1)
    },
    //提交
    handleOk() {
      console.log('提交的数据', this.formParams, this.form.dataSource)
      this.$refs.ruleForm.validate(async (valid) => {
        let returnedAssociateds =
          this.form.dataSource.length > 1
            ? this.form.dataSource.map((item) => {
                return {
                  returnedMoney: item.returnedMoney,
                  receivableId: item.id,
                  receivableNum: item.num,
                  belonger: item.belonger,
                }
              })
            : this.form.dataSource.map((item) => {
                return {
                  returnedMoney: this.formParams.returnedMoney,
                  receivableId: item.id,
                  receivableNum: item.num,
                  belonger: item.belonger,
                }
              })
        let data = {
          ...this.formParams,
          type: this.receivableType,
          chargePeople: this.formParams.chargePeople ? this.formParams.chargePeople.toString() : '',
          belongers: this.formParams.belongers ? this.formParams.belongers.toString() : '',
          receivableNums: this.formParams.receivableNums ? this.formParams.receivableNums.toString() : '',
          synergyPeople: this.formParams.synergyPeople ? this.formParams.synergyPeople.toString() : '',
          returnedAssociateds: returnedAssociateds,
        }
        console.log('数据', data)
        if (valid) {
          this.$refs.tableformRef
            ? this.$refs.tableformRef.validate(async (valid) => {
                if (valid) {
                  addReturnedMoney(data).then((res) => {
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
            : addReturnedMoney(data).then((res) => {
                if (res.success) {
                  this.$message.success(res.message)
                  this.$emit('refresh')
                  this.close()
                } else {
                  this.$message.warning(res.message)
                }
                return res
              })
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
.table {
  margin-bottom: 10px;
}
.details {
  color: #e65b07;
  margin: 0 0 10px 130px;
  cursor: pointer;
}
.tip {
  color: rgb(244, 8, 8);
  margin-top: 5px;
}
</style>
