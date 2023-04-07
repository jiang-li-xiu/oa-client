<template>
  <a-modal :title="title" :width="700" :visible.sync="visible" :confirmLoading="loading" @cancel="close">
    <a-spin tip="加载中..." :spinning="loading">
      <j-form-container :disabled="disableSubmit">
        <a-form-model
          ref="ruleForm"
          :model="formParams"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          slot="detail"
        >
          <a-row>
            <a-col :span="24">
              <a-form-model-item label="付款时间" prop="time">
                <j-date
                  v-model="formParams.time"
                  :showTime="true"
                  dateFormat="YYYY-MM-DD"
                  placeholder="请选择付款时间"
                  :style="{ width: '100%' }"
                />
              </a-form-model-item>
            </a-col>

            <a-col :span="24">
              <a-form-model-item label="应付款金额" prop="payableAmount">
                <a-input-number
                  v-model="formParams.payableAmount"
                  :precision="2"
                  placeholder="请输入应付款金额"
                  style="width: 95%"
                ></a-input-number
                >元
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="已付款金额" prop="paidAmount">
                <a-input-number
                  v-model="formParams.paidAmount"
                  :precision="2"
                  placeholder="请输入已付款金额"
                  style="width: 95%"
                ></a-input-number
                >元
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="未付款金额" prop="unpaidAmount">
                <a-input-number
                  v-model="formParams.unpaidAmount"
                  :precision="2"
                  placeholder="请输入未付款金额"
                  style="width: 95%"
                ></a-input-number
                >元
              </a-form-model-item>
            </a-col>

            <a-col :span="24">
              <a-form-model-item label="本次付款金额" prop="amount">
                <a-input-number
                  v-model="formParams.amount"
                  :precision="2"
                  :min="0"
                  placeholder="请输入本次付款金额"
                  style="width: 95%"
                ></a-input-number
                >元
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="付款方式" prop="type">
                <a-select v-model="formParams.type" placeholder="请选择付款方式">
                  <a-select-option :value="1">电汇 </a-select-option>
                  <a-select-option :value="2">转账 </a-select-option>
                  <a-select-option :value="3">汇票 </a-select-option>
                  <a-select-option :value="4">其他 </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="付款凭证" prop="certificateUrl">
                <a-upload
                  :action="uploadUrl"
                  :multiple="true"
                  :file-list="certificateUrl"
                  :headers="headers"
                  :disabled="disableSubmit"
                  @change="handleUploadChange"
                  :remove="handleRemoveImage"
                >
                  <a v-if="certificateUrl.length < 1" type="primary" icon="upload">上传文件 </a>
                </a-upload>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="备注" prop="remark">
                <a-textarea v-model="formParams.remark" placeholder="请输入备注" :disabled="disableSubmit" :rows="5" />
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </j-form-container>
    </a-spin>

    <template slot="footer">
      <a-button type="primary" @click="handleOk()" :loading="loading">确认</a-button>
      <a-button @click="close">取消</a-button>
    </template>
  </a-modal>
</template>

