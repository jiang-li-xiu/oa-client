div
<!--
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-09-19 17:17:44
 * @LastEditors: JLX
 * @LastEditTime: 2023-03-27 16:37:37
-->
<template>
  <div>
    <a-modal title="选择导出类型" :width="900" :visible.sync="visible" :confirmLoading="loading" @cancel="close">
      <a-spin tip="加载中..." :spinning="loading">
        <a-form-model
          tip="加载中..."
          ref="ruleForm"
          :model="formParams"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :rules="rules"
        >
          <a-row>
            <a-col :span="24">
              <a-form-model-item label="导出类型" prop="name">
                <a-select v-model="formParams.name" placeholder="请选择导出内容">
                  <a-select-option :value="0">广西路盛通智能科技有限公司</a-select-option>
                  <a-select-option :value="1">上海勤岭智能科技有限公司</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </a-spin>

      <template slot="footer">
        <a-button type="dashed" @click="close">取消</a-button>
        <a-button @click="handleExportXls('报价单')" type="primary">确认导出</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { downFile } from '@/api/manage'
import { TableListMixin } from '@/mixins/TableListMixin'
export default {
  mixins: [TableListMixin],
  data() {
    return {
      // 开关
      visible: false,
      // 表单配置
      labelCol: { span: 4 },
      wrapperCol: { span: 17 },
      // 表单参数
      formParams: {},
      // 表单验证规则
      rules: {
        name: [{ required: true, message: '请选择', trigger: 'change' }],
      },
      disableMixinCreated: true, //不执行混入
      // 加载动画开关
      loading: false,
      id: '', //传过来的id
    }
  },

  methods: {
    // 打开弹窗
    open(fileName, id) {
      console.log(id)
      this.id = id
      this.visible = true
    },

    // 关闭弹窗，点击遮罩层或右上角叉或取消按钮时触发
    close() {
      this.visible = false
      // 重置表单
      this.$refs.ruleForm.resetFields()
      this.formParams = {}
    },

    handleExportXls(fileName) {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (!fileName || typeof fileName != 'string') {
            fileName = '导出文件'
          }
          // let param = this.getQueryParams()
          // param.id = this.approvalId // 传id，这个id其实就是当前数据id
          // if (this.selectedRowKeys && this.selectedRowKeys.length > 0) {
          //   param['selections'] = this.selectedRowKeys.join(',')
          // }
          // console.log('导出参数', param)
          //路盛通模板：0 勤岭模板：1
          let url = this.formParams.name == 0 ? '/prod/quoteInfo/export/lst/' : '/prod/quoteInfo/export/qinling/'
          downFile(url + `${this.id}`).then((data) => {
            const fileNameServer = decodeURIComponent(data['content-disposition']).split('=')[1]
            console.log(data, fileNameServer)
            const newFileName = fileNameServer ? fileNameServer : fileName + '.xls'

            if (!data) {
              this.$message.warning('文件下载失败')
              return
            }
            if (typeof window.navigator.msSaveBlob !== 'undefined') {
              window.navigator.msSaveBlob(new Blob([data], { type: 'application/vnd.ms-excel' }), newFileName)
            } else {
              let url = window.URL.createObjectURL(new Blob([data], { type: 'application/vnd.ms-excel' }))
              let link = document.createElement('a')
              link.style.display = 'none'
              link.href = url
              link.setAttribute('download', newFileName)
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link) //下载完成移除元素
              window.URL.revokeObjectURL(url) //释放掉blob对象
            }
          })
        }
      })
      this.close()
    },
  },
}
</script>

<style lang="less" scoped>
.space-margin {
  margin-bottom: 20px;
}
.left-padding {
  padding-left: 10px;
}
.config-box {
  padding-bottom: 10px;
}
</style>
