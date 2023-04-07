<!--
 * @Descripttion: 报价单
 * @Author: JLX
 * @Date: 2022-09-19 17:17:44
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2023-03-28 11:05:22
-->
<template>
  <a-card :bordered="false" class="assembly-container-col">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form-model ref="ruleForm" v-model="param" layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-model-item label="项目名称" prop="projectName">
              <j-input v-model="param.projectName" placeholder="请输入项目名称" />
            </a-form-model-item>
          </a-col>
          <!-- <a-col :md="6" :sm="8">
            <a-form-model-item label="方案名称" prop="name">
              <a-input v-model="param.name" placeholder="请输入方案名称" />
            </a-form-model-item>
          </a-col> -->
          <a-col :md="6" :sm="8">
            <a-form-model-item label="客户名称" prop="customerName">
              <j-input v-model="param.customerName" placeholder="请输入客户名称" />
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="客户联系方式" prop="phone">
              <j-input v-model="param.phone" placeholder="请输入客户联系方式" />
            </a-form-model-item>
          </a-col>

          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-model-item label="报价时间" prop="profitsTime">
                <a-range-picker v-model="times" style="width: 100%" @change="handleRangePickerChange" />
              </a-form-model-item>
            </a-col>

            <a-col :md="6" :sm="8">
              <a-form-model-item label="报价人" prop="profitsPeopleName">
                <j-input v-model="param.profitsPeopleName" placeholder="请输入报价人" />
              </a-form-model-item>
            </a-col>
          </template>

          <a-col :md="6" :sm="8">
            <span style="float: left; overflow: hidden" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">搜索</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? "收起" : "展开" }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form-model>

      <!-- 按钮区域 -->
      <div class="table-operator">
        <!-- <a-button type="primary" @click="handleAdd" icon="plus">新增</a-button>
        <a-button icon="delete" type="danger" @click="batchPathDel()" :disabled="selectedRowKeys.length === 0"
          >删除
        </a-button> -->
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
          @change="handleTableChange"
          :loading="loading"
        >
          <template #action="row">
            <a-space :size="12">
              <!-- <a href="javascript:;" @click="handleEdit(row)">编辑</a>
              <a-divider type="vertical" /> -->
              <a href="javascript:;" @click="handleDetail(row)">详情</a>
            </a-space>
          </template>
        </a-table>
      </div>
    </div>

    <!-- 详情弹窗 -->
    <detail-dialog ref="modalForm" @refresh="loadData(1)" :is_ApprovalInfo="true"></detail-dialog>
  </a-card>
</template>

<script>
// 组件
import detailDialog from "../project-profit/components/AddAndDetailDialog.vue"
// 混入
import { TableListMixin } from "@/mixins/TableListMixin"
// 字典
import { getDictText } from "@/api/api.js"
import { simpleDebounce } from "@/utils/util"
export default {
  mixins: [TableListMixin],
  components: { detailDialog },
  data() {
    return {
      // 查询参数
      param: {},
      // 表格配置
      columns: [
        {
          title: "项目名称",
          dataIndex: "projectName",
          align: "center",
          width: 250,
          ellipsis: true,
        },
        {
          title: "方案名称",
          dataIndex: "name",
          align: "center",
          width: 200,
          ellipsis: true,
        },
        {
          title: "方案类型",
          dataIndex: "type",
          align: "center",
          width: 80,
          ellipsis: true,
          customRender(text) {
            return text == 1 ? "工程" : text == 2 ? "软件" : ""
          },
        },
        // {
        //   title: '方案名称',
        //   dataIndex: 'name',
        //   align: 'center',
        //   width: 290,
        //   ellipsis: true,
        // },
        {
          title: "客户名称",
          dataIndex: "customerName",
          align: "center",
          width: 150,
          ellipsis: true,
        },
        {
          title: "客户联系方式",
          dataIndex: "phone",
          align: "center",
          width: 150,
          ellipsis: true,
        },
        {
          title: "报价人",
          dataIndex: "profitsPeopleName",
          align: "center",
          width: 150,
          ellipsis: true,
        },
        {
          title: "报价部门",
          dataIndex: "profitsPeopleDept",
          align: "center",
          width: 150,
          ellipsis: true,
        },
        {
          title: "报价时间",
          dataIndex: "profitsTime",
          align: "center",
          width: 150,
          ellipsis: true,
        },
        {
          title: "总金额",
          dataIndex: "totalSell",
          align: "center",
          width: 150,
          ellipsis: true,
        },
        // {
        //   title: "状态",
        //   dataIndex: "status",
        //   align: "center",
        //   width: 290,
        //   ellipsis: true,
        //   // 1-待审核，2审核通过，3-审核不通过
        //   customRender(text) {
        //     return text == 1 ? "待审核" : text == 2 ? "审核通过" : "审核不通过"
        //   },
        // },
        {
          title: "操作",
          key: "action",
          align: "center",
          // fixed: "right",
          width: 200,
          scopedSlots: { customRender: "action" },
        },
      ],
      // 请求地址
      url: {
        list: "/prod/quoteInfo/list", // 列表
        deleteBatch: "/jeecg-supplier/prodQuote", //删除
      },
      // 时间
      times: [],
      dataSource: [{ status: 1 }],
    }
  },

  methods: {
    handleDetail(row) {
      this.$refs.modalForm.quotationDetail(row)
    },

    // 处理搜索时间
    handleRangePickerChange(dates, dateStrings) {
      this.param.profitsTime_begin = dateStrings[0]
      this.param.profitsTime_end = dateStrings[1]
    },
    // 检索：重置按钮
    searchReset() {
      for (let key in this.param) {
        if (key != "ids") {
          this.param[key] = null
        }
      }
      this.times = []
      simpleDebounce(this.loadData, 0)(1)
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
