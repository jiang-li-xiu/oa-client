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
                    <th colspan="4" class="th-title">快递邮寄申请</th>
                    <td colspan="2">
                      <a-form-model-item label="申请日期" prop="applyDate">
                        <j-date  v-model="model.applyDate"  dateFormat="YYYY-MM-DD" :style="{ width: '100%' }" placeholder="请选择申请日期"/>
                      </a-form-model-item>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colspan="3" width="50%">
                      <a-form-model-item label="申请部门" prop="depart">
                        <a-select ref="select" v-model="model.depart" :options="depOptions" :field-names="{ label: 'name', value: 'id' }"  @change="handleDepart" ></a-select>
                      </a-form-model-item>
                    </td>
                    <td colspan="3">
                      <a-form-model-item label="申请人" prop="userName">
                        <a-input v-model="model.userName" placeholder="请输入申请人" />
                      </a-form-model-item>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="3" width="50%">
                      <a-form-model-item label="是否紧急" prop="urgent">
                        <a-radio-group class="radio-line" v-model="model.urgent" :default-value="1">
                          <a-radio :value="1" name="urgent"> 一般 </a-radio>
                          <a-radio :value="2" name="urgent"> 紧急 </a-radio>
                        </a-radio-group>
                      </a-form-model-item>
                    </td>
                    <td colspan="3">
                      <a-form-model-item label="到货时间" prop="arrivalDays">
                        <a-input suffix="天" type="number" v-model="model.arrivalDays" :min="0" :step="0.1" :precision="2" />
                      </a-form-model-item>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="3">
                      <a-form-model-item label="是否保价" prop="insuredMail">
                        <a-radio-group class="radio-line" v-model="model.insuredMail" :default-value="1">
                          <a-radio :value="1" name="insuredMail"> 否 </a-radio>
                          <a-radio :value="2" name="insuredMail"> 是 </a-radio>
                        </a-radio-group>
                      </a-form-model-item>
                    </td>
                    <td colspan="3">
                      <a-form-model-item label="保价金额" prop="insuredValue">
                        <a-input v-model="model.insuredValue" :min="0" placeholder="保价金额" type="number" suffix="元" 
                        :rules="[{ required: this.model.insuredMail == 2, message: '请输入保价金额', trigger: 'change'}]"/>
                      </a-form-model-item>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="3">
                      <a-form-model-item label="物品名称" prop="mailItems">
                        <a-input v-model="model.mailItems" placeholder="物品名称"/>
                      </a-form-model-item>
                    </td>
                    <td colspan="3">
                      <a-form-model-item label="预估运费" prop="haulage">
                        <a-input v-model="model.haulage" placeholder="预估运费"  type="number" suffix="元"/>
                      </a-form-model-item>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="6">
                      <a-form-model-item label="费用性质" prop="mailItems">
                        <a-radio-group class="radio-line" name="mailItems" :default-value="1">
                          <a-radio :value="1"> 现结寄件 </a-radio>
                          <a-radio :value="2"> 外地寄件 </a-radio>
                          <a-radio :value="3">
                            到付寄件&emsp;
                            <a-input v-model="model.arrivedPayment" placeholder="到付原因"/>
                          </a-radio>
                        </a-radio-group>
                      </a-form-model-item>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="6">
                      <a-form-model-item label="配送物流" prop="express">
                        <a-select show-search v-model="model.express">
                          <div slot="dropdownRender" slot-scope="menu">
                            <v-nodes :vnodes="menu" />
                            <a-divider style="margin: 4px 0;" />
                            <div style="padding: 4px 8px; cursor: pointer;"
                              @mousedown="e => e.preventDefault()"
                              @click="addItem"
                            >
                              <a-icon type="plus" /> 添加一项
                            </div>
                          </div>
                          <a-select-option v-for="item in logItems" :key="item.value" :value="item.title">
                            {{ item.title }}({{ item.value }})
                          </a-select-option>
                        </a-select>
                      </a-form-model-item>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="6">
                      <div style="display:flex; flex-direction: row; align-items: center; justify-content: space-between;">
                        <a-form-model-item v-if="selected"  class="flex-row"  label="项目名称" prop="projectId"  :rules="[{ required: true, message: '请选择项目', trigger: 'change'}]">
                          <j-select-project v-model="model.projectId" :multi="false" @change="itemChange" ></j-select-project>  
                        </a-form-model-item>
                        <a-form-model-item  v-else class="flex-row" label="项目名称" prop="project" :rules="[{ required: true, message: '请选择项目', trigger: 'change'}]">
                          <a-input v-model="model.project" placeholder="请输入项目名称" :max-length="250"></a-input>
                        </a-form-model-item>
                        <a-tooltip placement="topLeft" title="输入方式切换按钮。手输即手动输入，适用于与项目无法的报销；选择则从已有项目中选择">
                          <a-button type="primary" @click="toggleChange">{{selected?'手输':'选择'}}</a-button>
                        </a-tooltip>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="6">
                      <a-form-model-item label="收件人信息" prop="recipient">
                        <a-input v-model="model.recipient" placeholder="收件人、手机号及地址" :max-length="250"/>
                      </a-form-model-item>
                    </td>
                  </tr>
                  <tr>
                    <td rowspan="3" colspan="2"> 邮寄信息 </td>
                    <td colspan="2">
                      <a-form-model-item label="快递公司" prop="actualExpress">
                        <a-select show-search v-model="model.actualExpress">
                          <div slot="dropdownRender" slot-scope="menu">
                            <v-nodes :vnodes="menu" />
                            <a-divider style="margin: 4px 0;" />
                            <div
                              style="padding: 4px 8px; cursor: pointer;"
                              @mousedown="e => e.preventDefault()"
                              @click="addItem"
                            >
                              <a-icon type="plus" /> 添加一项
                            </div>
                          </div>
                          <a-select-option v-for="item in logItems" :key="item.value" :value="item.title">
                            {{ item.title}}({{ item.value }})
                          </a-select-option>
                        </a-select>
                      </a-form-model-item>
                    </td>
                    <td colspan="2">
                      <a-form-model-item label="快递单号" prop="trackingNumber">
                      <a-input v-model="model.trackingNumber" placeholder="请输入快递单号"></a-input>
                      </a-form-model-item>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2">
                      <a-form-model-item label="快递金额" prop="amount">
                        <a-input-number v-model="model.amount" :min="0" :step="0.1" :max="999999999.99" placeholder="请输入快递金额" class="input-number"></a-input-number>
                      </a-form-model-item>
                    </td>
                    <td colspan="2">
                      <a-form-model-item label="配送日期" prop="deliveryDate">
                        <j-date  v-model="model.deliveryDate"  dateFormat="YYYY-MM-DD" :style="{ width: '100%' }" placeholder="请选择配送日期"/>
                      </a-form-model-item>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="4">
                      <a-form-model-item label="办理人手机" prop="payerPhone">
                        <a-input v-model="model.payerPhone" :max-length="11" placeholder="请输入办理人手机"></a-input>
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
    <a-drawer
      title="添加物流企业信息"
      :width="720"
      :visible="drawerShow"
      :body-style="{ paddingBottom: '80px' }"
      @close="onClose"
    >
      <a-spin :spinning="confirmLoading">
        <a-form-model  ref="form" :model="dict" :rules="validatorRules">
          <a-form-model-item prop="itemText" label="名称">
            <a-input placeholder="请输入名称" v-model="dict.itemText"/>
          </a-form-model-item>
          <a-form-model-item prop="itemValue" label="数据值">
            <a-input placeholder="请输入数据值" v-model="dict.itemValue" />
          </a-form-model-item>
          <a-form-model-item label="描述">
            <a-input v-model="dict.description" />
          </a-form-model-item>
          <a-form-model-item label="排序值">
            <a-input-number :min="1" v-model="dict.sortOrder" />
            值越小越靠前
          </a-form-model-item>
        </a-form-model>
        <div style="position: absolute;right: 0;bottom: 0;width: 100%; border-top: 1px solid #e9e9e9; padding: 10px 16px; background: #fff; text-align: right; z-index: 1;">
          <a-button :style="{ marginRight: '8px' }" @click="onClose">
            取消
          </a-button>
          <a-button type="primary" @click="onSubmit">
            提交
          </a-button>
        </div>
      </a-spin>
    </a-drawer>
  </div>
