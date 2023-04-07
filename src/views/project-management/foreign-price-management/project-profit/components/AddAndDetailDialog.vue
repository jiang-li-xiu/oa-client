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
        <a-tabs default-active-key="1" @change="handleChangeTab">
          <!-- 报价单信息  -->
          <a-tab-pane key="1" :tab="this.type == 4 ? '采购详情' : this.type == 5 ? '报价单' : '利润表'">
            <!-- <div id="print"> -->
            <div>
              <a-row>
                <a-col :span="24" class="title">项目信息</a-col>
                <a-col :span="12">
                  <a-form-model-item
                    label="客户名称"
                    prop="companyName"
                    :label-col="{ span: 4 }"
                    :wrapper-col="{ span: 19 }"
                  >
                    <j-select-customer
                      v-model="formParams.customId"
                      :multi="false"
                      @change="handelChangeCustomer"
                      disabled
                    >
                    </j-select-customer>
                    <!-- <a-textarea
                      v-model="formParams.companyName"
                      placeholder="请输入客户名称"
                      :rows="1"
                      :read-only="readOnly"
                    /> -->
                  </a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item
                    label="项目名称"
                    prop="projectId"
                    :label-col="{ span: 4 }"
                    :wrapper-col="{ span: 19 }"
                  >
                    <j-select-project
                      v-model="formParams.projectId"
                      :multi="false"
                      @change="handelChange"
                      disabled
                    ></j-select-project>
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item label="联系人" prop="customerName">
                    <a-input v-model="formParams.customerName" placeholder="请输入联系人" :read-only="readOnly" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item label="联系电话" prop="customerPhone">
                    <a-input v-model="formParams.customerPhone" placeholder="请输入联系电话" :read-only="readOnly" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item label="负责人" prop="inCharge">
                    <span>{{ formParams.inCharge }}</span>
                    <!-- <j-select-user-by-dep v-model="formParams.inCharge" disabled :multi="false"></j-select-user-by-dep> -->
                  </a-form-model-item>
                </a-col>

                <a-col :span="6">
                  <a-form-model-item label="立项时间" prop="buildDate">
                    <a-input v-model="formParams.buildDate" placeholder="请输入立项时间" readOnly />
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item label="项目总额" prop="amount">
                    <template v-if="[0, 1].includes(this.type)">
                      <a-input-number
                        v-model="formParams.amount"
                        placeholder="请输入项目总额"
                        :readOnly="disableSubmit"
                        :style="{ width: '100%' }"
                      />
                    </template>
                    <template v-else>
                      <span>{{ formParams.amount }}</span>
                    </template>
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item label="项目概算" prop="budget">
                    <template v-if="[0, 1].includes(this.type)">
                      <a-input-number
                        v-model="formParams.budget"
                        placeholder="请输入项目概算"
                        :readOnly="disableSubmit"
                        :style="{ width: '100%' }"
                      />
                    </template>
                    <template v-else>
                      <span>{{ formParams.budget }}</span>
                    </template>
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item label="项目类型" prop="projectType">
                    <span>{{ projectType(formParams.projectType) }}</span>
                  </a-form-model-item>
                </a-col>
                <a-col :span="24">
                  <a-form-model-item
                    label="项目地点"
                    prop="projectAddr"
                    :label-col="{ span: 2 }"
                    :wrapper-col="{ span: 21 }"
                  >
                    <a-textarea v-model="formParams.projectAddr" placeholder="请输入项目地点" readOnly />
                  </a-form-model-item>
                </a-col>
                <a-col :span="24">
                  <a-form-model-item
                    label="概要说明"
                    prop="outlines"
                    :label-col="{ span: 2 }"
                    :wrapper-col="{ span: 21 }"
                  >
                    <a-textarea v-model="formParams.outlines" placeholder="请输入概要说明" readOnly />
                  </a-form-model-item>
                </a-col>

                <a-col :span="24" class="title">产品信息</a-col>
                <a-col :span="6" v-if="[0, 1, 2].includes(this.type)">
                  <a-form-model-item label="上控价" prop="priceControl">
                    <template v-if="type != 2">
                      <a-input-number
                        v-model="formParams.priceControl"
                        placeholder="请输入上控价"
                        :style="{ width: '100%' }"
                        :disabled="disableSubmit"
                      />
                    </template>
                    <template v-else>{{ formParams.priceControl }}</template>
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item label="采购内容" prop="purchaseContext">
                    <template v-if="[0, 1].includes(this.type)">
                      <a-input
                        v-model="formParams.purchaseContext"
                        placeholder="请输入采购内容"
                        :disabled="disableSubmit"
                      />
                    </template>
                    <template v-else>{{ formParams.purchaseContext }}</template>
                  </a-form-model-item>
                </a-col>
                <!-- 报价单-->
                <template v-if="[5].includes(this.type)">
                  <a-col :span="24">
                    <QuotationInfo :type="5" :profitData="this.profitData"></QuotationInfo>
                  </a-col>
                </template>
                <!-- 利润表 -->
                <template v-else-if="[6].includes(this.type)">
                  <a-col :span="24">
                    <QuotationInfo :type="5" :profitData="this.profitData"></QuotationInfo>
                  </a-col>
                </template>

                <template v-else>
                  <a-col :span="24">
                    <!-- <a-table
                      :columns="columns"
                      ref="tableformRef"
                      :data-source="profitData"
                      bordered
                      :rowKey="(record) => record.key"
                      :scroll="{ x: true }"
                      :indentSize="10"
                      :pagination="false"
                      :row-selection="rowSelection"
                      :expanded-row-keys.sync="expandedRowKeys"
                      @expandedRowsChange="expandedRowsChange"
                      :disabled="disableSubmit"
                      class="table"
                    >
                      <template slot="action" slot-scope="record, row, index">
                        <a
                          href="javascript:;"
                          @click="editProfits(row, index, 1)"
                          :disabled="row.status == 3"
                          v-if="[0, 1].includes(type)"
                          >编辑利润表
                        </a>
                        <a href="javascript:;" @click="editProfits(row, index, 2)" v-else>详情 </a>
                      </template>
                    </a-table> -->
                    <j-vxe-table
                      ref="vTable"
                      row-number
                      keep-source
                      :dataSource="profitData"
                      :columns="columns"
                      style="margin-top: 8px"
                    >
                      <template v-slot:type="props">
                        {{ props.row.type == 1 ? "工程" : props.row.type == 2 ? "软件" : "" }}
                      </template>
                      <template v-slot:status="props">
                        {{ statusType(props.row.status) }}
                      </template>
                      <template v-slot:action="props">
                        <a
                          href="javascript:;"
                          @click="editProfits(props.row, 1)"
                          :disabled="props.row.status == 3"
                          v-if="[0, 1].includes(type)"
                          >编辑利润表
                        </a>
                        <a href="javascript:;" @click="editProfits(props.row, 2)" v-else>详情 </a>
                      </template>
                    </j-vxe-table>
                  </a-col>
                </template>
              </a-row>
            </div>
          </a-tab-pane>

          <a-tab-pane key="2" tab="审批信息" v-if="this.type == 3 || this.type == 2">
            <a-col :span="24" class="title" :style="{ marginTop: '15px' }">审批信息</a-col>
            <a-col :span="24">
              <div class="block" v-if="dataApproval && dataApproval.length > 0">
                <a-timeline>
                  <a-timeline-item
                    v-for="(item, index) in dataApproval"
                    :key="index"
                    :icon="setIcon(item.approverTime)"
                    :color="setColor(item.approverTime)"
                  >
                    <p style="font-weight: 700">{{ item.processName }}</p>
                    <a-card class="box-card" shadow="hover">
                      <a-descriptions :column="4" :labelStyle="{ 'font-weight': 'bold' }">
                        <a-descriptions-item label="操作人">{{ item.approverName || "-" }}</a-descriptions-item>
                        <a-descriptions-item label="申请时间">{{ item.applyTime || "-" }}</a-descriptions-item>
                        <a-descriptions-item label="状态">{{ commentType(item.status) || "-" }}</a-descriptions-item>
                        <a-descriptions-item label="审批时间">{{ item.approverTime || "-" }}</a-descriptions-item>
                        <a-descriptions-item label="审批备注">{{ item.remark || "-" }}</a-descriptions-item>
                      </a-descriptions>
                      <a-divider orientation="left">
                        <a-tag :color="approveTypeTag(item.status)">{{ commentType(item.status) }}</a-tag>
                        <a-tag>{{ item.approverTime || "--" }}</a-tag>
                      </a-divider>
                    </a-card>
                  </a-timeline-item>
                </a-timeline>
              </div>
              <div v-else>- 暂无记录 -</div>
            </a-col>
          </a-tab-pane>

          <!-- 采购单 -->
          <template v-if="this.type == 4">
            <a-tab-pane key="2" tab="采购单" force-render>
              <a-row>
                <a-col :span="24" class="title">采购单信息</a-col>
                <a-col :span="24">
                  <!-- 采购单组件-->
                  <procurement-detail
                    ref="procurementDetail"
                    :dataSourcePurchase="this.dataSourcePurchase"
                    @refreshClose="refreshClose"
                  >
                  </procurement-detail>
                </a-col>
              </a-row>
            </a-tab-pane>
          </template>
        </a-tabs>
      </a-form-model>
    </a-spin>

    <div class="drawer-bootom-button">
      <template v-if="![2, 3, 4, 5, 6].includes(this.type)">
        <!-- 已选型/不通过状态才能发起审批 -->
        <a-button
          @click="handleApproval"
          :loading="approvalLoading"
          type="primary"
          class="sub-button"
          :disabled="[7, 8].includes(this.currentData.flowStatus)"
        >
          提交审批
        </a-button>
        <a-button
          @click="handleOk(1)"
          :loading="okLoading"
          type="primary"
          :disabled="[7, 8].includes(this.currentData.flowStatus)"
          class="sub-button"
          >保存
        </a-button>
      </template>
      <a-button @click="close">取消</a-button>
    </div>

    <div class="drawer-bootom-button" v-if="this.type == 3">
      <a-button
        key="submit"
        type="primary"
        :loading="loading"
        @click="handleApprovalSub(2)"
        :disabled="this.currentData.status !== 1"
        style="margin-right: 0.8rem"
      >
        通过
      </a-button>
      <a-button
        key="back"
        type="danger"
        @click="handleApprovalSub(1)"
        style="margin-right: 0.8rem"
        :disabled="this.currentData.status !== 1"
        >不通过
      </a-button>
      <a-button @click="close">取消</a-button>
    </div>
    <ApprovalSubmit ref="aprovalForm" @refreshClose="refreshClose"></ApprovalSubmit>

    <!-- 选审批流程 2项目利润详情/4采购列表详情-->
    <div class="drawer-bootom-button" v-if="[2].includes(this.type)">
      <!-- <a-button @click="handleProfitPrint" type="primary" class="sub-button">导出pdf</a-button> -->
      <a-button @click="close">取消</a-button>
    </div>

    <!-- 报价单打印 -->
    <div class="drawer-bootom-button" v-if="[5].includes(this.type)">
      <a-button @click="handlePrint" type="primary" class="sub-button" icon="download">导出pdf</a-button>
      <a-button @click="handleExport('报价单')" type="primary" class="sub-button" icon="download">导出excel</a-button>
      <a-button @click="close">取消</a-button>
    </div>

    <!-- 导出报价表 -->
    <ExportDialog ref="export"></ExportDialog>

    <!-- 选择导出报价表pdf版本 -->
    <SelectPrintDialog
      ref="selectPrint"
      :data="this.formParams"
      :proInfo="this.profitData"
      :columnsDetail="columnsDetail"
    ></SelectPrintDialog>

    <ProductInfo ref="productInfo" @refresh="getLibrary(currentData.id)"></ProductInfo>
  </j-modal>
