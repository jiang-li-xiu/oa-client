<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="流程分类" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="category">
              <a-input v-model="model.category" placeholder="请输入流程分类"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="流程名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="processName">
              <a-input v-model="model.processName" placeholder="请输入流程名称"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="流程定义ID" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="procdefId">
              <a-input v-model="model.procdefId" placeholder="请输入流程定义ID"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="流程版本号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="version">
              <a-input-number v-model="model.version" placeholder="请输入流程版本号（由程序控制，新增即为1，修改后依次加1来完成的）" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="设计器表单" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="processForm">
              <a-textarea v-model="model.processForm" rows="4" placeholder="请输入流程业务表单，设计器表单" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="业务数据表" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="linkTable">
              <a-input v-model="model.linkTable" placeholder="请输入业务数据表"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="提交组件" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="submitForm">
              <a-input v-model="model.submitForm" placeholder="请输入流程提交表单组件"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="处理组件" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="handelForm">
              <a-input v-model="model.handelForm" placeholder="请输入流程处理表单组件"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="图标" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="icon">
              <a-input v-model="model.icon" placeholder="请输入图标"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="图标颜色" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="iconColor">
              <a-input v-model="model.iconColor" placeholder="请输入图标颜色"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="描述" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="description">
              <a-input v-model="model.description" placeholder="请输入描述"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="state">
              <a-input-number v-model="model.state" placeholder="请输入状态（1 激活、2 中止）" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="部署时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="deployTime">
              <j-date placeholder="请选择部署时间" v-model="model.deployTime"  style="width: 100%" />
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
    name: 'ActUsProcdefForm',
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
        },
        url: {
          add: "/org/actUsProcdef/add",
          edit: "/org/actUsProcdef/edit",
          queryById: "/org/actUsProcdef/queryById"
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