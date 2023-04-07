<template>
  <div>
    <a-spin tip="加载中..." :spinning="loading" class="content">
      <j-form-container :disabled="disabled">
        <a-form-model ref="form" :model="model" :rules="rules" :slot="disabled?'detail':'edit'">
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
                    <td colspan="3" width="50%">
                      <a-form-model-item label="合同编号" prop="contractCode">
                        <a-input
                          v-model="model.contractCode"
                          placeholder="请输入合同编号"
                        />
                      </a-form-model-item>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="3">
                      <a-form-model-item label="项目编号" prop="projectCode">
                        <a-input
                          v-model="model.projectCode"
                          placeholder="请输入项目编号"
                          :read-only="true"
                        />
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
                          :max-length="500"
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
                          :min="0"
                        />
                      </a-form-model-item>
                    </td>
                    <td colspan="2">
                      <a-form-model-item
                        label="累计结算"
                        prop="allSettlementAmount"
                      >
                        <a-input-number
                          v-model="model.allSettlementAmount"
                          placeholder="请输入累计结算金额"
                          class="input-number"
                          :min="0"
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
                          :min="0"
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
                        :min="0"
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
                          :min="0"
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
                        :min="0"
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
                          :min="0"
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
                          :min="0"
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
                          :min="0"
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
                          @change="changeAmount"
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
                  <tr  v-if="fileList && fileList.length > 0">
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
  import { getAction, postAction } from '@/api/manage'
  import { getAmountChinese } from '@/utils/index';
  import JSelectProject from '@/views/scrm/modules/JSelectProject'
  import { FileHandleMixin } from '@/mixins/FileHandleMixin'

  export default {
    name: 'CrmProjectForm',
    mixins:[FileHandleMixin],
    components: {
      JSelectProject,
      VNodes: {
        functional: true,
        render: (h, ctx) => ctx.props.vnodes,
      },
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
        model: {files:[]},
        model2:{comment: ''},
        model3:{node:''},
        projectList: [], //项目信息
        true: false,
        nodeList:[],
        depOptions: [],
        visible2:false,
        confirmLoading: false,
        url: {
          create: "/scrm/crmProject/create",
          edit: "/scrm/crmProject/edit",
          queryById: "/scrm/crmProject/queryById"
        },
        way:[
          {label:'电汇', value:1},
          {label:'转账', value:2},
          {label:'汇票', value:3},
          {label:'现金', value:4},
          {label:'其他', value:5},
        ],
        title:'发起审批',
        // 加载动画开关
        loading: false,
        commentRules: {
          comment:[{required: true, message: '请输入审批意见!'}],
        },
        nodeRules:{
          node:[{required: true, message: '请选择节点!'}],
        },
        backLoading: false,
        processLoading: false,
        okLoading: false,
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
    },
    mounted() {
      this.handel()
    },
    methods: {
      /**流程处理开始 */
      handel () {
        let that = this;
        getAction("/prodPayment/" + this.record.businessKey).then(res=>{
          if(res.success){
            that.model = res.result
            that.fileList = res.result.files
            that.getCurrentUserDepart(res.result.departmentId);
          }else{
            that.$message.warning(res.message);
          }
        })
      },
      handleProcess(){
        let that = this;
        that.$refs.form2.validate(valid => {
          if(valid){
            let params = {
              'taskId': that.record.taskId, 
              'procInsId': that.record.procInsId, 
              'comment': that.model2.comment, 
              'variables': {message: that.model2.comment},
              'businessData': that.model
            }
            that.confirmLoading = true
            postAction("/prodPayment/complete", params).then(res=>{
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
            postAction("/prodPayment/reject", {procInsId:that.record.procInsId, taskId: that.record.taskId,  comment: that.model2.comment}).then(res=>{
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
      /**流程处理结束 */
      handleChange(value) {
        let data = this.projectList.filter((item) => item.id == value)
        // console.log(data)
        // 项目编号
        this.model.projectCode = data[0].code
      },
      /**部门选择处理 */
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
      handleDepart(val, label){
        this.model.departmentName = label.componentOptions.children[0].text
      },
      /**部门数据处理结束 */
      /**金额数字转为中文 */
      changeAmount(e){
        this.model.capitalCamount = getAmountChinese(this.model.lowercaseAmount);
      },
      /**项目选择开始*/
      handelChange(id, row){
         if(row && row.length > 0){
          this.model.projectCode = row[0].projectNo
         }else{
           this.model.contractCode = ''
         }
      },

      validateAmount(rule, value, callback){
        var exp = /^([1-9]\d*|[0])(\.\d{1,2})?$/;
        if (!exp.test(value) || parseFloat(value) >= 100000000000) {
          callback('格式不正确，最小为0，最大为999999999999.99');
        }
        callback();
      },
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
.button-group{
  text-align: right;
  >button{
    margin-left: 6px;
  }
}
</style>