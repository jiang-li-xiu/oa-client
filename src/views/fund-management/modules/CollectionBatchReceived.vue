<template>
  <a-modal :title="title" :width="900" :visible.sync="visible" :confirmLoading="loading" @cancel="close">
    <a-spin tip="加载中..." :spinning="loading">
      <a-form-model ref="ruleForm" :model="formParams" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row>
          <a-col :span="24" class="title">根据一些设置自动生成多期应收款</a-col>
          <a-col :span="12">
            <a-form-model-item label="应收金额" prop="customId">
              <a-input v-model="formParams.customId" placeholder="请输入应收金额" :disabled="disableSubmit" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="回款期数" prop="periods">
              <a-input-number
                :min="1"
                v-model="formParams.periods"
                placeholder="最多50期"
                :style="{ width: '100%' }"
                :disabled="disableSubmit"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="每期金额" prop="periodsMoney">
              <span>{{ formatAmount }}</span>
            </a-form-model-item>
          </a-col>

          <a-col :span="12">
            <a-form-model-item label="回款周期" prop="periodsFrequency">
              每 <a-input-number v-model="formParams.periodsFrequency" style="width: 120px" :disabled="disableSubmit" />
              <a-select default-value="1" style="width: 80px" v-model="formParams.periodsType">
                <a-select-option value="1"> 天 </a-select-option>
                <a-select-option value="2"> 周 </a-select-option>
                <a-select-option value="3"> 月 </a-select-option>
                <a-select-option value="4"> 年 </a-select-option>
              </a-select>
              回款一次
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="首次回款日期" prop="firstPayDate">
              <j-date
                v-model="formParams.firstPayDate"
                :showTime="true"
                dateFormat="YYYY-MM-DD"
                :style="{ width: '100%' }"
                placeholder="请选择首次回款日期"
                :disabled="disableSubmit"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="回款状态" prop="status">
              <j-dict-select-tag
                v-model="formParams.status"
                dictCode="payment_collection_status"
                placeholder="请选择回款状态"
                disabled
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="回款类型" prop="receivableStatus">
              <j-dict-select-tag
                v-model="formParams.receivableStatus"
                dictCode="payment_collection_type"
                placeholder="请选择回款类型"
                :disabled="disableSubmit"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="负责人" prop="chargePeople">
              <a-tree-select
                v-model="formParams.chargePeople"
                show-search
                style="width: 100%"
                :dropdown-style="{ maxHeight: '500px', overflow: 'auto' }"
                placeholder="请选择"
                allow-clear
                tree-default-expand-all
                tree-node-filter-prop="title"
                multiple
                @change="handelChange"
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
                      :value="userList.realname"
                      :title="userList.realname"
                      :disabled="userList.disSynergyPeople"
                    >
                    </a-tree-select-node>
                  </a-tree-select-node>
                </a-tree-select-node>
              </a-tree-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="协同人" prop="synergyPeople">
              <a-tree-select
                v-model="formParams.synergyPeople"
                show-search
                style="width: 100%"
                :dropdown-style="{ maxHeight: '500px', overflow: 'auto' }"
                placeholder="请选择"
                allow-clear
                tree-default-expand-all
                tree-node-filter-prop="title"
                multiple
                @change="handelChangeSynergy"
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
                      :value="userList.realname"
                      :title="userList.realname"
                      :disabled="userList.disUserList"
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

    <div class="drawer-bootom-button" v-if="this.type !== 2">
      <a-button @click="close" style="margin-right: 0.8rem">取消</a-button>
      <a-button @click="handleOk" type="primary" :loading="loading">确定</a-button>
    </div>
  </a-modal>
</template>

