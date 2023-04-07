<template>
  <j-modal
    :title="title"
    width="92%"
    :visible="visible"
    switchFullscreen
    :fullscreen="true"
    @ok="handleOk"
    :okButtonProps="{ class: { 'jee-hidden': disableSubmit } }"
    @cancel="close"
    cancelText="关闭"
  >
    <a-spin tip="加载中..." :spinning="loading">
      <a-form-model ref="ruleForm" :model="formParams" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row>
          <a-col :span="24" class="title">选型信息</a-col>
          <a-col :span="12">
            <a-form-model-item label="选型人" prop="selectPeopleName">
              <a-input v-model="formParams.selectPeopleName" placeholder="请输入选型人" disabled />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="选型部门" prop="selectDepartment">
              <a-tree-select
                v-model="formParams.selectDepartment"
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
            <a-form-model-item label="选型日期" prop="selectTime">
              <j-date
                v-model="formParams.selectTime"
                :showTime="true"
                dateFormat="YYYY-MM-DD"
                :style="{ width: '100%' }"
                placeholder="请选择选型日期"
                disabled
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="联系电话" prop="selectPeoplePhone">
              <a-input v-model="formParams.selectPeoplePhone" placeholder="请输入联系电话" disabled />
            </a-form-model-item>
          </a-col>

          <a-col :span="24" class="title">产品信息</a-col>
          <template>
            <a-col :span="24">
              <!-- 表格区域 -->
              <ProductList
                ref="productForm"
                :procuremmentId="this.id"
                @select="selectProduct"
                :columns="columns"
                :columnsSelect="columnsSelect"
                :is_footer="false"
                :slotParams="slotParams"
                :listUrl="`/prodSchemeSupplierInquiry/inquiry/info/${quotationId}`"
              >
                <template #default>
                  <a-form-model-item label="供应商名称" prop="supplierName">
                    <a-input v-model="slotParams.supplierName" placeholder="请输入供应商名称"></a-input>
                  </a-form-model-item>
                  <a-form-model-item label="产品名称" prop="prodName">
                    <a-input v-model="slotParams.prodName" placeholder="请输入产品名称"></a-input>
                  </a-form-model-item>
                </template>
              </ProductList>
            </a-col>
          </template>
        </a-row>
      </a-form-model>
    </a-spin>

    <div class="drawer-bootom-button">
      <a-button @click="close" style="margin-right: 0.8rem">取消</a-button>
      <a-button @click="handleOk" type="primary" :loading="loading">保存</a-button>
    </div>
  </j-modal>
</template>

<script>
import { getDepartmentList, selectionType } from '@/api/project-management/plan-management/PlanManagement.js'
// 组件
import ProductList from '@/views/project-management/procurement/procurement-list/components/productList.vue'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin'
import moment from 'dayjs'

