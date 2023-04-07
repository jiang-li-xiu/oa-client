<template>
  <div>
    <a-spin :spinning="confirmLoading">
      <j-form-container :disabled="formDisabled">
        <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
          <a-row>
            <table :border="1" cellpadding="2" cellspacing="0">
              <thead>
                <tr class="head-tr">
                  <td style="width:33.33%">
                    <a-form-model-item class="flex-row" label="单号" prop="businessNo" v-if="formDisabled">
                      <a-input v-model="model.businessNo" placeholder="请输入单号" :read-only="true" style="border:none;"></a-input>
                    </a-form-model-item>
                  </td>
                  <th style="width:33.33%; font-size: 18px; font-weight: 600;">费用报销单</th>
                  <td style="width:33.33%"></td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <a-form-model-item class="flex-row" label="部门" prop="depart">
                      <a-select
                        ref="select"
                        v-model="model.depart"
                        :options="depOptions"
                        :field-names="{ label: 'name', value: 'id'}"
                        @change="handleChange"
                      ></a-select>
                    </a-form-model-item>
                  </td>
                  <td>
                    <a-form-model-item class="flex-row" label="申请人" prop="createBy">
                      <a-input v-model="model.createBy" placeholder="请输入申请人" :read-only="true"></a-input>
                    </a-form-model-item>
                  </td>
                  <td>
                    <a-form-model-item class="flex-row" label="填报日期" prop="fillingDate">
                      <j-date placeholder="请选择填报日期" v-model="model.fillingDate"  style="width: 100%" />
                    </a-form-model-item>
                  </td>
                </tr>
                <tr>
                  <td colspan="3">
                    <div style="display:flex; flex-direction: row; align-items: center; justify-content: space-between;">
                      <a-form-model-item v-if="selected" 
                        class="flex-row" 
                        label="项目名称" 
                        prop="projectId" 
                        :rules="[{ required: true, message: '请选择项目', trigger: 'change'}]">
                        <j-select-project v-if="selected"
                          v-model="model.projectId"
                          :multi="false"
                          @change="itemChange"
                        ></j-select-project>  
                      </a-form-model-item>
                      <a-form-model-item  v-else 
                        class="flex-row" 
                        label="项目名称" 
                        prop="project" 
                        :rules="[{ required: true, message: '请选择项目', trigger: 'change'}]">
                        <a-input v-model="model.project" placeholder="请输入项目名称" :max-length="250"></a-input>
                      </a-form-model-item>
                      <a-tooltip placement="topLeft" title="输入方式切换按钮。手输即手动输入，适用于与项目无法的报销。选择则从已有项目中选择">
                        <a-button type="primary" @click="toggleChange">{{selected?'手输':'选择'}}</a-button>
                      </a-tooltip>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="3" style="position:relative;">
                    <!-- <a-button type="primary" class="add-row-custom" size="small" @click="addRowCustom">
                      <a-icon type="plus" /> 添加一行
                    </a-button> -->
                    <a-form-model-item label="费用明细" class="fee-label" prop="feeDetails">
                      <!-- <a-input v-model="model.feeDetails" placeholder="请输入费用明细"  ></a-input> -->
                      <div>
                        <a-row type="flex" style="margin-bottom:6px;text-align: center;" :gutter="4">
                          <a-col :span="4">报销项目</a-col>
                          <a-col :span="3">单据数量</a-col>
                          <a-col :span="6">摘要</a-col>
                          <a-col :span="6">金额</a-col>
                          <a-col :span="5">备注</a-col>
                          <!-- <a-col :span="2">操作</a-col> -->
                        </a-row>

                        <a-row type="flex" style="margin-bottom:3px" :gutter="4" v-for="(item, index) in model.feeDetails" :key="index">
                          <a-col :span="4">
                            <a-form-model-item :prop="'feeDetails.' + index + '.item'" :rules="[{required: true,message: '请输入报销项目', trigger: 'blur'}]">
                              <a-input placeholder="报销项目" v-model="item.item" />
                            </a-form-model-item>
                          </a-col>
                          <a-col :span="3">
                            <a-form-model-item>
                              <a-input-number placeholder="单据数量" v-model="item.num" :min="1" :max="100" style="width: 100%;"/>
                            </a-form-model-item>
                          </a-col>
                          <a-col :span="6">
                            <a-form-model-item>
                              <a-input placeholder="摘要" v-model="item.digest" :max-length="200" />
                            </a-form-model-item>
                          </a-col>
                          <a-col :span="6">
                            <a-form-model-item :prop="'feeDetails.' + index + '.amount'" :rules="[{required: true,message: '请输入金额',trigger: 'blur'}]">
                              <a-input-number placeholder="金额" :min="0.01" :max="999999999.99" v-model="item.amount" style="width: 100%;"/>
                            </a-form-model-item>
                          </a-col>
                          <a-col :span="5">
                            <a-form-model-item>
                              <a-input placeholder="备注" v-model="item.remarks"/>
                            </a-form-model-item>
                          </a-col>
                          <!-- <a-col :span="2">
                            <a-form-model-item style="text-align:center">
                              <a-icon type="minus-circle" @click="delRowCustom(index)"  style="fontSize :20px"/>
                            </a-form-model-item>
                          </a-col> -->
                        </a-row>
                      </div>
                    </a-form-model-item>
                  </td>
                </tr>
                <tr>
                  <td>
                    <a-form-model-item class="flex-row" label="报销金额" prop="amount">
                      <a-input-number v-model="model.amount" placeholder="请输入报销金额" @change="changeAmount" style="width: 100%" :read-only="true"/>
                    </a-form-model-item>
                  </td>
                  <td>
                    <a-form-model-item class="flex-row" label="借款金额" prop="loanAmount">
                      <a-input-number v-model="model.loanAmount" placeholder="请输入借款金额" style="width: 100%" :min="0.01" :max="999999999.99"/>
                    </a-form-model-item>
                  </td>
                  <td>
                    <a-form-model-item class="flex-row" label="退款金额" prop="returnAmount">
                      <a-input-number v-model="model.returnAmount" placeholder="请输入退款金额" style="width: 100%" :min="0.01" :max="999999999.99"/>
                    </a-form-model-item>
                  </td>
                </tr>
                <tr>
                  <td colspan="3">
                    <a-form-model-item class="flex-row" label="金额大写" prop="amountInWords">
                      <a-input v-model="model.amountInWords" :read-only="true" style="border:none;"></a-input>
                    </a-form-model-item>
                  </td>
                </tr>
                <tr v-if="fileList && fileList.length > 0">
                  <td colspan="3" style="padding-bottom:6px;">
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
  import { FileHandleMixin } from '@/mixins/FileHandleMixin'
  import JSelectProject from '@/views/scrm/modules/JSelectProject'
  import { isEmpty } from 'lodash';

  export default {
    name: 'CrmProjectForm',
    mixins:[FileHandleMixin],
    components: {
      JSelectProject
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
        model:{
          files:[]
        },
        liaison:[],
        liaisonData:[],
        model2:{comment: ''},
        model3:{node:''},
        targetKey:'',
        visible2:false,
        nodeList:[],
        depOptions:[],
        confirmLoading: false,
        formDisabled: true,
        validatorRules: {
        },
        commentRules: {
          comment:[{required: true, message: '请输入审批意见!'}],
        },
        nodeRules:{
          node:[{required: true, message: '请选择节点!'}],
        },
        backLoading: false,
        processLoading: false,
        okLoading: false,
        selected:true
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
      /**获取业务数据 */
      handel () {
        let that = this;
        getAction("/scrm/flwExpenseReimbursement/queryById",{id:this.record.businessKey}).then(res=>{
          if(res.success){
            that.model = res.result
            that.getCurrentUserDepart(res.result.depart)
            //判断初始时显示的项目信息
            this.selected = !isEmpty(res.result.projectId)
            // 处理文件
            that.fileList = res.result.files ? res.result.files : []
          }else{
            that.$message.warning(res.message);
          }
        })
      },
      /**获取用户当前部门 */
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
      /**项目选择开始*/
      itemChange(id, row){
        if(row && row.length > 0){
          this.model.project= row[0].projectName
        }else{
          this.model.project = ''
        }
      },
      toggleChange(){
        this.selected = !this.selected
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
            postAction("/scrm/flwExpenseReimbursement/complete", params).then(res=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('close')
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(()=>{
              that.confirmLoading = false
            })
            .finally(()=>{
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
            })
            .finally(()=>{
              setTimeout(()=>{
                 this.backLoading = false
              },1000)
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
        })
        .finally(()=>{
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
            postAction("/scrm/flwExpenseReimbursement/reject", {procInsId:that.record.procInsId, taskId: that.record.taskId,  comment: that.model2.comment}).then(res=>{
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
    text-align: center;
    line-height: 54px;
    th,td{
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
    flex-grow: 1;
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
.fee-label{
  &:deep(.ant-form-item-label){
    width: 100%;
    text-align: center;
    label::after{
      content: none;
    }
  }
}
.add-row-custom{
  position: absolute;
  right: 8px;
  top: 8px;
  z-index: 1024;
}
</style>