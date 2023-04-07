<template>
  <a-spin :spinning="confirmLoading">
    <a-form-model ref="form" :model="model" :rules="validatorRules">
      <a-tabs defaultActiveKey="activeKey" @change="changeTabs">
        <a-tab-pane key="1" :tab="tabName">
          <j-form-container :disabled="formDisabled">
            <a-row slot="detail">
              <table :border="1" cellpadding="2" cellspacing="0">
                <thead>
                  <tr class="head-tr">
                    <td style="width: 33.33%">
                      <a-form-model-item class="flex-row" label="单号" prop="businessNo" v-if="formDisabled">
                        <a-input v-model="model.businessNo" :read-only="true" style="border: none"></a-input>
                      </a-form-model-item>
                    </td>
                    <th style="width: 33.33%; font-size: 18px; font-weight: 600">费用报销单</th>
                    <td style="width: 33.33%"></td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <a-form-model-item class="flex-row" label="申请部门" prop="businessNo">
                        <!-- <a-input v-model="model.businessNo" placeholder="请输入单号"  ></a-input> -->
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
                      <a-form-model-item class="flex-row" label="申请人" prop="createBy">
                        <a-input v-model="model.createBy" :read-only="true"></a-input>
                      </a-form-model-item>
                    </td>
                    <td>
                      <a-form-model-item class="flex-row" label="填报日期" prop="fillingDate">
                        <j-date placeholder="请选择填报日期" v-model="model.fillingDate" style="width: 100%" />
                      </a-form-model-item>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="3">
                      <div style="display:flex; flex-direction: row; align-items: center; justify-content: space-between;">
                        <a-form-model-item v-if="selected" 
                          class="flex-row" 
                          label="项目名称" 
                          prop="projectId" 
                          :rules="[{ required: true, message: '请选择项目', trigger: 'change'}]">
                          <j-select-project
                            v-model="model.projectId"
                            :multi="false"
                            @change="itemChange"
                          ></j-select-project>  
                        </a-form-model-item>
                        <a-form-model-item  v-else 
                          class="flex-row" 
                          label="项目名称" 
                          prop="project" 
                          :rules="[{ required: true, message: '请选择项目', trigger: 'change'}]">
                          <a-input v-model="model.project" placeholder="请输入项目名称" :max-length="250"></a-input>
                        </a-form-model-item>
                        <a-tooltip placement="topLeft" title="输入方式切换按钮。手输即手动输入，适用于与项目无法的报销；选择则从已有项目中选择">
                          <a-button type="primary" @click="toggleChange">{{selected?'手输':'选择'}}</a-button>
                        </a-tooltip>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="3" style="position: relative">
                      <a-button type="primary" class="add-row-custom" size="small" @click="addRowCustom">
                        <a-icon type="plus" /> 添加一行
                      </a-button>
                      <a-form-model-item label="费用明细" class="fee-label" prop="feeDetails">
                        <!-- <a-input v-model="model.feeDetails" placeholder="请输入费用明细"  ></a-input> -->
                        <div>
                          <a-row type="flex" style="margin-bottom: 6px; text-align: center" :gutter="4">
                            <a-col :span="4">报销项目</a-col>
                            <a-col :span="3">单据数量</a-col>
                            <a-col :span="6">摘要</a-col>
                            <a-col :span="5">金额</a-col>
                            <a-col :span="4">备注</a-col>
                            <a-col :span="2">操作</a-col>
                          </a-row>

                          <a-row
                            type="flex"
                            style="margin-bottom: 3px"
                            :gutter="4"
                            v-for="(item, index) in model.feeDetails"
                            :key="index"
                          >
                            <a-col :span="4">
                              <a-form-model-item
                                :prop="'feeDetails.' + index + '.item'"
                                :rules="[{ required: true, message: '请输入报销项目', trigger: 'blur' }]"
                              >
                                <a-input placeholder="报销项目" v-model="item.item" />
                              </a-form-model-item>
                            </a-col>
                            <a-col :span="3">
                              <a-form-model-item>
                                <a-input-number
                                  placeholder="单据数量"
                                  v-model="item.num"
                                  :min="1"
                                  :max="100"
                                  style="width: 100%"
                                />
                              </a-form-model-item>
                            </a-col>
                            <a-col :span="6">
                              <a-form-model-item>
                                <a-input placeholder="摘要" v-model="item.digest" :max-length="200" />
                              </a-form-model-item>
                            </a-col>
                            <a-col :span="5">
                              <a-form-model-item
                                :prop="'feeDetails.' + index + '.amount'"
                                :rules="[{ required: true, message: '请输入金额', trigger: 'blur' }]"
                              >
                                <a-input-number
                                  placeholder="金额"
                                  @blur="rowChange"
                                  :min="0.01"
                                  :max="999999999.99"
                                  v-model="item.amount"
                                  style="width: 100%"
                                />
                              </a-form-model-item>
                            </a-col>
                            <a-col :span="4">
                              <a-form-model-item>
                                <a-input placeholder="备注" v-model="item.remarks" />
                              </a-form-model-item>
                            </a-col>
                            <a-col :span="2">
                              <a-form-model-item style="text-align: center">
                                <a-icon type="minus-circle" @click="delRowCustom(index)" style="fontsize: 20px" />
                              </a-form-model-item>
                            </a-col>
                          </a-row>
                        </div>
                      </a-form-model-item>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <a-form-model-item class="flex-row" label="报销金额" prop="amount">
                        <a-input-number
                          v-model="model.amount"
                          placeholder="请输入报销金额"
                          @change="changeAmount"
                          style="width: 100%"
                        />
                      </a-form-model-item>
                    </td>
                    <td>
                      <a-form-model-item class="flex-row" label="借款金额" prop="loanAmount">
                        <a-input-number
                          v-model="model.loanAmount"
                          placeholder="请输入借款金额"
                          style="width: 100%"
                          :min="0.01"
                          :max="999999999.99"
                        />
                      </a-form-model-item>
                    </td>
                    <td>
                      <a-form-model-item class="flex-row" label="退款金额" prop="returnAmount">
                        <a-input-number
                          v-model="model.returnAmount"
                          placeholder="请输入退款金额"
                          style="width: 100%"
                          :min="0.01"
                          :max="999999999.99"
                        />
                      </a-form-model-item>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="3">
                      <a-form-model-item class="flex-row" label="金额大写" prop="amountInWords">
                        <a-input v-model="model.amountInWords" :read-only="true" style="border: none"></a-input>
                      </a-form-model-item>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="3" v-if="fileList">
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
                </tbody>
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
import { httpAction, getAction, } from '@/api/manage'
import JPagingSelect from '@/components/jeecg/JPagingSelect'
import ProcessViewer from '@/views/process/modules/ProcessViewer.vue'
import { getAmountChinese } from '@/utils/index'
import { isEmpty } from 'lodash'
import { FileHandleMixin } from '@/mixins/FileHandleMixin'
import JSelectProject from '@/views/scrm/modules/JSelectProject'

