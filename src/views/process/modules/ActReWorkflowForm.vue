<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">
    <a-spin :spinning="confirmLoading">
      <j-form-container>
        <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
          <a-row>
            <a-col :span="24">
              <a-form-model-item label="流程名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="processName">
                <a-input v-model="model.processName" placeholder="请输入流程名称" :read-only="readOnly"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="可见范围" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="visibleSummary">
                <org-transfer-modal
                  ref="orgTransfer"
                  v-model="model.visibleSummary"
                  :multi="true"
                  @back="backDepartInfo"
                  :checkedData="this.checkedData"
                ></org-transfer-modal>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="图标" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="icon">
                <a-input style="display:none;" v-model="model.icon"></a-input>
                <div style="font-size:24px;display: flex; align-items: center;">
                  <a-icon v-if="model.icon" :type="model.icon" :style="{'color':model.iconColor}"/>
                  <a-tooltip title="选择图标">
                    <a-icon type="file-jpg" style="margin:0 8px 0 8px; color: #1890ff;" @click="selectIcons"/>
                  </a-tooltip>
                  <a-tooltip title="选择图标颜色">
                    <el-color-picker @active-change="colorChange" :predefine="predefine" v-model="model.iconColor" color-format="hex" size="small" popper-class="color-picker"></el-color-picker>
                  </a-tooltip>
                </div>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="表单类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="formType">
                <a-radio-group v-model="model.formType" @change="formTypeChange">
                  <a-radio :value="2">固定表单</a-radio>
                  <a-radio :value="1">在线表单</a-radio>
                </a-radio-group>
              </a-form-model-item>
            </a-col>
            <a-col :span="24" v-if="model.formType == 1">
              <a-form-model-item label="流程表单" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="processForm" :rules="[{ required: true, message: '请选择流程表单' }]">
                <a-tooltip title="流程表单组件名称" color="#f50"></a-tooltip>
                <a-input v-model="model.processForm" placeholder="请输入流程表单"></a-input>
              </a-form-model-item>
            </a-col>
            <div v-if="model.formType == 2">
              <a-col :span="24">
                <a-form-model-item label="数据表名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="linkTable">
                  <a-input v-model="model.linkTable" placeholder="请输入数据表名"></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item label="提交表单" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="submitForm" :rules="[{ required: true, message: '请输入提交表单路径' }]">
                  <a-input v-model="model.submitForm" placeholder="请输入提交表单路径"></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item label="处理表单" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="handelForm" :rules="[{ required: true, message: '请输入流程处理表单路径' }]">
                  <a-input v-model="model.handelForm" placeholder="请输入流程处理表单路径"></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item label="服务名称" htmlFor="服务名称为微服务yml文件中定义的spring.application.name，业务前缀为需要处理的业务Controller的RequestMapping中的值" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="serverName">
                  <a-input v-model="model.serverName" placeholder="输入服务名如：jeecg-supplier"/>
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item label="业务地址" htmlFor="服务名称为微服务yml文件中定义的spring.application.name，业务前缀为需要处理的业务Controller的RequestMapping中的值" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="serverPrefix">
                  <a-input v-model="model.serverPrefix" placeholder="输入业务前缀如：/scrm/flwPaymentApply"/>
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item label="条件字段" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <div class="conditions-box">
                    <a-row type="flex" :gutter="16">
                      <a-col :span="7">字段名称</a-col>
                      <a-col :span="7">字段备注</a-col>
                      <a-col :span="7">字段类型</a-col>
                      <a-col :span="3">操作</a-col>
                    </a-row>
                    <a-row type="flex" :gutter="16" v-for="(item, index) in model.conditions" :key="index">
                      <a-col :span="7">
                        <a-form-model-item :prop="'conditions.' + index + '.name'" :rules="[{required: true, message: '请输入字段名称', trigger: 'blur'}]">
                          <a-input placeholder="字段名称" v-model="item.name" />
                        </a-form-model-item>
                      </a-col>
                      <a-col :span="7">
                        <a-form-model-item :prop="'conditions.' + index + '.showName'" :rules="[{required: true, message: '请输入字段描述', trigger: 'blur'}]">
                          <a-input placeholder="字段备注" v-model="item.showName" />
                        </a-form-model-item>
                      </a-col>
                      <a-col :span="7">
                        <a-form-model-item :prop="'conditions.' + index + '.type'" :rules="[{required: true, message: '请选择字段类型', trigger: 'blur'}]">
                          <a-select
                            v-model="item.type"
                            style="width: 100%"
                            placeholder="请选择字段类型"
                            :options="types"
                          ></a-select>
                        </a-form-model-item>
                      </a-col>
      
                      <a-col :span="3">
                        <a-form-model-item>
                          <a-icon  type="minus-circle" @click="delRowCustom(index)"  style="fontSize :20px"/>
                        </a-form-model-item>
                      </a-col>
                    </a-row>
                    <a-button type="dashed" style="width: 98%;margin-top: 10px" @click="addRowCustom">
                      <a-icon type="plus" /> 添加条件字段
                    </a-button>
                  </div>
                </a-form-model-item>
              </a-col>
            </div>
            <a-col :span="24">
              <a-form-model-item label="描述" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="description">
                <a-textarea v-model="model.description" :autoSize ="{minRows:6, maxRows:8}" placeholder="请输入描述" :read-only="readOnly"></a-textarea>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </j-form-container>
      <!-- 选择图标 -->
      <icons @choose="handleIconChoose" @close="handleIconCancel" :iconChooseVisible="iconChooseVisible"></icons>
    </a-spin>
  </a-modal>
