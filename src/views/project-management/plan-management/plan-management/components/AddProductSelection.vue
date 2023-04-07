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
          <a-col :span="12">
            <a-form-model-item label="方案名称" prop="name">
              <a-input v-model="formParams.name" placeholder="请输入方案名称" :readOnly="readOnly" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <template>
              <a-button class="buttom" type="primary" @click="addRow" v-if="![2, 4].includes(this.type)"
                >添加一行
              </a-button>
              <a-button
                class="buttom"
                type="danger"
                @click="handleCleanProduct"
                v-if="![2, 4].includes(this.type)"
                :disabled="selectedRowKeys.length === 0"
                >批量清除产品
              </a-button>
              <!-- <a-button
                type="primary"
                @click="handleMultiProduce"
                class="buttom"
                v-if="this.type !== 4"
                >批量添加产品
              </a-button> -->
              <!-- <a-upload
                v-model="formParams.upload"
                name="file"
                :multiple="true"
                accept=".xls, .xlsx"
                :headers="headers"
                @change="handleUp"
                :action="uploadUrl"
                :file-list="fileList"
              >
                <a-button type="primary" icon="upload" v-if="this.type !== 4"
                  >导入
                </a-button>
              </a-upload>
              <a-button
                class="buttom"
                icon="download"
                @click="download('产品信息模版', 'xls')"
                v-if="this.type !== 4"
                >下载模板
              </a-button> -->

              <!-- 表格区域 -->
              <template v-if="![2, 4].includes(this.type)">
                <a-table
                  :columns="columns"
                  ref="tableformRef"
                  :data-source="dataSource"
                  bordered
                  :rowKey="(record) => record.id"
                  :scroll="{ x: true }"
                  :indentSize="10"
                  :pagination="false"
                  :row-selection="rowSelection"
                  :expanded-row-keys.sync="expandedRowKeys"
                  :disabled="disableSubmit"
                  class="table"
                >
                  <span slot="titleDetailName" class="form-table-heard">细目名称</span>
                  <span slot="titleProductId" class="form-table-heard">产品名称 </span>
                  <span slot="titleSpecifications" class="form-table-heard">技术要求 </span>
                  <span slot="titleSpecification" class="form-table-heard">规格参数 </span>
                  <span slot="titleModel" class="form-table-heard">型号 </span>
                  <span slot="titleSupplier" class="form-table-heard">供应商 </span>
                  <span slot="titleUnit" class="form-table-heard">单位 </span>
                  <span slot="titleNum" class="form-table-heard">数量 </span>
                  <span slot="titlePurchasePrice" class="form-table-heard">单价(元) </span>
                  <span slot="titletotalPrice" class="form-table-heard">金额(元) </span>

                  <div class="overflowStyle" slot="codeNum" slot-scope="text, record">
                    <span style="white-space: pre-line">
                      {{ record.codeNum }}
                    </span>
                  </div>
                  <div class="overflowStyle" slot="supplierName" slot-scope="text, record">
                    <span style="white-space: pre-line">
                      {{ record.supplierName }}
                    </span>
                  </div>
                  <div class="overflowStyle" slot="model" slot-scope="text, record">
                    <span style="white-space: pre-line">
                      {{ record.model }}
                    </span>
                  </div>
                  <!-- 名称 -->
                  <template class="form-table-heard" slot="detailName" slot-scope="record, row, index">
                    <a-tooltip placement="top" :title="row.detailName">
                      <a-input
                        v-model="row.detailName"
                        :style="{ width: '80%' }"
                        :disabled="disableSubmit"
                        placeholder="请输入细目名称"
                      />
                    </a-tooltip>
                  </template>
                  <!-- 安装位置 -->
                  <template slot="position" slot-scope="record, row, index">
                    <a-tooltip placement="top" :title="row.position">
                      <a-input v-model="row.position" :disabled="disableSubmit" placeholder="请输入安装位置" />
                    </a-tooltip>
                  </template>
                  <template slot="technicalSpecifications" slot-scope="record, row, index">
                    <a-tooltip placement="top" :title="row.technicalSpecifications">
                      <a-input
                        v-model="row.technicalSpecifications"
                        :disabled="disableSubmit"
                        placeholder="请输入技术要求"
                      />
                    </a-tooltip>
                  </template>
                  <!-- 规格参数 -->
                  <div class="overflowStyle" slot="specification" slot-scope="text, record">
                    <a-tooltip placement="top" :title="record.specification">
                      <a-input v-model="record.specification" :read-only="true" placeholder="请输入" />
                    </a-tooltip>
                  </div>
                  <!-- 单位 -->
                  <template slot="unit" slot-scope="record, row, index">
                    <a-input v-model="row.unit" :disabled="disableSubmit" placeholder="请输入单位" />
                  </template>
                  <!-- 产品 -->
                  <template slot="productId" slot-scope="record, row, index">
                    <template v-if="row.productName">
                      <a-popover placement="top">
                        <template slot="content">
                          <span>{{ row.productName }}</span>
                        </template>
                        <a-input
                          v-model="row.productName"
                          :style="{ width: '60%' }"
                          :read-only="true"
                          placeholder="请选择产品"
                        />
                      </a-popover>
                    </template>
                    <template v-else>
                      <a-input v-model="row.productName" :style="{ width: '60%' }" :read-only="true" />
                    </template>
                    <a-button type="link" @click="handleChangeProduce(record, row, index)" :style="{ float: 'right' }"
                      >选择
                    </a-button>
                  </template>
                  <!-- 数量 -->
                  <template slot="num" slot-scope="record, row, index">
                    <a-input-number
                      :defaultValue="1"
                      :min="0"
                      v-model="row.num"
                      :disabled="disableSubmit"
                      @change="changeNum(row, index)"
                      placeholder="请输入数量"
                    />
                  </template>
                  <!-- 采购单价 -->
                  <template slot="price" slot-scope="record, row, index">
                    <a-input-number
                      :precision="2"
                      :min="0"
                      v-model="row.price"
                      :disabled="disableSubmit"
                      @change="changeNum(row, index)"
                    />
                  </template>
                  <!-- 备注 -->
                  <template slot="remark" slot-scope="record, row">
                    <a-tooltip placement="top" :title="row.remark">
                      <a-input v-model="row.remark" :disabled="disableSubmit" placeholder="请输入备注" />
                    </a-tooltip>
                  </template>
                  <template slot="action" slot-scope="record, row, index">
                    <template v-if="row.children">
                      <a href="javascript:;" @click="addCurrentRow(row, index)" :disabled="disableSubmit">增加下级 </a>
                      <a-divider type="vertical" />
                      <a href="javascript:;" @click="deleteCurrentRow(row, index)" :disabled="disableSubmit">删除 </a>
                    </template>
                    <template v-else>
                      <!-- 这是children里数据的删除 -->
                      <a href="javascript:;" @click="deleteRow(row, index)" :disabled="disableSubmit">删除</a>
                    </template>
                  </template>
                </a-table>
                <div class="subtotal">
                  <div class="left">汇总</div>
                  <div class="number"></div>
                  <div class="number"></div>
                  <div class="number"></div>
                  <div class="number"></div>
                  <div class="number"></div>
                  <div class="number"></div>
                  <div class="number"></div>
                  <div class="number"></div>
                  <div class="number"></div>
                  <div class="number"></div>
                  <div class="number"></div>
                  <div class="number">{{ formatPurchasePrice }}</div>
                  <div class="number"></div>
                  <div class="number" :style="{ width: '180px' }"></div>
                </div>
              </template>
              <!-- 详情表格 -->
              <template v-else>
                <a-col :span="24">
                  <a-table
                    :columns="columnsDetail"
                    :data-source="dataSource"
                    bordered
                    ref="tableformRef"
                    rowKey="key"
                    :scroll="{ x: true }"
                    :indentSize="10"
                    :pagination="false"
                    :expanded-row-keys.sync="expandedRowKeys"
                    :disabled="disableSubmit"
                  >
                    <div class="overflowStyle" slot="codeNum" slot-scope="text, record">
                      <span style="white-space: pre-line">
                        {{ record.codeNum }}
                      </span>
                    </div>
                    <div class="overflowStyle" slot="position" slot-scope="text, record">
                      <span style="white-space: pre-line">
                        {{ record.position }}
                      </span>
                    </div>
                    <div class="overflowStyle" slot="detailName" slot-scope="text, record">
                      <span style="white-space: pre-line">
                        {{ record.detailName }}
                      </span>
                    </div>
                    <div class="overflowStyle" slot="technicalSpecifications" slot-scope="text, record">
                      <span style="white-space: pre-line">
                        {{ record.technicalSpecifications }}
                      </span>
                    </div>
                    <div class="overflowStyle" slot="specification" slot-scope="text, record">
                      <span style="white-space: pre-line">
                        {{ record.specification }}
                      </span>
                    </div>
                    <div class="overflowStyle" slot="remark" slot-scope="text, record">
                      <span style="white-space: pre-line">
                        {{ record.remark }}
                      </span>
                    </div>
                    <div class="overflowStyle" slot="productName" slot-scope="text, record">
                      <span style="white-space: pre-line">
                        {{ record.productName }}
                      </span>
                    </div>
                    <div class="overflowStyle" slot="supplierName" slot-scope="text, record">
                      <span style="white-space: pre-line">
                        {{ record.supplierName }}
                      </span>
                    </div>
                    <div class="overflowStyle" slot="model" slot-scope="text, record">
                      <span style="white-space: pre-line">
                        {{ record.model }}
                      </span>
                    </div>
                    <!-- 产品名称 -->
                    <template slot="productId" slot-scope="text, row">
                      {{ row.productName }}
                    </template>
                  </a-table>

                  <div class="subtotal">
                    <div class="left">汇总</div>
                    <div class="number"></div>
                    <div class="number"></div>
                    <div class="number"></div>
                    <div class="number"></div>
                    <div class="number"></div>
                    <div class="number"></div>
                    <div class="number"></div>
                    <div class="number" :style="{ width: '100px' }"></div>
                    <div class="number"></div>
                    <div class="number"></div>
                    <div class="number"></div>
                    <div class="number"></div>
                    <div class="number"></div>
                    <div class="number">{{ formatPurchasePrice }}</div>
                    <div class="number"></div>
                    <div class="number" :style="{ width: '110px' }"></div>
                  </div>
                </a-col>
              </template>
            </template>
          </a-col>
        </a-row>
      </a-form-model>
    </a-spin>
    <div class="drawer-bootom-button">
      <a-button
        key="submit"
        type="primary"
        :loading="loading"
        @click="handleOk"
        v-if="this.type == 0 || this.type == 1"
        style="margin-right: 0.8rem"
      >
        确定
      </a-button>
      <a-button @click="close">取消</a-button>
    </div>
    <!-- 产品弹窗单选 -->
    <add-materials-dialog
      ref="materialRForm"
      :listUrl="`/jeecg-supplier/prodProductEntrepot/list`"
      :treeType="2"
      @select="handleSelectData"
      paramMode="query"
      modalTitle="选择产品"
      rowKey="id"
      :slotParams="slotParams"
    >
      <template #default>
        <a-form-model-item label="产品名称" prop="prodName">
          <j-input v-model="slotParams.prodName" placeholder="请输入产品名称"></j-input>
        </a-form-model-item>
        <a-form-model-item label="型号" prop="model">
          <j-input v-model="slotParams.model" placeholder="请输入型号"></j-input>
        </a-form-model-item>
        <!-- <a-form-model-item label="产品分类" prop="productClassify">
          <j-category-select
            v-model="slotParams.productClassify"
            pcode="B03"
            :multiple="false"
            :style="{ width: '120px' }"
          />
        </a-form-model-item> -->
      </template>
    </add-materials-dialog>

    <!-- 产品弹窗多选 -->
    <add-materials-dialog
      ref="multiSelectForm"
      :listUrl="`/jeecg-supplier/prodProductEntrepot/list`"
      :treeType="2"
      @select="handleMultiSelectData"
      paramMode="query"
      modalTitle="选择产品"
      rowKey="id"
      selectType="checkbox"
    >
    </add-materials-dialog>
  </j-modal>
