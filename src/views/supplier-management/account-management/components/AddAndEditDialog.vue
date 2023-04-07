<template>
  <a-drawer
    :title="title"
    :maskClosable="true"
    width="780"
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
            <a-form-model-item label="供应商名称" prop="supplier">
              <a-input
                v-model="formParams.supplier"
                placeholder="请输入供应商名称"
                :maxLength="50"
                :disabled="disableSubmit"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="供应商类型" prop="trade">
              <j-dict-select-tag
                v-model="formParams.trade"
                dictCode="supplier_type"
                placeholder="请选择供应商类型"
                :disabled="disableSubmit"
              />
            </a-form-model-item>
          </a-col>

          <!-- <a-col :span="24">
            <a-form-model-item label="所属行业" prop="industryInvolved">
              <j-category-select
                v-model="formParams.industryInvolved"
                pcode="B04"
                :multiple="false"
                :disabled="disableSubmit"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="产品服务分类" prop="productServiceClassify">
              <j-category-select
                v-model="formParams.productServiceClassify"
                pcode="B06"
                :multiple="false"
                :disabled="disableSubmit"
              />
            </a-form-model-item>
          </a-col> -->
          <a-col :span="24">
            <a-form-model-item label="供应商等级" prop="supplierLevel">
              <j-dict-select-tag
                v-model="formParams.supplierLevel"
                dictCode="credit_rating"
                placeholder="请选择供应商等级"
                :disabled="disableSubmit"
              />
            </a-form-model-item>
          </a-col>

          <a-col :span="24">
            <a-form-model-item label="所属地区" prop="region">
              <j-area-linkage
                :disabled="disableEdit"
                ref="area"
                v-model="formParams.region"
                @change="changeAreaLinkage"
                type="select"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="手机号" prop="phone">
              <a-input
                v-model="formParams.phone"
                placeholder="请输入手机号"
                :disabled="disableSubmit"
                :maxLength="11"
              />
            </a-form-model-item>
          </a-col>
          <!-- <a-col :span="24">
            <a-form-model-item label="密码" prop="password">
              <a-input v-model="formParams.password" placeholder="请输入密码" :disabled="disableSubmit" />
            </a-form-model-item>
          </a-col> -->
        </a-row>
      </a-form-model>
    </a-spin>

    <div class="drawer-bootom-button" v-if="this.type !== 2">
      <a-button @click="close" style="margin-right: 0.8rem">取消</a-button>
      <a-button @click="handleOk" type="primary" :loading="loading">保存</a-button>
    </div>
  </a-drawer>
</template>

<script>
// API
import { addAccount, editAccount, getDetail } from '@/api/supplier-management/accountManagement'
export default {
  data() {
    return {
      // 开关
      visible: false,
      // 是否禁用
      disableSubmit: false,
      disableEdit: false, //禁用地区的编辑、详情
      // 标题
      title: '新增',
      // 当前模式 0-添加 1-编辑 2-详情
      type: 0,
      // 表单配置
      labelCol: { span: 6 },
      wrapperCol: { span: 17 },
      // 表单参数
      formParams: {
        supplier: '',
        // account: '',
        userIdentity: 1, //账号身份标识，1供应商，2内部人员
        accountType: 'gongying',
      },
      // 表单验证规则
      rules: {
        supplier: [{ required: true, message: '请输入供应商名称', trigger: 'blur' }],
        trade: [{ required: true, message: '请选择供应商类型', trigger: 'change' }],
        // account: [{ required: true, message: '请输入供应商账号', trigger: 'blur' }],
        region: [{ required: true, message: '请选择所属地区', trigger: 'change' }],
        industryInvolved: [{ required: true, message: '请选择', trigger: 'change' }],
        productServiceClassify: [{ required: true, message: '请选择', trigger: 'change' }],
        phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }, { validator: this.validateMobile }],
      },
      // 加载动画开关
      loading: false,
    }
  },

  methods: {
    validateMobile(rule, value, callback) {
      if (!value || new RegExp(/^1[3|4|5|7|8|9][0-9]\d{8}$/).test(value)) {
        callback()
      } else {
        callback('您的手机号码格式不正确!')
      }
    },

    // 打开弹窗
    open() {
      this.visible = true
    },

    // 关闭弹窗，点击遮罩层或右上角叉或取消按钮时触发
    close() {
      this.visible = false
      // 重置表单
      this.$refs.ruleForm.resetFields()
      this.formParams = {
        supplier: '',
        account: '',
        userIdentity: 1, //账号身份标识，1供应商，2内部人员
      }
    },

    // 添加
    add() {
      // 当前为添加模式
      this.type = 0
      this.disableEdit = false
      this.open()
    },

    // 编辑
    edit(record) {
      this.type = 1
      this.getDetail(record.id)
      this.disableEdit = true
      this.open()
    },

    // 获取详情
    getDetail(id) {
      getDetail({ id }).then((res) => {
        if (res.success) {
          this.formParams = res.result
        }
      })
    },

    //获取省级信息
    changeAreaLinkage(val) {
      const arr = []
      this.$refs['area'].areaData.getAreaBycode(val, arr, 3)
      // this.formParams.province = arr[0]
      // this.formParams.city = arr[1]
      // this.formParams.country = arr[2]
      this.formParams.city = `${arr[0]}${arr[1]}${arr[2]}`
    },

    //提交
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.type == 0) {
            addAccount(this.formParams).then((res) => {
              console.log(res)
              if (res.success) {
                this.$message.success(res.message)
                this.$emit('refresh')
              } else {
                this.$message.error(res.message)
              }
              this.close()
            })
          } else {
            let data = {
              ...this.formParams,
              id: this.$store.getters.userInfo.id, //当前登录账号的id
              realname: this.formParams.supplier,
            }
            editAccount(data).then((res) => {
              console.log(res)
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
    },
  },
}
</script>

<style lang="less" scoped></style>
