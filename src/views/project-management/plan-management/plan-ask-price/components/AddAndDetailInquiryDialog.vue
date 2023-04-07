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
        <template v-if="this.type == 0">
          <a-row>
            <a-col :span="24" class="title" v-if="this.type == 2">项目信息</a-col>
            <a-col :span="24">
              <a-form-model-item
                label="询价企业"
                prop="supplierId"
                :label-col="{ span: 3 }"
                :wrapper-col="{ span: 19 }"
              >
                <a-select
                  v-model="formParams.supplierId"
                  placeholder="请选择询价企业"
                  mode="multiple"
                  :disabled="disableSubmit"
                  @change="onCategoryChange"
                >
                  <a-select-option
                    v-for="item in supplierNameList"
                    :key="item.id"
                    :value="item.id"
                    :disabled="item.disabled"
                  >
                    {{ item.supplier }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>

            <a-col :span="12">
              <a-form-model-item label="截止日期" prop="deadline">
                <j-date
                  v-model="formParams.deadline"
                  :showTime="true"
                  dateFormat="YYYY-MM-DD"
                  :style="{ width: '340px' }"
                  placeholder="请选择截止日期"
                />
              </a-form-model-item>
            </a-col>

            <a-col :span="12">
              <a-form-model-item label="到货时间" prop="supplyTime">
                <j-date
                  v-model="formParams.supplyTime"
                  :showTime="true"
                  dateFormat="YYYY-MM-DD"
                  :style="{ width: '340px' }"
                  placeholder="请选择到货时间"
                />
              </a-form-model-item>
            </a-col>

            <a-col :span="24">
              <a-form-model-item
                label="报价说明"
                prop="quotationExplain"
                :label-col="{ span: 3 }"
                :wrapper-col="{ span: 19 }"
              >
                <a-textarea :rows="3" v-model="formParams.quotationExplain" placeholder="请输入报价说明" />
              </a-form-model-item>
            </a-col>

            <template v-if="this.type == 2">
              <a-col :span="24">
                <a-form-model-item label="状态" prop="status">
                  <a-input v-model="formParams.status" placeholder="请输入状态" />
                </a-form-model-item>
              </a-col>
            </template>

            <a-col :span="24" class="title">{{ this.type == 2 ? '报价信息' : '产品信息' }}</a-col>
            <a-col :span="24">
              <div class="ant-alert ant-alert-info" style="margin-bottom: 16px">
                <span class="tip">请勾选需要询价的产品：</span>
                <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择
                <a style="font-weight: 600">{{ selectedRowKeys.length }} </a>项
                <!-- <a style="margin-left: 24px" @click="onClearSelected">清空</a> -->
              </div>
            </a-col>

            <a-col :span="24">
              <!-- 产品表格数据  -->
              <InquiryTable ref="inquiryForm" :tableData="data" @selectData="selectData"></InquiryTable>
            </a-col>

            <a-col :span="24" class="remark">
              <a-form-model-item label="备注" prop="remark" :label-col="{ span: 2 }" :wrapper-col="{ span: 20 }">
                <a-textarea v-model="formParams.remark" placeholder="请输入备注" :rows="3" />
              </a-form-model-item>
            </a-col>
          </a-row>
        </template>

        <!-- 询价的详情（详情、变更记录） -->
        <template v-else>
          <a-tabs default-active-key="1">
            <a-tab-pane key="1" tab="详情">
              <a-row>
                <a-col :span="24" class="title" v-if="this.type == 2">项目信息</a-col>
                <a-col :span="12">
                  <a-form-model-item label="询价企业" prop="supplierId">
                    <span>{{ formParams.supplierName }}</span>
                  </a-form-model-item>
                </a-col>

                <a-col :span="12">
                  <a-form-model-item label="截止日期" prop="deadline">
                    <span>{{ formParams.deadline }}</span>
                  </a-form-model-item>
                </a-col>

                <a-col :span="12">
                  <a-form-model-item label="到货时间" prop="supplyTime">
                    <span>{{ formParams.supplyTime }}</span>
                  </a-form-model-item>
                </a-col>

                <template v-if="this.type == 2">
                  <a-col :span="12">
                    <a-form-model-item label="状态" prop="status">
                      <span>{{ getDictText('plan_type', formParams.status) }}</span>
                      <!-- <a-input v-model="formParams.status" placeholder="请输入状态" :disabled="disableSubmit" /> -->
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="24">
                    <a-form-model-item
                      label="报价说明"
                      prop="quotationExplain"
                      :label-col="{ span: 3 }"
                      :wrapper-col="{ span: 19 }"
                    >
                      <span>{{ formParams.quotationExplain }}</span>
                    </a-form-model-item>
                  </a-col>
                </template>

                <a-col :span="24" class="title">{{ this.type == 2 ? '报价信息' : '产品信息' }}</a-col>
                <a-col :span="24">
                  <!-- 表格区域 -->
                  <div class="table">
                    <!-- 询价详情表格 -->
                    <!-- <InquiryTable :tableData="this.formParams.schemeInfos"></InquiryTable> -->
                    <a-table
                      :columns="columnsDetail"
                      :data-source="dataSource"
                      bordered
                      rowKey="key"
                      :scroll="{ x: true }"
                      :indentSize="10"
                      :pagination="false"
                      :disabled="disableSubmit"
                    >
                      <div class="overflowStyle" slot="detailName" slot-scope="text, record">
                        <a-popover placement="top">
                          <template slot="content">
                            <span>{{ record.detailName }}</span>
                          </template>
                          <span>{{ record.detailName }}</span>
                        </a-popover>
                      </div>
                      <div class="overflowStyle" slot="position" slot-scope="text, record">
                        <a-popover placement="top">
                          <template slot="content">
                            <span>{{ record.position }}</span>
                          </template>
                          <span>{{ record.position }}</span>
                        </a-popover>
                      </div>
                      <div class="overflowStyle" slot="remark" slot-scope="text, record">
                        <a-popover placement="top">
                          <template slot="content">
                            <span>{{ record.remark }}</span>
                          </template>
                          <span>{{ record.remark }}</span>
                        </a-popover>
                      </div>
                      <div class="overflowStyle" slot="technicalSpecifications" slot-scope="text, record">
                        <a-popover placement="top">
                          <template slot="content">
                            <span>{{ record.technicalSpecifications }}</span>
                          </template>
                          <span>{{ record.technicalSpecifications }}</span>
                        </a-popover>
                      </div>
                      <div class="overflowStyle" slot="modelParameter" slot-scope="text, record">
                        <a-popover placement="top">
                          <template slot="content">
                            <span>{{ record.modelParameter }}</span>
                          </template>
                          <span>{{ record.modelParameter }}</span>
                        </a-popover>
                      </div>
                      <div class="overflowStyle" slot="supplierRemark" slot-scope="text, record">
                        <a-popover placement="top">
                          <template slot="content">
                            <span>{{ record.supplierRemark }}</span>
                          </template>
                          <span>{{ record.supplierRemark }}</span>
                        </a-popover>
                      </div>
                      <!-- 产品名称 -->
                      <template #productId="record, row">
                        {{ row.productName }}
                      </template>
                    </a-table>
                  </div>
                </a-col>

                <a-col :span="24" class="remark">
                  <a-form-model-item label="备注" prop="remark" :label-col="{ span: 2 }" :wrapper-col="{ span: 19 }">
                    <span>{{ formParams.remark }}</span>
                    <!-- <a-textarea
                      v-model="formParams.remark"
                      placeholder="请输入备注"
                      :rows="3"
                      :disabled="disableSubmit"
                    /> -->
                  </a-form-model-item>
                </a-col>
              </a-row>
            </a-tab-pane>
            <a-tab-pane key="2" tab="变更记录" force-render>
              变更记录
            </a-tab-pane>
          </a-tabs>
        </template>
      </a-form-model>
    </a-spin>

    <div class="drawer-bootom-button" v-if="this.type !== 2">
      <a-button @click="close" style="margin-right: 0.8rem">取消</a-button>
      <a-button @click="handleOk" type="primary" :loading="loading">确定</a-button>
    </div>
  </a-drawer>
</template>

<script>
// API
import { getDetail, addInquiry, getOneDetail } from '@/api/project-management/plan-management/PlanAskPrice.js'
import { getAllSupplierList } from '@/api/product-management/product-management/index'
// 组件
import InquiryTable from './InquiryTable'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin'
// import { JVXETypes } from '@/components/jeecg/JVxeTable'
import { getDictText } from '@/api/api.js'
export default {
  mixins: [TableListMixin],
  components: { InquiryTable },
  props: {
    // 产品数据
    data: {
      type: Array,
      default: () => []
    }
  },
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
      // 当前模式
      type: 0,
      // 表单配置
      labelCol: { span: 6 },
      wrapperCol: { span: 17 },
      disableMixinCreated: true, //不执行混入
      // 表单参数
      formParams: {},
      // 详情表格
      columnsDetail: [
        {
          title: '编号',
          dataIndex: 'codeNum',
          align: 'center',
          width: 100
        },
        {
          // SB-设备类，LW-劳务类，FC-辅材类，JS-技术服务类，QT-其他
          title: '供应商类型',
          dataIndex: 'trade',
          align: 'center',
          width: 120,
          customRender: value => getDictText('supplier_type', value)
        },
        {
          title: '安装位置',
          dataIndex: 'position',
          width: 100,
          align: 'center',
          ellipsis: true,
          scopedSlots: { customRender: 'position' }
        },
        {
          // （1-主材，2-辅材，3-劳务，4-配件）
          title: '产品类型',
          dataIndex: 'productType',
          width: 100,
          align: 'center',
          ellipsis: true,
          customRender(text) {
            return text == 1 ? '主材' : text == 2 ? '辅材' : text == 3 ? '劳务' : text == 4 ? '配件' : ''
          }
        },
        {
          title: '细目名称',
          dataIndex: 'detailName',
          width: 100,
          align: 'center',
          ellipsis: true,
          scopedSlots: { customRender: 'detailName' }
        },
        {
          title: '技术规格、资质证书',
          dataIndex: 'technicalSpecifications',
          width: 100,
          align: 'center',
          ellipsis: true,
          scopedSlots: { customRender: 'technicalSpecifications' }
        },
        {
          title: '产品名称',
          dataIndex: 'prodName',
          width: 100,
          align: 'center',
          ellipsis: true
        },
        {
          title: '规格参数',
          dataIndex: 'modelParameter',
          width: 100,
          align: 'center',
          ellipsis: true,
          scopedSlots: { customRender: 'modelParameter' }
        },
        {
          title: '型号',
          dataIndex: 'model',
          width: 100,
          align: 'center',
          ellipsis: true
        },
        {
          title: '数量',
          dataIndex: 'num',
          width: 100,
          align: 'center',
          ellipsis: true
        },
        {
          title: '单位',
          dataIndex: 'unit',
          width: 100,
          align: 'center',
          ellipsis: true
        },
        {
          title: '单价(元)',
          dataIndex: 'price',
          width: 100,
          align: 'center',
          ellipsis: true
        },
        {
          title: '合价(元)',
          dataIndex: 'allPrice',
          width: 100,
          align: 'center',
          ellipsis: true
        },
        {
          title: '是否偏离',
          dataIndex: 'isDeviateFrom',
          width: 100,
          align: 'center',
          ellipsis: true
        },
        {
          title: '供应商备注',
          dataIndex: 'supplierRemark',
          width: 100,
          align: 'center',
          ellipsis: true,
          scopedSlots: { customRender: 'supplierRemark' }
        },
        {
          title: '备注',
          dataIndex: 'remark',
          width: 100,
          align: 'center',
          ellipsis: true,
          scopedSlots: { customRender: 'remark' }
        }
      ],
      // 表单验证规则
      rules: {
        supplierId: [{ required: true, message: '请选择询价企业', trigger: 'change' }],
        deadline: [{ required: true, message: '请选择截止时间', trigger: 'change' }],
        supplyTime: [{ required: true, message: '请选择到货时间', trigger: 'change' }]
      },
      supplierNameList: [], //供应商列表/询价企业
      selectedRowKeys: [], //选中的keys
      selectionRows: [] //选中的row
    }
  },

  methods: {
    getDictText,
    // 打开弹窗
    open() {
      this.visible = true
      this.getbasicNameList()
    },

    // 关闭弹窗，点击遮罩层或右上角叉或取消按钮时触发
    close() {
      this.visible = false
      // 重置表单
      this.$refs.ruleForm.resetFields()
      this.formParams = {}
      this.onClearSelected()
      // 清空产品选择
      this.$refs.inquiryForm ? this.$refs.inquiryForm.onClearSelected() : ''
    },

    // 清空选中
    onClearSelected() {
      this.selectedRowKeys = []
      this.selectionRows = []
      console.log(this.selectedRowKeys, this.selectionRows)
    },

    // 供应商/询价企业列表
    getbasicNameList() {
      getAllSupplierList().then(res => {
        this.supplierNameList = res.result.records
      })
    },

    // 企业改变事件
    onCategoryChange(value) {
      this.setCategoryOptions(value)
    },
    // 设置最多可询问6家供应商
    setCategoryOptions(value = []) {
      if (value.length >= 6) {
        this.supplierNameList.forEach((item, index, array) => {
          if (value.every(v => v !== item.id)) {
            this.$set(array[index], 'disabled', true)
          } else {
            this.$set(array[index], 'disabled', false)
          }
        })
      } else {
        this.supplierNameList.forEach((item, index, array) => {
          this.$set(array[index], 'disabled', false)
        })
      }
    },

    // 添加询价
    add(row) {
      console.log('新增询价addanddetail--', row)
      //方案询价id（列表）
      this.formParams.schemeInquiryId = row.id
      // 当前为添加模式
      this.type = 0
      this.title = '新增询价'
      this.disableSubmit = false
      this.open()
    },

    // 详情
    detail(record) {
      console.log('啥详情---', record)
      this.type = 2
      this.getDetail(record.id)
      this.open()
    },

    // 获取详情
    getDetail(id) {
      getOneDetail(id).then(res => {
        console.log(res)
        if (res.success) {
          // 处理时间回显
          // res.result.deadline = res.result.deadline.split(',')
          // 处理询价企业回显
          // res.result.supplierId = res.result.supplierId.split(',')
          this.formParams = res.result
          this.dataSource = res.result.schemeInfos
        }
      })
    },

    // 选择的产品信息
    selectData(selectedRowKeys, selectionRows) {
      console.log(selectedRowKeys, selectionRows)
      this.selectedRowKeys = selectedRowKeys
      this.selectionRows = selectionRows
    },

    //提交
    handleOk() {
      console.log(this.selectedRowKeys, this.selectionRows)
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.selectedRowKeys.length == 0) return this.$message.warning('请勾选需要询价的产品!')
          let data = {
            ...this.formParams,
            supplierId: this.formParams.supplierId.toString(),
            // deadline: this.formParams.deadline.toString(),
            prodSchemeInfoId: this.selectedRowKeys.toString() //要询价的id
          }
          // 添加询价
          addInquiry(data).then(res => {
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
.remark {
  margin-top: 50px;
}
.tip {
  color: #ff2439;
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