</template>

<script>
import {
  addScheme,
  editScheme,
  getDetailLibrary,
  editProfitList,
} from '@/api/project-management/plan-management/PlanManagement.js'
// 组件
import AddMaterialsDialog from '@/components/ProductList'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin'
import * as XLSX from 'xlsx/xlsx.mjs'
// 数组对象去重
import { uniqBy, uniq } from 'lodash'
export default {
  mixins: [TableListMixin],
  components: { AddMaterialsDialog },
  props: {
    // 1方案 2选型
    is_type: {
      type: Number,
      default: 2,
    },
    // 表格数据
    proData: {
      type: Array,
      default: () => [],
    },
    // 表格配置
    columns: {
      type: Array,
      default: () => [
        {
          title: '编号',
          dataIndex: 'codeNum',
          // align: 'center',
          width: 150,
          key: 'codeNum',
          ellipsis: true,
          scopedSlots: { customRender: 'codeNum' },
          // customRender(text, record, index) {
          //   return index + 1
          // }
        },
        {
          title: '安装位置',
          dataIndex: 'position',
          width: 150,
          key: 'position',
          ellipsis: true,
          scopedSlots: { customRender: 'position' },
          align: 'center',
        },
        {
          // title: '细目名称',
          dataIndex: 'detailName',
          width: 150,
          key: 'detailName',
          // ellipsis: true,
          scopedSlots: { customRender: 'detailName' },
          slots: { title: 'titleDetailName' }, //表头插槽
          align: 'center',
        },
        {
          // title: '技术规格、资质证书(必填)',
          dataIndex: 'technicalSpecifications',
          width: 150,
          key: 'technicalSpecifications',
          ellipsis: true,
          scopedSlots: { customRender: 'technicalSpecifications' },
          slots: { title: 'titleSpecifications' }, //表头插槽
          align: 'center',
        },
        {
          // title: '规格参数(必填)',
          dataIndex: 'specification',
          width: 150,
          ellipsis: true,
          key: 'specification',
          scopedSlots: { customRender: 'specification' },
          slots: { title: 'titleSpecification' }, //表头插槽
          align: 'center',
        },
        {
          // title: '产品名称(必填)',
          dataIndex: 'productId',
          width: 200,
          key: 'productId',
          ellipsis: true,
          scopedSlots: { customRender: 'productId' },
          slots: { title: 'titleProductId' }, //表头插槽
          align: 'center',
        },
        {
          // title: '供应商(必填)',
          dataIndex: 'supplierName',
          width: 150,
          ellipsis: true,
          key: 'supplierName',
          scopedSlots: { customRender: 'supplierName' },
          slots: { title: 'titleSupplier' }, //表头插槽
          align: 'center',
        },
        {
          // title: '型号(必填)',
          dataIndex: 'model',
          width: 150,
          ellipsis: true,
          key: 'model',
          scopedSlots: { customRender: 'model' },
          slots: { title: 'titleModel' }, //表头插槽
          align: 'center',
        },
        {
          // title: '单位(必填)',
          dataIndex: 'unit',
          width: 150,
          key: 'unit',
          ellipsis: true,
          scopedSlots: { customRender: 'unit' },
          slots: { title: 'titleUnit' }, //表头插槽
          align: 'center',
        },
        {
          // title: '数量(必填)',
          dataIndex: 'num',
          width: 150,
          ellipsis: true,
          key: 'num',
          scopedSlots: { customRender: 'num' },
          slots: { title: 'titleNum' }, //表头插槽
          align: 'center',
        },
        {
          // title: '单价(元)(必填)',
          dataIndex: 'price',
          width: 150,
          ellipsis: true,
          key: 'price',
          slots: { title: 'titlePurchasePrice' }, //表头插槽
          align: 'center',
        },
        {
          // title: '合价(元)(必填)',
          dataIndex: 'totalPrice',
          width: 150,
          ellipsis: true,
          key: 'totalPrice',
          slots: { title: 'titletotalPrice' }, //表头插槽
          align: 'center',
        },
        {
          title: '备注',
          dataIndex: 'remark',
          width: 200,
          ellipsis: true,
          key: 'remark',
          align: 'center',
          scopedSlots: { customRender: 'remark' },
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          fixed: 'right',
          scopedSlots: { customRender: 'action' },
        },
      ],
    },
    // 详情表格配置
    columnsDetail: {
      type: Array,
      default: () => [
        {
          title: '编号',
          dataIndex: 'codeNum',
          align: 'center',
          width: 150,
          ellipsis: true,
          scopedSlots: { customRender: 'codeNum' },
        },
        {
          title: '安装位置',
          dataIndex: 'position',
          width: 150,
          ellipsis: true,
          align: 'center',
          scopedSlots: { customRender: 'position' },
        },
        {
          title: '细目名称',
          dataIndex: 'detailName',
          width: 150,
          ellipsis: true,
          align: 'center',
          scopedSlots: { customRender: 'detailName' },
        },
        {
          title: '技术要求',
          dataIndex: 'technicalSpecifications',
          width: 300,
          ellipsis: true,
          scopedSlots: { customRender: 'technicalSpecifications' },
          align: 'center',
        },
        {
          title: '规格参数',
          dataIndex: 'specification',
          width: 300,
          ellipsis: true,
          scopedSlots: { customRender: 'specification' },
          align: 'center',
        },
        {
          title: '产品名称',
          dataIndex: 'productName',
          width: 200,
          ellipsis: true,
          scopedSlots: { customRender: 'productName' },
          align: 'center',
        },
        {
          title: '供应商',
          dataIndex: 'supplierName',
          scopedSlots: { customRender: 'supplierName' },
          width: 150,
          ellipsis: true,
          align: 'center',
        },
        {
          title: '型号',
          dataIndex: 'model',
          width: 150,
          ellipsis: true,
          align: 'center',
          scopedSlots: { customRender: 'model' },
        },
        {
          title: '单位',
          dataIndex: 'unit',
          width: 150,
          ellipsis: true,
          align: 'center',
        },
        {
          title: '数量',
          dataIndex: 'num',
          width: 150,
          ellipsis: true,
          align: 'center',
        },
        {
          title: '单价(元)',
          dataIndex: 'price',
          width: 150,
          ellipsis: true,
          align: 'center',
        },
        {
          title: '总额(元)',
          dataIndex: 'totalPrice',
          width: 150,
          ellipsis: true,
          align: 'center',
        },
        {
          title: '备注',
          dataIndex: 'remark',
          width: 200,
          ellipsis: true,
          align: 'center',
          scopedSlots: { customRender: 'remark' },
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          fixed: 'right',
          scopedSlots: { customRender: 'action' },
        },
      ],
    },
  },
  data() {
    return {
      filesUrl: [], //合同文件上传列表
      pictureTempListImage: [],
      // 开关
      visible: false,
      // 加载动画开关
      loading: false,
      // 是否禁用
      disableSubmit: false,
      readOnly: false,
      // 标题
      title: '添加产品',
      type: 0,
      // 表单配置
      labelCol: { span: 4 },
      wrapperCol: { span: 17 },
      // 表单参数
      formParams: {},
      // 汇总采购合价
      formatPurchasePrice: 0,
      // 表格配置
      btnState: false,
      // 字段对应的表头（必须一一对应）
      character: {
        detailName: {
          text: '细目名称',
          type: 'string',
        },
        technicalSpecifications: {
          text: '投标文件要求的技术规格、资料证书',
          type: 'string',
        },
        unit: {
          text: '单位',
          type: 'string',
        },
        num: {
          text: '数量',
          type: 'string',
        },
        // position: {
        //   text: '安装位置',
        //   type: 'string'
        // },
        remark: {
          text: '备注',
          type: 'string',
        },
        is_main: {
          text: '是否主材',
          type: 'string',
        },
      },
      dataFristLeval: [], // 表格数据的第一层
      fileList: [], //文件数据
      // 上传地址
      uploadUrl: process.env.VUE_APP_API_BASE_URL + '/sys/common/upload',
      // 上传请求头
      headers: {
        'X-Access-Token': this.$ls.get('Access-Token'),
      },
      expandedRowKeys: [],
      disableMixinCreated: true, //不执行混入
      rules: {
        name: [{ required: true, message: '请输入方案名称', trigger: 'blur' }],
      },
      url: {
        downloadGetUrl: '/prodProfits/model', //下载模板
      },
      // 插槽数据
      slotParams: {
        productClassify: '',
        prodName: '',
        model: '',
      },
      modelForm: {},
      record: {},
    }
  },

  computed: {
    // 计算采购合价 数量*采购单价price
    format() {
      return (row) => {
        if (row.num && row.price) {
          return Number(row.num * row.price).toFixed(2)
        } else {
          return 0
        }
      }
    },
    // 销售合价salesTotlePrice = 数量*销售单价:price
    formatSalesPrice() {
      return (row) => {
        if (row.num && row.price) {
          return Number(row.num * row.price).toFixed(2)
        } else {
          return 0
        }
      }
    },
    // 毛利率=(销售合价salesTotlePrice-采购合价totalPrice)/销售合价
    formatGrossProfit() {
      return (row) => {
        if (row.num && row.salesTotlePrice && row.totalPrice) {
          return Number((row.salesTotlePrice - row.totalPrice) / row.salesTotlePrice).toFixed(2)
        } else {
          return 0
        }
      }
    },
    rowSelection() {
      const { selectedRowKeys } = this
      return {
        selectedRowKeys,
        onChange: this.onSelectChange,
        hideDefaultSelections: true,
        onSelect: this.onSelect, //触发级联的方法
        fixed: true,
      }
    },
  },

  methods: {
    onSelectChange(selectedRowKeys, selectionRows) {
      console.log('selectedRowKeys changed: ', selectedRowKeys, selectionRows)
      this.selectedRowKeys = uniqBy(selectedRowKeys) //选中的key
      this.selectionRows = selectionRows //选中的表格数据
    },
    onSelect(record, selected) {
      // console.log(record, selected);
      //每个复选框点击都会触发
      const selectrows = [record.key]
      if (record.hasOwnProperty('children')) {
        const generator = (record) => {
          //这里做一个递归查找
          record.forEach((item) => {
            selectrows.push(item.key)

            if (item.children && item.children.length > 0) {
              generator(item.children)
            }
          })
        }
        generator(record.children)
      }
      const newselect = this.selectedRowKeys.filter((item) => !selectrows.includes(item))
      //选中和取消选中的级联
      selected ? (this.selectedRowKeys = [...this.selectedRowKeys, ...selectrows]) : (this.selectedRowKeys = newselect)
    },
    // 打开弹窗
    open() {
      this.visible = true
    },
    add(type, row) {
      this.title = '新增产品并选型'
      this.record = row
      this.type = 0
      this.formParams.type = type
      this.open()
    },
    edit(row, type) {
      if (type == 1) {
        this.title = '编辑产品并选型'
        this.readOnly = false
      } else {
        this.title = '详情'
        this.readOnly = true
      }
      this.$set(this.formParams, 'name', row.name)
      this.record = row
      this.type = type
      this.getDetail(row.id)
      setTimeout(() => {
        this.open()
      })
      this.$forceUpdate()
    },
    // 获取当前行产品详情
    getDetail(id) {
      getDetailLibrary(id).then((res) => {
        if (res.success) {
          this.formParams = res.result
          this.dataSource = res.result.schemeInfos || res.result.schemeProductInfoVos
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 关闭弹窗，点击遮罩层或右上角叉或取消按钮时触发
    close() {
      this.visible = false
      // 重置表单
      this.$refs.ruleForm.resetFields()
      this.formParams = {}
      this.dataSource = []
      this.record = {}
      this.selectedRowKeys = []
    },
    // 文件上传
    handleUploadChange(info) {
      let fileList = [...info.fileList]
      this.filesUrl = fileList

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

        this.filesUrl = this.pictureTempListImage
        const data = this.filesUrl.map((item) => item.url).toString()
        this.formParams.filesUrl = data
      }
    },
    // 移除
    handleRemoveImage(file) {
      this.pictureTempListImage.splice(this.pictureTempListImage.indexOf(file), 1)
      this.formParams.filesUrl = this.pictureTempListImage.map((item) => item.url).toString()
      console.log(this.pictureTempListImage, this.formParams.filesUrl)
    },
    // 批量清除产品
    handleCleanProduct() {
      this.selectionRows.map((item) => {
        if (item.productId) {
          item.productId = ''
          item.productName = ''
          item.supplierName = ''
          item.model = ''
          item.price = ''
          item.totalPrice = ''
        }
        if (!item.children) {
          item.children = []
        }
      })
      console.log(this.dataSource)
      console.log(this.selectionRows)
      this.dataSource = this.selectionRows
      this.selectedRowKeys = []
    },
    // 删除方案信息
    handleDelete(row, index) {
      this.dataSource.splice(index, 1)
    },
    // 新增项目利润
    addRow() {
      // 生成随机key
      let key = Math.random()
      this.dataSource.push({
        key: Math.floor(key * 1000),
        detailName: '',
        position: '',
        technicalSpecifications: '',
        specification: '',
        model: '',
        supplierName: '',
        unit: '',
        num: 1,
        productId: null,
        // price: '',
        // salesTotlePrice: '',
        price: '',
        totalPrice: '',
        // grossProfitRate: '',
        remark: '',
        children: [],
      })
    },
    // 打开调整利润率
    handleAdjustedProfit() {
      this.$refs.rateFrom.open(this.selectedRowKeys.toString())
    },
    // 报价历史弹窗
    handleHistory() {
      this.$refs.historyFrom.open(this.selectionRows)
    },
    // 读取
    fileFile(file) {
      return new Promise((resolve) => {
        let reader = new FileReader()
        reader.readAsBinaryString(file)
        reader.onload = (ev) => {
          resolve(ev.target.result)
        }
      })
    },
    // 导入
    async handleUp(info) {
      // console.log(info.file)
      this.fileList = info.fileList
      //如果没有数据
      if (info.file.response && info.file.response.message == null) {
        this.btnState = true
      }
      // 有数据并且填写正确
      if (info.file.response && info.file.response.message != null) {
        this.btnState = false

        let data = await this.fileFile(info.file.originFileObj)
        // console.log(data)

        let workbook = XLSX.read(data, { type: 'binary' }) //读取二进制数据
        console.log(workbook)

        let worksheet = workbook.Sheets[workbook.SheetNames[0]]
        // console.log(worksheet);
        data = XLSX.utils.sheet_to_json(worksheet)
        console.log(data)
        let arr = []
        data.forEach((item, index) => {
          let obj = {}
          for (let key in this.character) {
            if (!this.character.hasOwnProperty(key)) break
            let v = this.character[key]
            let text = v.text
            let type = v.type
            v = item[text] || ''
            type === 'string' ? (v = String(v)) : null
            type === 'number' ? (v = Number(v)) : null
            obj[key] = v
          }

          arr.push(obj)
        })

        // *如果是主材，就加上children
        let newData = arr.map((item, index) => {
          // 给每一项先设置一个随机key
          let currentKey = Math.random()
          item.key = Math.floor(currentKey * 1000)
          item.is_import = true
          item.position = ''
          item.specification = ''
          item.model = ''
          item.supplierName = ''
          item.productId = null
          // item.price = ''
          // item.salesTotlePrice = ''
          item.price = ''
          item.totalPrice = ''
          // item.grossProfitRate = ''
          let firstLeval = []
          // if (item.is_main == '是') {
          //   firstLeval[index] = item
          //   firstLeval[index].children = []
          // }
          firstLeval[index] = item
          // 方案并选型才有children
          if (this.is_type == 2) {
            firstLeval[index].children = []
          }
        })

        // 插入导入的数据
        // this.insert(arr)
        // 给表格添加导入的值
        this.dataSource.push(...arr)
        console.log(this.dataSource)

        this.list = info.file.response.message
      } else if (info.file.response && info.file.response.message != null && this.fileList.length > 0) {
        // 如果填写错误
        console.log(info.file.response)
        // this.fileList.splice(0)
        const h = this.$createElement
        this.$error({
          title: '提醒',
          content: h('div', {}, [h('p', `${info.file.response.message}`), h('p', '请确认无误后重新上传')]),
        })
      }
      // this.fileList =[]
    },
    // *把当前行数据插入到导入的上一个有children的数据里
    insert(arr) {
      arr.forEach((item, index) => {
        // if (item.remark == '主材') {
        if (item.is_main == '是') {
          let i = index + 1
          // console.log('arr[i]', arr[i],'i',i)
          if (arr[i] && arr[i].is_main !== '是') {
            arr[index].children.push(arr[i])
            arr.splice(i, 1)
          }
        } else {
          return this.insert(arr)
        }
      })
      return arr
    },
    // 多选产品
    handleMultiProduce() {
      // 打开弹窗
      this.$refs.multiSelectForm.open()
    },
    // 接收多选产品返回的值
    handleMultiSelectData(data) {
      console.log(data)
      this.dataSource.push(...data.selectionRows)

      console.log('多选表格数据----', this.dataSource)

      data.selectionRows.map((item, index) => {
        item.children = []
        this.$set(data.selectionRows[index], 'detailName', item.prodName)
        this.$set(data.selectionRows[index], 'technicalSpecifications', item.modelParameter)
        this.$set(data.selectionRows[index], 'productName', item.prodName)
        this.$set(data.selectionRows[index], 'productId', item.id)
        this.$set(data.selectionRows[index], 'specification', item.modelParameter)
        this.$set(data.selectionRows[index], 'model', item.model)
        this.$set(data.selectionRows[index], 'supplierName', item.supplierName)
        this.$set(data.selectionRows[index], 'supplierId', item.supplierId)
        this.$set(data.selectionRows[index], 'price', item.price)
        this.$set(data.selectionRows[index], 'unit', item.unit)
        this.$set(data.selectionRows[index], 'num', 1)
        // 采购合价
        this.$set(
          data.selectionRows[index],
          'totalPrice',
          data.selectionRows[index].num * data.selectionRows[index].price
        )
      })
      console.log(this.dataSource)
      this.selectedRowKeys = []
      // 用深拷贝解决数组不更新渲染
      this.dataSource = JSON.parse(JSON.stringify(this.dataSource))
    },
    // 打开选择产品弹窗
    handleChangeProduce(record, row, index) {
      console.log(row, index)
      // 保存key
      let key = row.key
      //* 保存传来的key对应的第一层！！🤮
      this.getFirstLevel(this.dataSource, key, this.dataFristLeval)
      // console.log(this.dataFristLeval)

      // 保存当前选中下标和当前行数据
      this.currnetIndex = index
      this.currnetRow = row
      // let id = row.id //回显！！
      // 打开弹窗
      this.$refs.materialRForm.open()
    },
    // 接收产品选中返回的值
    handleSelectData(data) {
      console.log('接收的产品选中值', data)
      // this.dataSource = data.selectionRows
      let i = this.currnetIndex
      let row = this.currnetRow
      let is_children = row.children

      let detailName = is_children ? this.dataSource[i].detailName : this.dataFristLeval[0].children[i].detailName
      let tech = is_children
        ? this.dataSource[i].technicalSpecifications
        : this.dataFristLeval[0].children[i].technicalSpecifications
      console.log('detailName:' + detailName + ',tech:' + tech)

      //细目名称
      if (detailName == undefined || detailName == '') {
        is_children
          ? this.$set(this.dataSource[i], 'detailName', data.selectionRows[0].prodName)
          : this.$set(this.dataFristLeval[0].children[i], 'detailName', data.selectionRows[0].prodName)
      }

      //技术规则
      if (tech == undefined || tech == '') {
        is_children
          ? this.$set(this.dataSource[i], 'technicalSpecifications', data.selectionRows[0].modelParameter)
          : this.$set(
              this.dataFristLeval[0].children[i],
              'technicalSpecifications',
              data.selectionRows[0].modelParameter
            )
      }
      //产品名称
      is_children
        ? this.$set(this.dataSource[i], 'productName', data.selectionRows[0].prodName)
        : this.$set(this.dataFristLeval[0].children[i], 'productName', data.selectionRows[0].prodName)
      //产品id
      is_children
        ? this.$set(this.dataSource[i], 'productId', data.selectionRows[0].id)
        : this.$set(this.dataFristLeval[0].children[i], 'productId', data.selectionRows[0].id)

      // 规格参数
      is_children
        ? this.$set(this.dataSource[i], 'specification', data.selectionRows[0].modelParameter)
        : this.$set(this.dataFristLeval[0].children[i], 'specification', data.selectionRows[0].modelParameter)
      //型号
      is_children
        ? this.$set(this.dataSource[i], 'model', data.selectionRows[0].model)
        : this.$set(this.dataFristLeval[0].children[i], 'model', data.selectionRows[0].model)
      //供应商
      is_children
        ? this.$set(this.dataSource[i], 'supplierName', data.selectionRows[0].supplierName)
        : this.$set(this.dataFristLeval[0].children[i], 'supplierName', data.selectionRows[0].supplierName)
      // 供应商id
      is_children
        ? this.$set(this.dataSource[i], 'supplierId', data.selectionRows[0].supplierId)
        : this.$set(this.dataFristLeval[0].children[i], 'supplierId', data.selectionRows[0].supplierId)
      //采购单价
      is_children
        ? this.$set(this.dataSource[i], 'price', data.selectionRows[0].price)
        : this.$set(this.dataFristLeval[0].children[i], 'price', data.selectionRows[0].price)
      //单位
      is_children
        ? this.$set(this.dataSource[i], 'unit', data.selectionRows[0].unit)
        : this.$set(this.dataFristLeval[0].children[i], 'unit', data.selectionRows[0].unit)

      // 数量
      let nums = is_children ? this.dataSource[i].num : this.dataFristLeval[0].children[i].num
      // 采购总价：price*num
      let totalprice = nums ? data.selectionRows[0].price * Number(nums) : 0
      // 总额
      is_children
        ? this.$set(this.dataSource[i], 'totalPrice', totalprice)
        : this.$set(this.dataFristLeval[0].children[i], 'totalPrice', totalprice)

      //* 清空第一层数据，保证打开弹窗的数据是新返回第一层数据（🤮）
      this.dataFristLeval = []
      //*  清空已选中的产品信息，因为产品的children改了不刷新
      this.selectedRowKeys = []
      console.log('====', this.dataSource)
    },

    // 数量/销售单价发生变化事件   //*销售单价=采购单价*（1+毛利润）
    changeNum(row, i) {
      let data = this.format(row) //计算采购合价
      let dataSalesPrice = this.formatSalesPrice(row) //计算销售合价
      let profit = this.formatGrossProfit(row) //计算毛利率
      // let profit = ((row.salesTotlePrice - row.totalPrice) / row.salesTotlePrice).toFixed(2) //计算毛利率
      // 销售单价：price  采购单价：price
      // console.log('毛利润----', profit, '销售合价--', dataSalesPrice, '采购合价--', data)

      let is_children = row.children
      // 这一层数据
      let dataFristLeval = []
      this.getFirstLevel(this.dataSource, row.key, dataFristLeval)
      //改采购合价
      is_children
        ? this.$set(this.dataSource[i], 'totalPrice', Number(data))
        : this.$set(dataFristLeval[0].children[i], 'totalPrice', Number(data))
      // 改销售合价
      is_children
        ? this.$set(this.dataSource[i], 'salesTotlePrice', Number(dataSalesPrice))
        : this.$set(dataFristLeval[0].children[i], 'salesTotlePrice', Number(dataSalesPrice))
      // 改毛利率
      // is_children
      //   ? this.$set(this.dataSource[i], 'grossProfitRate', Number(profit))
      //   : this.$set(dataFristLeval[0].children[i], 'grossProfitRate', Number(profit))

      console.log(this.dataSource)
    },

    // 毛利润发生改变的事件 (用来计算采购单价和总价)
    changeGrossProfitRate(changeVal, row, i) {
      console.log(row)
      // 有没有children
      let is_children = row.children
      // 当前层数据
      let dataFristLeval = []
      this.getFirstLevel(this.dataSource, row.key, dataFristLeval)

      //改毛利率
      is_children
        ? this.$set(this.dataSource[i], 'grossProfitRate', Number(changeVal))
        : this.$set(dataFristLeval[0].children[i], 'grossProfitRate', Number(changeVal))
      // console.log('当前的毛利润', row.grossProfitRate)
      // 计算销售合价和单价  price:采购单价  销售单价：price = 成本/(1-毛利)
      let salesPrice = row.price / (1 - row.grossProfitRate)
      // 销售合价
      let salesTotalPrice = (salesPrice * row.num).toFixed(2)
      // 销售单价：price
      is_children
        ? this.$set(this.dataSource[i], 'price', Number(salesPrice))
        : this.$set(dataFristLeval[0].children[i], 'price', Number(salesPrice))
      // 销售合价：salesTotlePrice
      is_children
        ? this.$set(this.dataSource[i], 'salesTotlePrice', Number(salesTotalPrice))
        : this.$set(dataFristLeval[0].children[i], 'salesTotlePrice', Number(salesTotalPrice))

      //*  清空已选中的产品信息，因为产品的children改了不刷新
      this.selectedRowKeys = []
    },

    // 返回包含这条key的第一层
    getFirstLevel(list, key, dataFristLeval) {
      list.forEach((item) => {
        if (item.children) {
          // 拿到第二层所有的key 比对 最终返回包含这条key的第一层（我就是想拿到第一层在dataSource中是下标哎）
          // dataFristLeval.push(...item.children.filter((i) => key == i.key))
          item.children.forEach((i) => {
            if ([i.key].includes(key)) {
              dataFristLeval.push(item)
            }
          })
        }
      })
    },
    // 接收批量改变利润率传回的事件
    changeProfit(data) {
      // console.log(data)
      let arr = [data.key]
      // 拿到传过来的key
      let keys = []
      arr.forEach((item) => {
        if (arr.includes(item)) {
          keys.push(item)
          return keys
        }
      })

      // 更改毛利率
      this.$nextTick(() => {
        this.getData(this.dataSource, keys, data.profit)
      })

      // 接收了改变毛利润传过来的参数后，再计算采购的合价
      // console.log(this.selectionRows)
      let price = this.selectionRows.map((item) => {
        //得到采购单价
        return { price: item.price, totalPrice: item.totalPrice, num: item.num }
      })
      console.log('单价和销售总价', price, '当前毛利润:', data.profit)

      // 最终的总价和单价; data.profit:当前毛利润
      this.selectionRows.map((item, index) => {
        console.log(item, index)
        item.price = item.price / (1 - data.profit) //销售单价=采购单价/（1-毛利润）
        item.salesTotlePrice = (item.price * item.num).toFixed(2) //销售合价
        console.log('销售单价--', item.price, '销售总价--', item.salesTotlePrice)
        this.getChangeData(this.dataSource, item.key, item.salesTotlePrice, item.price)
      })

      console.log(this.selectionRows)
      console.log(this.dataSource)
      //*  清空已选中的产品信息，因为产品的children改了毛利率不刷新
      this.selectedRowKeys = []
    },

    // 通过key递归 更改采购单价和总价
    getChangeData(tree, keys, salesTotlePrice, price) {
      // * 关键：找到key,找到后赋值
      let data = tree.filter((item) => item.key == keys)
      // console.log(data)
      if (data.length != 0) {
        data[0].salesTotlePrice = salesTotlePrice
        data[0].price = price
      } else {
        tree.map((item) => {
          if (item.children) {
            //递归循环
            this.getChangeData(item.children, keys, salesTotlePrice, price)
          }
        })
      }
      return data
    },
    // 更改毛利率
    getData(list, key, rofit) {
      list.forEach((item) => {
        if ([...key].toString().includes(item.key)) {
          item.grossProfitRate = rofit
        }
        if (item.children) {
          return this.getData(item.children, key, rofit)
        }
      })
    },
    // 在当前行下面新增一条数据
    addCurrentRow(row, index) {
      // console.log(row, index, this.dataSource[index].children)
      // 先生成一个随机key
      let keys = Math.random()
      this.dataSource[index].children.push({
        key: Math.floor(keys * 1000),
        productId: null,
        num: 1,
        price: 0,
        totalPrice: 0,
      })
      console.log(this.dataSource)
      //*  清空已选中的产品信息，因为产品的children改了不刷新
      this.selectedRowKeys = []
    },
    //删除整行
    deleteCurrentRow(row, index) {
      this.dataSource.splice(index, 1)
    },
    // 删除当前行下面的数据
    deleteRow(row, index) {
      // console.log(row.key, index, this.dataSource) //* 删除有问题 拿不到相应的下标啊
      // *保存点击的key对应的这一层
      let arr = []
      this.getFirstLevel(this.dataSource, row.key, arr)
      // 删除这一层children对应下标的这条数据
      arr[0].children.splice(index, 1)
      //*  清空已选中的产品信息，因为产品的children改了不刷新
      this.selectedRowKeys = []
    },
    handleOk() {
      console.log(this.formParams, this.dataSource)
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // 校验产品信息是否为空
          if (this.dataSource.length == 0) return this.$message.warning('请添加产品信息!')
          // 校验是否完整填写产品信息
          for (let keys in this.dataSource) {
            let list = this.dataSource[keys]
            // console.log(list.children)
            for (let key in list) {
              if (
                key !== 'totalAmount' &&
                key !== 'remark' &&
                key !== 'position' &&
                key !== 'approval' &&
                key !== 'createBy' &&
                key !== 'createTime' &&
                key !== 'currentPeopleId' &&
                key !== 'delFlag' &&
                key !== 'devops' &&
                key !== 'hasSerial' &&
                key !== 'paymentPeriod' &&
                key !== 'picUrl' &&
                key !== 'priceValid' &&
                key !== 'productClassify' &&
                key !== 'warranty' &&
                key !== 'updateTime' &&
                key !== 'updateBy' &&
                key !== 'supplyTime' &&
                key !== 'supplierId' &&
                key !== 'status' &&
                key !== 'serviceAddr' &&
                key !== 'serialNum' &&
                key !== 'secondary' &&
                key !== 'returnAddress' &&
                key !== 'products' &&
                key !== 'productType' &&
                key !== 'controlPoint' &&
                key !== 'supplierName' &&
                key !== 'prodName' &&
                key !== 'modelParameter' &&
                key !== 'brand' &&
                key !== 'id' &&
                key !== 'salesTotlePrice' &&
                key !== 'is_main' &&
                key !== 'updateBy' &&
                key !== 'updateTime' &&
                key !== 'trade' &&
                key !== 'model' &&
                key !== 'schemeId'
              ) {
                if (!list[key]) {
                  return this.$message.warning('请完整填写带*的产品信息!')
                }
              }
            }
            if (list.children.length) {
              for (let keys in list.children) {
                let listChildren = list.children[keys]
                for (let key in listChildren) {
                  if (
                    key !== 'totalAmount' &&
                    key !== 'children' &&
                    key !== 'remark' &&
                    key !== 'position' &&
                    key !== 'is_main' &&
                    key !== 'salesTotlePrice' &&
                    key !== 'trade' &&
                    key !== 'schemeId'
                  ) {
                    // console.log(listChildren)
                    if (!listChildren[key]) {
                      return this.$message.warning('请完整填写带*的产品信息!')
                    }
                  }
                }
              }
            }
          }
          let data = {
            ...this.formParams,
            category: 2,
            projectId: this.record.projectId,
            time: this.record.time,
            schemeProductInfoVos: this.dataSource,
          }
          console.log(data)
          // 添加并选型
          this.okLoading = true
          if (this.type == 0) {
            addScheme(data)
              .then((res) => {
                if (res.success) {
                  this.$message.success(res.message)
                  this.$emit('refresh')
                } else {
                  this.$message.error(res.message)
                }
                this.close()
              })
              .finally(() => {
                setTimeout(() => {
                  this.okLoading = false
                }, 2000)
              })
          } else {
            editScheme(data)
              .then((res) => {
                if (res.success) {
                  this.$message.success(res.message)
                  this.$emit('refresh')
                } else {
                  this.$message.error(res.message)
                }
                this.close()
              })
              .finally(() => {
                setTimeout(() => {
                  this.okLoading = false
                }, 2000)
              })
          }
        } else {
          return false
        }
      })
    },
  },
  watch: {
    dataSource: {
      handler(newVlaue) {
        // console.log(newVlaue)
        // 发射产品/方案的数据出去
        this.$emit('data', newVlaue)

        this.formatPurchasePrice = newVlaue.reduce((p, c) => p + Number(c.totalPrice), 0).toFixed(2)
        let totalPrice = 0
        let data = newVlaue.forEach((item) => {
          if (item.children) {
            totalPrice = item.children.reduce((p, c) => p + Number(c.totalPrice), 0).toFixed(2)
            this.formatPurchasePrice = (Number(this.formatPurchasePrice) + Number(totalPrice)).toFixed(2)
            console.log(this.formatPurchasePrice)
          }
        })

        const dom = this.$refs?.tableformRef?.$el.getElementsByClassName('ant-table-body')[0]
        const footerDom = document.getElementsByClassName('subtotal')[0]
        footerDom?.addEventListener(
          'scroll',
          () => {
            dom.scrollLeft = footerDom.scrollLeft
          },
          true
        )
      },
      deep: true,
      // immediate: true,
    },
    // 监听父组件传来的方案/选型数据
    proData: {
      handler(val) {
        this.dataSource = val
      },
      deep: true,
      immediate: true,
    },
  },
}
</script>

