<template>
  <div>
    <a-spin :spinning="confirmLoading">
      <j-form-container :disabled="disabled">
        <a-form-model ref="form" :model="model" :rules="validatorRules" :slot="disabled?'detail':'edit'">
          <a-row>
            <table :border="1">
              <thead>
                <tr class="head-tr">
                  <th style="font-size:18px; font-weight:600; width:50%;">付款申请</th>
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
                    <a-radio-group v-model="model.planFlag" :value="model.planFlag">
                      <a-radio :value="1" name="planFlag">计划内</a-radio>
                      <a-radio :value="2" name="planFlag">计划外</a-radio>
                    </a-radio-group>
                  </a-form-model-item>
                </td>
              </tr>
              <tr>
                <td rowspan="3">
                  <a-form-model-item class="flex-colunm" label="付款说明" prop="explanation">
                    <template v-if="disabled=='edit'">
                       <a-textarea v-model="model.explanation" :rows="4" placeholder="请输入付款说明"  ></a-textarea>
                    </template>
                   <template v-else>
                      <div v-html="model.explanation"></div>
                   </template>
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
                    <a-input-number @change="changeAmount" v-model="model.amount" placeholder="请输入付款金额" style="width: 100%" />
                  </a-form-model-item>
                </td>
                <td>
                  <a-form-model-item class="flex-row" label="金额大写" prop="amountInWords">
                    <a-input v-model="model.amountInWords" placeholder="请输入金额大写"  :read-only="true" ></a-input>
                  </a-form-model-item>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <a-form-model-item class="flex-row" label="付款方式" prop="paymentWay">
                    <a-radio-group v-model="model.paymentWay">
                      <a-radio :value="1" name="paymentWay">电汇</a-radio>
                      <a-radio :value="2" name="paymentWay">转账</a-radio>
                      <a-radio :value="3" name="paymentWay">汇票</a-radio>
                      <a-radio :value="4" name="paymentWay">现金</a-radio>
                      <a-radio :value="5" name="paymentWay">其他</a-radio>
                    </a-radio-group>
                  </a-form-model-item>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <a-form-model-item class="flex-row" label="付款类别" prop="paymentType">
                    <a-radio-group v-model="model.paymentType" class="payment-type" >
                      <a-radio :value="1" name="paymentType">采购付款(首次)</a-radio>
                      <a-radio :value="2" name="paymentType">采购付款(非首次)</a-radio>
                      <a-radio :value="3" name="paymentType">月度工资发放</a-radio>
                      <a-radio :value="4" name="paymentType">经费支付</a-radio>
                      <a-radio :value="5" name="paymentType">往来款项</a-radio>
                      <a-radio :value="6" name="paymentType">招待费用(礼品费)</a-radio>
                      <a-radio :value="7" name="paymentType">支付保证金及借款</a-radio>
                      <a-radio :value="8" name="paymentType">其他</a-radio>
                    </a-radio-group>
                  </a-form-model-item>
                </td>
              </tr>
              <tr v-if="fileList && fileList.length > 0">
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
                      <a-button> <a-icon type="upload"/>上传文件</a-button>
                    </a-upload>  
                  </a-form-model-item>
                </td>
              </tr>
            </table>
          </a-row>
        </a-form-model>
      </j-form-container>
      <a-form-model ref="form2" :model="model2" :rules="commentRules" v-if="type=='handel'">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="审批意见" :labelCol="{xs:{ span: 24 }, sm: {span: 3}}" :wrapperCol="{xs:{ span: 24 }, sm: { span: 20}}" prop="comment">
              <a-textarea v-model="model2.comment" placeholder="请输入审批意见" :rows="4" :maxLength="200"></a-textarea>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-spin>

    <template v-if="type=='handel'">
      <div class="button-group">
        <a-button @click="handleCancel">取消</a-button>
        <a-button @click="handleBack" type="danger" :loading="backLoading">退回</a-button>
        <a-button @click="handleProcess" type="primary" :loading="processLoading">通过</a-button>
        <a-popconfirm title="审批不通过审批流程会终止，是否继续？！" @confirm="() => handleStop()">
          <a-button type="danger">不通过</a-button>
        </a-popconfirm>
      </div>
    </template>
    <template>
      <a-modal
        :visible="visible2"
        :width="400"
        :keyboard="false"
        :closable="false"
        :centered="true"
        @ok="handleOk"
        @cancel="handleClose"
        :maskClosable="true"
        :confirm-loading="okLoading"
        :mask="true">
        <a-form-model ref="form3" :model="model3" :rules="nodeRules">
          <a-row>
            <a-col :span="24">
              <a-form-item
                name="radio-button"
                label="退回节点">
                <a-radio-group @change="handleSelect" v-model="model.node">
                  <a-radio-button v-for="item in nodeList" :key="item.id" :value="item.id">{{item.name}}</a-radio-button>
                </a-radio-group>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form-model>
      </a-modal>
    </template>
    <preview-file ref="previewFile"></preview-file>
  </div>
