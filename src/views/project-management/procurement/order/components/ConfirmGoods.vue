<template>
  <a-drawer
    :title="title"
    :maskClosable="true"
    width="600"
    placement="right"
    :closable="true"
    @close="close"
    :visible="visible"
    style="overflow: auto; padding-bottom: 53px"
  >
    <a-spin tip="加载中..." :spinning="loading">
      <a-form-model ref="ruleForm" :model="formParams" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row>
          <!-- <a-col :span="24">
            <a-form-model-item :label="this.type == 1 ? '收货时间' : '签收时间'" prop="demandArriveTime">
              <j-date
                v-model="formParams.demandArriveTime"
                :showTime="true"
                dateFormat="YYYY-MM-DD HH:mm:ss"
                :style="{ width: '310px' }"
                placeholder="请选择时间"
                :disabled="disableSubmit"
              />
            </a-form-model-item>
          </a-col> -->
          <a-col :span="24">
            <a-form-model-item :label="this.type == 1 ? '收货图片' : '签收图片'" prop="receiveGoodsPicUrl">
              <a-upload
                :action="uploadUrl"
                list-type="picture-card"
                :headers="headers"
                :file-list="receiveGoodsPicUrl"
                @change="handleUploadChangeImage"
                @preview="handlePreview"
                :remove="handleRemoveImage"
                :disabled="disableSubmit"
              >
                <div v-if="receiveGoodsPicUrl.length < 5">
                  <a-icon type="plus" />
                  <div class="ant-upload-text">上传</div>
                </div>
              </a-upload>
              <div style="color: red">注意：仅支持.jpg/png格式</div>
            </a-form-model-item>
            <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
              <img alt="example" style="width: 100%" :src="previewImage" />
            </a-modal>
          </a-col>
        </a-row>
      </a-form-model>
    </a-spin>

    <div class="drawer-bootom-button">
      <a-button @click="close" style="margin-right: 0.8rem">取消</a-button>
      <a-button @click="handleOk" type="primary" :loading="loading">
        确认{{ this.type == 1 ? '收货' : '签收' }}
      </a-button>
    </div>
  </a-drawer>
</template>

<script>
// API
import { confirmGoods, confirmGoodsSign } from '@/api/procurement/Order.js'
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
      // 标题
      title: '上传图片',

      // 表单配置
      labelCol: { span: 4 },
      wrapperCol: { span: 17 },
      // 预览功能弹窗显隐
      previewVisible: false,
      // 预览地址
      previewImage: '',
      // 上传地址
      uploadUrl: process.env.VUE_APP_API_BASE_URL + '/sys/common/upload',
      // 上传请求头
      headers: {
        'X-Access-Token': this.$ls.get('Access-Token'),
      },
      // 图片上传列表
      receiveGoodsPicUrl: [],
      // 图片处理数据集合
      pictureTempListImage: [],
      // 表单参数
      formParams: {},
      // 表单验证规则
      rules: {
        receiveGoodsPicUrl: [
          {
            required: true,
            validator: (rule, value, callback) => {
              // console.log(this.receiveGoodsPicUrl)
              if (this.receiveGoodsPicUrl == '') return callback(new Error('请上传图片'))
              callback()
            },
            trigger: 'blur',
          },
        ],
      },
      // 加载动画开关
      loading: false,
      disableMixinCreated: true, //不执行混入
      type: '', //类型：1收货 2签收
      row: '',
    }
  },

  methods: {
    // 打开弹窗
    open(row, type) {
      this.row = row
      this.type = type
      this.visible = true
    },

    // 关闭弹窗，点击遮罩层或右上角叉或取消按钮时触发
    close() {
      this.visible = false
      // 重置表单
      this.$refs.ruleForm.resetFields()
      this.formParams = {}
      // 清空图片
      this.receiveGoodsPicUrl = []
      this.pictureTempListImage = []
    },

    // 获取详情
    getDetail(id) {
      getDetail(id).then((res) => {
        if (res.success) {
          this.formParams = res.result
          //处理图片
          let receiveGoodsPicUrl = res.result.receiveGoodsPicUrl ? res.result.receiveGoodsPicUrl.split(',') : []
          this.receiveGoodsPicUrl = receiveGoodsPicUrl.map((item, index) => {
            return {
              uid: index,
              status: 'done',
              name: '图片' + index,
              url: item,
            }
          })
          this.pictureTempListImage = this.receiveGoodsPicUrl
        }
      })
    },

    // 图片上传
    handleUploadChangeImage(info) {
      console.log(info)
      const isLt5M = info.file.size / 1024 / 1024 < 5
      const isJpgOrPng =
        info.file.type === 'image/jpg' || info.file.type === 'image/jpeg' || info.file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('上传图片只能是jpg/png格式!')
        return false
      }
      if (!isLt5M) {
        this.$message.error('上传图片大小不能超过5M!')
        return false
      }

      let fileList = [...info.fileList]
      this.receiveGoodsPicUrl = fileList

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

        this.receiveGoodsPicUrl = this.pictureTempListImage
        const data = this.receiveGoodsPicUrl.map((item) => item.url).toString()
        this.formParams.receiveGoodsPicUrl = data
      }
    },
    // 图片移除
    handleRemoveImage(file) {
      this.pictureTempListImage.splice(this.pictureTempListImage.indexOf(file), 1)
      // 重新处理数据
      this.formParams.receiveGoodsPicUrl = this.pictureTempListImage.map((item) => item.url).toString()
    },
    // 图片预览
    handlePreview(file) {
      this.previewImage = file.url
      this.previewVisible = true
    },
    // 预览弹窗关闭
    handleCancel() {
      this.previewVisible = false
    },

    //提交
    handleOk() {
      console.log('提交的数据', this.formParams)
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // 判断当前模式
          if (this.type === 1) {
            // 签收
            confirmGoods({ receiveGoodsPicUrl: this.formParams.receiveGoodsPicUrl, id: this.row.id }).then((res) => {
              if (res.success) {
                this.$message.success('操作成功')
                this.$emit('refresh')
                this.close()
              } else {
                this.$message.error(res.message)
              }
              this.close()
            })
          } else if (this.type == 2) {
            // 签收
            confirmGoodsSign({ signReceiptPicUrl: this.formParams.receiveGoodsPicUrl, id: this.row.id }).then((res) => {
              if (res.success) {
                this.$message.success('操作成功')
                this.$emit('refresh')
                this.close()
              } else {
                this.$message.error(res.message)
              }
              this.close()
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
.button {
  margin-top: 15px;
  width: 100%;
  margin-bottom: 20px;
}
</style>
