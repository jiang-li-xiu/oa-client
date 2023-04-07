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
            <a-form-model-item label="流程标题" prop="name">
              <a-input v-model="queryParam.name" placeholder="请输入流程标题" />
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="流程状态" prop="businessStatus">
              <a-select
                v-model="queryParam.businessStatus"
                placeholder="请选择"
                :options="options"
                :filter-option="true"
                :allow-clear="true">
              </a-select>
            </a-form-model-item>
          </a-col>

          <template v-if="toggleSearchStatus">
            <!-- <a-col :md="6" :sm="8">
              <a-form-model-item label="发起人" prop="realName">
                <a-input v-model="queryParam.realName" placeholder="请输入发起人" />
              </a-form-model-item>
            </a-col> -->
            <a-col :md="8" :sm="8">
              <a-form-model-item label="申请时间">
                <a-range-picker
                  :show-time="{
                    hideDisabledOptions: true,
                    defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                  }"
                  format="YYYY-MM-DD HH:mm:ss"
                  @ok="confirm"
                />
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
     
    </div>

    <!-- table区域-begin -->
    <div>
      <a-table
        ref="table"
        size="middle"
        :scroll="{x:true}"
        bordered
        rowKey="taskId"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
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
          <a @click="handleProcess(record)">办理</a>
          <!-- <a-divider type="vertical" />
          <a @click="handleDetail(record)">详情</a> -->
        </span>

      </a-table>
    </div>
    <act-process-handel-model ref="modalHandle" @ok="modalHandleOk"></act-process-handel-model>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import CrmProjectFormHandel from '@/views/scrm/modules/CrmProjectFormHandel'
  import ActProcessHandelModel from './modules/ActProcessHandelModel'
  import { flowStatus } from "@/plugins/utils/flowable";
  import { getAction } from '@/api/manage'
  import { isEmpty } from 'lodash'
  import moment from 'moment'

  export default {
    name: 'CrmProjectList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      CrmProjectFormHandel,
      ActProcessHandelModel
    },
    data () {
      return {
        moment,
        queryParam:{},
        description: 'crm_project管理页面',
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
            dataIndex: 'procDefName',
            width: 200,
            ellipsis: true
          },
          {
            title:'申请人',
            align:"center",
            dataIndex: 'startUserName',
            width: 150,
            ellipsis: true
          },
          {
            title:'流程标题',
            align:"center",
            dataIndex: 'taskDesc',
            ellipsis: true
          },
          {
            title:'申请时间',
            align:"center",
            dataIndex: 'createTime',
            width: 160,
            ellipsis: true,
          },
          {
            title:'流程状态',
            align:"center",
            dataIndex: 'taskStatus',
            width: 100,
            ellipsis: true,
            customRender: (d) => {
             return flowStatus(d)
            },
          },
          {
            title:'流程节点',
            align:"center",
            dataIndex: 'taskName',
            width: 200,
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
          list: "/workflow/taskHandel/todoList",
          delete: "/org/crmProject/delete",
          deleteBatch: "/org/crmProject/deleteBatch",
          exportXlsUrl: "/org/crmProject/exportXls",
          importExcelUrl: "org/crmProject/importExcel",
          
        },
        dictOptions:{},
        superFieldList:[],
        visible:false,
        loadComponent: '',
        record:{},
        options:[
          {value:'1', label:'进行中'},
          {value:'2', label:'已退回'},
          {value:'3', label:'委派中'},
          {value:'4', label:'转办中'}
        ]
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
      handleProcess(record){
        let that = this
        getAction('/workflow/taskHandel/userProcdef', {procdefId: record.procDefId}).then((res)=>{
          if(res.success){
            if( !res.result || isEmpty(res.result)){
              that.$message.warning("流程未定义或流程定义已删除！");
              return
            }
            var path = res.result.handelForm;
            if(!path){
              this.$message.error("未设置流程处理路径，请联系管理员设置!")
              return;
            }
            that.$refs.modalHandle.title = "流程信息";
            that.$refs.modalHandle.disableSubmit = false;
            that.$refs.modalHandle.open(record, "任务办理", path, "handel");
          }else{
            that.$message.warning(res.message);
          }
        })
      },
      initDictConfig(){
      },
      submitCallback(){
        this.record = {};
        this.visible = false;
        this.loadData()
      },
      handleClose(){
        this.record = {};
        this.visible = false;
        this.loadData()
      },
      handleDetail(record){
        this.$refs.modalHandle.title = "流程详情";
        this.$refs.modalHandle.disableSubmit = false;
        this.$refs.modalHandle.open(record, "任务办理", record.handelForm);
      },
      modalHandleOk(){
        this.loadData()
      },
      handleCancel() {
        this.visible = false;
        this.loadData()
      },
      confirm(date){
        this.queryParam.startTime = date[0].format("YYYY-MM-DD HH:mm:ss")
        this.queryParam.endTime = date[1].format("YYYY-MM-DD HH:mm:ss")
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>