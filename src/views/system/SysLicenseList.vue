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
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <!-- 高级查询区域 -->
      <j-super-query :fieldList="superFieldList" ref="superQueryModal" @handleSuperQuery="handleSuperQuery"></j-super-query>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>
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
          <a @click="handleDownload(record)">下载证书</a>

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

    <sys-license-modal ref="modalForm" @ok="modalFormOk"></sys-license-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import SysLicenseModal from './modules/SysLicenseModal'
  import {httpDownloadAction,downFile} from '@/api/manage'
  import { axios } from '@/utils/request'

  export default {
    name: 'SysLicenseList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      SysLicenseModal
    },
    data () {
      return {
        description: 'sys_license管理页面',
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
            title:'项目名称',
            width:150,
            align:"center",
            dataIndex: 'subject',
            ellipsis: true
          },
          {
            title:'证书描述',
            width:150,
            align:"center",
            dataIndex: 'description',
            ellipsis: true
          },
          {
            title:'生效时间',
            width:150,
            align:"center",
            dataIndex: 'issuedTime',
            ellipsis: true
          },
          {
            title:'过期时间',
            width:150,
            align:"center",
            dataIndex: 'expireTime',
            ellipsis: true
          },
          {
            title:'私钥',
            width:150,
            align:"center",
            dataIndex: 'privateKey',
            ellipsis: true
          },
          {
            title:'公钥',
            width:150,
            align:"center",
            dataIndex: 'publicKey',
            ellipsis: true
          },
          {
            title:'检查ip',
            width:100,
            align:"center",
            dataIndex: 'checkIp',
            ellipsis: true,
            customRender: (d) => {
              if (d) {
                return '是'
              } else {
                return '否'
              }
            }
          },
          {
            title:'ip地址',
            width:150,
            align:"center",
            dataIndex: 'ipAddr',
            ellipsis: true
          },
          {
            title:'检查mac',
            width:100,
            align:"center",
            dataIndex: 'checkMac',
            ellipsis: true,
            customRender: (d) => {
              if (d) {
                return '是'
              } else {
                return '否'
              }
            }
          },
          {
            title:'mac地址',
            width:150,
            align:"center",
            dataIndex: 'macAddr',
            ellipsis: true
          },
          {
            title:'检查cpu',
            width:100,
            align:"center",
            dataIndex: 'checkCpu',
            ellipsis: true,
            customRender: (d) => {
              if (d) {
                return '是'
              } else {
                return '否'
              }
            }
          },
          {
            title:'cpu序列号',
            width:150,
            align:"center",
            dataIndex: 'cpuSerial',
            ellipsis: true
          },
          {
            title:'检查主板',
            width:100,
            align:"center",
            dataIndex: 'checkMainBoard',
            ellipsis: true,
            customRender: (d) => {
              if (d) {
                return '是'
              } else {
                return '否'
              }
            }
          },
          {
            title:'主板序列号',
            width:150,
            align:"center",
            dataIndex: 'mainBoardSerial',
            ellipsis: true
          },
          {
            title:'试用或正式',
            align:"center",
            dataIndex: 'trialOrFormal',
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
        url: {
          list: "/sys/sysLicense/list",
          delete: "/sys/sysLicense/delete",
          deleteBatch: "/sys/sysLicense/deleteBatch",
          exportXlsUrl: "/sys/sysLicense/exportXls",
          importExcelUrl: "sys/sysLicense/importExcel",
          downloadUrl: '/sys/sysLicense/downLoadLicese',
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
        fieldList.push({type:'string',value:'privateKey',text:'私钥'})
        fieldList.push({type:'string',value:'publicKey',text:'公钥'})
        fieldList.push({type:'string',value:'checkIp',text:'检查ip'})
        fieldList.push({type:'string',value:'ipAddr',text:'ip地址'})
        fieldList.push({type:'string',value:'checkMac',text:'检查mac'})
        fieldList.push({type:'string',value:'macAddr',text:'mac地址'})
        fieldList.push({type:'string',value:'checkCpu',text:'检查cpu'})
        fieldList.push({type:'string',value:'cpuSerial',text:'cpu序列号'})
        fieldList.push({type:'string',value:'checkMainBoard',text:'检查主板'})
        fieldList.push({type:'string',value:'mainBoardSerial',text:'主板序列号'})
        fieldList.push({type:'string',value:'encrypt',text:'密文'})
        fieldList.push({type:'string',value:'subject',text:'项目名称'})
        fieldList.push({type:'string',value:'description',text:'证书描述'})
        fieldList.push({type:'int',value:'trialOrFormal',text:'试用或正式'})
        this.superFieldList = fieldList
      },
      handleDownload(record){ 

        downFile(this.url.downloadUrl+"?id=" + record.id, {id:record.id}, 'post').then((res) => {
          if(!res){
            this.$message.warning("文件下载失败")
            return
          }
          const fileName = decodeURIComponent(res.headers["content-disposition"]).split("=")[1];
          const blob = new Blob([res.data], {type: 'application/octet-stream'});
          const downloadElement = document.createElement("a");
          const href = window.URL.createObjectURL(blob);
          var patt = new RegExp('filename=([^;]+\\.[^\\.;]+);*')
          var contentDisposition = decodeURI(res.headers['Content-Disposition'])
          //创建下载的链接
          downloadElement.href = href;
          //下载后文件名
          downloadElement.download = fileName;
          document.body.appendChild(downloadElement);
          //点击下载
          downloadElement.click();
          //下载完成移除元素
          document.body.removeChild(downloadElement);
          //释放掉blob对象
          window.URL.revokeObjectURL(href);
        }).finally(() => {
          this.confirmLoading = false
        })
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>