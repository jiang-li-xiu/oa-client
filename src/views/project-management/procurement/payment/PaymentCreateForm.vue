<template>
  <j-modal
      :title="title"
      :width="width"
      :visible="visible"
      switchFullscreen
      :fullscreen="true"
      :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
      @cancel="handleCancel"
      cancelText="关闭">
      <div class="content">
        <a-spin tip="加载中..." :spinning="loading">
          <a-form-model ref="form" :model="model" :rules="rules">
            <a-row>
              <a-col :span="24">
                <table class="table" :border="1" cellpadding="2" cellspacing="0">
                  <thead>
                    <tr class="head-tr">
                      <th colspan="4" class="th-title">结算付款申请</th>
                      <td colspan="2">
                        <a-form-model-item label="制单日期" prop="makeFormTime">
                          <j-date
                            v-model="model.makeFormTime"
                            dateFormat="YYYY-MM-DD"
                            :style="{ width: '100%' }"
                            placeholder="请选择制单日期"
                          />
                        </a-form-model-item>
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <!-- <th>项目名称:</th> -->
                      <td colspan="3" width="50%">
                        <a-form-model-item label="项目名称" prop="projectId">
                          <j-select-project
                            v-model="model.projectId"
                            :multi="false"
                            @change="handelChange"
                          ></j-select-project>
                        </a-form-model-item>
                      </td>
                      <!-- <th>合同编号:</th> -->
                      <td colspan="3">
                        <a-form-model-item label="项目编号" prop="projectCode">
                          <a-input
                            v-model="model.projectCode"
                            placeholder="请输入项目编号"
                            :read-only="true"
                          />
                        </a-form-model-item>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="3" width="50%">
                        <a-form-model-item label="合同编号" prop="contractCode">
                          <j-select-contract
                            v-model="model.contractCode"
                            store="contractCode"
                            text="contractCode"
                            :multi="false"
                            :param="{'projectId': model.projectId}"
                            :disabled="contractDisabled"
                            @change="contractChange"
                          ></j-select-contract>
                        </a-form-model-item>
                      </td>
                      <td colspan="3">
                        <a-form-model-item label="结算单位" prop="settlementCompany">
                          <a-input
                            v-model="model.settlementCompany"
                            placeholder="请输入结算单位"
                          />
                        </a-form-model-item>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="3">
                        <a-form-model-item label="申请部门" prop="departmentId">
                          <a-select
                            ref="select"
                            v-model="model.departmentId"
                            :options="depOptions"
                            :field-names="{ label: 'name', value: 'id'}"
                            @change="handleDepart"
                          ></a-select>
                        </a-form-model-item>
                      </td>
                      <td colspan="3">
                        <a-form-model-item
                          label="结算次数"
                          prop="settlementTimes"
                        >
                          <a-input
                            v-model="model.settlementTimes"
                            placeholder="请输入结算次数" 
                            prefix="第"
                            type="number"
                            suffix="次结算"          
                          />
                        </a-form-model-item>
                      </td>
                    </tr>
                    <tr>
                      <td rowspan="3" colspan="3">
                        <a-form-model-item
                          label="付款内容描述"
                          prop="paymentText"
                          class="flex-column"
                        >
                          <a-textarea
                            v-model="model.paymentText"
                            placeholder="请输入付款内容描述"
                            :show-count="true"
                            :max-length="200"
                            :rows="4"
                            style="width:100%;"
                          />
                        </a-form-model-item>
                      </td>
                      <td colspan="3">
                        <a-form-model-item label="收款单位" prop="proceedsCompany">
                          <a-input
                            v-model="model.proceedsCompany"
                            placeholder="请输入收款单位"
                          />
                        </a-form-model-item>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="3">
                        <a-form-model-item label="开户银行" prop="bank">
                          <a-input v-model="model.bank" placeholder="请输入开户银行"/>
                        </a-form-model-item>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="3">
                        <a-form-model-item label="银行账号" prop="bankAccount">
                          <a-input
                            v-model="model.bankAccount"
                            placeholder="请输入银行账号"
                          />
                        </a-form-model-item>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2">
                        <a-form-model-item label="合同金额" prop="contractAmount">
                          <a-input-number
                            v-model="model.contractAmount"
                            placeholder="请输入合同金额"
                            class="input-number"
                          />
                        </a-form-model-item>
                      </td>
                      <td colspan="2">
                        <a-form-model-item  label="本期结算"  prop="thisSettlementAmount">
                          <a-input-number
                            v-model="model.thisSettlementAmount"
                            placeholder="请输入本期结算金额"
                            class="input-number"
                            @change="settlementAmount"
                          />
                        </a-form-model-item>
                      </td>
                      <td colspan="2">
                        <a-form-model-item
                          label="累计结算"
                          prop="allSettlementAmount"
                        >
                          <a-input-number
                            defaultValue = "0"
                            v-model="model.allSettlementAmount"
                            placeholder="请输入累计结算金额"
                            class="input-number"
                          />
                        </a-form-model-item>
                      </td>
                    </tr>
                    <tr>
                      <td rowspan="4" colspan="2">
                        本次扣款金额
                      </td>
                      <td colspan="2">
                        <a-form-model-item
                          label="扣预付款"
                          prop="buckleAdvancePayment"
                        >
                          <a-input-number
                            v-model="model.buckleAdvancePayment"
                            placeholder="请输入预付款扣除金额"
                            class="input-number"
                            @change="deductChange"
                          ></a-input-number>
                          </a-form-model-item>
                      </td>
                      <td colspan="2">
                        <a-form-model-item
                          label="扣质保金"
                          prop="buckleQualityRetentionMoney"
                        >
                        <a-input-number
                          v-model="model.buckleQualityRetentionMoney"
                          placeholder="请输入质保金额"
                          class="input-number"
                          @change="deductChange"
                        ></a-input-number>
                        </a-form-model-item>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2">
                        <a-form-model-item
                          label="扣违约金"
                          prop="deductLiquidatedDamages"
                        >
                          <a-input-number
                            v-model="model.deductLiquidatedDamages"
                            placeholder="请输入违约金额"
                            class="input-number"
                            @change="deductChange"
                          ></a-input-number>
                        </a-form-model-item>
                      </td>
                      <td colspan="2">
                        <a-form-model-item
                          label="暂扣工程款"
                          prop="deductLiquidatedDamages"
                        >
                        <a-input-number
                          v-model="model.withholdProjectPayment"
                          placeholder="请输入扣除工程款金额"
                          class="input-number"
                          @change="deductChange"
                        ></a-input-number>
                        </a-form-model-item>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2">
                        <a-form-model-item
                          label="扣 税 金 "
                          prop="deductLiquidatedDamages"
                        >
                          <a-input-number
                            v-model="model.withholdTaxes"
                            placeholder="请输入扣除税金金额"
                            class="input-number"
                            @change="deductChange"
                          ></a-input-number>
                        </a-form-model-item>
                      </td>
                      <td colspan="2">
                        <a-form-model-item
                          label="扣其他费用"
                          prop="deductLiquidatedDamages"
                        >
                          <a-input-number
                            v-model="model.deductOtherExpenses"
                            placeholder="请输入其他扣除费用金额"
                            class="input-number"
                            @change="deductChange"
                          ></a-input-number>
                        </a-form-model-item>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="4">
                        <a-form-model-item
                          label="扣款合计"
                          prop="deductionsCombined"
                        >
                          <a-input-number
                            v-model="model.deductionsCombined"
                            placeholder="请输入合计扣款金额"
                            class="input-number"
                          ></a-input-number>
                        </a-form-model-item>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2">
                        <a-form-model-item label="金额小写" prop="lowercaseAmount">
                          <a-input
                            v-model="model.lowercaseAmount"
                            suffix="元"
                            :max-length="12"
                            type="number"
                          ></a-input>
                        </a-form-model-item>
                      </td>
                      <td colspan="4">
                        <a-form-model-item label="金额大写" prop="capitalCamount">      
                          <a-input v-model="model.capitalCamount" aria-placeholder="请输入金额大写" :read-only="true" />
                        </a-form-model-item>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="6">
                        <a-form-model-item class="flex-row" label="付款方式" prop="paymentWay">
                          <a-radio-group v-model="model.paymentWay" :options="way"/>
                        </a-form-model-item>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="6" style="padding:6px 12px 12px 12px;">
                        <a-form-model-item class="flex-row" label="附件信息" prop="files">
                          <a-upload
                            v-model="model.files"
                            :action="minioAction"
                            :multiple="true"
                            :remove="removeFile"
                            :file-list="fileList"
                            :headers="head"
                            @download="downloadFile"
                            @change="uploadFile"
                            @preview="previewFile"
                            :showUploadList="showUploadList">
                            <a-button> <a-icon type="upload"/>上传文件</a-button>
                          </a-upload>  
                        </a-form-model-item>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </a-col>
            </a-row>
          </a-form-model>
        </a-spin>
      </div>
    <template slot="footer">
      <a-button type="dashed" @click="handleCancel">取消</a-button>
      <a-button type="primary" @click="handleOks" :loading="loading">提交</a-button>
      <a-button type="primary" @click="handleDraft" :loading="loading">保存草稿</a-button>
      <a-button @click="showDraftModal" :loading="loading">草稿箱({{total}})</a-button>
    </template>
    <draft-modal :modalWidth="800" @edit="reEdit" @change="draftChange" ref="draft"></draft-modal>
    <preview-file ref="previewFile"></preview-file>
  </j-modal>
