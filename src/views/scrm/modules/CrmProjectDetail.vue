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
      <a-row>
        <!-- 基础信息 -->
        <a-tabs default-active-key="1" @change="handleChange" :activeKey="activeKey">
          <a-tab-pane key="1" tab="基础信息">
            <a-col :span="24" class="title">项目信息</a-col>
            <a-col :span="8" class="content">
              客户名称: <span>{{ formParams.customName || formParams.customerName }}</span>
            </a-col>
            <a-col :span="8" class="content">
              联系人: <span>{{ formParams.liaison }}</span>
            </a-col>
            <a-col :span="8" class="content">
              联系方式:<span>{{ formParams.phone }}</span>
            </a-col>
            <a-col :span="8" class="content">
              负责人: <span>{{ formParams.inCharge }}</span>
            </a-col>
            <a-col :span="8" class="content">
              立项时间:<span>{{ formParams.buildDate }}</span>
            </a-col>
            <a-col :span="8" class="content">
              项目编号: <span>{{ formParams.projectNo }}</span>
            </a-col>
            <a-col :span="24" class="content">
              项目名称: <span>{{ formParams.projectName }}</span>
              <!-- 项目名称: <span>{{ getDictText('payment_collection_status', formParams.status) }}</span> -->
            </a-col>
            <a-col :span="24" class="content">
              项目地点: <span>{{ formParams.projectAddr }}</span>
            </a-col>
            <a-col :span="8" class="content">
              项目类型: <span>{{ projectType(formParams.projectType) }}</span>
            </a-col>
            <a-col :span="8" class="content">
              项目总额:<span>{{ formParams.amount }}</span>
            </a-col>
            <a-col :span="8" class="content">
              项目概算:<span>{{ formParams.budget }}</span>
            </a-col>
            <a-col :span="24" class="content">
              概要说明:<span>{{ formParams.outlines }}</span>
            </a-col>
            <a-col :span="24" class="title" :style="{ marginBottom: '30px' }">项目流程</a-col>
            <a-col :span="24">
              <div class="block" v-if="historyTaskList && historyTaskList.length > 0">
                <a-timeline>
                  <a-timeline-item
                    v-for="(item, index) in historyTaskList"
                    :key="index"
                    :icon="setIcon(item.operatingTime)"
                    :color="setColor(item.operatingTime)"
                  >
                    <p style="font-weight: 700">{{ item.title }}</p>
                    <a-card class="box-card" shadow="hover">
                      <a-descriptions :column="3" :labelStyle="{ 'font-weight': 'bold' }">
                        <a-descriptions-item label="操作人">{{ item.operator || "-" }}</a-descriptions-item>
                        <a-descriptions-item label="完成时间">{{ item.operatingTime || "-" }}</a-descriptions-item>
                        <a-descriptions-item label="状态">{{ commentType(item.status) || "-" }}</a-descriptions-item>
                      </a-descriptions>
                      <a-divider orientation="left">
                        <a-tag :color="approveTypeTag(item.status)">{{ commentType(item.status) }}</a-tag>
                      </a-divider>
                    </a-card>
                  </a-timeline-item>
                </a-timeline>
              </div>
              <div v-else>- 暂无流程 -</div>
            </a-col>
          </a-tab-pane>

          <template v-if="is_show">
            <!-- 项目方案 -->
            <a-tab-pane key="3" tab="项目方案" force-render>
              <a-col :span="24" class="title">项目方案</a-col>
              <a-col :span="24">
                <CrmProjectPlanDetail
                  ref="planForm"
                  :dataSource="dataSource"
                  :currnetId="currnetId"
                ></CrmProjectPlanDetail>
              </a-col>
            </a-tab-pane>
            <!-- 报价 -->
            <a-tab-pane key="4" tab="利润表" force-render>
              <a-col :span="24" class="title">利润表</a-col>
              <a-col :span="24">
                <CrmProjectProfitDetail
                  ref="profitForm"
                  :currnetId="currnetId"
                  :formParams="this.formParams"
                ></CrmProjectProfitDetail>
              </a-col>
            </a-tab-pane>
          </template>
        </a-tabs>
      </a-row>
    </a-spin>
    <div class="drawer-bootom-button" v-if="activeKey == 2 && dataQuotation == null">
      <!-- 1保存 2已提交 3审核通过 4审核不通过' -->
      <a-button
        @click="handleApproval"
        type="primary"
        style="margin-right: 0.8rem"
        :disabled="dataQuotation.status == 2"
        >提交审批
      </a-button>
      <a-button @click="handleOk">保存 </a-button>
      <a-button @click="close" style="margin-right: 0.8rem">取消</a-button>
    </div>
  </a-drawer>
</template>

