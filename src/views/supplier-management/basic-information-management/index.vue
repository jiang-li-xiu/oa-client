<!--
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-08-23 17:32:23
 * @LastEditors: JLX
 * @LastEditTime: 2022-08-31 14:33:13
-->
<template>
  <a-card :bordered="false" class="assembly-container-col">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form-model ref="ruleForm" v-model="param" layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-model-item label="企业名称" prop="supplierName">
              <j-input v-model="param.supplierName" placeholder="请输入企业名称" />
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="类型" prop="supplierType">
              <!-- <a-select v-model="param.supplierType" placeholder="请选择类型" allowClear>
                <a-select-option value="1">主材</a-select-option>
                <a-select-option value="2">辅材</a-select-option>
                <a-select-option value="3">耗材</a-select-option>
              </a-select> -->
              <j-dict-select-tag v-model="param.supplierType" dictCode="industry_type" placeholder="请选择类型" />
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="所属行业" prop="businessType">
              <j-dict-select-tag
                v-model="param.businessType"
                dictCode="subordinate_industry"
                placeholder="请选择所属行业"
              />
            </a-form-model-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <span style="float: left; overflow: hidden" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">搜索</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form-model>

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
              <!-- <template v-if="row.status !== 1">
                <a-divider type="vertical" />
                <a @click="handleApproval(row)">审核</a>
              </template> -->
              <a-divider type="vertical" />
              <a @click="handleProduct(row)">录入产品</a>
            </a-space>
          </template>
        </a-table>
      </div>
    </div>

    <!-- 编辑详情弹窗 -->
    <add-and-edit-dialog ref="modalForm" @refresh="loadData(1)"></add-and-edit-dialog>
  </a-card>
</template>

<script>
// 组件
import AddAndEditDialog from './components/AddAndEditDialog'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin'
// 字典
import { getDictText } from '@/api/api'
export default {
  mixins: [TableListMixin],
  components: { AddAndEditDialog },
  data() {
    return {
      // 查询参数
      param: {},
      // 表格配置
      columns: [
        {
          title: '企业名称',
          dataIndex: 'supplierName',
          align: 'center',
          width: '16%'
        },
        {
          title: '所属行业',
          dataIndex: 'businessType',
          align: 'center',
          width: '16%',
          customRender: value => getDictText('subordinate_industry', value)
        },
        {
          title: '企业统一编码',
          dataIndex: 'creditCod',
          align: 'center',
          width: '16%'
        },
        {
          title: '类型',
          dataIndex: 'supplierType',
          align: 'center',
          width: '16%',
          customRender(text) {
            return text == 1 ? '主材' : text == 2 ? '辅材' : '耗材'
          }
        },
        // {
        //   title: '服务领域',
        //   dataIndex: 'servicesRange',
        //   align: 'center',
        //   width: '16%',
        //   customRender(text) {
        //     let data = text !== null ? text.split(',') : null
        //     console.log(data)
        //     for (let value in data) {
        //       console.log(data)
        //       return getDictText('service_sector', data[value])
        //     }
        //   }
        //   // scopedSlots: { customRender: 'servicesRange' }
        // },
        {
          title: '状态',
          dataIndex: 'status',
          align: 'center',
          width: '16%',
          customRender(text) {
            return text == 1 ? '已审批' : '待审批'
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          fixed: 'right',
          width: 350,
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 请求地址
      url: {
        list: '/oa-base/supplier/list'
      }
    }
  },

  methods: {
    // 录入产品 跳转到产品管理的新增页面
    handleProduct(row) {
      // console.log(row)
      this.$router.push({
        path: '/supplier-management/product-management',
        query: {
          supplierName: row.supplierName,
          id: row.id,
          open: true
        }
      })
      this.$bus.$emit('openProduct', row)
    },

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