</template>

<script>
// API
import {
  getDetail,
  getQuotationDetail,
  getDepartmentList,
  getProjectList,
  getLibrary,
  saveProject,
  approvalProfit,
  approvalInfo,
  quoteInfoList,
  getEditProfitsDetail,
} from "@/api/project-management/foreign-price-management/ProjectProfit.js"
import { getPurchaseOrder, getProcurementListDetail } from "@/api/procurement/ProcurementList.js"
// 组件
import { JVXETypes } from "@/components/jeecg/JVxeTable"
import ProcurementDetail from "@/views/project-management/procurement/procurement-list/components/ProcurementDetail.vue"
import Print from "./PrintDiloag.vue"
import ProfitPrintDialog from "./ProfitPrintDialog.vue"
import ExportDialog from "./ExportDialog.vue"
import SelectPrintDialog from "./SelectPrintDialog.vue"
import JSelectProject from "@/views/scrm/modules/JSelectProject"
import JSelectCustomer from "@/views/scrm/modules/JSelectCustomer"
import ApprovalSubmit from "@/components/ApprovalDialog/ApprovalSubmit.vue"
import ProductInfo from "./ProductInfo.vue"
import QuotationInfo from "@/views/project-management/components/ProductInfo"
// 导入
import ImportExcelModal from "@/components/ImportExcelModal"
// 混入
import { TableListMixin } from "@/mixins/TableListMixin"
// 数组对象去重
import { uniqBy, uniq, isEmpty } from "lodash"
import moment from "dayjs"
import * as XLSX from "xlsx/xlsx.mjs"
export default {
  components: {
    ImportExcelModal,
    ProcurementDetail,
    Print,
    ProfitPrintDialog,
    ExportDialog,
    SelectPrintDialog,
    JSelectProject,
    JSelectCustomer,
    ApprovalSubmit,
    ProductInfo,
    QuotationInfo,
  },
  mixins: [TableListMixin],
  props: {
    // 是否展示审核tab
    is_ApprovalInfo: {
      type: Boolean,
      default: false,
    },
    // 产品详情表格
    columnsDetail: {
      type: Array,
      default: () => [
        {
          title: "编号",
          dataIndex: "codeNum",
          width: 80,
          align: "center",
          ellipsis: true,
        },
        {
          title: "安装位置",
          dataIndex: "position",
          width: 120,
          ellipsis: true,
          align: "center",
          scopedSlots: { customRender: "position" },
        },
        {
          title: "细目名称",
          dataIndex: "detailName",
          width: 120,
          ellipsis: true,
          align: "center",
          scopedSlots: { customRender: "detailName" },
        },
        {
          title: "技术规格、资质证书",
          dataIndex: "technicalSpecifications",
          width: 150,
          align: "center",
          ellipsis: true,
          scopedSlots: { customRender: "technicalSpecifications" },
        },
        {
          title: "规格参数",
          dataIndex: "specification",
          width: 150,
          ellipsis: true,
          align: "center",
          scopedSlots: { customRender: "specification" },
        },
        {
          title: "产品名称",
          dataIndex: "productName",
          width: 200,
          ellipsis: true,
          align: "center",
          scopedSlots: { customRender: "productId" },
        },
        {
          title: "供应商",
          dataIndex: "supplier",
          width: 150,
          ellipsis: true,
          align: "center",
          scopedSlots: { customRender: "supplier" },
        },
        {
          title: "型号",
          dataIndex: "model",
          width: 130,
          align: "center",
          ellipsis: true,
          scopedSlots: { customRender: "model" },
        },
        {
          title: "单位",
          dataIndex: "unit",
          width: 130,
          align: "center",
          ellipsis: true,
        },
        {
          title: "数量",
          dataIndex: "num",
          width: 120,
          align: "center",
          ellipsis: true,
        },
        {
          title: "采购单价(元)",
          dataIndex: "purchasePrice",
          width: 170,
          align: "center",
          ellipsis: true,
        },
        {
          title: "采购合价(元)",
          dataIndex: "purchaseTotlePrice",
          width: 170,
          align: "center",
          ellipsis: true,
        },
        {
          title: "毛利率",
          dataIndex: "grossProfitRate",
          width: 150,
          align: "center",
          ellipsis: true,
          customRender(text) {
            if (text) {
              return `${parseFloat(text).toFixed(2)}%`
            }
          },
        },
        {
          title: "销售单价（元）",
          dataIndex: "price",
          width: 150,
          ellipsis: true,
          align: "center",
        },
        {
          title: "销售合价（元）",
          dataIndex: "salesTotlePrice",
          width: 150,
          ellipsis: true,
          align: "center",
        },
        {
          title: "备注",
          dataIndex: "remark",
          width: 200,
          ellipsis: true,
          align: "center",
          scopedSlots: { customRender: "remark" },
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          fixed: "right",
          scopedSlots: { customRender: "action" },
        },
      ],
    },
  },
  data() {
    return {
      // 开关
      visible: false,
      // 加载动画开关
      loading: false,
      approvalLoading: false,
      okLoading: false,
      // 是否禁用
      disableSubmit: false,
      readOnly: false,
      // 标题
      title: "新增",
      // 当前模式 0-添加 1-编辑 2-详情  3-办公处理详情 4-采购单详情 5-报价单 6利润详情
      type: 0,
      //父级传进来的record
      record: {},
      // 表单配置
      labelCol: { span: 8 },
      wrapperCol: { span: 15 },
      // 表单参数
      formParams: {
        selectPeopleName: this.$store.getters.userInfo.realname, //当前选型人
        selectPeopleId: this.$store.getters.userInfo.id, //当前选型人id
        profitsPeopleId: this.$store.getters.userInfo.id, //当前报价人id
        profitsDepartment: this.$store.getters.userInfo.departIds, //当前报价部门id
        selectDepartment: this.$store.getters.userInfo.departIds, //当前选型部门id
        department: this.$store.getters.userInfo.departIds, //当前部门id
        profitsPeoplePhone: this.$store.getters.userInfo.phone, // 当前电话
        profitsPeopleName: this.$store.getters.userInfo.realname, // 当前人
        selectPhone: this.$store.getters.userInfo.phone, // 选型人电话
        profitsTime: moment().format("YYYY-MM-DD HH:mm:ss"),
        selectTime: moment().format("YYYY-MM-DD HH:mm:ss"), //选型时间
        project: {
          inCharge: "",
          buildDate: "",
          projectAddr: "",
          amount: "",
          budget: "",
          outlines: "",
          projectId: "",
          projectName: "",
          customLiaisonId: "",
          customerName: "",
          customerPhone: "",
          companyName: "",
          customId: "",
          projectType: "",
          department: "",
        },
      },
      // 汇总采购合价
      formatPurchasePrice: 0,
      // 汇总销售合价
      formatSalePrice: 0,
      currnetIndex: "", //当前表格选中的下标
      currnetRow: "", //当前表格选中的行数据
      disableMixinCreated: true, //不执行混入
      // rowSelection:'',
      expandedRowKeys: [],
      // 表格配置
      // columns: [
      //   {
      //     title: '方案编号',
      //     dataIndex: 'code',
      //     align: 'center',
      //     width: '8%',
      //     ellipsis: true,
      //   },
      //   {
      //     title: '方案名称',
      //     dataIndex: 'name',
      //     width: '8%',
      //     key: 'name',
      //     ellipsis: true,
      //     align: 'center',
      //   },
      //   {
      //     title: '方案类型',
      //     dataIndex: 'type',
      //     width: '8%',
      //     key: 'type',
      //     ellipsis: true,
      //     customRender(text) {
      //       if (text == 1) {
      //         return '工程'
      //       } else if (text == 2) {
      //         return '软件'
      //       } else {
      //         return ''
      //       }
      //     },
      //     align: 'center',
      //   },
      //   {
      //     title: '采购价小计',
      //     dataIndex: 'totalPurchase',
      //     width: '8%',
      //     key: 'totalPurchase',
      //     ellipsis: true,
      //     align: 'center',
      //   },
      //   {
      //     title: '平均利润率',
      //     dataIndex: 'avgProfit',
      //     width: '8%',
      //     ellipsis: true,
      //     key: 'avgProfit',
      //     align: 'center',
      //     customRender(text) {
      //       if (text) {
      //         return `${text}%`
      //       } else {
      //         return text
      //       }
      //     },
      //   },
      //   {
      //     title: '销售价小计',
      //     dataIndex: 'totalSell',
      //     width: '8%',
      //     key: 'totalSell',
      //     ellipsis: true,
      //     align: 'center',
      //   },
      //   {
      //     title: '设计人',
      //     dataIndex: 'designPerson',
      //     width: '8%',
      //     ellipsis: true,
      //     key: 'designPerson',
      //     align: 'center',
      //   },
      //   {
      //     title: '设计部门',
      //     dataIndex: 'designPersonDept',
      //     width: '8%',
      //     ellipsis: true,
      //     key: 'designPersonDept',
      //     align: 'center',
      //   },
      //   {
      //     title: '报价人',
      //     dataIndex: 'profitsPeopleName',
      //     width: '8%',
      //     ellipsis: true,
      //     key: 'profitsPeopleName',
      //     align: 'center',
      //   },
      //   {
      //     title: '报价部门',
      //     dataIndex: 'profitsPeopleDept',
      //     width: '8%',
      //     ellipsis: true,
      //     key: 'profitsPeopleDept',
      //     align: 'center',
      //   },
      //   {
      //     title: '报价时间',
      //     dataIndex: 'profitsTime',
      //     width: '8%',
      //     ellipsis: true,
      //     key: 'profitsTime',
      //     align: 'center',
      //   },
      //   {
      //     title: '状态',
      //     dataIndex: 'status',
      //     width: '8%',
      //     ellipsis: true,
      //     align: 'center',
      //     customRender(text) {
      //       if (text == 1) {
      //         return '保存'
      //       } else if (text == 2) {
      //         return '已提交'
      //       } else if (text == 3) {
      //         return '询价中'
      //       } else if (text == 4) {
      //         return '询价完成'
      //       } else if (text == 5) {
      //         return '方案不通过'
      //       } else if (text == 6) {
      //         return '已选型'
      //       } else {
      //         return ''
      //       }
      //     },
      //   },
      //   {
      //     title: '操作',
      //     key: 'action',
      //     align: 'center',
      //     fixed: 'right',
      //     scopedSlots: { customRender: 'action' },
      //   },
      // ],
      columns: [
        {
          title: "方案编号",
          key: "code",
          type: JVXETypes.normal,
          width: "8%",
          align: "center",
        },
        {
          title: "方案名称",
          key: "name",
          type: JVXETypes.normal,
          width: "8%",
          align: "center",
        },
        {
          title: "方案类型",
          key: "type",
          type: JVXETypes.normal,
          width: "8%",
          align: "center",
          type: JVXETypes.slot,
          slotName: "type",
        },
        {
          title: "采购价小计",
          key: "totalPurchase",
          type: JVXETypes.normal,
          width: "8%",
          align: "center", // 【统计列】sum = 求和
          statistics: ["sum"],
        },
        {
          title: "平均利润率",
          key: "avgProfit",
          type: JVXETypes.normal,
          width: "8%",
          align: "center",
          statistics: ["average"],
        },
        {
          title: "销售价小计",
          key: "totalSell",
          type: JVXETypes.normal,
          width: "8%",
          align: "center",
          statistics: ["sum"],
        },
        {
          title: "设计人",
          key: "designPerson",
          type: JVXETypes.normal,
          width: "8%",
          align: "center",
        },
        {
          title: "设计部门",
          key: "designPersonDept",
          type: JVXETypes.normal,
          width: "8%",
          align: "center",
        },
        {
          title: "报价人",
          key: "profitsPeopleName",
          type: JVXETypes.normal,
          width: "8%",
          align: "center",
        },
        {
          title: "报价部门",
          key: "profitsPeopleDept",
          type: JVXETypes.normal,
          width: "8%",
          align: "center",
        },
        {
          title: "报价时间",
          key: "profitsTime",
          type: JVXETypes.normal,
          width: "8%",
          align: "center",
        },
        {
          title: "状态",
          key: "status",
          type: JVXETypes.slot,
          slotName: "status",
          width: "8%",
          align: "center",
        },
        {
          title: "操作",
          key: "action",
          type: JVXETypes.slot,
          width: "100px",
          align: "center",
          fixed: "right",
          slotName: "action",
        },
      ],
      // 表格数据
      dataSource: [{ name: 1 }],
      // 审批表格数据
      dataApproval: [],
      url: {
        importUrl: ``, //导入
        downloadGetUrl: "/prodProfits/model", //下载模板
        exportXlsUrl: "/jeecg-supplier/prodProfits/model", //导出
      },
      // 表单验证规则
      rules: {
        projectId: [{ required: true, message: "请选择项目名称", trigger: "blur" }],
        purchaseContext: [{ required: true, message: "请输入采购内容", trigger: "blur" }],
        // priceControl: [{ required: true, message: '请输入上控价', trigger: 'blur' }],
        // department: [{ required: true, message: '请选择设计部门', trigger: 'change' }],
        // phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }, { validator: this.validateMobile }],
      },
      projectList: [], //项目信息
      principalPersonList: [], // 设计部门列表
      dataFristLeval: [], // 表格数据的第一层
      approvalId: "", //当前id，传给审批
      fileList: [], //文件数据
      // 上传地址
      uploadUrl: process.env.VUE_APP_API_BASE_URL + "/sys/common/upload",
      // 上传请求头
      headers: {
        "X-Access-Token": this.$ls.get("Access-Token"),
      },
      btnState: false,
      // 字段对应的表头（必须一一对应）
      character: {
        detailName: {
          text: "细目名称",
          type: "string",
        },
        technicalSpecifications: {
          text: "投标文件要求的技术规格、资料证书",
          type: "string",
        },
        unit: {
          text: "单位",
          type: "string",
        },
        num: {
          text: "数量",
          type: "string",
        },
        remark: {
          text: "备注",
          type: "string",
        },
        is_main: {
          text: "是否主材",
          type: "string",
        },
      },
      code: "", //查看采购单列表标识
      dataSourcePurchase: [], //采购单数据
      status: "", //可以审批的标识 status=4（已选型状态）
      currentData: [],
      profitData: [],
    }
  },

  computed: {
    rowSelection() {
      const { selectedRowKeys } = this
      return {
        selectedRowKeys,
        onChange: this.onSelectChange,
        hideDefaultSelections: true,
        onSelect: this.onSelect, //触发级联的方法
        fixed: true,
      }
    },
    commentType() {
      return (val) => {
        switch (val) {
          case 1:
            return "待审批"
          case 2:
            return "审批通过"
          case 3:
            return "审批不通过"
        }
      }
    },
    approveTypeTag() {
      return (val) => {
        switch (val) {
          case 1:
            return "orange"
          case 2:
            return "green"
          case 3:
            return "red"
        }
      }
    },
    projectType() {
      return (val) => {
        switch (val) {
          case 1:
            return "工程项目"
          case 2:
            return "渠道项目"
          case 3:
            return "产品销售"
          case 4:
            return "软件销售"
          case 5:
            return "软件定制"
        }
      }
    },
    statusType() {
      return (val) => {
        switch (val) {
          case 1:
            return "保存"
          case 2:
            return "已提交"
          case 3:
            return "询价中"
          case 4:
            return "询价完成"
          case 5:
            return "方案不通过"
          case 6:
            return "已选型"
        }
      }
    },
  },
  watch: {
    // 监听滚动条(把表格的滚动条隐藏了，只显示一条滚动条，监听滚动条滚动的时候，表格和尾部可以一起滑动)
    dataSource: {
      handler(val) {
        if (val) {
          this.formatPurchasePrice = val.reduce((p, c) => p + Number(c.purchaseTotlePrice), 0).toFixed(2)
          this.formatSalePrice = val.reduce((p, c) => p + Number(c.salesTotlePrice), 0).toFixed(2)
          let purchaseTotlePrice = 0
          let salesTotlePrice = 0
          let data = val.forEach((item) => {
            if (item.children) {
              purchaseTotlePrice = item.children.reduce((p, c) => p + Number(c.purchaseTotlePrice), 0).toFixed(2)
              salesTotlePrice = item.children.reduce((p, c) => p + Number(c.salesTotlePrice), 0).toFixed(2)
              console.log("purchaseTotlePrice", purchaseTotlePrice, this.formatPurchasePrice)
              this.formatPurchasePrice = (Number(this.formatPurchasePrice) + Number(purchaseTotlePrice)).toFixed(2)
              this.formatSalePrice = (Number(this.formatSalePrice) + Number(salesTotlePrice)).toFixed(2)
            }
          })

          const dom = this.$refs.tableformRef.$el.getElementsByClassName("ant-table-body")[0]
          const footerDom = document.getElementsByClassName("subtotal")[0]
          footerDom.addEventListener(
            "scroll",
            () => {
              dom.scrollLeft = footerDom.scrollLeft
            },
            true
          )
        }
      },
      // deep: true,
      // immediate: true,
    },
  },
  methods: {
    moment,
    editProfits(row, type) {
      if (type == 1) {
        this.$refs.productInfo.edit(row)
      } else {
        this.$refs.productInfo.detail(row, this.formParams)
      }
    },
    // 2通过/1不通过
    handleApprovalSub(type) {
      this.$refs.aprovalForm.type = type
      this.$refs.aprovalForm.open(type, this.approvalId)
    },
    setIcon(val) {
      if (val) {
        return "el-icon-check"
      } else {
        return "el-icon-time"
      }
    },
    setColor(val) {
      if (val) {
        return "#2bc418"
      } else {
        return "#b3bdbb"
      }
    },

    // 导出
    handleExport(fileName) {
      this.$refs.export.open(fileName, this.approvalId)
    },

    validateMobile(rule, value, callback) {
      if (!value || new RegExp(/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/).test(value)) {
        callback()
      } else {
        callback("您的手机号码格式不正确!")
      }
    },

    onSelectChange(selectedRowKeys, selectionRows) {
      console.log("selectedRowKeys changed: ", selectedRowKeys, selectionRows)
      this.selectedRowKeys = uniqBy(selectedRowKeys) //选中的key
      this.selectionRows = selectionRows //选中的表格数据
    },
    onSelect(record, selected) {
      //每个复选框点击都会触发
      const selectrows = [record.key]
      if (record.hasOwnProperty("children")) {
        const generator = (record) => {
          //这里做一个递归查找
          record.forEach((item) => {
            selectrows.push(item.key)

            if (item.children && item.children.length > 0) {
              generator(item.children)
            }
          })
        }
        generator(record.children)
      }
      const newselect = this.selectedRowKeys.filter((item) => !selectrows.includes(item))
      //选中和取消选中的级联
      selected ? (this.selectedRowKeys = [...this.selectedRowKeys, ...selectrows]) : (this.selectedRowKeys = newselect)
    },

    // 获取部门树形
    getDepartmentList() {
      getDepartmentList().then((res) => {
        if (res.success) {
          this.principalPersonList = res.result
        }
      })
    },

    // 获取关联项目列表
    getProjectList() {
      getProjectList().then(({ result, success }) => {
        if (success) {
          this.projectList = result.records
        }
      })
    },

    // 项目改变事件
    handelChange(value, rows) {
      this.$set(this.formParams, "companyName", rows[0].customer) //客户名称
      this.$set(this.formParams, "customerName", rows[0].liaison) //联系人
      this.$set(this.formParams, "customerPhone", rows[0].phone) //联系电话
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
      this.type = 0
      this.disableSubmit = false
      this.formParams = {
        selectPeopleName: this.$store.getters.userInfo.realname, //当前选型人
        selectPeopleId: this.$store.getters.userInfo.id, //当前选型人id
        profitsPeopleId: this.$store.getters.userInfo.id, //当前报价人id
        profitsDepartment: this.$store.getters.userInfo.departIds, //当前报价部门id
        selectDepartment: this.$store.getters.userInfo.departIds, //当前选型部门id
        department: this.$store.getters.userInfo.departIds, //当前部门id
        profitsPeoplePhone: this.$store.getters.userInfo.phone, // 当前电话
        profitsPeopleName: this.$store.getters.userInfo.realname, // 当前人
        selectPhone: this.$store.getters.userInfo.phone, // 选型人电话
        profitsTime: moment().format("YYYY-MM-DD HH:mm:ss"),
        selectTime: moment().format("YYYY-MM-DD HH:mm:ss"), //选型时间
        project: {
          inCharge: "",
          buildDate: "",
          projectAddr: "",
          amount: "",
          budget: "",
          outlines: "",
          projectId: "",
          projectName: "",
          customLiaisonId: "",
          customerName: "",
          customerPhone: "",
          companyName: "",
          customId: "",
          projectType: "",
          department: "",
        },
      }
      this.dataSource = []
      this.fileList = []
      this.dataSourcePurchase = []
      this.currentData = []
      this.profitData = []
    },
    // 方案列表
    getLibrary(id) {
      getLibrary({ projectId: id }).then((res) => {
        if (res.success) {
          this.profitData = res.result.records
          this.$forceUpdate()
        }
      })
    },
    handelChangeCustomer(val, rows) {
      this.$set(this.formParams, "customId", rows[0].id)
    },
    // 添加
    add(row) {
      console.log("添加利润---", row, this.type)
      if (row) {
        if (row.profitsId && [7, 8].includes(row.flowStatus)) {
          this.type = 2 // 审批利润表/详情
          this.title = "详情"
          this.currentData = row
          this.getDetail(row.profitsId)
          this.disableSubmit = true
        } else if (row.profitsId) {
          this.type = 1 // 编辑模式
          // this.title = '编辑'
          this.currentData = row
          this.getDetail(row.profitsId)
        } else {
          this.currentData = row
          this.formParams = {
            ...this.formParams,
            inCharge: row.inCharge, //负责人
            buildDate: row.buildDate, //立项时间
            projectAddr: row.projectAddr, //项目地点
            amount: row.amount, //项目总额
            budget: row.budget, //项目概算
            outlines: row.outlines, //概要说明
            projectId: row.id, //*项目id
            projectName: row.projectName, //项目名称
            customLiaisonId: row.customLiaisonId, //客户联系人id
            customerName: row.liaison, //客户联系人
            customerPhone: row.phone, //客户联系人电话
            companyName: row.customName, //客户名称
            customId: row.customer, //客户id
            projectType: row.projectType,
            purchaseContext: row.purchaseContext,
            priceControl: row.priceControl,
            department: this.$store.getters.userInfo.departIds,
          }
          // 当前为添加模式
          this.type = 0
          this.title = "新增利润表"
        }
      } else {
        this.type = 0
        this.title = "新增利润表"
        // this.open()
      }
      this.open()
      this.readOnly = true
      this.getLibrary(row.id)
    },
    // 编辑
    edit(record) {
      this.type = 1
      this.getDetail(record.id)
      // 当前id（传给审批）
      this.approvalId = record.id || record
      this.currentData = record
      this.open()
      this.readOnly = true
    },
    // 详情
    detail(record, projectId) {
      this.record = record
      if (projectId) {
        //项目id查询
        this.getDetail(record.projectId)
        this.getLibrary(record.projectId)
      } else {
        this.getDetail(record.id || record)
        this.getLibrary(record.id || record)
      }
      this.type = 2
      // 当前id（传给审批）
      this.approvalId = record.id || record
      this.currentData = record
      this.currentData.typeId = record.id
      this.readOnly = true
      this.open()
    },
    // 审批详情
    officeDetail(record, projectId) {
      if (projectId) {
        this.getDetail(record.projectId)
      } else {
        this.getDetail(record.typeId)
      }
      this.type = 3
      this.getLibrary(record.typeId)
      // 当前id（传给审批）
      this.approvalId = record.id
      this.currentData = record
      this.readOnly = true
      this.disableSubmit = true
      this.title = "详情"
      this.open()
    },
    // 利润详情
    profitDetail(record, projectId) {
      console.log(record)
      this.getDetail(record.projectId)
      this.type = 6
      this.getEditProfitsDetail(record.id)
      this.currentData = record
      this.readOnly = true
      this.disableSubmit = true
      this.title = "详情"
      this.open()
    },
    // 获取利润表详情
    getEditProfitsDetail(schemeLibraryId) {
      getEditProfitsDetail({ schemeLibraryId: schemeLibraryId }).then((res) => {
        if (res.success) {
          res.result.map((item) => {
            if (!item.children) {
              item.children = []
            }
            if (!item.grossProfitRate) {
              item.grossProfitRate = 0
            }
            if (!item.price) {
              item.price = 0
            }
            if (!item.salesTotlePrice) {
              item.salesTotlePrice = 0
            }
          })
          this.profitData = res.result
        }
      })
    },

    // 报价单详情
    quotationDetail(row) {
      // console.log('报价单详情', row)
      this.type = 5
      this.title = "详情"
      this.getDetail(row.projectId)
      this.quoteInfoList(row.id)
      // 当前id
      this.approvalId = row.id
      this.readOnly = true
      this.disableSubmit = true
      this.open()
      //  setTimeout(()=>{
      //   this.open()
      //  },50)
    },
    // 报价单详情里的产品列表
    quoteInfoList(id) {
      quoteInfoList({ quoteInfoId: id }).then((res) => {
        if (res.success) {
          res.result.map((item) => {
            if (!item.children) {
              item.children = []
            }
            if (!item.key) {
              item.key = item.id
            }
          })
          this.profitData = res.result
          this.$forceUpdate()
        }
      })
    },
    // 获取报价单详情
    getQuotationDetail(id) {
      getQuotationDetail(id).then((res) => {
        if (res.success) {
          this.formParams = res.result
          this.dataSource = res.result.profitsProducts ? res.result.profitsProducts : []
          // 项目信息
          this.$set(this.formParams, "buildDate", res.result.project.buildDate)
          this.$set(this.formParams, "projectAddr", res.result.project.projectAddr)
          this.$set(this.formParams, "amount", res.result.project.amount)
          this.$set(this.formParams, "budget", res.result.project.budget)
          this.$set(this.formParams, "outlines", res.result.project.outlines)
          this.$set(this.formParams, "projectId", res.result.project.id)
          this.$set(this.formParams, "projectName", res.result.project.projectName)
          this.$set(this.formParams, "customerName", res.result.project.liaison)
          this.$set(this.formParams, "customerPhone", res.result.project.phone)
          this.$set(this.formParams, "companyName", res.result.project.customerName)
          this.$set(this.formParams, "customId", res.result.project.customer)
          this.$set(this.formParams, "inCharge", res.result.project.inCharge)
          this.$set(this.formParams, "projectType", res.result.project.projectType)
        }
      })
    },
    // 获取详情
    getDetail(id) {
      getDetail(id).then((res) => {
        if (res.success) {
          // this.formParams = res.result
          // this.dataSource = res.result.profitsProducts ? res.result.profitsProducts : []
          // this.dataApproval = res.result.approves ? res.result.approves : []
          this.formParams = res.result
          this.formParams.projectId = res.result.id
          this.formParams.customerName = res.result.liaison
          this.formParams.customerPhone = res.result.phone
          this.formParams.customId = res.result.customer
          this.formParams.inCharge = this.record.inCharge
          // 项目信息
          // this.$set(this.formParams, 'buildDate', res.result.buildDate)
          // this.$set(this.formParams, 'projectAddr', res.result.projectAddr)
          // this.$set(this.formParams, 'amount', res.result.amount)
          // this.$set(this.formParams, 'budget', res.result.budget)
          // this.$set(this.formParams, 'outlines', res.result.outlines)
          // this.$set(this.formParams, 'projectId', res.result.id)
          // this.$set(this.formParams, 'projectName', res.result.projectName)
          // this.$set(this.formParams, 'customerName', res.result.liaison)
          // this.$set(this.formParams, 'customerPhone', res.result.phone)
          // this.$set(this.formParams, 'companyName', res.result.customerName)
          // this.$set(this.formParams, 'customId', res.result.customer)
          // this.$set(this.formParams, 'inCharge', res.result.inCharge)
          // this.$set(this.formParams, 'projectType', res.result.projectType)
          console.log("查询利润表的数据", this.formParams)
        }
      })
    },
    // 获取审批信息
    getApprovalInfo(typeId) {
      approvalInfo({ typeId: typeId, type: 3 }).then((res) => {
        if (res.success) {
          this.dataApproval = res.result
        }
      })
    },
    // 采购详情
    procurementDetail(record) {
      this.type = 4
      this.getProcurementListDetail(record.id || record)
      // 当前id（传给采购审批）
      this.approvalId = record.id || record
      this.readOnly = true
      this.disableSubmit = true
      this.open(record)
      this.code = record.code
      // 采购列表下的采购单
      this.getPurchaseOrder(this.code)
    },
    // 获取采购详情
    getProcurementListDetail(id) {
      getProcurementListDetail(id).then((res) => {
        if (res.success) {
          this.formParams = res.result
          this.dataSource = res.result.prodPurchaseOrderProductVos ? res.result.prodPurchaseOrderProductVos : []
        }
      })
    },
    //采购列表下的采购单
    getPurchaseOrder(code) {
      getPurchaseOrder({ code }).then((res) => {
        if (res.success) {
          this.dataSourcePurchase = res.result.records
        }
      })
    },

    // 切换标签页
    handleChangeTab(value) {
      if (value == 2) {
        // 采购列表下的采购单
        this.getPurchaseOrder(this.code)
        this.getApprovalInfo(this.currentData.typeId)
      }
    },

    // 确认审批后关闭弹窗且刷新
    refreshClose() {
      this.close()
      this.$emit("refresh")
    },

    expandedRowsChange(e) {
      // this.expandedRowKeys = e
    },

    // 审批
    handleApproval() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const flag = Object.keys(this.profitData).every((key) => this.profitData[key].status == 6)
          console.log(flag)
          if (!flag) return this.$message.warning("产品数据审批状态全部为已选型才能提交审批!")
          let data = {
            projectId: this.formParams.projectId,
            amount: this.formParams.amount,
            budget: this.formParams.budget,
            priceControl: this.formParams.priceControl,
            purchaseContext: this.formParams.purchaseContext,
          }
          approvalProfit(data)
            .then((res) => {
              if (res.success) {
                this.$message.success(res.message)
                this.$emit("refresh")
              } else {
                this.$message.error(res.message)
              }
              this.close()
            })
            .finally(() => {
              setTimeout(() => {
                this.approvalLoading = false
              }, 2000)
            })
        }
      })
    },

    // 报价单导出预览
    handlePrint() {
      // this.$refs.print.open()
      this.$refs.selectPrint.open()
    },

    // 利润表导出预览
    handleProfitPrint() {
      this.$refs.profitPrint.open()
    },

    //提交 1-保存 2-提交
    handleOk(value) {
      console.log(this.dataSource, this.formParams)
      // const flag = Object.keys(this.dataSource).some(key => this.dataSource[key].productId == '')
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // 传给后端的数据
          let data = {
            // ...this.formParams,
            // profitsProducts: this.dataSource,
            // project: project,
            projectId: this.formParams.projectId,
            amount: this.formParams.amount,
            budget: this.formParams.budget,
            priceControl: this.formParams.priceControl,
            purchaseContext: this.formParams.purchaseContext,
          }
          console.log(data)
          this.okLoading = true
          saveProject(data)
            .then((res) => {
              if (res.success) {
                this.$message.success(res.message)
                this.$emit("refresh")
              } else {
                this.$message.error(res.message)
              }
              this.close()
            })
            .finally(() => {
              setTimeout(() => {
                this.okLoading = false
              }, 2000)
            })
        } else {
          this.$message.warning(res.message)
          return false
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
::v-deep .ant-table td {
  white-space: nowrap;
}
.title {
  background-color: #f8faff;
  padding: 6px;
  margin-bottom: 10px;
  font-weight: 600;
}
.buttom {
  margin: 10px 5px;
}
.sub-button {
  margin: 0 0.8rem 0 0;
}

.price-control {
  // margin-left: 20px;
  // float: right;
  font-size: 18px;
  font-weight: 600;
}
// 隐藏上传的文件名称图标
::v-deep .ant-upload-list {
  display: none;
}
::v-deep .ant-upload-list-text {
  display: none;
}
::v-deep .ant-input-number-handler-wrap {
  z-index: 0;
}
// 表头前加*
.form-table-heard:before {
  content: "*";
  color: red;
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
  max-width: 250px !important;
  // max-height: 70px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-wrap: break-word;
  word-break: break-all;
}

.subtotal {
  height: 50px;
  // position: absolute;
  // bottom: 10px;
  width: 100%;
  border: 1px solid #e8e8e8;
  background: #fafafa;
  display: flex;
  align-items: center;
  font-weight: 700;
  overflow-x: scroll;
  overflow-y: hidden;
  .left {
    flex: none; /* div显示滚动条的重点 */
    // width: 391px;
    margin-left: 75px;
  }
  .number {
    flex: none;
    color: #666666;
    height: 100%;
    width: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    // padding-left: 5px;
  }
  .last {
    flex: none;
    color: #666666;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 182px;
  }
}
//隐藏a-table组件的滚动条
// /deep/.ant-table-body {
//   overflow: hidden !important;
// }
// /deep/.ant-table-footer {
//   margin: 0;
// }
</style>
