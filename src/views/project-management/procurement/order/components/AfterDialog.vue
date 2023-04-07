<template>
  <a-drawer
    :title="title"
    :maskClosable="true"
    width="800"
    placement="right"
    :closable="true"
    @close="close"
    :visible="visible"
    style="overflow: auto; padding-bottom: 53px"
  >
    <a-spin tip="加载中..." :spinning="loading">
      <a-form-model ref="ruleForm" :model="formParams" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row>
          <a-col :span="24" class="title">订单信息</a-col>
          <a-col :span="12">
            <a-form-model-item label="项目名称" prop="projectName">
              <span>{{ formParams.projectName }}</span>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="供应商名称" prop="supplierName">
              <span>{{ formParams.supplierName }}</span>
            </a-form-model-item>
          </a-col>

          <a-col :span="24" class="title">售后信息</a-col>
          <a-col :span="12">
            <a-form-model-item label="申请人" prop="applyPeople">
              <span>{{ formParams.applyPeople }}</span>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="联系电话" prop="applyPeoplePhone">
              <span>{{ formParams.applyPeoplePhone }}</span>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="申请时间" prop="applyTime">
              <span>{{ formParams.applyTime }}</span>
            </a-form-model-item>
          </a-col>

          <template v-if="this.type == 2">
            <a-col :span="24">
              <a-form-model-item label="售后设备" prop="afterName" :labelCol="{ span: 3 }" :wrapperCol="{ span: 17 }">
                <span>{{ formParams.afterName }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="问题描述" prop="description" :labelCol="{ span: 3 }" :wrapperCol="{ span: 17 }">
                <span>{{ formParams.description }}</span>
              </a-form-model-item>
            </a-col>
          </template>

          <template v-else>
            <a-col :span="24">
              <a-form-model-item label="售后设备" prop="afterName" :labelCol="{ span: 3 }" :wrapperCol="{ span: 17 }">
                <a-input-group>
                  <a-input
                    v-model="formParams.afterName"
                    placeholder="请选择售后设备"
                    disabled
                    :style="{ width: '85%' }"
                  ></a-input>
                  <a-button v-if="this.type !== 2" @click="handleEquiry()">选择 </a-button>
                </a-input-group>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="问题描述" prop="description" :labelCol="{ span: 3 }" :wrapperCol="{ span: 17 }">
                <a-textarea
                  :rows="7"
                  v-model="formParams.description"
                  placeholder="请填写存在问题"
                  :disabled="disableSubmit"
                ></a-textarea>
              </a-form-model-item>
            </a-col>
          </template>

          <a-col :span="24">
            <a-form-model-item label="问题凭证" prop="pictureUrl" :labelCol="{ span: 3 }" :wrapperCol="{ span: 17 }">
              <a-upload
                :action="uploadUrl"
                list-type="picture-card"
                :headers="headers"
                :file-list="pictureUrl"
                @change="handleUploadChangeImage"
                @preview="handlePreview"
                :remove="handleRemoveImage"
                :disabled="disableSubmit"
              >
                <div v-if="pictureUrl.length < 5 && this.type !== 2">
                  <a-icon type="plus" />
                  <div class="ant-upload-text">上传</div>
                </div>
              </a-upload>
              <div style="color: red" v-if="this.type !== 2">注意：仅支持.jpg/png格式</div>
            </a-form-model-item>
            <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
              <img alt="example" style="width: 100%" :src="previewImage" />
            </a-modal>
          </a-col>

          <template v-if="this.type !== 0">
            <a-col :span="24" class="title">处理信息</a-col>
            <a-col :span="12">
              <a-form-model-item label="处理人" prop="principal">
                <span>{{ formParams.principal }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="联系电话" prop="principalPhone">
                <span>{{ formParams.principalPhone }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="处理时间" prop="dealWithTime">
                <span>{{ formParams.dealWithTime }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="处理意见" prop="advice" :labelCol="{ span: 3 }" :wrapperCol="{ span: 17 }">
                <span>{{ formParams.advice }}</span>
              </a-form-model-item>
            </a-col>

            <a-col :span="24" class="title">处理结果</a-col>
            <a-col :span="24">
              <a-form-model-item label="处理结果" prop="status" :labelCol="{ span: 3 }" :wrapperCol="{ span: 17 }">
                <!-- 售后状态：1-处理中，2-已结束 -->
                <a-select v-model="formParams.status" placeholder="处理结果" :disabled="disableSubmit">
                  <a-select-option :value="1">处理中 </a-select-option>
                  <a-select-option :value="2">已结束 </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="备注" prop="remark" :labelCol="{ span: 3 }" :wrapperCol="{ span: 17 }">
                <a-textarea
                  :rows="3"
                  v-model="formParams.remark"
                  placeholder="请填写备注"
                  :disabled="disableSubmit"
                ></a-textarea>
              </a-form-model-item>
            </a-col>
          </template>
        </a-row>
      </a-form-model>
    </a-spin>

    <div class="drawer-bootom-button" v-if="this.type !== 2">
      <a-button @click="close" style="margin-right: 0.8rem">取消</a-button>
      <a-button @click="handleOk" type="primary" :loading="loading"> 确认 </a-button>
    </div>

    <!-- 选售后产品 -->
    <add-materials-dialog
      ref="materialRForm"
      :listUrl="`/prodOrderAfterSales/order/${this.currnetData.orderId || this.currnetData.id}`"
      :treeType="2"
      @select="handleSelectData"
      paramMode="query"
      :columns="columns"
      :columnsSelect="columnsSelect"
      modalTitle="选择售后产品"
      rowKey="id"
      selectType="checkbox"
    >
    </add-materials-dialog>
  </a-drawer>
</template>

<script>
import { getDetail, addAfterSale, editAfterSale, getDetailAfterSale } from '@/api/procurement/Order.js'
// 组件
import AddMaterialsDialog from '@/components/ProductList'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin'
import moment from 'dayjs'
// 去重
import { uniqBy, uniq } from 'lodash'
export default {
  mixins: [TableListMixin],
  components: { AddMaterialsDialog },
  data() {
    return {
      // 开关
      visible: false,
      // 是否禁用
      disableSubmit: false,
      // 标题
      title: '申请售后',
      readOnly: false,
      type: 0,
      // 表单配置
      labelCol: { span: 6 },
      wrapperCol: { span: 17 },
      columns: [
        {
          title: '产品名称',
          dataIndex: 'prodName',
          align: 'center',
          ellipsis: true,
        },
        {
          title: '型号',
          dataIndex: 'model',
          align: 'center',
          ellipsis: true,
        },
        {
          title: '规格参数',
          dataIndex: 'modelParameter',
          align: 'center',
          ellipsis: true,
        },
      ],
      columnsSelect: [
        {
          title: '产品名称',
          dataIndex: 'prodName',
          align: 'center',
          ellipsis: true,
        },
        {
          title: '型号',
          dataIndex: 'model',
          align: 'center',
          ellipsis: true,
        },
        {
          title: '规格参数',
          dataIndex: 'modelParameter',
          align: 'center',
          ellipsis: true,
        },
      ],
      // 预览功能弹窗显隐
      previewVisible: false,
      // 预览地址
      previewImage: '',
      // 上传地址
      uploadUrl: process.env.VUE_APP_API_BASE_URL + '/sys/common/upload',
      // 上传请求头
      headers: {
        'X-Access-Token': this.$ls.get('Access-Token'),
      },
      // 图片上传列表
      pictureUrl: [],
      // 图片处理数据集合
      pictureTempListImage: [],
      // 表单参数
      formParams: {
        applyTime: moment().format('YYYY-MM-DD HH:mm:ss'), //申请时间
        applyPeoplePhone: this.$store.getters.userInfo.phone, // 电话
        applyPeople: this.$store.getters.userInfo.realname, // 申请人
      },
      // 表单验证规则
      rules: {
        afterName: [{ required: true, message: '请选择设备名称', trigger: 'change' }],
        description: [{ required: true, message: '请填写存在问题', trigger: 'blur' }],
        problemType: [{ required: true, message: '请选择设备名称', trigger: 'change' }],
        pictureUrl: [
          {
            required: true,
            validator: (rule, value, callback) => {
              // console.log(this.pictureUrl)
              if (this.pictureUrl == '') return callback(new Error('请上传图片'))
              callback()
            },
            trigger: 'blur',
          },
        ],
      },
      // 加载动画开关
      loading: false,
      disableMixinCreated: true, //不执行混入
      currnetData: '', //当前行数据
      selectAfterId: '', //选择的设备id
    }
  },

  methods: {
    moment,
    // 打开弹窗
    open() {
      this.visible = true
    },

    // 关闭弹窗，点击遮罩层或右上角叉或取消按钮时触发
    close() {
      this.visible = false
      // 重置表单
      this.$refs.ruleForm.resetFields()
      this.currnetData = ''
      this.formParams = {
        applyTime: moment().format('YYYY-MM-DD HH:mm:ss'), //申请时间
        applyPeoplePhone: this.$store.getters.userInfo.phone, // 电话
        applyPeople: this.$store.getters.userInfo.realname, // 申请人
      }
    },

    // 选择售后产品
    handleEquiry() {
      this.$refs.materialRForm.open(this.selectAfterId)
    },

    // 接收选择的售后产品
    handleSelectData(data) {
      // console.log(data)
      this.selectAfterId = uniqBy(data.selectedRowKeys) //用来回显
      this.formParams.equipmentId = uniqBy(data.selectionRows).map((item) => item.id)
      let prodName = data.selectionRows.map((item) => item.prodName + '-' + item.model)
      console.log(prodName)
      this.$set(this.formParams, 'afterName', prodName.toString())
    },

    // 添加
    add(row) {
      this.currnetData = row
      this.getDetail(row.id)
      // 当前为添加模式
      this.type = 0
      this.open()
      this.readOnly = true
    },

    // 编辑
    edit(record) {
      this.type = 1
      this.currnetData = record
      this.getDetailAfterSale(record.id)
      this.open()
      this.readOnly = true
    },

    // 详情
    detail(record) {
      this.type = 2
      this.currnetData = record
      this.getDetailAfterSale(record.id)
      this.open()
    },

    // 获取订单的详情
    getDetail(id) {
      getDetail(id).then((res) => {
        console.log(res)
        if (res.success) {
          this.formParams = {
            orderId: res.result.id, //订单id
            projectName: res.result.projectName,
            supplierName: res.result.supplierName,
            orderProduct: res.result.orderProduct,
            orderTotlePrice: res.result.orderTotlePrice,
            applyTime: moment().format('YYYY-MM-DD HH:mm:ss'), //申请时间
            applyPeoplePhone: this.$store.getters.userInfo.phone, // 电话
            applyPeople: this.$store.getters.userInfo.realname, // 申请人
          }
        }
      })
    },

    // 获取售后单的详情
    getDetailAfterSale(id) {
      getDetailAfterSale(id).then((res) => {
        console.log(res)
        if (res.success) {
          this.formParams = res.result
          // 回显id
          this.selectAfterId = res.result.equipmentId
          // 设备名称
          this.formParams.afterName = res.result.orderProduct.map((item) => item.prodName + '-' + item.model).toString()

          //处理图片
          let pictureUrl = res.result.pictureUrl ? res.result.pictureUrl.split(',') : []
          this.pictureUrl = pictureUrl.map((item, index) => {
            return {
              uid: index,
              status: 'done',
              name: '图片' + index,
              url: item,
            }
          })
          this.pictureTempListImage = this.pictureUrl
        }
      })
    },

    // 搜索
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },

    // 图片上传
    handleUploadChangeImage(info) {
      console.log(info)
      const isLt5M = info.file.size / 1024 / 1024 < 5
      const isJpgOrPng =
        info.file.type === 'image/jpg' || info.file.type === 'image/jpeg' || info.file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('上传图片只能是jpg/png格式!')
        return false
      }
      if (!isLt5M) {
        this.$message.error('上传图片大小不能超过5M!')
        return false
      }

      let fileList = [...info.fileList]
      this.pictureUrl = fileList

      if (info.file.status === 'uploading') {
        return
      }
      if (info.file.status === 'done') {
        let a = fileList[fileList.length - 1]
        this.pictureTempListImage.push({
          uid: a.uid,
          status: 'done',
          name: a.name,
          url: a.response.message,
        })

        this.pictureUrl = this.pictureTempListImage
        const data = this.pictureUrl.map((item) => item.url).toString()
        this.formParams.pictureUrl = data
      }
    },
    // 图片移除
    handleRemoveImage(file) {
      this.pictureTempListImage.splice(this.pictureTempListImage.indexOf(file), 1)
      // 重新处理数据
      this.formParams.pictureUrl = this.pictureTempListImage.map((item) => item.url).toString()
    },
    // 图片预览
    handlePreview(file) {
      this.previewImage = file.url
      this.previewVisible = true
    },
    // 预览弹窗关闭
    handleCancel() {
      this.previewVisible = false
    },

    //提交
    handleOk() {
      console.log('提交的数据', this.formParams)
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let data = {
            orderId: this.formParams.orderId,
            supplierName: this.formParams.supplierName,
            applyPeople: this.formParams.applyPeople,
            applyPeoplePhone: this.formParams.applyPeoplePhone,
            equipmentId: this.formParams.equipmentId,
            description: this.formParams.description,
            pictureUrl: this.formParams.pictureUrl,
            projectName: this.formParams.projectName,
            applyTime: this.formParams.applyTime,
          }
          if (this.type == 0) {
            addAfterSale(data).then((res) => {
              if (res.success) {
                this.$message.success(res.message)
                this.$emit('refresh')
                this.close()
              } else {
                this.$message.error(res.message)
              }
              this.close()
            })
          } else {
            // 编辑售后单
            editAfterSale(this.formParams).then((res) => {
              if (res.success) {
                this.$message.success(res.message)
                this.$emit('refresh')
                this.close()
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
</style>
