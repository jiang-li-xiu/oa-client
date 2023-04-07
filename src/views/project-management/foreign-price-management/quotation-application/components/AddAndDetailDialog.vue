<template>
  <a-drawer
    :title="title"
    :maskClosable="true"
    width="70%"
    placement="right"
    :closable="true"
    @close="close"
    :visible="visible"
    style="overflow: auto; padding-bottom: 53px"
  >
    <a-spin tip="加载中..." :spinning="loading">
      <a-form-model ref="ruleForm" :model="formParams" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row>
          <a-col :span="24" class="title">申请人信息</a-col>
          <a-col :span="12">
            <a-form-model-item label="申请人" prop="applyPeopleName">
              <a-input v-model="formParams.applyPeopleName" placeholder="请输入申请人" disabled />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="需求部门" prop="department">
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
            <a-form-model-item label="申请日期" prop="applyTime">
              <j-date
                v-model="formParams.applyTime"
                :showTime="true"
                dateFormat="YYYY-MM-DD"
                :style="{ width: '100%' }"
                placeholder="请选择申请日期"
                disabled
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="联系电话" prop="selectPeoplePhone">
              <a-input v-model="formParams.selectPeoplePhone" placeholder="请输入联系电话" disabled />
            </a-form-model-item>
          </a-col>

          <a-col :span="24" class="title">客户信息</a-col>
          <a-col :span="24">
            <a-form-model-item label="客户名称" prop="customId" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
              <j-select-customer
                v-model="formParams.customId"
                :multi="false"
                @change="handelChangeCustomer"
                :disabled="disableSubmit"
              ></j-select-customer>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="客户联系人" prop="customLiaisonId">
              <a-select
                v-model="formParams.customLiaisonId"
                :disabled="disableSubmit"
                placeholder="请选择客户联系人"
                @change="handleChangeLiaison"
              >
                <a-select-option v-for="item in customLiaisonList" :key="item.id" :value="item.id">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="联系方式" prop="customLiaisonPhone">
              <a-input v-model="formParams.customLiaisonPhone" placeholder="请输入联系方式" readOnly />
            </a-form-model-item>
          </a-col>

          <a-col :span="24" class="title">项目信息</a-col>
          <a-col :span="24">
            <a-form-model-item label="项目名称" prop="projectId" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
              <j-select-project
                v-model="formParams.projectId"
                :multi="false"
                @change="handelChange"
                :disabled="disableSubmit"
              ></j-select-project>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="项目地址" prop="projectAddr">
              <a-input v-model="formParams.projectAddr" placeholder="请输入项目地址" readOnly />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="报价截止时间" prop="quoteStopTime">
              <j-date
                v-model="formParams.quoteStopTime"
                :showTime="true"
                dateFormat="YYYY-MM-DD"
                :style="{ width: '100%' }"
                placeholder="请选择报价截止时间"
                :disabled="disableSubmit"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="备注信息" prop="remark" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
              <a-textarea v-model="formParams.remark" :rows="3" placeholder="请输入备注信息" :read-only="readOnly" />
            </a-form-model-item>
          </a-col>

          <a-col :span="24" class="title">附件</a-col>
          <a-col :span="24">
            <a-form-model-item label="附件" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }" prop="files">
              <div v-if="formParams.files">
                <div class="upload" v-for="item in formParams.files" :key="item.id">
                  <span>{{ item.fileName }}</span>
                  <span>{{ item.fileSize }}</span>
                  <span>{{ item.uploadPeople }}</span>
                  <span>{{ item.uploadTime }}</span>
                </div>
              </div>
              <a-upload
                :action="uploadUrl"
                :multiple="true"
                :file-list="files"
                :headers="headers"
                :disabled="disableSubmit"
                @change="handleUploadChange"
                :remove="handleRemoveImage"
              >
                <a-button v-if="files.length < 5" type="primary" icon="upload" :disabled="disableSubmit"
                  >上传
                </a-button>
              </a-upload>
            </a-form-model-item>
          </a-col>

          <!-- 审批信息 -->
          <template v-if="[2, 4].includes(this.type)">
            <a-col :span="24" class="title" :style="{ marginTop: '15px' }">审批信息</a-col>
            <a-col :span="24">
              <a-table
                :columns="columnsApproval"
                :data-source="formParams.approveVos"
                bordered
                rowKey="id"
                :scroll="{ x: true }"
                :indentSize="10"
                :pagination="false"
                :disabled="disableSubmit"
              >
                <template #productId="record, row">
                  {{ row.productName }}
                </template>
              </a-table>
            </a-col>
          </template>
        </a-row>
      </a-form-model>
    </a-spin>

    <div class="drawer-bootom-button" v-if="this.type !== 4">
      <a-button @click="close" style="margin-right: 0.8rem">取消</a-button>
      <a-button @click="handleOk" type="primary" :loading="loading" v-if="this.type !== 2" style="margin-right: 0.8rem"
        >保存
      </a-button>
      <a-button
        @click="handleApproval"
        type="primary"
        :loading="loading"
        v-if="![2, 3].includes(this.currentData.status)"
        >审批
      </a-button>
    </div>
  </a-drawer>