</template>

<script>
  import { httpAction, getAction } from '@/api/manage'
  import { getDraftTotal, saveDraft, deleteDraft} from '@/api/workflow/workflow'
  import { getAmountChinese } from '@/utils/index';
  import JSelectProject from '@/views/scrm/modules/JSelectProject'
  import JSelectContract from '@/views/scrm/modules/JSelectContract'
  import moment from 'dayjs'
  import DraftModal from '@/plugins/modal/DraftModal'
  import { FileHandleMixin } from '@/mixins/FileHandleMixin'

  export default {
    name: 'CrmProjectForm',
    mixins:[FileHandleMixin],
    components: {
      JSelectProject,
      JSelectContract,
      DraftModal,
      VNodes: {
        functional: true,
        render: (h, ctx) => ctx.props.vnodes,
      },
    },
    props: {
      //表单禁用
      disabled: {
        type: Boolean,
        default: false,
        required: false
      },
      visible:{
        type: Boolean,
        default: false,
        required: true
      },
      //表单数据
      record: {
        type: Object,
        default: {},
        required: true
      }
    },
    data () {
      return {
        model: {files:[], makeFormTime:moment().format('YYYY-MM-DD')},
        // 当前模式 0-添加 1-编辑 2-详情
        type: 0,
        projectList: [], //项目信息
        true: false,
        liaison:[],
        way:[
          {label:'电汇', value:1},
          {label:'转账', value:2},
          {label:'汇票', value:3},
          {label:'现金', value:4},
          {label:'其他', value:5},
        ],
        liaisonData:[],
        depOptions: [],
        pageSize: 20,
        page: 1,
        total: 0,
        confirmLoading: false,
        url: {
          create: "/prodPayment/create",
          edit: "/prodPayment/edit",
          queryById: "/prodPayment/queryById"
        },
        title:'发起审批',
        width:800,
        disableSubmit: false,
        // 加载动画开关
        loading: false,
        rules: {
          projectId: [{ required: true, message: '请选择项目名称', trigger: 'change' }],
          projectCode: [{ required: true, message: '请输入项目编号', trigger: 'blur' }],
          settlementCompany: [{ required: true, message: '请输入结算单位', trigger: 'blur' }],
          paymentWay: [{ required: true, message: '请选择付款方式', trigger: 'blur' }],
          departmentId: [{ required: true, message: '请输入申请部门', trigger: 'blur' }],
          makeFormTime: [{ required: true, message: '请选择制单日期', trigger: 'change' }],
          settlementTimes: [{ required: true, message: '请输入结算次数', trigger: 'blur' },{pattern: /^([1-9][0-9]{0,1}|100)$/, message: '请输入1-100的正整数' }],
          proceedsCompany: [{ required: true, message: '请输入收款单位', trigger: 'blur' }],
          bank: [{ required: true, message: '请输入开户银行', trigger: 'blur' }],
          bankAccount: [{ required: true, message: '请输入银行账号', trigger: 'blur' }],
          contractAmount: [{ required: true, message: '请输入合同金额', trigger: 'blur' },{validator: this.validateAmount}],
          thisSettlementAmount: [{ required: true, message: '请输入本期结算金额', trigger: 'blur' },{validator: this.validateAmount}],
          capitalCamount: [{ required: true, message: '请输入金额大写', trigger: 'blur' }],
          lowercaseAmount: [{ required: true, message: '请输入金额小写', trigger: 'blur' },{validator: this.validateAmount}],
          files: [{ required: true, message: '请上传相关附件', trigger: 'change' }],  
        },
        contractDisabled: true,
        total:0
      }
    },
    computed: {

    },

    created () {
       //备份model原始值
      this.modelDefault = JSON.parse(JSON.stringify(this.model));
      this.getCurrentUserDepart();
      this.draftTotal()
    },
    mounted() {
      
    },
    methods: {
      handleChange(value) {
        let data = this.projectList.filter((item) => item.id == value)
        // 项目编号
        this.model.projectCode = data[0].code
      },
      /**部门选择处理 */
      getCurrentUserDepart(){
        getAction('sys/sysDepart/getCurrentUserDepart').then(res=>{
          if (res.success) {
            //构建选项
            if(res.result){
              this.depOptions = res.result
            }
          } else {
            this.depOptions = []
          }
        })
      },
      handleDepart(val, label){
        this.model.departmentName = label.componentOptions.children[0].text
      },
      /**部门数据处理结束 */
      /**扣除金额部分处理 */
      deductChange(){
        let amount = 0
        amount = parseFloat(this.isNumber(this.model.buckleAdvancePayment)) +  parseFloat(this.isNumber(this.model.buckleQualityRetentionMoney)) +
          parseFloat(this.isNumber(this.model.deductOtherExpenses)) +  parseFloat(this.isNumber(this.model.deductLiquidatedDamages)) +
          parseFloat(this.isNumber(this.model.withholdProjectPayment)) + parseFloat(this.isNumber(this.model.withholdTaxes))
        this.model.deductionsCombined = amount.toFixed(2)
        this.settlementAmount()
      },  
      isNumber(val){
        if (!/^[0-9]+.?[0-9]*$/g.test(val)) {
          val = 0;
        }
        return Number(val)
      },
      settlementAmount(val){
        let leave = parseFloat(this.isNumber(this.model.contractAmount)) - parseFloat(this.isNumber(this.model.allSettlementAmount))
        if(val > leave){
          this.model.thisSettlementAmount =  leave
          this.$message.error("结算金额不能大于可结算总金额")
          return;
        }
        let amount = 0
        amount = parseFloat(this.isNumber(this.model.thisSettlementAmount)) -  parseFloat(this.isNumber(this.model.deductionsCombined))
        this.model.lowercaseAmount = amount.toFixed(2)
        this.model.capitalCamount = getAmountChinese(Math.abs(this.model.lowercaseAmount));
      },
      /**扣除金额部分处理end */
      handleCancel(){
        this.model = {
          files:[],
          makeFormTime:moment().format('YYYY-MM-DD')
        },
        this.$emit('close')
      },
      changeLiaison(val, option){
        this.model.phone = this.liaisonData[option.data.key].phone;
        this.$forceUpdate()
      },
      /**项目选择开始*/
      handelChange(id, row){
        if(row && row.length > 0){
          this.model.projectCode = row[0].projectNo
          this.model.projectName = row[0].projectName
          this.contractDisabled = false
        }else{
          this.model.projectCode = ''
          this.model.projectName = ''
          this.contractDisabled = true
        }
      },
      /**项目选择结束*/
      handleOks(){
        const that = this;
        // 触发表单验证
        this.$refs.form.validate(valid => {
          if (valid) {
            that.confirmLoading = true;
            let httpurl = this.url.create;
            let method = 'post';
            this.model.processDefId = this.record.procdefId;
            this.model.tables = this.record.linkTable;
            httpAction(httpurl, this.model, method).then((res)=>{
              if(res.success){
                if(this.model.draftId){
                  // 删除草稿
                  deleteDraft({id:this.model.draftId})
                }
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
            })
          }
         
        })
      },
      /**合同选择开始 */
      contractChange(val, data){
        if(data && data.length > 0){
          let params = {
            contractId:data[0].id,
            bankAccount: data[0].bankAccount,
            bank: data[0].bank, 
            contractAmount: data[0].totalAmount, 
            proceedsCompany: data[0].partnerB,
            settlementCompany: data[0].partnerA,
            allSettlementAmount: data[0].settlementAmount
          }
          let model = Object.assign({}, this.model, params)
          this.model = model
        }else{
          let params = {
            contractId:'',
            bankAccount: '',
            bank: '', 
            contractAmount: '', 
            proceedsCompany: '',
            settlementCompany: '',
            allSettlementAmount: ''
          }
          let model = Object.assign({}, this.model, params)
          this.model = model
        }
      },
      /**合同选择结束 */
      validateAmount(rule, value, callback){
        var exp = /^([1-9]\d*|[0])(\.\d{1,2})?$/;
        if (!exp.test(value) || parseFloat(value) >= 100000000000) {
          callback('格式不正确，最小为0，最大为999999999999.99');
        }
        callback();
      },

      /**草稿处理开始 */
      /*使用草稿数据*/
      reEdit(formData){
        this.model = formData
        this.fileList = formData.files
      },
      /**草稿删除变化 */
      draftChange(){
        this.draftTotal()
      },      
      /**草稿数量 */
      draftTotal(){
        getDraftTotal({modelId: this.record.modelId}).then((res) => {
          if (res.success) {
            this.total = res.result
          }
        })
      },
      /**打开草稿列表 */
      showDraftModal(){
        this.$refs.draft.showModal(this.record.modelId)
      },
      /**流程数据保存草稿 */
      handleDraft(){
        const that = this;
        // 触发表单验证
        this.$refs.form.validate(valid => {
          if (valid) {
            this.model.tables = this.record.linkTable;
            that.confirmLoading = true;
            saveDraft({modelId:that.record.modelId, formData:that.model}).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.model.draftId = res.result
                this.draftTotal()
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
            })
          }
        })
      },
      /**草稿处理结束 */
    }
  }
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  .head {
    height: 46px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 4px solid #797979;
    .head-item {
      flex: 1;
      &:nth-child(2) {
        text-align: center;
      }
      &:last-child {
        text-align: right;
      }
    }
  }
  .title {
    padding: 10px 0;
    font-size: 24px;
    text-align: center;
    color: #333333;
    font-weight: 600;
  }
  .table {
    width: 100%;
    .head-tr{
      border-top: hidden;
      border-left: hidden;
      border-right: hidden;
      text-align: center;
      th,td{
        border-right: hidden;
      }
      .th-title{
        text-align:right; 
        font-size: 18px; 
        font-weight: 600;
        padding-right: 68px;
      }
    }
    tr {
      height: 40px;
      text-align: center;
    }

    th,
    td {
      min-width: 120px;
      padding: 5px;
      text-align: left;
    }
  }

  label {
    height: 30px;
    line-height: 30px;
    display: flex;
    align-items: center;
    span {
      padding-left: 5px;
    }
  }

  .checkbox {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }
}
.inputWidth {
  width: 60%;
}
.input {
  width: 27%;
}
.text {
  margin-top: 20px;
  padding: 20px;
  font-weight: 600;
}
.ant-form-item{
  margin-bottom: 0 !important;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  &:deep(.ant-form-item-control-wrapper){
    flex-grow: 1;
  }
  &:deep(.ant-form-item-label){
    min-width: 80px;
  }
}
.flex-column{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  &:deep(.ant-form-item-control-wrapper){
    width: 100%;
  }
}
.input-number{
  width: 100%;
}
</style>