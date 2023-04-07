<template>
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
            <a-form-model-item label="项目总额" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="amount">
              <a-input-number v-model="model.amount" placeholder="请输入项目总额" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="项目概算" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="budget">
              <a-input-number v-model="model.budget" placeholder="请输入项目概算" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="概要说明" :labelCol="{xs:{ span: 24 }, sm: {span: 3}}" :wrapperCol="{xs:{ span: 24 }, sm: { span: 20}}" prop="outlines">
              <a-textarea  v-model="model.outlines" placeholder="请输入概要说明" :rows="4" maxlength="990" showCount="true" ></a-textarea>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>

  import { httpAction, getAction } from '@/api/manage'
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
        default: false,
        required: false
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
          liaison: [{required: true, message: '客户联系人不能为空!'}],
          phone: [{required: true, message: '请输入客户联系方式!'}, {validator: this.validatePhone}],
          inCharge:[{required: true, message: '负责人不能为空!'}]
        },
        url: {
          add: "/scrm/crmProject/add",
          edit: "/scrm/crmProject/edit",
          queryById: "/scrm/crmProject/queryById"
        }
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
      this.$emit('done')
    },
    methods: {
      add (record) {
        this.edit(this.modelDefault);
      },
      edit (record) {
        this.model = Object.assign({}, record);
        this.visible = true;
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
          }
        })
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
    }
  }
</script>