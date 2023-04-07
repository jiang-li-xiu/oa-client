<template>
  <j-modal
      :title="title"
      :width="width"
      :visible="visible"
      switchFullscreen
      :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
      @cancel="handleCancel"
      cancelText="关闭">
      <div class="content">
        <a-spin tip="加载中..." :spinning="loading">
          <a-form-model ref="form" :model="model" :rules="rules">
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
                          <a-radio-group class="radio-line" v-model="model.urgent">
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
                          <a-radio-group class="radio-line" v-model="model.insuredMail">
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
                        <a-form-model-item label="费用性质" prop="costType">
                          <a-radio-group class="radio-line" v-model="model.costType">
                            <a-radio :value="1" name="costType"> 现结寄件 </a-radio>
                            <a-radio :value="2" name="costType"> 外地寄件 </a-radio>
                            <a-radio :value="3" name="costType">
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
                          <a-form-model-item  v-else class="flex-row" label="项目名称" prop="project" :rules="[{ required: true, message: '请输入项目', trigger: 'change'}]">
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
        </a-spin>
      </div>
    <template slot="footer">
      <a-button type="dashed" @click="handleCancel">取消</a-button>
      <a-button type="primary" @click="handleOks" :loading="loading">提交</a-button>
      <a-button type="primary" @click="handleDraft" :loading="loading">保存草稿</a-button>
      <a-button @click="showDraftModal" :loading="loading">草稿箱({{total}})</a-button>
    </template>
    <draft-modal :modalWidth="800" @edit="reEdit" @change="draftChange" ref="draft"></draft-modal>
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
  </j-modal>
</template>

