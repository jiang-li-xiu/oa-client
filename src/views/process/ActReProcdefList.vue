<template>
  <a-card :bordered="false">
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

        <template slot="iconSlot" slot-scope="text, record">
          <icon :type="text" :style="{fontSize: 20+'px', color:record.iconColor}"/>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleVersion(record)">历史部署</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.deploymentId)">
            <a>删除</a>
          </a-popconfirm>
        </span>

      </a-table>
    </div>
    <!-- 历史部署 -->
    <act-re-procdef-history ref="modalList"></act-re-procdef-history>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import Icon from 'ant-design-vue/es/icon'
  import ActReProcdefHistory from './modules/ActReProcdefHistory'

  export default {
    name: 'ActReProcdefList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      Icon,
      ActReProcdefHistory
    },
    data () {
      return {
        description: '流程部署管理页面',
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
            title:'部署时间',
            align:"center",
            dataIndex: 'deploymentTime',
            ellipsis: true
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
        url: {
          list: "/workflow/actReWorkflow/deployList",
          delete: "/workflow/actReWorkflow/remove",
        },
        dictOptions:{},
        superFieldList:[],
      }
    },
    created() {

    },
    computed: {

    },
    methods: {
      handleVersion: function (record) {
        this.$refs.modalList.title = "历史部署";
        this.$refs.modalList.visible = true;
        this.$refs.modalList.list(record);
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