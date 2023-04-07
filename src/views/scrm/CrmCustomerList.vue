<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-model-item label="客户名称" prop="customerName">
              <a-input v-model="param.customName" placeholder="请输入客户名称" />
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="客户编号" prop="customerNo">
              <a-input v-model="param.customNo" placeholder="请输入客户编号" />
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="行业" prop="industry">
              <a-select
                v-model="param.industry"
                show-search
                placeholder="请选择"
                :options="options"
                :filter-option="true"
              ></a-select>
            </a-form-model-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-model-item label="客户电话" prop="phone">
                <a-input v-model="param.phone" placeholder="请输入客户电话" />
              </a-form-model-item>
            </a-col>
          </template>

          <a-col :md="6" :sm="8">
            <span style="float: left; overflow: hidden" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">搜索</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
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
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('客户信息表')">导出</a-button>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

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
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
          <a-dropdown>
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
          </a-dropdown>
        </span>

      </a-table>
    </div>

    <crm-customer-modal ref="modalForm" @ok="modalFormOk"></crm-customer-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import CrmCustomerModal from './modules/CrmCustomerModal'
  import { simpleDebounce } from '@/utils/util'

  export default {
    name: 'CrmCustomerList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      CrmCustomerModal
    },
    data () {
      return {
        description: 'crm_customer管理页面',
        param:{},
        superQueryParams: [],
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
            title:'客户名称',
            align:"center",
            dataIndex: 'customName',
            with:200,
            ellipsis: true
          },
          {
            title:'客户编号',
            align:"center",
            dataIndex: 'customNo',
            with:200,
            ellipsis: true
          },
          {
            title:'地区',
            align:"center",
            dataIndex: 'city',
            with:150,
            ellipsis: true
          },
          {
            title:'公司地址',
            align:"center",
            dataIndex: 'addr',
            with:200,
            ellipsis: true
          },
          {
            title:'行业',
            align:"center",
            dataIndex: 'industry',
            with:150,
            ellipsis: true
          },
          {
            title:'客户电话',
            align:"center",
            dataIndex: 'phone',
            with:200,
            ellipsis: true
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
        options:[
          {value:'金融', label:'金融'},
          {value:'电信', label:'电信'},
          {value:'教育', label:'教育'},
          {value:'高科技', label:'高科技'},
          {value:'政府', label:'政府'},
          {value:'制造业', label:'制造业'},
          {value:'服务', label:'服务'},
          {value:'能源', label:'能源'},
          {value:'零售', label:'零售'},
          {value:'媒体', label:'媒体'},
          {value:'娱乐', label:'娱乐'},
          {value:'咨询', label:'咨询'},
          {value:'非盈利事业', label:'非盈利事业'},
          {value:'公用事业', label:'公用事业'},
          {value:'其他', label:'其他'},
        ],
        url: {
          list: "/scrm/crmCustomer/list",
          delete: "/scrm/crmCustomer/delete",
          deleteBatch: "/scrm/crmCustomer/deleteBatch",
          exportXlsUrl: "/scrm/crmCustomer/exportXls",
          importExcelUrl: "scrm/crmCustomer/importExcel",
          
        },
        times: [],
        dictOptions:{},
        superFieldList:[],
      }
    },
    created() {
      
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      },
    },
    methods: {
      searchQuery(){
        let parms = [
          {"rule":"like","type":"string", "extendOption":["Y","N"], "val":this.param.customName,"field":"customName"},
          {"rule":"like","type":"string", "extendOption":["Y","N"], "val":this.param.customNo,"field":"customNo"},
          {"rule":"eq","type":"string", "extendOption":["Y","N"], "val":this.param.industry,"field":"industry"},
          {"rule":"like","type":"string", "extendOption":["Y","N"], "val":this.param.phone,"field":"phone"}
        ]
        this.superQueryParams = JSON.stringify(parms);
        this.times = []
        simpleDebounce(this.loadData, 0)(1)
      },
      // 检索：重置按钮
      searchReset() {
        for (let key in this.param) {
          if (key != 'ids') {
            this.param[key] = null
          }
        }
        this.superQueryParams = JSON.stringify([]);
        this.times = []
        simpleDebounce(this.loadData, 0)(1)
      },
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>