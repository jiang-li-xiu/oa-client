<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <!-- <a-col :span="24">
            <a-form-model-item label="私钥" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="privateKey">
              <a-input v-model="model.privateKey" placeholder="请输入私钥"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="公钥" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="publicKey">
              <a-input v-model="model.publicKey" placeholder="请输入公钥"  ></a-input>
            </a-form-model-item>
          </a-col> -->
          <a-col :span="24">
            <a-form-model-item label="项目名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="subject">
              <a-input v-model="model.subject" placeholder="请输入项目名称"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="证书描述" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="description">
              <a-input v-model="model.description" placeholder="请输入证书描述"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="是否试用" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="trialOrFormal">
              <a-switch checked-children="是" un-checked-children="否" un-checked-value="false" v-model="model.trialOrFormal" checked-value="true" :checked="true" @change="trialOrFormalChange"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="生效时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="issuedTime">
              <j-date v-model="model.issuedTime" placeholder="请选择时间" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%"></j-date>
            </a-form-model-item>
          </a-col> 
          <a-col :span="24">
            <a-form-model-item label="过期时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="expireTime">
              <j-date v-model="model.expireTime" placeholder="请选择时间" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%"></j-date>
            </a-form-model-item>
          </a-col> 
          <a-col :span="24">
            <a-form-model-item label="检查ip" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="checkIp">
              <a-switch checked-children="是" un-checked-children="否" un-checked-value="false"  checked-value="true" v-model="model.checkIp" @change="checkIpChange"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="ip地址" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="ipAddr">
              <a-input v-model="model.ipAddr" placeholder="请输入ip地址,多个用,隔开" maxlength="500"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="检查mac" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="checkMac">
              <a-switch checked-children="是" un-checked-children="否" un-checked-value="false" checked-value="true" v-model="model.checkMac"  @change="checkMacChange"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="mac地址" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="macAddr">
              <a-input v-model="model.macAddr" placeholder="请输入mac地址,多个用,隔开" maxlength="550"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="检查cpu" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="checkCpu">
              <a-switch checked-children="是" un-checked-children="否" un-checked-value="false" checked-value="true" v-model="model.checkCpu" @change="checkCpuChange"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="cpu序列号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="cpuSerial">
              <a-input v-model="model.cpuSerial" placeholder="请输入cpu序列号" maxlength="255"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="检查主板" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="checkMainBoard">
              <a-switch checked-children="是" un-checked-children="否" un-checked-value="false" checked-value="true" v-model="model.checkMainBoard" @change="checkMainBoardChange"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="主板序列号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="mainBoardSerial">
              <a-input v-model="model.mainBoardSerial" placeholder="请输入主板序列号" maxlength="255"></a-input>
            </a-form-model-item>
          </a-col>
          <!-- <a-col :span="24">
            <a-form-model-item label="密文" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="encrypt">
              <a-textarea v-model="model.encrypt" rows="4" placeholder="请输入密文" />
            </a-form-model-item>
          </a-col> -->
        </a-row>
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>

  import { httpAction, getAction } from '@/api/manage'
  import { validateDuplicateValue } from '@/utils/util'
  import JDate from '@/components/jeecg/JDate'

  export default {
    name: 'SysLicenseForm',
    components: {JDate},
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
        validateStatus:1,
        model:{
          checkeIp: false,
          checkMac: false,
          checkCpu: false,
          checkMainBoard: false
         },
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        confirmLoading: false,
        validatorRules: {
           subject: [
              { required: true, message: '请输入项目名称!'},
           ],
           expireTime: [
              { required: false, message: '请输选择过期时间!'},
           ],
           ipAddr: [
              { required: false, message: '请输入ip地址!'},
           ],
           macAddr: [
              { required: false, message: '请输入mac地址!'},
           ],
           cpuSerial: [
              { required: false, message: '请输入cpu序列号!'},
           ],
           mainBoardSerial: [
              { required: false, message: '请输入主板序列号!'},
           ],
        },
        url: {
          add: "/sys/sysLicense/add",
          edit: "/sys/sysLicense/edit",
          queryById: "/sys/sysLicense/queryById"
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
    methods: {
      add () {
        this.edit(this.modelDefault);
      },
      edit (record) {
        this.model = Object.assign({}, record);
        this.visible = true;
      },
      checkIpChange(e){
        if(e){
          this.validatorRules.ipAddr[0].required = true;
        }else{
          this.validatorRules.ipAddr[0].required = false;
        }
      },
      checkMacChange(e){
        if(e){
          this.validatorRules.macAddr[0].required = true;
        }else{
          this.validatorRules.macAddr[0].required = false;

        }
      },
      checkCpuChange(e){
        if(e){
          this.validatorRules.cpuSerial[0].required = true;
        }else{
          this.validatorRules.cpuSerial[0].required = false;
        }
      },
      checkMainBoardChange(e){
        if(e){
          this.validatorRules.mainBoardSerial[0].required = true;
        }else{
          this.validatorRules.mainBoardSerial[0].required = false;
        }
      },
      trialOrFormalChange(e){
        if(e){
          this.validatorRules.expireTime[0].required = true;
        }else{
          this.validatorRules.expireTime[0].required = false;
        }
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
            console.log("this.model:" + JSON.stringify(this.model))
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
    }
  }
</script>