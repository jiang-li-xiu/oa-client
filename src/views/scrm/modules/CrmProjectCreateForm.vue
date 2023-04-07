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
    <a-spin :spinning="confirmLoading">
      <j-form-container :disabled="formDisabled">
        <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="项目名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="projectName">
                <a-input v-model="model.projectName" placeholder="请输入项目名称"  ></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="客户名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="customer">
                <j-select-customer v-model="model.customer" :multi="false" @change="handelChange"></j-select-customer>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="联系人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="liaison">
                <!-- <a-input v-model="model.liaison" placeholder="请输入客户联系人" ></a-input> -->
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
                <a-input v-model="model.phone" placeholder="请输入客户联系方式" :max-length="11" :read-only="true"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="负责人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="inCharge">
                <j-select-user-by-dep v-model="model.inCharge" :multi="false"></j-select-user-by-dep>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="立项时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="buildDate">
                <j-date placeholder="请选择立项时间" v-model="model.buildDate" style="width: 100%" />
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
                  show-search
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
                <a-textarea  v-model="model.outlines" placeholder="请输入概要说明" :rows="4" :max-length="900" :showCount="true"></a-textarea>
              </a-form-model-item>
            </a-col>
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
  </j-modal>
  
</template>

<script>

  import { httpAction, getAction } from '@/api/manage'
  import { getDraftTotal, saveDraft, deleteDraft} from '@/api/workflow/workflow'
  import JSelectCustomer from './JSelectCustomer'
  import DraftModal from '@/plugins/modal/DraftModal'

  export default {
    name: 'CrmProjectForm',
    components: {
      JSelectCustomer,
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
        model:{
        },
        liaison:[],
        liaisonData:[],
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
          liaison: [{required: true, message: '客户联系人不能为空!', trigger: ['blur', 'change'] }],
          phone: [{required: true, message: '请输入客户联系方式!'}, {validator: this.validatePhone}],
          inCharge:[{required: true, message: '负责人不能为空!'}]
        },
        url: {
          create: "/scrm/crmProject/create",
          edit: "/scrm/crmProject/edit",
          queryById: "/scrm/crmProject/queryById"
        },
        title:'发起审批',
        width:800,
        disableSubmit: false,
        // 加载动画开关
        loading: false,
        total: 0
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
      this.draftTotal()
    },
    mounted() {
    },
    methods: {
      /*使用草稿数据*/
      reEdit(formData){
        this.model = formData
      },
      /**草稿删除变化 */
      draftChange(){
        this.draftTotal()
      },
      handleCancel(){
        this.$emit('close')
      },
      changeLiaison(val, option){
        this.model.phone = this.liaisonData[option.data.key].phone;
        this.$forceUpdate()
      },
      /**草稿数量 */
      draftTotal(){
        getDraftTotal({modelId: this.record.modelId}).then((res) => {
          if (res.success) {
            this.total = res.result
          }
        })
      },
      showDraftModal(){
        this.$refs.draft.showModal(this.record.modelId)
      },
      handelChange(id){
        let that = this
        that.liaison = []
        that.model.liaison = ""
        that.model.phone = ""
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
          }
        })
      },
      handleOks(){
        const that = this;
        // 触发表单验证
        this.$refs.form.validate(valid => {
          if (valid) {
            that.confirmLoading = true;
            let httpurl = that.url.create;
            let method = 'post';
            that.model.processDefId = that.record.procdefId;
            that.model.tables = that.record.linkTable;
            //构建variables
            that.initializeVar();
            httpAction(httpurl, that.model, method).then((res)=>{
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
      /**流程数据保存草稿 */
      handleDraft(){
        const that = this;
        // 触发表单验证
        this.$refs.form.validate(valid => {
          if (valid) {
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
      validatePhone(rule, value, callback){
        if(!value){
          callback()
        }else if(!new RegExp(/^1[3|4|5|7|8|9][0-9]\d{8}$/).test(value)){
          callback("请输入正确格式的手机号码!");
        }else{
          callback()
        }
      },
    }
  }
</script>