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

    <!-- table区域-begin -->
    <div>
      <a-table
        ref="table"
        size="middle"
        :scroll="{x:true}"
        bordered
        rowKey="procInsId"
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
          <a @click="handleView(record)">详情</a>
          <a-divider type="vertical" v-if="record.status < 5"/>
          <a-popconfirm v-if="(record.status < 5)" title="确定取消流程吗?" @confirm="() => handleCancel(record.procInsId)">
            <a>取消</a>
          </a-popconfirm>
          <a-divider v-if="record.status != 7" type="vertical" />
          <a-popconfirm v-if="record.status != 7" title="确定删除流程吗？审批数据将丢失！" @confirm="() => handleDelete(record.procInsId)">
            <a>删除</a>
          </a-popconfirm>
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
  import ActProcessHandelModel from './modules/ActProcessHandelModel'
  import { postAction, getAction } from '@/api/manage'
  import { isEmpty } from 'lodash'
  import { flowStatus } from "@/plugins/utils/flowable";
  import moment from 'moment'

  export default {
    name: 'CrmProjectList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      ActProcessHandelModel
    },
    data () {
      return {
        moment,
        queryParam:{},
        description: '我的流程管理页面',
        flowStatus: this.flowStatus,
        // 表头
        columns: [
          {
            title: '序号',
            dataIndex: '',
            key:'rowIndex',
            width:'5%',
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },
          {
            title:'流程名称',
            align:"center",
            dataIndex: 'procDefName',
            width: 150,
            ellipsis: true
          },
          {
            title:'流程标题',
            align:"center",
            dataIndex: 'name',
            ellipsis: true
          },
          {
            title:'流程节点',
            align:"center",
            dataIndex: 'taskName',
            width: 150,
            ellipsis: true
          },
          {
            title:'当前处理人',
            align:"center",
            dataIndex: 'assigneeName',
            width: 150,
            ellipsis: true
          },
          {
            title:'流程状态',
            align:"center",
            dataIndex: 'status',
            width: 100,
            ellipsis: true,
            customRender: (d) => {
             return flowStatus(d)
            },
          },
          {
            title:'申请时间',
            align:"center",
            dataIndex: 'startTime',
            width: 180,
            ellipsis: true
          },
          {
            title:'结束时间',
            align:"center",
            dataIndex: 'endTime',
            width: 180,
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
          list: "/workflow/taskHandel/ownList",
          delete: "/org/crmProject/delete",
          deleteBatch: "/org/crmProject/deleteBatch",
          exportXlsUrl: "/org/crmProject/exportXls",
          importExcelUrl: "org/crmProject/importExcel",
          
        },
        options:[
          {value:'1', label:'进行中'},
          {value:'2', label:'已退回'},
          {value:'3', label:'委派中'},
          {value:'4', label:'转办中'},
          {value:'5', label:'通过'},
          {value:'6', label:'不通过'},
          {value:'7', label:'删除'},
          {value:'8', label:'取消'}
        ],
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
      handleView(record){
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
      getSuperFieldList(){
        let fieldList=[];
        fieldList.push({type:'string',value:'projectName',text:'项目名称'})
        this.superFieldList = fieldList
      },
      /**取消流程 */
      handleCancel(instanceId){
        let that = this
        getAction('/workflow/taskHandel/stopProces', {instanceId: instanceId}).then((res)=>{
          if(res.success){
            that.$message.success('取消成功！');
            that.loadData()
          }else{
            that.$message.warning(res.message);
          }
        })
      },
      /**删除流程 */
      handleDelete(instanceId){
        let that = this
        getAction('/workflow/taskHandel/deleteInstance', {instanceId: instanceId}).then((res)=>{
          if(res.success){
            that.$message.success('删除成功！');
            that.loadData()
          }else{
            that.$message.warning(res.message);
          }
        })
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