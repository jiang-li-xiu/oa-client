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
          <!-- 基本信息 -->
          <a-col :span="24" class="title">基本信息</a-col>
          <a-col :span="24">
            <a-form-model-item label="企业名称" prop="supplierName">
              <a-input v-model="formParams.supplierName" placeholder="请输入企业名称" :disabled="disableSubmit" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="统一社会信用代码" prop="creditCod">
              <a-input v-model="formParams.creditCod" placeholder="请输入统一社会信用代码" :disabled="disableSubmit" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="供应商编号" prop="supplierNum">
              <a-input v-model="formParams.supplierNum" placeholder="请输入供应商编号" :disabled="disableSubmit" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="简称" prop="abbreviation">
              <a-input v-model="formParams.abbreviation" placeholder="请输入简称" :disabled="disableSubmit" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="供应商类型" prop="supplierType">
              <a-select
                v-model="formParams.supplierType"
                placeholder="请选择供应商类型"
                :disabled="disableSubmit"
                allowClear
              >
                <a-select-option value="0">主材</a-select-option>
                <a-select-option value="1">辅材</a-select-option>
                <a-select-option value="2">耗材</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="企业性质" prop="enterpriseType">
              <a-select
                v-model="formParams.enterpriseType"
                placeholder="请选择企业性质"
                :disabled="disableSubmit"
                allowClear
              >
                <a-select-option value="1">民营</a-select-option>
                <a-select-option value="2">国企</a-select-option>
                <a-select-option value="3">私企</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>

          <!--主要联系人  -->
          <a-col :span="24" class="title">主要联系人</a-col>
          <a-col :span="24">
            <a-form-model-item label="姓名" prop="contactsName">
              <a-input v-model="formParams.contactsName" placeholder="请输入姓名" :disabled="disableSubmit" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="手机号" prop="phone">
              <a-input v-model="formParams.phone" placeholder="请输入手机号" :disabled="disableSubmit" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="性别" prop="sex">
              <!-- 性别0-未知1-男2-女 -->
              <j-dict-select-tag
                v-model="formParams.sex"
                placeholder="请选择性别"
                dictCode="sex"
                :disabled="disableSubmit"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="职务" prop="job">
              <a-input v-model="formParams.job" placeholder="请输入职务" :disabled="disableSubmit" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="邮箱地址" prop="email">
              <a-input
                v-model="formParams.email"
                placeholder="请输入邮箱地址, 如:123@qq.com"
                :disabled="disableSubmit"
              />
            </a-form-model-item>
          </a-col>

          <!-- 工商信息 -->
          <a-col :span="24" class="title">工商信息</a-col>
          <a-col :span="24">
            <a-form-model-item label="法人" prop="legalPerson">
              <a-input v-model="formParams.legalPerson" placeholder="请输入法人" :disabled="disableSubmit" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="法人身份证" prop="legalPersonIdentityCard">
              <a-input
                v-model="formParams.legalPersonIdentityCard"
                placeholder="请输入法人身份证"
                :disabled="disableSubmit"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="公司成立时间" prop="establishTime">
              <j-date
                v-model="formParams.establishTime"
                :showTime="true"
                dateFormat="YYYY-MM-DD"
                placeholder="请选择请输入公司成立时间"
                :disabled="disableSubmit"
                style="width: 250px"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="开户行" prop="bank">
              <a-input v-model="formParams.bank" placeholder="请输入开户行" :disabled="disableSubmit" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="开户行账号" prop="bankAccount">
              <a-input v-model="formParams.bankAccount" placeholder="请输入开户行账号" :disabled="disableSubmit" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="注册资金" prop="registeredFund">
              <a-input v-model="formParams.registeredFund" placeholder="请输入注册资金" :disabled="disableSubmit" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="营业执照" prop="businessLicenseUrl">
              <a-upload
                :action="uploadUrl"
                list-type="picture-card"
                :headers="headers"
                :file-list="businessLicenseUrl"
                @change="handleUploadChangeImage"
                @preview="handlePreview"
                :remove="handleRemoveImage"
                :disabled="disableSubmit"
              >
                <div v-if="businessLicenseUrl.length < 1">
                  <a-icon type="plus" />
                  <div class="ant-upload-text">上传</div>
                </div>
              </a-upload>
              <div style="color:red">注意：仅支持.jpg/jpeg格式</div>
            </a-form-model-item>
            <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
              <img alt="example" style="width: 100%" :src="previewImage" />
            </a-modal>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="证件有效截止日期" prop="businessLicenseIndate">
              <j-date
                v-model="formParams.businessLicenseIndate"
                :showTime="true"
                dateFormat="YYYY-MM-DD"
                placeholder="请选择证件有效截止日期"
                :disabled="disableSubmit"
                style="width: 250px"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="工商注册地址" prop="industrialCommercialRegisteredAddress">
              <a-input
                v-model="formParams.industrialCommercialRegisteredAddress"
                placeholder="请输入工商注册地址"
                :disabled="disableSubmit"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="座机" prop="telephone">
              <a-input v-model="formParams.telephone" placeholder="请输入座机" :disabled="disableSubmit" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="传真" prop="facsimile">
              <a-input v-model="formParams.facsimile" placeholder="请输入传真" :disabled="disableSubmit" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="所属国家" prop="nation">
              <a-select v-model="formParams.nation" placeholder="请选择所属国家" :disabled="disableSubmit" allowClear>
                <a-select-option value="0">中国</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="所属地区" prop="area">
              <!-- <a-select v-model="formParams.area" placeholder="请选择所属地区" :disabled="disableSubmit">
                <a-select-option value="0">广西</a-select-option>
              </a-select> -->
              <j-area-linkage
                :disabled="disableSubmit"
                ref="area"
                v-model="formParams.area"
                @change="changeAreaLinkage"
                type="select"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="信用等级" prop="creditLevel">
              <!-- <a-select
                v-model="formParams.creditLevel"
                placeholder="请选择信用等级"
                :disabled="disableSubmit"
                allowClear
              >
                <a-select-option value="0">A</a-select-option>
                <a-select-option value="0">AA</a-select-option>
                <a-select-option value="0">AAA</a-select-option>
              </a-select> -->
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="行业类别" prop="businessType">
              <a-select
                v-model="formParams.businessType"
                placeholder="请选择所属行业"
                :disabled="disableSubmit"
                allowClear
              >
                <a-select-option v-for="item in industryList" :key="item.value" :value="item.value">
                  {{ item.title }}
                </a-select-option>
              </a-select>
              <!-- <j-dict-select-tag
                v-model="formParams.industry"
                dictCode="subordinate_industry"
                placeholder="请选择所属行业"
              /> -->
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="服务领域" prop="servicesRange">
              <!-- <a-tree-select
                show-search
                style="width: 100%"
                v-model="formParams.servicesRange"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                placeholder="请选择服务领域"
                allow-clear
                multiple
                tree-default-expand-all
                @change="onChange"
                :disabled="disableSubmit"
              >
                <a-tree-select-node
                  v-for="item in treeData"
                  :key="item.infoType"
                  :value="item.infoType"
                  :title="item.publicName"
                >
                  <a-tree-select-node
                    v-for="children in item.children"
                    :key="children.infoType"
                    :value="children.infoType"
                    :title="children.publicName"
                  >
                    <a-tree-select-node
                      v-for="level in children.children"
                      :key="level.infoType"
                      :value="level.infoType"
                      :title="level.publicName"
                    >
                    </a-tree-select-node>
                  </a-tree-select-node>
                </a-tree-select-node>
              </a-tree-select> -->
              <j-category-select
                v-model="formParams.servicesRange"
                pcode="A01"
                :multiple="true"
                :disabled="disableSubmit"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="公司简介" prop="companyIntroduction">
              <a-textarea
                v-model="formParams.companyIntroduction"
                :rows="3"
                placeholder="请输入公司简介"
                :disabled="disableSubmit"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="主营业务" prop="majorBusiness">
              <a-textarea
                v-model="formParams.majorBusiness"
                :rows="3"
                placeholder="请输入主营业务"
                :disabled="disableSubmit"
              />
            </a-form-model-item>
          </a-col>

          <!-- 账号信息 -->
          <a-col :span="24" class="title">账号信息</a-col>
          <a-col :span="24">
            <a-form-model-item label="供应商名称" prop="supplierName">
              <a-input v-model="formParams.supplierName" placeholder="请输入供应商名称" :disabled="disableSubmit" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="账号" prop="supplierName">
              <a-input v-model="formParams.supplierName" placeholder="请输入账号" :disabled="disableSubmit" />
            </a-form-model-item>
          </a-col>

          <!-- 修改及审批信息 -->
          <a-col :span="24" class="title">修改及审批信息</a-col>
          <a-table
            :columns="columns"
            rowKey="id"
            :pagination="ipagination"
            :data-source="dataSource"
            bordered
            size="small"
            :scroll="{ x: true }"
            :rowSelection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
              fixed: true
            }"
            @change="handleTableChange"
            :loading="loading"
          >
          </a-table>
        </a-row>
      </a-form-model>
    </a-spin>

    <div class="drawer-bootom-button" v-if="this.type !== 2 && this.type !== 3">
      <a-button @click="close" style="margin-right: 0.8rem">取消</a-button>
      <a-button @click="handleOk" type="primary" :loading="loading">保存</a-button>
    </div>

    <template v-if="this.type === 3">
      <div class="drawer-bootom-button">
        <a-button @click="close" style="margin-right: 0.8rem">取消</a-button>
        <a-button @click="handleApproval" type="primary" :loading="loading">审批</a-button>
      </div>
    </template>

    <!-- 审批 -->
    <approval-dialog ref="approvalForm"></approval-dialog>
  </a-drawer>
