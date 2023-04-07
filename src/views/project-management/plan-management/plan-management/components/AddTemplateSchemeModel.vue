<template>
  <a-modal :title="title" :width="600" :visible.sync="visible" :confirmLoading="loading" @cancel="close">
    <a-spin tip="加载中..." :spinning="loading">
      <a-form-model ref="ruleForm2" :model="modelForm" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="方案类别" prop="schemeType">
              <a-select v-model="modelForm.schemeType" show-search placeholder="请选择" readOnly>
                <a-select-option :value="1">工程</a-select-option>
                <a-select-option :value="2">软件</a-select-option>
              </a-select>
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
</template>

<script>
export default {
  components: {},
  data() {
    return {
      // 开关
      visible: false,
      type: 0,
      // 加载动画开关
      loading: false,
      // 标题
      title: '新增模板',
      // 表单配置
      labelCol: { span: 4 },
      wrapperCol: { span: 17 },
      // 表单参数
      modelForm: {},
      rules: {
        schemeType: [{ required: true, message: '请选择方案类别', trigger: 'change' }],
      },
    }
  },

  methods: {
    // 打开弹窗
    open() {
      this.visible = true
    },
    add() {
      this.open()
    },
    close() {
      this.visible = false
      // 重置表单
      this.$refs.ruleForm.resetFields()
      this.modelForm = {}
    },
    handleOk() {},
  },
}
</script>

<style lang="less" scoped>
::v-deep .ant-table td {
  white-space: nowrap;
}
.title {
  background-color: #f8faff;
  padding: 10px;
  margin-bottom: 10px;
  font-weight: 600;
}
.buttom {
  margin: 10px 5px;
}
</style>
