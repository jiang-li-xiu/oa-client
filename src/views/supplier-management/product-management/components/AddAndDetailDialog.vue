// 不用了
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
        <template v-if="this.type !== 3">
          <a-row>
            <a-col :span="24">
              <a-form-model-item label="供应商名称" prop="supplierName">
                <a-select
                  v-model="formParams.supplierName"
                  :disabled="$route.query.supplierName ? disabled : disableSubmit"
                  placeholder="请选择供应商名称"
                  @change="handleChangeSupplier"
                >
                  <a-select-option v-for="item in basicNameList" :key="item.id" :value="item.basicInfoId">
                    {{ item.basicName }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="商品名称" prop="productName">
                <a-input v-model="formParams.productName" placeholder="请输入商品名称" :disabled="disableSubmit" />
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="产品分类" prop="type">
                <j-category-select v-model="formParams.type" pcode="B03" :multiple="false" :disabled="disableSubmit" />
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="品牌" prop="brand">
                <a-input v-model="formParams.brand" placeholder="请输入品牌" :disabled="disableSubmit" />
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="规格参数" prop="specificationParameter">
                <a-input
                  v-model="formParams.specificationParameter"
                  placeholder="请输入规格参数"
                  :disabled="disableSubmit"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="单价(元)" prop="univalence">
                <a-input-number
                  style="width:400px"
                  v-model="formParams.univalence"
                  placeholder="请输入单价"
                  :precision="2"
                  :disabled="disableSubmit"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="货期" prop="leadTime">
                <a-input-group>
                  <a-input-number
                    style="width: 75%"
                    v-model="formParams.leadTime"
                    placeholder="请输入货期"
                    :min="0"
                    :disabled="disableSubmit"
                  />
                  <a-select
                    v-model="formParams.leadTimeUnit"
                    style="width: 25%"
                    defaultValue="0"
                    :disabled="disableSubmit"
                    placeholder="请选择单位"
                  >
                    <a-select-option value="0">年</a-select-option>
                    <a-select-option value="1">月</a-select-option>
                    <a-select-option value="2">周</a-select-option>
                    <a-select-option value="3">日</a-select-option>
                  </a-select>
                </a-input-group>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="账期" prop="paymentDays">
                <a-input-group>
                  <a-input-number
                    style="width: 75%"
                    v-model="formParams.paymentDays"
                    placeholder="请输入账期"
                    :min="0"
                    :disabled="disableSubmit"
                  />
                  <a-select
                    v-model="formParams.paymentDaysUnit"
                    style="width: 25%"
                    defaultValue="0"
                    :disabled="disableSubmit"
                    placeholder="请选择单位"
                  >
                    <a-select-option value="0">年</a-select-option>
                    <a-select-option value="1">月</a-select-option>
                    <a-select-option value="2">周</a-select-option>
                    <a-select-option value="3">日</a-select-option>
                  </a-select>
                </a-input-group>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="控标点" prop="bidPoint">
                <a-textarea
                  v-model="formParams.bidPoint"
                  placeholder="请输入控标点"
                  :rows="3"
                  :disabled="disableSubmit"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="单价有效期" prop="univalenceIndata">
                <a-input-group>
                  <a-input-number
                    style="width: 75%"
                    v-model="formParams.univalenceIndata"
                    placeholder="请输入单价有效期"
                    :min="0"
                    :disabled="disableSubmit"
                  />
                  <a-select
                    v-model="formParams.univalenceIndataUnit"
                    style="width: 25%"
                    defaultValue="0"
                    :disabled="disableSubmit"
                    placeholder="请选择单位"
                  >
                    <a-select-option value="0">年</a-select-option>
                    <a-select-option value="1">月</a-select-option>
                    <a-select-option value="2">周</a-select-option>
                    <a-select-option value="3">日</a-select-option>
                  </a-select>
                </a-input-group>
              </a-form-model-item>
            </a-col>

            <a-col :span="24">
              <a-form-model-item label="维修地址" prop="maintainAddress">
                <a-input v-model="formParams.maintainAddress" placeholder="请输入维修地址" :disabled="disableSubmit" />
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="维修联系人" prop="maintainPerson">
                <a-input v-model="formParams.maintainPerson" placeholder="请输入维修联系人" :disabled="disableSubmit" />
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="维修电话" prop="phone">
                <a-input v-model="formParams.phone" placeholder="请输入维修电话" :disabled="disableSubmit" />
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="退货地址" prop="returnsAddress">
                <a-input v-model="formParams.returnsAddress" placeholder="请输入退货地址" :disabled="disableSubmit" />
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="运维周期" prop="operationalCycle">
                <a-input
                  v-model="formParams.operationalCycle"
                  placeholder="请输入运维周期,如：1年"
                  :disabled="disableSubmit"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="质保时间" prop="warrantyPeriod">
                <a-input
                  v-model="formParams.warrantyPeriod"
                  placeholder="请输入质保时间,如：1年"
                  :disabled="disableSubmit"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="含序列号" prop="hasSerialNumber">
                <a-switch v-model="formParams.hasSerialNumber" @change="handleChange" :disabled="disableSubmit" />
              </a-form-model-item>
            </a-col>
          </a-row>
        </template>
        <template v-if="this.type == 3">
          <a-steps direction="vertical">
            <a-step
              :title="'第' + (i + 1) + '次变更'"
              v-for="(item, i) in priceList"
              :key="item.id"
              status="finish"
              :description="item.time + ': ' + item.productUnivalence + '元'"
            />
          </a-steps>
          <div v-if="this.priceList.length == 0">无变更记录</div>
        </template>
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
import {
  addProduct,
  editProdect,
  getPriceList,
  getDetail,
  getSupplierList,
  getDetailInfo
} from '@/api/supplier-management/productManagement'
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
      formParams: {
        payTimeUnit: '0',
        leadTimeUnit: '0',
        paymentDaysUnit: '0',
        univalenceIndataUnit: '0'
      },
      // 表单验证规则
      rules: {
        supplierName: [{ required: true, message: '请输入供应商名称', trigger: 'change' }],
        productName: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        univalence: [{ required: true, message: '请输入单价', trigger: 'blur' }],
        type: [{ required: true, message: '请选择产品分类', trigger: 'blur' }],
        specificationParameter: [{ required: true, message: '请输入规格参数', trigger: 'blur' }],
        leadTime: [{ required: true, message: '请输入货期', trigger: 'blur' }],
        warrantyPeriod: [{ required: true, message: '请输入质保时间', trigger: 'blur' }]
      },
      // 加载动画开关
      loading: false,
      priceList: [], //价格变更列表
      basicNameList: [], //供应商列表
      disabled: true,
      id: ''
    }
  },

  methods: {
    // 打开弹窗
    open(row) {
      this.visible = true
      this.getbasicNameList()
    },

    // 关闭弹窗，点击遮罩层或右上角叉或取消按钮时触发
    close() {
      this.visible = false
      // 重置表单
      this.$refs.ruleForm.resetFields()
      this.formParams = {
        payTimeUnit: '0',
        leadTimeUnit: '0',
        paymentDaysUnit: '0',
        univalenceIndataUnit: '0'
      }
      this.imagesUrl = []
      this.priceList = []
      this.basicNameList = []
      this.disabled = false
    },

    // 供应商名称列表
    getbasicNameList() {
      getSupplierList().then(res => {
        this.basicNameList = res.result.records
        console.log(this.basicNameList)
      })
    },
    //供应商列表改变事件
    handleChangeSupplier(value) {
      // console.log(value)
      let data = this.basicNameList.filter(item => item.basicInfoId === value)
      // console.log(data);
      this.formParams.supplierName = data[0].basicName
      this.formParams.supplierId = data[0].basicInfoId

      this.getInfo(value)
    },

    // 获取维修联系人和电话
    getInfo(id) {
      getDetailInfo(id).then(({ result }) => {
        this.$set(this.formParams, 'maintainPerson', result.supplierName)
        this.$set(this.formParams, 'phone', result.phone)
      })
    },

    // 添加
    add(name, id) {
      // console.log(name, id)
      // 这是路由跳转过来的supplierIds
      this.id = id
      // 当前为添加模式
      this.type = 0
      this.open(name)
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

    // 获取单价变更记录
    price(row) {
      this.type = 3
      this.title = '变更记录'
      getPriceList({ productId: row.id }).then(res => {
        if (res.result.records) {
          this.priceList = res.result.records
        }
      })
      this.open()
    },

    //序列事件 0-不含，1-含
    handleChange(checked, row) {
      console.log(checked)
      if (checked) {
        this.formParams.hasSerialNumber = 1
      } else {
        this.formParams.hasSerialNumber = 0
      }
    },

    // 处理添加
    handleAdd() {
      addProduct(this.formParams).then(res => {
        if (res.success) {
          this.$message.success(res.message)
          this.$emit('refresh')
          this.close()
        } else {
          this.$message.warning(res.message)
        }
        return res
      })
    },

    // 处理编辑
    handleEdit() {
      editProdect(this.formParams).then(res => {
        if (res.success) {
          this.$message.success(res.message)
          this.$emit('refresh')
          this.close()
        } else {
          this.$message.warning(res.message)
        }
      })
    },

    //提交
    handleOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          // 判断当前模式
          if (this.type === 0) {
            // 添加
            this.handleAdd()
          } else {
            // 编辑
            this.handleEdit()
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
