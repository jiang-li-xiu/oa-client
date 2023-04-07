<template>
  <a-drawer
    :title="title"
    :maskClosable="true"
    width="80%"
    placement="right"
    :closable="true"
    @close="close"
    :visible="visible"
    style="overflow: auto; padding-bottom: 53px"
  >
    <a-spin tip="加载中.." :spinning="loading">
      <a-form-model ref="ruleForm" :model="formParams" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <j-form-container :disabled="disableSubmit">
          <a-row slot="detail">
            <a-col :span="24" class="title">合同详情</a-col>
            <a-col :span="24">
              <a-form-model-item
                label="关联客户"
                prop="customerId"
                :label-col="{ span: 2 }"
                :wrapper-col="{ span: 21 }"
              >
                <j-select-customer v-model="formParams.customerId" :multi="false" @change="handelChangeCustomer">
                </j-select-customer>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="关联项目" prop="projectId" :label-col="{ span: 2 }" :wrapper-col="{ span: 21 }">
                <j-select-project
                  v-model="formParams.projectId"
                  :multi="false"
                  @change="handelChange"
                ></j-select-project>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item
                label="关联供应商"
                prop="supplierId"
                :label-col="{ span: 2 }"
                :wrapper-col="{ span: 21 }"
              >
                <a-input-search
                  v-model="formParams.supplierName"
                  placeholder="请选择供应商"
                  @search="onSearch"
                  readOnly
                >
                  <a-button slot="enterButton">选择供应商</a-button>
                </a-input-search>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="合同名称" prop="contract" :label-col="{ span: 2 }" :wrapper-col="{ span: 21 }">
                <a-input v-model="formParams.contract" placeholder="请输入合同名称" />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="合同类型" prop="contractType">
                <j-dict-select-tag
                  v-model="formParams.contractType"
                  dictCode="contract_type"
                  placeholder="请选择合同类型"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="甲方（需方）" prop="partnerA">
                <a-input v-model="formParams.partnerA" placeholder="请输入甲方名称" />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="乙方（供方）" prop="partnerB">
                <a-input v-model="formParams.partnerB" placeholder="请输入乙方名称" />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="甲方负责人" prop="partnerAPerson">
                <a-input v-model="formParams.partnerAPerson" placeholder="请输入甲方负责人" />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="乙方负责人" prop="partnerBPerson">
                <a-input v-model="formParams.partnerBPerson" placeholder="请输入乙方负责人" />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="甲方联系方式" prop="partnerAPhone">
                <a-input v-model="formParams.partnerAPhone" placeholder="请输入甲方联系方式" :maxLength="11" />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="乙方联系方式" prop="partnerBPhone">
                <a-input v-model="formParams.partnerBPhone" placeholder="请输入乙方联系方式" :maxLength="11" />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="收款人" prop="payee">
                <a-input v-model="formParams.payee" placeholder="请输入收款人" />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="开户银行" prop="bank">
                <a-input v-model="formParams.bank" placeholder="请输入开户银行" />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="银行账号" prop="bankAccount">
                <a-input
                  v-model="formParams.bankAccount"
                  placeholder="请输入银行账号"
                  :style="{ width: '100%' }"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="结算方式" prop="settlementType">
                <a-input v-model="formParams.settlementType" placeholder="请输入结算方式" />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="合同总金额" prop="totalAmount">
                <a-input-number
                  v-model="formParams.totalAmount"
                  placeholder="请输入合同总金额"
                  :style="{ width: '100%' }"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="付款期数" prop="payCycle">
                <a-input-number v-model="formParams.payCycle" placeholder="请输入付款期数" :style="{ width: '100%' }" />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="开票信息" prop="ticketInfo">
                <a-input v-model="formParams.ticketInfo" placeholder="请输入开票信息" />
              </a-form-model-item>
            </a-col>

            <a-col :span="8">
              <a-form-model-item label="开票情况" prop="ticketSituation">
                <a-select v-model="formParams.ticketSituation" placeholder="请选择开票情况">
                  <a-select-option :value="1">专票 </a-select-option>
                  <a-select-option :value="2">普票 </a-select-option>
                  <a-select-option :value="3">13%税点（含运费） </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item
                label="发货是否随附发货清单"
                prop="withList"
                :label-col="{ span: 10 }"
                :wrapper-col="{ span: 12 }"
              >
                <a-select v-model="formParams.withList" placeholder="请选择发货是否随附发货清单">
                  <a-select-option :value="1">是 </a-select-option>
                  <a-select-option :value="0">否 </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="是否主合同" prop="isMainContract">
                <a-select v-model="formParams.isMainContract" placeholder="请选择是否主合同">
                  <a-select-option :value="1">是 </a-select-option>
                  <a-select-option :value="0">否 </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="主合同" prop="mainContractId">
                <a-select v-model="formParams.mainContractId" placeholder="请选择主合同" allowClear>
                  <a-select-option v-for="item in contractList" :key="item.id" :value="item.id">
                    {{ item.contract }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="合同文件" prop="fileUrl" :label-col="{ span: 2 }" :wrapper-col="{ span: 17 }">
                <a-upload
                  :action="uploadUrl"
                  :multiple="true"
                  :file-list="fileUrl"
                  :headers="headers"
                  :disabled="disableSubmit"
                  @change="handleUploadChange"
                  @download="downloadFile"
                  @preview="handlePreview"
                  :showUploadList="{
                    showRemoveIcon: true,
                    showDownloadIcon: true,
                  }"
                >
                  <a v-if="fileUrl.length < 1" type="primary" icon="upload">上传文件 </a>
                </a-upload>
              </a-form-model-item>
            </a-col>
          </a-row>
        </j-form-container>
        <a-row>
          <a-col :span="24">
            <a-form-model-item
              label="合同摘要"
              prop="abstractInfo"
              :label-col="{ span: 2 }"
              :wrapper-col="{ span: 21 }"
            >
              <a-textarea
                v-model="formParams.abstractInfo"
                placeholder="请输入合同摘要"
                :rows="3"
                :read-only="disableSubmit"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item
              label="违约条款"
              prop="breachClause"
              :label-col="{ span: 2 }"
              :wrapper-col="{ span: 21 }"
            >
              <a-textarea
                v-model="formParams.breachClause"
                placeholder="请输入违约条款"
                :rows="4"
                :read-only="disableSubmit"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="备注" prop="remark" :label-col="{ span: 2 }" :wrapper-col="{ span: 21 }">
              <a-textarea v-model="formParams.remark" placeholder="请输入备注" :rows="5" :read-only="disableSubmit" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-spin>
    <div class="drawer-bootom-button">
      <a-button
        key="back"
        type="primary"
        @click="handleFile()"
        style="margin-right: 0.8rem"
        :disabled="this.currnetRow.entrepotStatus !== 0"
        >合同归档
      </a-button>
      <a-button @click="close" style="margin-right: 0.8rem">取消</a-button>
    </div>

    <SelectSupplierList
      ref="SelectSupplier"
      @select="handleSelectSupplier"
      modalTitle="关联供应商"
      listUrl="/prodSupplier/list"
      :columns="columnsSupplier"
      type=""
      :slotParams="slotParams"
    >
      <template #default>
        <a-form-model-item label="供应商名称" prop="supplier">
          <j-input v-model="slotParams.supplier" placeholder="请输入供应商名称"></j-input>
        </a-form-model-item>
      </template>
    </SelectSupplierList>
    <j-file-dialog-preview-modal ref="modalForm"></j-file-dialog-preview-modal>
  </a-drawer>
