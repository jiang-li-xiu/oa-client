<!--
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-09-19 17:17:44
 * @LastEditors: JLX
 * @LastEditTime: 2023-02-09 16:45:22
-->
<template>
  <div>
    <a-modal title="流程审批" :width="900" :visible.sync="visible" :confirmLoading="loading" @cancel="close">
      <a-spin tip="加载中..." :spinning="loading">
        <a-form-model
          tip="加载中..."
          ref="ruleForm"
          :model="formParams"
          v-bind="formItemLayoutWithOutLabel"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-row>
            <a-col :span="12">
              <a-form-model-item
                label="流程名称"
                prop="name"
                :rules="{
                  required: true,
                  message: '请输入流程名称',
                }"
              >
                <a-input v-model="formParams.name" placeholder="请输入流程名称" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item
                label="流程说明"
                prop="instructions"
                :rules="{
                  required: true,
                  message: '请输入流程说明',
                }"
              >
                <a-input v-model="formParams.instructions" placeholder="请输入流程说明" />
              </a-form-model-item>
            </a-col>

            <a-col :span="24">
              <div class="config-box">
                流程设置
                <!-- <div class="flex align-center space-margin level-choice">
                  <a-form-model-item
                    label="第一级"
                    prop="pendingId"
                    :rules="{
                      required: true,
                      message: '请选择流程设置',
                    }"
                    :label-col="{ span: 3 }"
                    :wrapper-col="{ span: 19 }"
                  >
                    <a-input placeholder="请输入节点名称" style="width: 150px"></a-input>
                    
                  </a-form-model-item>
                </div> -->

                <a-form-model-item
                  label="是否指定主管"
                  prop="isSupervisor"
                  :label-col="{ span: 3 }"
                  :wrapper-col="{ span: 16 }"
                >
                  <a-radio-group v-model="formParams.isSupervisor" :default-value="1" @change="handleSupervisor">
                    <a-radio :value="1"> 是 </a-radio>
                    <a-radio :value="0"> 否 </a-radio>
                  </a-radio-group>
                </a-form-model-item>
                <div
                  class="flex align-center space-margin level-choice"
                  v-for="(item, index) in formParams.approvalProcess"
                  :key="index"
                >
                  <a-form-model-item
                    :label="format(index)"
                    :prop="'approvalProcess.' + index + '.pendingId'"
                    :rules="{
                      required: true,
                      message: '请选择流程设置',
                    }"
                    :label-col="{ span: 3 }"
                    :wrapper-col="{ span: 19 }"
                  >
                    <!-- <span style="margin: 5px">第{{ index + 1 }}级</span> -->
                    <a-input
                      v-model="item.processName"
                      placeholder="请输入节点名称"
                      style="width: 150px"
                      :disabled="item.disabled"
                    ></a-input>

                    <span class="left-padding" style="margin: 5px">指定人员</span>
                    <a-tree-select
                      v-model="item.pendingId"
                      show-search
                      style="width: 50%"
                      :dropdown-style="{ maxHeight: '500px', overflow: 'auto' }"
                      placeholder="请选择"
                      allow-clear
                      tree-default-expand-all
                      tree-node-filter-prop="title"
                      :disabled="item.disabled"
                    >
                      <a-tree-select-node
                        v-for="item in principalPersonList"
                        :key="item.id"
                        :value="item.id"
                        :title="item.title"
                      >
                        <a-tree-select-node
                          v-for="child in item.children"
                          :key="child.id"
                          :value="child.id"
                          :title="child.title"
                          disabled
                        >
                          <a-tree-select-node
                            v-for="userList in child.userList"
                            :key="userList.id"
                            :value="userList.id"
                            :title="userList.realname"
                          >
                          </a-tree-select-node>
                        </a-tree-select-node>
                      </a-tree-select-node>
                    </a-tree-select>
                    <a-icon
                      v-if="index > 0"
                      class="left-padding appear"
                      type="delete"
                      :style="{ fontSize: '20px', color: '#ff1030', margin: '5px' }"
                      @click="deleteLevel(index)"
                    />
                  </a-form-model-item>
                </div>
                <a-button icon="plus" type="primary" @click="addLevel()" :style="{ marginLeft: '50px' }"
                  >添加审批节点
                </a-button>
              </div>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="抄送人" prop="ccPeople">
                <a-tree-select
                  v-model="formParams.ccPeople"
                  show-search
                  :dropdown-style="{ maxHeight: '500px', overflow: 'auto' }"
                  placeholder="请选择抄送人"
                  allow-clear
                  multiple
                  tree-default-expand-all
                  tree-node-filter-prop="title"
                >
                  <a-tree-select-node
                    v-for="item in principalPersonList"
                    :key="item.id"
                    :value="item.id"
                    :title="item.title"
                  >
                    <a-tree-select-node
                      v-for="child in item.children"
                      :key="child.id"
                      :value="child.id"
                      :title="child.title"
                      disabled
                    >
                      <a-tree-select-node
                        v-for="userList in child.userList"
                        :key="userList.id"
                        :value="userList.id"
                        :title="userList.realname"
                      >
                      </a-tree-select-node>
                    </a-tree-select-node>
                  </a-tree-select-node>
                </a-tree-select>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </a-spin>

      <template slot="footer" v-bind="formItemLayoutWithOutLabel">
        <a-button type="dashed" @click="close">取消</a-button>
        <a-button type="primary" @click="handleOk('ruleForm')" :loading="loading">确认</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { addApproval, editApproval, getDepartmentList, getDetail } from '@/api/set-approval/index.js'
