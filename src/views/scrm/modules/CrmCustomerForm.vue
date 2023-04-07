<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row justify="start">
          <div class="special-block">
            <div class="prefix-wrap">
              <span class="preLine "></span>
              <span class="content">基础信息</span>
            </div>
          </div>
          <a-col :span="12">
            <a-form-model-item label="客户名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="customName">
              <a-input v-model="model.customName" placeholder="请输入客户名称" :max-length="50"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item v-if="customNoShow" label="客户编号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="customNo">
              <a-input v-model="model.customNo" placeholder="保存后自动生成"  readOnly></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="地区" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="region">
              <j-area-linkage
                ref="area"
                v-model="model.region"
                @change="changeAreaLinkage"
                type="cascader"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="详细地址" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="addr">
              <a-input v-model="model.addr" placeholder="请输入详细地址" :max-length="250"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="行业" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="industry">
              <a-select
                v-model="model.industry"
                show-search
                placeholder="请选择"
                :options="options"
                :filter-option="true"
              ></a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="客户状态" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="customStatus">
              <a-select
                v-model="model.customStatus"
                show-search
                placeholder="请选择"
                :options="statusOptions"
                :filter-option="true"
              ></a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="客户电话" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="phone">
              <a-input v-model="model.phone" placeholder="请输入客户电话多个用‘,’隔开" :max-length="255"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="邮箱" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="email">
              <a-input v-model="model.email" placeholder="请输入邮箱" :max-length="20"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <div class="special-block">
              <div class="prefix-wrap">
                <span class="preLine "></span>
                <span class="content">关联信息</span>
              </div>
            </div>
          </a-col>
          <a-col :span="24">
              <a-table :dataSource="dataSource" :columns="columns" :pagination="false">
                <span slot="action" slot-scope="text, record, index">
                  <a @click="handleEdit(record, index)">编辑</a>
                  <a-divider type="vertical" />
                  <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record,index)">
                    <a>删除</a>
                  </a-popconfirm>
                </span>
              </a-table>
              <a-button type="dashed" style="width: 98%; margin-top: 10px; margin-bottom: 6px;" @click="addRowCustom">
                <a-icon type="plus" /> 添加联系人
              </a-button>
          </a-col>
          <a-col :span="24">
            <div class="special-block">
              <div class="prefix-wrap">
                <span class="preLine "></span>
                <span class="content">扩展信息</span>
              </div>
            </div>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="客户类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="customType">
              <a-select
                v-model="model.customType"
                show-search
                placeholder="请选择"
                :rowKey="index"
                :options="typeOptions"
                :filter-option="true"
              ></a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="客户性质" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="customNature">
              <a-select
                v-model="model.customNature"
                show-search
                placeholder="请选择"
                :options="natureOptions"
                :filter-option="true"
              ></a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="客户级别" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="customLevel">
              <a-select
                v-model="model.customLevel"
                show-search
                placeholder="请选择"
                :options="levelOptions"
                :filter-option="true"
              ></a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="客户来源" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="customSource">
              <a-select
                v-model="model.customSource"
                show-search
                placeholder="请选择"
                :options="sourceOptions"
                :filter-option="true"
              ></a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="客户简介" :labelCol="{xs:{ span: 24 }, sm: {span: 3}}" :wrapperCol="{xs:{ span: 24 }, sm: { span: 20}}" prop="profile">
              <a-textarea  v-model="model.profile" :autoSize ="{minRows:6, maxRows:8}" placeholder="客户简介" show-count="true" :max-length="500"></a-textarea>
            </a-form-model-item>
          </a-col> 
          <a-col :span="12">
            <a-form-model-item label="发票抬头" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="invoice">
              <a-input v-model="model.invoice" placeholder="请输入发票抬头"  :max-length="200"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="税号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="tariffLine">
              <a-input v-model="model.tariffLine" placeholder="请输入税号" :max-length="20"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="银行卡号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="bankAccount">
              <a-input v-model="model.bankAccount" placeholder="请输入银行卡号" :max-length="20"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="开户行" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="bankName">
              <a-input v-model="model.bankName" placeholder="请输入开户行" :max-length="250"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="备注" :labelCol="{xs:{ span: 24 }, sm: {span: 3}}" :wrapperCol="{xs:{ span: 24 }, sm: { span: 20}}" prop="remarks">
              <a-textarea  v-model="model.remarks" :autoSize ="{minRows:6, maxRows:8}" placeholder="请输入备注" :showCount="true" :max-length="500"></a-textarea>
            </a-form-model-item>
          </a-col> 
        </a-row>
      </a-form-model>
    </j-form-container>
    <crm-custom-liaison-modal ref="modalForm" @ok="modalFormOk"></crm-custom-liaison-modal>
  </a-spin>
