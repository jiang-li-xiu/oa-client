<template>
  <div>
    <a-spin :spinning="confirmLoading">
      <j-form-container :disabled="formDisabled">
        <a-form-model
          ref="form"
          :model="model"
          :rules="validatorRules"
          slot="detail"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-row>
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
        </a-form-model>
      </j-form-container>
      <a-card title="费用明细" :bordered="false" :bodyStyle="{ padding: 0, margin: '10px 0 20px 0' }">
        <a-form-model ref="tableformRef" :model="form">
          <a-table
            :columns="columns"
            rowKey="id"
            :pagination="false"
            :data-source="form.tripInfo"
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
            <a-form-model-item label="借款金额" prop="loanAmount" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
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
              <a-input v-model="model.totalReimbursementUpper" placeholder="请输入报销合计" :read-only="true"></a-input>
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
      <a-form-model ref="form2" :model="model2" :rules="commentRules" v-if="type == 'handel'">
        <a-row>
          <a-col :span="24">
            <a-form-model-item
              label="审批意见"
              :labelCol="{ xs: { span: 24 }, sm: { span: 3 } }"
              :wrapperCol="{ xs: { span: 24 }, sm: { span: 20 } }"
              prop="comment"
            >
              <a-textarea v-model="model2.comment" placeholder="请输入审批意见" :rows="4" :maxLength="200"></a-textarea>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-spin>

    <template v-if="type == 'handel'">
      <div class="button-group">
        <a-button @click="handleCancel">取消</a-button>
        <a-button @click="handleBack" type="danger" :loading="backLoading">退回</a-button>
        <a-button @click="handleProcess" type="primary" :loading="processLoading">通过</a-button>
        <a-popconfirm title="审批不通过审批流程会终止，是否继续？！" @confirm="() => handleStop()">
          <a-button type="danger">不通过</a-button>
        </a-popconfirm>
      </div>
    </template>
    <template>
      <a-modal
        :visible="visible2"
        :width="400"
        :keyboard="false"
        :closable="false"
        :centered="true"
        @ok="handleOk"
        @cancel="handleClose"
        :maskClosable="true"
        :confirm-loading="okLoading"
        :mask="true"
      >
        <a-form-model ref="form3" :model="model3" :rules="nodeRules">
          <a-row>
            <a-col :span="24">
              <a-form-item name="radio-button" label="退回节点">
                <a-radio-group @change="handleSelect" v-model="model.node">
                  <a-radio-button v-for="item in nodeList" :key="item.id" :value="item.id">{{
                    item.name
                  }}</a-radio-button>
                </a-radio-group>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form-model>
      </a-modal>
    </template>
  </div>
</template>

<script>
import { postAction, getAction } from '@/api/manage'

