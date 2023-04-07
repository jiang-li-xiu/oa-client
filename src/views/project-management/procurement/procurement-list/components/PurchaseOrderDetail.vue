<template>
  <a-drawer
    :title="title"
    :maskClosable="true"
    width="85%"
    placement="right"
    :closable="true"
    @close="close"
    :visible="visible"
    style="overflow: auto; padding-bottom: 53px"
  >
    <a-spin tip="加载中..." :spinning="loading">
      <a-form-model ref="ruleForm" :model="formParams" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-tabs default-active-key="1" @change="handleChangeTab">
          <!-- 采购信息信息  -->
          <a-tab-pane key="1" tab="采购详情">
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
                  <a-input v-model="formParams.consignee" placeholder="请输入收货人" :read-only="readOnly" />
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="收货地址" prop="harvestAddress">
                  <a-input v-model="formParams.harvestAddress" placeholder="请输入收货地址" :read-only="readOnly" />
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="紧急程度" prop="degree">
                  <a-radio-group :default-value="1" disabled>
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
                    placeholder="请选择采购类别"
                    :disabled="disableSubmit"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="项目情况" prop="projectSituation">
                  <j-dict-select-tag
                    v-model="formParams.projectSituation"
                    dictCode="project_situation"
                    placeholder="请选择产品类型"
                    :disabled="disableSubmit"
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
                    <a-select-option :value="0">已有项目采购 </a-select-option>
                    <a-select-option :value="1">销售 </a-select-option>
                    <a-select-option :value="2">公司自用 </a-select-option>
                    <a-select-option :value="3">其他 </a-select-option>
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
                  <a-table
                    :columns="columnsDetail"
                    :data-source="dataSource"
                    bordered
                    rowKey="key"
                    :scroll="{ x: true }"
                    :indentSize="10"
                    :pagination="false"
                    :disabled="disableSubmit"
                  >
                    <div class="overflowStyle" slot="technicalSpecifications" slot-scope="text, record">
                      <a-popover placement="top">
                        <template slot="content">
                          <span>{{ record.technicalSpecifications }}</span>
                        </template>
                        <span>{{ record.technicalSpecifications }}</span>
                      </a-popover>
                    </div>
                    <div class="overflowStyle" slot="specification" slot-scope="text, record">
                      <a-popover placement="top">
                        <template slot="content">
                          <span>{{ record.specification }}</span>
                        </template>
                        <span>{{ record.specification }}</span>
                      </a-popover>
                    </div>
                    <!-- 产品名称 -->
                    <template #productId="record, row">
                      {{ row.productName }}
                    </template>
                  </a-table>
                </a-col>
              </template>
            </a-row>
          </a-tab-pane>

          <!-- 审批信息  -->
          <a-tab-pane key="2" tab="审批信息">
            <a-row>
              <a-col :span="24" class="title">审批信息</a-col>
              <a-col :span="24">
                <a-table
                  :columns="Approvalcolumns"
                  :data-source="ApprovalData"
                  bordered
                  rowKey="id"
                  :scroll="{ x: true }"
                  :indentSize="10"
                  :pagination="false"
                  :disabled="disableSubmit"
                >
                  <!-- 产品名称 -->
                  <template #productId="record, row">
                    {{ row.productName }}
                  </template>
                </a-table>
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </a-form-model>
    </a-spin>
  </a-drawer>
</template>

<script>
// API
import { getProcurementDetail, getDepartmentList, getApprovalHistory } from '@/api/procurement/ProcurementList.js'

// 混入
import { TableListMixin } from '@/mixins/TableListMixin'
import moment from 'dayjs'

