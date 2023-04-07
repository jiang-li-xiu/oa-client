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
          <!-- 三方比价申请 -->
          <a-tab-pane key="1" tab="三方比价申请" force-render>
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
                <a-col :span="24">
                  <a-form-model-item
                    label="关联客户"
                    prop="customerId"
                    :rules="formParams.type == 1 ? rules.customerId : [{ required: false }]"
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
                    :rules="formParams.type == 1 ? rules.projectId : [{ required: false }]"
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
                <a-col :span="8">
                  <a-form-model-item
                    label="采购内容"
                    prop="purchaseContext"
                    :rules="formParams.type == 2 ? rules.purchaseContext : [{ required: false }]"
                  >
                    <a-input v-model="formParams.purchaseContext" placeholder="请输入采购内容" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item
                    label="采购类别"
                    prop="category"
                    :rules="formParams.type == 2 ? rules.category : [{ required: false }]"
                  >
                    <a-select v-model="formParams.category" placeholder="请选择采购类别">
                      <a-select-option :value="1">公司内部采购 </a-select-option>
                      <a-select-option :value="2">项目采购 </a-select-option>
                      <a-select-option :value="3">销售 </a-select-option>
                      <a-select-option :value="4">固定资产 </a-select-option>
                      <a-select-option :value="5">其他 </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>

                <a-col :span="24">
                  <a-form-model-item
                    label="三方比价表"
                    prop="multiContrastUrl"
                    :label-col="{ span: 2 }"
                    :wrapper-col="{ span: 17 }"
                    :rules="formParams.type == 2 ? rules.multiContrastUrl : [{ required: false }]"
                  >
                    <a-upload
                      :action="uploadUrl"
                      :multiple="true"
                      :file-list="multiContrastUrl"
                      :headers="headers"
                      :disabled="disableSubmit"
                      @change="handleUploadMultiContras"
                      :remove="handleRemoveMultiContras"
                      @download="downloadFileMultiContras"
                      @preview="handlePreviewMultiContras"
                      :showUploadList="{
                        showRemoveIcon: true,
                        showDownloadIcon: true,
                      }"
                    >
                      <a v-if="multiContrastUrl.length < 9" type="primary" icon="upload">上传文件 </a>
                    </a-upload>
                    <a
                      icon="download"
                      @click="download('三方比价表模版', 'xls', '/pcmProcurement/multi/contrast/download')"
                      >下载模板
                    </a>
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
    <DepartmentalPurchaseDetail ref="purchaseForm"></DepartmentalPurchaseDetail>
    
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
import DepartmentalPurchaseDetail from './DepartmentalPurchaseDetail'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin'
import { getDictText } from '@/api/api.js'
import { downFile ,getAction} from '@/api/manage'
import { Base64 } from 'js-base64'
export default {
  mixins: [TableListMixin],
  components: { JFileDialogPreviewModal,JSelectCustomer, JSelectProject, JFormContainer, DepartmentalPurchaseDetail },
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
        category: [{ required: true, message: '请选择采购类别', trigger: 'change' }],
        purchaseContext: [{ required: true, message: '请输入采购内容', trigger: 'blur' }],
        purchaseApplyId: [{ required: true, message: '请选择关联采购申请', trigger: 'change' }],
        multiContrastUrl: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (this.multiContrastUrl == '') return callback(new Error('请上传三方比对表！'))
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
    getProcurmentApproList(id) {
      getProcurmentApproList(id).then((res) => {
        if (res.success) {
          this.approvalList = res.result.approves

          this.formParams.customerId = res.result.pcmContextSecond.customerId
            ? res.result.pcmContextSecond.customerId
            : ''
          this.formParams.customerName = res.result.pcmContextSecond.customerName
            ? res.result.pcmContextSecond.customerName
            : ''
          this.formParams.projectId = res.result.pcmContextSecond.projectId ? res.result.pcmContextSecond.projectId : ''
          this.formParams.projectName = res.result.pcmContextSecond.projectName
            ? res.result.pcmContextSecond.projectName
            : ''
          this.formParams.category = res.result.pcmContextSecond.category
          this.formParams.purchaseContext = res.result.pcmContextSecond.purchaseContext
          this.formParams.multiContrastUrl = res.result.pcmContextSecond.multiContrastUrl
          // let multiContrastUrl = res.result.pcmContextSecond.multiContrastUrl
          //   ? res.result.pcmContextSecond.multiContrastUrl.split(',')
          //   : []
          this.multiContrastUrl = res.result.pcmContextSecond.multiContrastUrl.map((item, index) => {
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
    // 切换tab
    handleChange(key) {
      console.log(key, this.currnetId)
      this.activeKey = key
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
      this.multiContrastUrl = []
      this.pictureTempListMulti = []
      this.currnetRow = {}
      this.activeKey = '1'
      this.activeKeys = '1'
      this.currnetId = ''
      this.approvalList = []
      this.purchaseApplyId = ''
      this.multiContrastId = ''
    },
    detail(id) {
      this.type = 2
      this.currnetId = id
      this.getDepartmentList()
      this.getProcurmentApproList(id)
      console.log(this.activeKey)
      this.visible = true
    },
    // 三方比价表
    handleUploadMultiContras(info) {
      let fileList = [...info.fileList]
      if (info.file.status === 'uploading') {
        this.multiContrastUrl = fileList
      }
      if (info.file.status === 'done') {
        let result = info.file.response.result
        this.pictureTempListMulti.push({
          uid: result.id,
          status: 'done',
          name: result.fileName,
          url: result.url,
        })
        this.multiContrastUrl = this.pictureTempListMulti
        this.formParams.multiContrastUrl = this.pictureTempListMulti
      }
    },
    // 移除
    handleRemoveMultiContras(file) {
      const index = this.multiContrastUrl.indexOf(file)
      const newFileList = this.multiContrastUrl.slice()
      newFileList.splice(index, 1)
      this.multiContrastUrl = newFileList
      const newUploadList = this.formParams.multiContrastUrl.slice()
      newUploadList.splice(index, 1)
      this.formParams.multiContrastUrl = newUploadList
      this.pictureTempListMulti = newUploadList
    },
    downloadFileMultiContras(file) {
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
    async handlePreviewMultiContras(file) {
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
