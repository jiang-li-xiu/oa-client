<template>
  <div>
    <a-spin :spinning="confirmLoading">
      <j-form-container :disabled="disabled">
        <a-form-model ref="form" :model="model" :rules="validatorRules" :slot="disabled?'detail':'edit'">
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="项目名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="projectName">
                <a-input v-model="model.projectName" placeholder="请输入项目名称"  ></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="客户名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="customer">
                <!-- <a-input v-model="model.customer" placeholder="请输入客户名称"  ></a-input> -->
                <j-select-customer v-model="model.customer" :multi="false" @change="handelChange"></j-select-customer>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="联系人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="liaison">
                <a-select
                  v-model="model.liaison"
                  show-search
                  placeholder="请选择"
                  @change="changeLiaison"
                  :options="liaison"
                  :filter-option="true"
                ></a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="联系方式" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="phone">
                <a-input v-model="model.phone" placeholder="请输入客户联系方式"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="负责人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="inCharge">
                <j-select-user-by-dep v-model="model.inCharge" :multi="false"></j-select-user-by-dep>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="立项时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="buildDate">
                <j-date placeholder="请选择立项时间" v-model="model.buildDate"  style="width: 100%" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="项目地点" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="projectAddr">
                <a-input v-model="model.projectAddr" placeholder="请输入项目地点"  ></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="项目状态" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="status">
                <a-input v-model="model.status" placeholder="请输入项目状态"  ></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="项目类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="projectType">
                 <a-select
                  v-model="model.projectType"
                  placeholder="请选择"
                >
                  <a-select-option :value="1">工程项目</a-select-option>
                  <a-select-option :value="2">渠道项目</a-select-option>
                  <a-select-option :value="3">产品销售</a-select-option>
                  <a-select-option :value="4">软件销售</a-select-option>
                  <a-select-option :value="5">软件定制</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="项目总额" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="amount">
                <a-input-number v-model="model.amount" placeholder="请输入项目总额" :min="0" style="width: 100%" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="项目概算" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="budget">
                <a-input-number v-model="model.budget" placeholder="请输入项目概算" :min="0" style="width: 100%" />
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="概要说明" :labelCol="{xs:{ span: 24 }, sm: {span: 3}}" :wrapperCol="{xs:{ span: 24 }, sm: { span: 20}}" prop="outlines">
                <a-textarea  v-model="model.outlines" placeholder="请输入概要说明" :rows="4" showCount="true" ></a-textarea>
              </a-form-model-item>
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
  </div>
</template>

<script>

  import { postAction, getAction } from '@/api/manage'
  import { validateDuplicateValue } from '@/utils/util'
  import JSelectCustomer from './JSelectCustomer'
 

  export default {
    name: 'CrmProjectForm',
    components: {
      JSelectCustomer
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
        model:{},
        liaison:[],
        liaisonData:[],
        model2:{comment: ''},
        model3:{node:''},
        targetKey:'',
        visible2:false,
        nodeList:[],
        labelCol: {
          xs: { span: 12 },
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 12 },
          sm: { span: 16 },
        },
        confirmLoading: false,
        validatorRules: {
          projectName:[{required: true, message: '项目名称不能为空!'}],
          customer:[{required: true, message: '客户名称不能为空!'}],
          liaison: [{required: true, message: '客户联系人不能为空!'}],
          phone: [{required: true, message: '请输入客户联系方式!'}, {validator: this.validatePhone}],
          inCharge:[{required: true, message: '负责人不能为空!'}]
        },
        commentRules: {
          comment:[{required: true, message: '请输入审批意见!'}],
        },
        nodeRules:{
          node:[{required: true, message: '请选择节点!'}],
        },
        url: {
          add: "/scrm/crmProject/add",
          edit: "/scrm/crmProject/edit",
          queryById: "/scrm/crmProject/queryById"
        },
        backLoading: false,
        processLoading: false,
        okLoading: false,
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
        getAction("/scrm/crmProject/queryByProcessId",{processId:this.record.procInsId}).then(res=>{
          if(res.success){
            that.model = res.result
          }else{
            that.$message.warning(res.message);
          }
        })
      },
      changeLiaison(val, option){
        this.model.phone = this.liaisonData[option.data.key].phone
        this.$forceUpdate()
      },
      handelChange(id){
        let that = this
        that.model.liaison = ""
        that.liaison = []
        that.model.phone = ''
        getAction(`/scrm/crmCustomLiaison/listAll`,{"customId": id}).then(res=>{
          if (res.success) {
            //构建选项
            if(res.result){
              let data = res.result
              this.liaisonData = data
              let temp = []
              for(var i = 0; i < data.length; i++){
                temp.push({value:data[i].name, label: data[i].name, key: i})
              }
              that.liaison = temp
            }
          } else {
            that.$message.error(res.message);
          }
        })
      },
      handleProcess(){
        let that = this;
        this.$refs.form2.validate(valid => {
          if(valid){
            let params = {
              'taskId': that.record.taskId, 
              'procInsId': that.record.procInsId, 
              'comment': that.model2.comment, 
              'variables': {message: that.model2.comment},
              'businessData': that.model
            }
            that.confirmLoading = true
            postAction("/scrm/crmProject/complete", params).then(res=>{
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
            this.backLoading = true
            let that = this;
            postAction("/workflow/process/returnList", {'taskId': that.record.taskId}).then(res=>{
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
            postAction("/scrm/crmProject/reject", {procInsId:that.record.procInsId, taskId: that.record.taskId,  comment: that.model2.comment}).then(res=>{
              if(res.success){
                that.$message.success(res.message);
                that.handleCancel();
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
      submitForm () {
        const that = this;
        // 触发表单验证
        this.$refs.form.validate(valid => {
          if (valid) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
               method = 'put';
            }
            httpAction(httpurl,this.model,method).then((res)=>{
              if(res.success){
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
      validatePhone(rule, value, callback){
        if(!value){
          callback()
        }else if(!new RegExp(/^1[3|4|5|7|8|9][0-9]\d{8}$/).test(value)){
          callback("请输入正确格式的手机号码!");
        }else{
          callback()
        }
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
  .button-group{
    text-align: right;
    >button{
      margin-left: 6px;
    }
  }
</style>