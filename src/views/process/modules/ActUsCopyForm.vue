<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="业务主键" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="businessKey">
              <a-input v-model="model.businessKey" placeholder="请输入业务主键"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="抄送标题" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="title">
              <a-input v-model="model.title" placeholder="请输入抄送标题"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="流程名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="processName">
              <a-input v-model="model.processName" placeholder="请输入流程名称"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="部署主键" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="procdefId">
              <a-input v-model="model.procdefId" placeholder="请输入部署主键"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="流程实例主键" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="procInstId">
              <a-input v-model="model.procInstId" placeholder="请输入流程实例主键"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="任务主键" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="taskId">
              <a-input v-model="model.taskId" placeholder="请输入任务主键"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="发起人主键" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="startUserId">
              <a-input v-model="model.startUserId" placeholder="请输入发起人主键"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="发起人名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="startUserName">
              <a-input v-model="model.startUserName" placeholder="请输入发起人名称"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="删除标志（0存在，1删除）" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="delFlag">
              <a-input-number v-model="model.delFlag" placeholder="请输入删除标志（0存在，1删除）" style="width: 100%" />
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

  export default {
    name: 'ActUsCopyForm',
    components: {
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
           businessKey: [
              { required: true, message: '请输入业务主键!'},
           ],
           procdefId: [
              { required: true, message: '请输入部署主键!'},
           ],
           procInstId: [
              { required: true, message: '请输入流程实例主键!'},
           ],
        },
        url: {
          add: "/org/actUsCopy/add",
          edit: "/org/actUsCopy/edit",
          queryById: "/org/actUsCopy/queryById"
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
    }
  }
</script>