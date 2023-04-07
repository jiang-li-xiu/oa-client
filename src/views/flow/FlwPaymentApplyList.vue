<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
     <!--  <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="24">
            <a-form-model-item label="申请人" prop="userId">
              <a-input v-model="param.userId" placeholder="请选择申请人" />
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <span style="float: left; overflow: hidden" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">搜索</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form> -->
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <!--<div class="table-operator">
      <a-button type="primary" icon="download" @click="handleExportXls('flw_payment_apply')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>-->
      <!-- 高级查询区域 -->
      <!--<j-super-query :fieldList="superFieldList" ref="superQueryModal" @handleSuperQuery="handleSuperQuery"></j-super-query>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>
    </div>-->

    <!-- table区域-begin -->
    <div>
      <!-- <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
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

    <flw-payment-apply-modal ref="modalForm" @ok="modalFormOk"></flw-payment-apply-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import FlwPaymentApplyModal from './modules/FlwPaymentApplyModal'
  import { flowStatus } from "@/plugins/utils/flowable";

  export default {
    name: 'FlwPaymentApplyList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      FlwPaymentApplyModal
    },
    data () {
      return {
        // 查询参数
        param: {},
        description: 'flw_payment_apply管理页面',
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
            title:'申请人',
            align:"center",
            dataIndex: 'userName'
          },
          {
            title:'关联项目',
            align:"center",
            dataIndex: 'project'
          },
          {
            title:'付款类型',
            align:"center",
            dataIndex: 'planFlag',
            customRender: (d) => {
              if (d === 1) {
                return <a-tag color="#f50">计划内</a-tag>
              } else if (d === 2) {
                return <a-tag color="cyan">计划外</a-tag>
              } else {
                return d
              }
            }
          },
          {
            title:'收款单位',
            align:"center",
            dataIndex: 'payee'
          },
          {
            title:'开户银行',
            align:"center",
            dataIndex: 'bankName'
          },
          {
            title:'银行账号',
            align:"center",
            dataIndex: 'bankAcount'
          },
          {
            title:'金额',
            align:"center",
            dataIndex: 'amount'
          },
          {
            title:'金额大写',
            align:"center",
            dataIndex: 'amountInWords'
          },
          {
            title:'付款方式',
            align:"center",
            dataIndex: 'paymentWay',
            customRender: (d) => {
              var way = ['电汇', '转账', '电汇', '现金', '其他']
              return way ? way[d-1] : ''
            }
          },
          {
            title:'付款类别',
            align:"center",
            dataIndex: 'paymentType',
            customRender: (d) => {
              var type = ['采购付款(首次)', '采购付款(非首次)', '月度工资发放', '经费支付', '往来款项', '招待费用(礼品费)', '支付保证金及借款', '其他']
              return type ? type[d-1] : ''
            }
          },
          {
            title:'付款说明',
            align:"center",
            dataIndex: 'explanation'
          },
          {
            title:'流程状态',
            align:"center",
            dataIndex: 'approvalStatus',
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
          list: "/scrm/flwPaymentApply/list",
          delete: "/scrm/flwPaymentApply/delete",
          deleteBatch: "/scrm/flwPaymentApply/deleteBatch",
          exportXlsUrl: "/scrm/flwPaymentApply/exportXls",
          importExcelUrl: "scrm/flwPaymentApply/importExcel",
          
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
        fieldList.push({type:'string',value:'userId',text:'申请人'})
        fieldList.push({type:'string',value:'projectId',text:'关联项目'})
        fieldList.push({type:'int',value:'planFlag',text:'付款类型'})
        fieldList.push({type:'string',value:'payee',text:'收款单位'})
        fieldList.push({type:'string',value:'bankName',text:'开户银行'})
        fieldList.push({type:'string',value:'bankAcount',text:'银行账号'})
        fieldList.push({type:'number',value:'amount',text:'金额'})
        fieldList.push({type:'string',value:'amountInWords',text:'金额大写'})
        fieldList.push({type:'int',value:'paymentWay',text:'付款方式'})
        fieldList.push({type:'int',value:'paymentType',text:'付款类别'})
        fieldList.push({type:'string',value:'explanation',text:'付款说明'})
        fieldList.push({type:'int',value:'approvalStatus',text:'审批状态'})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>