<script>
import { getContractList, getDepartmentList, addReceivablebatch } from '@/api/fund-management/Collection.js'
// 组件
import JSelectCustomer from '@/views/scrm/modules/JSelectCustomer'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin'
export default {
  mixins: [TableListMixin],
  components: { JSelectCustomer },
  data() {
    return {
      // 开关
      visible: false,
      // 是否禁用
      disableSubmit: false,
      // 标题
      title: '新增应收款',
      // 当前模式 0-添加 1-编辑 2-详情
      type: 0,
      // 表单配置
      labelCol: { span: 6 },
      wrapperCol: { span: 17 },

      // 表单参数
      formParams: {
        status: 1, //回款状态 默认未收款
      },
      disableMixinCreated: true,
      // 表单验证规则
      rules: {
        customId: [{ required: true, message: '请输入应收金额', trigger: 'blur' }],
        firstPayDate: [{ required: true, message: '请选择', trigger: 'change' }],
        chargePeople: [{ required: true, message: '请选择负责人', trigger: 'change' }],
      },
      // 加载动画开关
      loading: false,
      // 合同列表
      contractList: [],
      principalPersonList: [], // 人员列表
    }
  },

  computed: {
    formatAmount() {
      if (this.formParams.customId && this.formParams.periods) {
        this.formParams.periodsMoney = (this.formParams.customId / this.formParams.periods).toFixed(2)
        return (this.formParams.customId / this.formParams.periods).toFixed(2)
      } else {
        return 0
      }
    },
  },

  methods: {
    // 客户事件
    handelChangeCustomer(val, rows) {
      console.log(val, rows)
      this.$nextTick(() => {
        this.getContractLists(rows[0].id) //获取合同列表
      })
    },
    // 合同列表
    getContractLists(ids) {
      getContractList({ id: ids }).then((res) => {
        console.log(res)
        if (res.success) {
          this.contractList = res.result.records
        }
      })
    },
    // 获取部门树形
    getDepartmentList() {
      getDepartmentList().then((res) => {
        if (res.success) {
          this.principalPersonList = res.result
          // console.log(this.principalPersonList)
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
    handelChange(value, label, extra) {
      console.log('负责人', value, label, extra)
      this.principalPersonList.map((item) => {
        if (item.children) {
          item.children.map((userList) => {
            if (userList.userList) {
              userList.userList.map((user) => {
                this.formParams.chargePeople.forEach((i) => {
                  if (user.realname.includes(i)) {
                    console.log(i)
                    user.disUserList = true //*禁用负责人
                  }
                })
                if (this.formParams.synergyPeople && this.formParams.synergyPeople.length !== 0) {
                  this.formParams.synergyPeople.forEach((i) => {
                    if (user.realname.includes(i)) {
                      console.log(i)
                      user.disUserList = false //*禁用负责人
                    }
                  })
                }
                if (this.formParams.chargePeople && this.formParams.chargePeople.length == 0) {
                  user.disUserList = false
                }
              })
            }
          })
        }
      })
    },
    handelChangeSynergy(value, label, extra) {
      console.log('协同', value, label, extra)
      console.log(this.formParams.synergyPeople)
      this.principalPersonList.map((item) => {
        if (item.children) {
          item.children.map((userList) => {
            if (userList.userList) {
              userList.userList.map((user) => {
                this.formParams.synergyPeople.forEach((i) => {
                  if (user.realname.includes(i)) {
                    console.log(i)
                    user.disSynergyPeople = true //*禁用协同人
                  }
                })
                if (this.formParams.chargePeople && this.formParams.chargePeople.length !== 0) {
                  this.formParams.chargePeople.forEach((i) => {
                    if (user.realname.includes(i)) {
                      console.log(i)
                      user.disSynergyPeople = false //*禁用负责人
                    }
                  })
                }
                if (this.formParams.synergyPeople && this.formParams.synergyPeople.length == 0) {
                  user.disSynergyPeople = false
                }
              })
            }
          })
        }
      })
    },

    open(row) {
      this.visible = true
      this.getDepartmentList()
    },
    close() {
      this.visible = false
      // 重置表单
      this.$refs.ruleForm.resetFields()
      this.formParams = {
        status: 1, //回款状态 默认未收款
      }
    },
    add() {
      // 当前为添加模式
      this.type = 0
      this.open()
    },
    edit(record) {
      this.type = 1
      this.open()
    },
    detail(record) {
      console.log(record)
      this.type = 2
      this.open()
    },

    handleChangeContract() {},

    //提交
    handleOk() {
      console.log('提交的数据', this.formParams)
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let data = {
            ...this.formParams,
            chargePeople: this.formParams.chargePeople ? this.formParams.chargePeople.toString() : '',
            synergyPeople: this.formParams.synergyPeople ? this.formParams.synergyPeople.toString() : '',
          }

          console.log(data)
          addReceivablebatch(data).then((res) => {
            if (res.success) {
              // this.$message.success('添加成功')
              this.$emit('addBatchCollection', res.result)
              this.close()
            } else {
              this.$message.error(res.message)
            }
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
  margin-bottom: 10px;
  font-weight: 600;
}
.button {
  margin-top: 15px;
  width: 100%;
  margin-bottom: 20px;
}
::v-deep .drawer-bootom-button {
  position: absolute;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  left: 0;
  background: #fff;
  border-radius: 0 0 2px 2px;
  z-index: 1;
}
</style>
