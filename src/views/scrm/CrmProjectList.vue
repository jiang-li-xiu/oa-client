<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-model-item label="项目名称" prop="projectName">
              <a-input v-model="param.projectName" placeholder="请输入项目名称" />
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="项目编号" prop="projectNo">
              <a-input v-model="param.projectNo" placeholder="请输入项目编号" />
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="客户名称" prop="customerName">
              <a-input v-model="param.customerName" placeholder="请输入客户名称" />
            </a-form-model-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-model-item label="客户联系方式" prop="phone">
                <a-input v-model="param.phone" placeholder="请输入客户联系方式" />
              </a-form-model-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-model-item label="负责人" prop="inCharge">
                <!-- <a-input v-model="param.inCharge" placeholder="请输入负责人" /> -->
                <a-select v-model="param.inCharge" placeholder="请选择负责人" show-search :filter-option="filterOption">
                  <a-select-option v-for="item in inChargeList" :key="item.id" :value="item.username">
                    {{ item.realname }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>

            <a-col :md="6" :sm="8">
              <a-form-model-item label="立项时间" prop="buildDate">
                <a-range-picker v-model="times" style="width: 100%" @change="handleRangePickerChange" />
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
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <!-- <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button> -->
      <!-- <a-button type="primary" icon="download" @click="handleExportXls('crm_project')">导出</a-button> -->
      <!-- <a-upload
        name="file"
        :showUploadList="false"
        :multiple="false"
        :headers="tokenHeader"
        :action="importExcelUrl"
        @change="handleImportExcel"
      >
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload> -->
      <!-- 高级查询区域 -->
      <!-- <j-super-query
        :fieldList="superFieldList"
        ref="superQueryModal"
        @handleSuperQuery="handleSuperQuery"
      ></j-super-query> -->
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete" />删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>
    </div>

    <!-- tabs区域 -->
    <a-tabs v-model="currentTab" default-active-key="1" @change="handleTabsChange">
      <a-tab-pane :key="null" tab="全部"></a-tab-pane>
      <a-tab-pane :key="4" tab="提交方案"></a-tab-pane>
      <a-tab-pane :key="5" tab="审批方案中"></a-tab-pane>
      <a-tab-pane :key="6" tab="提交利润"></a-tab-pane>
      <a-tab-pane :key="7" tab="审批利润"></a-tab-pane>
      <a-tab-pane :key="8" tab="完成"></a-tab-pane>
    </a-tabs>

    <!-- table区域-begin -->
    <div>
      <a-table
        ref="table"
        size="middle"
        :scroll="{ x: true }"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        class="j-table-force-nowrap"
        @change="handleTableChange"
      >
        <template slot="htmlSlot" slot-scope="text">
          <div v-html="text"></div>
        </template>
        <template slot="imgSlot" slot-scope="text, record">
          <span v-if="!text" style="font-size: 12px; font-style: italic">无图片</span>
          <img
            v-else
            :src="getImgView(text)"
            :preview="record.id"
            height="25px"
            alt=""
            style="max-width: 80px; font-size: 12px; font-style: italic"
          />
        </template>
        <template slot="fileSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px; font-style: italic">无文件</span>
          <a-button v-else :ghost="true" type="primary" icon="download" size="small" @click="downloadFile(text)">
            下载
          </a-button>
        </template>

        <span slot="action" slot-scope="text, record">
          <!-- <template v-if="record.schemeType == 1">
            <a @click="handleSubmit(record, 1)">提交方案</a>
            <a-divider type="vertical" />
          </template>
          <template v-else-if="record.schemeType == 2">
            <a @click="handleSubmit(record, 2)">提交产品并选型</a>
            <a-divider type="vertical" />
          </template>
          <template v-else>
            <a @click="handleSubmit(record, 1)">提交方案</a>
            <a-divider type="vertical" />
            <a @click="handleSubmit(record, 2)">提交产品并选型</a>
            <a-divider type="vertical" />
          </template> -->
          <a @click="handleSubmit(record, 1)">{{ record.flowStatus == 4 ? "提交方案" : "查看方案" }}</a>
          <a-divider type="vertical" />
          <!-- 	4-提交方案，5-审批方案中，6-提交利润，7-审批利润中，8-完成 -->
          <template v-if="[6].includes(record.flowStatus)">
            <a @click="handleSubmit(record, 3)">提交利润表</a>
            <a-divider type="vertical" />
          </template>
          <template v-if="[7, 8].includes(record.flowStatus)">
            <a @click="handleSubmit(record, 8)">查看利润表</a>
            <a-divider type="vertical" />
          </template>
          <a @click="handleEdit(record)">编辑</a>
          <!-- <a @click="handleSubmit(record, 6)">编辑</a> -->
          <a-divider type="vertical" />
          <a @click="handleDetail(record)">详情</a>
        </span>
      </a-table>
    </div>

    <crm-project-modal ref="modalForm" @ok="modalFormOk"></crm-project-modal>
    <!-- 详情 -->
    <crm-project-detail ref="detail" :is_show="true"></crm-project-detail>
    <!-- 编辑 -->
    <crm-project-edit ref="editForm" @refresh="loadData(1)"> </crm-project-edit>
    <!-- 方案并选型 -->
    <AddSchemeSelectDialog ref="schemeForm" @refresh="loadData(1)"></AddSchemeSelectDialog>
    <!-- 利润表 -->
    <ProfitDialog ref="profitForm" @refresh="loadData(1)"></ProfitDialog>
  </a-card>
</template>

<script>
import "@/assets/less/TableExpand.less"
import { mixinDevice } from "@/utils/mixin"
import { JeecgListMixin } from "@/mixins/JeecgListMixin"
import { TableListMixin } from "@/mixins/TableListMixin"
import CrmProjectModal from "./modules/CrmProjectModal"
import CrmProjectEdit from "./modules/CrmProjectEdit"
import CrmProjectDetail from "./modules/CrmProjectDetail"
import AddSchemeSelectDialog from "@/views/project-management/plan-management/plan-management/components/AddSchemeSelectDialog.vue" //添加方案并选型
import ProfitDialog from "@/views/project-management/foreign-price-management/project-profit/components/AddAndDetailDialog.vue" //利润表
import { simpleDebounce } from "@/utils/util"
import { getDictText } from "@/api/api"
import { flowStatus } from "@/plugins/utils/flowable"
import { getAction } from "@/api/manage"
export default {
  name: "CrmProjectList",
  mixins: [JeecgListMixin, mixinDevice, TableListMixin],
  components: {
    CrmProjectModal,
    CrmProjectDetail,
    CrmProjectEdit,
    AddSchemeSelectDialog,
    ProfitDialog,
  },
  data() {
    return {
      description: "crm_project管理页面",
      // 表头
      columns: [
        {
          title: "序号",
          dataIndex: "",
          key: "rowIndex",
          width: 60,
          align: "center",
          ellipsis: true,
          customRender: function (t, r, index) {
            return parseInt(index) + 1
          },
        },
        {
          title: "项目名称",
          align: "center",
          ellipsis: true,
          width: 150,
          dataIndex: "projectName",
        },
        {
          title: "项目状态",
          align: "center",
          ellipsis: true,
          width: 150,
          dataIndex: "flowStatus",
          customRender: (value) => getDictText("process_status", value),
        },
        {
          title: "项目类型",
          align: "center",
          ellipsis: true,
          width: 150,
          dataIndex: "projectType",
          // 1-工程项目，2-渠道项目，3-产品销售，4-软件销售，5-软件定制
          customRender(text) {
            if (text == 1) {
              return "工程项目"
            } else if (text == 2) {
              return "渠道项目"
            } else if (text == 3) {
              return "产品销售"
            } else if (text == 4) {
              return "软件销售"
            } else if (text == 5) {
              return "软件定制"
            } else {
              return ""
            }
          },
        },
        {
          title: "项目编号",
          align: "center",
          ellipsis: true,
          width: 150,
          dataIndex: "projectNo",
        },
        {
          title: "客户名称",
          align: "center",
          ellipsis: true,
          width: 150,
          dataIndex: "customName",
        },
        {
          title: "客户联系人",
          align: "center",
          ellipsis: true,
          width: 150,
          dataIndex: "liaison",
        },
        {
          title: "客户联系方式",
          align: "center",
          ellipsis: true,
          width: 150,
          dataIndex: "phone",
        },
        {
          title: "负责人",
          align: "center",
          ellipsis: true,
          width: 150,
          dataIndex: "inCharge",
        },
        {
          title: "立项时间",
          align: "center",
          ellipsis: true,
          width: 150,
          dataIndex: "buildDate",
          customRender: function (text) {
            return !text ? "" : text.length > 10 ? text.substr(0, 10) : text
          },
        },
        {
          title: "项目地点",
          align: "center",
          ellipsis: true,
          width: 150,
          dataIndex: "projectAddr",
        },
        {
          title: "项目总额",
          align: "center",
          ellipsis: true,
          width: 150,
          dataIndex: "amount",
        },
        {
          title: "项目概算",
          align: "center",
          ellipsis: true,
          width: 150,
          dataIndex: "budget",
        },
        // {
        //   title: '审批状态',
        //   align: 'center',
        //   dataIndex: 'businessStatus',
        //   width: 100,
        //   ellipsis: true,
        //   width: 150,
        //   customRender: (d) => {
        //     return flowStatus(d)
        //   },
        // },
        {
          title: "创建人",
          align: "center",
          ellipsis: true,
          width: 150,
          dataIndex: "createBy",
        },
        {
          title: "操作",
          dataIndex: "action",
          align: "center",
          fixed: "right",
          width: 370,
          scopedSlots: { customRender: "action" },
        },
      ],
      url: {
        list: "/scrm/crmProject/list2",
        delete: "/scrm/crmProject/delete",
        deleteBatch: "/scrm/crmProject/deleteBatch",
        exportXlsUrl: "/scrm/crmProject/exportXls",
        importExcelUrl: "scrm/crmProject/importExcel",
      },
      dictOptions: {},
      superFieldList: [],
      param: {},
      times: [],
      inChargeList: [],
    }
  },
  created() {
    this.getSuperFieldList()
    this.handleTabsChange(null)
  },
  mounted() {
    this.getinChargeList()
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG["domianURL"]}/${this.url.importExcelUrl}`
    },
  },
  methods: {
    initDictConfig() {},
    getSuperFieldList() {
      let fieldList = []
      fieldList.push({ type: "string", value: "projectName", text: "项目名称" })
      fieldList.push({ type: "string", value: "projectNo", text: "项目编号" })
      fieldList.push({ type: "string", value: "customer", text: "客户名称" })
      fieldList.push({ type: "string", value: "liaison", text: "客户联系人" })
      fieldList.push({ type: "string", value: "phone", text: "客户联系方式" })
      fieldList.push({ type: "string", value: "inCharge", text: "负责人" })
      fieldList.push({ type: "date", value: "signingDate", text: "签订合同时间" })
      fieldList.push({ type: "date", value: "buildDate", text: "立项时间" })
      fieldList.push({ type: "string", value: "projectAddr", text: "项目地点" })
      fieldList.push({ type: "string", value: "status", text: "项目状态" })
      fieldList.push({ type: "int", value: "approvalStatus", text: "审批状态(1-审批未通过,2-审批通过)" })
      fieldList.push({ type: "number", value: "amount", text: "项目总额" })
      fieldList.push({ type: "number", value: "budget", text: "项目概算" })
      fieldList.push({ type: "string", value: "outlines", text: "概要说明" })
      fieldList.push({ type: "int", value: "delFlag", text: "删除标记(1-已删除，0-正常)" })
      this.superFieldList = fieldList
    },
    handleSubmit(record, type) {
      record = JSON.parse(JSON.stringify(record))
      console.log("record=============", record)
      if (type == 1) {
        // 提交方案 提交产品并选型 提交利润表
        this.$refs.schemeForm.add(1, record)

        this.$refs.schemeForm.title = "添加方案"
      } else if (type == 2) {
        this.$refs.schemeForm.addPlan(2, record)
        this.$refs.schemeForm.title = "设计并选型"
      } else if (type == 3) {
        this.$refs.profitForm.add(record)
      } else if (type == 8) {
        //查看利润表
        this.$refs.profitForm.detail(record)
        this.$refs.profitForm.title = "详情"
      } else if (type == 6) {
        this.$refs.profitForm.edit(record, type)
        this.$refs.profitForm.title = "编辑"
      }
    },
    handleDetail: function (record) {
      console.log("record=============", record)
      record = JSON.parse(JSON.stringify(record))
      this.$refs.detail.open(record)
    },
    handleEdit: function (record) {
      record = JSON.parse(JSON.stringify(record))
      this.inChargeList.forEach((item) => {
        if (item.realname == record.inCharge) {
          record.inCharge = item.username
          record.realName = item.realname
        }
      })
      console.log("编辑传进去的数据0", record)

      this.$refs.editForm.open(record)
      // this.$refs.modalHandle.title = "流程信息";
      // this.$refs.modalHandle.disableSubmit = false;
      // this.$refs.modalHandle.open(record, "表单信息", path, "view");
    },
    handleTabsChange(key) {
      this.currentTab = key
      if (key == null) {
        this.url.list = `/scrm/crmProject/list2`
        this.loadData(1)
      } else {
        this.url.list = `/scrm/crmProject/list2?flowStatus=${key}`
        this.loadData(1)
      }
    },
    // 负责人列表
    getinChargeList() {
      getAction("/sys/user/queryUserComponentData").then((res) => {
        if (res.success) {
          this.inChargeList = res.result.records
          // this.ipagination.total = res.result.total
        }
      })
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    // 处理搜索时间
    handleRangePickerChange(dates, dateStrings) {
      this.param.generateTime_begin = dateStrings[0]
      this.param.generateTime_end = dateStrings[1]
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
<style scoped>
@import "~@assets/less/common.less";
</style>