export default {
  mixins: [TableListMixin],
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
        purchaseDepartment: this.$store.getters.userInfo.departIds, //当前采购部门id
        createTime: moment().format('YYYY-MM-DD HH:mm:ss'), //填报时间
        purchaseProduct: [
          {
            id: '', //产品id
            thisPurchase: '', //本次采购数量
            actualPurchasePrice: '', //实际采购单价
          },
        ],
      },
      // 详情表格
      columnsDetail: [
        {
          title: '细目名称',
          dataIndex: 'detailName',
          width: 100,
          ellipsis: true,
          align: 'center',
        },
        {
          title: '安装位置',
          dataIndex: 'position',
          width: 100,
          ellipsis: true,
          align: 'center',
        },
        {
          title: '技术规格、资质证书',
          dataIndex: 'technicalSpecifications',
          width: 150,
          ellipsis: true,
          align: 'center',
          scopedSlots: { customRender: 'technicalSpecifications' },
        },
        {
          title: '产品名称',
          dataIndex: 'prodName',
          width: 120,
          ellipsis: true,
          align: 'center',
          // scopedSlots: { customRender: 'productId' }
        },
        {
          title: '规格参数',
          dataIndex: 'specification',
          width: 100,
          ellipsis: true,
          align: 'center',
          scopedSlots: { customRender: 'specification' },
        },
        {
          title: '型号',
          dataIndex: 'model',
          width: 100,
          ellipsis: true,
          align: 'center',
        },
        {
          title: '供应商',
          dataIndex: 'supplier',
          width: 120,
          ellipsis: true,
          align: 'center',
        },
        {
          title: '单位',
          dataIndex: 'unit',
          width: 100,
          ellipsis: true,
          align: 'center',
        },
        {
          title: '总数',
          dataIndex: 'num',
          width: 100,
          ellipsis: true,
          align: 'center',
        },
        {
          title: '已采数量',
          dataIndex: 'alreadyPurchase',
          width: 100,
          ellipsis: true,
          align: 'center',
        },
        {
          title: '本次采购数量',
          dataIndex: 'thisPurchase',
          width: 100,
          ellipsis: true,
          align: 'center',
        },
        {
          title: '采购单价（元）',
          dataIndex: 'actualPurchasePrice',
          width: 100,
          ellipsis: true,
          align: 'center',
        },
        {
          title: '采购合价（元）',
          dataIndex: 'purchaseTotlePrice',
          width: 100,
          ellipsis: true,
          align: 'center',
        },
        // {
        //   title: '产品单价(元)',
        //   dataIndex: 'price',
        //   width: 100,
        //   ellipsis: true,
        //   align: 'center'
        // },
        {
          title: '毛利率',
          dataIndex: 'grossProfitRate',
          width: 80,
          ellipsis: true,
          align: 'center',
        },
        {
          title: '备注',
          dataIndex: 'remark',
          width: 100,
          ellipsis: true,
          align: 'center',
        },
      ],
      // 审批信息
      Approvalcolumns: [
        {
          title: '序号',
          dataIndex: 'name',
          align: 'center',
          customRender: function (t, r, index) {
            return parseInt(index) + 1
          },
        },
        {
          title: '开始时间',
          dataIndex: 'time',
          ellipsis: true,
          align: 'center',
        },
        {
          title: '处理时间',
          dataIndex: 'dealWithTime',
          ellipsis: true,
          align: 'center',
        },
        {
          title: '审批人',
          dataIndex: 'approveName',
          ellipsis: true,
          align: 'center',
        },
        {
          title: '审批操作',
          dataIndex: 'status',
          ellipsis: true,
          align: 'center',
          // 1-审批中，2-已撤销，3-已通过，4-不通过
          customRender(value) {
            return value == 1 ? '审批中' : value == 2 ? '已撤销' : value == 3 ? '已通过' : '不通过'
          },
        },
        {
          title: '操作说明',
          dataIndex: 'remark',
          ellipsis: true,
          align: 'center',
        },
      ],
      ApprovalData: [],

      disableMixinCreated: true, //不执行混入
      // 表单验证规则
      rules: {
        projectName: [{ required: true, message: '请选择项目名称', trigger: 'blur' }],
      },
      principalPersonList: [], // 设计部门列表
      prodPurchaseOrder: '', //当前id 采购单-审批信息列表要用
    }
  },

  methods: {
    moment,

    // 切换标签页
    handleChangeTab(value) {
      if (value == 2) {
        this.geApprovalHistory(this.prodPurchaseOrder)
      }
    },

    // 获取部门树形
    getDepartmentList() {
      getDepartmentList().then((res) => {
        if (res.success) {
          this.principalPersonList = res.result
        }
      })
    },

    // 打开弹窗
    open() {
      this.visible = true
      this.getDepartmentList()
    },

    // 关闭弹窗，点击遮罩层或右上角叉或取消按钮时触发
    close() {
      this.visible = false
      // 重置表单
      this.$refs.ruleForm.resetFields()
      this.selectedRowKeys = []
      this.selectionRows = []
      this.formParams = {}
      this.dataSource = []
    },

    // 详情
    detail(record) {
      this.prodPurchaseOrder = record.id || record
      this.type = 2
      this.getDetail(record.id || record)
      this.geApprovalHistory(this.prodPurchaseOrder)
      this.readOnly = true
      this.open()
    },

    // 获取采购单详情
    getDetail(id) {
      getProcurementDetail(id).then((res) => {
        // console.log(res)
        if (res.success) {
          this.formParams = res.result
          this.dataSource = res.result.purchaseProduct ? res.result.purchaseProduct : ''
          console.log(this.formParams)
        }
      })
    },

    // 获取审批历史
    geApprovalHistory(id) {
      getApprovalHistory(id).then((res) => {
        if (res.success) {
          this.ApprovalData = res.result
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
// 隐藏上传的文件名称图标
::v-deep .ant-upload-list {
  display: none;
}
::v-deep.ant-upload-list-text {
  display: none;
}

/*统一table表格的尺寸*/
.ant-table {
  table-layout: fixed;
}
.ant-table-tbody > tr > td {
  max-width: 200px;
  min-width: 70px;
  height: 70px;
  border-bottom: 0;
  /*text-align: center !important;*/
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
  word-break: break-all;
}
.overflowStyle {
  max-width: 150px !important;
  max-height: 70px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-wrap: break-word;
  word-break: break-all;
}
</style>
