<template>
  <j-modal
    :width="modalWidth"
    :visible="visible"
    :title="title"
    switchFullscreen
    wrapClassName="j-user-select-modal"
    @cancel="close"
    style="top:50px"
    cancelText="关闭"
  >
    <a-row :gutter="10" style="background-color: #ececec; padding: 10px; margin: -10px">
      <a-col :md="24" :sm="24">
        <a-card :bordered="false">
          <!--用户列表-->
          <a-table
            ref="table"
            :scroll="scrollTrigger"
            size="middle"
            rowKey="draftId"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="false"
            :loading="loading"
            @change="handleTableChange">
            <span slot="action" slot-scope="text, record">
              <a @click="handleEdit(record)">编辑</a>
              <a-divider type="vertical" />
              <a-popconfirm title="确定删除吗?" :style="{ color: 'red' }" @confirm="() => handleDelete(record.draftId)">
                <a>删除</a>
              </a-popconfirm>
            </span>
          </a-table>

        </a-card>
      </a-col>
    </a-row>
  </j-modal>
</template>

<script>
  import { filterObj } from '@/utils/util'
  import { getDraftList, deleteDraft } from '@/api/workflow/workflow'

  export default {
    name: 'JSelectContractModal',
    components: {},
    props: ['modalWidth', 'param'],
    data() {
      return {
        queryParam: {
          contract: "",
        },
        columns: [
          {
            title: '标题',
            align: 'center',
            dataIndex: 'title',
            ellipsis: true,
          },
          {
            title: '更新时间',
            align: 'center',
            width:180,
            dataIndex: 'updateTime',
            ellipsis: true,
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
        scrollTrigger: {},
        dataSource: [],
        selectionRows: [],
        selectProjectRows: [],
        selectProjectIds: [],
        title: '草稿箱',
        ipagination: {
          current: 1,
          pageSize: 15,
          pageSizeOptions: ['15', '30', '50'],
          showTotal: (total, range) => {
            return range[0] + '-' + range[1] + ' 共' + total + '条'
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0
        },
        isorter: {
          column: 'createTime',
          order: 'desc'
        },
        visible: false,
        loading: false
      }
    },
    computed: {

    },
    created() {
      // 该方法触发屏幕自适应
      this.resetScreenSize();
      // this.loadData();
    },
    methods: {
      /*编辑数据*/
      handleEdit(record){
        var formData = record.formData
        this.$emit('edit', formData)
        this.close();
      },
      handleDelete(id){
        deleteDraft({id:id}).then((res)=>{
          if(res && res.success){
            this.$message.success("删除成功！")
            this.loadData();
            this.$emit('change')
          }else{
            this.$message.error("删除失败！")
          }
        })
      },
      /*加载草稿数据*/
      async loadData(arg) {
        if (arg === 1) {
          this.ipagination.current = 1;
        }
        let params = this.getQueryParams()//查询条件
        this.loading = true
        getDraftList(params).then(res=>{
          if (res.success) {
            this.dataSource = res.result
            this.ipagination.total = res.result.total
          }
        }).finally(() => {
          this.loading = false
        })
      },  
      getQueryParams() {
        let param = Object.assign({}, this.queryParam, this.isorter);
        param.modelId = this.modelId
        return filterObj(param);
      },
      // 触发屏幕自适应
      resetScreenSize() {
        let screenWidth = document.body.clientWidth;
        if (screenWidth < 500) {
          this.scrollTrigger = {x: 800};
        } else {
          this.scrollTrigger = {};
        }
      },
      showModal(modelId) {
        this.modelId = modelId
        this.visible = true;
        this.loadData();
      },

      close() {
        this.visible = false;
      },
      handleTableChange(pagination, filters, sorter) {
        //TODO 筛选
        if (Object.keys(sorter).length > 0) {
          this.isorter.column = sorter.field;
          this.isorter.order = 'ascend' === sorter.order ? 'asc' : 'desc';
        }
        this.ipagination = pagination;
        this.loadData();
      },

      modalFormOk() {
        this.loadData();
      }
    }
  }
</script>

<style scoped>
  .ant-table-tbody .ant-table-row td {
    padding-top: 10px;
    padding-bottom: 10px;
  }

  #components-layout-demo-custom-trigger .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color .3s;
  }
</style>
