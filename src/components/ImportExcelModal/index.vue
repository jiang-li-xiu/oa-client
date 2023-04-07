<template>
  <a-drawer
    title="导入"
    :maskClosable="true"
    width="600"
    placement="right"
    :closable="true"
    @close="handleClose"
    :visible="visible"
    style="overflow: auto; padding-bottom: 53px"
  >
    <a-form-model ref="ruleForm" :model="param" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-row>
        <a-col :span="24" v-if="showModel">
          <slot :param="param">
            <a-form-model-item label="供应商名称" prop="supplierName">
              <a-select
                v-model="param.supplierName"
                placeholder="请选择供应商名称"
                allowClear
                show-search
                :filter-option="filterOption"
              >
                <a-select-option v-for="item in list" :key="item.id" :value="item.id">
                  {{ item.supplier }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </slot>
        </a-col>
        <a-col :span="24">
          <a-form-model-item label="上传" prop="upload">
            <a-upload
              v-model="param.upload"
              name="file"
              :multiple="true"
              accept=".xls, .xlsx"
              :fileList="fileList"
              :remove="handleRemove"
              :beforeUpload="beforeUpload"
              @change="handleChange"
            >
              <a-button icon="upload" v-if="fileList.length < 1">上传文件</a-button>
            </a-upload>
            <div class="tip">支持扩展名：.xlsx .xls</div>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>

    <div class="drawer-bootom-button">
      <a-button @click="handleClose" style="margin-right: 0.8rem">取消</a-button>
      <a-button @click="handleImport" type="primary" :disabled="fileList.length === 0" :loading="uploading">
        {{ uploading ? '上传中...' : '开始上传' }}
      </a-button>
    </div>
  </a-drawer>
</template>

<script>
import { postAction, downFile } from '@/api/manage'
export default {
  name: 'JImportModal',
  props: {
    url: {
      type: String,
      default: '',
      required: false,
    },
    biz: {
      type: String,
      default: '',
      required: false,
    },
    //是否online导入
    online: {
      type: Boolean,
      default: false,
      required: false,
    },
    list: {
      type: [Array, Object],
      default: () => [],
      required: false,
    },
    showModel: {
      type: Boolean,
      default: false,
    },
    // 插槽数据
    slotParams: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      visible: false,
      uploading: false,
      fileList: [],
      uploadAction: '',
      foreignKeys: '',
      validateStatus: 0,
      // 表单配置
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
      param: {},
      // 表单验证规则
      rules: {
        supplierName: [{ required: true, message: '请选择供应商名称', trigger: 'change' }],
      },
      newList: [],
    }
  },
  watch: {
    url(val) {
      if (val) {
        this.uploadAction = val
      }
    },
    list(val) {
      if (val) {
        this.newList = val
      }
    },
    slotParams: {
      handler(newVlaue) {
        Object.assign(this.slotParams, this.param)
        this.param = this.slotParams
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    this.uploadAction = this.url
    this.newList = this.list
  },

  methods: {
    // 搜索
    filterOption(input, option) {
      console.log(input, option)
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    // 关闭弹窗
    handleClose() {
      this.visible = false
      this.param = {}
      this.$refs.ruleForm.resetFields()
      // this.list = []
    },
    // 打开导入弹窗，在父组件调用
    show(arg) {
      this.param = {}
      this.fileList = []
      this.uploading = false
      this.visible = true
      this.foreignKeys = arg
      this.validateStatus = 0
      this.$emit('getModel')
    },
    // 移除导入文件
    handleRemove(file) {
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList
    },
    //
    beforeUpload(file) {
      this.fileList = [...this.fileList, file]
      return false
    },
    // 导入
    handleImport() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const { fileList } = this
          const formData = new FormData()
          if (this.biz) {
            formData.append('isSingleTableImport', this.biz)
          }
          if (this.foreignKeys && this.foreignKeys.length > 0) {
            formData.append('foreignKeys', this.foreignKeys)
          }
          if (this.online == true) {
            formData.append('validateStatus', this.validateStatus)
          }
          fileList.forEach((file) => {
            formData.append('file', file)
          })
          this.uploading = true
          let url = this.showModel ? this.uploadAction + `/${this.param.supplierName}` : this.uploadAction
          postAction(url, formData).then((res) => {
            this.uploading = false
            if (res.success) {
              if (res.result !== null) {
                this.$warning({
                  title: '',
                  content: (
                    <div>
                      <span>{res.message}</span>
                      <br />
                    </div>
                  ),
                })
              } else {
                this.$message.success(res.message)
              }
              this.visible = false
              this.$emit('ok')
            } else {
              this.$message.warning(res.message)
            }
          })
        }
      })
    },
    // 是否开启校验 开关改变事件
    handleChangeValidateStatus(checked) {
      this.validateStatus = checked == true ? 1 : 0
    },
    // 错误信息提示
    errorTip(tipMessage, fileUrl) {
      const h = this.$createElement
      let href = window._CONFIG['domianURL'] + fileUrl
      this.$warning({
        title: '导入成功,但是有错误数据!',
        content: h('div', {}, [
          h('div', tipMessage),
          h('span', '具体详情请 '),
          h(
            'a',
            {
              attrs: {
                href: href,
                target: '_blank',
              },
            },
            '点击下载'
          ),
        ]),
        onOk() {},
      })
    },
    handleChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        this.$message.success(`${info.file.name} file uploaded successfully`)
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`)
      }
    },
  },
}
</script>

<style lang="less" scoped>
.tip {
  font-size: 10px;
}
</style>
