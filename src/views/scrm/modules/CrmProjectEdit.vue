<template>
  <a-modal
    title="编辑"
    width="80%"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="取消"
    okText="保存"
  >
    <!-- <a-spin :spinning="confirmLoading"> -->
    <!-- <a-spin tip="加载中..." :spinning="loading"> -->
    <a-form-model ref="ruleForm" :model="formParams" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-row>
        <a-col :span="24" class="title">项目信息</a-col>
        <a-col :span="12">
          <a-form-model-item label="项目名称" prop="projectName">
            <a-input v-model="formParams.projectName" placeholder="请输入联系人" readOnly disabled />
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="客户名称" prop="customName">
            <a-input v-model="formParams.customName" placeholder="请输入客户名称" readOnly disabled />
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="联系人" prop="liaison">
            <a-input v-model="formParams.liaison" placeholder="请输入联系人" readOnly disabled />
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="联系电话" prop="phone">
            <a-input v-model="formParams.phone" placeholder="请输入联系电话" readOnly disabled />
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="立项时间" prop="buildDate">
            <j-date
              v-model="formParams.buildDate"
              :showTime="true"
              dateFormat="YYYY-MM-DD"
              :style="{ width: '100%' }"
              placeholder="请选择立项时间"
            />
            <!-- <span>{{ formParams.buildDate }}</span> -->
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="负责人" prop="realName" hidden>
            <a-input v-model="formParams.realName" placeholder="请输入负责人" hidden />
          </a-form-model-item>
          <a-form-model-item label="负责人" prop="inCharge">
            <!-- <a-select v-model="formParams.inCharge" @select="changeUser" placeholder="请选择负责人" show-search>
              <a-select-option v-for="item in inChargeList" :key="item.id" :value="item.username">
                {{ item.realname }}
              </a-select-option>
            </a-select> -->
            <j-select-user-by-dep
              v-model="formParams.inCharge"
              @changeUser="changeUser"
              :multi="false"
            ></j-select-user-by-dep>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="项目类型" prop="projectType">
            <!-- <span>{{ projectType(formParams.projectType) }}</span> -->
            <template>
              <a-select v-model="formParams.projectType" show-search placeholder="请选择">
                <a-select-option :value="1">工程项目</a-select-option>
                <a-select-option :value="2">渠道项目</a-select-option>
                <a-select-option :value="3">产品销售</a-select-option>
                <a-select-option :value="4">软件销售</a-select-option>
                <a-select-option :value="5">软件定制</a-select-option>
              </a-select>
            </template>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="项目总额" prop="amount">
            <a-input-number v-model="formParams.amount" placeholder="请输入项目总额" :style="{ width: '100%' }" />
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="项目概算" prop="budget">
            <a-input-number v-model="formParams.budget" placeholder="请输入项目概算" :style="{ width: '100%' }" />
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="项目地点" prop="projectAddr">
            <a-input v-model="formParams.projectAddr" placeholder="请输入项目地点" />
          </a-form-model-item>
        </a-col>
        <a-col :span="24">
          <a-form-model-item label="概要说明" prop="outlines" :label-col="{ span: 2 }" :wrapper-col="{ span: 20 }">
            <a-textarea v-model="formParams.outlines" placeholder="请输入概要说明" :rows="4" />
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
    <!-- </a-spin> -->
    <!-- </a-spin> -->
  </a-modal>
</template>


