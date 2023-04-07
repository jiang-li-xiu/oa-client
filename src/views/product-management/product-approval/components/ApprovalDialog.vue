<!--
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-09-06 09:19:22
 * @LastEditors: JLX
 * @LastEditTime: 2022-11-03 14:27:54
-->
<template>
  <div>
    <a-modal title="审批" :width="600" :visible.sync="visible" :confirmLoading="loading" @cancel="close">
      <a-spin tip="加载中..." :spinning="loading">
        <a-form-model ref="ruleForm" :model="formParams" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-row>
            <a-col :span="24">
              <a-form-model-item label="审批意见" prop="approvalComment">
                <a-textarea
                  v-model="formParams.approvalComment"
                  placeholder="请输入审批意见"
                  :disabled="disableSubmit"
                  :rows="5"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </a-spin>

      <template slot="footer">
        <a-button type="primary" @click="handleApproval(3)" :loading="loading">确认</a-button>
      </template>
    </a-modal>

    <!-- 确认审核的弹窗 -->
    <a-modal width="450px" v-model="auditVisible" title="请确认" on-ok="handleApproval">
      <template slot="footer">
        <a-button key="back" @click="handleApproval(1)">不通过 </a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="handleApproval(2)"> 通过 </a-button>
      </template>

      <p><a-icon type="question-circle" theme="twoTone" /> 确认：是否确认审核？</p>
    </a-modal>
  </div>
</template>

<script>
// api
import { passProduct } from '@api/product-management/productApproval.js'
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
        approvalComment: ''
      },
      // 表单验证规则
      rules: {
        approvalComment: [{ required: true, message: '请输入审批意见', trigger: 'blur' }]
      },
      // 加载动画开关
      loading: false,
      auditVisible: false, //审核确认显示
      info: []
    }
  },

  methods: {
    // 打开弹窗
    open() {
      this.visible = true
    },

    // 关闭弹窗，点击遮罩层或右上角叉或取消按钮时触发
    close() {
      this.visible = false
      this.auditVisible = false
      // 重置表单
      // this.$refs.ruleForm.resetFields()
      this.formParams = {
        approvalComment: ''
      }
    },

    // 打开审核
    openApproval(row) {
      console.log(row)
      // 当前审核的信息
      this.info = row
      this.auditVisible = true
    },

    // 提交审核 (0-待审批，1-已审批，2-审批通过，3审批不通过)
    handleApproval(value) {
      if (value == 1) {
        this.open(this.info)
      } else if (value == 3) {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            // 确认发起的请求
            passProduct({
              approvalComment: this.formParams.approvalComment,
              id: this.info.id.toString() || this.info,
              approval: 3
            }).then(res => {
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
      } else if (value == 2) {
        // 确认发起的请求
        passProduct({
          approvalComment: this.formParams.approvalComment,
          id: this.info.id.toString() || this.info,
          approval: 2
        }).then(res => {
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
    }
  }
}
</script>

<style lang="less" scoped></style>
