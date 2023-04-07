<template>
  <div>
    <a-modal title="编辑序列号" :width="800" :visible.sync="visible" :confirmLoading="loading" @cancel="close">
      <a-spin tip="加载中..." :spinning="loading">
        <a-form-model ref="ruleForm" :model="formParams" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="产品型号" prop="model">
                <a-input v-model="formParams.model" placeholder="请输入产品型号" :disabled="disableSubmit" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="产品名称" prop="productName">
                <a-input v-model="formParams.productName" placeholder="请输入产品名称" :disabled="disableSubmit" />
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item
                label="产品序列号"
                prop="serialNumber"
                :label-col="{ span: 3 }"
                :wrapper-col="{ span: 19 }"
              >
                <a-input v-model="formParams.serialNumber" placeholder="请输入产品序列号" :disabled="disableSubmit" />
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </a-spin>

      <template slot="footer">
        <a-button @click="close" :loading="loading">取消</a-button>
        <a-button type="primary" @click="handleOk" :loading="loading">确认</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
// API
import { editEqumentNum } from '@/api/procurement/Order.js'
export default {
  data() {
    return {
      // 开关
      visible: false,
      // 是否禁用
      disableSubmit: false,
      // 当前模式 0-添加 1-编辑 2-详情
      type: 0,
      // 表单配置
      labelCol: { span: 6 },
      wrapperCol: { span: 17 },
      // 表单参数
      formParams: {
        serialNumber: ''
      },
      // 表单验证规则
      rules: {
        // serialNumber: [{ required: true, message: '请输入', trigger: 'blur' }]
      },
      // 加载动画开关
      loading: false,
      auditVisible: false, //审核确认显示
      id: ''
    }
  },

  methods: {
    // 打开弹窗
    open(row) {
      console.log(row)
      // 回显数据
      this.formParams = { ...row }
      this.id = row.id
      this.visible = true
    },

    // 关闭弹窗，点击遮罩层或右上角叉或取消按钮时触发
    close() {
      this.visible = false
      this.auditVisible = false
      // 重置表单
      // this.$refs.ruleForm.resetFields()
      this.formParams = {
        serialNumber: ''
      }
    },

    // 提交
    handleOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let data = {
            serialNumber: this.formParams.serialNumber,
            id: this.id
          }
          // 确认发起的请求
          this.loading = true
          editEqumentNum(data)
            .then(res => {
              if (res.success) {
                this.$message.success('操作成功')
                this.$emit('refresh')
              } else {
                this.$message.error(res.message)
              }
              this.close()
            })
            .finally(() => {
              this.loading = false
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
