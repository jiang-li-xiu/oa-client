<template>
  <j-modal
    :title="title"
    :width="width"
    :visible="visible"
    switchFullscreen
    :fullscreen="true"
    :okButtonProps="{ class: { 'jee-hidden': disableSubmit } }"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <j-form-container :disabled="formDisabled">
        <a-form-model
          ref="form"
          :model="model"
          :rules="validatorRules"
          slot="detail"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-row>
            <a-card title="基本信息" :bordered="false">
              <a-col :span="8">
                <a-form-model-item label="部门" prop="depart">
                  <a-select
                    ref="select"
                    v-model="model.depart"
                    :options="depOptions"
                    :field-names="{ label: 'name', value: 'id' }"
                    @change="handleChange"
                  ></a-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="申请人" prop="userId">
                  <a-input v-model="model.userName" placeholder="请输入申请人"></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="联系电话" prop="phone">
                  <a-input v-model="model.phone" placeholder="请输入联系电话"></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item
                  label="项目名称"
                  prop="projectName"
                  :label-col="{ span: 2 }"
                  :wrapper-col="{ span: 21 }"
                >
                  <a-input v-model="model.projectName" placeholder="请输入项目名称"></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item
                  label="出差事由"
                  prop="tripReason"
                  :label-col="{ span: 2 }"
                  :wrapper-col="{ span: 21 }"
                >
                  <a-textarea v-model="model.tripReason" placeholder="请输入出差事由" :rows="4"></a-textarea>
                </a-form-model-item>
              </a-col>
            </a-card>
            <a-card title="费用明细" :bordered="false" :bodyStyle="{ padding: 0, marginTop: '10px' }">
              <!-- <j-vxe-table
                ref="vTable"
                toolbar
                row-number
                row-selection
                drag-sort
                keep-source
                :loading="loading"
                :dataSource="dataSource"
                :columns="columns"
                style="margin-top: 8px"
              >
                <template v-slot:toolbarSuffix>
                  <a-upload ref="upload" action="/" :show-upload-list="false" :before-upload="batchImport">
                    <a-button>导入</a-button>
                  </a-upload>
                  <a-button @click="handleExcelModel">下载模板</a-button>
                </template>
              </j-vxe-table> -->
              <div class="table-operator">
                <a-button class="buttom" type="primary" @click="addRow">添加 </a-button>
                <a-upload ref="upload" action="/" :show-upload-list="false" :before-upload="batchImport">
                  <a-button>导入</a-button>
                </a-upload>
                <a-button @click="handleExcelModel">下载模板</a-button>
              </div>
              <a-form-model ref="tableformRef" :model="form">
                <a-table
                  :columns="columns"
                  rowKey="id"
                  :pagination="false"
                  :data-source="form.tripInfo"
                  bordered
                  :scroll="{ x: true }"
                  :loading="loading"
                >
                  <span slot="startTime" class="form-table-heard">开始时间</span>
                  <span slot="startAddress" class="form-table-heard">起点</span>
                  <span slot="endTime" class="form-table-heard">终止时间</span>
                  <span slot="endAddress" class="form-table-heard">终点</span>
                  <span slot="vehicle" class="form-table-heard">工具</span>
                  <span slot="document" class="form-table-heard">单据</span>
                  <span slot="trafficAmount" class="form-table-heard">金额</span>
                  <span slot="peopleTotal" class="form-table-heard">人数</span>
                  <span slot="days" class="form-table-heard">天数</span>
                  <span slot="accommodationAmount" class="form-table-heard">金额</span>
                  <span slot="tripPeopleTotal" class="form-table-heard">人数</span>
                  <span slot="tripDays" class="form-table-heard">天数</span>
                  <span slot="tripAccommodationAmount" class="form-table-heard">金额</span>

                  <template slot="startTimeSlots" slot-scope="text, record, index">
                    <a-form-model-item :prop="'tripInfo.' + index + '.startTime'" :rules="rules.startTime">
                      <a-date-picker
                        v-model="record.startTime"
                        :showTime="true"
                        :format="'YYYY-MM-DD'"
                        value-format="YYYY-MM-DD"
                        placeholder="请选择时间"
                      />
                    </a-form-model-item>
                  </template>
                  <template slot="startAddressSlots" slot-scope="text, record, index">
                    <a-form-model-item :prop="'tripInfo.' + index + '.startAddress'" :rules="rules.startAddress">
                      <a-input v-model="record.startAddress" />
                    </a-form-model-item>
                  </template>
                  <template slot="endTimeSlots" slot-scope="text, record, index">
                    <a-form-model-item :prop="'tripInfo.' + index + '.endTime'" :rules="rules.endTime">
                      <a-date-picker
                        v-model="record.endTime"
                        :showTime="true"
                        :format="'YYYY-MM-DD'"
                        value-format="YYYY-MM-DD"
                        placeholder="请选择时间"
                      />
                    </a-form-model-item>
                  </template>
                  <template slot="endAddressSlots" slot-scope="text, record, index">
                    <a-form-model-item :prop="'tripInfo.' + index + '.endAddress'" :rules="rules.endAddress">
                      <a-input v-model="record.endAddress" />
                    </a-form-model-item>
                  </template>
                  <template slot="vehicleSlots" slot-scope="text, record, index">
                    <a-form-model-item :prop="'tripInfo.' + index + '.vehicle'" :rules="rules.vehicle">
                      <a-input v-model="record.vehicle" />
                    </a-form-model-item>
                  </template>
                  <template slot="documentSlots" slot-scope="text, record, index">
                    <a-form-model-item :prop="'tripInfo.' + index + '.document'" :rules="rules.document">
                      <a-input v-model="record.document" />
                    </a-form-model-item>
                  </template>
                  <!-- 交通金额 -->
                  <template slot="trafficAmountSlots" slot-scope="text, record, index">
                    <a-form-model-item :prop="'tripInfo.' + index + '.trafficAmount'" :rules="rules.trafficAmount">
                      <a-input-number :min="0" :precision="2" v-model="record.trafficAmount" />
                    </a-form-model-item>
                  </template>
                  <!-- 人数 -->
                  <template slot="peopleTotalSlots" slot-scope="text, record, index">
                    <a-form-model-item :prop="'tripInfo.' + index + '.peopleTotal'" :rules="rules.peopleTotal">
                      <a-input-number :min="0" v-model="record.peopleTotal" />
                    </a-form-model-item>
                  </template>
                  <!-- 天数 -->
                  <template slot="daysSlots" slot-scope="text, record, index">
                    <a-form-model-item :prop="'tripInfo.' + index + '.days'" :rules="rules.days">
                      <a-input-number :min="0" v-model="record.days" />
                    </a-form-model-item>
                  </template>
                  <!-- 金额 -->
                  <template slot="accommodationAmountSlots" slot-scope="text, record, index">
                    <a-form-model-item
                      :prop="'tripInfo.' + index + '.accommodationAmount'"
                      :rules="rules.accommodationAmount"
                    >
                      <a-input-number :min="0" :precision="2" v-model="record.accommodationAmount" />
                    </a-form-model-item>
                  </template>
                  <!-- 出差补助人数 -->
                  <template slot="tripPeopleTotalSlots" slot-scope="text, record, index">
                    <a-form-model-item :prop="'tripInfo.' + index + '.tripPeopleTotal'" :rules="rules.tripPeopleTotal">
                      <a-input-number :min="0" v-model="record.tripPeopleTotal" />
                    </a-form-model-item>
                  </template>
                  <!-- 出差补助天数 -->
                  <template slot="tripDays" slot-scope="text, record, index">
                    <a-form-model-item :prop="'tripInfo.' + index + '.tripDays'" :rules="rules.tripDays">
                      <a-input-number :min="0" v-model="record.tripDays" />
                    </a-form-model-item>
                  </template>
                  <!-- 出差补助金额 -->
                  <template slot="tripAccommodationAmount" slot-scope="text, record, index">
                    <a-form-model-item
                      :prop="'tripInfo.' + index + '.tripAccommodationAmount'"
                      :rules="rules.tripAccommodationAmount"
                    >
                      <a-input-number :min="0" :precision="2" v-model="record.tripAccommodationAmount" />
                    </a-form-model-item>
                  </template>
                  <template slot="otherInfoSlots" slot-scope="text, record, index">
                    <a-form-model-item :prop="'tripInfo.' + index + '.otherInfo'" :rules="rules.otherInfo">
                      <a-input v-model="record.otherInfo" />
                    </a-form-model-item>
                  </template>
                  <template slot="remarkSlots" slot-scope="text, record, index">
                    <a-form-model-item :prop="'tripInfo.' + index + '.remark'" :rules="rules.remark">
                      <a-input v-model="record.remark" />
                    </a-form-model-item>
                  </template>

                  <template #action="record, row, index">
                    <a href="javascript:;" @click="deleteRow(row, index)" :style="{ color: '#ee4f3d' }">移除</a>
                  </template>
                </a-table>
              </a-form-model>
              <a-col :span="12">
                <a-form-model-item label="报销合计（小写）" prop="totalReimbursementLower">
                  <a-input
                    type="number"
                    @change="changeAmount"
                    min="0"
                    max="999999999999.99"
                    :max-length="15"
                    suffix="元"
                    v-model="model.totalReimbursementLower"
                    placeholder="请输入报销合计"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="借款金额" prop="loanAmount">
                  <a-input
                    type="number"
                    min="0"
                    max="999999999999.99"
                    :max-length="15"
                    suffix="元"
                    v-model="model.loanAmount"
                    placeholder="请输入借款金额"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="报销合计（大写）" prop="totalReimbursementUpper">
                  <a-input v-model="model.totalReimbursementUpper" placeholder="请输入报销合计" :read-only="true"></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="退（补）金额" prop="refundAmount">
                  <a-input
                    type="number"
                    min="0"
                    max="999999999999.99"
                    :max-length="15"
                    suffix="元"
                    v-model="model.refundAmount"
                    placeholder="请输入退（补）金额"
                  />
                </a-form-model-item>
              </a-col>

              <!-- <div style="margin-top: 10px">
                <a-upload
                  :action="minioUploadAction"
                  :multiple="true"
                  :remove="handleRemove"
                  :file-list="fileList"
                  :headers="tokenHeader"
                  @change="uploadChange"
                >
                  <a-button> <a-icon type="upload" /> 上传文件 </a-button>
                </a-upload>
              </div> -->
            </a-card>
          </a-row>
        </a-form-model>
      </j-form-container>
    </a-spin>
    <template slot="footer">
      <a-button type="dashed" @click="handleCancel">取消</a-button>
      <a-button type="primary" @click="handleOks" :loading="loading">提交</a-button>
    </template>
  </j-modal>
