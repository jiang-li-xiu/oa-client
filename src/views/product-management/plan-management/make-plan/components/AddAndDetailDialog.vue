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
            <a-form-model-item label="方案名称" prop="name">
              <a-input v-model="formParams.name" placeholder="请输入方案名称" :disabled="disableSubmit" />
            </a-form-model-item>
          </a-col>
          <a-divider type="horizontal" />
          <a-button @click="addProduct()">新增产品</a-button>

          <div v-for="(item, index) in formParams.content" :key="index">
            <a-col :span="24">
              <a-form-model-item label="产品名称" prop="productName">
                <a-select v-model="item.productName" placeholder="请选择类型">
                  <a-select-option v-for="item in productList" :key="item.id" :value="item.id">
                    {{ item.productName }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="单价" prop="univalence">
                <a-input v-model="item.univalence" placeholder="请输入单价" :disabled="disableSubmit" />
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="数量" prop="num">
                <a-input v-model="item.num" placeholder="请输入数量" :disabled="disableSubmit" />
              </a-form-model-item>
            </a-col>
          </div>

          <a-col :span="24">
            <a-form-model-item label="备注" prop="remark">
              <a-input v-model="formParams.remark" placeholder="请输入备注" :disabled="disableSubmit" />
            </a-form-model-item>
          </a-col>

          <!-- <a-col :span="24">
            <a-form-model-item label="单价(元)" prop="univalence">
              <a-input-number
                style="width:400px"
                v-model="formParams.univalence"
                placeholder="请输入单价"
                :precision="2"
                :disabled="disableSubmit"
              />
            </a-form-model-item>
          </a-col> -->
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
import { addPlan, getDetail, getProductList } from '@/api/product-management/plan-management/makePlan'
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
        name: '', //方案名称
        content: [
          {
            productId: '', //产品id
            productName: '', //产品名称
            supplierName: '', //供应商名字
            univalence: '', //单价
            num: '' //数量
          }
        ],
        remark: '' //备注
      },
      // 表单验证规则
      rules: {
        name: [{ required: true, message: '请输入', trigger: 'change' }]
      },
      // 加载动画开关
      loading: false,
      productList: [] //产品列表
    }
  },

  methods: {
    // 打开弹窗
    open(row) {
      this.visible = true
      this.getProductLists()
    },

    // 关闭弹窗，点击遮罩层或右上角叉或取消按钮时触发
    close() {
      this.visible = false
      // 重置表单
      this.$refs.ruleForm.resetFields()
      this.formParams = {
        name: '', //方案名称
        content: [
          {
            productId: '', //产品id
            productName: '', //产品名称
            supplierName: '', //供应商名字
            univalence: '', //单价
            num: '' //数量
          }
        ],
        remark: '' //备注
      }
    },

    // 新增产品
    addProduct() {
      this.formParams.content.push({
        productId: '', //产品id
        productName: '', //产品名称
        supplierName: '', //供应商名字
        univalence: '', //单价
        num: '' //数量
      })
    },

    // 获取产品列表
    getProductLists() {
      getProductList().then(res => {
        this.productList = res.result.records
        console.log(res)
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
          // 判断当前模式
          if (this.type === 0) {
            // addPlan(this.formParams).then(res => {
            //   if (res.success) {
            //     this.$message.success(res.message)
            //     this.$emit('refresh')
            //     this.close()
            //   } else {
            //     this.$message.warning(res.message)
            //   }
            //   return res
            // })
          } else {
            // editProdect(this.formParams).then(res => {
            //   if (res.success) {
            //     this.$message.success(res.message)
            //     this.$emit('refresh')
            //     this.close()
            //   } else {
            //     this.$message.warning(res.message)
            //   }
            // })
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