<script>
import {
  addPayment,
  editPayment,
  deletePayment,
  getDetail,
  addInvoice,
  editInvoice,
  deleteInvoice,
} from '@/api/fund-management/PaymentList.js'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin'
import moment from 'dayjs'
export default {
  mixins: [TableListMixin],
  data() {
    return {
      // 开关
      visible: false,
      // 是否禁用
      disableSubmit: false,
      // 标题
      title: '付款',
      // 当前模式 0-添加 1-编辑 2-详情
      type: 0,
      // 表单配置
      labelCol: { span: 4 },
      wrapperCol: { span: 17 },

      // 表单参数
      formParams: {
        time: moment().format('YYYY-MM-DD'), //当前时间
      },
      // 上传地址
      uploadUrl: process.env.VUE_APP_API_BASE_URL + '/sys/common/upload',
      // 上传请求头
      headers: {
        'X-Access-Token': this.$ls.get('Access-Token'),
      },
      certificateUrl: [], //合同文件上传列表
      pictureTempListImage: [],

      disableMixinCreated: true,
      // 表单验证规则
      rules: {
        time: [{ required: true, message: '请选择付款时间', trigger: 'change' }],
        amount: [{ required: true, message: '请输入付款金额', trigger: 'blur' }],
        type: [{ required: true, message: '请选择付款方式', trigger: 'change' }],
        certificateUrl: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (this.certificateUrl == '') return callback(new Error('请上传文件'))
              callback()
            },
            trigger: 'blur',
          },
        ],
      },
      // 加载动画开关
      loading: false,
      currentRow: {},
      currentId: '',
    }
  },

  methods: {
    moment,
    open(row) {
      this.visible = true
    },
    close() {
      this.visible = false
      // 重置表单
      this.$refs.ruleForm.resetFields()
      this.currentRow = {}
      this.currentId = ''
      this.formParams = {
        time: moment().format('YYYY-MM-DD'), //当前时间
      }
      this.certificateUrl = []
      this.pictureTempListImage = []
    },
    add(record) {
      this.currentId = record.id || record
      console.log(this.currentId)
      // 当前为添加模式
      this.type = 0
      this.title = '付款'
      this.getDetail(this.currentId)
      this.open()
    },
    edit(record, index, id) {
      console.log(record, index, id)
      this.type = 1
      this.currentRow = record
      this.currentId = id
      this.getDetail(id, index)
      this.open()
    },
    detail(record) {
      console.log(record)
      this.currentRow = record
      this.currentId = id
      this.type = 2
      this.getDetail(record.id)
      this.open()
    },
    // 获取详情
    getDetail(id, index) {
      this.loading = true
      getDetail(id)
        .then((res) => {
          if (res.success) {
            if (index == 0 || index) {
              this.formParams = res.result.bill[index]
              // console.log(this.formParams, 'ppppp')
              this.formParams.payableAmount = res.result.payableAmount
              this.formParams.paidAmount = res.result.paidAmount
              this.formParams.unpaidAmount = res.result.unpaidAmount
              this.formParams.amount = res.result.bill[index].amount
              this.$forceUpdate()
              // this.dataSource = res.result.bill
              // this.dataSourceInvoice = res.result.invoice

              let certificateUrl = res.result.bill[index].certificateUrl
                ? res.result.bill[index].certificateUrl.split(',')
                : []
              this.certificateUrl = certificateUrl.map((item, index) => {
                let i = index + 1
                return {
                  uid: index,
                  status: 'done',
                  name: `付款凭证`,
                  url: item,
                }
              })
            } else {
              // console.log(this.formParams, 'aaaaaaaa')
              this.formParams.payableAmount = res.result.payableAmount
              this.formParams.paidAmount = res.result.paidAmount
              this.formParams.unpaidAmount = res.result.unpaidAmount
            }
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 上传文件改变时的状态
    handleUploadChange(info) {
      console.log(info)

      let fileList = [...info.fileList]
      this.certificateUrl = fileList

      if (info.file.status === 'uploading') {
        return
      }
      if (info.file.status === 'done') {
        let a = fileList[fileList.length - 1]
        this.pictureTempListImage.push({
          uid: a.uid,
          status: 'done',
          name: a.name,
          url: a.response.message,
        })

        this.certificateUrl = this.pictureTempListImage
        const data = this.certificateUrl.map((item) => item.url).toString()
        this.formParams.certificateUrl = data
      }
    },
    // 移除
    handleRemoveImage(file) {
      this.pictureTempListImage.splice(this.pictureTempListImage.indexOf(file), 1)
    },
    //提交
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let data = {
            ...this.formParams,
            operator: this.$store.getters.userInfo.realname,
          }
          if (this.type == 0) {
            addPayment(this.currentId, data).then((res) => {
              if (res.success) {
                this.$message.success(res.message)
                this.$emit('refresh')
                this.close()
              } else {
                this.$message.warning(res.message)
              }
              return res
            })
          } else {
            let editData = {
              id: this.currentId,
              bill: this.formParams,
            }
            editPayment(editData).then((res) => {
              if (res.success) {
                this.$message.success(res.message)
                this.$emit('refresh')
                this.close()
              } else {
                this.$message.warning(res.message)
              }
              return res
            })
          }
        } else {
          return false
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
.title {
  background-color: #f8faff;
  padding: 10px;
  margin-bottom: 10px;
  font-weight: 600;
}
.details {
  color: #e65b07;
  margin: 0 0 10px 40px;
  cursor: pointer;
}
.table {
  margin-bottom: 20px;
}
</style>
