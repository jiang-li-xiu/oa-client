<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <!-- <div class="table-operator">
      <a-button type="primary" icon="download" @click="handleExportXls('flw_expense_reimbursement')">导出</a-button> -->
      <!-- 高级查询区域 -->
   <!--    <j-super-query :fieldList="superFieldList" ref="superQueryModal" @handleSuperQuery="handleSuperQuery"></j-super-query>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>
    </div> -->

    <!-- table区域-begin -->
    <div>
    <!--<div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div> -->

      <a-table
        ref="table"
        size="middle"
        :scroll="{x:true}"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        class="j-table-force-nowrap"
        @change="handleTableChange">

        <template slot="htmlSlot" slot-scope="text">
          <div v-html="text"></div>
        </template>
        <template slot="imgSlot" slot-scope="text,record">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无图片</span>
          <img v-else :src="getImgView(text)" :preview="record.id" height="25px" alt="" style="max-width:80px;font-size: 12px;font-style: italic;"/>
        </template>
        <template slot="fileSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无文件</span>
          <a-button
            v-else
            :ghost="true"
            type="primary"
            icon="download"
            size="small"
            @click="downloadFile(text)">
            下载
          </a-button>
        </template>

        <span slot="action" slot-scope="text, record">
          <!-- <a @click="handleEdit(record)">编辑</a> -->
          <a @click="handleDetail(record)">详情</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" :style="{ color: 'red' }" @confirm="() => handleDelete(record.id)">
            <a>删除</a>
          </a-popconfirm>
          <!-- <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="handleDetail(record)">详情</a>
              </a-menu-item>
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown> -->
        </span>

      </a-table>
    </div>

    <flw-expense-reimbursement-modal ref="modalForm" @ok="modalFormOk"></flw-expense-reimbursement-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import FlwExpenseReimbursementModal from './modules/FlwExpenseReimbursementModal'
  import { flowStatus } from "@/plugins/utils/flowable";

  export default {
    name: 'FlwExpenseReimbursementList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      FlwExpenseReimbursementModal
    },
    data () {
      return {
        description: 'flw_expense_reimbursement管理页面',
        // 表头
        columns: [
          {
            title: '序号',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },
          {
            title:'单号',
            align:"center",
            dataIndex: 'businessNo',
            width:125,
            ellipsis: true
          },
          {
            title:'申请人',
            align:"center",
            dataIndex: 'userName',
            width:125,
            ellipsis: true
          },
          {
            title:'填报日期',
            align:"center",
            dataIndex: 'fillingDate'
          },
          {
            title:'项目名称',
            align:"center",
            dataIndex: 'project',
            width:150,
            ellipsis: true
          },
          {
            title:'报销金额',
            align:"center",
            dataIndex: 'amount',
            ellipsis: true
          },
          {
            title:'金额大写',
            align:"center",
            dataIndex: 'amountInWords',
            ellipsis: true
          },
          {
            title:'借款金额',
            align:"center",
            dataIndex: 'loanAmount',
            ellipsis: true
          },
          {
            title:'退款金额',
            align:"center",
            dataIndex: 'returnAmount',
            ellipsis: true
          },
          {
            title:'流程状态',
            align:"center",
            dataIndex: 'status',
            customRender: (d) => {
              return flowStatus(d)
            }
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            fixed:"right",
            width:147,
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: "/scrm/flwExpenseReimbursement/list",
          delete: "/scrm/flwExpenseReimbursement/delete",
          deleteBatch: "/scrm/flwExpenseReimbursement/deleteBatch",
          exportXlsUrl: "/scrm/flwExpenseReimbursement/exportXls",
          importExcelUrl: "scrm/flwExpenseReimbursement/importExcel",
          
        },
        dictOptions:{},
        superFieldList:[],
      }
    },
    created() {
    this.getSuperFieldList();
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      },
    },
    methods: {
      initDictConfig(){
      },
      getSuperFieldList(){
        let fieldList=[];
        fieldList.push({type:'string',value:'businessNo',text:'单号'})
        fieldList.push({type:'string',value:'userId',text:'申请人'})
        fieldList.push({type:'date',value:'fillingDate',text:'填报日期'})
        fieldList.push({type:'string',value:'itemName',text:'项目名称'})
        fieldList.push({type:'string',value:'feeDetails',text:'费用明细'})
        fieldList.push({type:'number',value:'amount',text:'报销金额'})
        fieldList.push({type:'string',value:'amountInWords',text:'金额大写'})
        fieldList.push({type:'number',value:'loanAmount',text:'借款金额'})
        fieldList.push({type:'number',value:'returnAmount',text:'退款金额'})
        fieldList.push({type:'int',value:'delFlag',text:'删除标记(1-已删除，0-正常)'})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>