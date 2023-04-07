<template>
  <j-modal
    :title="title"
    width="92%"
    :visible="visible"
    switchFullscreen
    :fullscreen="true"
    @ok="handleOk"
    :okButtonProps="{ class: { 'jee-hidden': disableSubmit } }"
    @cancel="close"
    cancelText="关闭"
  >
    <a-spin tip="加载中..." :spinning="loading">
      <a-form-model ref="ruleForm" :model="formParams" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row>
          <a-col :span="24" class="title">设计信息</a-col>
          <a-col :span="12">
            <a-form-model-item label="设计人" prop="peopleName">
              <a-input v-model="formParams.peopleName" placeholder="请输入设计人" disabled />
            </a-form-model-item>
          </a-col>

          <a-col :span="12">
            <a-form-model-item label="设计部门" prop="department">
              <a-tree-select
                v-model="formParams.department"
                show-search
                style="width: 100%"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                placeholder="请选择"
                allow-clear
                tree-default-expand-all
                disabled
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
          <a-col :span="12">
            <a-form-model-item label="设计日期" prop="time">
              <j-date
                v-model="formParams.time"
                :showTime="true"
                dateFormat="YYYY-MM-DD"
                :style="{ width: '340px' }"
                placeholder="请选择设计日期"
                disabled
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="联系电话" prop="peoplePhone">
              <a-input v-model="formParams.peoplePhone" placeholder="请输入联系电话" disabled />
            </a-form-model-item>
          </a-col>

          <a-col :span="24" class="title">项目信息</a-col>
          <a-col :span="12">
            <a-form-model-item label="项目名称" prop="projectId">
              <a-select
                v-model="formParams.projectId"
                :disabled="disableSubmit"
                placeholder="请选择关联项目"
                @change="handleChange"
              >
                <a-select-option v-for="item in projectList" :key="item.id" :value="item.id">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="采购内容" prop="purchaseContext">
              <a-input v-model="formParams.purchaseContext" placeholder="请输入采购内容" :disabled="disableSubmit" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="客户名称" prop="companyName">
              <a-input v-model="formParams.companyName" placeholder="请输入客户名称" disabled />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="联系人" prop="customerName">
              <a-input v-model="formParams.customerName" placeholder="请输入联系人" disabled />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="联系电话" prop="customerPhone">
              <a-input v-model="formParams.customerPhone" placeholder="请输入联系电话" disabled />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="方案编号" prop="schemeCode">
              <a-input v-model="formParams.schemeCode" placeholder="请输入方案编号" disabled />
            </a-form-model-item>
          </a-col>

          <a-col :span="24" class="title">方案信息</a-col>
          <template>
            <a-col :span="24">
              <a-button style="margin: 10px 0" type="primary" @click="addRow" v-if="this.type !== 2">新增</a-button>
              <!-- 表格区域 -->
              <div class="table">
                <j-vxe-table
                  v-if="visible"
                  class="table"
                  ref="table"
                  bordered
                  rowKey="decoId"
                  keep-source
                  :maxHeight="580"
                  :loading="loading"
                  :dataSource="tableData"
                  :columns="columns"
                  :alwaysEdit="true"
                  style="margin-top: 8px"
                  @valueChange="handleValueChange"
                  :disabled="disableSubmit"
                >
                  <template v-slot:code="props">
                    <span>{{ props.index + 1 }}</span>
                  </template>

                  <template v-slot:action="props" v-if="this.type !== 2">
                    <a-popconfirm title="确定删除吗？" @confirm="handleDelete(props)" :style="{ color: '#ff211a' }">
                      <a>删除</a>
                    </a-popconfirm>
                  </template>
                </j-vxe-table>
              </div>
            </a-col>
          </template>
        </a-row>
      </a-form-model>
    </a-spin>

    <div class="drawer-bootom-button" v-if="this.type !== 2">
      <a-button @click="close" style="margin-right: 0.8rem">取消</a-button>
      <a-button @click="handleOk" type="primary" :loading="loading">保存</a-button>
    </div>
  </j-modal>
</template>

