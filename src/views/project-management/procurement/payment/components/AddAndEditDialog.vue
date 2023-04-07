<template>
  <a-modal
    class="dialog"
    :title="title"
    width="1100px"
    :visible="visible"
    okText="保存"
    @cancel="close"
    :body-style="{ height: '75vh', overflow: 'hidden', overflowY: 'scroll' }"
  >
    <template #footer>
      <a-button @click="close">取消</a-button>
      <a-button type="primary" @click="handleOk">确定</a-button>
    </template>
    <div class="content">
      <a-spin tip="加载中..." :spinning="loading">
        <a-form-model ref="ruleForm" :model="formParams" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-tabs default-active-key="1">
            <!-- 付款详情  -->
            <a-tab-pane key="1" :tab="this.type == 2 ? '付款详情' : '付款管理'">
              <j-form-container :disabled="disableSubmit">
                <a-row slot="detail">
                  <a-col :span="24">
                    <table class="table" border="1" cellpadding="2" cellspacing="0">
                      <tr>
                        <!-- <th>项目名称:</th> -->
                        <td colspan="3">
                          <a-form-model-item label="项目名称" prop="projectId">
                            <j-select-project
                              v-model="formParams.projectId"
                              :multi="false"
                              @change="handelChange"
                              :disabled="disableSubmit"
                            ></j-select-project>
                            <!-- <a-select v-model="formParams.projectId" placeholder="请选择项目名称" @change="handleChange">
                            <a-select-option v-for="item in projectList" :key="item.id" :value="item.id">
                              {{ item.name }}
                            </a-select-option>
                          </a-select> -->
                          </a-form-model-item>
                        </td>
                        <!-- <th>合同编号:</th> -->
                        <td colspan="3">
                          <a-form-model-item label="合同编号" prop="contractCode">
                            <a-input
                              v-model="formParams.contractCode"
                              placeholder="请输入合同编号"
                              :read-only="readOnly"
                            />
                          </a-form-model-item>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="3">
                          <a-form-model-item label="项目编号" prop="projectCode">
                            <a-input
                              v-model="formParams.projectCode"
                              placeholder="请输入项目编号"
                              :read-only="readOnly"
                            />
                          </a-form-model-item>
                        </td>
                        <td colspan="3">
                          <a-form-model-item label="结算单位" prop="settlementCompany">
                            <a-input
                              v-model="formParams.settlementCompany"
                              placeholder="请输入结算单位"
                              :read-only="readOnly"
                            />
                          </a-form-model-item>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="3">
                          <a-form-model-item label="申请部门" prop="departmentName">
                            <a-select ref="select" v-model="formParams.departmentName" @change="handleDepart">
                              <a-select-option v-for="item in depOptions" :key="item.value" :value="item.label">
                                {{ item.label }}
                              </a-select-option>
                            </a-select>
                          </a-form-model-item>
                        </td>
                        <td colspan="3">
                          <a-form-model-item label="制单日期" prop="makeFormTime">
                            <!-- <a-input v-model="formParams.makeFormTime" class="input" :read-only="readOnly" /> 年
                          <a-input v-model="formParams.month" class="input" :read-only="readOnly" /> 月
                          <a-input v-model="formParams.day" class="input" :read-only="readOnly" /> 日 -->
                            <j-date
                              v-model="formParams.makeFormTime"
                              :showTime="true"
                              dateFormat="YYYY-MM-DD"
                              :style="{ width: '100%' }"
                              placeholder="请选择制单日期"
                            />
                          </a-form-model-item>
                        </td>
                      </tr>

                      <tr>
                        <td colspan="6">
                          <a-form-model-item
                            label="结算次数"
                            prop="settlementTimes"
                            :label-col="{ span: 2 }"
                            :wrapper-col="{ span: 19 }"
                          >
                            第
                            <template v-if="this.type !== 2">
                              <a-input-number
                                :disabled="disableSubmit"
                                v-model="formParams.settlementTimes"
                                placeholder="请输入"
                                :read-only="readOnly"
                                class="input"
                              />
                            </template>
                            <template v-else>
                              <a-input v-model="formParams.settlementTimes" class="input" :read-only="readOnly" />
                            </template>
                            次结算
                          </a-form-model-item>
                        </td>
                      </tr>

                      <tr>
                        <td rowspan="3">
                          <a-form-model-item
                            label="付款内容描述"
                            prop="paymentText"
                            :label-col="{ span: 7 }"
                            :wrapper-col="{ span: 16 }"
                          >
                            <a-textarea
                              v-model="formParams.paymentText"
                              placeholder="请输入付款内容描述"
                              :style="{ width: '100%' }"
                              :rows="5"
                              :max-length="200"
                              :read-only="readOnly"
                            />
                          </a-form-model-item>
                        </td>
                        <td colspan="6">
                          <a-form-model-item label="收款单位" prop="proceedsCompany">
                            <a-input
                              v-model="formParams.proceedsCompany"
                              placeholder="请输入收款单位"
                              :read-only="readOnly"
                            />
                          </a-form-model-item>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="6">
                          <a-form-model-item label="开户银行" prop="bank">
                            <a-input v-model="formParams.bank" placeholder="请输入开户银行" :read-only="readOnly" />
                          </a-form-model-item>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="6">
                          <a-form-model-item label="银行账号" prop="bankAccount">
                            <a-input
                              v-model="formParams.bankAccount"
                              placeholder="请输入银行账号"
                              :read-only="readOnly"
                            />
                          </a-form-model-item>
                        </td>
                      </tr>

                      <tr>
                        <td colspan="2">
                          <a-form-model-item label="合同金额" prop="contractAmount">
                            <template v-if="this.type !== 2">
                              <a-input-number
                                :disabled="disableSubmit"
                                v-model="formParams.contractAmount"
                                placeholder="请输入"
                                :read-only="readOnly"
                                :style="{ width: '100%' }"
                              />
                            </template>
                            <template v-else>
                              <a-input v-model="formParams.contractAmount" class="input" :read-only="readOnly" />
                            </template>
                          </a-form-model-item>
                        </td>
                        <td colspan="2">
                          <a-form-model-item
                            label="本期结算金额"
                            prop="thisSettlementAmount"
                            :label-col="{ span: 12 }"
                            :wrapper-col="{ span: 10 }"
                          >
                            <template v-if="this.type !== 2">
                              <a-input-number
                                :disabled="disableSubmit"
                                v-model="formParams.thisSettlementAmount"
                                placeholder="请输入"
                                :read-only="readOnly"
                                :style="{ width: '100%' }"
                              />
                            </template>
                            <template v-else>
                              <a-input
                                v-model="formParams.thisSettlementAmount"
                                class="input"
                                :read-only="readOnly"
                                :style="{ width: '100%' }"
                              />
                            </template>
                          </a-form-model-item>
                        </td>
                        <td colspan="2">
                          <a-form-model-item
                            label="累计结算金额"
                            prop="allSettlementAmount"
                            :label-col="{ span: 12 }"
                            :wrapper-col="{ span: 10 }"
                          >
                            <template v-if="this.type !== 2">
                              <a-input-number
                                :disabled="disableSubmit"
                                v-model="formParams.allSettlementAmount"
                                placeholder="请输入"
                                :read-only="readOnly"
                                :style="{ width: '100%' }"
                              />
                            </template>
                            <template v-else>
                              <a-input
                                v-model="formParams.allSettlementAmount"
                                class="input"
                                :read-only="readOnly"
                                :style="{ width: '100%' }"
                              />
                            </template>
                          </a-form-model-item>
                        </td>
                      </tr>

                      <tr>
                        <td colspan="1" rowspan="4">
                          <a-form-model-item
                            label="本次扣款金额"
                            prop="code"
                            :label-col="{ span: 6 }"
                            :wrapper-col="{ span: 10 }"
                          >
                            <!-- <a-input-number
                            :disabled="disableSubmit"
                            v-model="formParams.code"
                            placeholder="请输入"
                            :style="{ width: '40%' }"
                            :read-only="readOnly"
                          /> -->
                          </a-form-model-item>
                        </td>
                        <td colspan="3">
                          扣预付款:
                          <template v-if="this.type !== 2">
                            <a-input-number
                              :disabled="disableSubmit"
                              v-model="formParams.buckleAdvancePayment"
                              placeholder="请输入"
                              class="inputWidth"
                              :read-only="readOnly"
                            ></a-input-number>
                          </template>
                          <template v-else>
                            <a-input
                              v-model="formParams.buckleAdvancePayment"
                              :read-only="readOnly"
                              class="inputWidth"
                            />
                          </template>
                        </td>
                        <td colspan="3">
                          扣 质 保 金:
                          <template v-if="this.type !== 2">
                            <a-input-number
                              :disabled="disableSubmit"
                              v-model="formParams.buckleQualityRetentionMoney"
                              placeholder="请输入"
                              class="inputWidth"
                              :read-only="readOnly"
                            ></a-input-number>
                          </template>
                          <template v-else>
                            <a-input
                              v-model="formParams.buckleQualityRetentionMoney"
                              :read-only="readOnly"
                              class="inputWidth"
                            />
                          </template>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="3">
                          扣违约金:
                          <template v-if="this.type !== 2">
                            <a-input-number
                              :disabled="disableSubmit"
                              v-model="formParams.deductLiquidatedDamages"
                              placeholder="请输入"
                              class="inputWidth"
                              :read-only="readOnly"
                            ></a-input-number>
                          </template>
                          <template v-else>
                            <a-input
                              v-model="formParams.deductLiquidatedDamages"
                              :read-only="readOnly"
                              class="inputWidth"
                            />
                          </template>
                        </td>
                        <td colspan="3">
                          暂扣工程款:
                          <template v-if="this.type !== 2">
                            <a-input-number
                              :disabled="disableSubmit"
                              v-model="formParams.withholdProjectPayment"
                              placeholder="请输入"
                              class="inputWidth"
                              :read-only="readOnly"
                            ></a-input-number>
                          </template>
                          <template v-else>
                            <a-input
                              v-model="formParams.withholdProjectPayment"
                              :read-only="readOnly"
                              class="inputWidth"
                            />
                          </template>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="3">
                          扣 税 金 :
                          <template v-if="this.type !== 2">
                            <a-input-number
                              :disabled="disableSubmit"
                              v-model="formParams.withholdTaxes"
                              placeholder="请输入"
                              class="inputWidth"
                              :read-only="readOnly"
                            ></a-input-number>
                          </template>
                          <template v-else>
                            <a-input v-model="formParams.withholdTaxes" :read-only="readOnly" class="inputWidth" />
                          </template>
                        </td>
                        <td colspan="3">
                          扣其他费用:
                          <template v-if="this.type !== 2">
                            <a-input-number
                              :disabled="disableSubmit"
                              v-model="formParams.deductOtherExpenses"
                              placeholder="请输入"
                              class="inputWidth"
                              :read-only="readOnly"
                            ></a-input-number>
                          </template>
                          <template v-else>
                            <a-input
                              v-model="formParams.deductOtherExpenses"
                              :read-only="readOnly"
                              class="inputWidth"
                            />
                          </template>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="6">
                          扣款合计:
                          <template v-if="this.type !== 2">
                            <a-input-number
                              :disabled="disableSubmit"
                              v-model="formParams.deductionsCombined"
                              placeholder="请输入"
                              :style="{ width: '80%' }"
                              :read-only="readOnly"
                            ></a-input-number>
                          </template>
                          <template v-else>
                            <a-input v-model="formParams.deductionsCombined" :read-only="readOnly" class="inputWidth" />
                          </template>
                        </td>
                      </tr>

                      <tr>
                        <td colspan="3">
                          <a-form-model-item label="金额小写" prop="lowercaseAmount">
                            <a-input
                              type="number"
                              v-model="formParams.lowercaseAmount"
                              :read-only="readOnly"
                              @change="changeAmount"
                              suffix="元"
                            />
                          </a-form-model-item>
                        </td>
                        <td colspan="3">
                          <a-form-model-item label="金额大写" prop="capitalCamount">
                            <a-input
                              v-model="formParams.capitalCamount"
                              aria-placeholder="请输入金额大写"
                              :read-only="true"
                            />
                          </a-form-model-item>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="6">
                          <a-form-model-item class="flex-row" label="付款方式" prop="paymentWay">
                            <a-radio-group v-model="model.paymentWay" :options="way"/>
                          </a-form-model-item>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="6" style="padding: 6px 12px 12px 12px">
                          <a-upload
                            :action="minioUploadAction"
                            :multiple="true"
                            :remove="handleRemove"
                            :file-list="fileList"
                            :headers="tokenHeader"
                            @download="downloadFile"
                            @change="uploadChange"
                            @preview="handlePreview"
                            :showUploadList="{
                              showRemoveIcon: true,
                              showDownloadIcon: true,
                            }">
                            <a-button> <a-icon type="upload" /> 上传文件 </a-button>
                          </a-upload>
                        </td>
                      </tr>
                    </table>
                  </a-col>
                </a-row>
              </j-form-container>
            </a-tab-pane>
            <a-tab-pane key="2" tab="流转记录">
              <div class="block">
                <a-timeline>
                  <a-timeline-item
                    v-for="(item, index) in historyTaskList"
                    :key="index"
                    :icon="setIcon(item.finishTime)"
                    :color="setColor(item.finishTime)"
                  >
                    <p style="font-weight: 700">{{ item.taskName }}</p>
                    <a-card class="box-card" shadow="hover">
                      <a-descriptions :column="3" :labelStyle="{ 'font-weight': 'bold' }">
                        <a-descriptions-item label="实际办理">{{ item.assigneeName || '-' }}</a-descriptions-item>
                        <a-descriptions-item label="候选办理">{{ item.candidate || '-' }}</a-descriptions-item>
                        <a-descriptions-item label="耗时">{{ item.duration || '-' }}</a-descriptions-item>
                      </a-descriptions>
                      <a-descriptions :column="3" :labelStyle="{ 'font-weight': 'bold' }">
                        <a-descriptions-item label="接收时间">{{ item.createTime || '-' }}</a-descriptions-item>
                        <a-descriptions-item label="办结时间">{{ item.finishTime || '-' }}</a-descriptions-item>
                      </a-descriptions>
                      <div v-if="item.commentList && item.commentList.length > 0">
                        <div v-for="(comment, index) in item.commentList" :key="index">
                          <el-divider content-position="left">
                            <el-tag :type="approveTypeTag(comment.type)" size="mini">{{
                              commentType(comment.type)
                            }}</el-tag>
                            <el-tag type="info" effect="plain" size="mini">{{ comment.time }}</el-tag>
                          </el-divider>
                          <span>{{ comment.fullMessage }}</span>
                        </div>
                      </div>
                    </a-card>
                  </a-timeline-item>
                </a-timeline>
              </div>
            </a-tab-pane>
            <a-tab-pane key="3" tab="流程跟踪" :force-render="true">
              <process-viewer
                ref="processViewer"
                :key="`designer-${loadIndex}`"
                :style="'height:' + height"
                :xml.sync="xmlData"
                :finishedInfo="finishedInfo"
                :allCommentList="historyTaskList"
              />
            </a-tab-pane>
          </a-tabs>
        </a-form-model>
      </a-spin>
    </div>
    <j-file-dialog-preview-modal ref="modalForm"></j-file-dialog-preview-modal>
  </a-modal>
