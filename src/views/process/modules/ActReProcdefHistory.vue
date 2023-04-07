<template>
  <div>
    <a-modal
    :title="title"
    :width="800"
    :footer="null"
    :visible="visible"
    :closable="true"
    :maskClosable="false"
    @cancel="handleCancel"
    cancelText="关闭">
      <a-card :bordered="false"> 
        <a-table
          ref="table"
          size="middle"
          :scroll="{x:true}"
          bordered
          rowKey="deploymentId"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="ipagination"
          :loading="loading"
          class="j-table-force-nowrap"
          @change="handleTableChange">
          <span slot="action" slot-scope="text, record">
            <a-popconfirm v-if="!record.suspended" title="确定挂起流程吗?" @confirm="() => handleUp(record, 'suspended')">
              <a>挂起</a>
            </a-popconfirm>
            <a-popconfirm v-if="record.suspended" title="确定激活流程吗?" @confirm="() => handleUp(record, 'active')">
              <a>激活</a>
            </a-popconfirm>
            <a-divider type="vertical" />
            <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.deploymentId)">
              <a>删除</a>
            </a-popconfirm>
          </span>
        </a-table>
      </a-card>
    </a-modal> 
  </div>
</template>


<script>
 import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import Icon from 'ant-design-vue/es/icon'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { getAction } from '@/api/manage'
  export default {
    name: 'ActReProcdefHistory',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      Icon
    },
    props: {

    },
    data () {
      return {
        disableMixinCreated:true,
        visible: false,
        title: '流程部署历史',
        model:{},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        processKey:"",
        // 表头
        columns: [
          {
            title:'流程标识',
            align:"center",
            dataIndex: 'processKey',
            ellipsis: true
          },
          {
            title:'流程名称',
            align:"center",
            dataIndex: 'processName',
            ellipsis: true
          },
          {
            title:'流程状态',
            align:"center",
            dataIndex: 'suspended',
            customRender: (d) => {
              if (!d) {
                return <a-tag color="cyan">激活</a-tag>
              } else if (d) {
                return <a-tag color="#f50">挂起</a-tag>
              } else {
                console.log("==d3===:")
                return ''
              }
            },
            ellipsis: true
          },
          {
            title:'流程版本',
            align:"center",
            dataIndex: 'version',
            ellipsis: true,
            customRender: (d) => {
              if (d) {
                return <a-tag color="#1890FF">v{d}</a-tag>
              } else {
                return d
              }
            },
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            fixed:"right",
            width:100,
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: "/workflow/actReWorkflow/publishList",
          delete: "/workflow/actReWorkflow/remove",
        }
      }
    },
    created () {

    },
    methods: {
      list(record){
        this.url.list = "/workflow/actReWorkflow/publishList?processKey=" + record.processKey
        this.loadData();
      },
      handleUp(record, status){
        let that = this;
        let params = {"definitionId": record.definitionId, "status": status}
        getAction("/workflow/actReWorkflow/changeStatus", params).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.loadData();
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              
            })
      },
      close() {
        this.$emit('close')
        this.visible = false
      },
      handleCancel() {
        this.close()
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