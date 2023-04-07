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
    <a-spin tip="加载中..." :spinning="loading">
      <a-form-model ref="ruleForm" :model="formParams" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <!-- 项目立项申请 -->
        <a-tabs default-active-key="1" @change="handleChange" :activeKey="activeKey">
          <a-tab-pane key="1" tab="项目立项申请">
            <a-row>
              <a-col :span="24" class="title">申请信息</a-col>
              <a-col :span="8">
                <a-form-model-item label="申请部门" prop="profitsDepartment">
                  <a-tree-select
                    v-model="formParams.profitsDepartment"
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
              <a-col :span="8">
                <a-form-model-item label="申请人" prop="profitsPeopleName">
                  <a-input v-model="formParams.profitsPeopleName" placeholder="请输入申请人" disabled />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="联系电话" prop="profitsPeoplePhone">
                  <a-input v-model="formParams.profitsPeoplePhone" placeholder="请输入联系电话" disabled />
                </a-form-model-item>
              </a-col>

              <a-col :span="24" class="title">申请内容</a-col>
              <a-col :span="8">
                <a-form-model-item label="客户名称" prop="customerId">
                  <j-select-customer
                    v-model="formParams.customerId"
                    :multi="false"
                    @change="handelChangeCustomer"
                    :disabled="disableSubmit"
                  >
                  </j-select-customer>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="项目名称" prop="projectId">
                  <j-select-project
                    v-model="formParams.projectId"
                    :multi="false"
                    @change="handelChange"
                    :disabled="disableSubmit"
                  ></j-select-project>
                </a-form-model-item>
              </a-col>
              <!-- <a-col :span="8">
                <a-form-model-item label="联系人" prop="customerName">
                  <a-input v-model="formParams.customerName" placeholder="请输入联系人" />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="联系电话" prop="customerPhone">
                  <a-input v-model="formParams.customerPhone" placeholder="请输入联系电话" />
                </a-form-model-item>
              </a-col> -->
              <a-col :span="8">
                <a-form-model-item label="联系人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="liaison">
                  <!-- <a-input v-model="model.liaison" placeholder="请输入客户联系人" ></a-input> -->
                  <a-select
                    v-model="formParams.liaison"
                    show-search
                    placeholder="请选择"
                    @change="changeLiaison"
                    :options="liaison"
                    :filter-option="true"
                  ></a-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="联系方式" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="phone">
                  <a-input
                    v-model="formParams.phone"
                    placeholder="请输入客户联系方式"
                    :max-length="11"
                    :read-only="true"
                  ></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="负责人" prop="inCharge">
                  <a-input v-model="formParams.inCharge" placeholder="请输入负责人" />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="项目地点" prop="projectAddr">
                  <a-input v-model="formParams.projectAddr" placeholder="请输入项目地点" />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="项目总额" prop="amount">
                  <a-input v-model="formParams.amount" placeholder="请输入项目总额" />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="项目概算" prop="budget">
                  <a-input v-model="formParams.budget" placeholder="请输入项目概算" />
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item
                  label="概要说明"
                  prop="outlines"
                  :label-col="{ span: 2 }"
                  :wrapper-col="{ span: 17 }"
                >
                  <a-textarea v-model="formParams.outlines" placeholder="请输入概要说明" :rows="5" />
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-tab-pane>

          <!-- 项目费用申请 -->
          <a-tab-pane key="3" tab="项目费用申请" force-render>
            <a-row>
              <a-col :span="24" class="title">申请信息</a-col>
              <a-col :span="8">
                <a-form-model-item label="申请部门" prop="profitsDepartment">
                  <a-tree-select
                    v-model="formParams.profitsDepartment"
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
              <a-col :span="8">
                <a-form-model-item label="申请人" prop="profitsPeopleName">
                  <a-input v-model="formParams.profitsPeopleName" placeholder="请输入申请人" disabled />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="联系电话" prop="profitsPeoplePhone">
                  <a-input v-model="formParams.profitsPeoplePhone" placeholder="请输入联系电话" disabled />
                </a-form-model-item>
              </a-col>
              <a-col :span="24" class="title">申请内容</a-col>
              <a-col :span="8">
                <a-form-model-item label="客户名称" prop="customerId">
                  <j-select-customer
                    v-model="formParams.customerId"
                    :multi="false"
                    @change="handelChangeCustomer"
                    :disabled="disableSubmit"
                  >
                  </j-select-customer>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="项目名称" prop="projectId">
                  <j-select-project
                    v-model="formParams.projectId"
                    :multi="false"
                    @change="handelChange"
                    :disabled="disableSubmit"
                  ></j-select-project>
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item
                  label="项目费用表"
                  prop="amount"
                  :label-col="{ span: 2 }"
                  :wrapper-col="{ span: 17 }"
                >
                  <a-upload
                    :action="uploadUrl"
                    :multiple="true"
                    :file-list="applyOrderFormUrl"
                    :headers="headers"
                    :disabled="disableSubmit"
                    @change="handleUploadChangeOrder"
                  >
                    <a v-if="applyOrderFormUrl.length < 1" type="primary" icon="upload" :disabled="disableSubmit"
                      >上传文件
                    </a>
                  </a-upload>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-tab-pane>

          <!-- 审批记录 -->
          <a-tab-pane key="3" tab="审批记录" v-if="this.type == 2 || this.type == 3">
            <a-row>
              <a-col :span="24" class="title" :style="{ marginBottom: '30px' }">审批记录</a-col>
              <a-col :span="24">
                <div class="block" v-if="approvalList && approvalList.length > 0">
                  <a-timeline>
                    <a-timeline-item
                      v-for="(item, index) in approvalList"
                      :key="index"
                      :icon="setIcon(item.approverTime)"
                      :color="setColor(item.approverTime)"
                    >
                      <p style="font-weight: 700">{{ item.approverOperation }}</p>
                      <a-card class="box-card" shadow="hover">
                        <a-descriptions :column="4" :labelStyle="{ 'font-weight': 'bold' }">
                          <a-descriptions-item label="操作人">{{ item.approverName || '-' }}</a-descriptions-item>
                          <a-descriptions-item label="申请时间">{{ item.applyTime || '-' }}</a-descriptions-item>
                          <a-descriptions-item label="状态">{{ commentType(item.status) || '-' }}</a-descriptions-item>
                          <a-descriptions-item label="操作时间">{{ item.approverTime || '-' }}</a-descriptions-item>
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
        <a-button @click="handleApproval" type="primary" style="margin-right: 0.8rem">提交审批 </a-button>
        <a-button @click="handleOk" type="primary" style="margin-right: 0.8rem">保存 </a-button>
      </template>
      <template v-else>
        <a-button
          key="submit"
          type="primary"
          :loading="loading"
          @click="handleApprovalSub(2)"
          style="margin-right: 0.8rem"
        >
          通过
        </a-button>
        <a-button key="back" type="danger" @click="handleApprovalSub(1)" style="margin-right: 0.8rem">不通过 </a-button>
      </template>
      <a-button @click="close" style="margin-right: 0.8rem">取消</a-button>
    </div>
    <ApprovalSubmit ref="aprovalForm" @refreshClose="refreshAndClose"></ApprovalSubmit>
  </a-drawer>
