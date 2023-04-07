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
        <!-- 部门采购申请 -->
        <a-tabs default-active-key="1" @change="handleChange" :activeKey="activeKey">
          <a-tab-pane key="1" tab="部门采购申请" v-if="this.type == 0 || activeKeys == 1">
            <j-form-container :disabled="true">
              <a-row slot="detail">
                <a-col :span="24" class="title">申请信息</a-col>
                <a-col :span="8">
                  <a-form-model-item label="申请部门" prop="department">
                    <a-input v-model="formParams.department" placeholder="请输入申请部门" :read-only="true" />
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

                <a-col :span="24" class="title">申请内容</a-col>
                <a-col :span="8">
                  <a-form-model-item
                    label="采购类别"
                    prop="category"
                    :rules="activeKey == 1 ? rules.category : [{ required: false }]"
                  >
                    <j-dict-select-tag
                      v-model="formParams.category"
                      dictCode="procurement_categories"
                      placeholder="请选择采购类别"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item
                    label="用途"
                    prop="useWay"
                    :rules="activeKey == 1 ? rules.useWay : [{ required: false }]"
                  >
                    <a-select v-model="formParams.useWay" placeholder="请选择用途">
                      <a-select-option :value="1">已有项目采购 </a-select-option>
                      <a-select-option :value="2">销售 </a-select-option>
                      <a-select-option :value="3">公司自用 </a-select-option>
                      <a-select-option :value="4">其他 </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item
                    label="合同情况"
                    prop="hasContract"
                    :rules="activeKey == 1 ? rules.hasContract : [{ required: false }]"
                  >
                    <a-select v-model="formParams.hasContract" placeholder="请选择合同情况">
                      <a-select-option :value="1">有合同 </a-select-option>
                      <a-select-option :value="2">备货涵 </a-select-option>
                      <a-select-option :value="3">领导邮件通知下单 </a-select-option>
                      <a-select-option :value="4">其他 </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item
                    label="付款方式"
                    prop="payMethod"
                    :rules="activeKey == 1 ? rules.payMethod : [{ required: false }]"
                  >
                    <a-select v-model="formParams.payMethod" placeholder="请选择付款方式">
                      <a-select-option :value="1">签订合同并开票付款 </a-select-option>
                      <a-select-option :value="2">开票付现金 </a-select-option>
                      <a-select-option :value="3">其他 </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item
                    label="紧急情况"
                    prop="degree"
                    :rules="activeKey == 1 ? rules.degree : [{ required: false }]"
                  >
                    <a-select v-model="formParams.degree" placeholder="请选择紧急情况">
                      <a-select-option :value="1">紧急 </a-select-option>
                      <a-select-option :value="2">一般 </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item
                    label="需求到位时间"
                    prop="inPlaceTime"
                    :rules="activeKey == 1 ? rules.inPlaceTime : [{ required: false }]"
                  >
                    <j-date
                      v-model="formParams.inPlaceTime"
                      :showTime="true"
                      dateFormat="YYYY-MM-DD HH:mm:ss"
                      :style="{ width: '100%' }"
                      placeholder="请选择需求到位时间"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="24">
                  <a-form-model-item
                    label="下单申请表"
                    prop="applyFromUrl"
                    :label-col="{ span: 2 }"
                    :wrapper-col="{ span: 17 }"
                    :rules="activeKey == 1 ? rules.applyFromUrl : [{ required: false }]"
                  >
                    <!-- <a-upload
                      :action="uploadUrl"
                      :multiple="true"
                      :file-list="applyFromUrl"
                      :headers="headers"
                      :disabled="disableSubmit"
                      @change="handleUploadChange"
                    >
                      <a v-if="applyFromUrl.length < 1" type="primary" icon="upload">上传文件 </a>
                    </a-upload> -->
                    <a-upload
                      :action="uploadUrl"
                      :multiple="true"
                      :file-list="applyFromUrl"
                      :headers="headers"
                      :disabled="disableSubmit"
                      @change="handleUploadChange"
                      @download="downloadFile"
                      @preview="handlePreview"
                      :showUploadList="{
                        showRemoveIcon: true,
                        showDownloadIcon: true,
                      }"
                    >
                      <a v-if="applyFromUrl.length < 9" type="primary" icon="upload">上传文件 </a>
                    </a-upload>
                    <a
                      icon="download"
                      @click="download('下单申请表模版', 'xls', '/pcmProcurement/order/apply/download')"
                      >下载模板
                    </a>
                  </a-form-model-item>
                </a-col>

                <a-col :span="24">
                  <a-form-model-item
                    label="关联客户"
                    prop="customerId"
                    :label-col="{ span: 2 }"
                    :wrapper-col="{ span: 20 }"
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
                    :wrapper-col="{ span: 20 }"
                  >
                    <j-select-project
                      v-model="formParams.projectId"
                      :multi="false"
                      @change="handelChange"
                    ></j-select-project>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </j-form-container>
          </a-tab-pane>

          <!-- 审批记录 -->
          <!-- <a-tab-pane key="4" tab="审批记录" v-if="this.type == 2 || this.type == 3">
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
                      <p style="font-weight: 700">{{ item.processName }}</p>
                      <a-card class="box-card" shadow="hover">
                        <a-descriptions :column="4" :labelStyle="{ 'font-weight': 'bold' }">
                          <a-descriptions-item label="操作人">{{ item.approverName || '-' }}</a-descriptions-item>
                          <a-descriptions-item label="申请时间">{{ item.applyTime || '-' }}</a-descriptions-item>
                          <a-descriptions-item label="状态">{{ commentType(item.status) || '-' }}</a-descriptions-item>
                          <a-descriptions-item label="审批时间">{{ item.approverTime || '-' }}</a-descriptions-item>
                          <a-descriptions-item label="审批备注">{{ item.remark || '-' }}</a-descriptions-item>
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
          </a-tab-pane> -->
        </a-tabs>
      </a-form-model>
    </a-spin>
    <div class="drawer-bootom-button">
      <a-button @click="close" style="margin-right: 0.8rem">关闭</a-button>
    </div>

    <j-file-dialog-preview-modal ref="modalForm"></j-file-dialog-preview-modal>
  </a-drawer>
