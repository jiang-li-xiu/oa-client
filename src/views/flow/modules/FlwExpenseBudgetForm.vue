<template>
  <a-spin :spinning="confirmLoading">
    <a-form-model ref="form" :model="model" :rules="validatorRules" >
      <a-tabs defaultActiveKey="activeKey" @change="changeTabs">
        <a-tab-pane key="1" :tab="tabName">
          <j-form-container :disabled="formDisabled">
            <a-row slot="detail">
              <a-card title="基本信息" :bordered="false">
                <a-col :span="12">
                  <a-form-model-item
                    label="部门"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    prop="depart"
                    :rules="[{ required: true, message: '请选择部门' }]"
                  >
                    <a-select
                      ref="select"
                      v-model="model.depart"
                      :options="depOptions"
                      :field-names="{ label: 'name', value: 'id' }"
                      @change="handleChange"
                      placeholder="请选择部门"
                    ></a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item
                    label="申请日期"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    prop="applyDate"
                    :rules="[{ required: true, message: '请选择申请日期' }]"
                  >
                    <j-date placeholder="请选择申请日期" v-model="model.applyDate" style="width: 100%" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item
                    label="周期"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    prop="cycle"
                    :rules="[{ required: true, message: '请选择周期' }]"
                  >
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
                  <a-form-model-item
                    label="开始日期"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    prop="timeStart"
                    :rules="[{ required: true, message: '请选择开始日期' }]"
                  >
                    <div class="cycle-date" style="display: flex; flex-direction: row; flex-wrap: nowrap">
                      <j-date placeholder="请选择开始日期" v-model="model.timeStart" />
                      <j-date placeholder="请选择结束日期" v-model="model.timeEnd" style="margin-left: 6px" />
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
                  style="margin-top: 8px"
                >
                  <template v-slot:toolbarSuffix>
                    <a-upload ref="upload" action="/" :show-upload-list="false" :before-upload="batchImport">
                      <a-button>导入</a-button>
                    </a-upload>
                    <a-button @click="handleExcelModel">下载模板</a-button>
                  </template>
                </j-vxe-table>
              </a-card>
            </a-row>
          </j-form-container>
        </a-tab-pane>

        <a-tab-pane key="2" tab="流转记录">
          <j-form-container :disabled="formDisabled">
            <div class="block" slot="detail">
              <a-timeline>
                <a-timeline-item
                  v-for="(item, index) in historyTaskList"
                  :key="index"
                  :icon="setIcon(item.finishTime)"
                  :color="setColor(item.finishTime)"
                >
                  <p style="font-weight: 700">{{ item.taskName }}</p>
                  <a-card class="box-card" shadow="hover">
                    <a-descriptions :column="3" :labelStyle="{ 'font-weight': 'bold' }">
                      <a-descriptions-item label="实际办理">{{ item.assigneeName || '-' }}</a-descriptions-item>
                      <a-descriptions-item label="候选办理">{{ item.candidate || '-' }}</a-descriptions-item>
                      <a-descriptions-item label="耗时">{{ item.duration || '-' }}</a-descriptions-item>
                    </a-descriptions>
                    <a-descriptions :column="3" :labelStyle="{ 'font-weight': 'bold' }">
                      <a-descriptions-item label="接收时间">{{ item.createTime || '-' }}</a-descriptions-item>
                      <a-descriptions-item label="办结时间">{{ item.finishTime || '-' }}</a-descriptions-item>
                    </a-descriptions>
                    <div v-if="item.commentList && item.commentList.length > 0">
                      <div v-for="(comment, index) in item.commentList" :key="index">
                        <el-divider content-position="left">
                          <el-tag :type="approveTypeTag(comment.type)" size="mini">{{
                            commentType(comment.type)
                          }}</el-tag>
                          <el-tag type="info" effect="plain" size="mini">{{ comment.time }}</el-tag>
                        </el-divider>
                        <span>{{ comment.fullMessage }}</span>
                      </div>
                    </div>
                  </a-card>
                </a-timeline-item>
              </a-timeline>
            </div>
          </j-form-container>
        </a-tab-pane>
        <a-tab-pane key="3" tab="流程跟踪" :force-render="true">
          <process-viewer
            ref="processViewer"
            :key="`designer-${loadIndex}`"
            :style="'height:' + height"
            :xml.sync="xmlData"
            :finishedInfo="finishedInfo"
            :allCommentList="historyTaskList"
          />
        </a-tab-pane>
      </a-tabs>
    </a-form-model>
  </a-spin>
