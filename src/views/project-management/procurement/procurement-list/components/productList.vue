<template>
  <a-card :bordered="false" class="assembly-container-col">
    <!-- 弹窗内容 -->
    <a-row :gutter="20" class="main">
      <!-- 表格一 -->
      <a-col :span="24" class="list">
        <!-- 标题 -->
        <div class="title">
          <span>可选产品</span>
        </div>
        <div class="query">
          <a-form-model ref="ruleForm" :model="param" layout="inline" @keyup.enter.native="searchQuery">
            <slot :param="param">
              <a-form-model-item label="产品名称" prop="prodName">
                <a-input v-model="param.prodName" placeholder="请输入产品名称"></a-input>
              </a-form-model-item>
            </slot>
            <a-form-model-item>
              <a-button type="primary" @click="searchQuery">查询</a-button>
              <a-button style="margin-left: 10px" @click="searchReset">重置</a-button>
            </a-form-model-item>
          </a-form-model>
        </div>
        <div class="table">
          <!-- :rowSelection="{
              type: selectType,
              selectedRowKeys: selectedRowKeys,
              selectionRows: selectionRows,
              onChange: onSelectChange,
              getCheckboxProps: getCheckboxProps
            }" -->
          <a-table
            :columns="columns"
            :rowKey="rowKey"
            size="small"
            :pagination="ipagination"
            :data-source="dataSource"
            bordered
            :scroll="{ y: 600 }"
            :rowSelection="rowSelection"
            @change="handleTableChange"
            :loading="loading"
          >
            <template #procurementing="text, record">
              {{ record.num - record.notPurchase }}
            </template>
          </a-table>
        </div>
      </a-col>

      <!-- 表格二 -->
      <template mplate>
        <a-col :span="24" class="list">
          <!-- 标题 -->
          <div class="title">
            <span>已选产品</span>
          </div>
          <!-- 有页脚版 -->
          <template v-if="is_footer">
            <div class="table">
              <a-table
                :columns="columnsSelect"
                :rowKey="rowKey"
                size="small"
                :data-source="selectionRows"
                bordered
                :pagination="false"
                :scroll="{ y: 650 }"
                :loading="loading"
                @change="(pagination) => (selectPagination = pagination)"
                ref="TableInfo"
              >
                <!--  :footer="handleFooterShow" -->
                <!-- 本次采购数量 -->
                <template #thisPurchase="text, record, index">
                  <a-input-number
                    :default-value="record.notPurchase"
                    :max="record.notPurchase"
                    :min="0"
                    v-model="record.thisPurchase"
                    :style="{ width: '90%' }"
                    :disabled="disableSubmit"
                    @change="changeNum(record, index)"
                  />
                </template>
                <template #num="text, record">
                  <a-input-number :min="0" v-model="record.num" />
                </template>

                <template #actualPurchasePrice="text, record, index">
                  <a-input-number
                    v-model="record.actualPurchasePrice"
                    :style="{ width: '90%' }"
                    :disabled="disableSubmit"
                    @change="changeNum(record, index)"
                  />
                </template>
                <!-- 实际采购合价 -->
                <template #purchaseTotlePrice="text, record">
                  {{ record.purchaseTotlePrice }}
                </template>
                <template #action="text, record">
                  <a-space :size="12">
                    <a @click="remove(record)" :style="{ color: 'red' }">移除</a>
                  </a-space>
                </template>
              </a-table>

              <div class="subtotal">
                <div class="left">合计</div>
                <!-- 单价合计 -->
                <div class="number">{{ unitPriceTotals(this.selectionRows) }}</div>
                <!-- 合计合计 -->
                <div class="number">{{ priceTotals(this.selectionRows) }}</div>
                <!-- 本次采购数量 -->
                <div class="number">{{ proNumTotals }}</div>
                <!-- 实际采购单价 -->
                <div class="number">{{ ActualUnitPrice(this.selectionRows) }}</div>
                <!-- 实际采购合价 -->
                <div class="number">{{ ActualTotalAmounts }}</div>

                <div class="number"></div>
                <!-- 这个是为了占位，因为我的操作列固定在了右侧，避免滚动条滚不到最后一列，保持合计行的列数和表格列数一样 -->
              </div>
            </div>
          </template>

          <!-- 无页脚 -->
          <template v-else>
            <div class="table">
              <a-table
                :columns="columnsSelect"
                :rowKey="rowKey"
                size="small"
                :data-source="selectionRows"
                bordered
                :pagination="false"
                :scroll="{ y: 650 }"
                :loading="loading"
                @change="(pagination) => (selectPagination = pagination)"
                ref="TableInfo"
              >
                <template #action="text, record">
                  <a-space :size="12">
                    <a @click="remove(record)" :style="{ color: 'red' }">移除</a>
                  </a-space>
                </template>
              </a-table>
            </div>
          </template>
        </a-col>
      </template>
    </a-row>
  </a-card>
