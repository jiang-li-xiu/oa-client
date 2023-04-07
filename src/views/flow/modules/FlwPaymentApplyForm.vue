<template>
  <a-spin :spinning="confirmLoading">
    <a-form-model ref="form" :model="model" :rules="validatorRules">
      <a-tabs defaultActiveKey="activeKey" @change="changeTabs">
        <a-tab-pane key="1" :tab="tabName">
          <j-form-container :disabled="formDisabled">
            <a-row slot="detail">
              <table :border="1">
                <thead>
                  <tr class="head-tr">
                    <th style="font-size: 18px; font-weight: 600">付款申请</th>
                    <th>
                      <a-form-model-item class="head-create-date" label="制单日期" prop="createDate">
                        <a-date-picker v-model="model.createDate" placeholder="请输入制单日期" />
                      </a-form-model-item>
                    </th>
                  </tr>
                </thead>
                <tr>
                  <td>
                    <a-form-model-item class="flex-row" label="申请部门" prop="depart">
                      <!-- <a-input v-model="model.userId" placeholder="请输入申请部门"  ></a-input> -->
                      <a-select
                        ref="select"
                        v-model="model.depart"
                        :options="depOptions"
                        :field-names="{ label: 'name', value: 'id' }"
                        @change="handleChange"
                      ></a-select>
                    </a-form-model-item>
                  </td>
                  <td>
                    <a-form-model-item class="flex-row" label="关联项目" prop="projectId">
                      <a-input v-model="model.projectId" placeholder="请选择关联项目"></a-input>
                    </a-form-model-item>
                  </td>
                </tr>
                <tr>
                  <td>
                    <a-form-model-item class="flex-row" label="关联合同" prop="contractId">
                      <a-input v-model="model.contractId" placeholder="请选择关联合同"></a-input>
                    </a-form-model-item>
                  </td>
                  <td>
                    <a-form-model-item class="flex-row" label="付款类型" prop="planFlag">
                      <a-radio-group v-model="model.planFlag">
                        <a-radio :value="1" name="planFlag">计划内</a-radio>
                        <a-radio :value="2" name="planFlag">计划外</a-radio>
                      </a-radio-group>
                    </a-form-model-item>
                  </td>
                </tr>
                <tr>
                  <td rowspan="3">
                    <a-form-model-item class="flex-colunm" label="付款说明" prop="explanation">
                      <a-textarea v-model="model.explanation" :rows="4" placeholder="请输入付款说明"></a-textarea>
                    </a-form-model-item>
                  </td>
                  <td>
                    <a-form-model-item class="flex-row" label="收款单位" prop="payee">
                      <a-input v-model="model.payee" placeholder="请输入收款单位"></a-input>
                    </a-form-model-item>
                  </td>
                </tr>
                <tr>
                  <td>
                    <a-form-model-item class="flex-row" label="开户银行" prop="bankName">
                      <a-input v-model="model.bankName" placeholder="请输入开户银行"></a-input>
                    </a-form-model-item>
                  </td>
                </tr>
                <tr>
                  <td>
                    <a-form-model-item class="flex-row" label="银行账号" prop="bankAcount">
                      <a-input v-model="model.bankAcount" placeholder="请输入银行账号"></a-input>
                    </a-form-model-item>
                  </td>
                </tr>
                <tr>
                  <td>
                    <a-form-model-item class="flex-row" label="付款金额" prop="amount">
                      <a-input-number
                        @change="changeAmount"
                        v-model="model.amount"
                        placeholder="请输入付款金额"
                        style="width: 100%"
                      />
                    </a-form-model-item>
                  </td>
                  <td>
                    <a-form-model-item class="flex-row" label="金额大写" prop="amountInWords">
                      <a-input v-model="model.amountInWords" placeholder="请输入金额大写" :read-only="true"></a-input>
                    </a-form-model-item>
                  </td>
                </tr>
                <tr>
                  <td colspan="2">
                    <a-form-model-item class="flex-row" label="付款方式" prop="paymentWay">
                      <a-radio-group v-model="model.paymentWay">
                        <a-radio :value="1" name="paymentWay">电汇</a-radio>
                        <a-radio :value="2" name="paymentWay">转账</a-radio>
                        <a-radio :value="3" name="paymentWay">汇票</a-radio>
                        <a-radio :value="4" name="paymentWay">现金</a-radio>
                        <a-radio :value="5" name="paymentWay">其他</a-radio>
                      </a-radio-group>
                    </a-form-model-item>
                  </td>
                </tr>
                <tr>
                  <td colspan="2">
                    <a-form-model-item class="flex-row" label="付款类别" prop="paymentType">
                      <a-radio-group v-model="model.paymentType" class="payment-type">
                        <a-radio :value="1" name="paymentType">采购付款(首次)</a-radio>
                        <a-radio :value="2" name="paymentType">采购付款(非首次)</a-radio>
                        <a-radio :value="3" name="paymentType">月度工资发放</a-radio>
                        <a-radio :value="4" name="paymentType">经费支付</a-radio>
                        <a-radio :value="5" name="paymentType">往来款项</a-radio>
                        <a-radio :value="6" name="paymentType">招待费用(礼品费)</a-radio>
                        <a-radio :value="7" name="paymentType">支付保证金及借款</a-radio>
                        <a-radio :value="8" name="paymentType">其他</a-radio>
                      </a-radio-group>
                    </a-form-model-item>
                  </td>
                </tr>
                <tr>
                  <td colspan="2">
                    <a-upload
                      :action="minioAction"
                      :multiple="true"
                      :remove="removeFile"
                      :file-list="fileList"
                      :headers="head"
                      @download="downloadFile"
                      @change="uploadFile"
                      @preview="previewFile"
                      :showUploadList="showUploadList">
                      <a-button :disabled="true"> <a-icon type="upload"/> 上传文件 </a-button>
                  </a-upload>   
                </td>
              </tr>
              </table>
            </a-row>
          </j-form-container>
        </a-tab-pane>

        <a-tab-pane key="2" tab="流转记录">
          <j-form-container :disabled="formDisabled">
            <div class="block" slot="detail">
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
          </j-form-container>
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
    <preview-file ref="previewFile"></preview-file>
  </a-spin>
