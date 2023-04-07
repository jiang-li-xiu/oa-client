<!--
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-08-31 14:49:30
 * @LastEditors: JLX
 * @LastEditTime: 2022-09-01 17:55:11
-->

<template>
  <a-card :bordered="false" class="assembly-container-col">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form-model ref="ruleForm" v-model="param" layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-model-item label="方案名称" prop="name">
              <j-input v-model="param.name" placeholder="请输入方案名称" />
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="审批状态" prop="type">
              <a-select v-model="param.type" placeholder="请选择审批状态">
                <a-select-option value="0">未审批</a-select-option>
                <a-select-option value="1">已审批</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>

          <!-- <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-model-item label="状态" prop="industry">
                <a-select v-model="param.industry" placeholder="请选择状态">
                  <a-select-option value="0">待审批</a-select-option>
                  <a-select-option value="1">已审批</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </template> -->

          <a-col :md="6" :sm="8">
            <span style="float: left; overflow: hidden" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">搜索</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <!-- <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a> -->
            </span>
          </a-col>
        </a-row>
      </a-form-model>

      <!-- 按钮区域 -->
      <div class="table-operator">
        <a-button type="primary" @click="handleAdd" icon="plus">新增</a-button>
        <a-button icon="delete" type="danger" @click="batchPathDel" :disabled="selectedRowKeys.length === 0"
          >删除
        </a-button>
      </div>

      <!-- 表格区域 -->
      <div class="table">
        <div class="ant-alert ant-alert-info" style="margin-bottom: 16px">
          <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择
          <a style="font-weight: 600">{{ selectedRowKeys.length }}</a
          >项
          <a style="margin-left: 24px" @click="onClearSelected">清空</a>
        </div>

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
            fixed: true
          }"
          @change="handleTableChange"
          :loading="loading"
        >
          <template #action="row">
            <a-space :size="12">
              <a href="javascript:;" @click="handleEdit(row)">编辑</a>
              <a-divider type="vertical" />
              <a href="javascript:;" @click="handleDetail(row)">详情</a>
              <template v-if="row.status !== 1">
                <a-divider type="vertical" />
                <a @click="handleApproval(row)">审核</a>
              </template>
            </a-space>
          </template>
        </a-table>
      </div>
    </div>

    <!-- 新增详情弹窗 -->
    <add-and-detail-dialog ref="modalForm" @refresh="loadData(1)"></add-and-detail-dialog>
  </a-card>
</template>

<script>
// 组件
import AddAndDetailDialog from './components/AddAndDetailDialog'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin'
export default {
  mixins: [TableListMixin],
  components: { AddAndDetailDialog },
  data() {
    return {
      // 查询参数
      param: {},
      // 表格配置
      columns: [
        {
          title: '方案名称',
          dataIndex: 'name',
          align: 'center',
          width: '25'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          align: 'center',
          width: '25'
        },
        {
          title: '更新时间',
          dataIndex: 'updateTime',
          align: 'center',
          width: '25'
        },
        {
          title: '审批状态',
          dataIndex: 'approve',
          align: 'center',
          width: '25',
          customRender(text) {
            return text == 1 ? '已审批' : '待审批'
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          fixed: 'right',
          width: 200,
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 请求地址
      url: {
        list: '/oa-base/plans/list' // 列表
      }
    }
  },

  methods: {
    // 审核
    handleApproval(row) {
      let that = this
      this.$confirm({
        title: '请确认',
        content: '是否确认通过审核？',
        onOk: function() {
          // that.loading = true
          // deleteAction(that.url.deleteBatch, { ids: ids })
          //   .then(res => {
          //     if (res.success) {
          //       //重新计算分页问题
          //       that.reCalculatePage(that.selectedRowKeys.length)
          //       that.$message.success(res.message)
          //       that.loadData()
          //       that.onClearSelected()
          //     } else {
          //       that.$message.warning(res.message)
          //     }
          //   })
          // .finally(() => {
          //   that.loading = false
          // })
        }
      })
    },

    // 列表内容删除：多选或单选 || 路径传参
    batchPathDel: function() {
      let ids = this.selectedRowKeys.toString()
      let that = this
      console.log(ids)
      // this.$confirm({
      //   title: '确认删除',
      //   content: '是否删除数据?',
      // onOk: function() {
      //   that.loading = true
      //   deleteProdect(ids)
      //     .then(res => {
      //       if (res.success) {
      //         //重新计算分页问题
      //         that.reCalculatePage(that.selectedRowKeys.length)
      //         that.$message.success('删除成功')
      //         that.loadData()
      //         that.onClearSelected()
      //       } else {
      //         that.$message.warning(res.message)
      //       }
      //     })
      //     .finally(() => {
      //       that.loading = false
      //     })
      //   }
      // })
    }
  }
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