</template>

<script>
import JFileDialogPreviewModal from '@/components/jeecg/JFileDialogPreviewModal'
import { addPayment, editPayment, getDetail, getProjectList } from '@/api/procurement/Payment.js'
import JSelectProject from '@/views/scrm/modules/JSelectProject'
import ProcessViewer from '@/views/process/modules/ProcessViewer.vue'
import { getAmountChinese } from '@/utils/index'
import { httpAction, getAction } from '@/api/manage'
import { Base64 } from "js-base64";
export default {
  components: { JSelectProject, ProcessViewer,JFileDialogPreviewModal },
  data() {
    return {
      // 开关
      visible: false,
      // 弹窗标题
      title: '新增',
      // 加载动画开关
      loading: false,
      // 是否禁用
      disableSubmit: false,
      readOnly: false,
      // 当前模式 0-添加 1-编辑 2-详情
      type: 0,
      way:[
        {label:'电汇', value:1},
        {label:'转账', value:2},
        {label:'汇票', value:3},
        {label:'现金', value:4},
        {label:'其他', value:5},
      ],
      // 表单配置
      labelCol: { span: 5 },
      wrapperCol: { span: 17 },
      formParams: {},
      rules: {
        projectId: [{ required: true, message: '请选择项目名称', trigger: 'change' }],
        contractCode: [{ required: true, message: '请输入合同编号', trigger: 'blur' }],
        projectCode: [{ required: true, message: '请输入项目编号', trigger: 'blur' }],
        settlementCompany: [{ required: true, message: '请输入结算单位', trigger: 'blur' }],
        departmentName: [{ required: true, message: '请输入申请部门', trigger: 'blur' }],
        makeFormTime: [{ required: true, message: '请选择制单日期', trigger: 'change' }],
        settlementTimes: [{ required: true, message: '请输入结算次数', trigger: 'blur' }],
        proceedsCompany: [{ required: true, message: '请输入收款单位', trigger: 'blur' }],
        bank: [{ required: true, message: '请输入开户银行', trigger: 'blur' }],
        bankAccount: [{ required: true, message: '请输入银行账号', trigger: 'blur' }],
        contractAmount: [{ required: true, message: '请输入合同金额', trigger: 'blur' }],
        thisSettlementAmount: [{ required: true, message: '请输入', trigger: 'blur' }],
        allSettlementAmount: [{ required: true, message: '请输入', trigger: 'blur' }],
        capitalCamount: [{ required: true, message: '请输入金额大写', trigger: 'blur' }],
        lowercaseAmount: [{ required: true, message: '请输入金额小写', trigger: 'blur' }],
      },
      projectList: [], //项目信息
      depOptions: [],
      historyTaskList: [],
      loadIndex: 0,
      height: document.documentElement.clientHeight - 205 + 'px;',
      xmlData: undefined,
      finishedInfo: {
        finishedSequenceFlowSet: [],
        finishedTaskSet: [],
        unfinishedTaskSet: [],
        rejectedTaskSet: [],
      },
      fileList: [],
      tokenHeader: { 'X-Access-Token': this.$ls.get('Access-Token') },
      minioUploadAction: window._CONFIG['domianURL'] + '/sys/upload/uploadMinio',
    }
  },
  computed: {
    commentType() {
      return (val) => {
        switch (val) {
          case '1':
            return '通过'
          case '2':
            return '退回'
          case '3':
            return '驳回'
          case '4':
            return '委派'
          case '5':
            return '转办'
          case '6':
            return '不通过'
          case '7':
            return '删除'
          case '8':
            return '取消'
        }
      }
    },
    approveTypeTag() {
      return (val) => {
        switch (val) {
          case '1':
            return 'success'
          case '2':
            return 'warning'
          case '3':
            return 'danger'
          case '4':
            return 'primary'
          case '5':
            return 'success'
        }
      }
    },
  },
  methods: {
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
    /**获取审批记录 */
    getModelDetail(id) {
      let that = this
      let param = {
        businessKey: id,
      }
      getAction('/workflow/process/detailByKey', param).then((res) => {
        if (res.success) {
          that.historyTaskList = res.result.historyTaskList
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    /**获取审批流程图 */
    getFlowViewer(id) {
      let that = this
      let param = {
        businessKey: id
      }
      getAction('/workflow/process/flowViewerByKey', param).then((res) => {
        if (res.success) {
          var data = res.result
          if (data) {
            this.finishedInfo.finishedTaskSet = data.finishedTaskSet
            this.finishedInfo.unfinishedTaskSet = data.unfinishedTaskSet
            this.finishedInfo.rejectedTaskSet = data.rejectedTaskSet
            this.finishedInfo.finishedSequenceFlowSet = data.finishedSequenceFlowSet
            this.xmlData = data.xmlData
          }
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    /**文件上传处理开始 */
    uploadChange(info) {
      let fileList = [...info.fileList]
      if (info.file.status === 'uploading') {
        this.fileList = fileList
      }
      if (info.file.status === 'done') {
        let result = info.file.response.result
        this.formParams.files.push({
          uid: result.id,
          status: 'done',
          name: result.fileName,
          url: result.url,
        })
      }
    },
    handleRemove(file) {
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList
      const newUploadList = this.formParams.files.slice()
      newUploadList.splice(index, 1)
      this.formParams.files = newUploadList
    },
    /**文件下载 */
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
      let that = this
      getAction('sys/upload/preview', { id: file.uid }).then((res) => {
        if (res.success) {
          if (res && res.result) {
            let url = window._CONFIG['onlinePreviewDomainURL'] + '?url=' + encodeURIComponent(Base64.encode(res.result))
            that.$refs.modalForm.open(url)
          }
        } else {
          this.$message.error('文件预览失败')
        }
      })
    },
    // 项目
    handelChange(value, rows) {
      console.log(value, rows)
      this.$set(this.formParams, 'projectCode', rows[0].projectNo) //项目编号
    },
    // 打开弹窗
    open() {
      this.visible = true
      this.getCurrentUserDepart()
      // this.loadIndex = this.record.procInsId
      // this.getProjectList()
      // console.log(this.$store.getters.userInfo)
    },
    // 关闭弹窗，点击遮罩层或右上角叉或取消按钮时触发
    close() {
      this.visible = false
      this.formParams = {}
      this.fileList = []
      // 重置表单
      this.$refs.ruleForm.resetFields()
    },
    changeAmount(e) {
      this.formParams.capitalCamount = getAmountChinese(e.target.value)
    },
    handleDepart(val) {
      this.formParams.departmentName = val
    },
    /**部门选择处理 */
    getCurrentUserDepart() {
      getAction('sys/sysDepart/getCurrentUserDepart').then((res) => {
        if (res.success) {
          //构建选项
          if (res.result) {
            this.depOptions = res.result
            console.log(this.depOptions)
          }
        } else {
          this.depOptions = []
        }
      })
    },
    // 获取项目列表
    getProjectList() {
      getProjectList().then(({ result, success }) => {
        if (success) {
          console.log(result)
          this.projectList = result.records
        }
      })
    },
    handleChange(value) {
      let data = this.projectList.filter((item) => item.id == value)
      // 项目编号
      this.formParams.projectCode = data[0].code
    },

    // 添加
    add() {
      // 当前为添加模式
      this.type = 0
      this.open()
      this.readOnly = false
    },
    // 编辑
    edit(record) {
      this.type = 1
      this.getDetail(record.id)
      this.title = '编辑'
      this.open()
      this.readOnly = false
    },
    // 详情
    detail(record) {
      this.type = 2
      this.getDetail(record.id || record)
      this.getModelDetail(record.id)
      this.getFlowViewer(record.id)
      this.readOnly = true
      this.title = '详情'
      this.open()
    },

    // 获取详情
    getDetail(id) {
      getDetail(id).then((res) => {
        if (res.success) {
          this.formParams = res.result
          this.fileList = res.result.files
          // this.fileList = [{uid:1,status: 'done',name:'11',url:'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'}]
          // 分割制单日期和金额
          // let makeFormTime = res.result.makeFormTime.split('-')
          // let capitalCamount = res.result.capitalCamount.split('-')

          // this.formParams.makeFormTime = makeFormTime[0]
          // this.formParams.month = makeFormTime[1]
          // this.formParams.day = makeFormTime[2]

          // this.formParams.capitalCamount = capitalCamount[0]
          // this.formParams.jiao = capitalCamount[1]
          // this.formParams.fen = capitalCamount[2]
        }
      })
    },

    // 确定
    handleOk() {
      let data = {
        ...this.formParams,
        // makeFormTime: this.formParams.makeFormTime + '-' + this.formParams.month + '-' + this.formParams.day,
        // capitalCamount: this.formParams.capitalCamount + '-' + this.formParams.jiao + '-' + this.formParams.fen,
      }
      console.log(data)
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // 添加
          if (this.type == 0) {
            addPayment(data).then((res) => {
              if (res.success) {
                this.$message.success(res.message)
                this.$emit('refresh')
              } else {
                this.$message.error(res.message)
              }
              this.close()
            })
          } else if (this.type == 1) {
            // 编辑
            editPayment(data).then((res) => {
              if (res.success) {
                this.$message.success(res.message)
                this.$emit('refresh')
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
.content {
  width: 100%;
  .head {
    height: 46px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 4px solid #797979;
    .head-item {
      flex: 1;
      &:nth-child(2) {
        text-align: center;
      }
      &:last-child {
        text-align: right;
      }
    }
  }
  .title {
    padding: 10px 0;
    font-size: 24px;
    text-align: center;
    color: #333333;
    font-weight: 600;
  }
  .table {
    width: 100%;
    tr {
      height: 40px;
      text-align: center;
    }

    th,
    td {
      min-width: 120px;
      padding: 5px;
      text-align: left;
    }
  }

  label {
    height: 30px;
    line-height: 30px;
    display: flex;
    align-items: center;
    span {
      padding-left: 5px;
    }
  }

  .checkbox {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }
}
.inputWidth {
  width: 60%;
}
.input {
  width: 27%;
}
.text {
  margin-top: 20px;
  padding: 20px;
  font-weight: 600;
}
</style>