</template>

<script>
import ProcessViewer from '@/views/process/modules/ProcessViewer.vue'
import { httpAction, getAction } from '@/api/manage'
import { getAmountChinese } from '@/utils/index'
import { FileHandleMixin } from '@/mixins/FileHandleMixin'

export default {
  name: 'FlwPaymentApplyForm',
  mixins:[FileHandleMixin],
  components: { ProcessViewer },
  props: {
    //表单禁用
    disabled: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    return {
      model: {},
      depOptions: [],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      confirmLoading: false,
      validatorRules: {
        createDate: [{ required: true, message: '请填写制单日期', trigger: 'change' }],
        depart: [{ required: true, message: '请选择申请部门', trigger: 'change' }],
        planFlag: [{ required: true, message: '请选择付款类型', trigger: 'blur' }],
        payee: [{ required: true, message: '请填写收款单位', trigger: 'blur' }],
        bankName: [{ required: true, message: '请填写开户银行', trigger: 'blur' }],
        bankAcount: [{ required: true, message: '请填银行账号', trigger: 'blur' }],
        amount: [{ required: true, message: '请填写付款金额', trigger: 'blur' }],
        amountInWords: [{ required: true, message: '请填写金额大写', trigger: 'blur' }],
        paymentWay: [{ required: true, message: '请选择付款方式', trigger: 'blur' }],
        paymentType: [{ required: true, message: '请选择付款类别', trigger: 'blur' }],
      },
      url: {
        add: '/scrm/flwPaymentApply/add',
        edit: '/scrm/flwPaymentApply/edit',
        queryById: '/scrm/flwPaymentApply/queryById',
      },
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
      tabName: '表单信息',
      type: 'handel'
    }
  },
  computed: {
    formDisabled() {
      return this.disabled
    },
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
          case '9':
            return '跳过'
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
  created() {
    //备份model原始值
    this.modelDefault = JSON.parse(JSON.stringify(this.model))
  },
  methods: {
    changeTabs(data) {
      if (data == 3) {
        this.$refs.processViewer.init()
      }
    },
    /**获取审批记录 */
    getModelDetail() {
      let that = this
      let param = {
        businessKey: this.model.id
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
    getFlowViewer() {
      let that = this
      let param = {
        businessKey: this.model.id
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
    add() {
      this.edit(this.modelDefault)
    },
    edit(record) {
      this.model = Object.assign({}, record)
      this.fileList = record.files
      this.visible = true
      this.getCurrentUserDepart()
      this.getModelDetail()
      this.getFlowViewer()
    },
    handleChange(val) {
      this.model.depart = val
    },
    getCurrentUserDepart() {
      getAction('sys/sysDepart/getCurrentUserDepart').then((res) => {
        if (res.success) {
          //构建选项
          if (res.result) {
            this.depOptions = res.result
          }
        } else {
          this.depOptions = []
        }
      })
    },
    changeAmount(val) {
      this.model.amountInWords = getAmountChinese(val)
    },
    submitForm() {
      const that = this
      // 触发表单验证
      this.$refs.form.validate((valid) => {
        if (valid) {
          that.confirmLoading = true
          let httpurl = ''
          let method = ''
          if (!this.model.id) {
            httpurl += this.url.add
            method = 'post'
          } else {
            httpurl += this.url.edit
            method = 'put'
          }
          httpAction(httpurl, this.model, method)
            .then((res) => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
              } else {
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              that.confirmLoading = false
            })
        }
      })
    },
  },
}
</script>
<style lang="less" scoped>
table {
  width: 100%;
  .head-tr {
    border-top: hidden;
    border-left: hidden;
    border-right: hidden;
    text-align: right;
    th {
      border-right: hidden;
    }
  }
  .head-create-date {
    font-weight: normal;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .flex-colunm {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    &:deep(.ant-form-item-control-wrapper) {
      margin-right: 6px;
      width: 98%;
    }
  }
  .flex-row {
    display: flex;
    flex-direction: row;
    &:deep(.ant-form-item-control-wrapper) {
      flex-grow: 1;
      margin-right: 6px;
    }
    &:deep(.ant-form-item-label) {
      min-width: 72px;
    }
  }
}
.payment-type {
  padding-left: 8px;
  .ant-radio-wrapper {
    padding: 6px 0 6px 0;
  }
}
.ant-modal {
  &:deep(.ant-modal-body) {
    padding-top: 0 !important;
  }
}
.ant-form-item {
  margin-bottom: 0 !important;
}
</style>
