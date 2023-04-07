<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24"> </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- table区域-begin -->
    <div>
      <a-table
        ref="table"
        size="middle"
        :scroll="{ x: true }"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        class="j-table-force-nowrap"
        @change="handleTableChange"
      >
        <template slot="iconSlot" slot-scope="text, record">
          <icon v-if="text" :type="text" :style="{ fontSize: 20 + 'px', color: record.iconColor }" />
        </template>

        <span slot="action" v-if="record.state == 1" slot-scope="text, record">
          <a @click="handleCreate(record)">发起</a>
        </span>
      </a-table>
    </div>

    <component
      :is="loadComponent"
      ref="realForm"
      @ok="submitCallback"
      @close="handleClose"
      :record="record"
      :visible="visible"
    ></component>
  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import Icon from 'ant-design-vue/es/icon'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'

export default {
  name: 'ActUsProcdefList',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    Icon,
  },
  data() {
    return {
      description: '流程发起',
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: 120,
          align: 'center',
          customRender: function (t, r, index) {
            return parseInt(index) + 1
          },
        },
        // {
        //   title:'流程定义ID',
        //   align:"center",
        //   dataIndex: 'procdefId',
        //   ellipsis: true,
        //   width:180
        // },
        {
          title: '图标',
          align: 'center',
          dataIndex: 'icon',
          scopedSlots: { customRender: 'iconSlot' },
          ellipsis: true,
          width: 150,
        },
        {
          title: '流程名称',
          align: 'center',
          dataIndex: 'processName',
          ellipsis: true,
          width: 350,
        },
        // {
        //   title:'流程版本号',
        //   align:"center",
        //   dataIndex: 'version',
        //   ellipsis: true,
        //   width:100,
        //   customRender: (d) => {
        //     if (d) {
        //       return <a-tag color="#1890FF">v{d}</a-tag>
        //     } else {
        //       return d
        //     }
        //   },
        // },
        {
          title: '描述',
          align: 'center',
          dataIndex: 'description',
          ellipsis: true,
        },
        // {
        //   title:'状态',
        //   align:"center",
        //   dataIndex: 'state',
        //   customRender: (d) => {
        //     if (d === 1) {
        //       return <a-tag color="#f50">激活</a-tag>
        //     } else if (d === 2) {
        //       return <a-tag color="cyan">终止</a-tag>
        //     } else {
        //       return d
        //     }
        //   },
        //   width: 100
        // },
        // {
        //   title:'部署时间',
        //   align:"center",
        //   dataIndex: 'deployTime',
        //   width:150
        // },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: 147,
          scopedSlots: { customRender: 'action' },
        },
      ],
      url: {
        list: `/workflow/actUsProcdef/list?peopleId=${this.$store.getters.userInfo.id}`,
        delete: '/workflow/actUsProcdef/delete',
        deleteBatch: '/workflow/actUsProcdef/deleteBatch',
        exportXlsUrl: '/workflow/actUsProcdef/exportXls',
        importExcelUrl: 'workflow/actUsProcdef/importExcel',
      },
      dictOptions: {},
      superFieldList: [],
      loadComponent: '',
      record: '',
      visible: false,
    }
  },
  created() {
    this.getSuperFieldList()
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
  },
  methods: {
    handleCreate(record) {
      this.record = record
      let path = record.submitForm
      if (!record.submitForm) {
        this.$message.error('未设置表单提交路径，请联系管理员设置!')
        return
      }
      this.loadComponent = () => import(`@/views/${path}`)
      this.visible = true
      this.title = record.processName
    },
    handleClose() {
      this.record = {}
      this.visible = false
    },
    submitCallback() {
      this.record = {}
      this.visible = false
      this.loadData()
    },
    initDictConfig() {},
    getSuperFieldList() {
      let fieldList = []
      fieldList.push({ type: 'string', value: 'category', text: '流程分类' })
      fieldList.push({ type: 'string', value: 'processName', text: '流程名称' })
      fieldList.push({ type: 'string', value: 'procdefId', text: '流程定义ID' })
      fieldList.push({ type: 'int', value: 'version', text: '流程版本号' })
      fieldList.push({ type: 'string', value: 'processForm', text: '流程业务表单，设计器表单' })
      fieldList.push({ type: 'string', value: 'linkTable', text: '业务数据表' })
      fieldList.push({ type: 'string', value: 'submitForm', text: '流程提交表单组件' })
      fieldList.push({ type: 'string', value: 'handelForm', text: '流程处理表单组件' })
      fieldList.push({ type: 'string', value: 'icon', text: '图标' })
      fieldList.push({ type: 'string', value: 'iconColor', text: '图标颜色' })
      fieldList.push({ type: 'string', value: 'tenantId', text: '租户' })
      fieldList.push({ type: 'string', value: 'description', text: '描述' })
      fieldList.push({ type: 'int', value: 'state', text: '状态' })
      fieldList.push({ type: 'int', value: 'delFlag', text: '删除状态' })
      fieldList.push({ type: 'date', value: 'deployTime', text: '部署时间' })
      this.superFieldList = fieldList
    },
  },
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>