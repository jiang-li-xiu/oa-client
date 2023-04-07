<template>
  <a-card :bordered="false">
    <a-spin :tip="tips" :spinning="confirmLoading">
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
        <a-button type="primary" icon="plus" @click="handleAdd">添加流程</a-button>
      </div>

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

          <template slot="iconSlot" slot-scope="text, record">
            <icon v-if="text" :type="text" :style="{fontSize: 20+'px', color: record.iconColor}"/>
          </template>

          <span slot="action" slot-scope="text, record">
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a @click="handleDesign(record)">设计</a>
            <a-divider type="vertical" />
            <a-dropdown>
                <a class="ant-dropdown-link">
                  更多 <a-icon type="down"/>
                </a>
                <a-menu slot="overlay">
                  <a-menu-item>
                    <a-popconfirm v-if="(record.processStatus == 1)" title="确定发布吗?" @confirm="() => handleDeploy(record.id, record.processStatus)">
                      <a>发布</a>
                    </a-popconfirm>
                    <a-popconfirm v-if="record.status == 1" title="确定停用吗?" @confirm="() => handleChange(record.id, 2, '停用')">
                      <a>停用</a>
                    </a-popconfirm>
                    <a-popconfirm v-if="record.status != 1" title="确定启用吗?" @confirm="() => handleChange(record.id, 1, '启用')">
                      <a>启用</a>
                    </a-popconfirm>
                  </a-menu-item>
                  <a-menu-item>
                    <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete1(record.id)">
                      <a>删除</a>
                    </a-popconfirm>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
          </span>

        </a-table>
      </div>
      <!-- table区域-end -->
      <act-re-workflow-modal ref="designForm" @ok="modalFormOk" @refresh="refreshList"></act-re-workflow-modal>
      <!-- 表单区域 -->
      <act-re-workflow-form ref="modalForm" @ok="modalFormOk"></act-re-workflow-form>
    </a-spin>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import Icon from 'ant-design-vue/es/icon'
  import { putAction, getAction} from '@/api/manage';
  import ActReWorkflowModal from './modules/ActReWorkflowModal'
  import ActReWorkflowForm from './modules/ActReWorkflowForm'
  import ProcessViewer from '@/plugins/modal/ProcessViewerModal'

  export default {
    name: 'ActReWorkflowList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      ActReWorkflowModal,
      // DiagramManager,
      ActReWorkflowForm,
      Icon,
      ProcessViewer
    },
    data () {
      return {
        xmlData: '',
        finishedInfo: {
          finishedSequenceFlowSet: [],
          finishedTaskSet: [],
          unfinishedTaskSet: [],
          rejectedTaskSet: []
        },
        historyTaskList: [],
        height:500,
        id:'',
        description: '流程管理页面',
        // 表头
        columns: [
          {
            title:'图标',
            align:"center",
            width: 80,
            dataIndex: 'icon',
            scopedSlots: { customRender: 'iconSlot' },
            ellipsis: true
          },
          {
            title:'流程名称',
            align:"center",
            dataIndex: 'processName',
            ellipsis: true
          },
          {
            title:'发布状态',
            align:"center",
            dataIndex: 'processStatus',
            customRender: (d) => {
              if (d === 1) {
                return <a-tag color="#f50">未发布</a-tag>
              } else if (d === 2) {
                return <a-tag color="cyan">已发布</a-tag>
              } else {
                return d
              }
            },
            ellipsis: true
          },
          {
            title:'流程描述',
            align:"center",
            dataIndex: 'description',
            ellipsis: true
          },
          {
            title:'可见范围',
            align:"center",
            dataIndex: 'visibleSummary',
            ellipsis: true
          },
          {
            title:'是否可用',
            align:"center",
            dataIndex: 'status',
            customRender: (d) => {
              if (d === 1) {
                return <a-tag color="cyan">启用</a-tag>
              } else if (d === 2) {
                return <a-tag color="#f50">停用</a-tag>
              } else {
                return d
              }
            }
          },
          {
            title:'最后更新',
            align:"center",
            dataIndex: 'updateTime'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            fixed:"right",
            width:160,
            scopedSlots: { customRender: 'action' }
          }
        ],
        confirmLoading:false,
        tips:'加载中...',
        url: {
          list: `/workflow/actReWorkflow/list?peopleId=${this.$store.getters.userInfo.id}`,
          delete: "/workflow/actReWorkflow/delete",
          deleteBatch: "/workflow/actReWorkflow/deleteBatch",
          exportXlsUrl: "/workflow/actReWorkflow/exportXls",
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
      handleDesign(record){
        this.$refs.designForm.title = "流程设计 - " + record.processName;
        this.$refs.designForm.id = record.id
        this.$refs.designForm.departDisabled = true;
        this.$refs.designForm.disableSubmit = true;
        this.$refs.designForm.roleDisabled = true;
        this.$refs.designForm.design(record);
      },
      handleDeploy:function(id, status){
        let that = this;
        if(status == 2){
          that.$confirm({
            title: '提示',
            content: (h)=>(<div style="color:#ff4d4f;">该流程已经部署！请确认是否重新部署，重新部署后新流程生效，旧流程不受影响！</div>),
            okText: '发布',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
              that.deploy(id)
            },
          });
        }else{
          that.deploy(id)
        }
      },
      deploy:function(id){
        let that = this;
        that.confirmLoading = true
        that.tips = '发布中...'
        getAction("/workflow/actReWorkflow/deploy",{id:id}).then(res=>{
          if(res.success){
            that.$message.success("发布成功！");
            that.loadData();
          }else{
            that.$message.warning(res.message);
          }
        }).finally(() => {
          that.confirmLoading = false
          that.tips = '加载中...'
        })
      },
      refreshList: function(){
        this.loadData();
      },
      handleChange: function (id, status, opt) {
        let that = this;
        that.confirmLoading = true
        that.tips = '处理中...'
        putAction("/workflow/actReWorkflow/edit",{id:id,  status:status}).then(res=>{
          if(res.success){
            that.$message.success(opt + "成功！");
            that.loadData();
          }else{
            that.$message.warning(res.message);
          }
        }).finally(()=>{
          that.confirmLoading = false
          that.tips = '加载中...'
        })
      },
      handleDelete1: function(id) {
        this.handleDelete(id)
      },
      getSuperFieldList(){
        let fieldList=[];
        fieldList.push({type:'string',value:'flowTitle',text:'流程名称',dictCode:''})
        fieldList.push({type:'int',value:'enabled',text:'是否可用',dictCode:''})
        fieldList.push({type:'string',value:'icon',text:'图标',dictCode:''})
        fieldList.push({type:'string',value:'processId',text:'流程id',dictCode:''})
        fieldList.push({type:'string',value:'description',text:'描述',dictCode:''})
        fieldList.push({type:'int',value:'version',text:'版本号',dictCode:''})
        fieldList.push({type:'int',value:'delFlag',text:'删除标志',dictCode:''})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
  .ant-modal-confirm-content{
    color: red;
  }
</style>