export default {
  mixins: [TableListMixin],
  components: { ProductList },
  props: {
    // 列表id
    quotationId: {
      type: String,
      default: '',
    },
  },
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
      title: '方案选型',
      // 表单配置
      labelCol: { span: 6 },
      wrapperCol: { span: 17 },
      param: {},
      // 产品表格配置
      columns: [
        {
          title: '编号',
          dataIndex: 'codeNum',
          width: '6%',
          ellipsis: true,
          align: 'center',
        },
        {
          title: '细目名称',
          dataIndex: 'detailName',
          width: '8%',
          ellipsis: true,
          align: 'center',
          sorter: (a, b) => a.detailName.localeCompare(b.detailName),
        },
        {
          title: '安装位置',
          dataIndex: 'position',
          width: '6%',
          align: 'center',
          ellipsis: true,
        },
        {
          title: '技术规格 资质证书',
          dataIndex: 'technicalSpecifications',
          width: '8%',
          align: 'center',
          ellipsis: true,
        },
        {
          title: '产品名称',
          dataIndex: 'prodName',
          width: '6%',
          align: 'center',
          ellipsis: true,
        },
        {
          title: '规格参数',
          dataIndex: 'modelParameter',
          width: '8%',
          align: 'center',
          ellipsis: true,
        },
        {
          title: '型号',
          dataIndex: 'model',
          width: '8%',
          align: 'center',
          ellipsis: true,
        },
        {
          title: '供应商',
          dataIndex: 'supplierName',
          width: '6%',
          align: 'center',
          ellipsis: true,
          sorter: (a, b) => a.supplierName.localeCompare(b.supplierName),
        },
        {
          title: '单位',
          dataIndex: 'unit',
          width: '6%',
          align: 'center',
          ellipsis: true,
        },
        {
          title: '数量',
          dataIndex: 'num',
          width: '6%',
          align: 'center',
          ellipsis: true,
        },
        {
          title: '单价(元)',
          dataIndex: 'price',
          width: '6%',
          align: 'center',
          ellipsis: true,
          sorter: (a, b) => a.price - b.price,
        },
        {
          title: '合价(元)',
          dataIndex: 'allPrice',
          width: '6%',
          align: 'center',
          ellipsis: true,
          sorter: (a, b) => a.allPrice - b.allPrice,
        },
        {
          title: '是否偏离',
          dataIndex: 'isDeviateFrom',
          width: '6%',
          align: 'center',
          ellipsis: true,
          sorter: (a, b) => a.isDeviateFrom.localeCompare(b.isDeviateFrom),
        },
        {
          title: '供应商备注',
          dataIndex: 'supplierRemark',
          width: '6%',
          align: 'center',
          ellipsis: true,
        },
        {
          title: '备注',
          dataIndex: 'remark',
          width: '6%',
          align: 'center',
          ellipsis: true,
        },
      ],
      // 已选表格配置
      columnsSelect: [
        {
          title: '编号',
          dataIndex: 'codeNum',
          width: '6%',
          ellipsis: true,
          align: 'center',
        },
        {
          title: '细目名称',
          dataIndex: 'detailName',
          width: '8%',
          ellipsis: true,
          align: 'center',
          sorter: (a, b) => a.detailName.localeCompare(b.detailName),
        },
        {
          title: '安装位置',
          dataIndex: 'position',
          width: '6%',
          align: 'center',
          ellipsis: true,
        },
        {
          title: '技术规格 资质证书',
          dataIndex: 'technicalSpecifications',
          width: '8%',
          align: 'center',
          ellipsis: true,
        },
        {
          title: '产品名称',
          dataIndex: 'prodName',
          width: '6%',
          align: 'center',
          ellipsis: true,
        },
        {
          title: '规格参数',
          dataIndex: 'modelParameter',
          width: '8%',
          align: 'center',
          ellipsis: true,
        },
        {
          title: '型号',
          dataIndex: 'model',
          width: '8%',
          align: 'center',
          ellipsis: true,
        },
        {
          title: '供应商',
          dataIndex: 'supplierName',
          width: '6%',
          align: 'center',
          ellipsis: true,
          sorter: (a, b) => a.supplierName.localeCompare(b.supplierName),
        },
        {
          title: '单位',
          dataIndex: 'unit',
          width: '6%',
          align: 'center',
          ellipsis: true,
        },
        {
          title: '数量',
          dataIndex: 'num',
          width: '6%',
          align: 'center',
          ellipsis: true,
          scopedSlots: { customRender: 'num' },
        },
        {
          title: '单价(元)',
          dataIndex: 'price',
          width: '6%',
          align: 'center',
          ellipsis: true,
          sorter: (a, b) => a.price - b.price,
        },
        {
          title: '合价(元)',
          dataIndex: 'allPrice',
          width: '6%',
          align: 'center',
          ellipsis: true,
          sorter: (a, b) => a.allPrice - b.allPrice,
        },
        {
          title: '是否偏离',
          dataIndex: 'isDeviateFrom',
          width: '6%',
          align: 'center',
          ellipsis: true,
          sorter: (a, b) => a.isDeviateFrom.localeCompare(b.isDeviateFrom),
        },
        {
          title: '供应商备注',
          dataIndex: 'supplierRemark',
          width: '6%',
          align: 'center',
          ellipsis: true,
        },
        {
          title: '备注',
          dataIndex: 'remark',
          width: '6%',
          align: 'center',
          ellipsis: true,
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          width: 50,
          // fixed: 'left',
          scopedSlots: { customRender: 'action' },
        },
      ],
      // 表单参数
      formParams: {
        selectDepartment: this.$store.getters.userInfo.departIds, //当前选型部门id
        peopleId: this.$store.getters.userInfo.id, //当前名字id
        selectTime: moment().format('YYYY-MM-DD HH:mm:ss'), //选型时间
        selectPeoplePhone: this.$store.getters.userInfo.phone, // 选型人电话
        selectPeopleId: this.$store.getters.userInfo.id, //当前选型人id
        selectPeopleName: this.$store.getters.userInfo.realname, //当前选型人
        profitsPeopleId: this.$store.getters.userInfo.id, //当前报价人id
        profitsTime: moment().format('YYYY-MM-DD HH:mm:ss'), //报价日期
      },

      disableMixinCreated: true, //不执行混入
      // 表单验证规则
      rules: {
        // projectName: [{ required: true, message: '请选择项目名称', trigger: 'blur' }]
      },
      principalPersonList: [], // 部门列表
      id: '', //当前id
      // 插槽数据
      slotParams: {
        supplierName: '',
        prodName: '',
      },
    }
  },

  methods: {
    moment,

    // 获取部门树形
    getDepartmentList() {
      getDepartmentList().then((res) => {
        if (res.success) {
          this.principalPersonList = res.result
        }
      })
    },

    // 打开弹窗
    open(record) {
      console.log('----------', record)
      this.formParams.peopleName = record.peopleName //设计人
      this.formParams.projectId = record.projectId //项目id
      this.formParams.purchaseContext = record.purchaseContext //采购内容
      this.formParams.priceControl = record.priceControl //上控价
      this.formParams.schemeCode = record.schemeCode //方案编号
      this.visible = true
      this.getDepartmentList()
      setTimeout(() => {
        // 加载可选/已选产品信息列表
        this.$refs.productForm.loadData()
      }, 100)
    },

    // 关闭弹窗，点击遮罩层或右上角叉或取消按钮时触发
    close() {
      this.visible = false
      // 重置表单
      this.$refs.ruleForm.resetFields()
      this.selectedRowKeys = []
      this.selectionRows = []
      this.formParams = {
        selectDepartment: this.$store.getters.userInfo.departIds, //当前选型部门id
        peopleId: this.$store.getters.userInfo.id, //当前名字id
        selectTime: moment().format('YYYY-MM-DD HH:mm:ss'), //选型时间
        selectPeoplePhone: this.$store.getters.userInfo.phone, // 选型人电话
        selectPeopleName: this.$store.getters.userInfo.realname, //当前选型人
        selectPeopleId: this.$store.getters.userInfo.id, //当前选型人id
        profitsPeopleId: this.$store.getters.userInfo.id, //当前报价人id
        profitsTime: moment().format('YYYY-MM-DD HH:mm:ss'), //报价日期
      }
      // 清空选择
      // this.$refs.productForm.handleCancel()
    },

    // 获取详情
    getDetail(id) {
      getDetail(id).then((res) => {
        // console.log(res)
        if (res.success) {
          this.formParams = res.result
        }
      })
    },

    // 选中的产品
    selectProduct(data) {
      // console.log(data)
      let selectData = data.selectionRows.map((item) => item.id)
      let schemeId = data.selectionRows.map((item) => item.schemeId)

      console.log('选中的报价产品--', selectData)
      // 已选产品
      this.formParams.purchaseContextIds = selectData
      this.formParams.schemeId = schemeId.toString()
    },

    //提交
    handleOk() {
      console.log(this.formParams)
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // 方案选型
          selectionType(this.formParams).then((res) => {
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
    },
  },
}
</script>

<style lang="less" scoped>
.title {
  background-color: #f8faff;
  padding: 6px;
  margin-bottom: 10px;
  font-weight: 600;
}
</style>
