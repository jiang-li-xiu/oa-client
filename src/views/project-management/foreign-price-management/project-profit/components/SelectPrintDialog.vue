<!--
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-10-27 11:01:37
 * @LastEditors: JLX
 * @LastEditTime: 2022-10-27 11:20:35
-->
div<!--
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-09-19 17:17:44
 * @LastEditors: JLX
 * @LastEditTime: 2022-10-09 10:09:04
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
                <a-select v-model="formParams.name" placeholder="请选择导出pdf类型">
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
        <a-button @click="handleExportXls()" type="primary">预览</a-button>
      </template>
    </a-modal>

    <!-- 打印预览 -->
    <Print ref="print" :data="data" :proInfo="proInfo" :columnsDetail="columnsDetail"></Print>
  </div>
</template>

<script>
import Print from './PrintDiloag.vue'
import { TableListMixin } from '@/mixins/TableListMixin'
export default {
  mixins: [TableListMixin],
  components: { Print },
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    // 产品表格数据
    proInfo: {
      type: Array,
      default: () => []
    },
    // 产品表格
    columnsDetail: {
      type: Array,
      default: () => []
    }
  },
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
        name: [{ required: true, message: '请选择', trigger: 'change' }]
      },
      disableMixinCreated: true, //不执行混入
      // 加载动画开关
      loading: false,
      id: '' //传过来的id
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
      // 重置表单
      this.$refs.ruleForm.resetFields()
      this.formParams = {}
    },

    handleExportXls() {
      this.$refs.print.open(this.formParams.name)
      this.close()
    }
  }
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
