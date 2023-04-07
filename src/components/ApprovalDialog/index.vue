<!--
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-09-19 17:17:44
 * @LastEditors: JLX
 * @LastEditTime: 2022-11-15 09:53:52
-->
<template>
  <div>
    <a-modal title="审批" :width="900" :visible.sync="visible" :confirmLoading="loading" @cancel="close">
      <a-spin tip="加载中..." :spinning="loading">
        <a-form-model ref="ruleForm" :model="formParams" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-row>
            <a-col :span="24">
              <a-form-model-item label="选择审批流程">
                <a-select v-model="formParams.details" placeholder="请选择审批流程" @change="handleChange">
                  <a-select-option v-for="item in processList" :key="item.id" :value="item.id">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </a-spin>

      <template slot="footer">
        <a-button type="dashed" @click="close">取消</a-button>
        <a-button type="primary" @click="handleOks" :loading="loading">确认</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
// 利润审批API
import {
  getProcessList,
  addApproval,
  editApproval,
  detailApproval,
} from '@/api/project-management/foreign-price-management/ProjectProfit.js'
// 采购审批
import { postProcurementApproval } from '@/api/procurement/ProcurementList.js'
import moment from 'dayjs'
export default {
  props: {
    //2-利润表审批 4-采购单审批
    type: {
      type: Number,
      default: 2,
    },
  },
  data() {
    return {
      // 开关
      visible: false,
      // 表单配置
      labelCol: { span: 6 },
      wrapperCol: { span: 17 },
      // 加载动画开关
      loading: false,
      // 表单参数
      formParams: {
        applicat: this.$store.getters.userInfo.realname, //当前申请人
        department: this.$store.getters.userInfo.orgCodeTxt, //当前申请人所在部门
        // selectTime: moment().format('YYYY-MM-DD HH:mm:ss'), //申请时间
        details: this.id, //利润表id
        // processName: '',
        // pendingId: '',
        approvalProcess: [
          //流程内容
          // {
          //   processName: '',
          //   pendingId: ''
          // }
        ],
      },
      processList: [], //流程列表
      // 表单验证规则
      rules: {
        approvalProcess: [{ required: true, message: '请选择审批流程', trigger: 'blur' }],
      },
      id: '', //传过来的利润表id,
      data: [],
      proInfo: [], //采购信息，审批新增编辑采购审批时要传
    }
  },

  methods: {
    moment,
    // 打开弹窗
    open(id, proInfo) {
      console.log(id, '采购信息--', proInfo)
      this.id = id
      this.proInfo = proInfo
      this.getProcessList()
      this.visible = true
      console.log(this.$store.getters.userInfo)
    },

    // 关闭弹窗，点击遮罩层或右上角叉或取消按钮时触发
    close() {
      this.visible = false
      // 重置表单
      // this.$refs.ruleForm.resetFields()
      this.formParams = {
        applicat: this.$store.getters.userInfo.realname, //当前申请人
        department: this.$store.getters.userInfo.orgCodeTxt, //当前申请人所在部门
        details: '', //利润表id
        // processName: '',
        // pendingId: '',
        approvalProcess: [
          //流程内容
          // {
          //   processName: '',
          //   pendingId: ''
          // }
        ],
      }
      this.processList = []
      this.data = []
    },

    // 审批流程列表
    getProcessList() {
      getProcessList().then((res) => {
        if (res.success) {
          this.processList = res.result.records
          // console.log(this.processList)
        }
      })
    },

    // 选择框事件
    handleChange(value) {
      let selectProcess = this.processList.filter((item) => item.id == value)
      // 处理数据
      this.data = JSON.parse(selectProcess[0].approvalProcess)
      console.log(this.data)
      this.formParams.approvalProcess = this.data
      // this.formParams.approvalProcess[0].processName = this.data[0].processName
      // this.formParams.approvalProcess[0].pendingId = this.data[0].pendingId

      console.log(this.formParams.approvalProcess)
    },

    handleOks() {
      console.log(this.id, this.formParams, this.type)
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let data = {
            ...this.formParams,
            details: this.id,
            prodProfitsVo: this.proInfo,
          }
          // [0, 1, 2].includes(this.type)
          if (this.type == 0) {
            // 新增利润审批接口
            addApproval(data).then((res) => {
              if (res.success) {
                this.$message.success(res.message)
                this.$emit('refreshClose')
              } else {
                this.$message.error(res.message)
              }
              this.close()
            })
          } else if (this.type == 1) {
            // 编辑利润审批接口
            editApproval(data).then((res) => {
              if (res.success) {
                this.$message.success(res.message)
                this.$emit('refreshClose')
              } else {
                this.$message.error(res.message)
              }
              this.close()
            })
          } else if (this.type == 2) {
            // 详情利润审批接口
            detailApproval({ ...this.formParams, details: this.id }).then((res) => {
              if (res.success) {
                this.$message.success(res.message)
                this.$emit('refreshClose')
              } else {
                this.$message.error(res.message)
              }
              this.close()
            })
          } else if (this.type == 4) {
            // 采购审批接口
            postProcurementApproval(this.$store.getters.userInfo.realname, {
              ...this.formParams,
              details: this.id,
            }).then((res) => {
              if (res.success) {
                this.$message.success(res.message)
                this.$emit('refreshClose')
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
  // mounted() {
  //   this.$bus.$on('submitApproval', this.handleOks)
  // },
  // beforeDestroy() {
  //   this.$bus.$off('submitApproval', this.handleOks)
  // }
}
</script>

<style lang="less" scoped>
.config-box {
  padding-left: 60px;
}
.space-margin {
  margin-bottom: 20px;
}
</style>
