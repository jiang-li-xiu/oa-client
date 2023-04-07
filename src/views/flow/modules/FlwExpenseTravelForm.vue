<template>
  <a-spin :spinning="confirmLoading">
    <a-form-model ref="form" :model="model" :rules="validatorRules" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-tabs defaultActiveKey="activeKey" @change="changeTabs">
        <a-tab-pane key="1" :tab="tabName">
          <j-form-container :disabled="formDisabled">
            <a-row slot="detail">
              <a-card title="基本信息" :bordered="false">
                <a-col :span="8">
                  <a-form-model-item label="部门" prop="depart">
                    <a-select
                      ref="select"
                      v-model="model.depart"
                      :options="depOptions"
                      :field-names="{ label: 'name', value: 'id' }"
                      @change="handleChange"
                    ></a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="申请人" prop="userId">
                    <a-input v-model="model.userName" placeholder="请输入申请人"></a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="联系电话" prop="phone">
                    <a-input v-model="model.phone" placeholder="请输入联系电话"></a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="24">
                  <a-form-model-item
                    label="项目名称"
                    prop="projectName"
                    :label-col="{ span: 2 }"
                    :wrapper-col="{ span: 21 }"
                  >
                    <a-input v-model="model.projectName" placeholder="请输入项目名称"></a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="24">
                  <a-form-model-item
                    label="出差事由"
                    prop="tripReason"
                    :label-col="{ span: 2 }"
                    :wrapper-col="{ span: 21 }"
                  >
                    <a-textarea v-model="model.tripReason" placeholder="请输入出差事由" :rows="5"></a-textarea>
                  </a-form-model-item>
                </a-col>
              </a-card>
            </a-row>
          </j-form-container>
          <a-card title="费用明细" :bordered="false" :bodyStyle="{ padding: 0, margin: '10px 0 20px 0' }">
            <a-form-model ref="tableformRef">
              <a-table
                :columns="columns"
                rowKey="id"
                :pagination="false"
                :data-source="model.tripInfo"
                bordered
                :scroll="{ x: true }"
                :loading="loading"
              >
              </a-table>
            </a-form-model>
          </a-card>
          <j-form-container :disabled="formDisabled">
            <a-row slot="detail">
              <a-col :span="12">
                <a-form-model-item
                  label="报销合计（小写）"
                  prop="totalReimbursementLower"
                  :label-col="{ span: 8 }"
                  :wrapper-col="{ span: 16 }"
                >
                  <a-input
                    type="number"
                    min="0"
                    max="999999999999.99"
                    :max-length="15"
                    suffix="元"
                    v-model="model.totalReimbursementLower"
                    placeholder="请输入报销合计"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item
                  label="借款金额"
                  prop="loanAmount"
                  :label-col="{ span: 8 }"
                  :wrapper-col="{ span: 16 }"
                >
                  <a-input
                    type="number"
                    min="0"
                    max="999999999999.99"
                    :max-length="15"
                    suffix="元"
                    v-model="model.loanAmount"
                    placeholder="请输入借款金额"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item
                  label="报销合计（大写）"
                  prop="totalReimbursementUpper"
                  :label-col="{ span: 8 }"
                  :wrapper-col="{ span: 16 }"
                >
                  <a-input
                    v-model="model.totalReimbursementUpper"
                    placeholder="请输入报销合计"
                    :read-only="true"
                  ></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item
                  label="退（补）金额"
                  prop="refundAmount"
                  :label-col="{ span: 8 }"
                  :wrapper-col="{ span: 16 }"
                >
                  <a-input
                    type="number"
                    min="0"
                    max="999999999999.99"
                    :max-length="15"
                    suffix="元"
                    v-model="model.refundAmount"
                    placeholder="请输入退（补）金额"
                  />
                </a-form-model-item>
              </a-col>
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
  </a-spin>
</template>

<script>
import ProcessViewer from '@/views/process/modules/ProcessViewer.vue'
import { httpAction, getAction } from '@/api/manage'
import { generateDate } from '@/utils/util'

