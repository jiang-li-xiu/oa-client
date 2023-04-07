<template>
  <div>
    <a-spin :spinning="confirmLoading">
      <j-form-container>
        <a-form-model ref="form" :model="model" :rules="validatorRules" :slot="disabled?'detail':'edit'">
          <a-row>
            <a-card title="基本信息" :bordered="false">
              <a-col :span="12">
                <a-form-model-item label="部门" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="depart" :rules="[{ required: true, message: '请选择部门' }]">
                  <a-select
                    ref="select"
                    v-model="model.depart"
                    :options="depOptions"
                    :field-names="{ label: 'name', value: 'id'}"
                    @change="handleChange"
                    placeholder="请选择部门"
                    :disabled="formDisabled"
                  ></a-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="申请日期" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="applyDate" :rules="[{ required: true, message: '请选择申请日期' }]">
                  <j-date placeholder="请选择申请日期" v-model="model.applyDate"  style="width: 100%" :read-only="formDisabled"/>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="周期" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="cycle" :rules="[{ required: true, message: '请选择周期' }]">
                  <a-select 
                    ref="select"
                    v-model="model.cycle" 
                    default-value="月度"
                    @change="cycleChange"
                    placeholder="请选择周期"
                    :disabled="formDisabled"
                    >
                    <a-select-option value="月度">月度</a-select-option>
                    <a-select-option value="季度">季度</a-select-option>
                    <a-select-option value="年度">年度</a-select-option>
                    <a-select-option value="自定义">自定义</a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="开始日期" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="timeStart" :rules="[{ required: true, message: '请选择开始日期' }]">
                  <div class="cycle-date" style="display:flex; flex-direction:row; flex-wrap: nowrap;">
                    <j-date placeholder="请选择开始日期" v-model="model.timeStart" :read-only="formDisabled" />
                    <j-date placeholder="请选择结束日期" v-model="model.timeEnd" style="margin-left:6px;" :read-only="formDisabled"/>
                  </div>
                </a-form-model-item>
              </a-col>
            </a-card>
            <a-card title="预算信息" :bordered="false">
              <j-vxe-table
                ref="vTable"
                keep-source
                :loading="loading"
                :dataSource="model.costs"
                :columns="columns"
                style="margin-top: 8px;"
                
              >
                <!-- <template v-slot:toolbarSuffix>
                  <a-upload
                    ref="upload"
                    action="/"
                    :show-upload-list="false"
                    :before-upload="batchImport">
                    <a-button>导入</a-button>
                  </a-upload>
                  <a-button @click="handleExcelModel">下载模板</a-button>
                </template> -->
              </j-vxe-table>
            </a-card>
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
    </a-spin>
  </div>
</template>

<script>

  import { postAction, getAction } from '@/api/manage'
  import { validateDuplicateValue } from '@/utils/util'
  import { JVXETypes } from '@/components/jeecg/JVxeTable'
 

  export default {
    name: 'CrmProjectForm',
    components: {
  
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
        model:{
          costs:[]
        },
        liaison:[],
        liaisonData:[],
        model2:{comment: ''},
        model3:{node:''},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        targetKey:'',
        visible2:false,
        nodeList:[],
        depOptions:[],
        confirmLoading: false,
        loading: false,
        formDisabled: true,
        validatorRules: {
        },
        columns: [
          {
            title: '费用大类',
            key: 'categories',
            type: JVXETypes.select,
            width: '120px',
            options: [
              {title: '采购费', value: '采购费'},
              {title: '采购尾款', value: '采购尾款'},
              {title: '工程费用', value: '工程费用'},
              {title: '工程尾款', value: '工程尾款'},
              {title: '劳务费', value: '劳务费'},
              {title: '日常费用', value: '日常费用'},
              {title: '差旅费用', value: '差旅费用'},
              {title: '其他', value: '其他'}
            ],
            validateRules: [
              {
                required: true, // 必填
                message: '请选择${title}' // 显示的文本
              }
            ]
          },
          {
            title: '费用名称',
            key: 'name',
            type: JVXETypes.input,
            width: '180px',
            defaultValue: '',
            placeholder: '请输入${title}',
            validateRules: [
              {
                required: true, // 必填
                message: '请输入${title}' // 显示的文本
              }
            ]
          },
          {
            title: '费用类型',
            key: 'type',
            type: JVXETypes.select,
            width: '120px',
            options: [
              {title: '固定', value: '固定'},
              {title: '灵活', value: '灵活'}
            ],
            validateRules: [
              {
                required: true, // 必填
                message: '请输入${title}' // 显示的文本
              }
            ]
          },
          {
            title: '数量',
            key: 'num',
            type: JVXETypes.input,
            width: '120px',
            placeholder: '请输入${title}',
            validateRules: [
              {
                required: true, // 必填
                message: '请输入${title}' // 显示的文本
              }
            ]
          },
          {
            title: '单位',
            key: 'unit',
            type: JVXETypes.input,
            width: '120px',
            defaultValue: '',
            placeholder: '请输入${title}',
            validateRules: [
              {
                required: true, // 必填
                message: '请输入${title}' // 显示的文本
              }
            ]
          },
          {
            title: '单价',
            key: 'price',
            type: JVXETypes.inputNumber,
            width: '180px',
            validateRules: [
              {
                pattern: /^(([1-9][0-9]*)|([0]\.\d{0,2}|[1-9][0-9]*\.\d{0,5}))$/, // 正则
                message: '需符合金额规则'
              }
            ]
          },
          {
            title: '金额',
            key: 'amount',
            type: JVXETypes.inputNumber,
            width: '180px',
            // 【统计列】sum = 求和
            statistics: ['sum'],
            validateRules: [
              {
                required: true, // 必填
                message: '请输入${title}' // 显示的文本
              },
              {
                pattern: /^(([1-9][0-9]*)|([0]\.\d{0,2}|[1-9][0-9]*\.\d{0,5}))$/, // 正则
                message: '需符合金额规则'
              }
            ]
          },
          {
            title: '备注',
            key: 'remarks',
            type: JVXETypes.input,
            width: '180px',
            defaultValue: '',
            placeholder: '请输入${title}'
          },
        ],
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
    },
    created () {
      
    },
    mounted () {
      this.handel();
    },
    methods: {
      handel () {
        
        let that = this;
        getAction("/scrm/flwExpenseBudget/queryById",{id:this.record.businessKey}).then(res=>{
          if(res.success){
            that.model = res.result
            this.getCurrentUserDepart(res.result.depart);
          }else{
            that.$message.warning(res.message);
          }
        })
      },
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
            postAction("/scrm/flwExpenseBudget/complete", params).then(res=>{
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
            that.confirmLoading = true
            postAction("/scrm/flwExpenseBudget/reject", {procInsId:that.record.procInsId, taskId: that.record.taskId,  comment: that.model2.comment}).then(res=>{
              if(res.success){
                that.$message.success(res.message);
                that.handleCancel()
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(()=>{
              that.confirmLoading = false
            })
          }
        })
      },
      cycleChange(val){
        let data = generateDate(val);
        this.model.timeStart = data.timeStart
        this.model.timeEnd = data.timeEnd
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
.ant-card{
  &:deep(.ant-card-head){
    padding: 0 !important;
    min-height: auto;
    .ant-card-head-title{
      padding: 0 !important;
    }
  }
  &:deep(.ant-card-body){
    padding: 12px 0;
  }
}
.ant-select-disabled{
  color: rgba(0, 0, 0, 0.65) !important;
  background-color:#fff !important;
  &:deep(.ant-select-disabled .ant-select-selection){
    background-color:#fff !important;
  }
}

</style>