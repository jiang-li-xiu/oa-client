<template>
  <a-drawer
    :title="title"
    :maskClosable="true"
    width="1600"
    placement="right"
    :closable="true"
    @close="close"
    :visible="visible"
    style="overflow: auto; padding-bottom: 53px"
  >
    <a-spin tip="加载中..." :spinning="loading">
      <a-form-model ref="ruleForm" :model="formParams" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row>
          <a-col :span="24" class="title">采购信息</a-col>
          <a-col :span="12">
            <a-form-model-item label="采购人" prop="purchasePeople">
              <a-input v-model="formParams.purchasePeople" placeholder="请输入采购人" :read-only="readOnly" />
            </a-form-model-item>
          </a-col>

          <a-col :span="12">
            <a-form-model-item label="采购部门" prop="purchaseDepartment">
              <a-tree-select
                v-model="formParams.purchaseDepartment"
                show-search
                style="width: 100%"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                placeholder="请选择"
                allow-clear
                tree-default-expand-all
                disabled
              >
                <a-tree-select-node
                  v-for="item in principalPersonList"
                  :key="item.id"
                  :value="item.id"
                  :title="item.title"
                >
                  <a-tree-select-node
                    v-for="child in item.children"
                    :key="child.id"
                    :value="child.id"
                    :title="child.title"
                  >
                    <a-tree-select-node
                      v-for="userList in child.userList"
                      :key="userList.id"
                      :value="userList.id"
                      :title="userList.realname"
                    >
                    </a-tree-select-node>
                  </a-tree-select-node>
                </a-tree-select-node>
              </a-tree-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="填报日期" prop="createTime">
              <j-date
                v-model="formParams.createTime"
                :showTime="true"
                dateFormat="YYYY-MM-DD"
                :style="{ width: '100%' }"
                placeholder="请选择填报日期"
                :read-only="readOnly"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="到位时间" prop="inPlaceTime">
              <j-date
                v-model="formParams.inPlaceTime"
                :showTime="true"
                dateFormat="YYYY-MM-DD HH:mm:ss"
                :style="{ width: '100%' }"
                placeholder="请选择到位时间"
                :read-only="readOnly"
              />
            </a-form-model-item>
          </a-col>

          <a-col :span="12">
            <a-form-model-item label="项目信息" prop="projectName">
              <a-input v-model="formParams.projectName" placeholder="请输入收货地址" :read-only="readOnly" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="收货人" prop="consignee">
              <a-input v-model="formParams.consignee" placeholder="请输入收货人" :disabled="disableSubmit" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="收货地址" prop="harvestAddress">
              <a-input v-model="formParams.harvestAddress" placeholder="请输入收货地址" :read-only="readOnly" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="紧急程度" prop="degree">
              <a-radio-group :default-value="1" v-model="formParams.degree">
                <a-radio :value="1">紧急</a-radio>
                <a-radio :value="2"> 一般</a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="采购类别" prop="type">
              <!-- 1-设备，2-材料，3-工程，4-软件，5-服务，6低值易耗 -->
              <j-dict-select-tag
                v-model="formParams.type"
                dictCode="procurement_categories"
                placeholder="请选择产品类型"
                :read-only="readOnly"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="项目情况" prop="projectSituation">
              <j-dict-select-tag
                v-model="formParams.projectSituation"
                dictCode="project_situation"
                placeholder="请选择产品类型"
                :read-only="readOnly"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="用途" prop="useWay">
              <a-select
                v-model="formParams.useWay"
                :disabled="disableSubmit"
                placeholder="请选择用途"
                :style="{ width: '40%' }"
              >
                <a-select-option value="0">已有项目采购 </a-select-option>
                <a-select-option value="1">销售 </a-select-option>
                <a-select-option value="2">公司自用 </a-select-option>
                <a-select-option value="3">其他 </a-select-option>
              </a-select>
              <a-input
                v-if="formParams.useWay == 3"
                v-model="formParams.useWayOther"
                placeholder="请输入其他"
                :style="{ width: '60%' }"
                :read-only="readOnly"
              />
            </a-form-model-item>
          </a-col>

          <a-col :span="24" class="title">产品信息</a-col>
          <template>
            <a-col :span="24">
              <!-- 表格区域 -->
              <ProductList ref="productForm" :procuremmentId="this.id" @select="selectProduct"></ProductList>
            </a-col>
          </template>
        </a-row>
      </a-form-model>
    </a-spin>

    <div class="drawer-bootom-button" v-if="![2, 3].includes(this.type)">
      <a-button @click="close" style="margin-right: 0.8rem">取消</a-button>
      <a-button @click="handleOk" type="primary" :loading="loading">保存</a-button>
    </div>
  </a-drawer>
</template>

