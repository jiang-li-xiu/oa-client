<template>
  <a-drawer
    :title="title"
    :maskClosable="true"
    width="1100"
    placement="right"
    :closable="true"
    @close="close"
    :visible="visible"
    style="overflow: auto; padding-bottom: 53px"
  >
    <a-spin tip="加载中..." :spinning="loading">
      <a-form-model ref="ruleForm" :model="formParams" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-tabs default-active-key="1">
          <a-tab-pane key="1" tab="基本信息">
            <a-row>
              <!-- 基本信息 -->
              <a-col :span="24" class="title">基本信息</a-col>
              <a-col :span="12">
                <a-form-model-item label="创建人" prop="createBy">
                  <a-input v-model="formParams.createBy" placeholder="请输入创建人" :disabled="disableSubmit" />
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="企业名称" prop="supplier">
                  <a-input v-model="formParams.supplier" placeholder="请输入企业名称" :disabled="disableSubmit" />
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="统一社会信用代码" prop="creditCode">
                  <a-input
                    v-model="formParams.creditCode"
                    placeholder="请输入统一社会信用代码"
                    :disabled="disableSubmit"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="供应商编号" prop="companyNo">
                  <a-input v-model="formParams.companyNo" placeholder="请输入供应商编号" :disabled="disableSubmit" />
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="简称" prop="supplierOutline">
                  <a-input v-model="formParams.supplierOutline" placeholder="请输入简称" :disabled="disableSubmit" />
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="供应商类型" prop="trade">
                  <j-dict-select-tag
                    v-model="formParams.trade"
                    dictCode="supplier_type"
                    placeholder="请选择供应商类型"
                    :disabled="disableSubmit"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="企业性质" prop="enterpriseNature">
                  <a-select
                    v-model="formParams.enterpriseNature"
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
              <a-col :span="12">
                <a-form-model-item label="姓名" prop="userName">
                  <a-input v-model="formParams.userName" placeholder="请输入姓名" :disabled="disableSubmit" />
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="手机号" prop="peoplePhone">
                  <a-input v-model="formParams.peoplePhone" placeholder="请输入手机号" :disabled="disableSubmit" />
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
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
              <a-col :span="12">
                <a-form-model-item label="职务" prop="position">
                  <a-input v-model="formParams.position" placeholder="请输入职务" :disabled="disableSubmit" />
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="邮箱地址" prop="peopleEmail">
                  <a-input
                    v-model="formParams.peopleEmail"
                    placeholder="请输入邮箱地址, 如:123@qq.com"
                    :disabled="disableSubmit"
                  />
                </a-form-model-item>
              </a-col>

              <!-- 工商信息 -->
              <a-col :span="24" class="title">工商信息</a-col>
              <a-col :span="12">
                <a-form-model-item label="法人" prop="legalPerson">
                  <a-input v-model="formParams.legalPerson" placeholder="请输入法人" :disabled="disableSubmit" />
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="法人身份证" prop="idCard">
                  <a-input v-model="formParams.idCard" placeholder="请输入法人身份证" :disabled="disableSubmit" />
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="公司成立时间" prop="companySetUpTime">
                  <j-date
                    v-model="formParams.companySetUpTime"
                    :showTime="true"
                    dateFormat="YYYY-MM-DD"
                    placeholder="请选择请输入公司成立时间"
                    :disabled="disableSubmit"
                    style="width: 250px"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="开户行" prop="bank">
                  <a-input v-model="formParams.bank" placeholder="请输入开户行" :disabled="disableSubmit" />
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="开户行账号" prop="bankNo">
                  <a-input v-model="formParams.bankNo" placeholder="请输入开户行账号" :disabled="disableSubmit" />
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="注册资金" prop="registeredCapital">
                  <a-input
                    v-model="formParams.registeredCapital"
                    placeholder="请输入注册资金"
                    :disabled="disableSubmit"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item label="营业执照" prop="license" :label-col="{ span: 3 }" :wrapper-col="{ span: 19 }">
                  <a-upload
                    :action="uploadUrl"
                    list-type="picture-card"
                    :headers="headers"
                    :file-list="license"
                    @change="handleUploadChangeImage"
                    @preview="handlePreview"
                    :remove="handleRemoveImage"
                    :disabled="disableSubmit"
                  >
                    <div v-if="license.length < 1">
                      <a-icon type="plus" />
                      <div class="ant-upload-text">上传</div>
                    </div>
                  </a-upload>
                  <div style="color: red" v-if="this.type == 1 || this.type == 0">注意：仅支持.jpg/png格式</div>
                </a-form-model-item>
                <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                  <img alt="example" style="width: 100%" :src="previewImage" />
                </a-modal>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="证件有效截止日期" prop="licenseExp">
                  <j-date
                    v-model="formParams.licenseExp"
                    :showTime="true"
                    dateFormat="YYYY-MM-DD"
                    placeholder="请选择证件有效截止日期"
                    :disabled="disableSubmit"
                    style="width: 250px"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="工商注册地址" prop="registeredAddress">
                  <a-input
                    v-model="formParams.registeredAddress"
                    placeholder="请输入工商注册地址"
                    :disabled="disableSubmit"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="座机" prop="tel">
                  <a-input v-model="formParams.tel" placeholder="请输入座机" :disabled="disableSubmit" />
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="传真" prop="fax">
                  <a-input v-model="formParams.fax" placeholder="请输入传真" :disabled="disableSubmit" />
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="所属国家" prop="country">
                  <a-select
                    v-model="formParams.country"
                    placeholder="请选择所属国家"
                    :disabled="disableSubmit"
                    allowClear
                  >
                    <a-select-option value="0">中国</a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item label="所属地区" prop="region" :label-col="{ span: 3 }" :wrapper-col="{ span: 19 }">
                  <j-area-linkage
                    disabled
                    ref="area"
                    v-model="formParams.region"
                    @change="changeAreaLinkage"
                    type="select"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="信用等级" prop="creditRating">
                  <j-dict-select-tag
                    v-model="formParams.creditRating"
                    dictCode="credit_rating"
                    placeholder="请选择信用等级"
                    :disabled="disableSubmit"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="行业类别" prop="industryCategory">
                  <a-select
                    v-model="formParams.industryCategory"
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
              <a-col :span="12">
                <a-form-model-item label="服务领域" prop="serviceArea">
                  <j-category-select
                    v-model="formParams.serviceArea"
                    pcode="A01"
                    :multiple="true"
                    :disabled="disableSubmit"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item label="公司简介" prop="profile" :label-col="{ span: 3 }" :wrapper-col="{ span: 19 }">
                  <a-textarea
                    v-model="formParams.profile"
                    :rows="3"
                    placeholder="请输入公司简介"
                    :disabled="disableSubmit"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item
                  label="主营业务"
                  prop="mainBusiness"
                  :label-col="{ span: 3 }"
                  :wrapper-col="{ span: 19 }"
                >
                  <a-textarea
                    v-model="formParams.mainBusiness"
                    :rows="3"
                    placeholder="请输入主营业务"
                    :disabled="disableSubmit"
                  />
                </a-form-model-item>
              </a-col>

              <!-- 成功案例  (账号管理、审批管理不需要展示) -->
              <template v-if="this.type == 1 || this.type == 2">
                <a-col :span="24" class="title">成功案例</a-col>
                <div v-for="(item, index) in formParams.case" :key="index">
                  <div class="case">
                    <a-col :span="24" class="index"
                      >案例{{ index + 1 }}
                      <!-- <a @click="handleDelete(item, index)">删除 </a> -->
                    </a-col>
                    <a-col :span="24">
                      <a-form-model-item
                        label="案例名称"
                        prop="name"
                        :label-col="{ span: 3 }"
                        :wrapper-col="{ span: 19 }"
                      >
                        <a-input v-model="item.name" placeholder="请输入案例名称" :disabled="disableSubmit" />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="24">
                      <a-form-model-item
                        label="案例简介"
                        prop="aaaaa"
                        :label-col="{ span: 3 }"
                        :wrapper-col="{ span: 19 }"
                      >
                        <a-textarea
                          :rows="3"
                          v-model="item.aaaaa"
                          placeholder="请输入案例简介"
                          :disabled="disableSubmit"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="24">
                      <a-form-model-item
                        label="案例图片"
                        prop="imageUrl"
                        :label-col="{ span: 3 }"
                        :wrapper-col="{ span: 19 }"
                      >
                        <a-upload
                          :action="uploadUrl"
                          list-type="picture-card"
                          :headers="headers"
                          :file-list="imageUrl[index]"
                          @change="handleUploadImage($event, item, index)"
                          @preview="handlePreviewCase"
                          :remove="() => handleRemoveCaseImage(item, index)"
                          :disabled="disableSubmit"
                        >
                          <div v-if="imageUrl.length < 6">
                            <a-icon type="plus" />
                            <div class="ant-upload-text">上传</div>
                          </div>
                        </a-upload>
                        <div style="color: red">注意：支持.jpg/.png格式，每个案例最多上传6张图片</div>
                      </a-form-model-item>
                      <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancelCase">
                        <img alt="example" style="width: 100%" :src="previewImage" />
                      </a-modal>
                    </a-col>
                  </div>
                </div>
                <a-col :span="24">
                  <a-button type="dashed" @click="handleAddCase" icon="plus" class="button" :disabled="disableSubmit">
                    添加成功案例
                  </a-button>
                </a-col>
              </template>

              <!-- 账号信息  (账号管理需要展示!!!)-->
              <template v-if="this.type == 4">
                <a-col :span="24" class="title">账号信息</a-col>
                <a-col :span="12">
                  <a-form-model-item label="供应商名称" prop="supplier">
                    <a-input v-model="formParams.supplier" placeholder="请输入供应商名称" :disabled="disableSubmit" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item label="账号" prop="account">
                    <a-input v-model="formParams.account" placeholder="请输入账号" :disabled="disableSubmit" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item label="手机号" prop="phone">
                    <a-input v-model="formParams.phone" placeholder="请输入手机号" :disabled="disableSubmit" />
                  </a-form-model-item>
                </a-col>

                <!-- 修改及审批信息 -->
                <!-- <a-col :span="24" class="title">修改及审批信息</a-col>
                <a-col :span="24">
                  <a-table
                    :columns="columns"
                    rowKey="id"
                    :pagination="ipagination"
                    :data-source="dataSource"
                    bordered
                    size="small"
                    :scroll="{ x: true }"
                    @change="handleTableChange"
                    :loading="loading"
                  >
                  </a-table>
                </a-col> -->
              </template>

              <!-- 审批信息详情 （审批管理显示）-->
              <template v-if="this.type == 3">
                <a-col :span="24" class="title">账号信息</a-col>
                <a-col :span="12">
                  <a-form-model-item label="供应商名称" prop="supplier">
                    <a-input v-model="formParams.supplier" placeholder="请输入供应商名称" :disabled="disableSubmit" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item label="账号" prop="account">
                    <a-input v-model="formParams.account" placeholder="请输入账号" :disabled="disableSubmit" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item label="手机号" prop="phone">
                    <a-input v-model="formParams.phone" placeholder="请输入手机号" :disabled="disableSubmit" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="24" class="title">历史记录</a-col>
                <a-col :span="24">
                  <a-table
                    :columns="columns"
                    rowKey="id"
                    :pagination="ipagination"
                    :data-source="dataSource"
                    bordered
                    size="small"
                    :scroll="{ x: true }"
                    @change="handleTableChange"
                    :loading="loading"
                  >
                  </a-table>
                </a-col>
                <a-col :span="24" class="title">审批信息</a-col>
                <a-col :span="24">
                  <a-table
                    :columns="approvalColumns"
                    rowKey="id"
                    :pagination="approvalIpagination"
                    :data-source="approvalData"
                    bordered
                    size="small"
                    :scroll="{ x: true }"
                    @change="handleApprovalTableChange"
                    :loading="approvalLoading"
                  >
                  </a-table>
                </a-col>
              </template>
            </a-row>
          </a-tab-pane>

          <!-- 账号信息 -->
          <template v-if="this.type == 4">
            <a-tab-pane key="2" tab="修改记录" force-render>
              <!-- 修改及审批信息 -->
              <a-row>
                <a-col :span="24" class="title">修改记录</a-col>
                <a-col :span="24">
                  <a-table
                    :columns="columns"
                    rowKey="id"
                    :pagination="ipagination"
                    :data-source="dataSource"
                    bordered
                    size="small"
                    :scroll="{ x: true }"
                    @change="handleTableChange"
                    :loading="loading"
                  >
                  </a-table>
                </a-col>
              </a-row>
            </a-tab-pane>
            <a-tab-pane key="3" tab="审批记录">
              <a-col :span="24" class="title">审批信息</a-col>
              <a-col :span="24">
                <a-table
                  :columns="approvalColumns"
                  rowKey="id"
                  :pagination="approvalIpagination"
                  :data-source="approvalData"
                  bordered
                  size="small"
                  :scroll="{ x: true }"
                  @change="handleApprovalTableChange"
                  :loading="approvalLoading"
                >
                </a-table>
              </a-col>
            </a-tab-pane>
          </template>
        </a-tabs>
      </a-form-model>
    </a-spin>

    <!-- 编辑的底部按钮 -->
    <div class="drawer-bootom-button" v-if="this.type == 1">
      <a-button @click="close" style="margin-right: 0.8rem">取消</a-button>
      <a-button @click="handleOk(1)" style="margin-right: 0.8rem" type="primary" :loading="loading">保存</a-button>
      <a-button @click="handleOk(2)" type="primary" :loading="loading">提交</a-button>
    </div>

    <!-- 这是审批管理底部按钮 -->
    <template v-if="this.type === 3">
      <div class="drawer-bootom-button">
        <a-button @click="close" style="margin-right: 0.8rem">取消</a-button>
        <a-button @click="handleApprovalOpen" type="primary" :loading="loading">审批</a-button>
      </div>
    </template>

    <!-- 这是审批弹窗 -->
    <approval-dialog ref="approvalForm" @refresh="refreshList"></approval-dialog>
  </a-drawer>