</template>


<script>

  import { httpAction, getAction } from '@/api/manage'
  import OrgTransferModal from '@/plugins/modal/OrgTransferModal'
  import Icons from '../../system/modules/icon/Icons'
  export default {
    name: 'ActReWorkflowForm',
    components: {
      Icons,
      OrgTransferModal
    },
    props: {
    },
    data () {
      return {
        title: '操作',
        visible: false,
        model:{
          conditions:[{}]
        },
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        types:[
          {value:'String', label:'String'},
          {value:'Number', label:'Number'},
          // {value:'Double', label:'Double'},
          // {value:'BigDecimal', label:'BigDecimal'}
        ],
        confirmLoading: false,
        validatorRules: {
          processName: [{ required: true, message: '请输入流程名称' }],
          //visibleSummary:  [{ required: true, message: '请选择可见范围' }] ,
          icon: [{ required: true, message: '请选择图标' }] ,
          formType: [{ required: true, message: '请选择表单类型' }]
        },
        url: {
          add: "/workflow/actReWorkflow/add",
          edit: "/workflow/actReWorkflow/edit",
          queryById: "/workflow/actReWorkflow/queryById"
        },
        readOnly:false,
        iconChooseVisible: false,
        textVals: '',
        checkedData: [],
        predefine:[
          '#0089ff',
          '#00C458',
          '#FC943D',
          '#FB602D',
          '#ffd700',
          '#90ee90',
          '#00ced1',
          '#c71585',
        ]
      }
    },
    created () { },
    methods: {
	    handleOrgTransfer() {
	      this.$refs.orgTransfer.openModal()
	    },
      backDepartInfo(info, textVals, checkedData) {
        // this.model.visibleSummary = info
        this.model.departIds = this.model.selecteddeparts;
        this.nextDepartOptions = info.map((item,index,arr)=>{
          let c = {
            name: item.name || item.roleName,
            visibleValue: item.id || item.roleId + '',
            visibleType: item.type || 'role',
          }
          return c;
        })
	      this.model.visibleSummary = textVals
        this.model.visible = this.nextDepartOptions
        this.model.checkedData = checkedData //**已选择的
        this.checkedData = checkedData
      },
      addRowCustom () {
        let conditions = this.model.conditions;
        if(!conditions){
          this.model.conditions = [];
        }
        this.model.conditions.push({});
        this.$forceUpdate();
      },

      delRowCustom (index) {
        console.log(index)
        this.model.conditions.splice(index,1);
        this.$forceUpdate();
      },
      add () {
        this.edit();
	      this.checkedData = []
      },
      edit (record) {
        this.model = Object.assign({}, record)
      console.log(this.model)
      setTimeout(() => {
        this.model.visibleSummary = record.visibleSummary
        this.$nextTick(() => {
          if (this.model && this.model.visibleSummary) {
            this.textVals = this.model.visibleSummary //打开时回显可见范围
          }
          if (this.model && this.model.checkedData) {  //**后台返回下checkedData
            this.checkedData = this.model.checkedData
          }
        })
      }, 0)
        this.visible = true
        this.model = Object.assign({
          conditions: [],
        }, record)
        // if(record.id){
        //   this.readOnly=true
        // }else{
        //   this.readOnly=false
        // }
      },
      selectIcons(){
        this.iconChooseVisible = true
      },
      formTypeChange(val){
        let value = val.target.value;
        this.model.formType = value;
      },
      handleIconChoose (value) {
        console.log(value)
        this.model.icon = value
        this.iconChooseVisible = false
      },
      handleIconCancel () {
        this.iconChooseVisible = false
      },
      close() {
        this.$emit('close')
        this.visible = false
        this.$refs.form.resetFields();
	      this.$refs.orgTransfer.textVals = ''
        // 清空数据
        this.textVals = ''
        this.checkedData = []
        this.model = {}
      },
      handleOk () {
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
                that.close()
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
            })
          }
         
        })
      },
      validateRequire(rule, value, callback){
        if(!value){
          callback(请输入正确格式的手机号码)
        }
      },
      handleCancel() {
        this.close()
      },
      /**颜色选择变化 */
      colorChange(val){
        const reg = /[0-9]\d+/g
        const getArr = val.match(reg)
        let hexStr = '#'+((getArr[0] << 16) | (getArr[1]  << 8) | getArr[2] ).toString(16)
        this.model.iconColor = hexStr.toUpperCase()
      }
    }
  }
</script>

<style lang="less" scoped>
.conditions-box{
  &:deep(.ant-form-item){
    margin-bottom: 0 !important;
  }
}
.el-color-picker{
  &:deep(.el-color-picker__trigger){
    border: none;
    .el-color-picker__color{
      border: none;
    }
  }
}

</style>