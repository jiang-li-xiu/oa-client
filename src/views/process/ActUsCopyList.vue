<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-model-item label="流程名称" prop="processName">
              <a-input v-model="queryParam.processName" placeholder="请输入流程名称" />
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="流程标题" prop="title">
              <a-input v-model="queryParam.title" placeholder="请输入流程标题" />
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="发起人" prop="startUserName">
              <a-input v-model="queryParam.startUserName" placeholder="请输入发起人" />
            </a-form-model-item>
          </a-col>
          
          <!-- <a-col :md="6" :sm="8">
            <a-form-model-item label="流程状态" prop="businessStatus">
              <a-select
                v-model="queryParam.businessStatus"
                placeholder="请选择"
                :options="options"
                :filter-option="true"
                :allow-clear="true">
              </a-select>
            </a-form-model-item>
          </a-col> -->


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
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button type="primary" icon="download" @click="handleExportXls('流程抄送')">导出</a-button>
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
          <a @click="handleDetail(record)">详情</a>
        </span>

      </a-table>
    </div>
    <act-process-handel-model ref="modalHandle"></act-process-handel-model>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { getAction } from '@/api/manage'
  import { isEmpty } from 'lodash'
  import ActProcessHandelModel from './modules/ActProcessHandelModel'

  export default {
    name: 'ActUsCopyList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      ActProcessHandelModel
    },
    data () {
      return {
        description: '流程抄送管理页面',
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
            title:'流程名称',
            align:"center",
            dataIndex: 'processName',
            ellipsis: true
          },
          {
            title:'流程标题',
            align:"center",
            dataIndex: 'title',
            ellipsis: true
          },
          {
            title:'抄送时间',
            align:"center",
            dataIndex: 'createTime',
            width:250,
            ellipsis: true
          },
          {
            title:'发起人名称',
            align:"center",
            dataIndex: 'startUserName',
            ellipsis: true
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            fixed:"right",
            width:120,
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: "/workflow/actUsCopy/list",
          delete: "/workflow/actUsCopy/delete",
          deleteBatch: "/workflow/actUsCopy/deleteBatch",
          exportXlsUrl: "/workflow/actUsCopy/exportXls",
          importExcelUrl: "workflow/actUsCopy/importExcel",
          
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
      handleDetail(record){
        console.log("==record==:" + JSON.stringify(record))
        let that = this
        getAction('/workflow/taskHandel/userProcdef', {procdefId: record.procDefId}).then((res)=>{
          if(res.success){
            if( !res.result || isEmpty(res.result)){
              that.$message.warning("流程未定义或流程定义已删除！");
              return
            }
            var path = res.result.handelForm;
            that.$refs.modalHandle.title = "流程信息";
            that.$refs.modalHandle.disableSubmit = false;
            that.$refs.modalHandle.open(record, "表单信息", path, "view");
          }else{
            that.$message.warning(res.message);
          }
        })
      },
      initDictConfig(){
      },
      getSuperFieldList(){
        let fieldList=[];
        fieldList.push({type:'string',value:'businessKey',text:'业务主键'})
        fieldList.push({type:'string',value:'title',text:'抄送标题'})
        fieldList.push({type:'string',value:'processName',text:'流程名称'})
        fieldList.push({type:'string',value:'startUserName',text:'发起人名称'})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>