export default {
  name: 'FlwExpenseBudgetForm',
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
      labelCol: { span: 6 },
      wrapperCol: { span: 15 },
      confirmLoading: false,
      validatorRules: {},
      depOptions: [],
      loading: false,
      columns: [
        {
          title: '起止时间及地址',
          dataIndex: 'position',
          width: 120,
          key: 'position',
          ellipsis: true,
          align: 'center',
          children: [
            {
              title: '开始时间',
              dataIndex: 'startTime',
              key: 'startTime',
              width: 120,
              ellipsis: true,
            },
            {
              title: '起点',
              dataIndex: 'startAddress',
              key: 'startAddress',
              width: 120,
              ellipsis: true,
            },
            {
              title: '终止时间',
              dataIndex: 'endTime',
              key: 'endTime',
              width: 120,
              ellipsis: true,
            },
            {
              title: '终点',
              dataIndex: 'endAddress',
              key: 'endAddress',
              width: 120,
              ellipsis: true,
            },
          ],
        },
        {
          title: '交通费',
          dataIndex: 'ccc',
          width: 120,
          key: 'ccc',
          ellipsis: true,
          align: 'center',
          children: [
            {
              title: '工具',
              dataIndex: 'vehicle',
              key: 'vehicle',
              width: 120,
              ellipsis: true,
            },
            {
              title: '单据',
              dataIndex: 'document',
              key: 'document',
              width: 120,
              ellipsis: true,
            },
            {
              title: '金额',
              dataIndex: 'trafficAmount',
              key: 'trafficAmount',
              width: 120,
              ellipsis: true,
            },
          ],
        },
        {
          title: '住宿费',
          dataIndex: 'yyy',
          width: 120,
          key: 'yyy',
          ellipsis: true,
          align: 'center',
          children: [
            {
              title: '人数',
              dataIndex: 'peopleTotal',
              key: 'peopleTotal',
              width: 120,
              ellipsis: true,
            },
            {
              title: '天数',
              dataIndex: 'days',
              key: 'days',
              width: 120,
              ellipsis: true,
            },
            {
              title: '金额',
              dataIndex: 'accommodationAmount',
              key: 'accommodationAmount',
              width: 120,
              ellipsis: true,
            },
          ],
        },
        {
          title: '出差补助',
          width: 120,
          ellipsis: true,
          align: 'center',
          children: [
            {
              title: '人数',
              dataIndex: 'tripPeopleTotal',
              key: 'tripPeopleTotal',
              width: 120,
            },
            {
              title: '天数',
              dataIndex: 'tripDays',
              key: 'tripDays',
              width: 120,
            },
            {
              title: '金额',
              dataIndex: 'tripAccommodationAmount',
              key: 'tripAccommodationAmount',
              width: 120,
            },
          ],
        },
        {
          title: '其他',
          dataIndex: 'otherInfo',
          key: 'otherInfo',
          width: 120,
          ellipsis: true,
        },
        {
          title: '备注',
          dataIndex: 'remark',
          key: 'remark',
          width: 120,
          ellipsis: true,
        },
      ],
      dataSource: [],
      // url: {
      //   add: '/scrm/flwExpenseBudget/add',
      //   edit: '/scrm/flwExpenseBudget/edit',
      //   queryById: '/scrm/flwExpenseBudget/queryById',
      // },
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
    this.getCurrentUserDepart()
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
        businessKey: this.model.id,
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
        businessKey: this.model.id,
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
      let data = generateDate('月度')
      this.model.timeStart = data.timeStart
      this.model.timeEnd = data.timeEnd
    },
    edit(record) {
      this.model = Object.assign({}, record)
      this.visible = true
      this.getModelDetail()
      this.getFlowViewer()
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
    handleChange(value, option) {
      this.model.depart = value
      this.model.departName = option.componentOptions.children[0].text
    },
  },
}
</script>

<style lang="less" scoped>
.ant-card {
  &:deep(.ant-card-head) {
    padding: 0 !important;
    min-height: auto;
    .ant-card-head-title {
      padding: 0 !important;
    }
  }
  &:deep(.ant-card-body) {
    padding: 12px 0;
  }
}
</style>