</template>

<script>
// API
import { getAction } from '@/api/manage.js'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin.js'
//导入过滤对象中为空的属性、防抖方法
import { simpleDebounce } from '@/utils/util'
// 数组对象去重
import { uniqBy, uniq } from 'lodash'

export default {
  mixins: [TableListMixin],
  props: {
    // 表格配置
    columns: {
      type: Array,
      default: () => [
        {
          title: '细目名称',
          dataIndex: 'detailName',
          width: 100,
          ellipsis: true,
          align: 'center',
          sorter: (a, b) => a.detailName.length - b.detailName.length,
        },
        {
          title: '安装位置',
          dataIndex: 'position',
          width: 80,
          align: 'center',
          ellipsis: true,
        },
        {
          title: '技术规格 资质证书',
          dataIndex: 'technicalSpecifications',
          width: 130,
          align: 'center',
          ellipsis: true,
        },
        {
          title: '产品名称',
          dataIndex: 'prodName',
          width: 100,
          align: 'center',
          ellipsis: true,
        },
        {
          title: '规格参数',
          dataIndex: 'specification',
          width: 100,
          align: 'center',
          ellipsis: true,
        },
        {
          title: '型号',
          dataIndex: 'model',
          width: 80,
          align: 'center',
          ellipsis: true,
        },
        {
          title: '供应商',
          dataIndex: 'supplier',
          width: 80,
          align: 'center',
          ellipsis: true,
        },
        {
          title: '单位',
          dataIndex: 'unit',
          width: 80,
          align: 'center',
          ellipsis: true,
        },
        {
          title: '数量',
          dataIndex: 'num',
          width: 80,
          align: 'center',
          ellipsis: true,
        },
        {
          title: '已采数量',
          dataIndex: 'alreadyPurchase',
          width: 100,
          align: 'center',
          ellipsis: true,
        },
        {
          title: '未采数量',
          dataIndex: 'notPurchase',
          width: 100,
          align: 'center',
          ellipsis: true,
          key: 'notPurchase',
          // sorter: {
          //   compare: (a, b) => a.notPurchase - b.notPurchase,
          //   multiple: 2
          // }
          sorter: (a, b) => a.notPurchase - b.notPurchase,
        },
        {
          title: '正在采购',
          dataIndex: 'procurementing',
          width: 100,
          align: 'center',
          ellipsis: true,
          scopedSlots: { customRender: 'procurementing' },
        },
        {
          title: '单价(元)',
          dataIndex: 'price',
          width: 100,
          align: 'center',
          ellipsis: true,
        },
        {
          title: '合价(元)',
          dataIndex: 'totalAmount',
          width: 100,
          align: 'center',
          ellipsis: true,
        },
      ],
    },
    // 已选表格配置
    columnsSelect: {
      type: Array,
      default: () => [
        {
          title: '细目名称',
          dataIndex: 'detailName',
          width: 80,
          ellipsis: true,
          align: 'center',
        },
        {
          title: '安装位置',
          dataIndex: 'position',
          width: 80,
          align: 'center',
          ellipsis: true,
        },
        {
          title: '技术规格 资质证书',
          dataIndex: 'technicalSpecifications',
          width: 140,
          align: 'center',
          ellipsis: true,
        },
        {
          title: '产品名称',
          dataIndex: 'prodName',
          width: 80,
          align: 'center',
          ellipsis: true,
        },
        {
          title: '规格参数',
          dataIndex: 'specification',
          width: 80,
          align: 'center',
          ellipsis: true,
        },
        {
          title: '型号',
          dataIndex: 'model',
          width: 60,
          align: 'center',
          ellipsis: true,
        },
        {
          title: '供应商',
          dataIndex: 'supplier',
          width: 70,
          align: 'center',
          ellipsis: true,
        },
        {
          title: '单位',
          dataIndex: 'unit',
          width: 60,
          align: 'center',
          ellipsis: true,
        },
        {
          title: '数量',
          dataIndex: 'num',
          width: 70,
          align: 'center',
          ellipsis: true,
        },
        {
          title: '已采数量',
          dataIndex: 'alreadyPurchase',
          width: 80,
          align: 'center',
          ellipsis: true,
        },
        {
          title: '单价(元)',
          dataIndex: 'price',
          width: 85,
          // align: 'center',
          ellipsis: true,
        },
        {
          title: '合价(元)',
          dataIndex: 'totalAmount',
          width: 85,
          // align: 'center',
          ellipsis: true,
          scopedSlots: { customRender: 'totalAmount' },
        },
        {
          title: '本次采购数量',
          dataIndex: 'thisPurchase',
          width: 100,
          align: 'center',
          ellipsis: true,
          scopedSlots: { customRender: 'thisPurchase' },
        },
        {
          title: '实际采购单价',
          dataIndex: 'actualPurchasePrice',
          width: 100,
          align: 'center',
          ellipsis: true,
          scopedSlots: { customRender: 'actualPurchasePrice' },
        },
        {
          title: '实际采购合价',
          dataIndex: 'purchaseTotlePrice',
          width: 100,
          align: 'left',
          ellipsis: true,
          scopedSlots: { customRender: 'purchaseTotlePrice' },
        },
        {
          title: '备注',
          dataIndex: 'remark',
          width: 50,
          align: 'center',
          ellipsis: true,
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          width: 50,
          scopedSlots: { customRender: 'action' },
        },
      ],
    },

    // 表格请求地址
    listUrl: {
      require: true,
      type: String,
      default: `/jeecg-supplier/prodPurchaseList/products`,
    },
    // 单选或多选
    selectType: {
      // checkbox, radio
      type: String,
      default: 'checkbox',
    },
    // 弹窗标题
    modalTitle: {
      type: String,
      default: '选择辅材',
    },
    // 已选范围
    HouseItem: {
      type: Array,
      default() {},
    },
    // 列表传参方式
    paramMode: {
      type: String,
      // 可选值 path, query
      default: 'path',
    },

    // 表格唯一标识
    rowKey: {
      type: String,
      default: 'id',
    },
    // 插槽数据
    slotParams: {
      type: Object,
      default: () => {
        return {}
      },
    },
    // id
    procuremmentId: {
      type: String,
      default: '',
    },
    // 是否展示页脚
    is_footer: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      // 请求地址
      url: {
        list: this.listUrl,
      },
      // 不允许执行混入的created
      disableMixinCreated: true,
      disableSubmit: false,
      // 表单查询参数
      param: {},
      // 标题
      title: '全部',
      /* 分页参数 */
      selectPagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0,
      },
      proNumTotals: '', //采购数量合计
      totalAmounts: '', //合计总计
      ActualTotalAmounts: '', //实际采购合价
      // 排序
      isorter: {
        column: 'notPurchase',
        order: 'desc',
      },
    }
  },

  computed: {
    rowSelection() {
      const { selectedRowKeys } = this
      return {
        selectedRowKeys,
        onChange: this.onSelectChange,
        getCheckboxProps: (record) => ({
          props: {
            disabled: record.notPurchase === 0, // 不可选中
          },
        }),
      }
    },
    // 采购单价合计 price单价
    unitPriceTotals() {
      return (row) => {
        return row.reduce((p, c) => p + c.price, 0)
      }
    },
    // 采购合价总计
    priceTotals() {
      return (row) => {
        return row.reduce((p, c) => p + c.totalAmount, 0)
      }
    },
    // 实际采购单价总和 actualPurchasePrice
    ActualUnitPrice() {
      return (row) => {
        return row.reduce((p, c) => p + c.actualPurchasePrice, 0)
      }
    },
  },

  mounted() {
    this.loadData(1)
  },

  methods: {
    changeNum(record, index) {
      //本次采购数量总数
      this.proNumTotals = this.selectionRows.reduce((p, c) => p + c.thisPurchase, 0)

      // 当前行实际采购合价 = 本次采购数*实际采购单价
      record.purchaseTotlePrice = record.thisPurchase * record.actualPurchasePrice

      // 实际采购合价(合计)
      this.ActualTotalAmounts = this.selectionRows.reduce((p, c) => p + c.purchaseTotlePrice, 0)

      // console.log(record)
    },

    // changeNums(record, index) {
    //   // record.nums = record.num
    //   this.$set(this.selectionRows[index], 'nums', record.num)
    // },

    // 关闭弹窗事件
    handleCancel() {
      // 清空数据
      this.onClearSelected()
      this.searchReset()
      this.id = ''
      this.arr = []
      this.dataSource = []
      this.proNumTotals = '' //本次采购数量总数
      this.ActualTotalAmounts = '' //实际采购合价
    },

    // 列表多选
    onSelectChange(selectedRowKeys, selectionRows) {
      this.selectedRowKeys = uniq(selectedRowKeys)
      const arr = uniqBy([...this.selectionRows, ...selectionRows], this.rowKey)

      this.selectionRows = arr.filter((row) => this.selectedRowKeys.includes(row[this.rowKey]))
    },

    // 获取列表数据
    loadData(arg) {
      if (!this.url.list) {
        this.$message.error('请设置url.list属性!')
        return
      }
      //加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1
      }
      let params = this.getQueryParams() //查询条件
      console.log(params)
      this.loading = true
      // 处理url
      this.url.list = `${this.listUrl}/${this.procuremmentId}`
      // this.url.list = this.paramMode == 'path' ? `${this.listUrl}/${this.id}` : this.listUrl
      return getAction(this.url.list, params)
        .then((res) => {
          if (res.success) {
            //update-begin---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
            this.dataSource = res.result.records || res.result

            this.dataSource.forEach((item) => {
              // * 清空这两个值，这两个值应该是自己填入的
              item.thisPurchase = '' //本次采购单价
              item.actualPurchasePrice = '' //实际采购单价
            })

            if (this.id) {
              // 回显数据
              const selectedRowKeys = []
              this.selectType == 'radio' ? selectedRowKeys.push(this.id) : selectedRowKeys.push(...this.id)
              this.selectedRowKeys = uniq([...this.selectedRowKeys, ...selectedRowKeys])
              console.log(selectedRowKeys, 1111111111111111)
              // 选中的数据
              Array.isArray(this.arr)
                ? (this.selectionRows = uniqBy(this.selectionRows.concat(this.arr), this.rowKey))
                : this.getSelectionRows()
            }
            if (res.result.total) {
              this.ipagination.total = res.result.total
            } else {
              this.ipagination.total = 0
            }
            //update-end---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
          } else {
            this.$message.warning(res.message)
          }
          return res
        })
        .finally(() => {
          this.loading = false
        })
    },

    // 保存数据回显后需提交的数据
    getSelectionRows() {
      const selectionArr = this.dataSource.filter((item) => this.selectedRowKeys.indexOf(item[this.rowKey]) !== -1)
      this.selectionRows = uniqBy([...this.selectionRows, ...selectionArr], this.rowKey)
    },

    // 删除
    remove(data, selectedRowKeys, selectionRows) {
      console.log(this.selectionRows, this.selectedRowKeys)
      // 判断当前模式，data为数组则为当前组件删除，不为数组则是外部组件调用
      const flag = Object.prototype.toString.call(data) === '[object Object]'
      // 处理id
      const id = flag ? data[this.rowKey] : data
      // 判断数据
      selectedRowKeys = flag ? this.selectedRowKeys : selectedRowKeys
      selectionRows = flag ? this.selectionRows : selectionRows
      // 根据id删除selectedRowKeys对应的值
      selectedRowKeys.splice(selectedRowKeys.indexOf(id), 1)
      // 重新查询数据
      if (flag)
        return (this.selectionRows = this.selectionRows.filter(
          (item) => this.selectedRowKeys.indexOf(item[this.rowKey]) !== -1
        ))
      // 根据情况返回数据
      if (!flag) {
        selectionRows = selectionRows.filter((item) => selectedRowKeys.indexOf(item[this.rowKey]) !== -1)
        const selectData = {
          selectedRowKeys: [...selectedRowKeys],
          selectionRows: [...selectionRows],
        }
        // 发射处理好的数据出去
        this.$emit('select', selectData)
      }
    },

    // 检索：重置按钮
    searchReset() {
      this.$refs.ruleForm.resetFields()
      // 当前角色类型
      this.slotParams.principalType = this.principalType
      simpleDebounce(this.loadData, 0)(1)
    },
  },
  watch: {
    slotParams: {
      handler(newVlaue) {
        this.principalType = newVlaue.principalType
        Object.assign(this.slotParams, this.param)
        this.param = this.slotParams
      },
      deep: true,
      immediate: true,
    },
    selectionRows: {
      handler(newVlaue) {
        // console.log(newVlaue)

        // 发射填写的数据出去
        const data = {
          selectionRows: [...newVlaue],
        }
        this.$emit('select', data)

        // 重新计算采购数量等
        newVlaue.map((item, index) => {
          this.changeNum(item, index)
        })
        console.log(newVlaue)
      },
      deep: true,
      immediate: true,
    },
    // 监听滚动条(把表格的滚动条隐藏了，只显示一条滚动条，监听滚动条滚动的时候，表格和尾部可以一起滑动)
    dataSource() {
      const dom = this.$refs.TableInfo.$el.getElementsByClassName('ant-table-body')[0]
      const footerDom = document.getElementsByClassName('subtotal')[0]
      footerDom
        ? footerDom.addEventListener(
            'scroll',
            () => {
              dom.scrollLeft = footerDom.scrollLeft
            },
            true
          )
        : ''
    },
  },
}
</script>

<style lang="less" scoped>
.main {
  min-height: 800px;
  .list {
    .title {
      height: 35px;
      line-height: 35px;
      border-bottom: 1px solid #eee;
      background-color: #1890ff;
      font-size: 14px;
      color: #eee;
      text-align: left;
      padding-left: 10px;
    }
    .query {
      margin: 12px 0;
    }
  }
}

.subtotal {
  height: 50px;
  position: absolute;
  // bottom: 10px;
  width: 98.5%;
  border: 1px solid #e8e8e8;
  background: #f4f4f4;
  display: flex;
  align-items: center;
  font-weight: 900;
  overflow-x: scroll;
  overflow-y: hidden;
  .left {
    flex: none; /* div显示滚动条的重点 */
    width: 880px;
  }
  .number {
    flex: none;
    color: #666666;
    height: 100%;
    width: 100px;
    display: flex;
    align-items: center;
    padding-left: 5px;
  }
}
//隐藏a-table组件的滚动条
// /deep/.ant-table-fixed-header > .ant-table-content > .ant-table-scroll > .ant-table-body {
//   overflow: hidden !important;
// }
// /deep/.ant-table-footer {
//   margin: 0;
// }
</style>