</template>

<script>
// 组件
import ApprovalDialog from '../../approval-management/components/ApprovalDialog.vue'
// API
import { editBasicInfo, getDetail } from '@/api/supplier-management/basicInformationManagement'
// 字典
import { getDictText, getDictItemsFromCache, ajaxGetDictItems } from '@/api/api'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin'
export default {
  mixins: [TableListMixin],
  components: { ApprovalDialog },
  data() {
    return {
      // 开关
      visible: false,
      // 是否禁用
      disableSubmit: false,
      // 标题
      title: '新增',
      // 当前模式 0-添加 1-编辑 2-详情
      type: 0,
      // 表单配置
      labelCol: { span: 6 },
      wrapperCol: { span: 17 },
      // 预览功能弹窗显隐
      previewVisible: false,
      // 预览地址
      previewImage: '',
      // 上传地址
      uploadUrl: process.env.VUE_APP_API_BASE_URL + '/sys/common/upload',
      // 上传请求头
      headers: {
        'X-Access-Token': this.$ls.get('Access-Token')
      },
      // 图片上传列表
      businessLicenseUrl: [],
      // 图片处理数据集合
      pictureTempListImage: [],
      // 表单参数
      formParams: {
        supplierType: undefined,
        nation: 0,
        businessLicenseUrl: ''
      },
      // 表单验证规则
      rules: {
        supplierName: [{ required: true, message: '请输入企业名称', trigger: 'blur' }],
        email: [{ required: false, type: 'email', message: '邮箱格式不正确', trigger: 'blur' }],
        supplierType: [{ required: true, message: '请选择供应类型', trigger: 'change' }],
        contactsName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入手机号码!' }, { validator: this.validateMobile }]
        // businessLicenseUrl: [{ required: true, message: '请上传营业执照', trigger: 'change' }]
      },
      // 加载动画开关
      loading: false,
      // 服务列表
      industryList: [],
      treeExpandedKeys: [],
      // 修改审批表格配置
      // 表格配置
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          align: 'center',
          width: 80,
          customRender(text, record, index) {
            return index + 1
          }
        },
        {
          title: '时间',
          dataIndex: 'username',
          align: 'center',
          width: 200
        },
        {
          title: '修改前',
          dataIndex: 'aa',
          align: 'center',
          width: 300
        },
        {
          title: '修改后',
          dataIndex: 'bb',
          align: 'center',
          width: 300
        },
        {
          title: '操作',
          dataIndex: 'cc',
          align: 'center',
          width: 200
        },
        {
          title: '审批操作',
          dataIndex: 'dd',
          align: 'center',
          width: 200
        },
        {
          title: '审批意见',
          dataIndex: 'ee',
          align: 'center',
          width: 300
        }
      ],
      dataSource: [{ aa: '11' }],
      disableMixinCreated: true
    }
  },

  created() {
    this.getIndustryList('subordinate_industry')
    // this.getTreeData('service_sector')
  },

  methods: {
    validateMobile(rule, value, callback) {
      if (!value || new RegExp(/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/).test(value)) {
        callback()
      } else {
        callback('您的手机号码格式不正确!')
      }
    },

    getIndustryList(code) {
      // 获取字典数据
      //优先从缓存中读取字典配置
      if (getDictItemsFromCache(code)) {
        this.industryList = getDictItemsFromCache(code)
        return
      }
      //根据字典Code, 初始化字典数组
      ajaxGetDictItems(code, null).then(res => {
        if (res.success) {
          this.industryList = res.result
        }
      })
    },
    // getTreeData(code) {
    //   // 获取字典数据
    //   //优先从缓存中读取字典配置
    //   if (getDictItemsFromCache(code)) {
    //     this.treeData = getDictItemsFromCache(code)
    //     return
    //   }
    //   //根据字典Code, 初始化字典数组
    //   ajaxGetDictItems(code, null).then(res => {
    //     if (res.success) {
    //       this.treeData = res.result
    //     }
    //   })
    // },

    // 服务树形选中的值
    onChange(value) {
      console.log(value.toString())
      // this.formParams.servicesRange = value.toString()
    },

    //获取去省级信息
    changeAreaLinkage(val) {
      const arr = []
      this.$refs['area'].areaData.getAreaBycode(val, arr, 3)
      this.formParams.province = arr[0]
      this.formParams.city = arr[1]
      this.formParams.country = arr[2]
    },

    // 打开弹窗
    open(row) {
      this.visible = true
      this.formParams.nation = 0
    },

    // 关闭弹窗，点击遮罩层或右上角叉或取消按钮时触发
    close() {
      this.visible = false
      // 重置表单
      this.$refs.ruleForm.resetFields()
      this.formParams = {
        supplierType: undefined,
        nation: 0
      }
      this.businessLicenseUrl = []
    },

    // 编辑
    edit(record) {
      console.log(record)
      this.type = 1
      this.getDetail(record.id)
      this.open()
    },

    // 详情
    detail(record) {
      console.log(record)
      this.type = 2
      this.getDetail(record.id || record)
      this.open()
    },

    // 审批的详情（需要显示审批按钮）
    detailApproval(record) {
      console.log(record)
      this.type = 3
      this.getDetail(record.id || record)
      this.open()
    },

    // 获取详情
    getDetail(id) {
      getDetail({id}).then(res => {
        if (res.success) {
          this.formParams = res.result
          //处理图片
          let businessLicenseUrl = res.result.businessLicenseUrl ? res.result.businessLicenseUrl.split(',') : []
          this.businessLicenseUrl = businessLicenseUrl.map((item, index) => {
            return {
              uid: index,
              status: 'done',
              name: '图片' + index,
              url: item
            }
          })
          this.pictureTempListImage = this.businessLicenseUrl
          if (res.result.enterpriseType) {
            this.formParams.enterpriseType = res.result.enterpriseType.toString()
            // this.formParams.servicesRange = [this.formParams.servicesRange].join(',').split(',')
          }
        }
      })
    },

    // 图片上传
    handleUploadChangeImage(info) {
      console.log(info)
      const isLt5M = info.file.size / 1024 / 1024 < 5
      const isJpgOrPng = info.file.type === 'image/jpg' || info.file.type === 'image/jpeg'
      if (!isJpgOrPng) {
        this.$message.error('上传图片只能是jpg/jpeg格式!')
        return false
      }
      if (!isLt5M) {
        this.$message.error('上传图片大小不能超过5M!')
        return false
      }

      let fileList = [...info.fileList]
      this.businessLicenseUrl = fileList

      if (info.file.status === 'uploading') {
        return
      }
      if (info.file.status === 'done') {
        let a = fileList[fileList.length - 1]
        this.pictureTempListImage.push({
          uid: a.uid,
          status: 'done',
          name: a.name,
          url: a.response.message
        })

        this.businessLicenseUrl = this.pictureTempListImage
        const data = this.businessLicenseUrl.map(item => item.url).toString()
        this.formParams.businessLicenseUrl = data
      }
    },
    // 图片移除
    handleRemoveImage(file) {
      this.pictureTempListImage.splice(this.pictureTempListImage.indexOf(file), 1)
      // 重新处理数据
      this.formParams.businessLicenseUrl = this.pictureTempListImage.map(item => item.url).toString()
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
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          // this.formParams.servicesRange = this.formParams.servicesRange.toString()
          editBasicInfo(this.formParams).then(res => {
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

    // 审批
    handleApproval(row) {
      let that = this
      this.$confirm({
        title: '请确认',
        content: '是否确认通过审核？',
        okText: '确认',
        cancelText: '不通过',
        onOk: function() {
          // that.loading = true
          // deleteAction(that.url.deleteBatch, { ids: ids })
          //   .then(res => {
          //     if (res.success) {
          //       //重新计算分页问题
          //       that.reCalculatePage(that.selectedRowKeys.length)
          //       that.$message.success(res.message)
          //       that.loadData()
          //       that.onClearSelected()
          //     } else {
          //       that.$message.warning(res.message)
          //     }
          //   })
          // .finally(() => {
          //   that.loading = false
          // })
        },
        onCancel() {
          that.$refs.approvalForm.open(row)
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