</template>

<script>
// API
import {
  getCustomLiaison,
  addQuotation,
  editQuotation,
  getDetail,
  addApprove,
  editApprove,
  detailApprove,
} from '@/api/project-management/QuotationApplication.js'
import { getDepartmentList } from '@/api/project-management/plan-management/PlanManagement.js'
// 组件
import JSelectProject from '@/views/scrm/modules/JSelectProject'
import JSelectCustomer from '@/views/scrm/modules/JSelectCustomer'
import moment from 'dayjs'
export default {
  components: { JSelectCustomer, JSelectProject },
  data() {
    return {
      // 开关
      visible: false,
      // 加载动画开关
      loading: false,
      // 是否禁用
      disableSubmit: false,
      readOnly: false,
      // 标题
      title: '设计并选型',
      // 当前模式 0-添加 1-编辑 2-详情 3选型 4审批详情
      type: 0,
      // 表单配置
      labelCol: { span: 6 },
      wrapperCol: { span: 17 },
      // 上传地址
      uploadUrl: process.env.VUE_APP_API_BASE_URL + '/sys/common/upload',
      // 上传请求头
      headers: {
        'X-Access-Token': this.$ls.get('Access-Token'),
      },
      files: [], //合同文件上传列表
      pictureTempListImage: [],
      // 表单参数
      formParams: {
        department: this.$store.getters.userInfo.departIds, //当前部门id
        applyTime: moment().format('YYYY-MM-DD HH:mm:ss'), //时间
        selectPeoplePhone: this.$store.getters.userInfo.phone, // 人电话
        applyPeopleName: this.$store.getters.userInfo.realname, //当前人
        applyPeopleId: this.$store.getters.userInfo.id, //当前人id
        files: [],
      },

      // 审批表格配置
      columnsApproval: [
        {
          title: '序号',
          dataIndex: 'index',
          align: 'center',
          width: '10%',
          customRender(text, record, index) {
            return index + 1
          },
        },
        {
          title: '开始时间',
          dataIndex: 'time',
          width: '16%',
          ellipsis: true,
        },
        {
          title: '处理时间',
          dataIndex: 'dealWithTime',
          width: '16%',
          ellipsis: true,
        },
        {
          title: '审批人',
          dataIndex: 'approveName',
          width: '16%',
          ellipsis: true,
        },
        {
          title: '审批操作',
          dataIndex: 'status',
          width: '16%',
          ellipsis: true,
          customRender(text) {
            return text == 1 ? '审批中' : text == 2 ? '已撤销' : text == 3 ? '已通过' : '不通过'
          },
        },
        {
          title: '操作说明',
          dataIndex: 'remark',
          width: '22%',
          ellipsis: true,
        },
      ],
      // 表单验证规则
      rules: {
        customId: [{ required: true, message: '请选择', trigger: 'change' }],
        customLiaisonId: [{ required: true, message: '请选择', trigger: 'change' }],
        projectId: [{ required: true, message: '请选择项目名称', trigger: 'change' }],
      },
      customLiaisonList: [], //客户联系人
      principalPersonList: [], // 部门列表
      currentData: [], // 当前行数据
      dataApproval: [], // 审批信息
      upData: [],
    }
  },
  methods: {
    moment,

    // 获取部门树形
    getDepartmentList() {
      getDepartmentList().then((res) => {
        if (res.success) {
          this.principalPersonList = res.result
        }
      })
    },

    // 项目
    handelChange(value, rows) {
      console.log(value, rows)
      this.$set(this.formParams, 'projectAddr', rows[0].projectAddr) //项目地址
    },
    // 客户
    handelChangeCustomer(val, rows) {
      console.log(val, rows)
      // this.$set(this.formParams, 'customName', rows[0].customName) //客户名称
      this.formParams.customName = rows[0].customName
      // this.formParams.companyName = undefined
      // this.formParams.customLiaisonId = ''
      this.getCustomLiaisonList(val)
    },
    // 客户联系人
    getCustomLiaisonList(id) {
      getCustomLiaison({ customId: id }).then((res) => {
        if (res.success) {
          this.customLiaisonList = res.result.records
        }
      })
    },
    //联系人电话
    handleChangeLiaison(val) {
      let data = this.customLiaisonList.filter((item) => item.id === val)
      this.$set(this.formParams, 'customLiaisonPhone', data[0].phone) //联系电话
      this.$set(this.formParams, 'customLiaison', data[0].name) //联系人
    },

    // 打开弹窗
    open() {
      this.visible = true
      this.getDepartmentList()
      console.log(this.$store.getters.userInfo)
    },

    // 关闭弹窗，点击遮罩层或右上角叉或取消按钮时触发
    close() {
      this.visible = false
      // 重置表单
      this.$refs.ruleForm.resetFields()
      this.formParams = {
        department: this.$store.getters.userInfo.departIds, //当前部门id
        applyTime: moment().format('YYYY-MM-DD HH:mm:ss'), //申请时间
        selectPeoplePhone: this.$store.getters.userInfo.phone, // 人电话
        applyPeopleName: this.$store.getters.userInfo.realname, //当前人
        applyPeopleId: this.$store.getters.userInfo.id, //当前人id
        files: [],
      }
      this.files = []
      this.customLiaisonList = []
      this.uploadData = []
      this.upData = []
      this.pictureTempListImage = []
      this.currentData = []
    },

    // 添加
    add() {
      // 当前为添加模式
      this.type = 0
      this.readOnly = false
      this.disableSubmit = false
      this.open()
    },

    // 编辑
    edit(record) {
      this.type = 1
      this.getDetail(record.id)
      this.getCustomLiaisonList(record.customId)
      this.readOnly = false
      // 当前行数据
      this.currentData = record
      this.open()
    },

    // 详情
    detail(record) {
      this.type = 2
      this.getDetail(record.id)
      this.getCustomLiaisonList(record.customId)
      this.readOnly = true
      // 当前行数据
      this.currentData = record
      this.open()
    },
    // 审批详情
    approvalDetail(record) {
      this.type = 4
      this.getDetail(record.details)
      this.getCustomLiaisonList(record.customId)
      this.readOnly = true
      // 当前行数据
      this.currentData = record
      this.open()
    },

    // 获取详情
    getDetail(id) {
      getDetail(id).then((res) => {
        if (res.success) {
          this.formParams = res.result
          this.upData = res.result.files
          // console.log(this.upData)
          // 填充上传列表
          let files = res.result.files ? res.result.files : []
          // console.log('填充上传列表-', res.result.files)
          this.files = files.map((item, index) => {
            console.log(item)
            return {
              uid: item.id,
              status: 'done',
              name: item.fileName,
              url: item.url,
              size: item.fileSize,
            }
          })
          this.pictureTempListImage = res.result.files
        }
      })
    },

    // 上传文件改变时的状态
    handleUploadChange(info) {
      let fileList = [...info.fileList]
      // 从响应中读取并显示文件链接
      fileList = fileList.map((file) => {
        if (file.response) {
          // 组件将显示文件url链接
          file.url = file.response.message
        }
        return file
      })
      // 保存
      this.files = fileList
      // 保存url
      // this.formParams.files = fileList.map((file) => file.url).toString()
      //文件名称大小时间
      let uploadData = fileList.map((item) => {
        console.log(item)
        // 处理文件大小格式
        if (item.size / 1024 < 1024) {
          item.size = Math.ceil(item.size / 1024) + 'kb' //向上取整
        } else if (item.size / 1024 >= 1024) {
          item.size = (item.size / (1024 * 1024)).toFixed(2) + 'M' //四舍五入
        }
        return {
          url: item.url,
          fileName: item.name,
          fileSize: item.size,
          uploadPeople: this.$store.getters.userInfo.realname,
          uploadTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        }
      })
      this.pictureTempListImage = uploadData
      this.formParams.files = this.pictureTempListImage
      console.log(this.pictureTempListImage)
    },
    // 移除
    handleRemoveImage(file) {
      this.pictureTempListImage.splice(this.pictureTempListImage.indexOf(file), 1)
    },

    // 审批
    handleApproval() {
      console.log(this.formParams, this.$store.getters.userInfo)
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // 1编辑 2详情 0新增
          let approvalUrl = this.type == 0 ? addApprove : this.type == 1 ? editApprove : detailApprove
          let data = {
            ...this.formParams,
            department: this.$store.getters.userInfo.orgCodeTxt, //部门名称
          }
          approvalUrl(data).then((res) => {
            if (res.success) {
              this.$message.success(res.message)
              this.$emit('refresh')
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
      console.log('提交---------', this.formParams)
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.type === 0) {
            addQuotation(this.formParams).then((res) => {
              if (res.success) {
                this.$message.success(res.message)
                this.$emit('refresh')
              } else {
                this.$message.error(res.message)
              }
              this.close()
            })
          } else {
            editQuotation(this.formParams).then((res) => {
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

.buttom {
  margin: 10px 5px;
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
