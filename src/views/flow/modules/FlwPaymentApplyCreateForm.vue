<template>
  <j-modal
    :title="title"
    :width="width"
    :visible="visible"
    switchFullscreen
    :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
    @cancel="handleCancel"
    cancelText="关闭">
    <a-spin :spinning="confirmLoading">
      <j-form-container :disabled="formDisabled">
        <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
          <a-row>
            <table :border="1">
              <thead>
                <tr class="head-tr">
                  <th style="font-size:18px; font-weight:600;">付款申请</th>
                  <th>
                    <a-form-model-item class="head-create-date" label="制单日期" prop="createDate">
                      <a-date-picker v-model="model.createDate" placeholder="请输入制单日期"/>
                    </a-form-model-item>
                  </th>
                </tr>
              </thead>
              <tr>
                <td >
                  <a-form-model-item class="flex-row" label="申请部门" prop="depart">
                    <!-- <a-input v-model="model.userId" placeholder="请输入申请部门"  ></a-input> -->
                    <a-select
                      ref="select"
                      v-model="model.depart"
                      :options="depOptions"
                      :field-names="{ label: 'name', value: 'id'}"
                      @change="handleChange"
                    ></a-select>
                  </a-form-model-item>
                </td>
                <td >
                  <a-form-model-item class="flex-row" label="关联项目" prop="projectId">
                    <j-select-project
                      v-model="model.projectId"
                      :multi="false"
                      @change="handelChange"
                    ></j-select-project>
                  </a-form-model-item>
                </td>
              </tr>
              <tr>
                <td >
                  <a-form-model-item class="flex-row" label="关联合同" prop="contractId">
                    <j-select-contract
                      v-model="model.contractId"
                      text="contract"
                      :multi="false"
                      :param="{'projectId': model.projectId}"
                      :disabled="contractDisabled"
                      @change="contractChange"
                    ></j-select-contract>
                  </a-form-model-item>
                </td>
                <td >
                  <a-form-model-item class="flex-row" label="付款类型" prop="planFlag">
                    <a-radio-group v-model="model.planFlag">
                      <a-radio value="1" name="planFlag">计划内</a-radio>
                      <a-radio value="2" name="planFlag">计划外</a-radio>
                    </a-radio-group>
                  </a-form-model-item>
                </td>
              </tr>
              <tr>
                <td rowspan="3">
                  <a-form-model-item class="flex-colunm" label="付款说明" prop="explanation">
                    <a-textarea v-model="model.explanation" :rows="4" placeholder="请输入付款说明"  ></a-textarea>
                  </a-form-model-item>
                </td>
                <td >
                  <a-form-model-item class="flex-row" label="收款单位" prop="payee">
                    <a-input v-model="model.payee" placeholder="请输入收款单位"  ></a-input>
                  </a-form-model-item>
                </td>
              </tr>
              <tr>
                <td>
                  <a-form-model-item class="flex-row" label="开户银行" prop="bankName">
                    <a-input v-model="model.bankName" placeholder="请输入开户银行"  ></a-input>
                  </a-form-model-item>
                </td>
              </tr>
              <tr>
                <td>
                  <a-form-model-item class="flex-row" label="银行账号" prop="bankAcount">
                    <a-input v-model="model.bankAcount" placeholder="请输入银行账号"  ></a-input>
                  </a-form-model-item>
                </td>
              </tr>
              <tr>
                <td>
                  <a-form-model-item class="flex-row" label="付款金额" prop="amount">
                    <a-input type="number" @change="changeAmount" min="0" max="999999999999.99" :max-length="15" suffix="元" v-model="model.amount" placeholder="请输入付款金额" />
                  </a-form-model-item>
                </td>
                <td>
                  <a-form-model-item class="flex-row" label="金额大写" prop="amountInWords">
                    <a-input v-model="model.amountInWords" placeholder="请输入金额大写"  :read-only="true"></a-input>
                  </a-form-model-item>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <a-form-model-item class="flex-row" label="付款方式" prop="paymentWay">
                    <a-radio-group v-model="model.paymentWay">
                      <a-radio value="1" name="paymentWay">电汇</a-radio>
                      <a-radio value="2" name="paymentWay">转账</a-radio>
                      <a-radio value="3" name="paymentWay">汇票</a-radio>
                      <a-radio value="4" name="paymentWay">现金</a-radio>
                      <a-radio value="5" name="paymentWay">其他</a-radio>
                    </a-radio-group>
                  </a-form-model-item>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <a-form-model-item class="flex-row" label="付款类别" prop="paymentType">
                    <a-radio-group v-model="model.paymentType" class="payment-type">
                      <a-radio value="1" name="paymentType">采购付款(首次)</a-radio>
                      <a-radio value="2" name="paymentType">采购付款(非首次)</a-radio>
                      <a-radio value="3" name="paymentType">月度工资发放</a-radio>
                      <a-radio value="4" name="paymentType">经费支付</a-radio>
                      <a-radio value="5" name="paymentType">往来款项</a-radio>
                      <a-radio value="6" name="paymentType">招待费用(礼品费)</a-radio>
                      <a-radio value="7" name="paymentType">支付保证金及借款</a-radio>
                      <a-radio value="8" name="paymentType">其他</a-radio>
                    </a-radio-group>
                  </a-form-model-item>
                </td>
              </tr>
              <tr>
                <td colspan="2" style="padding:6px 12px 12px 12px;">
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
                      <a-button> <a-icon type="upload"/> 上传文件 </a-button>
                    </a-upload>  
                  </a-form-model-item>
                </td>
              </tr>
            </table>
          </a-row>
        </a-form-model>
      </j-form-container>
    </a-spin>
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
    name: 'FlwPaymentApplyForm',
    mixins:[FileHandleMixin],
    components: {
      JSelectProject,
      JSelectContract,
      DraftModal
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
        title:'日常付款申请',
        width:800,
        disableSubmit: false,
        // 加载动画开关
        loading: false,
        uploadLoading: false,
        loadList: [],
        model:{variables:{}, files:[],createDate:moment().format('YYYY-MM-DD')},
        depOptions:[],
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        uploading: false,
        confirmLoading: false,
        validatorRules: {
          createDate: [{ required: true, message: '请填写制单日期', trigger: 'change' }],
          depart: [{ required: true, message: '请选择申请部门', trigger: 'blur' }],
          planFlag: [{ required: true, message: '请选择付款类型', trigger: 'blur' }],
          payee: [{ required: true, message: '请填写收款单位', trigger: 'blur' }],
          bankName: [{ required: true, message: '请填写开户银行', trigger: 'blur' }],
          bankAcount: [{ required: true, message: '请填银行账号', trigger: 'blur' }],
          amount: [{ required: true, message: '请填写付款金额', trigger: 'blur' },{validator: this.validateAmount,trigger: 'change'}],
          amountInWords: [{ required: true, message: '请填写金额大写', trigger: 'blur' }],
          paymentWay: [{ required: true, message: '请选择付款方式', trigger: 'blur' }],
          paymentType: [{ required: true, message: '请选择付款类别', trigger: 'blur' }],
          files: [{ required: true, message: '请上传相关附件', trigger: 'change' }],  
        },
        url: {
          create: "/scrm/flwPaymentApply/create",
          edit: "/scrm/flwPaymentApply/edit",
          queryById: "/scrm/flwPaymentApply/queryById",
          minioUpload: "/sys/upload/uploadMinio"
        },
        contractDisabled: true,
        total:0
      }
    },
    computed: {
      formDisabled(){
        return this.disabled
      },
    },
    created () {
       //备份model原始值
      this.modelDefault = JSON.parse(JSON.stringify(this.model));
      this.getCurrentUserDepart();
      this.draftTotal()
    },
    methods: {
      add () {
        this.edit(this.modelDefault);
      },
      edit (record) {
        this.model = Object.assign({}, record);
        this.visible = true;
      },
      handleCancel(){
        this.model={variables:{}, files:[],createDate:moment().format('YYYY-MM-DD')},
        this.$emit('close')
      },
      handleChange(val){
        this.model.depart = val
      },
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
      changeAmount(e){
        this.model.amountInWords = getAmountChinese(e.target.value);
      },
      validateAmount(rule, value, callback){
        var exp = /^([1-9]\d*|[0])(\.\d{1,2})?$/;
        if (!exp.test(value) || parseFloat(value) >= 100000000000) {
          callback('格式不正确，最小为0，最大为999999999999.99');
        }
        callback();
      },
      handleOks () {
        const that = this;
        // 触发表单验证
        this.$refs.form.validate(valid => {
          if (valid) {
            that.confirmLoading = true;
            let httpurl = this.url.create;
            let method = 'post';
            that.model.processDefId = that.record.procdefId;
            that.model.tables = that.record.linkTable;
            //构建variables
            that.initializeVar();
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
      /**初始化流程变量 */
      initializeVar(){
        let variableArr = this.record.variables;
        let model = this.model;
        let variables = {};
        if(variableArr != null && variableArr != '' && variableArr != undefined){
          for(var i = 0; i < variableArr.length; i++){
            var val = model[variableArr[i]];
            if(val == '' && val == null && val == undefined){
              continue
            }
            variables[variableArr[i]] = val;
          }
          this.model.variables = variables
        }
      },
      /**项目选择开始*/
      handelChange(id, row){
        if(row && row.length > 0){
          this.model.projectCode = row[0].projectNo
          this.model.project= row[0].project
          this.contractDisabled = false
        }else{
          this.model.projectCode = ''
          this.model.project = ''
          this.contractDisabled = true
        }
      },
      /**项目选择结束*/
      /**合同选择开始 */
      contractChange(val, data){
        if(data && data.length > 0){
          let params = {
            bankAcount: data[0].bankAccount,
            bankName: data[0].bank, 
            payee: data[0].partnerB,
            contract: data[0].contract
          }
          let model = Object.assign({}, this.model, params)
          this.model = model
        }else{
          let params = {
            bankAcount: '',
            bankName: '', 
            payee: '',
            contract: ''
          }
          let model = Object.assign({}, this.model, params)
          this.model = model
        }
      },
      /**合同选择结束 */

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
            that.model.tables = that.record.linkTable;
            that.confirmLoading = true;
            let data = that.model
            saveDraft({modelId:that.record.modelId, formData:data}).then((res)=>{
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
table{
  width: 100%;
  .head-tr{
    border-top: hidden;
    border-left: hidden;
    border-right: hidden;
    text-align: right;
    th{
      border-right: hidden;
    }
  }
  .head-create-date{
    font-weight: normal;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
  
  .flex-colunm{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    &:deep(.ant-form-item-control-wrapper){
      margin-right: 6px;
      width: 98%;
    }

  }
  .flex-row{
    display: flex;
    flex-direction: row;
    &:deep(.ant-form-item-control-wrapper){
      flex-grow: 1;
      margin-right: 6px;
    }
    &:deep(.ant-form-item-label){
      min-width: 72px;
    }
  }
}
.payment-type{
  padding-left: 8px;
  .ant-radio-wrapper{
    padding: 6px 0 6px 0;
  }
}
.ant-modal{
  &:deep(.ant-modal-body){
    padding-top: 0 !important;
  }
}
.ant-form-item{
  margin-bottom: 0 !important;
}
</style>