</template>

<script>
import JFileDialogPreviewModal from '@/components/jeecg/JFileDialogPreviewModal'
import { getDepartmentList } from '@/api/project-management/foreign-price-management/ProjectProfit.js'
import { getProcurment, getProcurmentApproList } from '@/api/project-management/PurchaseRequest.js'
import JFormContainer from '@/components/jeecg/JFormContainer'
import JSelectCustomer from '@/views/scrm/modules/JSelectCustomer'
import JSelectProject from '@/views/scrm/modules/JSelectProject'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin'
import { getDictText } from '@/api/api.js'
import { downFile, getAction } from '@/api/manage'
import { Base64 } from 'js-base64'
export default {
  mixins: [TableListMixin],
  components: { JFileDialogPreviewModal, JSelectCustomer, JSelectProject, JFormContainer },
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
      disableMixinCreated: true,
      // 表单参数
      formParams: {
        type: '1',
        department: this.$store.getters.userInfo.orgCodeTxt, //当前部门
        departIds: this.$store.getters.userInfo.departIds, //当前部门
        phone: this.$store.getters.userInfo.phone, // 当前电话
        people: this.$store.getters.userInfo.realname, // 当前人
      },
      // 上传地址
      uploadUrl: process.env.VUE_APP_API_BASE_URL + '/sys/common/upload',
      // 上传请求头
      headers: {
        'X-Access-Token': this.$ls.get('Access-Token'),
      },
      // 图片上传列表
      applyFromUrl: [],
      // 图片处理数据集合
      pictureTempListImage: [],

      multiContrastUrl: [], //三方比对表
      pictureTempListMulti: [], //三方比对表数据集合

      activeKey: '1',
      activeKeys: '1',
      principalPersonList: [], //部门列表
      approvalList: [],
      // 加载动画开关
      loading: false,
      rules: {
        customerName: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
        customerPhone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
        category: [{ required: true, message: '请选择采购类别', trigger: 'change' }],
        useWay: [{ required: true, message: '请选择用途', trigger: 'change' }],
        hasContract: [{ required: true, message: '请选择合同情况', trigger: 'change' }],
        payMethod: [{ required: true, message: '请选择付款方式', trigger: 'change' }],
        degree: [{ required: true, message: '请选择紧急情况', trigger: 'change' }],
        purchaseApplyId: [{ required: true, message: '请选择关联采购申请', trigger: 'change' }],
        applyFromUrl: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (this.applyFromUrl == '') return callback(new Error('请上传下单申请表！'))
              callback()
            },
            trigger: 'blur',
          },
        ],
      },
      currnetId: '',
      currnetRow: {},
      purchaseApplyId: '',
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
          case 4:
            return '申请通过'
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
          case 3:
            return 'blue'
        }
      }
    },
  },
  methods: {
    getDictText,
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
    // 下载模版
    download(fileName, format, url) {
      downFile(url).then((data) => {
        console.log(data)
        if (!data || data.size === 0) {
          Vue.prototype['$message'].warning('文件下载失败')
          return
        }
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          window.navigator.msSaveBlob(new Blob([data]), fileName)
        } else {
          let url = window.URL.createObjectURL(new Blob([data]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', fileName + `.${format}`)
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link) //下载完成移除元素
          window.URL.revokeObjectURL(url) //释放掉blob对象
        }
      })
    },
    // 获取详情
    getProcurmentApproList(id) {
      getProcurmentApproList(id).then((res) => {
        if (res.success) {
          this.approvalList = res.result.approves

          this.formParams.category = res.result.pcmContextFirst.category
          this.formParams.useWay = res.result.pcmContextFirst.useWay
          this.formParams.payMethod = res.result.pcmContextFirst.payMethod
          this.formParams.hasContract = res.result.pcmContextFirst.hasContract
          this.formParams.degree = res.result.pcmContextFirst.degree
          this.formParams.inPlaceTime = res.result.pcmContextFirst.inPlaceTime
          this.formParams.applyFromUrl = res.result.pcmContextFirst.applyFromUrl
          this.formParams.customerName = res.result.pcmContextFirst.customerName
          this.formParams.customerId = res.result.pcmContextFirst.customerId
          this.formParams.projectName = res.result.pcmContextFirst.projectName
          this.formParams.projectId = res.result.pcmContextFirst.projectId
          // let applyFromUrl = res.result.pcmContextFirst.applyFromUrl
          //   ? res.result.pcmContextFirst.applyFromUrl.split(',')
          //   : []
          // console.log(res.result.pcmContextFirst.applyFromUrl)
          this.applyFromUrl = res.result.pcmContextFirst.applyFromUrl.map((item, index) => {
            let i = index + 1
            return {
              uid: item.uid,
              status: 'done',
              name: item.name,
              url: item.url,
            }
          })
          // console.log(this.applyFromUrl)
        }
      })
    },
    // 切换tab
    handleChange(key) {
      console.log(key)
      this.activeKey = key
      this.formParams = {
        type: key,
        department: this.$store.getters.userInfo.orgCodeTxt, //当前部门
        departIds: this.$store.getters.userInfo.departIds, //当前部门
        phone: this.$store.getters.userInfo.phone, // 当前电话
        people: this.$store.getters.userInfo.realname, // 当前人
      }
      if (this.currnetId) {
        this.getProcurmentApproList(this.currnetId)
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
    },
    close() {
      this.visible = false
      // 重置表单
      this.$refs.ruleForm.resetFields()
      this.formParams = {
        type: '1',
        department: this.$store.getters.userInfo.orgCodeTxt, //当前部门
        departIds: this.$store.getters.userInfo.departIds, //当前部门
        phone: this.$store.getters.userInfo.phone, // 当前电话
        people: this.$store.getters.userInfo.realname, // 当前人
      }
      this.applyFromUrl = []
      this.pictureTempListImage = []
      this.currnetRow = {}
      this.activeKey = '1'
      this.activeKeys = '1'
      this.currnetId = ''
      this.priceAble = []
      this.approvalList = []
      this.purchaseApplyId = ''
      this.multiContrastId = ''
    },
    detail(purchaseApplyId) {
      this.type = 2
      this.currnetId = purchaseApplyId
      this.getDepartmentList()
      this.getProcurmentApproList(purchaseApplyId)
      this.visible = true
    },
    // 文件上传
    handleUploadChange(info) {
      console.log(info)
      let fileList = [...info.fileList]
      this.applyFromUrl = fileList

      if (info.file.status === 'uploading') {
        return
      }
      if (info.file.status === 'done') {
        let a = fileList[fileList.length - 1]
        this.pictureTempListImage.push({
          uid: a.uid,
          status: 'done',
          name: a.name,
          url: a.response.message,
        })

        this.applyFromUrl = this.pictureTempListImage
        const data = this.applyFromUrl.map((item) => item.url).toString()
        this.formParams.applyFromUrl = data
      }
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
/deep/ .j-form-container {
  padding: 0;
}
</style>
