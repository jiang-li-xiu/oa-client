<template>
  <a-card :bordered="false" class="assembly-container-col">
    <a-spin tip="加载中..." :spinning="loading">
      <a-form-model ref="ruleForm" :model="formParams" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row>
          <template>
            <a-col :span="24">
              <!-- 表格区域 -->
              <div class="table">
                <a-table
                  :columns="columnsDetail"
                  :data-source="tableData"
                  bordered
                  rowKey="id"
                  :scroll="{ x: true }"
                  :indentSize="10"
                  :pagination="false"
                  :rowSelection="{
                    selectedRowKeys: selectedRowKeys,
                    onChange: onSelectChange,
                    fixed: true
                  }"
                  @change="handleTableChange"
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
                  <!-- 产品名称 -->
                  <template #productId="record, row">
                    {{ row.productName }}
                  </template>
                </a-table>
              </div>
            </a-col>
          </template>
        </a-row>
      </a-form-model>
    </a-spin>
  </a-card>
</template>

<script>
// 混入
import { TableListMixin } from '@/mixins/TableListMixin'
export default {
  mixins: [TableListMixin],
  props: {
    // 表格数据
    tableData: {
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
      // 当前模式 0-添加 1-编辑 2-详情
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
          width: '14%',
          ellipsis: true,
          align: 'center'
        },
        {
          title: '细目名称',
          dataIndex: 'detailName',
          width: '14%',
          ellipsis: true,
          align: 'center',
          scopedSlots: { customRender: 'detailName' }
        },
        {
          title: '安装位置',
          dataIndex: 'position',
          width: '14%',
          ellipsis: true,
          align: 'center',
          scopedSlots: { customRender: 'position' }
        },
        {
          title: '技术规格 资质证书',
          dataIndex: 'technicalSpecifications',
          width: '14%',
          ellipsis: true,
          align: 'center',
          scopedSlots: { customRender: 'technicalSpecifications' }
        },
        {
          title: '单位',
          dataIndex: 'unit',
          width: '14%',
          ellipsis: true,
          align: 'center'
        },
        {
          title: '数量',
          dataIndex: 'num',
          width: '14%',
          ellipsis: true,
          align: 'center'
        },
        {
          title: '备注',
          dataIndex: 'remark',
          width: '14%',
          ellipsis: true,
          align: 'center',
          scopedSlots: { customRender: 'remark' }
        }
      ]
      // 表格数据
      // tableData: []
    }
  },

  methods: {
    // 选中的key row
    onSelectChange(selectedRowKeys, selectionRows) {
      // console.log(selectedRowKeys, selectionRows)
      this.selectedRowKeys = selectedRowKeys
      this.selectionRows = selectionRows
      this.$emit('selectData', this.selectedRowKeys, this.selectionRows)
    },
    
  },
  watch: {
    tableData: {
      handler(newVlaue) {
        console.log(newVlaue)
        // 发射方案的数据出去
        this.$emit('planData', newVlaue)
      },
      deep: true,
      immediate: true
    },
    selectedRowKeys: {
      handler(newVlaue) {
        this.selectedRowKeys = newVlaue
      },
      deep: true,
      immediate: true
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
