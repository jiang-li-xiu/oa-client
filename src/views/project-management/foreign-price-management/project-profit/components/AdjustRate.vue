<!--
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-09-19 17:17:44
 * @LastEditors: JLX
 * @LastEditTime: 2023-03-02 17:27:19
-->
<template>
  <div>
    <a-modal title="调整毛利" :width="600" :visible.sync="visible" :confirmLoading="loading" @cancel="close">
      <a-spin tip="加载中..." :spinning="loading">
        <a-form-model ref="ruleForm" :model="formParams" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-row>
            <a-col :span="24">
              <a-form-model-item label="新毛利" prop="approvalComment">
                <a-input-number
                  v-model="formParams.approvalComment"
                  placeholder="请输入新毛利"
                  style="width: 70%"
                  :formatter="(value) => `${value}%`"
                  :parser="(value) => value.replace('%', '')"
                  :default-value="0"
                  :precision="2"
                  :step="0.01"
                  :max="99.99"
                  :min="0"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </a-spin>

      <template slot="footer">
        <a-button type="dashed" @click="close">取消</a-button>
        <a-button type="primary" @click="handleOk" :loading="loading">确认</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 开关
      visible: false,
      // 表单配置
      labelCol: { span: 6 },
      wrapperCol: { span: 17 },
      // 表单参数
      formParams: {
        approvalComment: '',
      },
      // 表单验证规则
      rules: {
        approvalComment: [{ required: true, message: '请输入新毛利', trigger: 'blur' }],
      },
      // 加载动画开关
      loading: false,
      id: '', //传过来的id
    }
  },

  methods: {
    // 打开弹窗
    open(id) {
      console.log(id)
      this.id = id
      this.visible = true
    },

    // 关闭弹窗，点击遮罩层或右上角叉或取消按钮时触发
    close() {
      this.visible = false
      // 重置表单
      // this.$refs.ruleForm.resetFields()
      this.formParams = {
        approvalComment: '',
      }
    },

    handleOk() {
      console.log(this.id, this.formParams)
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let data = {
            key: this.id,
            profit: this.formParams.approvalComment,
          }
          // 发给父组件
          this.$emit('changeProfit', data)
          this.close()
        } else {
          return false
        }
      })
    },
  },
}
</script>

<style lang="less" scoped></style>