</template>

<script>
import { getDepartmentList } from '@/api/project-management/foreign-price-management/ProjectProfit.js'
import JSelectCustomer from '@/views/scrm/modules/JSelectCustomer'
import JSelectProject from '@/views/scrm/modules/JSelectProject'
import ApprovalSubmit from '@/components/ApprovalDialog/ApprovalSubmit.vue'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin'
import { getDictText } from '@/api/api.js'
import { getAction } from '@/api/manage'
export default {
  mixins: [TableListMixin],
  components: { JSelectCustomer, JSelectProject, ApprovalSubmit },
  data() {
    return {
      // 开关
      visible: false,
      // 是否禁用
      disableSubmit: false,
      // 标题
      title: '详情',
      type: 0,
      // 表单配置
      labelCol: { span: 6 },
      wrapperCol: { span: 17 },
      // 上传地址
      uploadUrl: process.env.VUE_APP_API_BASE_URL + '/sys/common/upload',
      // 上传请求头
      headers: {
        'X-Access-Token': this.$ls.get('Access-Token'),
      },
      applyOrderFormUrl: [],
      pictureTempListMultiOrder: [],
      // 表单参数
      formParams: {
        profitsDepartment: this.$store.getters.userInfo.departIds, //当前部门id
        profitsPeoplePhone: this.$store.getters.userInfo.phone, // 当前电话
        profitsPeopleName: this.$store.getters.userInfo.realname, // 当前人
      },
      disableMixinCreated: true,
      activeKey: '1',
      principalPersonList: [], //部门列表
      liaison: [],
      approvalList: [],
      // 加载动画开关
      loading: false,
      rules: {
        customerId: [{ required: true, message: '请选择客户名称', trigger: 'change' }],
        projectId: [{ required: true, message: '请选择项目名称', trigger: 'change' }],
        customerName: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
        customerPhone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
        inCharge: [{ required: true, message: '请输入负责人', trigger: 'blur' }],
      },
      currnetRow: {},
    }
  },
  methods: {
    getDictText,
    // 切换tab
    handleChange(key) {
      console.log(key)
      this.activeKey = key
      if (key == 2) {
        // this.$refs.quotationForm.getQuotationDetail(this.currnetRow.id)
      }
    },
    // getQuotationDetail(id) {
    //   getQuotationDetail(id).then((res) => {
    //     console.log('res----------', res)
    //     if (res.success) {
    //       this.dataQuotation = res.result
    //     }
    //   })
    // },
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
    },
    // 项目改变事件
    handelChange(id, rows) {
      let that = this
      that.liaison = []
      that.formParams.liaison = ''
      that.formParams.phone = ''
      getAction(`/scrm/crmCustomLiaison/listAll`, { customId: id }).then((res) => {
        if (res.success) {
          //构建选项
          if (res.result) {
            let data = res.result
            this.liaisonData = data
            let temp = []
            for (var i = 0; i < data.length; i++) {
              temp.push({ value: data[i].name, label: data[i].name, key: i })
            }
            that.liaison = temp
          }
        } else {
        }
      })
      // this.$set(this.formParams, 'companyName', rows[0].customer) //客户名称
      // this.$set(this.formParams, 'customerName', rows[0].liaison) //联系人
      // this.$set(this.formParams, 'customerPhone', rows[0].phone) //联系电话
    },
    changeLiaison(val, option) {
      this.formParams.phone = this.liaisonData[option.data.key].phone
      this.$forceUpdate()
    },
    handleUploadChangeOrder(info) {
      console.log(info)
      let fileList = [...info.fileList]
      this.applyOrderFormUrl = fileList

      if (info.file.status === 'uploading') {
        return
      }
      if (info.file.status === 'done') {
        let a = fileList[fileList.length - 1]
        this.pictureTempListMultiOrder.push({
          uid: a.uid,
          status: 'done',
          name: a.name,
          url: a.response.message,
        })

        this.applyOrderFormUrl = this.pictureTempListMultiOrder
        const data = this.applyOrderFormUrl.map((item) => item.url).toString()
        this.formParams.applyOrderFormUrl = data
      }
    },
    close() {
      this.visible = false
      this.formParams = {
        profitsDepartment: this.$store.getters.userInfo.departIds, //当前部门id
        profitsPeoplePhone: this.$store.getters.userInfo.phone, // 当前电话
        profitsPeopleName: this.$store.getters.userInfo.realname, // 当前人
      }
      this.currnetRow = {}
      this.activeKey = '1'
      this.applyOrderFormUrl = []
      this.pictureTempListMultiOrder = []
      this.approvalList = []
    },
    open() {
      this.getDepartmentList()
      this.visible = true
    },
    add() {
      this.type = 0
      this.open()
    },
    edit(record) {
      this.type = 1
      console.log('打开项目----', record)
      this.currnetRow = record
      this.open()
    },
    detail(record) {
      this.type = 2
      console.log('打开项目----', record)
      this.currnetRow = record
      this.open()
    },
    approvalDetail(record) {
      this.type = 3
      this.currnetRow = record
      this.open()
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
    // 审批
    handleApproval() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // addQuotationSubmit(this.formParams).then((res) => {
          //   if (res.success) {
          //     this.$message.success(res.message)
          //     this.$emit('refresh')
          //   } else {
          //     this.$message.error(res.message)
          //   }
          //   this.close()
          // })
        } else {
          return false
        }
      })
    },
    //提交
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // addQuotationSave(this.formParams).then((res) => {
          //   if (res.success) {
          //     this.$message.success(res.message)
          //     this.$emit('refresh')
          //   } else {
          //     this.$message.error(res.message)
          //   }
          //   this.close()
          // })
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