<script>
  import { httpAction, getAction } from '@/api/manage'
  import { getDraftTotal, saveDraft, deleteDraft} from '@/api/workflow/workflow'
  import JSelectProject from '@/views/scrm/modules/JSelectProject'
  import moment from 'dayjs'
  import DraftModal from '@/plugins/modal/DraftModal'
  import { FileHandleMixin } from '@/mixins/FileHandleMixin'
  import { isEmpty } from 'lodash'
  import {addDictItem} from '@/api/api'

  export default {
    name: 'CrmProjectForm',
    mixins:[FileHandleMixin],
    components: {
      JSelectProject,
      DraftModal,
      VNodes: {
        functional: true,
        render: (h, ctx) => ctx.props.vnodes,
      },
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
        model: {
          urgent: 1,
          costType: 1,
          insuredMail: 1,
          files: [], 
          applyDate: moment().format('YYYY-MM-DD'),
          userName: this.$store.getters.userInfo.realname,
          userId: this.$store.getters.userInfo.id
        },
        dict:{
          dictId:'1611247374978990081'
        },
        // 当前模式 0-添加 1-编辑 2-详情
        type: 0,
        projectList: [], //项目信息
        depOptions: [],
        confirmLoading: false,
        url: {
          create: "/flw/flwExpressMail/create",
          edit: "/flw/flwExpressMail/edit",
          queryById: "/flw/flwExpressMail/queryById"
        },
        title:'发起审批',
        width:800,
        disableSubmit: false,
        // 加载动画开关
        loading: false,
        rules: {
          applyDate: [{ required: true, message: '申请日期不能为空', trigger: 'change' }],
          userName: [{ required: true, message: '申请人不能为空', trigger: 'blur' }],
          depart: [{ required: true, message: '申请部门不能为空', trigger: 'blur' }],
          arrivalDays: [{ required: true, message: '到货时间不能为空', trigger: 'blur' }],
          haulage: [{ required: true, message: '预估运费不能为空', trigger: 'blur' }],
          mailItems: this.rules.reqWithMsg(1, 250, '物品名称不能为空'),
          recipient: this.rules.reqWithMsg(1, 250, '收件人信息不能为空'),
          payerPhone: [{ validator: this.validateMobile }],
        },
        validatorRules: {
          itemText:  [{required: true, message: '请输入名称!'}],
          itemValue:  [{required: true, message: '请输入数据值!', trigger: 'blur'},{validator: this.validateItemValue, trigger: 'blur'}],
        },
        contractDisabled: true,
        total:0,
        selected:true,
        logItems: [],
        drawerShow: false
      }
    },
    computed: {

    },

    created () {
       //备份model原始值
      this.modelDefault = JSON.parse(JSON.stringify(this.model));
      this.getCurrentUserDepart();
      this.draftTotal();
      this.logistics();
    },
    mounted() {
      
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
        httpAction('/sys/dict/getDictItems/express_coding', null, "get").then((res)=>{
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

      /**部门选择处理 */
      getCurrentUserDepart(){
        getAction('sys/sysDepart/getCurrentUserDepart').then(res=>{
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
        this.model.departName = label.componentOptions.children[0].text
      },
      /**部门数据处理结束 */
      /**校验是否为数字处理 */
      isNumber(val){
        if (!/^[0-9]+.?[0-9]*$/g.test(val)) {
          val = 0;
        }
        return Number(val)
      },
      /**校验是否为数字处理end */
      handleCancel(){
        this.model = {
          files:[],
        },
        this.$emit('close')
      },
      /**项目选择开始*/
      handelChange(id, row){
        if(row && row.length > 0){
          this.model.projectCode = row[0].projectNo
          this.model.projectName = row[0].projectName
          this.contractDisabled = false
        }else{
          this.model.projectCode = ''
          this.model.projectName = ''
          this.contractDisabled = true
        }
      },
      /**项目选择结束*/
      handleOks(){
        const that = this;
        // 触发表单验证
        this.$refs.form.validate(valid => {
          if (valid) {
            that.confirmLoading = true;
            let httpUrl = this.url.create;
            let method = 'post';
            this.model.processDefId = this.record.procdefId;
            this.model.tables = this.record.linkTable;
            httpAction(httpUrl, this.model, method).then((res)=>{
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

      /**自定义校验开始 */
      validateMobile(rule, value, callback) {
        if (!value || new RegExp(/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/).test(value)) {
          callback()
        } else {
          callback('手机号码格式不正确!')
        }
      },
      validateItemValue(rule, value, callback){
        let param = {
          itemValue:value,
          dictId:this.dict.dictId,
        }
        if(value){
          let reg=new RegExp("[`~!@#$^&*()=|{}'.<>《》/?！￥（）—【】‘；：”“。，、？]")
          if(reg.test(value)){
            callback("数据值不能包含特殊字符！")
          }else{
            //update--begin--autor:lvdandan-----date:20201203------for：JT-27【数据字典】字典 - 数据值不可重复
            getAction("/sys/dictItem/dictItemCheck", param).then((res)=>{
              if(res.success){
                callback()
              }else{
                callback(res.message);
              }
            });
            //update--end--autor:lvdandan-----date:20201203------for：JT-27【数据字典】字典 - 数据值可重复
          }
        }else{
          callback()
        }
      },
      /**自定义校验结束 */

      /**草稿处理开始 */
      /*使用草稿数据*/
      reEdit(formData){
        this.selected = !isEmpty(formData.projectId)
        this.model = formData
        this.fileList = formData.files
      },
      /**草稿删除变化 */
      draftChange(){
        this.draftTotal()
      },      
      /**草稿数量 */
      draftTotal(){
        getDraftTotal({modelId: this.record.modelId}).then((res) => {
          if (res.success) {
            this.total = res.result
          }
        })
      },
      /**打开草稿列表 */
      showDraftModal(){
        this.$refs.draft.showModal(this.record.modelId)
      },
      /**流程数据保存草稿 */
      handleDraft(){
        const that = this;
        // 触发表单验证
        this.$refs.form.validate(valid => {
          if (valid) {
            this.model.tables = this.record.linkTable;
            that.confirmLoading = true;
            saveDraft({modelId:that.record.modelId, formData:that.model}).then((res)=>{
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
      /**草稿处理结束 */
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
.inputWidth {
  width: 60%;
}
.input {
  width: 27%;
}
.text {
  margin-top: 20px;
  padding: 20px;
  font-weight: 600;
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