</template>

<script>
import { httpAction, getAction, downFile } from '@/api/manage'
import { validateDuplicateValue } from '@/utils/util'
import { getAmountChinese } from '@/utils/index'
import { isEmpty } from 'lodash'
import moment from 'dayjs'
import { JVXETypes } from '@/components/jeecg/JVxeTable'
import * as XLSX from 'xlsx/xlsx.mjs'

export default {
  name: 'FlwExpenseTravelCreateForm',
  components: {},
  props: {
    //表单禁用
    disabled: {
      type: Boolean,
      default: false,
      required: false,
    },
    visible: {
      type: Boolean,
      default: false,
      required: true,
    },
    //表单数据
    record: {
      type: Object,
      default: {},
      required: true,
    },
  },
  data() {
    return {
      model: {
        files: [],
        fillingDate: moment().format('YYYY-MM-DD'),
        userName: this.$store.getters.userInfo.realname,
        userId: this.$store.getters.userInfo.id,
        phone: this.$store.getters.userInfo.phone,
      },
      form: {
        tripInfo: [],
      },
      title: '差旅费报销申请',
      width: 1000,
      disableSubmit: false,
      // 加载动画开关
      loading: false,
      depOptions: [],
      confirmLoading: false,
      validatorRules: {
        fillingDate: [{ required: true, message: '请填写填报日期', trigger: 'change' }],
        depart: [{ required: true, message: '请选择申请部门', trigger: 'change' }],
        projectName: [{ required: true, message: '请填写项目名称', trigger: 'change' }],
        tripReason: [{ required: true, message: '请填写出差事由', trigger: 'change' }],
      },
      rules: {
        startTime: { required: true, message: '请选择开始时间', trigger: 'change' },
        startAddress: { required: true, message: '请输入起点', trigger: 'blur' },
        endTime: { required: true, message: '请选择终止时间', trigger: 'change' },
        endAddress: { required: true, message: '请输入终点', trigger: 'blur' },
        vehicle: { required: true, message: '请输入工具', trigger: 'blur' },
        document: { required: true, message: '请输入单据', trigger: 'blur' },
        trafficAmount: { required: true, message: '请输入金额', trigger: 'blur' },
        peopleTotal: { required: true, message: '请输入人数', trigger: 'blur' },
        days: { required: true, message: '请输入天数', trigger: 'blur' },
        accommodationAmount: { required: true, message: '请输入金额', trigger: 'blur' },
        tripPeopleTotal: { required: true, message: '请输入人数', trigger: 'blur' },
        tripDays: { required: true, message: '请输入天数', trigger: 'blur' },
        tripAccommodationAmount: { required: true, message: '请输入金额', trigger: 'blur' },
      },
      url: {
        create: '/scrm/flwTravelReimbursement/create',
      },
      fileList: [],
      tokenHeader: { 'X-Access-Token': this.$ls.get('Access-Token') },
      minioUploadAction: window._CONFIG['domianURL'] + '/sys/upload/uploadMinio',
      labelCol: { span: 6 },
      wrapperCol: { span: 15 },
      columns: [
        {
          title: '起止时间及地址',
          dataIndex: 'position',
          width: 120,
          key: 'position',
          ellipsis: true,
          align: 'center',
          children: [
            {
              // title: '时间',
              dataIndex: 'startTime',
              key: 'startTime',
              width: 120,
              scopedSlots: { customRender: 'startTimeSlots' },
              slots: { title: 'startTime' }, //表头插槽
            },
            {
              // title: '起点',
              dataIndex: 'startAddress',
              key: 'startAddress',
              width: 150,
              scopedSlots: { customRender: 'startAddressSlots' },
              slots: { title: 'startAddress' },
            },
            {
              // title: '时间',
              dataIndex: 'endTime',
              key: 'endTime',
              width: 120,
              slots: { title: 'endTime' },
              scopedSlots: { customRender: 'endTimeSlots' },
            },
            {
              // title: '终点',
              dataIndex: 'endAddress',
              key: 'endAddress',
              width: 150,
              slots: { title: 'endAddress' },
              scopedSlots: { customRender: 'endAddressSlots' },
            },
          ],
        },
        {
          title: '交通费',
          dataIndex: 'ccc',
          width: 120,
          key: 'ccc',
          ellipsis: true,
          align: 'center',
          children: [
            {
              // title: '工具',
              dataIndex: 'vehicle',
              key: 'vehicle',
              width: 120,
              slots: { title: 'vehicle' },
              scopedSlots: { customRender: 'vehicleSlots' },
            },
            {
              // title: '单据',
              dataIndex: 'document',
              key: 'document',
              width: 120,
              slots: { title: 'document' },
              scopedSlots: { customRender: 'documentSlots' },
            },
            {
              // title: '金额',
              dataIndex: 'trafficAmount',
              key: 'trafficAmount',
              width: 120,
              slots: { title: 'trafficAmount' },
              scopedSlots: { customRender: 'trafficAmountSlots' },
            },
          ],
        },
        {
          title: '住宿费',
          dataIndex: 'yyy',
          width: 120,
          key: 'yyy',
          ellipsis: true,
          align: 'center',
          children: [
            {
              // title: '人数',
              dataIndex: 'peopleTotal',
              key: 'peopleTotal',
              width: 120,
              slots: { title: 'peopleTotal' },
              scopedSlots: { customRender: 'peopleTotalSlots' },
            },
            {
              // title: '天数',
              dataIndex: 'days',
              key: 'days',
              width: 120,
              slots: { title: 'days' },
              scopedSlots: { customRender: 'daysSlots' },
            },
            {
              // title: '金额',
              dataIndex: 'accommodationAmount',
              key: 'accommodationAmount',
              width: 120,
              slots: { title: 'accommodationAmount' },
              scopedSlots: { customRender: 'accommodationAmountSlots' },
            },
          ],
        },
        {
          title: '出差补助',
          width: 120,
          ellipsis: true,
          align: 'center',
          children: [
            {
              // title: '人数',
              dataIndex: 'tripPeopleTotal',
              key: 'tripPeopleTotal',
              width: 120,
              slots: { title: 'tripPeopleTotal' },
              scopedSlots: { customRender: 'tripPeopleTotalSlots' },
            },
            {
              // title: '天数',
              dataIndex: 'tripDays',
              key: 'tripDays',
              width: 120,
              slots: { title: 'tripDays' },
              scopedSlots: { customRender: 'tripDays' },
            },
            {
              // title: '金额',
              dataIndex: 'tripAccommodationAmount',
              key: 'tripAccommodationAmount',
              width: 120,
              slots: { title: 'tripAccommodationAmount' },
              scopedSlots: { customRender: 'tripAccommodationAmount' },
            },
          ],
        },
        {
          title: '其他',
          dataIndex: 'otherInfo',
          key: 'otherInfo',
          width: 150,
          scopedSlots: { customRender: 'otherInfoSlots' },
        },
        {
          title: '备注',
          dataIndex: 'remark',
          key: 'remark',
          width: 150,
          scopedSlots: { customRender: 'remarkSlots' },
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          fixed: 'right',
          width: 70,
          scopedSlots: { customRender: 'action' },
        },
      ],
      dataSource: [{}],
    }
  },
  computed: {
    formDisabled() {
      return this.disabled
    },
  },
  created() {
    //备份model原始值
    this.modelDefault = JSON.parse(JSON.stringify(this.model))
    this.getCurrentUserDepart()
  },
  methods: {
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
          that.form.tripInfo = that.form.tripInfo.concat(m)
          console.log(that.form.tripInfo, 'm', m)
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
        '*开始时间': 'startTime',
        '*起点': 'startAddress',
        '*终止时间': 'endTime',
        '*终点': 'endAddress',
        '*工具': 'vehicle',
        '*单据': 'document',
        '*金额': 'trafficAmount',
        '*人数': 'peopleTotal',
        '*天数': 'days',
        '*金额': 'accommodationAmount',
        '*人数': 'tripPeopleTotal',
        '*天数': 'tripDays',
        '*金额': 'tripAccommodationAmount',
        其他: 'otherInfo',
        备注: 'remark',
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
    handleExcelModel(e) {
      let model = [
        [
          '*开始时间',
          '*起点',
          '*终止时间',
          '*终点',
          '*工具',
          '*单据',
          '*金额',
          '*人数',
          '*天数',
          '*金额',
          '*人数',
          '*天数',
          '*金额',
          '其他',
          '备注',
        ],
        // [
        //   '可选项：采购尾款、工程费用、工程尾款、劳务费、日常费用、差旅费用、其他',
        //   '费用名称信息',
        //   '可选项：固定、灵活',
        //   1,
        //   '台',
        //   10,
        //   10,
        //   '备注信息',
        // ],
      ]
      //将数据数组转为工作表
      let ws = XLSX.utils.aoa_to_sheet(model)
      //创建workbook
      let wb = XLSX.utils.book_new()
      //将工作表添加到workbook
      XLSX.utils.book_append_sheet(wb, ws, 'sheet1')
      //将workboot写入文件
      let d = new Date()
      let fileName = '差旅费导入模板-' + d.getTime() + '.xlsx'
      XLSX.writeFile(wb, fileName)
    },

    /**下载模板 */
    // handleExcelModel(fileName) {
    //   downFile('/scrm/flwTravelReimbursement/download/model').then((data) => {
    //     console.log(data)
    //     if (!data || data.size === 0) {
    //       Vue.prototype['$message'].warning('文件下载失败')
    //       return
    //     }
    //     if (typeof window.navigator.msSaveBlob !== 'undefined') {
    //       window.navigator.msSaveBlob(new Blob([data]), fileName)
    //     } else {
    //       let url = window.URL.createObjectURL(new Blob([data]))
    //       let link = document.createElement('a')
    //       link.style.display = 'none'
    //       link.href = url
    //       link.setAttribute('download', fileName + '.xls')
    //       document.body.appendChild(link)
    //       link.click()
    //       document.body.removeChild(link) //下载完成移除元素
    //       window.URL.revokeObjectURL(url) //释放掉blob对象
    //     }
    //   })
    // },
    // 添加一行
    addRow() {
      this.form.tripInfo.push({})
      this.$forceUpdate()
    },
    // 移除
    deleteRow(row, index) {
      var len = this.form.tripInfo.length
      if (len == 1) {
        this.$message.error('至少要有一条费用明细！')
        return
      }
      this.form.tripInfo.splice(index, 1)
    },
    add() {
      this.edit(this.modelDefault)
    },
    edit(record) {
      this.model = Object.assign({}, record)
      this.visible = true
    },
    handleCancel() {
      this.model = {
        files: [],
        fillingDate: moment().format('YYYY-MM-DD'),
        userName: this.$store.getters.userInfo.realname,
        userId: this.$store.getters.userInfo.id,
        phone: this.$store.getters.userInfo.phone,
      }
      this.$emit('close')
    },
    handleChange(val) {
      this.model.depart = val
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
    /**文件处理开始 */
    uploadChange(info) {
      let fileList = [...info.fileList]
      if (info.file.status === 'uploading') {
        this.fileList = fileList
      }
      if (info.file.status === 'done') {
        let result = info.file.response.result
        this.model.files.push({
          uid: result.id,
          status: 'done',
          name: result.fileName,
          url: result.url,
        })
      }
    },
    handleRemove(file) {
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList
      const newUploadList = this.model.files.slice()
      newUploadList.splice(index, 1)
      this.model.files = newUploadList
    },
    /**文件下载 */
    downloadFile(file) {
      console.log('downloadFile:' + JSON.stringify(file))
      getAction('/sys/common/download', { url: file.url }).then((res) => {
        if (res.success) {
          that.$message.success(res.message)
          that.$emit('close')
          that.$emit('ok')
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    async handlePreview(file) {
      console.log('handlePreview:' + JSON.stringify(file))
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    /**文件处理结束 */
    changeAmount(val) {
      this.model.totalReimbursementUpper = getAmountChinese(val.target.value)
    },
    // addRowCustom() {
    //   this.model.feeDetails.push({})
    //   this.$forceUpdate()
    // },
    // delRowCustom(index) {
    //   var len = this.model.feeDetails.length
    //   if (len == 1) {
    //     this.$message.error('至少要有一条费用明细！')
    //     return
    //   }
    //   this.model.feeDetails.splice(index, 1)
    //   this.rowChange()
    //   this.$forceUpdate()
    // },
    rowChange(va1) {
      var amount = 0
      var feeDetails = this.model.feeDetails
      if (feeDetails && feeDetails.length > 0) {
        feeDetails.forEach((item) => {
          if (!isEmpty(item) && item.hasOwnProperty('amount')) {
            amount = parseFloat(amount) + parseFloat(Number(item.amount))
          }
        })
      }
      this.model.amount = amount
      this.changeAmount(amount)
      this.$forceUpdate()
    },
    validateAmount(rule, value, callback) {
      var exp = /^([1-9]\d*|[0])(\.\d{1,2})?$/
      if (!exp.test(value) || parseFloat(value) >= 100000000000) {
        callback('格式不正确，最小为0，最大为999999999999.99')
      }
      callback()
    },
    handleOks() {
      console.log(this.model, this.form.tripInfo)
      const that = this
      // 触发表单验证
      this.$refs.form.validate(async (valid) => {
        this.$refs.tableformRef.validate(async (valid) => {
          if (valid) {
            that.confirmLoading = true
            let httpurl = this.url.create
            let method = 'post'
            that.model.processDefId = that.record.procdefId
            that.model.tables = that.record.linkTable
            //构建variables
            that.initializeVar()
            let data = {
              ...this.model,
              // trafficAmount: this.model.trafficAmount.toFixed(2),
              // accommodationAmount: this.model.accommodationAmount.toFixed(2),
              tripInfo: this.form.tripInfo,
            }
            httpAction(httpurl, data, method)
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
      })
    },
    /**初始化流程变量 */
    initializeVar() {
      let variableArr = this.record.variables
      let model = this.model
      let variables = {}
      if (variableArr != null && variableArr != '' && variableArr != undefined) {
        for (var i = 0; i < variableArr.length; i++) {
          var val = model[variableArr[i]]
          if (val == '' && val == null && val == undefined) {
            continue
          }
          variables[variableArr[i]] = val
        }
        this.model.variables = variables
      }
    },
  },
}
</script>
<style lang="less" scoped>
table {
  width: 100%;
  .head-tr {
    border-top: hidden;
    border-left: hidden;
    border-right: hidden;
    text-align: center;
    line-height: 54px;
    th,
    td {
      border-right: hidden;
    }
  }
  .head-create-date {
    font-weight: normal;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .flex-colunm {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    &:deep(.ant-form-item-control-wrapper) {
      margin-right: 6px;
      width: 98%;
    }
  }
  .flex-row {
    display: flex;
    flex-direction: row;
    &:deep(.ant-form-item-control-wrapper) {
      flex-grow: 1;
      margin-right: 6px;
    }
    &:deep(.ant-form-item-label) {
      min-width: 72px;
    }
  }
}
.ant-modal {
  &:deep(.ant-modal-body) {
    padding-top: 0 !important;
  }
}
.ant-form-item {
  margin-bottom: 5px !important;
}
.fee-label {
  &:deep(.ant-form-item-label) {
    width: 100%;
    text-align: center;
    label::after {
      content: none;
    }
  }
}
.add-row-custom {
  position: absolute;
  right: 8px;
  top: 8px;
  z-index: 1024;
}
// 表头前加*
.form-table-heard:before {
  content: '*';
  color: red;
}
::v-deep .ant-table-row-cell-break-word .ant-table-row-cell-last {
  min-height: 107px;
}
</style>