<script>
// API
import {
  addprodScheme,
  EditprodScheme,
  getDetail,
  getDepartmentList,
  getProjectList
} from '@/api/project-management/plan-management/PlanManagement.js'
import { JVXETypes } from '@/components/jeecg/JVxeTable'
import { getDictText, getDictItemsFromCache, ajaxGetDictItems } from '@/api/api.js'
import moment from 'dayjs'
export default {
  data() {
    return {
      // 开关
      visible: false,
      // 加载动画开关
      loading: false,
      // 是否禁用
      disableSubmit: false,
      // 标题
      title: '新增',
      // 当前模式 0-添加 1-编辑 2-详情
      type: 0,
      // 表单配置
      labelCol: { span: 6 },
      wrapperCol: { span: 17 },
      // 表单参数
      formParams: {
        peopleName: this.$store.getters.userInfo.realname, //当前名字
        peopleId: this.$store.getters.userInfo.id, //当前名字id
        department: this.$store.getters.userInfo.departIds, //当前部门id
        peoplePhone: this.$store.getters.userInfo.phone, // 当前电话
        time: moment().format('YYYY-MM-DD HH:mm:ss')
      },
      // 新增表格配置
      columns: [
        {
          title: '编号',
          key: 'code',
          align: 'center',
          type: JVXETypes.slot,
          width: '5%',
          slotName: 'code'
        },
        // {
        //   title: '供应商类型',
        //   key: 'trade',
        //   type: JVXETypes.select,
        //   options: [
        //     { title: '经销商', value: 'JX' },
        //     { title: '代理商', value: 'DL' },
        //     { title: '工厂', value: 'GC' },
        //     { title: '服务商', value: 'FW' }
        //   ],
        //   align: 'center',
        //   width: '11%',
        //   placeholder: '请选择${title}'
        // },
        {
          title: '安装位置',
          key: 'address',
          type: JVXETypes.input,
          defaultValue: '',
          align: 'center',
          width: '11%',
          placeholder: '请输入${title}'
        },
        {
          title: '细目名称',
          key: 'name',
          type: JVXETypes.input,
          align: 'center',
          width: '11%',
          placeholder: '请输入'
        },
        {
          title: '技术要求',
          key: 'requirements',
          type: JVXETypes.input,
          align: 'center',
          width: '11%',
          placeholder: '请输入'
        },
        {
          title: '数量',
          key: 'num',
          type: JVXETypes.inputNumber,
          align: 'center',
          width: '11%',
          placeholder: '请输入'
        },
        {
          title: '单位',
          key: 'unit',
          type: JVXETypes.input,
          align: 'center',
          width: '11%',
          placeholder: '请输入'
        },
        {
          title: '备注',
          key: 'remark',
          type: JVXETypes.input,
          align: 'center',
          width: '11%',
          placeholder: '请输入'
        },
        {
          title: '操作',
          key: 'action',
          type: JVXETypes.slot,
          align: 'center',
          width: '5%',
          slotName: 'action'
        }
      ],

      // 详情表格
      columnsDetail: [
        {
          title: '编号',
          dataIndex: 'collectionCode',
          align: 'center',
          width: '11%'
        },
        {
          title: '供应商类型',
          dataIndex: 'batch',
          align: 'center',
          width: '11%'
        },
        {
          title: '安装位置',
          dataIndex: 'collectionConditions',
          align: 'center',
          width: '11%'
        },
        {
          title: '类别%）',
          dataIndex: 'collectionRatio',
          align: 'center',
          width: '11%'
        },
        {
          title: '细目名称',
          dataIndex: 'racountFigure',
          align: 'center',
          width: '11%'
        },
        {
          title: '技术要求',
          dataIndex: 'receivedFigure',
          align: 'center',
          width: '11%'
        },
        {
          title: '数量',
          dataIndex: 'notFigure',
          align: 'center',
          width: '11%'
        },
        {
          title: '单位',
          dataIndex: 'expectCollectionTime',
          align: 'center',
          width: '11%'
        },
        {
          title: '备注',
          dataIndex: 'status',
          align: 'center',
          width: '11%',
          customRender(text) {
            // （1-待收款，2-已收款）
            return text == 2 ? '已收款' : '待收款'
          }
        }
      ],

      // 表格数据
      tableData: [],
      // 当前编辑的数据旧值
      currentRowOldData: [],
      // 表单验证规则
      rules: {
        peopleName: [{ required: true, message: '请输入设计人', trigger: 'blur' }],
        department: [{ required: true, message: '请选择设计部门', trigger: 'change' }],
        time: [{ required: true, message: '请选择设计日期', trigger: 'change' }],
        peoplePhone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
        projectId: [{ required: true, message: '请选择项目名称', trigger: 'change' }],
        purchaseContext: [{ required: true, message: '请输入采购内容', trigger: 'blur' }]
        // phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }, { validator: this.validateMobile }],
      },
      options: [], // 供应商列表
      projectList: [], //项目信息
      principalPersonList: [], // 设计部门列表
      toolbarConfig: {
        // add 新增按钮；remove 删除按钮；clearSelection 清空选择按钮
        btn: ['add']
      }
    }
  },

  methods: {
    moment,
    validateMobile(rule, value, callback) {
      if (!value || new RegExp(/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/).test(value)) {
        callback()
      } else {
        callback('您的手机号码格式不正确!')
      }
    },

    // 获取部门树形
    getDepartmentList() {
      getDepartmentList().then(res => {
        if (res.success) {
          this.principalPersonList = res.result
        }
      })
    },

    // 获取关联项目列表
    getProjectList() {
      getProjectList().then(({ result, success }) => {
        if (success) {
          console.log(result)
          this.projectList = result.records
        }
      })
    },

    // 项目改变事件
    handleChange(value) {
      let data = this.projectList.filter(item => item.id == value)
      console.log(data)
      this.$set(this.formParams, 'companyName', data[0].companyName) //客户名称
      this.$set(this.formParams, 'customerName', data[0].customerName) //联系人
      this.$set(this.formParams, 'customerPhone', data[0].customerPhone) //联系电话
    },

    // 打开弹窗
    open() {
      this.visible = true
      this.getDepartmentList()
      this.getProjectList()
      // console.log(this.$store.getters.userInfo)
    },

    // 关闭弹窗，点击遮罩层或右上角叉或取消按钮时触发
    close() {
      this.visible = false
      // 重置表单
      this.$refs.ruleForm.resetFields()
      this.formParams = {
        peopleName: this.$store.getters.userInfo.realname, //当前名字
        peopleId: this.$store.getters.userInfo.id, //当前名字id
        department: this.$store.getters.userInfo.departIds, //当前部门id
        peoplePhone: this.$store.getters.userInfo.phone, // 当前电话
        time: moment().format('YYYY-MM-DD HH:mm:ss')
      }
      this.tableData = []
    },

    // 添加
    add() {
      // 当前为添加模式
      this.type = 0
      this.open()
    },

    // 编辑
    edit(record) {
      this.type = 1
      this.getDetail(record.id)
      this.open()
    },

    // 详情
    detail(record) {
      this.type = 2
      this.getDetail(record.id)
      this.open()
    },

    // 获取详情
    getDetail(id) {
      getDetail(id).then(res => {
        console.log(res)
        if (res.success) {
          this.formParams = res.result
          this.tableData = res.result.schemeInfos ? res.result.schemeInfos : []
        }
      })
    },

    // 新增方案信息
    addRow() {
      this.tableData.push({
        code: '',
        trade: '',
        address: '',
        productType: '',
        name: '',
        requirements: '',
        num: '',
        unit: '',
        remark: ''
      })
    },

    // 删除方案信息
    handleDelete(props) {
      this.tableData.splice(props.index, 1)
    },

    // 表格行数据发生改变时触发
    handleValueChange(event) {},

    //提交
    handleOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let data = {
            ...this.formParams,
            schemeInfos: this.tableData
          }
          console.log(data)
          // 添加
          if (this.type == 0) {
            addprodScheme(data).then(res => {
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
            EditprodScheme(data).then(res => {
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
    }
  }
}
</script>

<style lang="less" scoped>
.title {
  background-color: #f8faff;
  padding: 10px;
  margin-bottom: 10px;
  font-weight: 600;
}
</style>