</template>

<script>
import ProcessViewer from '@/views/process/modules/ProcessViewer.vue'
import { httpAction, getAction } from '@/api/manage'
import { generateDate } from '@/utils/util'
import { JVXETypes } from '@/components/jeecg/JVxeTable'
import * as XLSX from 'xlsx/xlsx.mjs'

export default {
  name: 'FlwExpenseBudgetForm',
  components: { ProcessViewer },
  props: {
    //表单禁用
    disabled: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    return {
      model: {
        cycle: '月度',
        costs: [],
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
      validatorRules: {},
      depOptions: [],
      loading: false,
      columns: [
        {
          title: '费用大类',
          key: 'categories',
          type: JVXETypes.select,
          width: '120px',
          options: [
            { title: '采购费', value: '采购费' },
            { title: '采购尾款', value: '采购尾款' },
            { title: '工程费用', value: '工程费用' },
            { title: '工程尾款', value: '工程尾款' },
            { title: '劳务费', value: '劳务费' },
            { title: '日常费用', value: '日常费用' },
            { title: '差旅费用', value: '差旅费用' },
            { title: '其他', value: '其他' },
          ],
          validateRules: [
            {
              required: true, // 必填
              message: '请选择${title}', // 显示的文本
            },
          ],
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
              message: '请输入${title}', // 显示的文本
            },
          ],
        },
        {
          title: '费用类型',
          key: 'type',
          type: JVXETypes.select,
          width: '120px',
          options: [
            { title: '固定', value: '固定' },
            { title: '灵活', value: '灵活' },
          ],
          validateRules: [
            {
              required: true, // 必填
              message: '请输入${title}', // 显示的文本
            },
          ],
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
              message: '请输入${title}', // 显示的文本
            },
          ],
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
              message: '请输入${title}', // 显示的文本
            },
          ],
        },
        {
          title: '单价',
          key: 'price',
          type: JVXETypes.inputNumber,
          width: '180px',
          validateRules: [
            {
              pattern: /^(([1-9][0-9]*)|([0]\.\d{0,2}|[1-9][0-9]*\.\d{0,5}))$/, // 正则
              message: '需符合金额规则',
            },
          ],
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
              message: '请输入${title}', // 显示的文本
            },
            {
              pattern: /^(([1-9][0-9]*)|([0]\.\d{0,2}|[1-9][0-9]*\.\d{0,5}))$/, // 正则
              message: '需符合金额规则',
            },
          ],
        },
        {
          title: '备注',
          key: 'remarks',
          type: JVXETypes.input,
          width: '180px',
          defaultValue: '',
          placeholder: '请输入${title}',
        },
      ],
      dataSource: [],
      url: {
        add: '/scrm/flwExpenseBudget/add',
        edit: '/scrm/flwExpenseBudget/edit',
        queryById: '/scrm/flwExpenseBudget/queryById',
      },
      historyTaskList: [],
      loadIndex: 0,
      height: document.documentElement.clientHeight - 205 + 'px;',
      xmlData: undefined,
      finishedInfo: {
        finishedSequenceFlowSet: [],
        finishedTaskSet: [],
        unfinishedTaskSet: [],
        rejectedTaskSet: [],
      },
      tabName: '表单信息',
      type: 'handel',
    }
  },
  computed: {
    formDisabled() {
      return this.disabled
    },
    commentType() {
      return (val) => {
        switch (val) {
          case '1':
            return '通过'
          case '2':
            return '退回'
          case '3':
            return '驳回'
          case '4':
            return '委派'
          case '5':
            return '转办'
          case '6':
            return '不通过'
          case '7':
            return '删除'
          case '8':
            return '取消'
          case '9':
            return '跳过'
        }
      }
    },
    approveTypeTag() {
      return (val) => {
        switch (val) {
          case '1':
            return 'success'
          case '2':
            return 'warning'
          case '3':
            return 'danger'
          case '4':
            return 'primary'
          case '5':
            return 'success'
        }
      }
    },
  },
  created() {
    //备份model原始值
    this.modelDefault = JSON.parse(JSON.stringify(this.model))
    this.getCurrentUserDepart()
  },
  methods: {
    changeTabs(data) {
      if (data == 3) {
        this.$refs.processViewer.init()
      }
    },
    /**获取审批记录 */
    getModelDetail() {
      let that = this
      let param = {
        businessKey: this.model.id,
      }
      getAction('/workflow/process/detailByKey', param).then((res) => {
        if (res.success) {
          that.historyTaskList = res.result.historyTaskList
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    /**获取审批流程图 */
    getFlowViewer() {
      let that = this
      let param = {
        businessKey: this.model.id,
      }
      getAction('/workflow/process/flowViewerByKey', param).then((res) => {
        if (res.success) {
          var data = res.result
          if (data) {
            this.finishedInfo.finishedTaskSet = data.finishedTaskSet
            this.finishedInfo.unfinishedTaskSet = data.unfinishedTaskSet
            this.finishedInfo.rejectedTaskSet = data.rejectedTaskSet
            this.finishedInfo.finishedSequenceFlowSet = data.finishedSequenceFlowSet
            this.xmlData = data.xmlData
          }
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    setIcon(val) {
      if (val) {
        return 'el-icon-check'
      } else {
        return 'el-icon-time'
      }
    },
    setColor(val) {
      if (val) {
        return '#2bc418'
      } else {
        return '#b3bdbb'
      }
    },
    add() {
      this.edit(this.modelDefault)
      let data = generateDate('月度')
      this.model.timeStart = data.timeStart
      this.model.timeEnd = data.timeEnd
    },
    edit(record) {
      this.model = Object.assign({}, record)
      this.visible = true
      this.getModelDetail()
      this.getFlowViewer()
    },
    /**导入数据 */
    batchImport(file) {
      let that = this
      if (file.length <= 0) {
        return false
      } else if (!/\.(xls|xlsx)$/.test(file.name.toLowerCase())) {
        console.log('上传格式不正确，请上传xls或者xlsx格式')
        return false
      }
      //读取数据
      const fileReader = new FileReader()
      fileReader.onload = (ev) => {
        try {
          const workbook = XLSX.read(ev.target.result, {
            type: 'binary',
          })
          //取第一张表，wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
          const wsname = workbook.SheetNames[0]
          //生成json表格内容，wb.Sheets[Sheet名]获取第一个Sheet的数据
          const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname])
          // ...对数据进行自己需要的操作
          const m = that.dealExcel(ws)
          that.model.costs = that.model.costs.concat(m)
        } catch (e) {
          that.$message.error('读取失败！')
        }
      }
      fileReader.readAsBinaryString(file)
      return false
    },
    dealExcel(ws) {
      let keymap = {
        // 我们要转换的开头
        '*费用大类': 'categories',
        '*费用名称': 'name',
        '*费用类型': 'type',
        '*数量': 'num',
        '*单位': 'unit',
        单价: 'price',
        '*金额': 'amount',
        备注: 'remarks',
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
      const XLSX = xlsx
      const headers = []
      const range = XLSX.utils.decode_range(sheet['!ref']) // worksheet['!ref'] 是工作表的有效范围
      let C
      /* 获取单元格值 start in the first row */
      const R = range.s.r // 行 // C 列
      let i = 0
      for (C = range.s.c; C <= range.e.c; ++C) {
        var cell =
          sheet[XLSX.utils.encode_cell({ c: C, r: R })] /* 根据地址得到单元格的值find the cell in the first row */
        var hdr = 'UNKNOWN' + C // 如果有空表头，会替换为您想要的默认值replace with your desired default
        // XLSX.utils.format_cell 生成单元格文本值
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
        if (hdr.indexOf('UNKNOWN') > -1) {
          if (!i) {
            hdr = '__EMPTY'
          } else {
            hdr = '__EMPTY_' + i
          }
          i++
        }
        headers.push(hdr)
      }
      return headers
    },
    handleReadExcel(file) {
      const that = this
      const fileReader = new FileReader()
      fileReader.onload = (ev) => {
        try {
          const fileData = ev.target.result
          const workbook = XLSX.read(fileData, {
            type: 'binary',
          })
          const wsname = workbook.SheetNames[0] // 取第一张表
          const snArr = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]) // 生成json表格内容
          that.dataGrid.snSet.clear() // 清空一下之前的Set
          snArr.forEach((item) => {
            that.dataGrid.snSet.add(item.sn)
          })
          console.log('snArr:' + JSON.stringify(snArr))
          that.enableSubmit = false
        } catch (e) {
          return false
        }
      }
      fileReader.readAsBinaryString(file)
    },
    /**下载模板 */
    handleExcelModel(e) {
      let model = [
        ['*费用大类', '*费用名称', '*费用类型', '*数量', '*单位', '单价', '*金额', '备注'],
        [
          '可选项：采购尾款、工程费用、工程尾款、劳务费、日常费用、差旅费用、其他',
          '费用名称信息',
          '可选项：固定、灵活',
          1,
          '台',
          10,
          10,
          '备注信息',
        ],
      ]
      //将数据数组转为工作表
      let ws = XLSX.utils.aoa_to_sheet(model)
      //创建workbook
      let wb = XLSX.utils.book_new()
      //将工作表添加到workbook
      XLSX.utils.book_append_sheet(wb, ws, 'sheet1')
      //将workboot写入文件
      let d = new Date()
      let fileName = '预算导入模板-' + d.getTime() + '.xlsx'
      XLSX.writeFile(wb, fileName)
    },
    getCurrentUserDepart() {
      getAction('sys/sysDepart/getCurrentUserDepart').then((res) => {
        if (res.success) {
          //构建选项
          if (res.result) {
            this.depOptions = res.result
          }
        } else {
          this.depOptions = []
        }
      })
    },
    handleChange(value, option) {
      this.model.depart = value
      this.model.departName = option.componentOptions.children[0].text
    },
    cycleChange(val) {
      let data = generateDate(val)
      this.model.timeStart = data.timeStart
      this.model.timeEnd = data.timeEnd
    },
    submitForm() {
      const that = this
      // 触发表单验证
      this.$refs.form.validate((valid) => {
        if (valid) {
          //验证子表单
          const values = this.$refs.vTable.getTableData()
          if (!values || values.length <= 0) {
            this.$message.warning('预算信息不能为空')
            return
          }
          this.$refs.vTable.validateTable().then((errMap) => {
            if (!errMap) {
              that.confirmLoading = true
              let httpurl = ''
              let method = ''
              if (!this.model.id) {
                httpurl += this.url.add
                method = 'post'
              } else {
                httpurl += this.url.edit
                method = 'put'
              }
              this.model.costs = values
              httpAction(httpurl, this.model, method)
                .then((res) => {
                  if (res.success) {
                    that.$message.success(res.message)
                    that.$emit('ok')
                  } else {
                    that.$message.warning(res.message)
                  }
                })
                .finally(() => {
                  that.confirmLoading = false
                })
            }
          })
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
.ant-card {
  &:deep(.ant-card-head) {
    padding: 0 !important;
    min-height: auto;
    .ant-card-head-title {
      padding: 0 !important;
    }
  }
  &:deep(.ant-card-body) {
    padding: 12px 0;
  }
}
</style>
