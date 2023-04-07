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
          <a-col :span="24">
            <a-form-model-item label="项目名称" prop="name">
              <a-input v-model="formParams.name" placeholder="请输入项目名称" :disabled="disableSubmit" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="项目类型" prop="type">
              <j-dict-select-tag
                v-model="formParams.type"
                dictCode="project_type"
                placeholder="请选择项目名称"
                :disabled="disableSubmit"
              />
              <!-- 1-软件项目，2-设备，3-智能化 -->
              <!-- <a-select v-model="formParams.type" placeholder="请选择项目名称" :disabled="disableSubmit">
                <a-select-option :value="1">软件项目 </a-select-option>
                <a-select-option :value="2">设备 </a-select-option>
                <a-select-option :value="3">智能化 </a-select-option>
              </a-select> -->
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="客户名称" prop="companyName">
              <a-input v-model="formParams.companyName" placeholder="请输入客户名称" :disabled="disableSubmit" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="客户联系人" prop="customerName">
              <a-input v-model="formParams.customerName" placeholder="请输入客户联系人" :disabled="disableSubmit" />
            </a-form-model-item>
          </a-col>

          <a-col :span="24">
            <a-form-model-item label="客户联系方式" prop="customerPhone">
              <a-input
                v-model="formParams.customerPhone"
                placeholder="请输入客户联系方式"
                :disabled="disableSubmit"
                :maxLength="11"
              />
            </a-form-model-item>
          </a-col>

          <a-col :span="24">
            <a-form-model-item label="项目经理" prop="projectManagerId">
              <a-select v-model="formParams.projectManagerId" :disabled="disableSubmit" placeholder="请选择项目经理">
                <a-select-option v-for="item in projectManagerList" :key="item.id" :value="item.id">
                  {{ item.realname }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="立项时间" prop="createTime">
              <j-date
                v-model="formParams.createTime"
                :showTime="true"
                dateFormat="YYYY-MM-DD"
                :disabled="disableSubmit"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="签订合同时间" prop="signContractTime">
              <j-date
                v-model="formParams.signContractTime"
                :showTime="true"
                dateFormat="YYYY-MM-DD"
                :disabled="disableSubmit"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="项目地址" prop="address">
              <a-input v-model="formParams.address" placeholder="请输入项目地址" :disabled="disableSubmit" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="项目状态" prop="status">
              <j-dict-select-tag
                v-model="formParams.status"
                placeholder="请选择项目状态"
                dictCode="project_status"
                :disabled="disableSubmit"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="备注" prop="remark">
              <a-textarea v-model="formParams.remark" placeholder="请输入备注" :rows="3" :disabled="disableSubmit" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-spin>

    <div class="drawer-bootom-button" v-if="this.type !== 2 && this.type !== 3">
      <a-button @click="close" style="margin-right: 0.8rem">取消</a-button>
      <a-button @click="handleOk" type="primary" :loading="loading">保存</a-button>
    </div>
  </a-drawer>
</template>

<script>
// API
import { addProject, editProject, getDetail } from '@/api/project-management/ProjectInformation.js'
import { getUserList } from '@/api/api.js'
export default {
  data() {
    return {
      // 开关
      visible: false,
      // 是否禁用
      disableSubmit: false,
      // 标题
      title: '新增',
      // 当前模式 0-添加 1-编辑 2-详情
      type: 0,
      // 表单配置
      labelCol: { span: 6 },
      wrapperCol: { span: 17 },
      // 表单参数
      formParams: {},
      // 表单验证规则
      rules: {
        name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择项目类型', trigger: 'change' }],
        companyName: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
        projectManagerId: [{ required: true, message: '请选择项目经理', trigger: 'change' }],
        customerName: [{ required: true, message: '请输入客户名称', trigger: 'change' }],
        customerPhone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: this.validateMobile }
        ]
      },
      // 加载动画开关
      loading: false,
      projectManagerList: [] //项目经理列表
    }
  },

  methods: {
    validateMobile(rule, value, callback) {
      if (!value || new RegExp(/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/).test(value)) {
        callback()
      } else {
        callback('您的手机号码格式不正确!')
      }
    },

    // 打开弹窗
    open(row) {
      this.visible = true
      this.getProjectManagerList()
    },

    // 关闭弹窗，点击遮罩层或右上角叉或取消按钮时触发
    close() {
      this.visible = false
      // 重置表单
      this.$refs.ruleForm.resetFields()
      this.formParams = {}
    },

    // 项目经理列表
    getProjectManagerList() {
      getUserList().then(res => {
        this.projectManagerList = res.result.records
      })
    },

    // 添加
    add() {
      // 当前为添加模式
      this.type = 0
      this.open()
    },

    // 编辑
    edit(record) {
      this.type = 1
      this.getDetail(record.id)
      this.open()
    },

    // 详情
    detail(record) {
      this.type = 2
      this.getDetail(record.id)
      this.open()
    },

    // 获取详情
    getDetail(id) {
      getDetail(id).then(res => {
        if (res.success) {
          this.formParams = res.result
        }
      })
    },

    //提交
    handleOk() {
      console.log(this.formParams)
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          // 添加
          if (this.type == 0) {
            addProject(this.formParams).then(res => {
              if (res.success) {
                this.$message.success(res.message)
                this.$emit('refresh')
              } else {
                this.$message.error(res.message)
              }
              this.close()
            })
          } else if (this.type == 1) {
            // 编辑
            editProject(this.formParams).then(res => {
              if (res.success) {
                this.$message.success(res.message)
                this.$emit('refresh')
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
    }
  }
}
</script>

<style lang="less" scoped>
.title {
  background-color: #f8faff;
  padding: 10px;
  margin-bottom: 10px;
  font-weight: 600;
}
</style>
