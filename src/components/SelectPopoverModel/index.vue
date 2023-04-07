<template>
  <a-modal
    class="dialog"
    style="background-color: #f0f2f5"
    :title="modalTitle"
    :width="1000"
    v-if="visible"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :body-style="{ height: '50vh', overflow: 'hidden', overflowY: 'scroll' }"
  >
    <template #footer>
      <a-button key="back" @click="handleCancel">取消</a-button>
      <a-button key="submit" type="primary" @click="handleOk" :disabled="selectedRowKeys.length === 0">提交</a-button>
    </template>
    <!-- 弹窗内容 -->
    <a-row :gutter="20" class="main">
      <a-col :span="24" class="list">
        <div class="query">
          <a-form-model ref="ruleForm" :model="param" layout="inline" @keyup.enter.native="searchQuery">
            <slot :param="param">
              <a-form-model-item label="项目名称" prop="projectName">
                <a-input v-model="param.projectName" placeholder="请输入项目名称"></a-input>
              </a-form-model-item>
              <a-form-model-item label="客户名称" prop="customerName">
                <a-input v-model="param.customerName" placeholder="请输入客户名称"></a-input>
              </a-form-model-item>
            </slot>
            <a-form-model-item>
              <a-button type="primary" @click="searchQuery">查询</a-button>
              <a-button style="margin-left: 10px" @click="searchReset">重置</a-button>
            </a-form-model-item>
          </a-form-model>
        </div>
        <div class="table">
          <a-table
            :columns="columns"
            :rowKey="rowKey"
            size="small"
            :pagination="ipagination"
            :data-source="dataSource"
            bordered
            :scroll="{ y: 600 }"
            :rowSelection="{
              type: selectType,
              selectedRowKeys: selectedRowKeys,
              selectionRows: selectionRows,
              onChange: onSelectChange,
            }"
            @change="handleTableChange"
            :loading="loading"
          ></a-table>
        </div>
      </a-col>
    </a-row>
  </a-modal>
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
          title: '申请时间',
          dataIndex: 'time',
          align: 'center',
          ellipsis: true,
        },
        {
          title: '申请部门',
          dataIndex: 'department',
          align: 'center',
          ellipsis: true,
        },
        {
          title: '申请人',
          dataIndex: 'people',
          align: 'center',
          ellipsis: true,
        },
        {
          title: '申请类别',
          dataIndex: 'type',
          align: 'center',
          ellipsis: true,
          customRender(text) {
            return text == 1 ? '部门采购申请' : text == 2 ? '三方比价申请' : text == 3 ? '采购下单申请' : ''
          },
        },
        {
          title: '客户名称',
          dataIndex: 'customerName',
          align: 'center',
          ellipsis: true,
        },
        {
          title: '项目名称',
          dataIndex: 'projectName',
          align: 'center',
          ellipsis: true,
        },
        {
          title: '审批状态',
          dataIndex: 'status',
          align: 'center',
          ellipsis: true,
          customRender(d) {
            // 1-审批中，2-审批通过，3-审批不通过 4-待提交
            if (d == 1) {
              return '审批中'
            } else if (d == 2) {
              return '审批通过'
            } else if (d == 3) {
              return '审批不通过'
            } else if (d == 4) {
              return '待提交'
            } else {
              return d
            }
          },
        },
      ],
    },
    type: {
      type: String,
      default: '1',
    },

    // 表格请求地址
    listUrl: {
      require: true,
      type: String,
      default: '/pcmProcurement/binding/first',
    },
    // 单选或多选
    selectType: {
      type: String,
      default: 'radio',
    },
    // 弹窗标题
    modalTitle: {
      type: String,
      default: '关联采购申请',
    },
    // 列表传参方式
    paramMode: {
      type: String,
      // 可选值 path, query
      default: 'query',
    },
    // 表格唯一标识
    rowKey: {
      type: String,
      default: 'id',
    },
    // 列表请求数据携带的参数
    listKey: {
      type: String,
      default: '',
    },
    // 插槽数据
    slotParams: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      // 弹窗开关
      visible: false,
      // 请求地址
      url: {
        list: this.listUrl,
      },
      // 不允许执行混入的created
      disableMixinCreated: true,
      // 表单查询参数
      param: {},
      // 标题
      title: '全部',
      // 保存回显的id
      id: '',
      arr: '',
    }
  },

  methods: {
    // 打开弹窗
    open(id, arr) {
      console.log('open:', id, arr)
      this.id = id
      this.arr = arr
      // 打开弹窗
      this.visible = true
      this.loadData().then((res) => {
        if (id) {
          // 回显数据
          this.selectType == 'radio' ? this.selectedRowKeys.push(id) : this.selectedRowKeys.push(...id)
          // 选中的数据
          Array.isArray(arr)
            ? (this.selectionRows = uniqBy(this.selectionRows.concat(arr), this.rowKey))
            : this.getSelectionRows()
        }
      })
    },
    // 关闭弹窗事件
    handleCancel() {
      // 关闭弹窗
      this.visible = false

      // 清空数据
      this.onClearSelected()
      this.searchReset()
      this.id = ''
      this.arr = []
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

      return getAction(`${this.url.list}?type=${this.type}`, params)
        .then((res) => {
          if (res.success) {
            //update-begin---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
            this.dataSource = res.result.records || res.result
            // this.dataSourceSelect = res.result.records || res.result

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

    // 列表多选
    onSelectChange(selectedRowKeys, selectionRows) {
      this.selectedRowKeys = uniq(selectedRowKeys)
      const arr = uniqBy([...this.selectionRows, ...selectionRows], this.rowKey)

      this.selectionRows = arr.filter((row) => this.selectedRowKeys.includes(row[this.rowKey]))
    },

    // 点击确认
    handleOk() {
      const data = {
        selectedRowKeys: [...uniq(this.selectedRowKeys)],
        selectionRows: [...this.selectionRows],
      }
      // 发射选中的数据出去
      this.$emit('select', data)
      // 关闭弹窗
      this.handleCancel()
    },

    // 保存数据回显后需提交的数据
    getSelectionRows() {
      const selectionArr = this.dataSource.filter((item) => this.selectedRowKeys.indexOf(item[this.rowKey]) !== -1)
      this.selectionRows = uniqBy([...this.selectionRows, ...selectionArr], this.rowKey)
    },

    // 检索：重置按钮
    searchReset() {
      console.log(this.type)
      this.$refs.ruleForm.resetFields()
      // 当前角色类型
      simpleDebounce(this.loadData, 0)(1)
    },
  },
  watch: {
    slotParams: {
      handler(newVlaue) {
        Object.assign(this.slotParams, this.param)
        this.param = this.slotParams
      },
      deep: true,
      immediate: true,
    },
  },
}
</script>

<style lang="less" scoped>
.main {
  min-height: 800px;
  .tree {
    min-height: 800px;
    border-right: 5px solid #eee;
  }
  .list {
    .title {
      height: 50px;
      line-height: 50px;
      border-bottom: 1px solid #eee;
      background-color: #1890ff;
      font-size: 15px;
      color: #eee;
      text-align: center;
      font-weight: bold;
    }
    .query {
      margin: 12px 0;
    }
  }
}
</style>