</template>

<script>
// 组件
import ApprovalDialog from '@/views/supplier-management/approval-management/components/ApprovalDialog.vue'
// API
import {
  saveBasicInfo,
  submitBasicInfo,
  getDetail,
  getApprovalDetail,
  getSupplierHistory,
  geteDetailAudit
} from '@/api/supplier-user-management/basicInformationManagement'
import { getAction } from '@/api/manage'
// 字典
import { getDictText, getDictItemsFromCache, ajaxGetDictItems } from '@/api/api'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin'
//导入过滤对象中为空的属性、防抖方法
import { filterObj } from '@/utils/util'
export default {
  components: { ApprovalDialog },
  mixins: [TableListMixin],
  data() {
    return {
      // 开关
      visible: false,
      // 是否禁用
      disableSubmit: false,
      // 标题
      title: '编辑',
      // 当前模式 1-编辑 2-详情 3-审批详情 4-账号详情
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
      // 营业执照图片上传列表
      license: [],
      // 营业执照图片处理数据集合
      pictureTempListImage: [],
      // 案例图片上传列表
      imageUrl: [],
      // 案例图片图片处理数据集合
      imageUrlListImage: [],
      // 表单参数
      formParams: {
        supplierId: '', //id
        trade: undefined,
        country: 0,
        license: '',
        // 案例
        case: [
          {
            name: '', //
            aaaaa: '',
            imageUrl: []
          }
        ]
      },
      // 表单验证规则
      rules: {
        supplier: [{ required: true, message: '请输入企业名称', trigger: 'blur' }],
        creditCode: [{ required: true, message: '请输入统一社会信用代码', trigger: 'blur' }],
        companyNo: [{ required: true, message: '请输入供应商编号', trigger: 'blur' }],
        // supplierOutline: [{ required: true, message: '请输入简称', trigger: 'blur' }],
        trade: [{ required: true, message: '请选择供应商类型!' }],
        enterpriseNature: [{ required: true, message: '请选择企业性质', trigger: 'change' }],
        userName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }, { validator: this.validateMobile }],
        sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
        email: [{ required: true, type: 'email', message: '请输入邮箱地址', trigger: 'blur' }]
        // name: [{ required: true, message: '请输入案例名称', trigger: 'blur' }],
        // aaaaa: [{ required: true, message: '请输入案例简介', trigger: 'blur' }]
      },
      // 加载动画开关
      loading: false,
      // 服务列表
      industryList: [],
      // 修改及审批/历史记录表格配置
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          align: 'center',
          width: 60,
          customRender(text, record, index) {
            return index + 1
          }
        },
        {
          title: '时间',
          dataIndex: 'time',
          align: 'center',
          width: '20%'
        },
        {
          title: '修改前',
          dataIndex: 'updateBefore',
          align: 'center',
          width: '25%'
        },
        {
          title: '修改后',
          dataIndex: 'updateAfter',
          align: 'center',
          width: '25%'
        },
        {
          title: '修改人',
          dataIndex: 'updatePeople',
          align: 'center',
          width: '20%'
        },
        {
          title: '操作',
          dataIndex: 'operation',
          align: 'center',
          width: '10%'
        }
      ],
      // 审批信息表格
      approvalColumns: [
        {
          title: '序号',
          dataIndex: 'index',
          align: 'center',
          width: 60,
          customRender(text, record, index) {
            return index + 1
          }
        },
        {
          title: '时间',
          dataIndex: 'time',
          align: 'center',
          width: '20%'
        },
        {
          title: '审批人',
          dataIndex: 'approvalPeople',
          align: 'center',
          width: '20%'
        },
        {
          title: '审批操作',
          dataIndex: 'operation',
          align: 'center',
          width: '20%'
        },
        {
          title: '审批意见',
          dataIndex: 'approvalComment',
          align: 'center',
          width: '40%'
        }
      ],
      // 审批信息数据
      approvalData: [],
      // disableMixinCreated: true,
      url: {
        list: '/jeecg-supplier/prodSupplierDetailHistory/list', //信息更新历史记录（保存记录）
        approvalList: '/jeecg-supplier/detailAudit/list' //审批记录列表
      },
      info: [], //当前行信息,
      /* 审批分页参数 */
      approvalIpagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '30', '50', '100'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      approvalLoading: false, //审批记录加载状态
      supplierIds: '' //保存供应商id
    }
  },

  created() {
    this.getIndustryList('subordinate_industry')
    // this.getTreeData('service_sector')
  },

  methods: {
    // -------历史记录/审批记录 查询参数渲染
    getQueryParams() {
      //获取高级查询条件
      let sqp = {}
      if (this.superQueryParams) {
        sqp['superQueryParams'] = encodeURI(this.superQueryParams)
        sqp['superQueryMatchType'] = this.superQueryMatchType
      }
      let param = Object.assign(sqp, this.param, this.isorter, this.filters)
      param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      param.supplierId = this.supplierIds
      return filterObj(param)
    },
    // ------------end----------------

    // ---------审批记录分页
    handleApprovalTableChange(pagination, filters, sorter) {
      //分页、排序、筛选变化时触发
      //TODO 筛选
      // console.log(pagination)
      if (Object.keys(sorter).length > 0) {
        this.isorter.column = sorter.field
        this.isorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
      }
      this.approvalIpagination = pagination
      this.approvalList()
    },
    // 审批列表数据
    approvalList(arg) {
      //加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.approvalIpagination.current = 1
      }
      let params = this.getApprovalQueryParams() //查询条件
      this.approvalLoading = true
      getAction(this.url.approvalList, params)
        .then(res => {
          if (res.success) {
            this.approvalData = res.result.records || res.result
            if (res.result.total) {
              this.approvalIpagination.total = res.result.total
            } else {
              this.approvalIpagination.total = 0
            }
          } else {
            this.$message.warning(res.message)
          }
        })
        .finally(() => {
          this.approvalLoading = false
        })
    },
    // 审批查询参数渲染
    getApprovalQueryParams() {
      //获取高级查询条件
      let sqp = {}
      if (this.superQueryParams) {
        sqp['superQueryParams'] = encodeURI(this.superQueryParams)
        sqp['superQueryMatchType'] = this.superQueryMatchType
      }
      let param = Object.assign(sqp, this.param, this.isorter, this.filters)
      param.field = this.getQueryField()
      param.pageNo = this.approvalIpagination.current
      param.pageSize = this.approvalIpagination.pageSize
      param.supplierId = this.supplierIds
      return filterObj(param)
    },
    // 审批记录-end-------------

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

    // 服务树形选中的值
    onChange(value) {
      console.log(value.toString())
      // this.formParams.serviceArea = value.toString()
    },

    //获取省级信息
    changeAreaLinkage(val) {
      const arr = []
      this.$refs['area'].areaData.getAreaBycode(val, arr, 3)
      this.formParams.province = arr[0]
      this.formParams.city = arr[1]
      this.formParams.country = arr[2]
    },

    // 刷新
    refreshList() {
      this.close()
      // this.loadData(1)
      this.$bus.$emit('refreshApprovalList')
    },

    // 打开弹窗
    open(row) {
      this.visible = true
      this.formParams.country = 0
    },

    // 获取历史记录，审批记录
    getRecord(id) {
      // this.getSupplierHistory(id)
      // this.geteDetailAudit(id)
      this.loadData(1)
      this.approvalList(1)
    },

    // 关闭弹窗，点击遮罩层或右上角叉或取消按钮时触发
    close() {
      this.visible = false
      // 重置表单
      this.$refs.ruleForm.resetFields()
      this.formParams = {
        trade: undefined,
        country: 0,
        // 案例
        case: [
          {
            name: '', //
            aaaaa: '',
            imageUrl: []
          }
        ]
      }
      // 清空表格数据
      this.dataSource = []
      this.approvalData = []
      // 清空图片
      this.license = []
      this.imageUrl = []
      this.pictureTempListImage = []
      this.imageUrlListImage = []
    },

    // 编辑
    edit(record) {
      console.log(record)
      this.type = 1
      this.getDetail(record.id || record)
      this.getRecord(record.id || record)
      this.open()
    },

    // 详情
    detail(record) {
      console.log(record)
      this.type = 2
      this.getDetail(record.id || record)
      this.getRecord(record.id || record)
      this.open()
    },

    // 审批的详情（需要显示审批按钮）
    detailApproval(record) {
      // console.log(record)
      this.supplierIds = record.supplierId || record.id
      this.info = record
      this.type = 3
      // this.getDetail(record.id || record)
      getApprovalDetail({ id: record.id || record }).then(res => {
        if (res.success) {
          this.formParams = res.result
          //处理图片
          let license = res.result.license ? res.result.license.split(',') : []
          this.license = license.map((item, index) => {
            return {
              uid: index,
              status: 'done',
              name: '图片' + index,
              url: item
            }
          })
          this.pictureTempListImage = this.license
          if (res.result.enterpriseNature) {
            this.formParams.enterpriseNature = res.result.enterpriseNature.toString()
            // this.formParams.serviceArea = [this.formParams.serviceArea].join(',').split(',')
          }
        }
      })
      this.getRecord(record.id || record)
      this.open()
    },

    // 账号的详情（不需要显示审批按钮）
    detailAccount(record) {
      // console.log(record)
      this.supplierIds = record.supplierId || record.id
      this.type = 4
      this.getDetail(record.id || record)
      this.getRecord(record.id || record)
      this.open()
    },

    // 添加成功案例
    handleAddCase() {
      this.formParams.case.push({
        name: '',
        aaaaa: '',
        imageUrl: []
      })
    },

    // 删除成功案例
    handleDelete(record, index) {
      this.formParams.case.splice(index, 1)
    },

    // 获取信息更新历史记录
    getSupplierHistory(supplierId) {
      getSupplierHistory({ supplierId }).then(res => {
        // 修改及审批信息
        this.dataSource = res.result.records
      })
    },
    // 信息提交审批记录（审批记录)
    geteDetailAudit(supplierId) {
      geteDetailAudit({ supplierId }).then(res => {
        console.log(res)
        // 审批记录数据
        this.approvalData = res.result.records
      })
    },

    // 获取详情
    getDetail(id) {
      getDetail({ id }).then(res => {
        if (res.success) {
          this.formParams = res.result
          //处理图片
          let license = res.result.license ? res.result.license.split(',') : []
          this.license = license.map((item, index) => {
            return {
              uid: index,
              status: 'done',
              name: '图片' + index,
              url: item
            }
          })
          this.pictureTempListImage = this.license
          if (res.result.enterpriseNature) {
            this.formParams.enterpriseNature = res.result.enterpriseNature.toString()
            // this.formParams.serviceArea = [this.formParams.serviceArea].join(',').split(',')
          }
        }
      })
    },

    // 图片上传
    handleUploadChangeImage(info) {
      console.log(info)
      const isLt5M = info.file.size / 1024 / 1024 < 5
      const isJpgOrPng =
        info.file.type === 'image/jpg' || info.file.type === 'image/jpeg' || info.file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('上传图片只能是.jpg/.png格式!')
        return false
      }
      if (!isLt5M) {
        this.$message.error('上传图片大小不能超过5M!')
        return false
      }

      let fileList = [...info.fileList]
      this.license = fileList

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

        this.license = this.pictureTempListImage
        const data = this.license.map(item => item.url).toString()
        this.formParams.license = data
      }
    },
    // 图片移除
    handleRemoveImage(file) {
      this.pictureTempListImage.splice(this.pictureTempListImage.indexOf(file), 1)
      // 重新处理数据
      this.formParams.license = this.pictureTempListImage.map(item => item.url).toString()
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

    // 案例-----图片上传
    handleUploadImage(info, data, index) {
      console.log('info-----', info, 'data-----', data, index)
      const isLt5M = info.file.size / 1024 / 1024 < 5
      const isJpgOrPng =
        info.file.type === 'image/jpg' || info.file.type === 'image/jpeg' || info.file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('上传图片只能是.jpg/.png格式!')
        return false
      }
      if (!isLt5M) {
        this.$message.error('上传图片大小不能超过5M!')
        return false
      }
      let fileList = [...info.fileList]
      this.$set(this.imageUrl, index, fileList)
      // this.imageUrl = fileList

      if (info.file.status === 'uploading') {
        return
      }
      if (info.file.status === 'done') {
        let a = fileList[fileList.length - 1]
        this.imageUrlListImage.push({
          uid: a.uid,
          status: 'done',
          name: a.name,
          url: a.response.message
        })
        // data.imageUrl = JSON.stringify(this.imageUrlListImage)
        // 记录当前下标，向当前下标添加图片数据
        let currentIndex = index
        if (currentIndex == index) {
          data.imageUrl.push(JSON.stringify(this.imageUrlListImage))
          // 清空图片列表 重新按下标赋值
          this.imageUrlListImage = []
        }
        // console.log(data.imageUrl)
        this.formParams.case[index].imageUrl = data.imageUrl
      }
    },

    // 案例----- 图片移除
    handleRemoveCaseImage(data, index) {
      const arr = JSON.parse(data.imageUrl || '[]')
      arr.splice(index, 1)
      data.imageUrl = JSON.stringify(arr)
    },
    // 案例----- 图片预览
    handlePreviewCase(file) {
      // console.log(file)
      this.previewImage = file.response.message
      this.previewVisible = true
    },
    // 案例----- 预览弹窗关闭
    handleCancelCase() {
      this.previewVisible = false
    },

    // 审批确认框
    handleApprovalOpen() {
      // 当前审核的信息
      console.log(this.info)
      this.$refs.approvalForm.openApproval(this.info)
    },

    //提交
    handleOk(value) {
      console.log(this.formParams)
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (value == 1) {
            this.formParams.supplierId = this.$store.getters.userInfo.id //当前登录账号的id
            saveBasicInfo(this.formParams).then(res => {
              if (res.success) {
                this.$message.success(res.message)
                this.$emit('refresh', this.formParams.supplierId)
              } else {
                this.$message.error(res.message)
              }
              this.close()
            })
          } else {
            this.formParams.supplierId = this.$store.getters.userInfo.id //当前登录账号的id
            submitBasicInfo(this.formParams).then(res => {
              if (res.success) {
                this.$message.success(res.message)
                this.$emit('refresh', this.formParams.supplierId)
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
.button {
  width: 100%;
  margin-bottom: 20px;
}
.case {
  border: 1px solid #000;
}
.index {
  font-size: 15px;
  text-align: center;
  margin-bottom: 15px;
  color: rgb(46, 46, 46);
}
</style>