<script>
import {
  getQuotationDetail,
  addQuotationSave,
  addQuotationSubmit,
  getApprovalInfo,
} from "@/api/set-project/set-project.js"
import CrmProjectPlanDetail from "./CrmProjectPlanDetail"
import CrmProjectProfitDetail from "./CrmProjectProfitDetail"
// 混入
import { TableListMixin } from "@/mixins/TableListMixin"
import { getDictText } from "@/api/api.js"
export default {
  mixins: [TableListMixin],
  components: {
    CrmProjectPlanDetail,
    CrmProjectProfitDetail,
  },
  props: {
    is_show: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      // 开关
      visible: false,
      // 是否禁用
      disableSubmit: false,
      // 标题
      title: "详情",
      // 表单配置
      labelCol: { span: 6 },
      wrapperCol: { span: 17 },
      // 表单参数
      formParams: {},
      dataQuotation: {}, //报价
      dataSource: [{ num: "1", id: "11" }],
      disableMixinCreated: true,
      activeKey: "1",
      // 加载动画开关
      loading: false,
      currnetId: "",
      currnetRow: {},
      quotationSubmit: {},
      historyTaskList: [
        {
          assigneeName: "管理员",
          taskName: "审批",
          // finishTime: '2022-12-15',
          commentList: [
            {
              type: "3",
              time: "2022-12-15",
            },
          ],
        },
        {
          assigneeName: "管理员",
          taskName: "方案审批",
          finishTime: "2022-12-15",
          commentList: [
            {
              type: "2",
              time: "2022-12-15",
            },
          ],
        },
      ],
    }
  },
  computed: {
    commentType() {
      return (val) => {
        switch (val) {
          case 1:
            return "未完成"
          case 2:
            return "进行中"
          case 3:
            return "已完成"
        }
      }
    },
    approveTypeTag() {
      return (val) => {
        switch (val) {
          case 1:
            return "red"
          case 2:
            return "orange"
          case 3:
            return "green"
        }
      }
    },
    projectType() {
      return (val) => {
        switch (val) {
          case 1:
            return "工程项目"
          case 2:
            return "渠道项目"
          case 3:
            return "产品销售"
          case 4:
            return "软件销售"
          case 5:
            return "软件定制"
        }
      }
    },
  },
  methods: {
    getDictText,
    quotationData(data) {
      console.log(data)
      this.quotationSubmit = data
    },
    // 切换tab
    handleChange(key) {
      console.log(key)
      this.activeKey = key
      if (key == 2) {
        this.$refs.quotationForm.getQuotationDetail(this.currnetRow.id)
      } else if (key == 3) {
        this.$refs.planForm.getSchemeListDetail(this.currnetRow.id)
      } else if (key == 4) {
        this.$refs.profitForm.getProfitsListDetail(this.currnetRow.id)
      } else if (key == 5) {
        this.$refs.purchaseForm.getPurchaseListDetail(this.currnetRow.id)
      }
    },
    getQuotationDetail(id) {
      getQuotationDetail(id).then((res) => {
        console.log("res----------", res)
        if (res.success) {
          this.dataQuotation = res.result
        }
      })
    },
    // 流程信息
    getApprovalInfo(id) {
      getApprovalInfo(id).then((res) => {
        if (res.success) {
          this.historyTaskList = res.result.flows
        }
      })
    },
    close() {
      this.visible = false
      this.formParams = {}
      this.currnetRow = {}
      this.activeKey = "1"
      this.currnetId = ""
      this.quotationSubmit = {}
      this.$refs.planForm ? this.$refs.planForm.close() : ""
    },
    open(record) {
      console.log("打开项目----", record)
      this.currnetId = record.id
      this.currnetRow = record
      // console.log('idididididiidid', this.currnetRow.id)
      this.formParams = { ...record }
      this.getApprovalInfo(record.id)
      // this.getQuotationDetail(record.id)
      this.visible = true
    },
    setIcon(val) {
      if (val) {
        return "el-icon-check"
      } else {
        return "el-icon-time"
      }
    },
    setColor(val) {
      if (val) {
        return "#2bc418"
      } else {
        return "#b3bdbb"
      }
    },
    // 审批
    handleApproval() {
      console.log("审批----", this.quotationSubmit, this.$store.getters.userInfo)
      this.$refs.quotationForm.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let data = {
            ...this.quotationSubmit,
            department: this.$store.getters.userInfo.orgCodeTxt, //部门名称
          }
          addQuotationSubmit(data).then((res) => {
            if (res.success) {
              this.$message.success(res.message)
              this.$emit("refresh")
            } else {
              this.$message.error(res.message)
            }
            this.close()
          })
        } else {
          return false
        }
      })
    },
    //提交
    handleOk() {
      console.log("提交---------", this.quotationSubmit)
      this.$refs.quotationForm.$refs.ruleForm.validate((valid) => {
        if (valid) {
          addQuotationSave(this.quotationSubmit).then((res) => {
            if (res.success) {
              this.$message.success(res.message)
              this.$emit("refresh")
            } else {
              this.$message.error(res.message)
            }
            this.close()
          })
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
  // margin: 20px 0;
  font-weight: 600;
}
.content {
  padding: 0 20px;
  margin: 20px 0;
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
