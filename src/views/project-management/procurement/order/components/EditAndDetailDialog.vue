<template>
  <a-drawer
    :title="title"
    :maskClosable="true"
    width="85%"
    placement="right"
    :closable="true"
    @close="close"
    :visible="visible"
    style="overflow: auto; padding-bottom: 53px"
  >
    <a-spin tip="加载中..." :spinning="loading">
      <a-form-model ref="ruleForm" :model="formParams" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-tabs :activeKey="activeKey" @change="handleChange">
          <!-- 订单信息  -->
          <a-tab-pane key="1" tab="订单信息">
            <a-row>
              <a-col :span="24" class="title">订单信息</a-col>
              <a-col :span="12">
                <a-form-model-item label="项目名称" prop="projectName">
                  <a-input v-model="formParams.projectName" placeholder="请输入项目名称" :read-only="readOnly" />
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="供应商名称" prop="supplierName">
                  <a-input v-model="formParams.supplierName" placeholder="请输入供应商名称" :read-only="readOnly" />
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="申请人" prop="applyPeople">
                  <a-input v-model="formParams.applyPeople" placeholder="请输入申请人" :read-only="readOnly" />
                </a-form-model-item>
              </a-col>

              <a-col :span="12">
                <a-form-model-item label="采购部门" prop="department">
                  <a-input v-model="formParams.department" placeholder="请输入采购部门" :read-only="readOnly" />
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="要求到货时间" prop="demandArriveTime">
                  <j-date
                    v-model="formParams.demandArriveTime"
                    :showTime="true"
                    dateFormat="YYYY-MM-DD"
                    :style="{ width: '100%' }"
                    placeholder="请选择要求到货时间"
                    :read-only="this.currentData.orderStatus == 1 ? false : readOnly"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="收货人" prop="consignee">
                  <a-input v-model="formParams.consignee" placeholder="请输入收货人" :read-only="readOnly" />
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="收货地址" prop="takeDeliveryAddress">
                  <a-input
                    v-model="formParams.takeDeliveryAddress"
                    placeholder="请输入收货地址"
                    :read-only="readOnly"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="紧急程度" prop="degree">
                  <a-radio-group :default-value="1" v-model="formParams.degree" disabled>
                    <a-radio :value="1">紧急</a-radio>
                    <a-radio :value="2"> 一般</a-radio>
                  </a-radio-group>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="订单金额" prop="orderTotlePrice">
                  <a-input v-model="formParams.orderTotlePrice" placeholder="请输入订单金额" :read-only="readOnly" />
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="订单状态" prop="orderStatus">
                  <!-- 1-备货中，2-待收货，3-已收货，4-已完成，5-已拒单， -->
                  <j-dict-select-tag
                    v-model="formParams.orderStatus"
                    dictCode="order_type"
                    placeholder="请选择订单状态"
                    :disabled="disableSubmit"
                  />
                </a-form-model-item>
              </a-col>

              <template v-if="this.type == 2">
                <!-- <a-col :span="12">
                  <a-form-model-item label="物流单号" prop="logisticsSingleNumber">
                    <a-input
                      v-model="formParams.logisticsSingleNumber"
                      placeholder="请输入物流单号"
                      :read-only="readOnly"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item label="物流企业" prop="courierCompany">
                    <a-input v-model="formParams.courierCompany" placeholder="请输入物流企业" :read-only="readOnly" />
                  </a-form-model-item>
                </a-col> -->
                <div class="config-box">
                  <div
                    class="flex align-center space-margin level-choice"
                    v-for="(item, index) in formParams.courierInfo"
                    :key="index"
                  >
                    <a-col :span="12">
                      <a-form-model-item label="配送公司" :prop="'courierInfo.' + index + '.name'">
                        <span>{{ getDictText('express_coding', item.name) }}</span>
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-model-item label="运单号" :prop="'courierInfo.' + index + '.courier_number'">
                        <span>{{ item.courier_number }}</span>
                        <!-- <a-button type="primary" size="small" @click="handleToExpress(item)">查看</a-button> -->
                      </a-form-model-item>
                    </a-col>
                  </div>
                </div>

                <a-col :span="12">
                  <a-form-model-item label="收货图片" prop="receiveGoodsPicUrl">
                    <a-upload
                      :action="uploadUrl"
                      list-type="picture-card"
                      :headers="headers"
                      :file-list="receiveGoodsPicUrl"
                      @preview="handlePreview"
                      :remove="handleRemoveImage"
                      :disabled="disableSubmit"
                    >
                    </a-upload>
                  </a-form-model-item>
                  <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                    <img alt="example" style="width: 100%" :src="previewImage" />
                  </a-modal>
                </a-col>

                <a-col :span="12">
                  <a-form-model-item label="签收图片" prop="signReceiptPicUrl">
                    <a-upload
                      :action="uploadUrl"
                      list-type="picture-card"
                      :headers="headers"
                      :file-list="signReceiptPicUrl"
                      @preview="handlePreview"
                      :remove="handleRemoveImage"
                      :disabled="disableSubmit"
                    >
                    </a-upload>
                  </a-form-model-item>
                  <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                    <img alt="example" style="width: 100%" :src="previewImage" />
                  </a-modal>
                </a-col>
              </template>

              <!-- ---------产品信息------ -->
              <a-col :span="24" class="title">产品信息</a-col>
              <a-col :span="24">
                <!-- 详情表格 -->
                <template>
                  <a-table
                    :columns="columnsDetail"
                    :data-source="dataSource"
                    bordered
                    rowKey="id"
                    :scroll="{ x: true }"
                    :indentSize="10"
                    :pagination="false"
                    :expanded-row-keys.sync="expandedRowKeys"
                    :disabled="disableSubmit"
                  >
                    <div class="overflowStyle" slot="technicalSpecifications" slot-scope="text, record">
                      <a-popover placement="top">
                        <template slot="content">
                          <span>{{ record.technicalSpecifications }}</span>
                        </template>
                        <span>{{ record.technicalSpecifications }}</span>
                      </a-popover>
                    </div>
                    <div class="overflowStyle" slot="specification" slot-scope="text, record">
                      <a-popover placement="top">
                        <template slot="content">
                          <span>{{ record.specification }}</span>
                        </template>
                        <span>{{ record.specification }}</span>
                      </a-popover>
                    </div>
                    <template
                      #action="record, row, index"
                      v-if="this.type !== 2 && this.currentData.payStatus == 0 && this.currentData.orderStatus == 1"
                    >
                      <a
                        href="javascript:;"
                        @click="deleteCurrentRow(row, index)"
                        :disabled="disableSubmit"
                        :style="{ color: 'red' }"
                        >删除
                      </a>
                    </template>
                  </a-table>
                </template>
              </a-col>
            </a-row>
          </a-tab-pane>

          <template v-if="this.type == 2">
            <!-- 物流信息 -->
            <a-tab-pane key="2" tab="物流信息" force-render>
              <a-row>
                <a-col :span="24" class="title">物流信息</a-col>
                <a-col :span="24">
                  <!-- <div v-if="formParams.courierInfo" class="express">
                    <div v-for="(item, i) in formParams.courierInfo" :key="i">
                      <div>承运快递：{{ getDictText('express_coding', item.name) }}</div>
                      <div>运单号码： {{ item.courier_number }}</div>
                    </div>
                  </div> -->
                </a-col>

                <div class="steps">
                  <div v-for="(item, index) in steps" :key="index">
                    <a-col :span="12">
                      <div v-if="item.info">
                        <div class="express">
                          <div>承运快递：{{ item.info[0].logisticsCompanyName }}</div>
                          <div>运单号码：{{ item.info[0].mailNo }}</div>
                        </div>

                        <a-spin :spinning="stepsLoading">
                          <a-steps progress-dot direction="vertical" class="express-steps">
                            <a-step
                              v-for="(data, i) in item.info[0].logisticsTraceDetailList"
                              :key="i"
                              class="steps-time-handler"
                            >
                              <template #description>
                                <div class="steps-info">
                                  <div v-if="data.areaName">{{ data.areaName }}</div>
                                  <div v-if="data.desc">{{ data.desc }}</div>
                                  <div v-if="data.time">{{ formatTime(data.time) }}</div>
                                </div>
                              </template>
                            </a-step>
                          </a-steps>
                        </a-spin>
                      </div>
                    </a-col>
                  </div>
                </div>
              </a-row>
            </a-tab-pane>

            <!-- 设备序列号 -->
            <a-tab-pane key="3" tab="设备序列号" force-render>
              <a-row>
                <a-col :span="24" class="title">设备序列号</a-col>
                <a-col :span="24">
                  <!-- 设备序列号表格 -->
                  <template>
                    <a-table
                      :columns="deviceColumns"
                      :data-source="deviceData"
                      bordered
                      rowKey="id"
                      :scroll="{ x: true }"
                      :indentSize="10"
                      :pagination="false"
                      :expanded-row-keys.sync="expandedRowKeys"
                      :disabled="disableSubmit"
                      :loading="loadingDevice"
                    >
                      <template #action="record, row, index">
                        <a href="javascript:;" @click="editEquipment(row, index)">编辑 </a>
                      </template>
                    </a-table>
                  </template>
                </a-col>
              </a-row>
            </a-tab-pane>
          </template>
        </a-tabs>
      </a-form-model>
    </a-spin>

    <!-- 编辑序列号 -->
    <EditEquipmentNumber ref="editForm" @refresh="refreshNum"></EditEquipmentNumber>

    <div class="drawer-bootom-button" v-if="![2, 3].includes(this.type)">
      <a-button @click="close" style="margin-right: 0.8rem">关闭</a-button>
      <a-button @click="handleOk" type="primary" :loading="loading">保存</a-button>
    </div>
  </a-drawer>
