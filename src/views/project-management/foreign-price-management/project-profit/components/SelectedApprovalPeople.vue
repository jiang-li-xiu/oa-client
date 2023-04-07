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
    :body-style="{ height: '70vh', overflow: 'hidden', overflowY: 'scroll' }"
  >
    <template #footer>
      <a-button key="back" @click="handleCancel">取消</a-button>
      <a-button key="submit" type="primary" @click="handleOk" :disabled="selectedRowKeys.length === 0">提交</a-button>
    </template>
    <!-- 弹窗内容 -->
    <a-row :gutter="20" class="main">
      <div class="query">
        <a-form-model ref="ruleForm" :model="param" layout="inline" @keyup.enter.native="searchQuery">
          <slot :param="param">
            <a-form-model-item label="角色名称" prop="roleName">
              <j-input v-model="param.roleName" placeholder="请输入角色名称"></j-input>
            </a-form-model-item>
            <a-form-model-item label="角色编码" prop="roleCode">
              <j-input v-model="param.roleCode" placeholder="请输入角色编码"></j-input>
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
import { uniqBy } from 'lodash'

export default {
  mixins: [TableListMixin],
  props: {
    // 表格二的展示
    is_show: {
      type: Boolean,
      default: false,
    },
    // 单选或多选
    selectType: {
      type: String,
      default: 'radio',
    },

    // 表格配置
    columns: {
      type: Array,
      default: () => [
        {
          title: '角色编码',
          dataIndex: 'roleCode',
          align: 'center',
        },
        {
          title: '角色名称',
          dataIndex: 'roleName',
          align: 'center',
        },
      ],
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
      modalTitle: '选择角色',
      roleListUrl: '/sys/role/list',
      // 弹窗开关
      visible: false,
      // 树形loading
      treeLoading: false,
      // 树形数据
      treeData: [],
      // 选中的范围列表
      houseList: [],
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
      // 当前点击的树形节点
      treeNodeData: {},
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
    }
  },
  created() {
    // 监听树形点击事件
  },
  beforeDestroy() {
    // 销毁监听树形点击事件
  },

  methods: {
    // 打开弹窗
    open(id, arr) {
      console.log('open:', id, arr)

      // 打开弹窗
      this.visible = true
      this.loadData().then((res) => {
        if (id) {
          // 回显数据
          this.selectType == 'radio' ? this.selectedRowKeys.push(id) : this.selectedRowKeys.push(...id)
          // 选中的数据
          Array.isArray(arr) ? (this.selectionRows = [...arr]) : this.getSelectionRows()
        }
      })
      // 获取树形
      //this.getTreeData(id, arr)
    },
    // 关闭弹窗事件
    handleCancel() {
      // 关闭弹窗
      this.visible = false
      // 清空数据
      this.onClearSelected()
      this.searchReset()
    },

    // 列表多选
    onSelectChange(selectedRowKeys, selectionRows) {
      this.selectedRowKeys = selectedRowKeys
      const arr = uniqBy([...this.selectionRows, ...selectionRows], this.rowKey)

      this.selectionRows = arr.filter((row) => this.selectedRowKeys.includes(row[this.rowKey]))
    },

    // 获取列表数据
    loadData(arg) {
      if (!this.roleListUrl) {
        this.$message.error('请设置url.list属性!')
        return
      }
      //加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1
      }
      let params = this.getQueryParams() //查询条件
      this.loading = true
      // 处理url
      this.url.list =
        this.paramMode == 'path' ? `${this.listUrl}/${this.treeNodeData[this.treeReplaceFields.key]}` : this.listUrl
      return getAction(this.roleListUrl, params)
        .then((res) => {
          if (res.success) {
            //update-begin---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
            this.dataSource = res.result.records || res.result
            // this.dataSourceSelect = res.result.records || res.result
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

    // 点击确认
    handleOk() {
      const data = {
        selectedRowKeys: [...this.selectedRowKeys],
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
      this.selectionRows = uniqBy(this.selectionRows.concat(selectionArr), this.rowKey)
    },

    // 删除已选覆盖范围
    remove(data, selectedRowKeys, selectionRows) {
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