<script>
// API
import { getDetail, getDepartmentList, postGenerateOrder } from '@/api/procurement/ProcurementList.js'
// 组件
import ProductList from './productList.vue'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin'
import moment from 'dayjs'

export default {
  mixins: [TableListMixin],
  components: { ProductList },
  data() {
    return {
      // 开关
      visible: false,
      // 加载动画开关
      loading: false,
      // 是否禁用
      disableSubmit: false,
      readOnly: false,
      // 标题
      title: '新增',
      // 当前模式 0-添加 1-编辑 2-详情
      type: 0,
      // 表单配置
      labelCol: { span: 6 },
      wrapperCol: { span: 17 },
      // 表单参数
      formParams: {
        purchasePeople: this.$store.getters.userInfo.realname, //当前采购人
        // purchaseDepartment: this.$store.getters.userInfo.departIds, //当前采购部门id
        purchaseDepartment: this.$store.getters.userInfo.orgCodeTxt, //当前采购部门名称
        createTime: moment().format('YYYY-MM-DD HH:mm:ss'), //填报时间
        degree: 1,
        purchaseProduct: [
          {
            id: '', //产品id
            thisPurchase: '', //本次采购数量
            actualPurchasePrice: '' //实际采购单价
          }
        ]
      },

      disableMixinCreated: true, //不执行混入
      // 表单验证规则
      rules: {
        projectName: [{ required: true, message: '请选择项目名称', trigger: 'blur' }],
        inPlaceTime: [{ required: true, message: '请选择到位时间', trigger: 'change' }],
        consignee: [{ required: true, message: '请输入收货人', trigger: 'blur' }],
        harvestAddress: [{ required: true, message: '请输入收货地址', trigger: 'blur' }]
        // phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }, { validator: this.validateMobile }],
      },
      principalPersonList: [], // 设计部门列表
      id: '' //当前id
    }
  },

  methods: {
    moment,
    validateMobile(rule, value, callback) {
      if (!value || new RegExp(/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/).test(value)) {
        callback()
      } else {
        callback('您的手机号码格式不正确!')
      }
    },

    // 获取部门树形
    getDepartmentList() {
      getDepartmentList().then(res => {
        if (res.success) {
          this.principalPersonList = res.result
        }
      })
    },

    // 打开弹窗
    open() {
      this.visible = true
      this.getDepartmentList()
      console.log(this.$store.getters.userInfo)
    },

    // 关闭弹窗，点击遮罩层或右上角叉或取消按钮时触发
    close() {
      this.visible = false
      // 重置表单
      this.$refs.ruleForm.resetFields()
      this.selectedRowKeys = []
      this.selectionRows = []
      this.formParams = {
        purchasePeople: this.$store.getters.userInfo.realname, //当前采购人
        // selectPeopleId: this.$store.getters.userInfo.id, //当前选型人id
        purchaseDepartment: this.$store.getters.userInfo.departIds, //当前采购部门id
        createTime: moment().format('YYYY-MM-DD HH:mm:ss'), //填报时间
        degree: 1
      }
      this.dataSource = []
      this.fileList = []
      // 清空选择
      this.$refs.productForm.handleCancel()
    },

    // 编辑
    edit(record) {
      this.type = 1
      // 当前id
      this.id = record.id
      this.formParams.projectName = record.projectName
      this.open()
      this.readOnly = false
      setTimeout(() => {
        // 加载可选/已选产品信息列表
        this.$refs.productForm.loadData()
      }, 100)
    },

    // 详情
    detail(record) {
      this.type = 2
      // this.getDetail(record.id)
      this.readOnly = true
      this.open()
    },

    // 获取详情
    getDetail(id) {
      getDetail(id).then(res => {
        // console.log(res)
        if (res.success) {
          this.formParams = res.result
        }
      })
    },

    // 选中的产品
    selectProduct(data) {
      // console.log(data)
      let selectData = data.selectionRows.map(item => {
        return {
          actualPurchasePrice: item.actualPurchasePrice,
          id: item.id,
          thePurchase: item.thisPurchase //本次采购数量
        }
      })
      // console.log('选中的采购产品--',selectData)
      // 已选产品
      this.formParams.purchaseProduct = selectData
    },

    //提交
    handleOk() {
      console.log(this.formParams)
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          // 传给后端的数据
          let data = {
            ...this.formParams,
            id: this.id
          }
          console.log(data)
          // 生成采购单
          postGenerateOrder(data).then(res => {
            if (res.success) {
              this.$message.success(res.message)
              this.$emit('refresh')
            } else {
              this.$message.error(res.message)
            }
            this.close()
          })
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
  padding: 6px;
  margin-bottom: 10px;
  font-weight: 600;
}
// 隐藏上传的文件名称图标
::v-deep .ant-upload-list {
  display: none;
}
::v-deep.ant-upload-list-text {
  display: none;
}
</style>
