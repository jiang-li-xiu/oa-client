<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="姓名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="name" :rules="[{ required: true, message: '请输入姓名!' }]">
              <a-input v-model="model.name" placeholder="请输入姓名"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="联系电话" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="phone" :rules=" [{required: true, message: '请输入联系电话!'}]">
              <a-input v-model="model.phone" placeholder="请输入手机号" :max-length="15" ></a-input>
                  <!-- 多个手机号数据处理 -->
                  <!-- <j-vxe-table
                  ref="editableTable1"
                  toolbar
                  row-number
                  row-selection
                  keep-source
                  :dataSource="model.phone"
                  :columns="columns"
                  style="margin-top: 8px;"/> -->
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="性别" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="sex">
              <a-select placeholder="性别" v-model="model.sex" >
                <a-select-option value="1">男</a-select-option>
                <a-select-option value="2">女</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="邮箱" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="email" :rules="[{ required: false, type: 'email', message: '邮箱格式不正确', trigger: 'blur' }]">
              <a-input v-model="model.email" placeholder="请输入邮箱"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="生日" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="birthday">
              <a-date-picker valueFormat="YYYY-MM-DD"  v-model="model.birthday"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="部门" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="dept">
              <a-input v-model="model.dept" placeholder="请输入部门"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="职务" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="post">
              <a-input v-model="model.post" placeholder="请输入职务"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="级别" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="level">
              <a-select
                v-model="model.level"
                show-search
                placeholder="请选择"
                :options="level"
                :filter-option="true"
              ></a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="决策关系" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="decision">
              <a-select
                v-model="model.decision"
                show-search
                placeholder="请选择"
                :options="decision"
                :filter-option="true"
              ></a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="爱好" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="hobby">
              <a-input v-model="model.hobby" placeholder="请输入爱好"  ></a-input>
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
  </a-spin>
</template>

<script>

  import { httpAction, getAction } from '@/api/manage'
  import { validateDuplicateValue } from '@/utils/util'
  import { VALIDATE_FAILED, getRefPromise, validateFormModelAndTables } from '@/components/jeecg/JVxeTable/utils/vxeUtils'
  import { JVXETypes } from '@/components/jeecg/JVxeTable'

  export default {
    name: 'CrmCustomLiaisonForm',
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
          sm: { span: 3 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 20 },
        },
        confirmLoading: false,
        columns: [
          {
            title: '类型',
            key: 'type',
            width: '40%',
            type: JVXETypes.select,
            options: [ // 下拉选项
              { title: '工作', value: '工作' },
              { title: '手机', value: '手机' },
              { title: '住址', value: '住址' },
              { title: '主要', value: '主要' },
              { title: '传真', value: '传真' },
              { title: '其他', value: '其他' },
            ],
            defaultValue: '工作',
            validateRules: [{ required: true, message: '${title}不能为空' }],
            placeholder: '请选择${title}'
          },
          {
            title: '电话',
            key: 'phone',
            width: '40%',
            type: JVXETypes.input,
            defaultValue: '',
            placeholder: '请输入${title}',
            validateRules: [{
              pattern: '^1(3|4|5|7|8)\\d{9}$  ',
              message: '${title}格式不正确'
            }]
          }
        ],
        level:[
          {value:'高层', label:'高层'},
          {value:'中层', label:'中层'},
          {value:'基础', label:'基础'}
        ],
        decision:[
          {value:'关键决策人', label:'关键决策人'},
          {value:'分项决策人', label:'分项决策人'},
          {value:'商务决策人', label:'商务决策人'},
          {value:'技术决策人', label:'技术决策人'},
          {value:'财务决策人', label:'财务决策人'},
          {value:'使用人', label:'使用人'},
          {value:'意见影响人', label:'意见影响人'},
          {value:'普通人', label:'普通人'}
        ],
        url: {
          add: "/org/crmCustomLiaison/add",
          edit: "/org/crmCustomLiaison/edit",
          queryById: "/org/crmCustomLiaison/queryById"
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
      /**多个时的数据处理开始 */
      // 获取所有的editableTable实例
      getAllTable() {
        return Promise.all([
          getRefPromise(this, 'editableTable1'),
        ])
      },
      /** 触发表单验证 */
      validateFields() {
        this.getAllTable().then(tables => {
          /** 一次性验证主表和所有的次表 */
          return validateFormModelAndTables(this.$refs.form, this.model, tables)
        }).then(allValues => {
          
          let formData = this.classifyIntoFormData(allValues)
          let showData = this.classifyShowData(allValues)
          // 返回上一页
          this.$emit('ok', formData, showData)
        }).catch(e => {
          console.error(e)
       })
      },
      /**整理展示数据 */
      classifyShowData(allValues){
        let tablesValue = allValues.tablesValue[0].tableData
        let name = allValues.formValue.name
        for(var i = 0; i < tablesValue.length; i++){
          tablesValue[i].name = name;
        }
        return tablesValue;
      },
      /** 整理成formData */
      classifyIntoFormData(allValues) {
        let orderMain = Object.assign(this.model, allValues.formValue)
        return {
          ...orderMain, // 展开
          phone: allValues.tablesValue[0].tableData,
        }
      },
       /**多个时的数据处理结束 */
      validatePhone(rule, value, callback){
        if(!value){
          callback()
        }else if(!new RegExp(/^1[3|4|5|7|8|9][0-9]\d{8}$/).test(value)){
          callback("请输入正确格式的手机号码!");
        }else{
          callback()
        }
      },
      submitForm () {
        const that = this;
        //this.validateFields(); // 多个时的数据处理
        // 触发表单验证
        this.$refs.form.validate(valid => {
          if (valid) {
            that.confirmLoading = true;
            if(!this.model.key){
              this.model.key = new Date().getTime();
            }
            this.$emit('ok', this.model)
            that.confirmLoading = false;
            // let httpurl = '';
            // let method = '';
            // if(!this.model.id){
            //   httpurl+=this.url.add;
            //   method = 'post';
            // }else{
            //   httpurl+=this.url.edit;
            //    method = 'put';
            // }
            // httpAction(httpurl,this.model,method).then((res)=>{
            //   if(res.success){
            //     that.$message.success(res.message);
            //     that.$emit('ok');
            //   }else{
            //     that.$message.warning(res.message);
            //   }
            // }).finally(() => {
            //   that.confirmLoading = false;
            // })
          }
        })
      },
    }
  }
</script>