<style lang="less" scoped>
::v-deep .ant-table td {
  white-space: nowrap;
}
.title {
  background-color: #f8faff;
  padding: 10px;
  margin-bottom: 10px;
  font-weight: 600;
}
.buttom {
  margin: 10px 5px;
}
// 隐藏上传的文件名称图标
::v-deep .ant-upload-list {
  display: none;
}
::v-deep .ant-upload-list-text {
  display: none;
}
::v-deep .ant-input-number-handler-wrap {
  z-index: 0;
}
// 表头前加*
.form-table-heard:before {
  content: '*';
  color: red;
}
.wrap /deep/ .ant-table-tbody > tr > td {
  white-space: nowrap;
  height: 63px !important;
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
  // max-width: 200px !important;
  // max-height: 70px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-wrap: break-word;
  word-break: break-all;
  text-align: left;
}
//隐藏a-table组件的滚动条
/deep/.ant-table-body {
  overflow: hidden !important;
}
/deep/.ant-table-footer {
  margin: 0;
}
.subtotal {
  height: 50px;
  // position: absolute;
  // bottom: 10px;
  width: 100%;
  border: 1px solid #e8e8e8;
  background: #fafafa;
  display: flex;
  align-items: center;
  font-weight: 700;
  overflow-x: scroll;
  overflow-y: hidden;
  .left {
    flex: none; /* div显示滚动条的重点 */
    // width: 391px;
    margin-left: 80px;
  }
  .number {
    flex: none;
    color: #666666;
    height: 100%;
    width: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    // padding-left: 5px;
  }
}
</style>
