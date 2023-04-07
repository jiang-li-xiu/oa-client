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
        <a-tabs default-active-key="1" @change="handleChange" :activeKey="activeKey">
          <a-tab-pane key="1" tab="方案信息">
            <a-row>
              <a-col :span="24" class="title">设计信息</a-col>
              <a-col :span="12">
                <a-form-model-item label="设计人" prop="peopleName">
                  <span>{{ formParams.peopleName }}</span>
                  <!-- <a-input v-model="formParams.peopleName" placeholder="请输入设计人" disabled /> -->
                </a-form-model-item>
              </a-col>

              <a-col :span="12">
                <a-form-model-item label="设计部门" prop="department">
                  <span>{{ formParams.department }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="设计日期" prop="time">
                  <span>{{ formParams.time }}</span>
                  <!-- <j-date
                    v-model="formParams.time"
                    :showTime="true"
                    dateFormat="YYYY-MM-DD"
                    :style="{ width: '340px' }"
                    placeholder="请选择设计日期"
                    disabled
                  /> -->
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="联系电话" prop="peoplePhone">
                  <span>{{ formParams.peoplePhone }}</span>
                </a-form-model-item>
              </a-col>

              <a-col :span="24" class="title">项目信息</a-col>
              <a-col :span="12">
                <a-form-model-item label="项目名称" prop="projectName">
                  <span>{{ formParams.projectName }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="采购内容" prop="purchaseContext">
                  <span>{{ formParams.purchaseContext }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="客户名称" prop="companyName">
                  <span>{{ formParams.companyName }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="联系人" prop="customerName">
                  <span>{{ formParams.customerName }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="联系电话" prop="customerPhone">
                  <span>{{ formParams.customerPhone }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="方案编号" prop="schemeCode">
                  <span>{{ formParams.schemeCode }}</span>
                </a-form-model-item>
              </a-col>

              <a-col :span="24" class="title">方案信息</a-col>
              <a-col :span="24">
                <!-- 表格区域 -->
                <div class="table">
                  <!-- 方案表格  -->
                  <InquiryTable :tableData="this.formParams.schemeInfos"></InquiryTable>
                </div>
              </a-col>
            </a-row>
          </a-tab-pane>

          <!-- -----------------------询价---------------------- -->
          <a-tab-pane key="2" tab="询价" force-render>
            <InquiryDialog
              ref="inquiryForm"
              :type="this.type"
              :data="this.formParams.schemeInfos"
              :currentData="this.currentData"
            ></InquiryDialog>
          </a-tab-pane>
        </a-tabs>
      </a-form-model>
    </a-spin>

    <div class="drawer-bootom-button" v-if="this.type !== 2">
      <a-button @click="close" style="margin-right: 0.8rem">取消</a-button>
      <!-- <a-button @click="handleOk" type="primary" :loading="loading" v-if="activeKey == 2">保存</a-button> -->
    </div>
  </j-modal>
</template>

<script>
// API
import { getDetail } from '@/api/project-management/plan-management/PlanAskPrice.js'
// 组件
import InquiryDialog from './InquiryDialog'
import InquiryTable from './InquiryTable'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin'
import { JVXETypes } from '@/components/jeecg/JVxeTable'
import { getDictText, getDictItemsFromCache, ajaxGetDictItems } from '@/api/api.js'
import moment from 'dayjs'
export default {
  mixins: [TableListMixin],
  components: { InquiryDialog, InquiryTable },
  data() {
    return {
      // 开关
      visible: false,
      // 加载动画开关
      loading: false,
      // 是否禁用
      disableSubmit: false,
      // 标题
      title: '详情',
      // 当前模式 0-询价 1-编辑 2-详情
      type: 0,
      disableMixinCreated: true, //不执行混入
      // 表单配置
      labelCol: { span: 6 },
      wrapperCol: { span: 17 },
      // disableMixinCreated: true, //不执行混入
      // 表单参数
      formParams: {
        peopleName: this.$store.getters.userInfo.realname, //当前名字
        peopleId: this.$store.getters.userInfo.id, //当前名字id
        department: this.$store.getters.userInfo.departIds, //当前部门id
        peoplePhone: this.$store.getters.userInfo.phone, // 当前电话
        time: moment().format('YYYY-MM-DD HH:mm:ss'),
      },
      // 新增表格配置
      columnsAdd: [
        {
          title: '编号',
          key: 'code',
          align: 'center',
          type: JVXETypes.slot,
          width: '5%',
          slotName: 'code',
        },
        {
          title: '供应商类型',
          key: 'trade',
          type: JVXETypes.select,
          options: [
            { title: '设备类', value: 'SB' },
            { title: '劳务类', value: 'LW' },
            { title: '辅材类', value: 'FC' },
            { title: '技术服务类', value: 'JS' },
            { title: '其他', value: 'QT' },
          ],
          align: 'center',
          width: '10%',
          placeholder: '请选择${title}',
        },
        {
          title: '安装位置',
          key: 'address',
          type: JVXETypes.input,
          defaultValue: '',
          align: 'center',
          placeholder: '请输入${title}',
        },
        {
          title: '类别',
          key: 'productType',
          type: JVXETypes.select,
          options: [
            // （1-主材，2-辅材，3-劳务，4-配件）
            { title: '主材', value: '1' },
            { title: '辅材', value: '2' },
            { title: '劳务', value: '3' },
            { title: '配件', value: '4' },
          ],
          align: 'center',
          width: '8%',
          placeholder: '请选择${title}',
        },
        {
          title: '细目名称',
          key: 'name',
          type: JVXETypes.input,
          align: 'center',
          placeholder: '请选择',
        },
        {
          title: '技术要求',
          key: 'requirements',
          type: JVXETypes.input,
          align: 'center',
          placeholder: '请输入',
        },
        {
          title: '数量',
          key: 'num',
          type: JVXETypes.inputNumber,
          align: 'center',
          width: '8%',
          placeholder: '请输入',
        },
        {
          title: '单位',
          key: 'unit',
          type: JVXETypes.input,
          align: 'center',
          width: '7%',
          placeholder: '请输入',
        },
        {
          title: '备注',
          key: 'remark',
          type: JVXETypes.input,
          align: 'center',
          placeholder: '请输入',
        },
        {
          title: '操作',
          key: 'action',
          type: JVXETypes.slot,
          align: 'center',
          width: '5%',
          slotName: 'action',
        },
      ],
      // 详情表格
      columnsDetail: [
        {
          title: '编号',
          dataIndex: 'index',
          width: 120,
          ellipsis: true,
          align: 'center',
        },
        {
          title: '细目名称',
          dataIndex: 'detailName',
          width: 120,
          ellipsis: true,
          align: 'center',
        },
        {
          title: '安装位置',
          dataIndex: 'position',
          width: 120,
          ellipsis: true,
          align: 'center',
        },
        {
          title: '技术规格 资质证书',
          dataIndex: 'technicalSpecifications',
          width: 150,
          ellipsis: true,
          align: 'center',
          scopedSlots: { customRender: 'technicalSpecifications' },
        },
        {
          title: '单位',
          dataIndex: 'unit',
          width: 120,
          ellipsis: true,
          align: 'center',
        },
        {
          title: '数量',
          dataIndex: 'num',
          width: 120,
          ellipsis: true,
          align: 'center',
        },
        {
          title: '备注',
          dataIndex: 'remark',
          width: 150,
          ellipsis: true,
          align: 'center',
        },
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
        // purchaseContext: [{ required: true, message: '请输入采购内容', trigger: 'blur' }],
        // phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }, { validator: this.validateMobile }],
      },
      options: [], // 供应商列表
      projectList: [], //项目信息
      toolbarConfig: {
        // add 新增按钮；remove 删除按钮；clearSelection 清空选择按钮
        btn: ['add'],
      },
      // 查询表单
      param: {},
      activeKey: '1', //当前激活 tab 面板的 key
      currentData: [], // 当前行数据
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

    // 切换标签
    async handleChange(val) {
      this.activeKey = val
      if (val == 2) {
        // 询价
        await this.$refs.inquiryForm.loadData(1)
      }
    },

    // 打开弹窗
    open() {
      this.visible = true
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
        time: moment().format('YYYY-MM-DD HH:mm:ss'),
      }
      this.tableData = []
      this.$refs.inquiryForm.onClearSelected()
      this.$refs.inquiryForm.dataSource = []
      this.currentData = []
      this.activeKey = '1'
      // 刷新列表
      this.$emit('refresh')
    },

    // 询价
    add(record) {
      console.log('打开询价---', record)
      this.currentData = record
      // 当前为询价模式
      this.type = 0
      this.title = '询价'
      this.getDetail(record.id)
      this.open()
    },

    // 详情
    detail(record) {
      this.currentData = record
      this.type = 2
      this.title = '详情'
      this.getDetail(record.id)
      this.open()
    },

    // 获取详情
    getDetail(id) {
      getDetail(id).then((res) => {
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
        remark: '',
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
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let data = {
            ...this.formParams,
            schemeInfos: this.tableData,
          }
          console.log(data)
          // 添加
          if (this.type == 0) {
            addprodScheme(data).then((res) => {
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
            EditprodScheme(data).then((res) => {
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
.title {
  background-color: #f8faff;
  padding: 10px;
  margin-bottom: 10px;
  font-weight: 600;
}
/*统一table表格的尺寸*/
.ant-table {
  table-layout: fixed;
}
.ant-table-tbody > tr > td {
  max-width: 200px;
  min-width: 70px;
  height: 70px;
  border-bottom: 0;
  /*text-align: center !important;*/
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
  word-break: break-all;
}
.overflowStyle {
  max-width: 150px !important;
  max-height: 70px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-wrap: break-word;
  word-break: break-all;
}
</style>