</template>

<script>
  import { getAction, postAction } from '@/api/manage'
  import { getAmountChinese } from '@/utils/index';
  import JSelectProject from '@/views/scrm/modules/JSelectProject'
  import { FileHandleMixin } from '@/mixins/FileHandleMixin'
import { isEmpty } from 'lodash';

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
          create: "/flw/flwExpressMail/create",
          edit: "/flw/flwExpressMail/edit",
          queryById: "/flw/flwExpressMail/queryById"
        },
        title:'发起审批',
        // 加载动画开关
        loading: false,
        commentRules: {
          comment:[{required: true, message: '请输入审批意见!'}],
        },
        nodeRules:{
          node:[{required: true, message: '请选择节点!'}],
        },
        validatorRules: {
          itemText:  [{required: true, message: '请输入名称!'}],
          itemValue:  [{required: true, message: '请输入数据值!', trigger: 'blur'},{validator: this.validateItemValue, trigger: 'blur'}],
        },
        backLoading: false,
        processLoading: false,
        okLoading: false,
        logItems: [],
        selected: true,
        drawerShow: false,
        dict:{
          dictId:'1611247374978990081'
        },
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
      handleChange(value) {
        let data = this.projectList.filter((item) => item.id == value)
        // 项目编号
        this.model.projectName = data[0].projectName
      },
      /**项目选择结束*/
      /**物流信息选择开始 */
      /* 添加一项 */
      addItem() {
        this.drawerShow = true;
      },
      onClose() {
        this.drawerShow = false;
      },
      logistics(){
        getAction('/sys/dict/getDictItems/express_coding', null).then((res)=>{
          if(res.success){
            this.logItems = res.result;
          }else{
            this.logItems = []
          }
        })
      },
      // 确定
      onSubmit() {
        const that = this;
        // 触发表单验证
        this.$refs.form.validate(valid => {
          if (valid) {
            that.confirmLoading = true;
            this.dict.itemText = (this.dict.itemText || '').trim()
            this.dict.itemValue = (this.dict.itemValue || '').trim()
            this.dict.description = (this.dict.description || '').trim()
            let obj = addDictItem(this.dict);
            obj.then((res) => {
              if (res.success) {
                this.logItems.push({value: this.dict.itemValue, text: this.dict.itemText, label: this.dict.itemText, title: this.dict.itemText});
                that.$message.success(res.message);
              } else {
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.onClose();
            })
          }else{
            return false;
          }
        })
      },
      /**物流信息选择结束 */
      
      /**流程处理开始 */
      handel () {
        let that = this;
        getAction(this.url.queryById, {id: this.record.businessKey}).then(res=>{
          if(res.success){
            that.model = res.result
            that.fileList = res.result.files
            that.selected = !isEmpty(res.result.projectId)
            that.getCurrentUserDepart(res.result.depart);
            that.logistics();
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
            postAction("/flw/flwExpressMail/complete", params).then(res=>{
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
            postAction("/flw/flwExpressMail/reject", {procInsId:that.record.procInsId, taskId: that.record.taskId,  comment: that.model2.comment}).then(res=>{
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
        console.log("depart:" + depart)
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

.radio-line{
  display: flex;
  flex-direction: row;


  flex-wrap: nowrap;
  align-items: center;
  height: 40px;
}
.ant-input-number{
  width: 100%;
}
.flex-row{
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    &:deep(.ant-form-item-control-wrapper){
      flex-grow: 1;
      margin-right: 6px;
    }
    &:deep(.ant-form-item-label){
      min-width: 72px;
    }
  }
</style>