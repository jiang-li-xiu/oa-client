<template>
  <a-card :bordered="false" class="assembly-container-col">
    <div class="table-page-search-wrapper">
      <!-- 按钮区域 -->
      <div class="table-operator">
        <a-button type="primary" @click="handleAdd" icon="plus">新增</a-button>
      </div>

      <!-- 表格区域 -->
      <div class="table">
        <a-table
          :columns="columns"
          rowKey="id"
          :pagination="ipagination"
          :data-source="dataSource"
          bordered
          :scroll="{ x: true }"
          :rowSelection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
            fixed: true,
          }"
          @change="handleTableChange"
          :loading="loading"
        >
          <template #status="starts">
            <!-- 0-停用，1-启用 -->
            <a-tag v-if="starts == 0" color="orange">停用</a-tag>
            <a-tag v-if="starts == 1" color="green">启用</a-tag>
          </template>
          <template #action="row">
            <a-space :size="12">
              <a href="javascript:;" @click="handleEdit(row)">编辑</a>
              <template v-if="row.status !== 0">
                <a-divider type="vertical" />
                <a href="javascript:;" @click="handleDisabled(row.id)" :style="{ color: 'red' }">禁用 </a>
              </template>
              <template v-else>
                <a-divider type="vertical" />
                <a href="javascript:;" @click="handleEnable(row.id)" :style="{ color: 'green' }">启用 </a>
              </template>
            </a-space>
          </template>
        </a-table>
      </div>
    </div>

    <!-- 弹窗 -->
    <ApprovalDialog ref="modalForm" @refresh="loadData(1)"></ApprovalDialog>
  </a-card>
</template>

<script>
import { disableApproval ,enAbleApproval} from '@/api/set-approval/index.js'
// 组件
import ApprovalDialog from './components/ApprovalDialog'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin'
// 字典
import { getDictText } from '@/api/api.js'
export default {
  mixins: [TableListMixin],
  components: { ApprovalDialog },
  data() {
    return {
      // 查询参数
      param: {},
      // 表格配置
      columns: [
        {
          title: '流程名称',
          dataIndex: 'name',
          align: 'center',
          width: '25%',
        },
        {
          title: '最后修改人',
          dataIndex: 'updateBy',
          align: 'center',
          width: '25%',
        },
        {
          title: '添加时间',
          dataIndex: 'createTime',
          align: 'center',
          width: '25%',
        },
        {
          title: '状态',
          dataIndex: 'status',
          align: 'center',
          width: '25%',
          scopedSlots: { customRender: 'status' },
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          fixed: 'right',
          width: 200,
          scopedSlots: { customRender: 'action' },
        },
      ],
      // 请求地址
      url: {
        list: '/jeecg-supplier/prodApprovalProcess/list', // 列表
        deleteBatch: '/jeecg-supplier/prodApprovalProcess/batch', //删除
      },
      // 时间
      times: [],
      projectList: [], //项目信息
    }
  },

  methods: {
    handleDisabled(id) {
      console.log(id)
      let that = this
      this.$confirm({
        title: '确认禁用',
        content: '是否禁用数据?',
        onOk: function () {
          that.loading = true
          disableApproval(id)
            .then((res) => {
              if (res.success) {
                //重新计算分页问题
                that.reCalculatePage(that.selectedRowKeys.length)
                that.$message.success(res.message)
                that.loadData()
                that.onClearSelected()
              } else {
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              that.loading = false
            })
        },
      })
    },
    handleEnable(id) {
      console.log(id)
      let that = this
      this.$confirm({
        title: '确认启用',
        content: '是否启用数据?',
        onOk: function () {
          that.loading = true
          enAbleApproval(id)
            .then((res) => {
              if (res.success) {
                //重新计算分页问题
                that.reCalculatePage(that.selectedRowKeys.length)
                that.$message.success(res.message)
                that.loadData()
                that.onClearSelected()
              } else {
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              that.loading = false
            })
        },
      })
    },
  },
}
</script>

<style lang="less" scoped>
.assembly-container-col {
  min-height: calc(100vh - 135px);
  background-color: #fff;
}
::v-deep .ant-table td {
  white-space: nowrap;
}
</style>
