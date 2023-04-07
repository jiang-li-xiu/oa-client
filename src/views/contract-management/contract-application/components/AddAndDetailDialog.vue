<template>
  <a-drawer
    :title="title"
    :maskClosable="true"
    width="80%"
    placement="right"
    :closable="true"
    @close="close"
    :visible="visible"
    style="overflow: auto; padding-bottom: 53px"
  >
    <a-spin tip="加载中.." :spinning="loading">
      <a-form-model ref="ruleForm" :model="formParams" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <!-- 申请信息 -->
        <a-tabs default-active-key="1" @change="handleChange" :activeKey="activeKey">
          <a-tab-pane key="1" tab="申请信息">
            <j-form-container :disabled="disableSubmit">
              <a-row slot="detail">
                <a-col :span="24" class="title">申请信息</a-col>
                <a-col :span="8">
                  <a-form-model-item label="申请部门" prop="dept">
                    <a-input v-model="formParams.dept" placeholder="请输入申请部门" :read-only="true" />
                    <!-- <a-tree-select
                      v-model="formParams.departIds"
                      show-search
                      style="width: 100%"
                      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                      placeholder="请选择"
                      allow-clear
                      tree-default-expand-all
                      :read-only="true"
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
                    </a-tree-select> -->
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="申请人" prop="people">
                    <a-input v-model="formParams.people" placeholder="请输入申请人" :read-only="true" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="联系电话" prop="phone">
                    <a-input v-model="formParams.phone" placeholder="请输入联系电话" :read-only="true" />
                  </a-form-model-item>
                </a-col>

                <a-col :span="24" class="title">合同审查要素</a-col>
                <a-col :span="24">
                  <a-form-model-item
                    label="关联客户"
                    prop="customerId"
                    :label-col="{ span: 2 }"
                    :wrapper-col="{ span: 21 }"
                  >
                    <j-select-customer v-model="formParams.customerId" :multi="false" @change="handelChangeCustomer">
                    </j-select-customer>
                  </a-form-model-item>
                </a-col>
                <a-col :span="24">
                  <a-form-model-item
                    label="关联项目"
                    prop="projectId"
                    :label-col="{ span: 2 }"
                    :wrapper-col="{ span: 21 }"
                  >
                    <j-select-project
                      v-model="formParams.projectId"
                      :multi="false"
                      @change="handelChange"
                    ></j-select-project>
                  </a-form-model-item>
                </a-col>
                <a-col :span="24">
                  <a-form-model-item
                    label="关联供应商"
                    prop="supplierId"
                    :label-col="{ span: 2 }"
                    :wrapper-col="{ span: 21 }"
                  >
                    <a-input-search
                      v-model="formParams.supplierName"
                      placeholder="请选择供应商"
                      @search="onSearch"
                      readOnly
                    >
                      <a-button slot="enterButton">选择供应商</a-button>
                    </a-input-search>
                  </a-form-model-item>
                </a-col>
                <a-col :span="24">
                  <a-form-model-item
                    label="合同名称"
                    prop="contract"
                    :label-col="{ span: 2 }"
                    :wrapper-col="{ span: 21 }"
                  >
                    <a-input v-model="formParams.contract" placeholder="请输入合同名称" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="合同类型" prop="contractType">
                    <j-dict-select-tag
                      v-model="formParams.contractType"
                      dictCode="contract_type"
                      placeholder="请选择合同类型"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="甲方（需方）" prop="partnerA">
                    <a-input v-model="formParams.partnerA" placeholder="请输入甲方名称" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="甲方负责人" prop="partnerAPerson">
                    <a-input v-model="formParams.partnerAPerson" placeholder="请输入甲方负责人" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="甲方联系方式" prop="partnerAPhone">
                    <a-input v-model="formParams.partnerAPhone" placeholder="请输入甲方联系方式" :maxLength="11" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="乙方（供方）" prop="partnerB">
                    <a-input v-model="formParams.partnerB" placeholder="请输入乙方名称" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="乙方负责人" prop="partnerBPerson">
                    <a-input v-model="formParams.partnerBPerson" placeholder="请输入乙方负责人" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="乙方联系方式" prop="partnerBPhone">
                    <a-input v-model="formParams.partnerBPhone" placeholder="请输入乙方联系方式" :maxLength="11" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="收款人" prop="payee">
                    <a-input v-model="formParams.payee" placeholder="请输入收款人" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="开户银行" prop="bank">
                    <a-input v-model="formParams.bank" placeholder="请输入开户银行" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="银行账号" prop="bankAccount">
                    <a-input
                      v-model="formParams.bankAccount"
                      placeholder="请输入银行账号"
                      :style="{ width: '100%' }"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="结算方式" prop="settlementType">
                    <a-input v-model="formParams.settlementType" placeholder="请输入结算方式" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="合同总金额" prop="totalAmount">
                    <a-input-number
                      v-model="formParams.totalAmount"
                      placeholder="请输入合同总金额"
                      :style="{ width: '100%' }"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="付款期数" prop="payCycle">
                    <a-input-number
                      v-model="formParams.payCycle"
                      placeholder="请输入付款期数"
                      :style="{ width: '100%' }"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="开票信息" prop="ticketInfo">
                    <a-input v-model="formParams.ticketInfo" placeholder="请输入开票信息" />
                  </a-form-model-item>
                </a-col>

                <a-col :span="8">
                  <a-form-model-item label="开票情况" prop="ticketSituation">
                    <a-select
                      v-model="formParams.ticketSituation"
                      placeholder="请选择开票情况"
                      :getPopupContainer="(trigger) => trigger.parentElement"
                    >
                      <a-select-option :value="1">专票 </a-select-option>
                      <a-select-option :value="2">普票 </a-select-option>
                      <a-select-option :value="3">13%税点（含运费） </a-select-option>
                      <a-select-option :value="4">不含税 </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item
                    label="发货是否随附发货清单"
                    prop="withList"
                    :label-col="{ span: 10 }"
                    :wrapper-col="{ span: 12 }"
                  >
                    <a-select
                      v-model="formParams.withList"
                      placeholder="请选择发货是否随附发货清单"
                      :getPopupContainer="(trigger) => trigger.parentElement"
                    >
                      <a-select-option :value="1">是 </a-select-option>
                      <a-select-option :value="0">否 </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="是否主合同" prop="isMainContract">
                    <a-select
                      v-model="formParams.isMainContract"
                      placeholder="请选择是否主合同"
                      :getPopupContainer="(trigger) => trigger.parentElement"
                    >
                      <a-select-option :value="1">是 </a-select-option>
                      <a-select-option :value="0">否 </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="主合同" prop="mainContractId">
                    <a-select
                      v-model="formParams.mainContractId"
                      placeholder="请选择主合同"
                      allowClear
                      :getPopupContainer="(trigger) => trigger.parentElement"
                    >
                      <a-select-option v-for="item in contractList" :key="item.id" :value="item.id">
                        <!-- {{ item.contract }} -->
                        <span style="display: inline-block; width: 100%" :title="item.contract">
                          {{ item.contract }}
                        </span>
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>

                <a-col :span="24">
                  <a-form-model-item
                    label="合同文件"
                    prop="fileUrl"
                    :label-col="{ span: 2 }"
                    :wrapper-col="{ span: 17 }"
                  >
                    <a-upload
                      :action="uploadUrl"
                      :multiple="true"
                      :file-list="fileUrl"
                      :headers="headers"
                      :disabled="disableSubmit"
                      @change="handleUploadChange"
                      :remove="handleRemove"
                      @download="downloadFile"
                      @preview="handlePreview"
                      :showUploadList="{
                        showRemoveIcon: true,
                        showDownloadIcon: true,
                      }"
                    >
                      <a v-if="fileUrl.length < 9" type="primary" icon="upload">上传文件 </a>
                    </a-upload>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </j-form-container>
            <a-row>
              <a-col :span="24">
                <a-form-model-item
                  label="合同摘要"
                  prop="abstractInfo"
                  :label-col="{ span: 2 }"
                  :wrapper-col="{ span: 21 }"
                >
                  <a-textarea
                    v-model="formParams.abstractInfo"
                    placeholder="请输入合同摘要"
                    :rows="3"
                    :read-only="disableSubmit"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item
                  label="违约条款"
                  prop="breachClause"
                  :label-col="{ span: 2 }"
                  :wrapper-col="{ span: 21 }"
                >
                  <a-textarea
                    v-model="formParams.breachClause"
                    placeholder="请输入违约条款"
                    :rows="4"
                    :read-only="disableSubmit"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item label="备注" prop="remark" :label-col="{ span: 2 }" :wrapper-col="{ span: 21 }">
                  <a-textarea
                    v-model="formParams.remark"
                    placeholder="请输入备注"
                    :rows="5"
                    :read-only="disableSubmit"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-tab-pane>

          <!-- 审批信息 -->
          <a-tab-pane key="2" tab="审批信息" force-render v-if="[2, 3].includes(this.type)">
            <a-row>
              <a-col :span="24" class="title">审批信息</a-col>
              <a-col :span="24">
                <div class="block" v-if="approvalList && approvalList.length > 0">
                  <a-timeline>
                    <a-timeline-item
                      v-for="(item, index) in approvalList"
                      :key="index"
                      :icon="setIcon(item.approverTime)"
                      :color="setColor(item.approverTime)"
                    >
                      <p style="font-weight: 700">{{ item.processName }}</p>
                      <a-card class="box-card" shadow="hover">
                        <a-descriptions :column="4" :labelStyle="{ 'font-weight': 'bold' }">
                          <a-descriptions-item label="操作人">{{ item.approverName || '-' }}</a-descriptions-item>
                          <a-descriptions-item label="申请时间">{{ item.applyTime || '-' }}</a-descriptions-item>
                          <a-descriptions-item label="状态">{{ commentType(item.status) || '-' }}</a-descriptions-item>
                          <a-descriptions-item label="审批时间">{{ item.approverTime || '-' }}</a-descriptions-item>
                        </a-descriptions>
                        <a-divider orientation="left">
                          <a-tag :color="approveTypeTag(item.status)">{{ commentType(item.status) }}</a-tag>
                          <a-tag>{{ item.approverTime || '--' }}</a-tag>
                        </a-divider>
                      </a-card>
                    </a-timeline-item>
                  </a-timeline>
                </div>
                <div v-else>- 暂无记录 -</div>
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </a-form-model>
    </a-spin>
    <div class="drawer-bootom-button">
      <template v-if="this.type !== 3">
        <a-button
          @click="handleApproval"
          type="primary"
          style="margin-right: 0.8rem"
          :loading="approvalLoading"
          :disabled="this.currnetRow.status !== 1 && this.type !== 0"
          >提交审批
        </a-button>
        <a-button
          @click="handleOk"
          type="primary"
          style="margin-right: 0.8rem"
          :loading="okLoading"
          :disabled="this.type == 2"
          >保存
        </a-button>
      </template>
      <template v-else>
        <!-- status: 1-待审批，2-审批通过，3-审批不通过 -->
        <a-button
          key="submit"
          type="primary"
          :loading="loading"
          @click="handleApprovalSub(2)"
          style="margin-right: 0.8rem"
          :disabled="this.currnetRow.status !== 1"
        >
          通过
        </a-button>
        <a-button
          key="back"
          type="danger"
          @click="handleApprovalSub(1)"
          style="margin-right: 0.8rem"
          :disabled="this.currnetRow.status !== 1"
          >不通过
        </a-button>
      </template>
      <a-button @click="close" style="margin-right: 0.8rem">取消</a-button>
    </div>

    <ApprovalSubmit ref="aprovalForm" @refreshClose="refreshAndClose"></ApprovalSubmit>

    <SelectSupplierList
      ref="SelectSupplier"
      @select="handleSelectSupplier"
      modalTitle="关联供应商"
      listUrl="/prodSupplier/list"
      :columns="columnsSupplier"
      type=""
      :slotParams="slotParams"
    >
      <template #default>
        <a-form-model-item label="供应商名称" prop="supplier">
          <j-input v-model="slotParams.supplier" placeholder="请输入供应商名称"></j-input>
        </a-form-model-item>
      </template>
    </SelectSupplierList>
    <j-file-dialog-preview-modal ref="modalForm"></j-file-dialog-preview-modal>
  </a-drawer>
