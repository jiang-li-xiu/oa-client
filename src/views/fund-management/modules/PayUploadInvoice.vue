<template>
  <a-modal title="上传发票" :width="700" :visible.sync="visible" :confirmLoading="loading" @cancel="close">
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
              <a-form-model-item label="发票状态" prop="status">
                <a-select v-model="formParams.status" placeholder="请选择发票状态">
                  <a-select-option :value="1">未收齐 </a-select-option>
                  <a-select-option :value="2">已收齐 </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="发票文件" prop="invoiceUrl">
                <a-upload
                  :action="uploadUrl"
                  :multiple="true"
                  :file-list="invoiceUrl"
                  :headers="headers"
                  :disabled="disableSubmit"
                  @change="handleUploadChange"
                  :remove="handleRemoveImage"
                >
                  <a v-if="invoiceUrl.length < 1" type="primary" icon="upload">上传文件 </a>
                </a-upload>
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
import { getDetail, addInvoice, editInvoice, deleteInvoice } from '@/api/fund-management/PaymentList.js'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin'
export default {
  mixins: [TableListMixin],
  data() {
    return {
      // 开关
      visible: false,
      // 是否禁用
      disableSubmit: false,
      // 当前模式 0-添加 1-编辑 2-详情
      type: 0,
      // 表单配置
      labelCol: { span: 4 },
      wrapperCol: { span: 17 },

      // 表单参数
      formParams: {},
      // 上传地址
      uploadUrl: process.env.VUE_APP_API_BASE_URL + '/sys/common/upload',
      // 上传请求头
      headers: {
        'X-Access-Token': this.$ls.get('Access-Token'),
      },
      invoiceUrl: [], //合同文件上传列表
      pictureTempListImage: [],

      disableMixinCreated: true,
      // 表单验证规则
      rules: {
        status: [{ required: true, message: '请选择发票状态', trigger: 'change' }],
        invoiceUrl: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (this.invoiceUrl == '') return callback(new Error('请上传发票文件'))
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
    open(row) {
      this.visible = true
    },
    close() {
      this.visible = false
      // 重置表单
      this.$refs.ruleForm.resetFields()
      this.formParams = {}
      this.invoiceUrl = []
      this.pictureTempListImage = []
      this.currentRow = {}
      this.currentId = ''
    },
    add(id) {
      this.type = 0
      this.currentId = id
      this.open()
    },
    edit(record, index, id) {
      this.type = 1
      this.currentRow = record
      this.currentId = id
      this.getDetail(id, index)
      this.open()
    },
    detail(record) {
      console.log(record)
      this.type = 2
      this.currentRow = record
      // this.getDetail(record.id)
      this.open()
    },
    // 获取详情
    getDetail(id, index) {
      this.loading = true
      getDetail(id)
        .then((res) => {
          if (res.success) {
            this.formParams = res.result.invoice[index]
            // this.dataSource = res.result.bill
            // this.dataSourceInvoice = res.result.invoice

            let invoiceUrl = res.result.invoice[index].invoiceUrl ? res.result.invoice[index].invoiceUrl.split(',') : []
            this.invoiceUrl = invoiceUrl.map((item, index) => {
              let i = index + 1
              return {
                uid: index,
                status: 'done',
                name: `发票文件`,
                url: item,
              }
            })
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
      this.invoiceUrl = fileList

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

        this.invoiceUrl = this.pictureTempListImage
        const data = this.invoiceUrl.map((item) => item.url).toString()
        this.formParams.invoiceUrl = data
      }
    },
    // 移除
    handleRemoveImage(file) {
      this.pictureTempListImage.splice(this.pictureTempListImage.indexOf(file), 1)
    },
    //提交
    handleOk() {
      console.log('---', this.type,this.currentId)
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let data = {
            ...this.formParams,
            operator: this.$store.getters.userInfo.realname,
          }
          console.log('提交的数据', data)
          if (this.type == 0) {
            addInvoice(this.currentId?.id ??this.currentId, data).then((res) => {
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
              invoice: this.formParams,
            }
            editInvoice(editData).then((res) => {
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