</template>

<script>
import { getContractList, getDepartmentList, postArchive, getDetail } from '@/api/contract-management/index.js'
import JFormContainer from '@/components/jeecg/JFormContainer'
import JSelectCustomer from '@/views/scrm/modules/JSelectCustomer'
import JSelectProject from '@/views/scrm/modules/JSelectProject'

import SelectSupplierList from '@/components/SelectPopoverModel'
import JFileDialogPreviewModal from '@/components/jeecg/JFileDialogPreviewModal'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin'
import { getDictText } from '@/api/api.js'
import { downFile, getAction } from '@/api/manage'
import { Base64 } from 'js-base64'
export default {
  mixins: [TableListMixin],
  components: { JSelectCustomer, JSelectProject, JFormContainer, SelectSupplierList,JFileDialogPreviewModal },
  data() {
    return {
      // 开关
      visible: false,
      // 是否禁用
      disableSubmit: false,
      // 标题
      title: '详情',
      type: 0,
      // 表单配置
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
      disableMixinCreated: true,
      // 表单参数
      formParams: {
        departIds: this.$store.getters.userInfo.departIds, //当前部门id
        dept: this.$store.getters.userInfo.orgCodeTxt, //部门名称
        phone: this.$store.getters.userInfo.phone, // 当前电话
        people: this.$store.getters.userInfo.realname, // 当前人
      },
      // 上传地址
      uploadUrl: window._CONFIG['domianURL'] + '/sys/upload/uploadMinio',
      // 上传请求头
      headers: { 'X-Access-Token': this.$ls.get('Access-Token') },
      // 图片上传列表
      fileUrl: [],
      // 图片处理数据集合
      pictureTempListImage: [],
      activeKey: '1',
      principalPersonList: [], //部门列表
      contractList: [], // 主合同列表
      // 加载动画开关
      loading: false,
      rules: {
        customerId: [{ required: true, message: '请选择关联客户', trigger: 'change' }],
        projectId: [{ required: true, message: '请选择关联项目', trigger: 'change' }],
        contract: [{ required: true, message: '请输入合同名称', trigger: 'blur' }],
        contractType: [{ required: true, message: '请选择合同类型', trigger: 'change' }],
        partnerA: [{ required: true, message: '请输入甲方（需方）', trigger: 'blur' }],
        partnerB: [{ required: true, message: '请输入乙方（供方）', trigger: 'blur' }],
        partnerAPerson: [{ required: true, message: '请输入甲方负责人', trigger: 'blur' }],
        partnerBPerson: [{ required: true, message: '请输入乙方负责人', trigger: 'blur' }],
        partnerAPhone: [
          { required: true, message: '请输入甲方联系方式', trigger: 'blur' },
          // { validator: this.validateMobile },
        ],
        partnerBPhone: [
          { required: true, message: '请输入乙方联系方式', trigger: 'blur' },
          // { validator: this.validateMobile },
        ],
        payee: [{ required: true, message: '请输入收款人', trigger: 'blur' }],
        bank: [{ required: true, message: '请输入开户银行', trigger: 'blur' }],
        bankAccount: [{ required: true, message: '请输入银行账号', trigger: 'blur' }],
        settlementType: [{ required: true, message: '请选择结算方式', trigger: 'change' }],
        totalAmount: [{ required: true, message: '请输入合同总金额', trigger: 'blur' }],
        payCycle: [{ required: true, message: '请输入付款期数', trigger: 'blur' }],
        ticketInfo: [{ required: true, message: '请输入开票信息', trigger: 'blur' }],
        ticketSituation: [{ required: true, message: '请选择开票情况', trigger: 'change' }],
        withList: [{ required: true, message: '请选择发货是否随附发货清单', trigger: 'change' }],
        // breachClause: [{ required: true, message: '请输入违约条款', trigger: 'blur' }],
        isMainContract: [{ required: true, message: '请选择是否主合同', trigger: 'change' }],
        // mainContractId: [{ required: true, message: '请选择主合同', trigger: 'change' }],
        fileUrl: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (this.fileUrl == '') return callback(new Error('请上传合同文件！'))
              callback()
            },
            trigger: 'blur',
          },
        ],
      },
      currnetId: '',
      currnetRow: {},
    }
  },
  methods: {
    getDictText,
    validateMobile(rule, value, callback) {
      if (!value || new RegExp(/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/).test(value)) {
        callback()
      } else {
        callback('您的手机号码格式不正确!')
      }
    },
    // 选择供应商
    onSearch() {
      this.$refs.SelectSupplier.open()
    },
    handleSelectSupplier(data) {
      console.log(data)
      this.$set(this.formParams, 'supplierId', data.selectionRows[0].id)
      this.$set(this.formParams, 'supplierName', data.selectionRows[0].supplier)
    },
    // 切换tab
    handleChange(key) {
      console.log(key)
      this.activeKey = key
      this.formParams = {
        departIds: this.$store.getters.userInfo.departIds, //当前部门id
        dept: this.$store.getters.userInfo.orgCodeTxt, //部门名称
        phone: this.$store.getters.userInfo.phone, // 当前电话
        people: this.$store.getters.userInfo.realname, // 当前人
      }
      if (key == 2) {
      }
    },
    // 获取部门树形
    getDepartmentList() {
      getDepartmentList().then((res) => {
        if (res.success) {
          this.principalPersonList = res.result
        }
      })
    },
    // 客户事件
    handelChangeCustomer(val, rows) {
      console.log(val, rows)
      this.$set(this.formParams, 'customerId', rows[0].id)
      this.$set(this.formParams, 'customerName', rows[0].customName)
    },
    // 项目改变事件
    handelChange(value, rows) {
      console.log(value, rows)
      this.$set(this.formParams, 'projectId', value)
      this.$set(this.formParams, 'projectName', rows[0].projectName)
    },
    // 获取主合同列表
    getContractList() {
      getContractList().then((res) => {
        if (res.success) {
          this.contractList = res.result
        }
      })
    },
    close() {
      this.visible = false
      // 重置表单
      this.$refs.ruleForm.resetFields()
      this.formParams = {
        departIds: this.$store.getters.userInfo.departIds, //当前部门id
        dept: this.$store.getters.userInfo.orgCodeTxt, //部门名称
        phone: this.$store.getters.userInfo.phone, // 当前电话
        people: this.$store.getters.userInfo.realname, // 当前人
      }
      this.fileUrl = []
      this.pictureTempListImage = []
      this.contractList = []
      this.currnetRow = {}
      this.activeKey = '1'
      this.currnetId = ''
    },
    open() {
      this.getDepartmentList()
      this.getContractList()
      this.visible = true
    },
    detail(record) {
      this.type = 2
      this.currnetId = record.id
      this.currnetRow = record
      this.getDetail(record.id)
      this.open()
    },
    getDetail(id) {
      getDetail(id).then((res) => {
        if (res.success) {
          this.formParams = res.result

          this.formParams.departIds = res.result.applyInfo.departIds
          this.formParams.people = res.result.applyInfo.people
          this.formParams.phone = res.result.applyInfo.phone
          console.log(this.formParams)

          // this.formParams.contractType = res.result.contractInfo.contractType
          // this.formParams.partnerA = res.result.contractInfo.partnerA
          // this.formParams.partnerAPerson = res.result.contractInfo.partnerAPerson
          // this.formParams.partnerAPhone = res.result.contractInfo.partnerAPhone
          // this.formParams.partnerB = res.result.contractInfo.partnerB
          // this.formParams.partnerBPerson = res.result.contractInfo.partnerBPerson
          // this.formParams.partnerBPhone = res.result.contractInfo.partnerBPhone
          // this.formParams.partnerBId = res.result.contractInfo.partnerBId
          // this.formParams.payee = res.result.contractInfo.payee
          // this.formParams.bank = res.result.contractInfo.bank
          // this.formParams.bankAccount = res.result.contractInfo.bankAccount
          // this.formParams.settlementType = res.result.contractInfo.settlementType
          // this.formParams.totalAmount = res.result.contractInfo.totalAmount
          // this.formParams.payCycle = res.result.contractInfo.payCycle
          // this.formParams.ticketInfo = res.result.contractInfo.ticketInfo
          // this.formParams.ticketSituation = res.result.contractInfo.ticketSituation
          // this.formParams.withList = res.result.contractInfo.withList
          // this.formParams.breachClause = res.result.contractInfo.breachClause
          // this.formParams.isMainContract = res.result.contractInfo.isMainContract
          // this.formParams.mainContractId = res.result.contractInfo.mainContractId
          // this.formParams.abstractInfo = res.result.contractInfo.abstractInfo
          // this.formParams.remark = res.result.contractInfo.remark

          // let fileUrl = res.result.fileUrl ? res.result.fileUrl.split(',') : []
          this.fileUrl = res.result.fileUrl.map((item, index) => {
            let i = index + 1
            return {
              uid: item.uid,
              status: 'done',
              name: item.name,
              url: item.url,
            }
          })
        }
      })
    },
    // 文件上传
    handleUploadChange(info) {
      console.log(info)
      let fileList = [...info.fileList]
      this.fileUrl = fileList

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

        this.fileUrl = this.pictureTempListImage
        const data = this.fileUrl.map((item) => item.url).toString()
        this.formParams.fileUrl = data
      }
    },
    downloadFile(file) {
      getAction('sys/upload/preview', { id: file.uid }).then((res) => {
        if (res.success) {
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = res.result
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link) //下载完成移除元素
        } else {
          this.$message.error('文件下载失败')
        }
      })
    },
    async handlePreview(file) {
      console.log(file)
      let that = this
      getAction('sys/upload/preview', { id: file.uid }).then((res) => {
        if (res.success) {
          if (res && res.result) {
            let url = window._CONFIG['onlinePreviewDomainURL'] + '?url=' + encodeURIComponent(Base64.encode(res.result))
            console.log(url)
            that.$refs.modalForm.open(url)
          }
        } else {
          this.$message.error('文件预览失败')
        }
      })
    },
    // 归档
    handleFile() {
      let that = this
      this.$confirm({
        title: '确认归档',
        content: '确认是否进行此操作?',
        onOk: function () {
          that.loading = true
          postArchive(that.currnetId)
            .then((res) => {
              if (res.success) {
                that.$message.success('归档成功')
                that.$emit('refresh')
              } else {
                that.$message.warning(res.message)
              }
              that.close()
            })
            .finally(() => {
              that.loading = false
            })
        },
      })
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
</style>
