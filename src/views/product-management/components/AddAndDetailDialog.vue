<template>
  <a-drawer
    :title="title"
    :maskClosable="true"
    width="900"
    placement="right"
    :closable="true"
    @close="close"
    :visible="visible"
    style="overflow: auto; padding-bottom: 53px"
  >
    <a-spin tip="加载中..." :spinning="loading">
      <a-form-model ref="ruleForm" :model="formParams" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="产品类型" prop="productType">
              <a-input-group>
                <a-select
                  v-model="formParams.productType"
                  style="width: 100%"
                  defaultValue="0"
                  :disabled="disableSubmit"
                  placeholder="请选择产品类型"
                  :default-value="0"
                  @change="handleChangeProductType"
                >
                  <a-select-option value="1">设备</a-select-option>
                  <a-select-option value="2">劳务</a-select-option>
                </a-select>
              </a-input-group>
            </a-form-model-item>
          </a-col>
          <template v-if="formParams.productType == 1">
            <a-col :span="12">
              <a-form-model-item label="产供应商" prop="supplierName">
                <a-select
                  v-model="formParams.supplierName"
                  :disabled="disableSubmit"
                  placeholder="请选择产供应商"
                  @change="handleChangeSupplier"
                  show-search
                  option-filter-prop="children"
                  :filter-option="filterOption"
                >
                  <a-select-option v-for="item in basicNameList" :key="item.id" :value="item.id">
                    {{ item.supplier }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="产品分类" prop="productClassify">
                <j-category-select
                  v-model="formParams.productClassify"
                  pcode="B03"
                  :multiple="false"
                  :disabled="disableSubmit"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="单价(元)" prop="price">
                <a-input-number
                  style="width: 300px"
                  v-model="formParams.price"
                  placeholder="请输入单价"
                  :precision="2"
                  :disabled="disableSubmit"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="产品名称" prop="prodName">
                <a-input v-model="formParams.prodName" placeholder="请输入产品名称" :disabled="disableSubmit" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="品牌" prop="brand">
                <a-input v-model="formParams.brand" placeholder="请输入品牌" :disabled="disableSubmit" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="单位" prop="unit">
                <a-input v-model="formParams.unit" placeholder="请输入单位" :disabled="disableSubmit" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="维修地址" prop="serviceAddr">
                <a-input v-model="formParams.serviceAddr" placeholder="请输入维修地址" :disabled="disableSubmit" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="型号" prop="model">
                <a-input v-model="formParams.model" placeholder="请输入型号" :disabled="disableSubmit" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="货期（天）" prop="supplyTime">
                <a-input-group>
                  <a-input-number
                    style="width: 100%"
                    v-model="formParams.supplyTime"
                    placeholder="请输入货期"
                    :min="0"
                    :disabled="disableSubmit"
                  />
                  <!-- <a-select
                    v-model="formParams.leadTimeUnit"
                    style="width: 25%"
                    defaultValue="0"
                    :disabled="disableSubmit"
                    placeholder="请选择单位"
                  >
                    <a-select-option value="0">年</a-select-option>
                    <a-select-option value="1">月</a-select-option>
                    <a-select-option value="2">周</a-select-option>
                    <a-select-option value="3">日</a-select-option>
                  </a-select> -->
                </a-input-group>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="单价有效期" prop="priceValid">
                <a-range-picker
                  v-model="formParams.priceValid"
                  style="width: 100%"
                  :disabled="disableSubmit"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="退货地址" prop="returnAddress">
                <a-input v-model="formParams.returnAddress" placeholder="请输入退货地址" :disabled="disableSubmit" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="运维周期" prop="devops">
                <a-input v-model="formParams.devops" placeholder="请输入运维周期,如：1年" :disabled="disableSubmit" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="付款周期（天）" prop="paymentPeriod">
                <a-input-number
                  style="width: 100%"
                  v-model="formParams.paymentPeriod"
                  placeholder="请输入付款周期（天）"
                  :min="0"
                  :disabled="disableSubmit"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="质保时间" prop="warranty">
                <a-input v-model="formParams.warranty" placeholder="请输入质保时间,如：1年" :disabled="disableSubmit" />
              </a-form-model-item>
            </a-col>

            <a-col :span="12">
              <a-form-model-item label="设备类型" prop="equipmentType">
                <!-- <a-select
                v-model="formParams.equipmentType"
                placeholder="请选择供应商类型"
                :disabled="disableSubmit"
                allowClear
              >
                <a-select-option value="1">主材</a-select-option>
                <a-select-option value="2">辅材</a-select-option>
                <a-select-option value="3">劳务</a-select-option>
              </a-select> -->
                <j-dict-select-tag
                  v-model="formParams.equipmentType"
                  dictCode="product_type"
                  placeholder="请选择设备类型"
                  :disabled="disableSubmit"
                />
              </a-form-model-item>
            </a-col>

            <a-col :span="24">
              <a-form-model-item label="含序列号" prop="hasSerial" :label-col="{ span: 3 }" :wrapper-col="{ span: 19 }">
                <a-switch :checked="formParams.hasSerial == 1" @change="handleChange" :disabled="disableSubmit" />
              </a-form-model-item>
            </a-col>

            <a-col :span="24">
              <a-form-model-item label="产品图片" prop="picUrl" :label-col="{ span: 3 }" :wrapper-col="{ span: 19 }">
                <a-upload
                  :action="uploadUrl"
                  list-type="picture-card"
                  :headers="headers"
                  :file-list="picUrl"
                  @change="handleUploadChangeImage"
                  @preview="handlePreview"
                  :remove="handleRemoveImage"
                  :disabled="disableSubmit"
                >
                  <div v-if="picUrl.length < 5">
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

            <a-col :span="24">
              <a-form-model-item
                label="规格参数"
                prop="modelParameter"
                :label-col="{ span: 3 }"
                :wrapper-col="{ span: 19 }"
              >
                <a-textarea
                  v-model="formParams.modelParameter"
                  placeholder="请输入规格参数"
                  :disabled="disableSubmit"
                  :rows="3"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item
                label="控标参数"
                prop="controlPoint"
                :label-col="{ span: 3 }"
                :wrapper-col="{ span: 19 }"
              >
                <a-textarea
                  v-model="formParams.controlPoint"
                  placeholder="请输入控标参数"
                  :rows="3"
                  :disabled="disableSubmit"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="备注" prop="remark" :label-col="{ span: 3 }" :wrapper-col="{ span: 19 }">
                <a-textarea v-model="formParams.remark" placeholder="请输入备注" :rows="3" :disabled="disableSubmit" />
              </a-form-model-item>
            </a-col>

            <!-- 产品辅材 选择主材才可选辅材 -->
            <template v-if="formParams.equipmentType == 1 || formParams.equipmentType == 3">
              <a-col :span="24" class="title">产品辅材</a-col>
              <a-col :span="24">
                <a-table
                  :columns="columns"
                  rowKey="id"
                  :pagination="false"
                  :data-source="dataSource"
                  bordered
                  size="small"
                  :scroll="{ x: true }"
                  :loading="loading"
                >
                  <template #action="row" v-if="this.type !== 2">
                    <a-space :size="12">
                      <a href="javascript:;" style="color: red" @click="handleEdit(row)">删除</a>
                    </a-space>
                  </template>
                </a-table>
                <a-button
                  v-if="![2, 3].includes(type)"
                  type="dashed"
                  @click="handleAddMaterial"
                  icon="plus"
                  class="button"
                >
                  选择产品辅材
                </a-button>
              </a-col>
            </template>
          </template>

          <!-- 选择劳务展示 -->
          <template v-if="formParams.productType == 2">
            <a-col :span="12">
              <a-form-model-item label="产品分类" prop="productClassify">
                <j-category-select
                  v-model="formParams.productClassify"
                  pcode="A01"
                  :multiple="false"
                  :disabled="disableSubmit"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="产供应商" prop="supplierName">
                <a-select
                  v-model="formParams.supplierName"
                  :disabled="disableSubmit"
                  placeholder="请选择产供应商"
                  @change="handleChangeSupplier"
                  show-search
                  option-filter-prop="children"
                  :filter-option="filterOption"
                >
                  <a-select-option v-for="item in basicNameList" :key="item.id" :value="item.id">
                    {{ item.supplier }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="服务名称" prop="prodName">
                <a-input v-model="formParams.prodName" placeholder="请输入服务名称" :disabled="disableSubmit" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="单价(元)" prop="price">
                <a-input-number
                  style="width: 300px"
                  v-model="formParams.price"
                  placeholder="请输入单价"
                  :precision="2"
                  :disabled="disableSubmit"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="单位" prop="unit">
                <a-input v-model="formParams.unit" placeholder="请输入单位" :disabled="disableSubmit" />
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item
                label="规格参数"
                prop="modelParameter"
                :label-col="{ span: 3 }"
                :wrapper-col="{ span: 19 }"
              >
                <a-textarea
                  v-model="formParams.modelParameter"
                  placeholder="请输入规格参数"
                  :disabled="disableSubmit"
                  :rows="3"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="付款周期（天）" prop="paymentPeriod">
                <a-input-number
                  style="width: 100%"
                  v-model="formParams.paymentPeriod"
                  placeholder="请输入付款周期（天）"
                  :min="0"
                  :disabled="disableSubmit"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="产品图片" prop="picUrl" :label-col="{ span: 3 }" :wrapper-col="{ span: 19 }">
                <a-upload
                  :action="uploadUrl"
                  list-type="picture-card"
                  :headers="headers"
                  :file-list="picUrl"
                  @change="handleUploadChangeImage"
                  @preview="handlePreview"
                  :remove="handleRemoveImage"
                  :disabled="disableSubmit"
                >
                  <div v-if="picUrl.length < 5">
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
            <a-col :span="24">
              <a-form-model-item label="备注" prop="remark" :label-col="{ span: 3 }" :wrapper-col="{ span: 19 }">
                <a-textarea v-model="formParams.remark" placeholder="请输入备注" :rows="3" :disabled="disableSubmit" />
              </a-form-model-item>
            </a-col>
          </template>
          <!-- 选择劳务展示end---- -->
        </a-row>
        <!-- <template v-if="this.type == 3">
          <a-steps direction="vertical">
            <a-step
              :title="'第' + (i + 1) + '次变更'"
              v-for="(item, i) in priceList"
              :key="item.id"
              status="finish"
              :description="item.time + ': ' + item.productUnivalence + '元'"
            />
          </a-steps>
          <div v-if="this.priceList.length == 0">无变更记录</div>
        </template> -->

        <template v-if="this.type == 3">
          <a-col :span="24" class="title">历史记录</a-col>
          <a-col :span="24">
            <a-table
              :columns="historyColumns"
              rowKey="id"
              :pagination="historyIpagination"
              :data-source="historyData"
              bordered
              size="small"
              :scroll="{ x: true }"
              @change="handleHistoryTableChange"
              :loading="historyLoading"
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
      </a-form-model>
    </a-spin>

    <div class="drawer-bootom-button" v-if="this.type !== 2 && this.type !== 3">
      <a-button @click="close" style="margin-right: 0.8rem">取消</a-button>
      <a-button @click="handleOk" type="primary" :loading="loading">保存</a-button>
    </div>

    <!-- 选择辅材 -->
    <add-materials-dialog
      ref="materialRForm"
      :listUrl="`/jeecg-supplier/prodProduct/list?productType=${2}&supplierId=${this.formParams.supplierId}`"
      :treeType="2"
      @select="handleSelectData"
      paramMode="query"
      modalTitle="选择辅材"
      rowKey="id"
      selectType="checkbox"
    >
    </add-materials-dialog>
  </a-drawer>
</template>

<script>
// API
import {
  addProduct,
  editProdect,
  getPriceList,
  getDetail,
  getProductEntreDetail,
  getSupplierList,
  getAllSupplierList,
  getDetailInfo,
  getProductAuxiliaryList,
} from '@/api/product-management/product-management/index'

// 组件
import AddMaterialsDialog from '@/components/ProductList'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin'
//导入过滤对象中为空的属性、防抖方法
import { filterObj } from '@/utils/util'
import { getAction } from '@/api/manage'
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
        'X-Access-Token': this.$ls.get('Access-Token'),
      },
      // 图片上传列表
      picUrl: [],
      // 图片处理数据集合
      pictureTempListImage: [],
      // 表单参数
      formParams: {
        payTimeUnit: '0',
        leadTimeUnit: '0',
        paymentDaysUnit: '0',
        univalenceIndataUnit: '0',
        productType: '1',
        hasSerial: 2,
      },

      // 表格配置
      columns: [
        {
          title: '名称',
          dataIndex: 'prodName',
          align: 'center',
          width: 150,
        },
        {
          title: '品牌',
          dataIndex: 'brand',
          align: 'center',
          width: 200,
        },
        {
          title: '规格型号',
          dataIndex: 'model',
          align: 'center',
          width: 150,
        },
        {
          title: '单价（元）',
          dataIndex: 'price',
          align: 'center',
          width: 100,
        },
        {
          title: '到货周期(天)',
          dataIndex: 'supplyTime',
          align: 'center',
          width: 200,
        },
        {
          title: '付款周期',
          dataIndex: 'paymentPeriod',
          align: 'center',
          width: 200,
        },
        {
          title: '单价有效期',
          dataIndex: 'priceValid',
          align: 'center',
          width: 200,
        },
        {
          title: '退货地址',
          dataIndex: 'returnAddress',
          align: 'center',
          width: 250,
        },
        {
          title: '运维周期',
          dataIndex: 'devops',
          align: 'center',
          width: 200,
        },
        {
          title: '质保时间',
          dataIndex: 'warranty',
          align: 'center',
          width: 200,
        },
        {
          title: '含序列号',
          dataIndex: 'hasSerial',
          align: 'center',
          width: 200,
          customRender(text) {
            return text == 1 ? '是' : '否'
          },
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          // fixed: 'right',
          width: 100,
          scopedSlots: { customRender: 'action' },
        },
      ],
      // 表格配置
      historyColumns: [
        {
          title: '序号',
          dataIndex: 'index',
          align: 'center',
          width: 60,
          customRender(text, record, index) {
            return index + 1
          },
        },
        {
          title: '时间',
          dataIndex: 'time',
          align: 'center',
          width: '20%',
        },
        {
          title: '修改前',
          dataIndex: 'updateBefore',
          align: 'center',
          width: '25%',
        },
        {
          title: '修改后',
          dataIndex: 'updateAfter',
          align: 'center',
          width: '25%',
        },
        {
          title: '修改人',
          dataIndex: 'updatePeople',
          align: 'center',
          width: '20%',
        },
        {
          title: '操作',
          dataIndex: 'operation',
          align: 'center',
          width: '10%',
        },
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
          },
        },
        {
          title: '时间',
          dataIndex: 'time',
          align: 'center',
          width: '20%',
        },
        {
          title: '审批人',
          dataIndex: 'approvalPeople',
          align: 'center',
          width: '20%',
        },
        {
          title: '审批操作',
          dataIndex: 'operation',
          align: 'center',
          width: '20%',
        },
        {
          title: '审批意见',
          dataIndex: 'approvalComment',
          align: 'center',
          width: '40%',
        },
      ],
      // 审批信息数据
      approvalData: [],
      historyData: [],

      // 表单验证规则
      rules: {
        supplierName: [{ required: true, message: '请输入供应商名称', trigger: 'change' }],
        prodName: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        brand: [{ required: true, message: '请输入品牌', trigger: 'blur' }],
        unit: [{ required: true, message: '请输入单位', trigger: 'blur' }],
        univalence: [{ required: true, message: '请输入单价', trigger: 'blur' }],
        productClassify: [{ required: true, message: '请选择产品分类', trigger: 'change' }],
        leadTime: [{ required: true, message: '请输入货期', trigger: 'blur' }],
        warranty: [{ required: true, message: '请输入质保时间', trigger: 'blur' }],
        equipmentType: [{ required: true, message: '请选择设备类型', trigger: 'change' }],
        priceValid: [{ required: true, message: '请选择单价有效期', trigger: 'change' }],
        price: [{ required: true, message: '请输入单价', trigger: 'change' }],
        // serviceAddr: [{ required: true, message: '请输入维修地址', trigger: 'change' }],
        model: [{ required: true, message: '请输入型号', trigger: 'change' }],
        supplyTime: [{ required: true, message: '请输入货期（天）', trigger: 'change' }],
        // returnAddress: [{ required: true, message: '请输入退货地址', trigger: 'change' }],
        // devops: [{ required: true, message: '请输入运维周期', trigger: 'change' }],
        // warranty: [{ required: true, message: '请输入质保时间', trigger: 'change' }],
        modelParameter: [{ required: true, message: '请输入规格参数', trigger: 'change' }],
        paymentPeriod: [{ required: true, message: '请输入付款周期', trigger: 'change' }],
        // picUrl: [
        //   {
        //     required: true,
        //     validator: (rule, value, callback) => {
        //       // console.log(this.picUrl)
        //       if (this.picUrl == '') return callback(new Error('请上传图片'))
        //       callback()
        //     },
        //     trigger: 'blur',
        //   },
        // ],
      },
      // 加载动画开关
      loading: false,
      priceList: [], //价格变更列表
      basicNameList: [], //供应商列表
      id: '',
      url: {
        list: '',
        // historyList: '/jeecg-supplier/prodSupplierDetailHistory/list', //信息更新历史记录（保存记录）
        // approvalList: '/jeecg-supplier/detailAudit/list', //审批记录列表
      },
      disableMixinCreated: true, //不执行混入
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
        total: 0,
      },
      // 历史记录分页参数
      historyIpagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '30', '50', '100'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0,
      },
      approvalLoading: false, //审批记录加载状态
      historyLoading: false, //历史记录加载状态
      supplierIds: '', //保存供应商id
    }
  },

  methods: {
    // -------历史记录/审批记录
    handleHistoryTableChange(pagination, filters, sorter) {
      //分页、排序、筛选变化时触发
      //TODO 筛选
      // console.log(pagination)
      if (Object.keys(sorter).length > 0) {
        this.isorter.column = sorter.field
        this.isorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
      }
      this.historyIpagination = pagination
      this.historyList()
    },
    // 历史列表数据
    historyList(arg) {
      //加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.historyIpagination.current = 1
      }
      let params = this.getHistoryQueryParams() //查询条件
      this.historyLoading = true
      getAction('/jeecg-supplier/prodSupplierDetailHistory/list', params)
        .then((res) => {
          if (res.success) {
            this.historyData = res.result.records || res.result
            if (res.result.total) {
              this.historyIpagination.total = res.result.total
            } else {
              this.historyIpagination.total = 0
            }
          } else {
            this.$message.warning(res.message)
          }
        })
        .finally(() => {
          this.historyLoading = false
        })
    },
    // 查询参数渲染
    getHistoryQueryParams() {
      //获取高级查询条件
      let sqp = {}
      if (this.superQueryParams) {
        sqp['superQueryParams'] = encodeURI(this.superQueryParams)
        sqp['superQueryMatchType'] = this.superQueryMatchType
      }
      let param = Object.assign(sqp, this.param, this.isorter, this.filters)
      param.field = this.getQueryField()
      param.pageNo = this.historyIpagination.current
      param.pageSize = this.historyIpagination.pageSize
      param.supplierId = this.supplierIds
      return filterObj(param)
    },
    // ------------end----------------

    // ---------审批记录分页---------
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
      getAction('/jeecg-supplier/detailAudit/list', params)
        .then((res) => {
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

    // 打开弹窗
    open(row) {
      this.visible = true
      this.getbasicNameList()
    },

    // 关闭弹窗，点击遮罩层或右上角叉或取消按钮时触发
    close() {
      this.visible = false
      // 重置表单
      this.$refs.ruleForm.resetFields()
      this.formParams = {
        payTimeUnit: '0',
        leadTimeUnit: '0',
        paymentDaysUnit: '0',
        univalenceIndataUnit: '0',
        productType: '1',
        hasSerial: 2, //1-含，2-不含
      }
      // 清空图片
      this.picUrl = []
      this.pictureTempListImage = []
      // 清空辅材数据
      this.dataSource = []
      this.priceList = []
      this.basicNameList = []
      this.disabled = false
    },

    // 打开辅材弹窗
    handleAddMaterial() {
      let id = this.dataSource.map((item) => item.id)
      this.$refs.materialRForm.open(id, this.dataSource)
    },

    // 接收辅材选中返回的值
    handleSelectData(data) {
      console.log('接收的辅材选中值', data)
      this.dataSource = data.selectionRows
      this.formParams.secondary = this.dataSource.map((item) => item.id)
    },

    // 供应商名称列表
    getbasicNameList() {
      getAllSupplierList().then((res) => {
        this.basicNameList = res.result.records
        // console.log(this.basicNameList)
      })
    },
    //供应商列表改变事件
    handleChangeSupplier(value) {
      this.formParams.supplierId = value
      console.log(value)
      // let data = this.basicNameList.filter(item => item.basicInfoId === value)
      // console.log(data);
      // this.formParams.supplierName = data[0].basicName
      // this.formParams.supplierId = data[0].basicInfoId

      // this.getInfo(value)
    },

    // 获取维修联系人和电话
    // getInfo(id) {
    //   getDetailInfo(id).then(({ result }) => {
    //     this.$set(this.formParams, 'maintainPerson', result.supplierName)
    //     this.$set(this.formParams, 'phone', result.phone)
    //   })
    // },

    // 添加
    add(name, id) {
      // console.log(name, id)
      // 这是路由跳转过来的supplierIds
      this.id = id
      // 当前为添加模式
      this.type = 0
      this.open(name)
    },

    // 编辑
    edit(record) {
      this.type = 1
      this.getDetail(record.id)
      this.open()
    },

    // 详情
    detail(record) {
      console.log(record)
      this.type = 2
      this.getDetail(record.id)
      this.open()
    },

    // 产品库的详情
    details(record) {
      console.log(record)
      this.supplierIds = record.supplierId
      this.type = 3
      this.getProductEntreDetail(record.id)
      // this.loadData(1)
      this.approvalList(1)
      this.historyList(1)
      this.open()
    },

    // 获取详情
    getDetail(id) {
      getDetail(id).then((res) => {
        if (res.success) {
          // 处理单价有效期回显
          res.result.priceValid = res.result.priceValid.split(',')
          this.formParams = res.result
          // 辅材数据回显
          this.dataSource = res.result.products
          //处理图片
          let picUrl = res.result.picUrl ? res.result.picUrl.split(',') : []
          this.picUrl = picUrl.map((item, index) => {
            return {
              uid: index,
              status: 'done',
              name: '图片' + index,
              url: item,
            }
          })
          this.pictureTempListImage = this.picUrl
        }
      })
    },
    // 产品库的详情
    getProductEntreDetail(id) {
      getProductEntreDetail(id).then((res) => {
        if (res.success) {
          // 处理单价有效期回显
          res.result.priceValid = res.result.priceValid.split(',')
          this.formParams = res.result
          // 辅材数据回显
          this.dataSource = res.result.products
          //处理图片
          let picUrl = res.result.picUrl ? res.result.picUrl.split(',') : []
          this.picUrl = picUrl.map((item, index) => {
            return {
              uid: index,
              status: 'done',
              name: '图片' + index,
              url: item,
            }
          })
          this.pictureTempListImage = this.picUrl
        }
      })
    },

    // 获取单价变更记录
    price(row) {
      this.type = 3
      this.title = '变更记录'
      getPriceList({ productId: row.id }).then((res) => {
        if (res.result.records) {
          this.priceList = res.result.records
        }
      })
      this.open()
    },

    //序列事件 1-含，2-不含
    handleChange(checked, row) {
      console.log(checked)
      if (checked) {
        this.formParams.hasSerial = 1
      } else {
        this.formParams.hasSerial = 2
      }
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
      this.picUrl = fileList

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

        this.picUrl = this.pictureTempListImage
        const data = this.picUrl.map((item) => item.url).toString()
        this.formParams.picUrl = data
      }
    },
    // 图片移除
    handleRemoveImage(file) {
      this.pictureTempListImage.splice(this.pictureTempListImage.indexOf(file), 1)
      // 重新处理数据
      this.formParams.picUrl = this.pictureTempListImage.map((item) => item.url).toString()
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

    // 产供应商搜索事件
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },

    // 切换产品类型
    handleChangeProductType(val) {
      let hasSerial = val == 1 ? 2 : '' //1-含，2-不含
      this.formParams = {
        productType: val,
        hasSerial: hasSerial,
      }
    },

    // 处理添加
    handleAdd() {
      this.formParams.priceValid = this.formParams.priceValid ? this.formParams.priceValid.toString() : ''
      this.formParams.currentPeopleId = this.$store.getters.userInfo.id
      addProduct(this.formParams).then((res) => {
        if (res.success) {
          this.$message.success(res.message)
          this.$emit('refresh')
          this.close()
        } else {
          this.$message.warning(res.message)
        }
        return res
      })
    },

    // 处理编辑
    handleEdit() {
      this.formParams.priceValid = this.formParams.priceValid ? this.formParams.priceValid.toString() : ''
      this.formParams.currentPeopleId = this.$store.getters.userInfo.id
      editProdect(this.formParams).then((res) => {
        if (res.success) {
          this.$message.success(res.message)
          this.$emit('refresh')
          this.close()
        } else {
          this.$message.warning(res.message)
        }
      })
    },

    //提交
    handleOk() {
      console.log('提交的数据', this.formParams)
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // 判断当前模式
          if (this.type === 0) {
            // 添加
            this.handleAdd()
          } else {
            // 编辑
            this.handleEdit()
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
.button {
  margin-top: 15px;
  width: 100%;
  margin-bottom: 20px;
}
</style>
