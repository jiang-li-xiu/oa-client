// 不用了
<template>
  <a-drawer
    :title="title"
    :maskClosable="true"
    width="1200"
    placement="right"
    :closable="true"
    @close="close"
    :visible="visible"
    style="overflow: auto; padding-bottom: 53px"
  >
    <a-spin tip="加载中..." :spinning="loading">
      <a-form-model ref="ruleForm" :model="formParams" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row>
          <a-col :span="24" class="title">合同信息</a-col>
          <a-col :span="12">
            <a-form-model-item label="客户名称" prop="customerName">
              <a-input v-model="formParams.customerName" placeholder="请输入客户名称" :disabled="disableSubmit" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="项目名称" prop="projectName">
              <a-input v-model="formParams.projectName" placeholder="请输入项目名称" :disabled="disableSubmit" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="合同名称" prop="contract">
              <a-input v-model="formParams.contract" placeholder="请输入合同名称" :disabled="disableSubmit" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="合同类型" prop="contractType">
              <j-dict-select-tag
                v-model="formParams.contractType"
                placeholder="请选择合同类型"
                dictCode="contract_type"
                :disabled="disableSubmit"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="合同编号" prop="contractCode">
              <a-input v-model="formParams.contractCode" placeholder="请输入合同编号" disabled />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="合同负责人" prop="principalPersonId">
              <a-tree-select
                v-model="formParams.principalPersonId"
                show-search
                style="width: 100%"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                placeholder="请选择"
                allow-clear
                tree-default-expand-all
                :disabled="disableSubmit"
                @change="handlePerson"
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
            <a-form-model-item label="总金额" prop="totalAmount">
              <a-input-number
                style="width: 100%"
                v-model="formParams.totalAmount"
                placeholder="请输入总金额"
                :min="0"
                :precision="2"
                :disabled="disableSubmit"
              />
            </a-form-model-item>
          </a-col>

          <a-col :span="12">
            <a-form-model-item label="结算方式" prop="settlementType">
              <j-dict-select-tag
                v-model="formParams.settlementType"
                placeholder="请选择结算方式"
                dictCode="payment_method"
                :disabled="disableSubmit"
              />
            </a-form-model-item>
          </a-col>

          <a-col :span="12">
            <a-form-model-item label="合同甲方" prop="partyA">
              <a-input v-model="formParams.partyA" placeholder="请输入合同甲方" :disabled="disableSubmit" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="合同乙方" prop="partyBId">
              <j-select-customer
                v-model="formParams.partyBId"
                :multi="false"
                placeholder="请选择合同乙方"
                @change="handelChangeCustomer"
                :disabled="disableSubmit"
              ></j-select-customer>
              <!-- <a-input v-model="formParams.partyB" placeholder="请输入合同乙方" :disabled="disableSubmit" /> -->
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="甲方负责人" prop="partyAPerson">
              <a-input v-model="formParams.partyAPerson" placeholder="请输入甲方负责人" :disabled="disableSubmit" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="乙方负责人" prop="partyBPerson">
              <a-input v-model="formParams.partyBPerson" placeholder="请输入乙方负责人" :disabled="disableSubmit" />
            </a-form-model-item>
          </a-col>

          <a-col :span="12">
            <a-form-model-item label="合同开始日期" prop="startTime">
              <j-date
                v-model="formParams.startTime"
                :showTime="true"
                dateFormat="YYYY-MM-DD"
                :style="{ width: '410px' }"
                placeholder="请选择合同开始日期"
                :disabled="disableSubmit"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="合同结束日期" prop="endTime">
              <j-date
                v-model="formParams.endTime"
                :showTime="true"
                dateFormat="YYYY-MM-DD"
                :disabled="disableSubmit"
                placeholder="请选择合同结束日期"
                :style="{ width: '410px' }"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="签订日期" prop="signTime">
              <j-date
                v-model="formParams.signTime"
                :showTime="true"
                dateFormat="YYYY-MM-DD"
                :style="{ width: '410px' }"
                placeholder="请选择签订日期"
                :disabled="disableSubmit"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="关联项目" prop="projectId">
              <j-select-project
                v-model="formParams.projectId"
                :multi="false"
                :disabled="disableSubmit"
              ></j-select-project>
              <!-- <a-select
                v-model="formParams.projectId"
                :disabled="disableSubmit"
                placeholder="请选择关联项目"
                allowClear
              >
                <a-select-option v-for="item in projectList" :key="item.id" :value="item.id">
                  {{ item.companyName }}
                </a-select-option>
              </a-select> -->
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="是否主合同" prop="isMainContract">
              <a-radio-group v-model="formParams.isMainContract" :default-value="1" :disabled="disableSubmit">
                <a-radio :value="1"> 是 </a-radio>
                <a-radio :value="0"> 否 </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="主合同" prop="mainContractId">
              <a-select
                v-model="formParams.mainContractId"
                :disabled="disableSubmit"
                placeholder="请选择主合同"
                allowClear
              >
                <a-select-option v-for="item in contractList" :key="item.id" :value="item.id">
                  {{ item.contract }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12" v-if="this.type !== 0">
            <a-form-model-item label="合同状态" prop="status">
              <a-select v-model="formParams.status" :disabled="disableSubmit" placeholder="请选择合同状态" allowClear>
                <a-select-option :value="1">执行中 </a-select-option>
                <a-select-option :value="2">已结束 </a-select-option>
                <a-select-option :value="3">作废终止 </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item
              label="合同摘要"
              prop="abstractInfo"
              :label-col="{ span: 3 }"
              :wrapper-col="{ span: 21 }"
            >
              <a-textarea
                v-model="formParams.abstractInfo"
                placeholder="请输入合同摘要"
                :rows="3"
                :disabled="disableSubmit"
              />
            </a-form-model-item>
          </a-col>

          <a-col :span="24">
            <a-form-model-item label="合同文件" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }" prop="fileUrl">
              <div class="upload" v-if="this.fileUrl.length">
                <span>{{ this.formParams.fileName }}</span>
                <span>{{ this.formParams.fileSize }}</span>
                <span>{{ $store.getters.userInfo.realname }}</span>
                <span>{{ this.formParams.fileUploadTime }}</span>
              </div>
              <a-upload
                :action="uploadUrl"
                :multiple="true"
                :file-list="fileUrl"
                :headers="headers"
                :disabled="disableSubmit"
                @change="handleUploadChange"
              >
                <a-button v-if="fileUrl.length < 1" type="primary" icon="upload" :disabled="disableSubmit"
                  >上传
                </a-button>
              </a-upload>
              <!-- <div class="upload" v-for="(item, i) in uploadData" :key="i">
                <span>{{ item.fileName }}</span>
                <span>{{ item.fileSize }}</span>
                <span>{{ $store.getters.userInfo.realname }}</span>
                <span>{{ moment(item.fileUploadTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
              </div> -->
            </a-form-model-item>
          </a-col>

          <a-col :span="24">
            <a-form-model-item label="备注" prop="remark" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
              <a-textarea v-model="formParams.remark" placeholder="请输入备注" :rows="3" :disabled="disableSubmit" />
            </a-form-model-item>
          </a-col>

          <!--  <a-col :span="24" class="title">合同收款</a-col>
          <template v-if="this.type !== 2">
            <a-col :span="24">
              <j-vxe-table
                class="table"
                ref="contractTable"
                toolbar
                :key="this.type"
                row-selection
                bordered
                keep-source
                :maxHeight="580"
                :loading="loading"
                :dataSource="tableData"
                :columns="this.type == 0 ? columns : columnsEdit"
                :asyncRemove="true"
                :toolbarConfig="toolbarConfig"
                style="margin-top: 8px"
                @valueChange="handleValueChange"
                @remove="handleTableRemove"
              >
                <template #action="props">
                  <!~~ 数据发生编辑时显示 ~~>
                  <a-space :size="12" v-if="props.row.is_edit">
                    <a-button type="primary" @click="save(props)">保存</a-button>
                    <a-popconfirm
                      title="数据未保存，取消会重置数据，是否继续？"
                      ok-text="确定"
                      cancel-text="取消"
                      @confirm="handleRowCancel(props)"
                    >
                      <a-button>取消</a-button>
                    </a-popconfirm>
                  </a-space>
                  <!~~ 默认显示 ~~>
                  <div v-else>
                    <a-popconfirm
                      title="确定要删除这项数据吗?"
                      ok-text="确定"
                      cancel-text="取消"
                      @confirm="handleDelete(props)"
                    >
                      <a href="javascript:;" type="danger">删除</a>
                    </a-popconfirm>
                    <a-divider type="vertical" />
                    <a href="javascript:;" type="primary" @click="handleCopy(props)">复制</a>
                  </div>
                </template>
              </j-vxe-table>
            </a-col>
          </template>
          <!~~ 详情展示 ~~>
          <templ v-else>
            <a-col :span="24">
              <a-table
                :columns="columnsDetail"
                rowKey="id"
                :data-source="tableData"
                :pagination="false"
                bordered
                size="small"
                :scroll="{ x: true }"
                :loading="loading"
              >
              </a-table>
            </a-col>
          </templ -->
        </a-row>
      </a-form-model>
    </a-spin>

    <div class="drawer-bootom-button" v-if="this.type !== 2">
      <a-button @click="close" style="margin-right: 0.8rem">取消</a-button>
      <a-button @click="handleOk" type="primary" :loading="loading">保存</a-button>
    </div>

    <!-- 待归档底部按钮 -->
    <div class="drawer-bootom-button" v-if="is_archives">
      <a-button @click="close" style="margin-right: 0.8rem">取消</a-button>
      <a-button @click="handleArchives" type="primary" :loading="loading">归档</a-button>
    </div>
  </a-drawer>
</template>

<script>
import JSelectProject from "@/views/scrm/modules/JSelectProject"
import JSelectCustomer from "@/views/scrm/modules/JSelectCustomer"
// API
import {
  addContract,
  editContract,
  getDetail,
  postArchive,
  getContractList,
  getDepartmentList,
  getProjectList,
} from "@/api/contract-management/index.js"
import { JVXETypes } from "@/components/jeecg/JVxeTable"
import moment from "dayjs"
export default {
  components: { JSelectProject, JSelectCustomer },
  props: {
    // 待归档底部按钮
    is_archives: {
      type: Boolean,
      default: false,
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
      // 标题
      title: "新增",
      // 当前模式 0-添加 1-编辑 2-详情
      type: 0,
      // 表单配置
      labelCol: { span: 6 },
      wrapperCol: { span: 17 },
      // 上传地址
      uploadUrl: process.env.VUE_APP_API_BASE_URL + "/sys/common/upload",
      // 上传请求头
      headers: {
        "X-Access-Token": this.$ls.get("Access-Token"),
      },
      // 表单参数
      formParams: {
        fileUrl: "",
        isMainContract: 1, //是否主合同
        //合同收款
        collection: [],
      },
      fileUrl: [], //合同文件上传列表
      // 新增表格配置
      columns: [
        {
          title: "批次",
          key: "batch",
          type: JVXETypes.input,
          width: "18%",
          defaultValue: "",
          align: "center",
          placeholder: "请输入${title}",
          validateRules: [
            {
              required: true, // 必填
              message: "请输入${title}", // 显示的文本
            },
          ],
        },
        {
          title: "收款条件",
          key: "collectionConditions",
          type: JVXETypes.input,
          width: "18%",
          defaultValue: "",
          align: "center",
          placeholder: "请输入${title}",
          validateRules: [
            {
              required: true, // 必填
              message: "请输入${title}", // 显示的文本
            },
          ],
        },
        {
          title: "收款比例（%）",
          key: "collectionRatio",
          type: JVXETypes.inputNumber,
          width: "18%",
          defaultValue: "",
          align: "center",
          placeholder: "请输入${title}",
          validateRules: [
            {
              required: true, // 必填
              message: "请输入${title}", // 显示的文本
            },
          ],
        },
        {
          title: "应收金额",
          key: "racountFigure",
          type: JVXETypes.inputNumber,
          width: "18%",
          defaultValue: "",
          align: "center",
          placeholder: "请输入${title}",
          validateRules: [
            {
              required: true, // 必填
              message: "请输入${title}", // 显示的文本
            },
          ],
        },
        {
          title: "预计收款日期",
          key: "expectCollectionTime",
          type: JVXETypes.date,
          width: "18%",
          // 下拉选项
          dictCode: "expectCollectionTime",
          allowInput: true,
          align: "center",
          placeholder: "请选择",
        },
        {
          title: "操作",
          key: "action",
          type: JVXETypes.slot,
          align: "center",
          slotName: "action",
        },
      ],
      // 编辑表格配置
      columnsEdit: [
        {
          title: "收款编号",
          key: "collectionCode",
          type: JVXETypes.input,
          width: "9%",
          defaultValue: "",
          align: "center",
          disabled: true,
          placeholder: "自动生成${title}",
        },
        {
          title: "批次",
          key: "batch",
          type: JVXETypes.input,
          width: "9%",
          defaultValue: "",
          align: "center",
          placeholder: "请输入${title}",
        },
        {
          title: "收款条件",
          key: "collectionConditions",
          type: JVXETypes.input,
          width: "9%",
          defaultValue: "",
          align: "center",
          placeholder: "请输入${title}",
        },
        {
          title: "收款比例（%）",
          key: "collectionRatio",
          type: JVXETypes.inputNumber,
          width: "9%",
          defaultValue: "",
          align: "center",
          placeholder: "请输入${title}",
        },
        {
          title: "应收金额",
          key: "racountFigure",
          type: JVXETypes.inputNumber,
          width: "9%",
          defaultValue: "",
          align: "center",
          placeholder: "请输入${title}",
        },
        {
          title: "已收款金额",
          key: "receivedFigure",
          type: JVXETypes.inputNumber,
          width: "9%",
          defaultValue: "",
          align: "center",
          placeholder: "请输入${title}",
        },
        {
          title: "待收款金额",
          key: "notFigure",
          type: JVXETypes.inputNumber,
          width: "9%",
          defaultValue: "",
          align: "center",
          placeholder: "请输入${title}",
        },
        {
          title: "预计收款日期",
          key: "expectCollectionTime",
          type: JVXETypes.date,
          width: "9%",
          // 下拉选项
          dictCode: "expectCollectionTime",
          allowInput: true,
          align: "center",
          placeholder: "请选择",
        },
        {
          title: "收款状态",
          key: "status",
          type: JVXETypes.select,
          width: "9%",
          // 下拉选项
          options: [
            { title: "待收款", value: 1 },
            { title: "已收款", value: 2 },
          ],
          // allowInput: true,
          align: "center",
          placeholder: "请选择${title}",
        },
        {
          title: "操作",
          key: "action",
          type: JVXETypes.slot,
          align: "center",
          slotName: "action",
        },
      ],
      // 详情表格
      columnsDetail: [
        {
          title: "收款编号",
          dataIndex: "collectionCode",
          align: "center",
          width: "11%",
        },
        {
          title: "批次",
          dataIndex: "batch",
          align: "center",
          width: "11%",
        },
        {
          title: "收款条件",
          dataIndex: "collectionConditions",
          align: "center",
          width: "11%",
        },
        {
          title: "收款比例（%）",
          dataIndex: "collectionRatio",
          align: "center",
          width: "11%",
        },
        {
          title: "应收金额",
          dataIndex: "racountFigure",
          align: "center",
          width: "11%",
        },
        {
          title: "已收款金额",
          dataIndex: "receivedFigure",
          align: "center",
          width: "11%",
        },
        {
          title: "待收款金额",
          dataIndex: "notFigure",
          align: "center",
          width: "11%",
        },
        {
          title: "预计收款日期",
          dataIndex: "expectCollectionTime",
          align: "center",
          width: "11%",
        },
        {
          title: "收款状态",
          dataIndex: "status",
          align: "center",
          width: "11%",
          customRender(text) {
            // （1-待收款，2-已收款）
            return text == 2 ? "已收款" : "待收款"
          },
        },
      ],
      // 表格数据
      tableData: [],
      // 当前编辑的数据旧值
      currentRowOldData: [],
      // 表单验证规则
      rules: {
        contract: [{ required: true, message: "请输入合同名称", trigger: "blur" }],
        contractType: [{ required: true, message: "请选择合同类型", trigger: "change" }],
        principalPersonId: [{ required: true, message: "请输入合同负责人", trigger: "change" }],
        totalAmount: [{ required: true, message: "请输入总金额", trigger: "blur" }],
        settlementType: [{ required: true, message: "请选择结算方式", trigger: "change" }],
        partyA: [{ required: true, message: "请输入合同甲方", trigger: "blur" }],
        partyBId: [{ required: true, message: "请选择合同乙方", trigger: "change" }],
        partyAPerson: [{ required: true, message: "请输入甲方负责人", trigger: "blur" }],
        partyBPerson: [{ required: true, message: "请输入乙方负责人", trigger: "blur" }],
        signTime: [{ required: true, message: "请选择签订日期", trigger: "change" }],
        projectId: [{ required: true, message: "请选择关联项目", trigger: "change" }],
        phone: [{ required: true, message: "请输入手机号", trigger: "blur" }, { validator: this.validateMobile }],
      },
      contractList: [], // 主合同列表
      projectList: [], // 关联项目列表
      principalPersonList: [], // 合同负责人列表
      contractId: "", //当前行的id
      uploadData: [], // 上传的大小、时间数据
      toolbarConfig: {
        // add 新增按钮；remove 删除按钮；clearSelection 清空选择按钮
        btn: ["add"],
      },
    }
  },

  methods: {
    moment,
    validateMobile(rule, value, callback) {
      if (!value || new RegExp(/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/).test(value)) {
        callback()
      } else {
        callback("您的手机号码格式不正确!")
      }
    },
    handelChangeCustomer(val, rows) {
      console.log(val, rows)
      this.formParams.partyB = rows[0].customName //合同乙方名称
    },

    // 打开弹窗
    open() {
      this.visible = true
      this.getContractList()
      this.getDepartmentList()
      this.getProjectList()
    },

    // 关闭弹窗，点击遮罩层或右上角叉或取消按钮时触发
    close() {
      this.visible = false
      // 重置表单
      this.$refs.ruleForm.resetFields()
      this.formParams = {
        isMainContract: 1, //是否主合同
      }
      this.fileUrl = []
      this.tableData = []
      this.uploadData = []
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
      this.contractId = record.id
      this.type = 2
      this.getDetail(record.id)
      this.open()
    },

    handlePerson(value, label, extra) {
      this.formParams.principalPersonName = label.toString()
    },

    // 获取详情
    getDetail(id) {
      getDetail(id).then((res) => {
        console.log(res)
        if (res.success) {
          this.formParams = res.result
          this.tableData = res.result.collection ? res.result.collection : []
          // 填充上传列表
          let fileUrl = res.result.fileUrl ? res.result.fileUrl.split(",") : []
          this.fileUrl = fileUrl.map((item, index) => {
            return {
              uid: index,
              status: "done",
              name: this.formParams.fileName,
              url: item,
            }
          })
        }
      })
    },

    // 获取主合同列表
    getContractList() {
      getContractList().then((res) => {
        if (res.success) {
          this.contractList = res.result.records
        }
      })
    },

    // 获取关联项目列表
    getProjectList() {
      getProjectList().then((res) => {
        if (res.success) {
          this.projectList = res.result.records
        }
      })
    },

    // 获取部门树形
    getDepartmentList() {
      getDepartmentList().then((res) => {
        if (res.success) {
          // console.log(res)
          this.principalPersonList = res.result
        }
      })
    },

    // 复制
    handleCopy(props) {
      console.log("复制---", props)
      // 获取行数据
      const { row } = props
      let data = {
        // id: row.id++,
        is_edit: row.is_edit,
        batch: row.batch,
        // collectionCode: row.collectionCode,
        collectionConditions: row.collectionConditions,
        collectionRatio: row.collectionRatio,
        racountFigure: row.racountFigure,
        receivedFigure: row.receivedFigure,
        notFigure: row.notFigure,
        expectCollectionTime: row.expectCollectionTime,
        status: row.status,
      }
      this.tableData.push(data)
      console.log("复制this.tableData", this.tableData)
    },

    // 表格行数据发生改变时触发
    handleValueChange(event) {
      console.log("发生变化---", event)
      // 获取行数据和对应下标值
      const { row, rowIndex } = event

      // 当第一次编辑时保存旧值到另一个数组和原表格数组对应下标的位置上
      if (!row.is_edit) {
        // 保存对应值
        this.currentRowOldData[rowIndex] = { ...row }
        // 获取当前改变的key
        const { key } = event.col
        // 替换为旧值
        this.currentRowOldData[rowIndex][key] = event.oldValue
        // 添加属性，控制保存按钮显示，表示当前已被编辑
        row.is_edit = true
      }
      console.log("发生变化tableData", this.tableData)
    },

    // 取消编辑，恢复原来数据
    handleRowCancel(props) {
      console.log("取消编辑---", props)
      // 获取行数据和对应下标值
      const { rowIndex } = props
      // 判断该数据是否已经存在
      if (!this.tableData[rowIndex]) {
        // 不存在就删除
        this.handleDelete(props)
      } else {
        // 已经存在则就是恢复原来数据
        this.$set(this.tableData, rowIndex, this.currentRowOldData[rowIndex])
      }
      console.log("取消编辑tableData", this.tableData)
    },

    // 保存
    save(props) {
      console.log("保存--", props, this.tableData)
      this.$refs.contractTable.validateTable().then((errMap) => {
        if (!errMap) {
          // 获取对应下标
          const { rowIndex } = props

          // 判断当前行是否为编辑或新增
          if (this.tableData[rowIndex]) {
            // 存在，则为编辑
            this.tableData[rowIndex].is_edit = false
            console.log("编辑------tableData", this.tableData)
          } else {
            // 不存在，则为新增
            this.tableData.push(props.row)
            this.tableData[rowIndex].is_edit = false
            console.log("新增-------tableData", this.tableData)
          }
        }
      })
    },

    // 处理删除某一行
    handleDelete(props) {
      // console.log(props)
      // 根据id删除该行
      // this.$refs.contractTable.removeRowsById(props.rowId)
      this.tableData.splice(props.rowIndex, 1)
      console.log(this.tableData)
    },

    // 选中时，点击删除确认后触发
    handleTableRemove({ deleteRows, confirmRemove }) {
      // 获取需要删除的id
      // const ids = deleteRows.map((item) => item.id)
      // 执行回调，删除表格对应的数据
      // confirmRemove()
    },

    // 上传文件改变时的状态
    handleUploadChange(info) {
      let fileList = [...info.fileList]

      // 从响应中读取并显示文件链接
      fileList = fileList.map((file) => {
        if (file.response) {
          // 组件将显示文件url链接
          file.url = file.response.message
        }
        return file
      })
      // 保存
      this.fileUrl = fileList
      // 保存url
      this.formParams.fileUrl = fileList.map((file) => file.url).toString()

      //文件名称大小时间
      this.uploadData = fileList.map((item) => {
        // 处理文件大小格式
        if (item.size / 1024 < 1024) {
          item.size = Math.ceil(item.size / 1024) + "kb" //向上取整
        } else if (item.size / 1024 >= 1024) {
          item.size = (item.size / (1024 * 1024)).toFixed(2) + "M" //四舍五入
        }

        this.formParams.fileName = item.name
        this.formParams.fileSize = item.size
        this.formParams.fileUploadTime = moment().format("YYYY-MM-DD HH:mm:ss")

        return { fileName: item.name, fileSize: item.size, fileUploadTime: moment().format("YYYY-MM-DD HH:mm:ss") }
      })
      // 移除表单验证结果
      // this.$refs.ruleForm.clearValidate(prop)
    },

    // 归档
    handleArchives() {
      let that = this
      this.$confirm({
        title: "确认归档",
        content: "确认是否进行此操作?",
        onOk: function () {
          that.loading = true
          postArchive({ id: that.contractId })
            .then((res) => {
              if (res.success) {
                that.$message.success("归档成功")
                that.$emit("refresh")
              } else {
                that.$message.warning(res.message)
              }
              that.close()
            })
            .finally(() => {
              that.loading = false
            })
        },
      })
    },

    //提交
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // 如果没有上传文件，清除名称大小等信息
          if (this.fileUrl == "") {
            this.formParams.fileName = ""
            this.formParams.fileSize = ""
            this.formParams.fileUploadTime = ""
          }
          let data = {
            ...this.formParams,
            collection: this.tableData,
          }
          console.log(data)
          // 添加
          if (this.type == 0) {
            addContract(data).then((res) => {
              if (res.success) {
                this.$message.success(res.message)
                this.$emit("refresh")
              } else {
                this.$message.error(res.message)
              }
              this.close()
            })
          } else if (this.type == 1) {
            // 编辑
            editContract(data).then((res) => {
              if (res.success) {
                this.$message.success(res.message)
                this.$emit("refresh")
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

<style lang="less" scoped>
.title {
  background-color: #f8faff;
  padding: 10px;
  margin-bottom: 10px;
  font-weight: 600;
}
.upload {
  display: flex;
  border: 1px solid #c5c6c7;
  span {
    flex: 1;
    text-align: center;
    border-right: 1px solid #c5c6c7;
  }
  :last-child {
    border: none;
  }
}
</style>