export default {
  name: 'CrmProjectForm',
  components: {},
  props: {
    //表单禁用
    disabled: {
      type: Boolean,
      default: false,
      required: false,
    },
    visible: {
      type: Boolean,
      default: false,
      required: true,
    },
    //表单数据
    record: {
      type: Object,
      default: {},
      required: true,
    },
    //表单数据
    type: {
      type: String,
      default: 'handel',
      required: false,
    },
  },
  data() {
    return {
      model: {
        files: [],
      },
      form: {
        tripInfo: [{}],
      },
      labelCol: { span: 6 },
      wrapperCol: { span: 15 },
      liaison: [],
      liaisonData: [],
      model2: { comment: '' },
      model3: { node: '' },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      targetKey: '',
      visible2: false,
      nodeList: [],
      depOptions: [],
      confirmLoading: false,
      loading: false,
      formDisabled: true,
      validatorRules: {},
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
              ellipsis: true,
            },
            {
              title: '天数',
              dataIndex: 'tripDays',
              key: 'tripDays',
              width: 120,
              ellipsis: true,
            },
            {
              title: '金额',
              dataIndex: 'tripAccommodationAmount',
              key: 'tripAccommodationAmount',
              width: 120,
              ellipsis: true,
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
      commentRules: {
        comment: [{ required: true, message: '请输入审批意见!' }],
      },
      nodeRules: {
        node: [{ required: true, message: '请选择节点!' }],
      },
      backLoading: false,
      processLoading: false,
      okLoading: false,
    }
  },
  computed: {},
  created() {},
  mounted() {
    this.handel()
  },
  methods: {
    handel() {
      this.getCurrentUserDepart()
      let that = this
      getAction(`scrm/flwTravelReimbursement/${this.record.businessKey || this.record.id}`).then((res) => {
        if (res.success) {
          that.model = res.result
          this.form.tripInfo = res.result.tripInfo
        } else {
          that.$message.warning(res.message)
        }
      })
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
    handleChange(val) {
      this.model.depart = val
    },
    handleProcess() {
      let that = this
      this.$refs.form2.validate((valid) => {
        if (valid) {
          this.processLoading = true
          postAction('/scrm/flwTravelReimbursement/complete', {
            taskId: that.record.taskId,
            procInsId: that.record.procInsId,
            comment: that.model2.comment,
            variables: { message: that.model2.comment },
            businessData: that.model,
          })
            .then((res) => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('close')
                that.$emit('ok')
              } else {
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              setTimeout(() => {
                this.processLoading = false
              }, 2000)
            })
        }
      })
    },
    handleBack() {
      // 触发表单验证
      this.$refs.form2.validate((valid) => {
        if (valid) {
          let that = this
          this.backLoading = true
          postAction('/workflow/process/returnList', { taskId: that.record.taskId })
            .then((res) => {
              if (res.success) {
                that.visible2 = true
                that.nodeList = res.result
              } else {
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              setTimeout(() => {
                this.backLoading = false
              }, 1000)
            })
        }
      })
    },
    handleOk() {
      let targetKey = this.targetKey
      let that = this
      if (targetKey == '' || targetKey == null) {
        that.$message.warning('请选择回退节点！')
        return
      }
      this.okLoading = true
      postAction('/workflow/process/return', {
        targetKey: targetKey,
        taskId: that.record.taskId,
        comment: that.model2.comment,
      })
        .then((res) => {
          if (res.success) {
            that.$message.success(res.message)
            that.visible2 = false
            that.$emit('close')
            that.$emit('ok')
          } else {
            that.$message.warning(res.message)
          }
        })
        .finally(() => {
          setTimeout(() => {
            this.okLoading = false
          }, 1000)
        })
    },
    handleClose() {
      this.visible2 = false
    },
    handleStop() {
      let that = this
      this.$refs.form2.validate((valid) => {
        if (valid) {
          postAction('/scrm/flwTravelReimbursement/reject', {
            procInsId: that.record.procInsId,
            taskId: that.record.taskId,
            comment: that.model2.comment,
          }).then((res) => {
            if (res.success) {
              that.$message.success(res.message)
              that.handleCancel()
              that.$emit('ok')
            } else {
              that.$message.warning(res.message)
            }
          })
        }
      })
    },
    handleSelect(data) {
      this.targetKey = data.target.value
    },
    ok() {
      this.$emit('choose', this.choosedIcon)
    },
    handleCancel() {
      this.$emit('close')
    },
    edit(record) {
      this.handel()
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
    &:deep(.ant-form-item-control-wrapper) {
      flex-grow: 1;
      margin-right: 6px;
    }
    &:deep(.ant-form-item-label) {
      min-width: 72px;
    }
  }
}

.ant-modal {
  &:deep(.ant-modal-body) {
    padding-top: 0 !important;
  }
}
.ant-form-item {
  margin-bottom: 5px !important;
}
.button-group {
  text-align: right;
  > button {
    margin-left: 6px;
  }
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
.ant-select-disabled {
  color: rgba(0, 0, 0, 0.65) !important;
  background-color: #fff !important;
  &:deep(.ant-select-disabled .ant-select-selection) {
    background-color: #fff !important;
  }
}
// 表头前加*
.form-table-heard:before {
  content: '*';
  color: red;
}
</style>