</template>

<script>
import { getContractList, getDepartmentList } from '@/api/contract-management/index.js'
import {
  addContractAppro,
  addContractSubmit,
  editContractSubmit,
  contractSubmit,
  editContract,
  getDetail,
} from '@/api/contract-management/ContractApplication.js'
import JFormContainer from '@/components/jeecg/JFormContainer'
import JSelectCustomer from '@/views/scrm/modules/JSelectCustomer'
import JSelectProject from '@/views/scrm/modules/JSelectProject'
import ApprovalSubmit from '@/components/ApprovalDialog/ApprovalSubmit.vue'
import SelectSupplierList from '@/components/SelectPopoverModel'
import JFileDialogPreviewModal from '@/components/jeecg/JFileDialogPreviewModal'
import { Base64 } from 'js-base64'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin'
import { getDictText } from '@/api/api.js'
import { downFile, getAction } from '@/api/manage'
import { simpleDebounce, throttle } from '@/utils/util'
export default {
  mixins: [TableListMixin],
  components: {
    JSelectCustomer,
    JSelectProject,
    ApprovalSubmit,
    JFormContainer,
    SelectSupplierList,
    JFileDialogPreviewModal,
  },
  data() {
    return {
      // 开关
      visible: false,
      // 是否禁用
      disableSubmit: false,
      approvalLoading: false,
      okLoading: false,
      // 标题
      title: '详情',
      type: 0,
      // 表单配置
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
      disableMixinCreated: true,
      // 表单参数
      formParams: {
        departIds: this.$store.getters.userInfo.departIds, //当前部门id
        dept: this.$store.getters.userInfo.orgCodeTxt, //部门名称
        phone: this.$store.getters.userInfo.phone, // 当前电话
        people: this.$store.getters.userInfo.realname, // 当前人
      },
      // 上传地址
      uploadUrl: window._CONFIG['domianURL'] + '/sys/upload/uploadMinio',
      // 上传请求头
      headers: { 'X-Access-Token': this.$ls.get('Access-Token') },
      // 图片上传列表
      fileUrl: [],
      // 图片处理数据集合
      pictureTempListImage: [],
      activeKey: '1',
      principalPersonList: [], //部门列表
      contractList: [], // 主合同列表
      approvalList: [],
      // 加载动画开关
      loading: false,
      rules: {
        customerId: [{ required: true, message: '请选择关联客户', trigger: 'change' }],
        projectId: [{ required: true, message: '请选择关联项目', trigger: 'change' }],
        contract: [{ required: true, message: '请输入合同名称', trigger: 'blur' }],
        contractType: [{ required: true, message: '请选择合同类型', trigger: 'change' }],
        partnerA: [{ required: true, message: '请输入甲方（需方）', trigger: 'blur' }],
        partnerB: [{ required: true, message: '请输入乙方（供方）', trigger: 'blur' }],
        partnerAPerson: [{ required: true, message: '请输入甲方负责人', trigger: 'blur' }],
        partnerBPerson: [{ required: true, message: '请输入乙方负责人', trigger: 'blur' }],
        partnerAPhone: [
          { required: true, message: '请输入甲方联系方式', trigger: 'blur' },
          // { validator: this.validateMobile },
        ],
        partnerBPhone: [
          { required: true, message: '请输入乙方联系方式', trigger: 'blur' },
          // { validator: this.validateMobile },
        ],
        payee: [{ required: true, message: '请输入收款人', trigger: 'blur' }],
        bank: [{ required: true, message: '请输入开户银行', trigger: 'blur' }],
        bankAccount: [{ required: true, message: '请输入银行账号', trigger: 'blur' }],
        settlementType: [{ required: true, message: '请选择结算方式', trigger: 'change' }],
        totalAmount: [{ required: true, message: '请输入合同总金额', trigger: 'blur' }],
        payCycle: [{ required: true, message: '请输入付款期数', trigger: 'blur' }],
        ticketInfo: [{ required: true, message: '请输入开票信息', trigger: 'blur' }],
        ticketSituation: [{ required: true, message: '请选择开票情况', trigger: 'change' }],
        withList: [{ required: true, message: '请选择发货是否随附发货清单', trigger: 'change' }],
        // breachClause: [{ required: true, message: '请输入违约条款', trigger: 'blur' }],
        isMainContract: [{ required: true, message: '请选择是否主合同', trigger: 'change' }],
        // mainContractId: [{ required: true, message: '请选择主合同', trigger: 'change' }],
        fileUrl: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (this.fileUrl == '') return callback(new Error('请上传合同文件！'))
              callback()
            },
            trigger: 'blur',
          },
        ],
      },
      currnetId: '',
      currnetRow: {},
      columnsSupplier: [
        {
          title: '供应商类型',
          dataIndex: 'trade',
          align: 'center',
          customRender: (value) => getDictText('supplier_type', value),
        },
        {
          title: '供应商名称',
          dataIndex: 'supplier',
          align: 'center',
          ellipsis: true,
        },
        {
          title: '供应商等级',
          dataIndex: 'supplierLevel',
          align: 'center',
          customRender: (value) => getDictText('credit_rating', value),
        },
        {
          title: '所属地区',
          dataIndex: 'city',
          align: 'center',
        },
      ],
      slotParams: {
        supplier: '',
      },
    }
  },
  computed: {
    commentType() {
      return (val) => {
        switch (val) {
          case 1:
            return '待审批'
          case 2:
            return '审批通过'
          case 3:
            return '审批不通过'
        }
      }
    },
    approveTypeTag() {
      return (val) => {
        switch (val) {
          case 1:
            return 'orange'
          case 2:
            return 'green'
          case 3:
            return 'red'
        }
      }
    },
  },
  methods: {
    getDictText,
    validateMobile(rule, value, callback) {
      if (!value || new RegExp(/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/).test(value)) {
        callback()
      } else {
        callback('您的手机号码格式不正确!')
      }
    },
    setIcon(val) {
      if (val) {
        return 'el-icon-check'
      } else {
        return 'el-icon-time'
      }
    },
    setColor(val) {
      if (val) {
        return '#2bc418'
      } else {
        return '#b3bdbb'
      }
    },
    // 选择供应商
    onSearch() {
      this.$refs.SelectSupplier.open()
    },
    handleSelectSupplier(data) {
      console.log(data)
      this.$set(this.formParams, 'supplierId', data.selectionRows[0].id)
      this.$set(this.formParams, 'supplierName', data.selectionRows[0].supplier)
    },
    // 切换tab
    handleChange(key) {
      console.log(key)
      this.activeKey = key
      this.formParams = {
        departIds: this.$store.getters.userInfo.departIds, //当前部门id
        dept: this.$store.getters.userInfo.orgCodeTxt, //部门名称
        phone: this.$store.getters.userInfo.phone, // 当前电话
        people: this.$store.getters.userInfo.realname, // 当前人
      }
      if (key == 1) {
        this.getDetail(this.currnetId)
      } else if (key == 2) {
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
    // 客户事件
    handelChangeCustomer(val, rows) {
      console.log(val, rows)
      this.$set(this.formParams, 'customerId', rows[0].id)
      this.$set(this.formParams, 'customerName', rows[0].customName)
    },
    // 项目改变事件
    handelChange(value, rows) {
      this.$set(this.formParams, 'projectId', value)
      this.$set(this.formParams, 'projectName', rows[0].projectName)
      // this.$set(this.formParams, 'companyName', rows[0].customer) //客户名称
      // this.$set(this.formParams, 'customerName', rows[0].liaison) //联系人
      // this.$set(this.formParams, 'customerPhone', rows[0].phone) //联系电话
    },
    // 获取主合同列表
    getContractList() {
      getContractList().then((res) => {
        if (res.success) {
          this.contractList = res.result
        }
      })
    },
    refreshAndClose() {
      this.close()
      this.$emit('refresh')
    },
    // 2通过/1不通过
    handleApprovalSub(type) {
      this.$refs.aprovalForm.type = type
      this.$refs.aprovalForm.open(type, this.currnetRow)
    },
    close() {
      this.visible = false
      // 重置表单
      this.$refs.ruleForm.resetFields()
      this.formParams = {
        departIds: this.$store.getters.userInfo.departIds, //当前部门id
        dept: this.$store.getters.userInfo.orgCodeTxt, //部门名称
        phone: this.$store.getters.userInfo.phone, // 当前电话
        people: this.$store.getters.userInfo.realname, // 当前人
      }
      this.fileUrl = []
      this.pictureTempListImage = []
      this.contractList = []
      this.currnetRow = {}
      this.activeKey = '1'
      this.currnetId = ''
      this.approvalList = []
    },
    open() {
      this.getDepartmentList()
      this.getContractList()
      this.visible = true
    },
    add() {
      this.type = 0
      this.open()
    },
    edit(record) {
      this.type = 1
      this.currnetId = record.id
      this.currnetRow = record
      this.getDetail(record.id)
      this.open()
    },
    detail(record) {
      this.type = 2
      this.currnetId = record.id
      this.currnetRow = record
      this.getDetail(record.id)
      this.open()
    },
    // 合同审批
    approvalDetail(record) {
      this.type = 3
      this.currnetId = record.typeId
      this.getDetail(record.typeId)
      this.currnetRow = record
      this.disableSubmit = true
      this.open()
    },
    getDetail(id) {
      getDetail(id).then((res) => {
        if (res.success) {
          this.formParams = res.result
          this.approvalList = res.result.approves

          this.formParams.dept = res.result.applyInfo.dept
          this.formParams.people = res.result.applyInfo.people
          this.formParams.phone = res.result.applyInfo.phone

          // let fileUrl = res.result.fileUrl ? res.result.fileUrl.split(',') : []
          this.fileUrl = res.result.fileUrl.map((item, index) => {
            let i = index + 1
            return {
              uid: item.uid,
              status: 'done',
              name: item.name,
              url: item.url,
            }
          })
        }
      })
    },
    // 文件上传
    handleUploadChange(info) {
      let fileList = [...info.fileList]
      if (info.file.status === 'uploading') {
        this.fileUrl = fileList
      }
      if (info.file.status === 'done') {
        let result = info.file.response.result
        this.pictureTempListImage.push({
          uid: result.id,
          status: 'done',
          name: result.fileName,
          url: result.url,
        })
        this.fileUrl = this.pictureTempListImage
        this.formParams.fileUrl = this.pictureTempListImage
      }
    },
    // 移除
    handleRemove(file) {
      // this.pictureTempListImage.splice(this.pictureTempListImage.indexOf(file), 1)
      // this.formParams.fileUrl = this.pictureTempListImage.map((item) => item.url).toString()
      const index = this.fileUrl.indexOf(file)
      const newFileList = this.fileUrl.slice()
      newFileList.splice(index, 1)
      this.fileUrl = newFileList
      const newUploadList = this.formParams.fileUrl.slice()
      newUploadList.splice(index, 1)
      this.formParams.fileUrl = newUploadList
      this.pictureTempListImage = newUploadList
    },
    downloadFile(file) {
      getAction('sys/upload/preview', { id: file.uid }).then((res) => {
        if (res.success) {
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = res.result
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link) //下载完成移除元素
        } else {
          this.$message.error('文件下载失败')
        }
      })
    },
    async handlePreview(file) {
      console.log(file)
      let that = this
      getAction('sys/upload/preview', { id: file.uid }).then((res) => {
        if (res.success) {
          if (res && res.result) {
            let url = window._CONFIG['onlinePreviewDomainURL'] + '?url=' + encodeURIComponent(Base64.encode(res.result))
            console.log(url)
            that.$refs.modalForm.open(url)
          }
        } else {
          this.$message.error('文件预览失败')
        }
      })
    },

    // 审批
    handleApproval() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let applyInfo = {
            dept: this.formParams.dept,
            people: this.formParams.people,
            phone: this.formParams.phone,
            peopleId: this.$store.getters.userInfo.id,
          }
          let data = {
            ...this.formParams,
            applyInfo: applyInfo,
            // department: this.$store.getters.userInfo.orgCodeTxt, //部门名称
          }
          this.approvalLoading = true
          contractSubmit(data)
            .then((res) => {
              if (res.success) {
                this.$message.success(res.message)
                this.$emit('refresh')
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
        } else {
          return false
        }
      })
    },
    //提交
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        console.log('--', this.formParams.type)
        if (valid) {
          let applyInfo = {
            dept: this.formParams.dept,
            people: this.formParams.people,
            phone: this.formParams.phone,
            peopleId: this.$store.getters.userInfo.id,
          }
          let data = {
            ...this.formParams,
            applyInfo: applyInfo,
          }
          console.log('data', data)
          if (this.type == 0) {
            this.okLoading = true
            addContractAppro(data)
              .then((res) => {
                if (res.success) {
                  this.$message.success(res.message)
                  this.$emit('refresh')
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
            this.okLoading = true
            editContract(data)
              .then((res) => {
                if (res.success) {
                  this.$message.success(res.message)
                  this.$emit('refresh')
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
          }
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
  padding: 10px;
  margin: 20px 0;
  font-weight: 600;
}
.content {
  padding: 0 20px;
  margin: 20px 0;
}
</style>
