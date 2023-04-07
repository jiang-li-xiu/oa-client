<template>
    <j-modal
    :title="title"
    :width="width"
    :visible="visible"
    switchFullscreen
    :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
    @cancel="handleCancel"
    cancelText="关闭">
    <a-spin :spinning="confirmLoading">
      <j-form-container :disabled="formDisabled">
        <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
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
                  ></a-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="申请日期" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="applyDate" :rules="[{ required: true, message: '请选择申请日期' }]">
                  <j-date placeholder="请选择申请日期" v-model="model.applyDate"  style="width: 100%" />
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
                    <j-date placeholder="请选择开始日期" v-model="model.timeStart" />
                    <j-date placeholder="请选择结束日期" v-model="model.timeEnd" style="margin-left:6px;"/>
                  </div>
                </a-form-model-item>
              </a-col>
            </a-card>
            <a-card title="预算信息" :bordered="false">
              <j-vxe-table
                ref="vTable"
                toolbar
                row-number
                row-selection
                drag-sort
                keep-source
                :loading="loading"
                :dataSource="model.costs"
                :columns="columns"
                style="margin-top: 8px;"
              >
                <template v-slot:toolbarSuffix>
                  <a-upload
                    ref="upload"
                    action="/"
                    :show-upload-list="false"
                    :before-upload="batchImport">
                    <a-button>导入</a-button>
                  </a-upload>
                  <a-button @click="handleExcelModel">下载模板</a-button>
                </template>
              </j-vxe-table>
            </a-card>
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
  import { generateDate } from '@/utils/util'
  import { JVXETypes } from '@/components/jeecg/JVxeTable'
  import * as XLSX from 'xlsx/xlsx.mjs'
  import DraftModal from '@/plugins/modal/DraftModal'

  export default {
    name: 'FlwExpenseBudgetForm',
    components: {
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
          cycle: '月度',
          costs: []
        },
        title:'费用报销申请',
        width:800,
        disableSubmit: false,
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
        depOptions:[],
        loading: false,
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
        dataSource: [],
        url: {
          create: "/scrm/flwExpenseBudget/create",
        },
        total:0
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
      this.getCurrentUserDepart();
      let data = generateDate('月度');
      this.model.timeStart = data.timeStart;
      this.model.timeEnd = data.timeEnd;
      this.draftTotal()
    },
    methods: {
      add () {
        this.edit(this.modelDefault);
      },
      edit (record) {
        this.model = Object.assign({}, record);
        this.visible = true;
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
      handleOks () {
        const that = this;
        // 触发表单验证
        this.$refs.form.validate(valid => {
          if (valid) {
            //验证子表单
            const values = this.$refs.vTable.getTableData()
            if(!values || values.length <= 0){
              this.$message.warning('预算信息不能为空')
              return
            }
            this.$refs.vTable.validateTable().then(errMap => {
              if (!errMap) {
                that.confirmLoading = true;
                let httpurl = this.url.create;
                let method = 'post';
                this.model.costs = values;
                that.model.processDefId = that.record.procdefId;
                that.model.tables = that.record.linkTable;
                //构建variables
                that.initializeVar();
                httpAction(httpurl,this.model,method).then((res)=>{
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
          }
        })
      },
      /**导入数据 */
      batchImport(file){
        let that = this;
        if(file.length <= 0){
          return false;
        } else if(!/\.(xls|xlsx)$/.test(file.name.toLowerCase())) {
          console.log("上传格式不正确，请上传xls或者xlsx格式");
          return false;
        }
        //读取数据
        const fileReader = new FileReader();
        fileReader.onload = (ev) => {
          try{
            const workbook = XLSX.read(ev.target.result, {
              type: "binary",
            });
            //取第一张表，wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
            const wsname = workbook.SheetNames[0];
             //生成json表格内容，wb.Sheets[Sheet名]获取第一个Sheet的数据
            const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]);
            // ...对数据进行自己需要的操作
            const m = that.dealExcel(ws) 
            that.model.costs = that.model.costs.concat(m)
          }catch(e){
            that.$message.error("读取失败！")
          }
        };
        fileReader.readAsBinaryString(file);
        return false
      },
      dealExcel(ws){
        let keymap = {
          // 我们要转换的开头
          '*费用大类': "categories",
          '*费用名称': "name",
          '*费用类型': "type",
          '*数量': "num",
          '*单位': "unit",
          '单价': "price",
          '*金额': "amount",
          '备注': "remarks"
        }
        ws.forEach((sourceObj) => {
          let arr = new Array()
          Object.keys(sourceObj).map((keys) => {
            sourceObj[keymap[keys]] = sourceObj[keys]
            delete sourceObj[keys]
          })
        })
        return ws
      },
      getHeader(sheet) {
        const XLSX = xlsx;
        const headers = [];
        const range = XLSX.utils.decode_range(sheet["!ref"]); // worksheet['!ref'] 是工作表的有效范围
        let C;
        /* 获取单元格值 start in the first row */
        const R = range.s.r; // 行 // C 列
        let i = 0;
        for (C = range.s.c; C <= range.e.c; ++C) {
          var cell =
            sheet[
              XLSX.utils.encode_cell({ c: C, r: R })
            ]; /* 根据地址得到单元格的值find the cell in the first row */
          var hdr = "UNKNOWN" + C; // 如果有空表头，会替换为您想要的默认值replace with your desired default
          // XLSX.utils.format_cell 生成单元格文本值
          if (cell && cell.t) hdr = XLSX.utils.format_cell(cell);
          if(hdr.indexOf('UNKNOWN') > -1){
            if(!i) {
              hdr = '__EMPTY';
            }else {
              hdr = '__EMPTY_' + i;
            }
            i++;
          }
          headers.push(hdr);
        }
        return headers;
      },
      handleReadExcel(file){
        const that = this
        const fileReader = new FileReader()
        fileReader.onload = ev => {
          try {
            const fileData = ev.target.result
            const workbook = XLSX.read(fileData, {
              type:'binary'
            })
            const wsname = workbook.SheetNames[0] // 取第一张表
            const snArr = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]) // 生成json表格内容
            that.dataGrid.snSet.clear() // 清空一下之前的Set
            snArr.forEach(item => {
              that.dataGrid.snSet.add(item.sn)
            })
            console.log("snArr:" + JSON.stringify(snArr))
            that.enableSubmit = false
          } catch (e) {
            return false
          }
        }
        fileReader.readAsBinaryString(file)
      },
      /**下载模板 */
      handleExcelModel(e){
        let model = [
          ["*费用大类","*费用名称","*费用类型","*数量","*单位", "单价", "*金额", "备注"],
          ["可选项：采购尾款、工程费用、工程尾款、劳务费、日常费用、差旅费用、其他","费用名称信息","可选项：固定、灵活", 1,"台", 10, 10, "备注信息"]
        ]
        //将数据数组转为工作表
        let ws = XLSX.utils.aoa_to_sheet(model);
        //创建workbook
        let wb = XLSX.utils.book_new();
        //将工作表添加到workbook
        XLSX.utils.book_append_sheet(wb, ws, 'sheet1')
        //将workboot写入文件
        let d = new Date();
        let fileName = '预算导入模板-' + d.getTime() + '.xlsx'
        XLSX.writeFile(wb, fileName)
      }, 
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
      handleChange(value, option){
        this.model.depart = value
        this.model.departName = option.componentOptions.children[0].text
      },
      cycleChange(val){
        let data = generateDate(val);
        this.model.timeStart = data.timeStart
        this.model.timeEnd = data.timeEnd
      },
      /**弹窗关闭 */
      handleCancel(){
        this.$emit('close')
      },
      /**草稿处理开始 */
      /*使用草稿数据*/
      reEdit(formData){
        this.model = formData
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
            const values = this.$refs.vTable.getTableData()
            that.confirmLoading = true;
            let data = that.model
            data.costs = values
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
      /**草稿处理结束 */
    }
  }
</script>

<style lang="less" scoped>
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

</style>