</template>

<script>
  import { postAction, getAction } from '@/api/manage'
  import JSelectProject from '@/views/scrm/modules/JSelectProject'
  import JSelectContract from '@/views/scrm/modules/JSelectContract'
  import { FileHandleMixin } from '@/mixins/FileHandleMixin'
 
  export default {
    name: 'CrmProjectForm',
    mixins:[FileHandleMixin],
    components: {
      JSelectProject,
      JSelectContract
    },
    props: {
      //表单禁用
      disabled: {
        type: Boolean,
        default: true,
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
      },
      //表单数据
      type: {
        type: String,
        default: "handel",
        required: false
      }
    },
    data () {
      return {
        model:{files:[]},
        liaison:[],
        liaisonData:[],
        model2:{comment: ''},
        model3:{node:''},
        targetKey:'',
        visible2:false,
        nodeList:[],
        depOptions:[],
        confirmLoading: false,
        validatorRules: {
        },
        commentRules: {
          comment:[{required: true, message: '请输入审批意见!'}],
        },
        nodeRules:{
          node:[{required: true, message: '请选择节点!'}],
        },
        contractDisabled: true,
        backLoading: false,
        processLoading: false,
        okLoading: false
      }
    },
    computed: {
    },
    created () {
      
    },
    mounted () {
      this.handel();
    },
    methods: {
      handel () {
        let that = this;
        getAction("/scrm/flwPaymentApply/queryByProcessId",{processId:this.record.procInsId}).then(res=>{
          if(res.success){
            that.model = res.result
            that.fileList = res.result.files
            this.getCurrentUserDepart(res.result.depart);
          }else{
            that.$message.warning(res.message);
          }
        })
      },
      getCurrentUserDepart(depart){
        getAction('sys/sysDepart/getCurrentUserDepart', {'depId': depart}).then(res=>{
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
      handleChange(val){
        this.model.depart = val
      },
      changeAmount(e){
        this.model.amountInWords = getAmountChinese(e.target.value);
      },
      handleProcess(){
        let that = this;
        this.$refs.form2.validate(valid => {
          if(valid){
            that.confirmLoading = true
            let params = {
              'taskId': that.record.taskId, 
              'procInsId': that.record.procInsId, 
              'comment': that.model2.comment, 
              'variables': {message: that.model2.comment},
              'businessData': that.model
            }
            postAction("/scrm/flwPaymentApply/complete", params).then(res=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('close')
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(()=>{
              setTimeout(()=>{
                this.processLoading = false
              },2000)
            })
          }
        })
      },
      handleBack(){
        // 触发表单验证
        this.$refs.form2.validate(valid => {
          if(valid){
            let that = this;
            this.backLoading = true
            postAction("/workflow/process/returnList", {taskId: that.record.taskId}).then(res=>{
              if(res.success){
                that.visible2 = true
                that.nodeList = res.result
              }else{
                that.$message.warning(res.message);
              }
            }).finally(()=>{
              setTimeout(()=>{
                 this.backLoading = false
              },300)
            })
          }
        })
      },
      handleOk(){
        let targetKey = this.targetKey;
        let that = this;
        if(targetKey == '' || targetKey == null){
          that.$message.warning("请选择回退节点！");
          return
        }
        this.okLoading = true
        postAction("/workflow/process/return", {targetKey:targetKey, taskId:that.record.taskId, comment: that.model2.comment}).then(res=>{
          if(res.success){
            that.$message.success(res.message);
            that.visible2 = false
            that.$emit('close')
            that.$emit('ok');
          }else{
            that.$message.warning(res.message);
          }
        }).finally(()=>{
          setTimeout(()=>{
            this.okLoading = false
          },1000)
        })
      },
      handleClose(){
        this.visible2 = false
      },
      handleStop(){
        let that = this;
        this.$refs.form2.validate(valid => {
          if(valid){
            postAction("/scrm/flwPaymentApply/reject", {procInsId:that.record.procInsId, taskId: that.record.taskId,  comment: that.model2.comment}).then(res=>{
              if(res.success){
                that.$message.success(res.message);
                that.handleCancel()
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            })
          }
        })
      },
      handleSelect (data){
        this.targetKey = data.target.value
      },
      ok () {
        this.$emit('choose', this.choosedIcon)
      },
      handleCancel() {
        this.$emit('close')
      },
      /**项目选择开始*/
      handelChange(id, row){
        if(row && row.length > 0){
          this.model.project = row[0].projectName
          this.contractDisabled = false
        }else{
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
    },
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
  .button-group{
    text-align: right;
    >button{
      margin-left: 6px;
    }
  }
</style>