import moment from 'dayjs'
export default {
  data() {
    return {
      // 开关
      visible: false,
      // 表单配置
      labelCol: { span: 6 },
      wrapperCol: { span: 17 },
      // 表单参数
      formParams: {
        details: this.id, //利润表id
        department: this.$store.getters.userInfo.departIds, //所属部门id
        isSupervisor: 0,
        approvalProcess: [
          //流程内容
          {
            processName: '',
            pendingId: '',
            level: 1,
            disabled: false,
            isSupervisor: 1,
          },
          {
            processName: '',
            pendingId: '',
            level: 2,
            isSupervisor: 0,
          },
        ],
      },
      // 表单验证规则
      rules: {
        name: [{ required: true, message: '请输入流程名称', trigger: 'blur' }],
        instructions: [{ required: true, message: '请输入流程说明', trigger: 'blur' }],
        // approvalProcess: [{ required: true, message: '请输入', trigger: 'change' }]
        // set: [{ required: true, message: '请选择流程设置', trigger: 'blur' }],
      },
      // 加载动画开关
      loading: false,
      principalPersonList: [], // 审批人列表
      id: '', //传过来的id
      // 循环校验
      formItemLayoutWithOutLabel: {},
      currentI: 1,
    }
  },

  computed: {
    format() {
      return (row) => {
        let i = row + 1
        return '第' + i + '级'
      }
    },
  },

  watch: {
    'formParams.approvalProcess': {
      handler(val, oldVal) {
        // console.log(val, oldVal)
        val.forEach((element) => {
          if (element.pendingId && element.processName) {
            this.$refs.ruleForm.clearValidate()
          }
        })
      },
      // immediate: true,
      deep: true,
    },
  },

  methods: {
    moment,
    // 打开弹窗
    open(id) {
      console.log(id)
      this.id = id
      this.getDepartmentList()
      this.visible = true
    },

    // 关闭弹窗，点击遮罩层或右上角叉或取消按钮时触发
    close() {
      this.visible = false
      // 重置表单
      this.$refs.ruleForm.resetFields()
      this.formParams = {
        details: this.id, //利润表id
        department: this.$store.getters.userInfo.departIds, //所属部门id
        isSupervisor: 0,
        approvalProcess: [
          {
            processName: '',
            pendingId: '',
            level: 1,
            disabled: false,
            isSupervisor: 1,
          },
          {
            processName: '',
            pendingId: '',
            level: 2,
            isSupervisor: 0,
          },
        ],
      }
    },
    handleSupervisor(e) {
      if (e.target.value == 0) {
        this.$set(this.formParams.approvalProcess[0], 'disabled', false)
        this.$set(this.formParams.approvalProcess[0], 'processName', '')
        this.$set(this.formParams.approvalProcess[0], 'level', 1)
        this.$set(this.formParams.approvalProcess[0], 'pendingId', '')
        this.$set(this.formParams.approvalProcess[0], 'isSupervisor', 0)
        this.$set(this.formParams, 'isSupervisor', 0)
      } else {
        this.$set(this.formParams.approvalProcess[0], 'disabled', true)
        this.$set(this.formParams.approvalProcess[0], 'processName', '当前人/发起人主管')
        this.$set(this.formParams.approvalProcess[0], 'level', 1)
        this.$set(this.formParams.approvalProcess[0], 'pendingId', '默认为当前人/发起人主管')
        this.$set(this.formParams.approvalProcess[0], 'isSupervisor', 1)
        this.$set(this.formParams, 'isSupervisor', 1)
      }
    },
    // 添加
    add() {
      // 当前为添加模式
      this.type = 0
      this.open()
      this.readOnly = true
    },
    // 编辑
    edit(record) {
      console.log(record)
      this.type = 1
      this.getDetail(record.id)
      this.open()
      this.readOnly = true
    },

    getDetail(id) {
      getDetail(id).then((res) => {
        if (res.success) {
          console.log(typeof res.result.ccPeople)
          this.formParams = res.result
          this.formParams.approvalProcess = JSON.parse(res.result.approvalProcess)
          this.formParams.ccPeople = res.result.ccPeople ? res.result.ccPeople.split(',') : null
        }
      })
    },

    // 获取部门树形
    getDepartmentList() {
      getDepartmentList().then((res) => {
        if (res.success) {
          this.principalPersonList = res.result
          console.log(this.principalPersonList)
          // 增加选择管理员
          this.principalPersonList.push({
            title: '管理员',
            realname: '管理员',
            // id: this.principalPersonList[0].userList[0].id
            id: 'e9ca23d68d884d4ebb19d07889727dae',
          })
        }
      })
    },

    // 添加
    addLevel() {
      let index = this.formParams.approvalProcess.length
      const item = {
        processName: '',
        pendingId: '',
        level: Number(index + 1),
        isSupervisor: 0,
      }
      // this.formParams.approvalProcess.splice(index + 1, 0, item)
      this.formParams.approvalProcess.push(item)
      console.log(this.formParams.approvalProcess)
    },

    // 删除
    deleteLevel(index) {
      this.formParams.approvalProcess.splice(index, 1)
      console.log(this.formParams.approvalProcess)
    },

    handleOk(formName) {
      console.log(this.id, this.formParams)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            ...this.formParams,
            ccPeople: this.formParams.ccPeople ? this.formParams.ccPeople.toString() : '',
            details: this.id,
          }
          // 添加
          if (this.type == 0) {
            addApproval(data).then((res) => {
              if (res.success) {
                this.$message.success(res.message)
                this.$emit('refresh')
              } else {
                this.$message.error(res.message)
              }
              this.close()
            })
          } else {
            // 编辑
            editApproval(data).then((res) => {
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
.space-margin {
  margin-bottom: 20px;
}
.left-padding {
  padding-left: 10px;
}
.config-box {
  padding-bottom: 10px;
}
</style>
