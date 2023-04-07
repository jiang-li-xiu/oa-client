<template>
  <div>
    <a-modal title="回退" :width="600" :visible.sync="visible" :confirmLoading="loading" @cancel="close">
      <a-spin tip="加载中..." :spinning="loading">
        <a-form-model ref="ruleForm" :model="formParams" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-row>
            <a-col :span="24">
              <a-form-model-item label="回退至" prop="pendingId">
                <a-select v-model="formParams.pendingId" placeholder="请选择">
                  <a-select-option
                    v-for="item in this.info.approvalProcess"
                    :value="item.pendingId"
                    :key="item.pendingId"
                  >
                    {{ item.processName + '：' + item.name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>

            <a-col :span="24">
              <a-form-model-item label="回退意见" prop="remark">
                <a-textarea
                  v-model="formParams.remark"
                  placeholder="请输入回退意见"
                  :disabled="disableSubmit"
                  :rows="3"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </a-spin>

      <template slot="footer">
        <a-button @click="close">取消</a-button>
        <a-button type="primary" @click="submitApproval()" :loading="loading">确认</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { fallback } from '@/api/project-management/QuotationApplication.js'
export default {
  data() {
    return {
      // 开关
      visible: false,
      // 是否禁用
      disableSubmit: false,
      // 当前模式 1不通过 2通过
      type: 1,
      // 表单配置
      labelCol: { span: 6 },
      wrapperCol: { span: 17 },
      // 表单参数
      formParams: {
        remark: '',
      },
      // 表单验证规则
      rules: {
        pendingId: [{ required: true, message: '请选择回退至', trigger: 'change' }],
        remark: [{ required: true, message: '请输入回退意见', trigger: 'blur' }],
      },
      // 加载动画开关
      loading: false,
      auditVisible: false, //审核确认显示
      info: [],
    }
  },

  methods: {
    // 打开弹窗
    open(row) {
      console.log('回退----------', row)
      this.visible = true
      // 当前的信息
      this.info = row
    },

    // 关闭弹窗，点击遮罩层或右上角叉或取消按钮时触发
    close() {
      this.visible = false
      this.auditVisible = false
      // 重置表单
      // this.$refs.ruleForm.resetFields()
      this.formParams = {
        remark: '',
      }
    },

    // 提交
    submitApproval() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let data = {
            ...this.formParams,
            id: this.info.id.toString() || this.info,
          }
          fallback(data).then((res) => {
            if (res.success) {
              this.$message.success('操作成功')
              this.$emit('refresh')
              this.close()
            } else {
              this.$message.error(res.message)
            }
            this.close()
          })
        } else {
          return false
        }
      })
    },
  },
}
</script>

<style lang="less" scoped></style>
