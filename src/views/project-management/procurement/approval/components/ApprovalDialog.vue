<!--
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-09-06 09:19:22
 * @LastEditors: JLX
 * @LastEditTime: 2022-11-15 17:47:48
-->
<template>
  <div>
    <a-modal title="审批" :width="600" :visible.sync="visible" :confirmLoading="loading" @cancel="close">
      <a-spin tip="加载中..." :spinning="loading">
        <a-form-model
          ref="ruleForm"
          :model="formParams"
          :rules="validatorRules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-row>
            <a-col :span="24">
              <a-form-model-item
                label="审批意见"
                prop="remark"
                :rules="formParams.type == 2 ? [{ required: false }] : validatorRules.remark"
              >
                <a-textarea
                  v-model="formParams.remark"
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
        <a-button type="primary" @click="submitApproval()" :loading="loading">确认</a-button>
      </template>
    </a-modal>

    <!-- 确认审核的弹窗 -->
    <a-modal width="450px" v-model="auditVisible" title="请确认" on-ok="handleApproval">
      <template slot="footer">
        <a-button key="back" @click="handleApproval(1)">不通过 </a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="handleApproval(2)"> 通过 </a-button>
      </template>

      <p><a-icon type="question-circle" theme="twoTone" /> 请确认：是否通过该审核？</p>
    </a-modal>
  </div>
</template>

<script>
// api
import { approvalPass, approvalNoPass } from '@/api/procurement/ProcurementList.js'
import { postAction } from '@/api/manage'
export default {
  props: {
    // 不通过
    noPass: {
      type: String,
      default: '/jeecg-supplier/ProdProfitsApprove/not/pass',
    },
    // 通过
    pass: {
      type: String,
      default: '/jeecg-supplier/ProdProfitsApprove/pass',
    },
  },
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
      validatorRules: {
        remark: [{ required: true, message: '请输入审批意见', trigger: 'blur' }],
      },
      // 加载动画开关
      loading: false,
      auditVisible: false, //审核确认显示
      info: [],
      // 请求地址
      url: {
        noPass: this.noPass, //不通过
        pass: this.pass, //通过
      },
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
        remark: '',
      }
    },

    // 打开审核
    openApproval(row) {
      console.log(row)
      // 当前审核的信息
      this.info = row
      this.auditVisible = true
    },

    // 填写意见
    handleApproval(type) {
      this.open(this.info)
      this.type = type
      this.formParams.type = type
    },

    // 提交审核 (0-待审批，1-已审批，2-审批通过，3审批不通过)
    submitApproval() {
      console.log(this.type)
      // if (value == 1) {
      //   // 不通过
      //   this.open(this.info)
      // }
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.type == 1) {
            console.log('不通过')
            // 不通过原因 确认发起的请求
            approvalNoPass({
              remark: this.formParams.remark,
              details: this.info.details.toString() || this.info,
              id: this.info.id.toString(),
              approval: 3,
              applicat: this.info.applicat, //申请人
              department: this.info.department, //部门
            }).then((res) => {
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
            console.log('通过')
            // 通过
            approvalPass({
              remark: this.formParams.remark,
              details: this.info.details.toString() || this.info,
              id: this.info.id.toString(),
              approval: 2,
              applicat: this.info.applicat, //申请人
              department: this.info.department, //部门
            }).then((res) => {
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

<style lang="less" scoped></style>