export default {
  name: 'FlwExpenseReimbursementForm',
  mixins:[FileHandleMixin],
  components: {
    JPagingSelect,
    ProcessViewer,
    JSelectProject
  },
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
      model: {
        feeDetails: [{}],
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      confirmLoading: false,
      validatorRules: {},
      depOptions: [],
      url: {
        add: '/scrm/flwExpenseReimbursement/add',
        edit: '/scrm/flwExpenseReimbursement/edit',
        queryById: '/scrm/flwExpenseReimbursement/queryById',
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
      type: 'handel',
      selected:true
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
    this.getCurrentUserDepart()
  },
  methods: {
    /**项目选择开始*/
    itemChange(id, row){
      if(row && row.length > 0){
        this.model.project= row[0].projectName
      }else{
        this.model.project = ''
      }
    },
    toggleChange(){
      this.selected = !this.selected
    },
    /**项目选择结束*/
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
      //判断初始时显示的项目信息
      this.selected = !isEmpty(record.projectId)
      this.visible = true
      this.getModelDetail()
      this.getFlowViewer()
    },
    addRowCustom() {
      this.model.feeDetails.push({})
      this.$forceUpdate()
    },
    delRowCustom(index) {
      var len = this.model.feeDetails.length
      if (len == 1) {
        this.$message.error('至少要有一条费用明细！')
        return
      }
      this.model.feeDetails.splice(index, 1)
      this.rowChange()
      this.$forceUpdate()
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
    handleChange(val) {
      this.model.depart = val
    },
    rowChange(va1) {
      var amount = 0
      var feeDetails = this.model.feeDetails
      if (feeDetails && feeDetails.length > 0) {
        feeDetails.forEach((item) => {
          if (!isEmpty(item) && item.hasOwnProperty('amount')) {
            amount = parseFloat(amount) + parseFloat(Number(item.amount))
          }
        })
      }
      this.model.amount = amount
      this.changeAmount(amount)
      this.$forceUpdate()
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
    text-align: center;
    line-height: 54px;
    th,
    td {
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
    flex-grow: 1;
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
.fee-label {
  &:deep(.ant-form-item-label) {
    width: 100%;
    text-align: center;
    label::after {
      content: none;
    }
  }
}
.add-row-custom {
  position: absolute;
  right: 8px;
  top: 8px;
  z-index: 1024;
}
</style>
