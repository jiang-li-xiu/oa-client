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
    <div class="table-operator">
      <!-- 高级查询区域 -->
      <!-- <j-super-query :fieldList="superFieldList" ref="superQueryModal" @handleSuperQuery="handleSuperQuery"></j-super-query> -->
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
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
          <a @click="handleDetail(record)">详情</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" :style="{ color: 'red' }" @confirm="() => handleDelete(record.id)">
            <a>删除</a>
          </a-popconfirm>
        </span>

      </a-table>
    </div>

    <flw-expense-budget-modal ref="modalForm" @ok="modalFormOk"></flw-expense-budget-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import FlwExpenseBudgetModal from './modules/FlwExpenseBudgetModal'

  export default {
    name: 'FlwExpenseBudgetList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      FlwExpenseBudgetModal
    },
    data () {
      return {
        description: 'flw_expense_budget管理页面',
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
            title:'部门',
            align:"center",
            dataIndex: 'departName',
            ellipsis: true
          },
          {
            title:'申请人',
            align:"center",
            dataIndex: 'createBy',
            ellipsis: true
          },
          {
            title:'周期',
            align:"center",
            dataIndex: 'cycle',
            ellipsis: true
          },
          {
            title:'开始日期',
            align:"center",
            dataIndex: 'timeStart',
            ellipsis: true,
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            }
          },
          {
            title:'结束日期',
            align:"center",
            dataIndex: 'timeEnd',
            ellipsis: true,
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            }
          },
          {
            title:'申请日期',
            align:"center",
            dataIndex: 'applyDate',
            ellipsis: true,
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            }
          },
          {
            title:'总金额',
            align:"center",
            dataIndex: 'amount'
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
          list: "/scrm/flwExpenseBudget/list",
          delete: "/scrm/flwExpenseBudget/delete",
          deleteBatch: "/scrm/flwExpenseBudget/deleteBatch",
          exportXlsUrl: "/scrm/flwExpenseBudget/exportXls",
          importExcelUrl: "scrm/flwExpenseBudget/importExcel",
          
        },
        dictOptions:{},
        superFieldList:[],
        // dataSource:[{departName:'1'}]
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
        fieldList.push({type:'string',value:'depart',text:'部门'})
        fieldList.push({type:'string',value:'userId',text:'申请人'})
        fieldList.push({type:'int',value:'timeType',text:'时间类型'})
        fieldList.push({type:'date',value:'timeStart',text:'开始日期'})
        fieldList.push({type:'date',value:'timeEnd',text:'结束日期'})
        fieldList.push({type:'date',value:'applyDate',text:'申请日期'})
        fieldList.push({type:'string',value:'costs',text:'费用详情'})
        fieldList.push({type:'string',value:'creatBy',text:'创建人'})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>