</template>

<script>

  import { httpAction, getAction, deleteAction } from '@/api/manage'
  import { validateDuplicateValue } from '@/utils/util'
  import CrmCustomLiaisonModal from './CrmCustomLiaisonModal'

  export default {
    name: 'CrmCustomerForm',
    components: {
      CrmCustomLiaisonModal
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
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        options:[
          {value:'金融', label:'金融'},
          {value:'电信', label:'电信'},
          {value:'教育', label:'教育'},
          {value:'高科技', label:'高科技'},
          {value:'政府', label:'政府'},
          {value:'制造业', label:'制造业'},
          {value:'服务', label:'服务'},
          {value:'能源', label:'能源'},
          {value:'零售', label:'零售'},
          {value:'媒体', label:'媒体'},
          {value:'娱乐', label:'娱乐'},
          {value:'咨询', label:'咨询'},
          {value:'非盈利事业', label:'非盈利事业'},
          {value:'公用事业', label:'公用事业'},
          {value:'其他', label:'其他'},
        ],
        typeOptions:[
          {value:'最终客户', label:'最终客户'},
          {value:'渠道客户', label:'渠道客户'},
          {value:'竞争对手', label:'竞争对手'},
          {value:'其他', label:'其他'}
        ],
        natureOptions:[
          {value:'企业客户', label:'企业客户'},
          {value:'个人客户', label:'个人客户'},
          {value:'政府事业单位', label:'政府事业单位'}
        ],
        levelOptions:[
          {value:'大型', label:'大型'},
          {value:'中型', label:'中型'},
          {value:'小型', label:'小型'},
          {value:'微型', label:'微型'}
        ],
        sourceOptions:[
          {value:'公司资源', label:'公司资源'},
          {value:'自主开拓', label:'自主开拓'},
          {value:'网络推广', label:'网络推广'},
          {value:'电话咨询', label:'电话咨询'},
          {value:'渠道代理', label:'渠道代理'},
        ],
        statusOptions:[
          {value:'潜在客户', label:'潜在客户'},
          {value:'初步接触', label:'初步接触'},
          {value:'持续跟进', label:'持续跟进'},
          {value:'成交客户', label:'成交客户'},
          {value:'忠诚客户', label:'忠诚客户'},
          {value:'无效客户', label:'无效客户'},
        ],
        confirmLoading: false,
        validatorRules: {
          customName:[{required: true, message: '请填写客户名称!'}],
          region:[{required: true, message: '请选择地区!'}],
          addr:[{required: true, message: '请填写公司地址!'}],
          industry: [{required: true, message: '请填写所属行业'}],
          liaison: [{required: true, message: '请填写联系人!'}],
          sex:[{required: true, message: '请选择性别!'}],
          phone: [{required: true, message: '请输入联系电话!'}],
          customType: [{required: true, message: '请选择客户类型!'}],
          customNature: [{required: true, message: '请选择客户性质!'}],
          customLevel: [{required: true, message: '请选择客户级别!'}],
          customSource: [{required: true, message: '请选择客户来源!'}],
          profile: [{required: true, message: '请输入客户简介!'}],
          invoice: [{required: true, message: '请输入发票抬头!'}],
          tariffLine: [{required: true, message: '请输入税号!'}],
          bankAccount: [{required: true, message: '请输入银行卡号!'}],
          bankName: [{required: true, message: '请输入开户行!'}],
          email: [{ required: false, type: 'email', message: '邮箱格式不正确', trigger: 'blur' }]
        },
        columns:[
        {
            title: '序号',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },
          {
            title:'姓名',
            align:"center",
            dataIndex: 'name',
            with:100,
            ellipsis: true
          },
          // {
          //   title:'类型',
          //   align:"center",
          //   dataIndex: 'phone',
          //   with:200,
          //   ellipsis: true
          // },
          {
            title:'电话',
            align:"center",
            dataIndex: 'phone',
            with:150,
            ellipsis: true
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            fixed:"right",
            width:120,
            scopedSlots: { customRender: 'action' }
          }
        ],
        dataSource:[],
        url: {
          add: "/scrm/crmCustomer/add",
          edit: "/scrm/crmCustomer/edit",
          queryById: "/scrm/crmCustomer/queryById"
        },
        index:-1,
        customNoShow:false
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
        this.customNoShow = true
        this.edit(this.modelDefault);
      },
      edit(record){
        this.model = Object.assign({}, record);
        this.visible = true;
        this.customNoShow = true
        this.getLiaision(record.id)
      },
      getLiaision(id){
        let that = this;
        getAction(`/scrm/crmCustomLiaison/listAll`,{"customId": id}).then(res=>{
          if (res.success) {
            that.dataSource = res.result
            that.model.liaision = res.result
          } else {
            that.dataSource = []
            that.model.liaision = []
          }
        })
      },
      handleDelete(record, index){
        let that = this;
        let id = record.id
        let dataSource = this.dataSource
        if(id){
          deleteAction(`/scrm/crmCustomLiaison/delete`,{"id": id}).then(res=>{
            if (res.success) {
              that.dataSource.splice(index, 1)
              that.dataSource = dataSource
              that.model.liaision = dataSource
            } else {
              that.dataSource.splice(index, 1)
              that.dataSource = dataSource
              that.model.liaision = dataSource
            }
          })
        }else{
          dataSource.splice(index, 1)
          that.dataSource = dataSource
          that.model.liaision = dataSource
        }
      },
      handleEdit (record, index) {
        this.index = index;
        this.visible=true
        this.title="联系人"
        this.$refs.modalForm.edit(record, index);
      },
      //获取省级信息
      changeAreaLinkage(val) {
        const arr = []
        this.$refs['area'].areaData.getAreaBycode(val, arr, 3)
        this.model.city = `${arr[0]}${arr[1]}${arr[2]}`
      },
      addRowCustom () {
        this.visible=true
        this.title="联系人"
        this.$refs.modalForm.add()
      },
      modalFormOk(formData){
        let that = this;
        let dataSource = that.dataSource
        if(that.index != -1){
          dataSource.splice(that.index, 1, formData)
        }else{
          dataSource.push(formData)
        }
        that.dataSource = dataSource
        that.index = -1
        that.model.liaision = dataSource
      },
      filterOption (input, option){
        return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
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
        }else if(!new RegExp(/^(1[0-9]{10}|[0-9]{3,4}-[0-9]{8}-[0-9]{4})(\,(1[0-9]{10}|[0-9]{3,4}-[0-9]{8}-[0-9]{4}))*$/).test(value)){
          callback("请输入正确格式的手机号码!");
        }else{
          callback()
        }
      },
    }
  }
</script>
<style lang="less" scoped>
  .prefix-wrap {
    width: 100%;
    height: 38px;
    line-height: 38px;
    margin-bottom: 12px;
    font-weight: 500;

    &:deep(.preLine) {
      display: inline-block;
      background-color: #1890FF;
      width: 2px;
      top: 0;
      border: 20px;
      bottom: 0;
      height: 16px;
      left: 0;
      margin: auto;
    }
    &:deep(.content) {
      font-size: 16px;
      margin-left: 16px;
      font-weight: 500;
      left: -12px;
      color: #292e33;
    }
  }
  .ant-empty-normal{
    margin: 0 !important;
  }
</style>