<script>
import { httpAction, getAction } from "@/api/manage"
import JSelectProject from "@/views/scrm/modules/JSelectProject"
import JSelectCustomer from "@/views/scrm/modules/JSelectCustomer"
import { saveProject } from "@/api/project-management/plan-management/PlanManagement.js"
export default {
  name: "CrmProjectEdit",
  components: {
    JSelectProject,
    JSelectCustomer,
  },
  props: {},
  data() {
    return {
      title: "编辑",
      visible: false,
      formParams: {},
      currnetId: "",
      currnetRow: {},
      confirmLoading: false,
      inChargeList: [], //负责人列表
      model: {
        conditions: [{}],
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      types: [
        { value: "String", label: "String" },
        { value: "Number", label: "Number" },
        // {value:'Double', label:'Double'},
        // {value:'BigDecimal', label:'BigDecimal'}
      ],
      // 表单验证规则
      rules: {
        projectType: [
          {
            required: true,
            message: "项选择目类型",
            trigger: "change",
          },
        ],
        amount: [
          {
            required: true,
            message: "请输入项目总额",
            trigger: "change",
          },
        ],
        inCharge: [
          {
            required: true,
            message: "请选择负责人",
            trigger: "change",
          },
        ],
        // realName: [
        //   {
        //     required: true,
        //     message: "请选择负责人",
        //     trigger: "change",
        //   },
        // ],
        buildDate: [
          {
            required: true,
            message: "请选择日期",
            trigger: "change",
          },
        ],
        budget: [
          {
            required: true,
            message: "请输入项目概算",
            trigger: "blur",
          },
        ],
        projectAddr: [
          {
            required: true,
            message: "请输入目地点",
            trigger: "change",
          },
        ],
        purchaseContext: [
          {
            required: true,
            message: "请输入采购内容",
            trigger: "blur",
          },
        ],
        // priceControl: [{ required: true, message: '请输入上控价', trigger: 'blur' }],
        outlines: [
          {
            required: true,
            message: "请输入概要说明",
            trigger: "change",
          },
        ],
      },
      url: {
        add: "/workflow/actReWorkflow/add",
        edit: "/workflow/actReWorkflow/edit",
        queryById: "/workflow/actReWorkflow/queryById",
      },
      readOnly: false,
      iconChooseVisible: false,
      textVals: "",
      checkedData: [],
      predefine: ["#0089ff", "#00C458", "#FC943D", "#FB602D", "#ffd700", "#90ee90", "#00ced1", "#c71585"],
    }
  },
  created() {},
  mounted() {
    this.getinChargeList()
  },
  computed: {
    commentType() {
      return (val) => {
        switch (val) {
          case 1:
            return "待审批"
          case 2:
            return "审批通过"
          case 3:
            return "审批不通过"
        }
      }
    },
    approveTypeTag() {
      return (val) => {
        switch (val) {
          case 1:
            return "orange"
          case 2:
            return "green"
          case 3:
            return "red"
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
    open(record) {
      this.currnetId = record.id
      this.currnetRow = record
      // console.log('idididididiidid', this.currnetRow.id)
      this.formParams = { ...record }
      this.visible = true
      console.log("编辑项目", this.formParams)
    },
    close() {
      this.visible = false
      this.formParams = {}
      this.$refs.ruleForm.clearValidate()
      // this.$refs.planForm ? this.$refs.planForm.close() : ''
    },
    handleCancel() {
      this.close()
    },
    changeUser(obj) {
      console.log("负责人", obj)
      this.formParams.realName = obj[0].realname
      //usrname
      // this.inChargeList.forEach((item) => {
      //   if (item.username == val) {
      //     this.formParams.realName = item.realname
      //   }
      // })
    },
    handelChange() {},
    // 负责人列表
    getinChargeList() {
      getAction("/sys/user/queryUserComponentData").then((res) => {
        if (res.success) {
          this.inChargeList = res.result.records
          // this.ipagination.total = res.result.total
        }
      })
    },
    //提交
    handleOk() {
      console.log("编辑提交的数据", this.formParams)
      if (!this.formParams.realName) {
        this.formParams.inCharge = ""
        this.$refs.ruleForm.validate()
        // this.$refs.ruleForm.scrollToField("inCharge")
        this.$message.error("请选择负责人")
      }
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let data = {
            ...this.formParams,
            // schemeInfos: schemeInfo.toString() || [],
            // schemeProductInfos: schemeProductInfo.toString() || [],
            schemeType: 1, //判断方案和选型 1-方案信息，2-产品信息
            // project: project,
            projectId: this.formParams.id,
            amount: this.formParams.amount,
            budget: this.formParams.budget,
            priceControl: this.formParams.priceControl,
          }
          this.confirmLoading = true
          saveProject(data)
            .then((res) => {
              if (res.success) {
                this.$message.success(res.message)
                this.$emit("refresh")
              } else {
                this.$message.error(res.message)
              }
              this.close()
            })
            .finally(() => {
              this.confirmLoading = false
              setTimeout(() => {
                this.okLoading = false
              }, 2000)
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
.conditions-box {
  &:deep(.ant-form-item) {
    margin-bottom: 0 !important;
  }
}
.el-color-picker {
  &:deep(.el-color-picker__trigger) {
    border: none;
    .el-color-picker__color {
      border: none;
    }
  }
}
.title {
  background-color: #f8faff;
  padding: 10px;
  margin-bottom: 10px;
  font-weight: 600;
}

.buttom {
  margin: 10px 5px;
}

// 隐藏上传的文件名称图标
// ::v-deep .ant-upload-list {
//   display: none;
// }
// ::v-deep .ant-upload-list-text {
//   display: none;
// }
// ::v-deep .ant-input-number-handler-wrap {
//   z-index: 0;
// }
// 表头前加*
.form-table-heard:before {
  content: "*";
  color: red;
}

.overflowStyle {
  // max-width: 250px !important;
  // max-height: 70px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-wrap: break-word;
  word-break: break-all;
  text-align: left;
}
</style>