</template>

<script>
// API
import { getDetail, deleteOrderProd, editOrder, getEqumentList, getExpressInfo } from '@/api/procurement/Order.js'
// 组件
import EditEquipmentNumber from './EditEquipmentNumber'
import JImageUpload from '@/components/jeecg/JImageUpload'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin.js'
import { getDictText, getDictItemsFromCache, ajaxGetDictItems } from '@/api/api.js'
import moment from 'dayjs'
export default {
  components: { EditEquipmentNumber, JImageUpload },
  mixins: [TableListMixin],
  data() {
    return {
      // 开关
      visible: false,
      // 加载动画开关
      loading: false,
      loadingDevice: false,
      // 是否禁用
      disableSubmit: false,
      readOnly: false,
      // 标题
      title: '新增利润表',
      // 当前模式 0-添加 1-编辑 2-详情
      type: 0,
      // 表单配置
      labelCol: { span: 6 },
      wrapperCol: { span: 17 },
      // 表单参数
      formParams: {},
      disableMixinCreated: true,
      expandedRowKeys: [],
      // 详情表格
      columnsDetail: [
        {
          title: '细目名称',
          dataIndex: 'detailName',
          width: 120,
          ellipsis: true,
        },
        {
          title: '安装位置',
          dataIndex: 'position',
          width: 120,
          ellipsis: true,
          align: 'center',
        },
        {
          title: '技术规格、资质证书',
          dataIndex: 'technicalSpecifications',
          width: 150,
          ellipsis: true,
          align: 'center',
          scopedSlots: { customRender: 'technicalSpecifications' },
        },
        {
          title: '产品名称',
          dataIndex: 'prodName',
          width: 120,
          ellipsis: true,
          align: 'center',
          // scopedSlots: { customRender: 'productId' }
        },
        {
          title: '规格参数',
          dataIndex: 'specification',
          width: 150,
          ellipsis: true,
          align: 'center',
          scopedSlots: { customRender: 'specification' },
        },
        {
          title: '型号',
          dataIndex: 'model',
          width: 100,
          ellipsis: true,
          align: 'center',
        },
        {
          title: '供应商',
          dataIndex: 'supplier',
          width: 120,
          ellipsis: true,
          align: 'center',
        },
        {
          title: '单位',
          dataIndex: 'unit',
          width: 80,
          ellipsis: true,
          align: 'center',
        },
        {
          title: '总数',
          dataIndex: 'num',
          width: 80,
          ellipsis: true,
          align: 'center',
        },
        {
          title: '已采数量',
          dataIndex: 'alreadyPurchase',
          width: 80,
          ellipsis: true,
          align: 'center',
        },
        {
          title: '本次采购数量',
          dataIndex: 'thisPurchase',
          width: 80,
          ellipsis: true,
          align: 'center',
        },
        {
          title: '单价（元）',
          dataIndex: 'price',
          width: 100,
          ellipsis: true,
          align: 'center',
        },
        {
          title: '合价（元）',
          dataIndex: 'purchaseTotlePrice',
          width: 100,
          ellipsis: true,
          align: 'center',
        },
        // {
        //   title: '毛利率',
        //   dataIndex: 'grossProfitRate',
        //   width: 100,
        //   ellipsis: true,
        //   align: 'center'
        // },
        {
          title: '备注',
          dataIndex: 'remark',
          width: 100,
          ellipsis: true,
          align: 'center',
        },
        {
          title: '操作',
          dataIndex: 'action',
          fixed: 'right',
          scopedSlots: { customRender: 'action' },
        },
      ],
      // 设备序列号表格配置
      deviceColumns: [
        {
          title: '产品名称',
          dataIndex: 'productName',
          width: '16%',
          ellipsis: true,
          align: 'center',
        },
        {
          title: '产品型号',
          dataIndex: 'model',
          width: '16%',
          ellipsis: true,
          align: 'center',
        },
        {
          title: '序列号',
          dataIndex: 'serialNumber',
          width: '16%',
          ellipsis: true,
          align: 'center',
        },
        {
          title: '填写人',
          dataIndex: 'writeBy',
          width: '16%',
          ellipsis: true,
          align: 'center',
        },
        {
          title: '填写时间',
          dataIndex: 'writeTime',
          width: '16%',
          ellipsis: true,
          align: 'center',
        },
        {
          title: '质保截止时间',
          dataIndex: 'warrantyTime',
          width: '16%',
          ellipsis: true,
          align: 'center',
        },
        {
          title: '操作',
          dataIndex: 'action',
          fixed: 'right',
          align: 'center',
          width: 100,
          scopedSlots: { customRender: 'action' },
        },
      ],
      // 设备序列号表格数据
      deviceData: [],
      stepsLoading: false, //请求步骤条
      steps: [],
      // 表单验证规则
      rules: {
        projectName: [{ required: true, message: '请选择项目名称', trigger: 'blur' }],
      },
      principalPersonList: [], // 设计部门列表
      currentData: [], //当前行数据
      orderId: '', //订单id
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
      // 收货图片上传列表
      receiveGoodsPicUrl: [],
      // 图片处理数据集合
      pictureTempListImage: [],
      // 签收图片
      signReceiptPicUrl: [],
      activeKey: '',
    }
  },

  methods: {
    moment,
    getDictText,

    formatTime(data) {
      return new Date(data).toLocaleString()
    },

    handleToExpress(info) {
      console.log(info)
      window.location.href = 'https://m.kuaidi100.com/app/query/?nu=SF1690503251470&com=shunfeng'
    },

    // 打开弹窗
    open() {
      this.visible = true
      this.activeKey = '1'
    },

    // 关闭弹窗，点击遮罩层或右上角叉或取消按钮时触发
    close() {
      this.visible = false
      // 重置表单
      this.$refs.ruleForm.resetFields()
      this.selectedRowKeys = []
      this.selectionRows = []
      this.formParams = {}
      this.dataSource = []
      this.currentData = []
      // 清空图片
      this.receiveGoodsPicUrl = []
      this.pictureTempListImage = []
      this.steps = []
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
      this.type = 1
      this.currentData = record //当前行数据
      this.orderId = record.id //订单id
      this.getDetail(record.id)
      this.open()
      this.readOnly = true
    },
    // 详情
    detail(record) {
      console.log(record)
      this.type = 2
      this.orderId = record.id //订单id
      this.getDetail(record.id || record)
      // 设备序列表
      this.getEqumentList(record.id)
      this.readOnly = true
      this.disableSubmit = true
      this.open()
    },

    // 获取详情
    getDetail(id) {
      getDetail(id).then((res) => {
        if (res.success) {
          this.dataSource = res.result.orderProduct ? res.result.orderProduct : ''
          this.formParams = res.result
          //处理图片
          let receiveGoodsPicUrl = res.result.receiveGoodsPicUrl ? res.result.receiveGoodsPicUrl.split(',') : []
          this.receiveGoodsPicUrl = receiveGoodsPicUrl.map((item, index) => {
            return {
              uid: index,
              status: 'done',
              name: '图片' + index,
              url: item,
            }
          })
          this.pictureTempListImage = this.receiveGoodsPicUrl

          //处理收货图片
          let signReceiptPicUrl = res.result.signReceiptPicUrl ? res.result.signReceiptPicUrl.split(',') : []
          this.signReceiptPicUrl = signReceiptPicUrl.map((item, index) => {
            return {
              uid: index,
              status: 'done',
              name: '图片' + index,
              url: item,
            }
          })
          this.pictureTempListImage = this.signReceiptPicUrl
        }
      })
    },

    // 图片移除
    handleRemoveImage(file) {
      this.pictureTempListImage.splice(this.pictureTempListImage.indexOf(file), 1)
      // 重新处理数据
      this.formParams.receiveGoodsPicUrl = this.pictureTempListImage.map((item) => item.url).toString()
    },
    // 图片预览
    handlePreview(file) {
      this.previewImage = file.url
      this.previewVisible = true
    },
    // 预览弹窗关闭
    handleCancel() {
      this.previewVisible = false
      this.steps = []
    },

    //删除产品
    deleteCurrentRow(row, index) {
      console.log(row, this.currentData)
      let data = {
        thisPurchase: row.thisPurchase,
        purchaseOrderProductId: row.id,
        id: this.currentData.id,
        purchaseOrderId: this.currentData.purchaseOrderId,
      }
      deleteOrderProd(data).then((res) => {
        console.log(res)
        if (res.success) {
          this.dataSource.splice(index, 1)
          this.$message.success('删除成功')
        } else {
          this.$message.error('删除失败')
        }
      })
    },

    // 切换标签
    handleChange(value) {
      this.activeKey = value //当前选中标签页
      if (value == 1) {
        this.getDetail(this.orderId)
      } else if (value == 3) {
        // 序列号列表
        this.getEqumentList(this.orderId)
      } else {
        // 物流信息
        this.getExpressInfo(this.orderId)
      }
    },

    // 查询快递信息
    getExpressInfo(id) {
      getExpressInfo({ id })
        .then((res) => {
          this.stepsLoading = true
          console.log(res)
          if (res.success) {
            res.result.forEach((item) => {
              console.log(item)
              item
                ? item.info.forEach((i) => {
                    console.log(i)
                    return i.logisticsTraceDetailList ? i.logisticsTraceDetailList.reverse() : []
                  })
                : ''
            })
            this.steps = res.result
            console.log(this.steps)
          }
        })
        .finally(() => {
          setTimeout(() => {
            this.stepsLoading = false
          }, 300)
        })
    },

    // 刷新设备序列号列表
    refreshNum() {
      this.handleChange(3)
    },

    // 打开编辑序列号弹窗
    editEquipment(row, index) {
      this.$refs.editForm.open(row)
    },

    // 获取设备序列号列表
    getEqumentList(orderId) {
      this.loadingDevice = true
      getEqumentList({ orderId })
        .then((res) => {
          if (res.success) {
            this.deviceData = res.result.records
          }
        })
        .finally(() => {
          setTimeout(() => {
            this.loadingDevice = false
          }, 300)
        })
    },

    //提交
    handleOk() {
      console.log(this.formParams)
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          editOrder(this.formParams).then((res) => {
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
  },
}
</script>

<style lang="less" scoped>
.title {
  background-color: #f8faff;
  padding: 6px;
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
.img {
  width: 350px;
  height: 300px;
}

// 步骤条内容宽度
::v-deep .ant-steps-dot .ant-steps-item-content,
.ant-steps-dot.ant-steps-small .ant-steps-item-content {
  width: 90%;
}

.steps {
  &.info {
    color: #60cd89;
  }
  .express {
    margin: 10px;
    padding: 10px;
    width: 60%;
    font-weight: 600;
    border-bottom: 6px solid #f4f4f4;

    :first-child {
      margin: 5px 0;
    }
  }

  .express-steps {
    width: 60%;

    .steps-time-handler {
      margin: 20px 0;
      margin-left: 30px;

      .steps-info {
        border-bottom: 3px solid #f4f4f4;
        .info {
          color: #60cd89;
        }
      }
    }
  }
}
</style>
