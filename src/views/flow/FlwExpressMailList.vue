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
      <a-button type="primary" icon="download" @click="handleExportXls('快递邮件申请')">导出</a-button>
      <!-- 高级查询区域 -->
      <j-super-query :fieldList="superFieldList" ref="superQueryModal" @handleSuperQuery="handleSuperQuery"></j-super-query>
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
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
            <a>删除</a>
          </a-popconfirm>
        </span>

      </a-table>
    </div>

    <flw-express-mail-modal ref="modalForm" @ok="modalFormOk"></flw-express-mail-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import FlwExpressMailModal from './modules/FlwExpressMailModal'

  export default {
    name: 'FlwExpressMailList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      FlwExpressMailModal
    },
    data () {
      return {
        description: '快递邮件申请管理页面',
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
            title:'部门名称',
            align:"center",
            dataIndex: 'departName'
          },
          {
            title:'申请人',
            align:"center",
            dataIndex: 'userName'
          },
          {
            title:'申请时间',
            align:"center",
            dataIndex: 'applyDate',
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            }
          },
          {
            title:'是否紧急',
            align:"center",
            dataIndex: 'urgent',
            customRender:function (val) {
              let urgent = {1:'一般', 2:'紧急'}
              return urgent[val]
            }
          },
          {
            title:'到货时间(天)',
            align:"center",
            dataIndex: 'arrivalDays'
          },
          {
            title:'是否保价',
            align:"center",
            dataIndex: 'insuredMail',
            customRender:function (val) {
              let urgent = {1:'否', 2:'是'}
              return urgent[val]
            }
          },
          {
            title:'保价金额',
            align:"center",
            dataIndex: 'insuredValue'
          },
          {
            title:'邮寄物品',
            align:"center",
            dataIndex: 'mailItems',
            width: 200,
            ellipsis: true,
          },
          {
            title:'预估运费(元)',
            align:"center",
            dataIndex: 'haulage'
          },
          {
            title:'费用性质',
            align:"center",
            dataIndex: 'costType',
            customRender:function (val) {
              let urgent = {1:'现结寄件', 2:'外地寄件', 3:'到付寄件'}
              return urgent[val]
            }
          },
          {
            title:'到付原因',
            align:"center",
            dataIndex: 'arrivedPayment'
          },
          {
            title:'快递',
            align:"center",
            dataIndex: 'express'
          },
          {
            title:'项目名称',
            align:"center",
            dataIndex: 'projectName'
          },
          {
            title:'收件信息',
            align:"center",
            dataIndex: 'recipient',
            width: 200,
            ellipsis: true,
          },
          {
            title:'快递公司',
            align:"center",
            dataIndex: 'actualExpress'
          },
          {
            title:'快递单号',
            align:"center",
            dataIndex: 'trackingNumber'
          },
          {
            title:'快递金额',
            align:"center",
            dataIndex: 'amount'
          },
          {
            title:'快递日期',
            align:"center",
            dataIndex: 'deliveryDate',
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            }
          },
          {
            title:'付款人手机号',
            align:"center",
            dataIndex: 'payerPhone'
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
          list: "/flw/flwExpressMail/list",
          delete: "/flw/flwExpressMail/delete",
          deleteBatch: "/flw/flwExpressMail/deleteBatch",
          exportXlsUrl: "/flw/flwExpressMail/exportXls",
          importExcelUrl: "flw/flwExpressMail/importExcel",
          
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
        fieldList.push({type:'string',value:'depart',text:'部门主键'})
        fieldList.push({type:'string',value:'departName',text:'部门名称'})
        fieldList.push({type:'string',value:'userId',text:'申请人主键'})
        fieldList.push({type:'string',value:'userName',text:'申请人'})
        fieldList.push({type:'date',value:'applyDate',text:'申请时间'})
        fieldList.push({type:'int',value:'urgent',text:'是否紧急（1-一般，2-紧急）'})
        fieldList.push({type:'int',value:'arrivalDays',text:'到货时间（单位：天）'})
        fieldList.push({type:'int',value:'insuredMail',text:'是否报价（1-保价，2不报警）'})
        fieldList.push({type:'number',value:'insuredValue',text:'报价金额'})
        fieldList.push({type:'string',value:'mailItems',text:'邮寄物品'})
        fieldList.push({type:'number',value:'haulage',text:'预估运费'})
        fieldList.push({type:'int',value:'costType',text:'费用性子（1-现结，2-外地，3-到付）'})
        fieldList.push({type:'string',value:'arrivedPayment',text:'到付原因'})
        fieldList.push({type:'string',value:'express',text:'快递'})
        fieldList.push({type:'string',value:'projectId',text:'项目主键'})
        fieldList.push({type:'string',value:'projectName',text:'项目名称'})
        fieldList.push({type:'string',value:'recipient',text:'收件信息（收件人、手机号及地址）'})
        fieldList.push({type:'string',value:'actualExpress',text:'快递公司'})
        fieldList.push({type:'string',value:'trackingNumber',text:'快递单号'})
        fieldList.push({type:'number',value:'amount',text:'快递金额'})
        fieldList.push({type:'date',value:'deliveryDate',text:'快递日期'})
        fieldList.push({type:'string',value:'payerPhone',text:'付款人手机号'})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>