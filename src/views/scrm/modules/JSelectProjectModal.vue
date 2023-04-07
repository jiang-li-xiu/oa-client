<template>
  <j-modal
    :width="modalWidth"
    :visible="visible"
    :title="title"
    switchFullscreen
    wrapClassName="j-user-select-modal"
    @ok="handleSubmit"
    @cancel="close"
    style="top:50px"
    cancelText="关闭"
  >
    <a-row :gutter="10" style="background-color: #ececec; padding: 10px; margin: -10px">
      <a-col :md="24" :sm="24">
        <a-card :bordered="false">
          <a-form-model>
            <a-form-model-item label="项目名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-row type="flex" :gutter="8">
                <a-col :span="18">
                  <a-input-search
                      :style="{width:'100%'}"
                      placeholder="请输入项目名称"
                      v-model="queryParam.projectName"
                      @search="onSearch"
                  ></a-input-search>
                </a-col>
                <a-col :span="6">
                  <a-button @click="searchReset(1)" icon="redo">重置</a-button>
                </a-col>
              </a-row>
            </a-form-model-item>
          </a-form-model>
          <!--用户列表-->
          <a-table
            ref="table"
            :scroll="scrollTrigger"
            size="middle"
            rowKey="id"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="ipagination"
            :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange,type: getType}"
            :loading="loading"
            @change="handleTableChange">
          </a-table>
        </a-card>
      </a-col>
    </a-row>
  </j-modal>
</template>

<script>
  import { pushIfNotExist, filterObj } from '@/utils/util'
  import { getAction } from '@/api/manage'

  export default {
    name: 'JSelectProjectModal',
    components: {},
    props: ['modalWidth', 'multi', 'ids', 'store', 'text'],
    data() {
      return {
        queryParam: {
          customName: "",
        },
        columns: [
          {
            title: '项目名称',
            align: 'center',
            dataIndex: 'projectName'
          },
          {
            title: '项目编号',
            align: 'center',
            dataIndex: 'projectNo'
          },
          {
            title: '客户名称',
            align: 'center',
            dataIndex: 'customName'
          },
          {
            title: '联系人',
            align: 'center',
            dataIndex: 'liaison'
          }
        ],
        scrollTrigger: {},
        dataSource: [],
        selectionRows: [],
        selectedRowKeys: [],
        selectProjectRows: [],
        selectProjectIds: [],
        title: '选择项目',
        ipagination: {
          current: 1,
          pageSize: 10,
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
        selectedDepIds: [],
        visible: false,
        form: this.$form.createForm(this),
        loading: false,
        expandedKeys: [],
        labelCol: {
          xs: { span: 24 },
          sm: { span: 4 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 10 },
        },
      }
    },
    computed: {
      // 计算属性的 getter
      getType: function () {
        return this.multi == true ? 'checkbox' : 'radio';
      }
    },
    watch: {
      ids: {
        immediate: true,
        handler() {
          this.initProjectNames()
        }
      },
    },
    created() {
      // 该方法触发屏幕自适应
      this.resetScreenSize();
      this.loadData();
    },
    methods: {
      initProjectNames() {
        if (this.ids) {
          // 这里最后加一个 , 的原因是因为无论如何都要使用 in 查询，防止后台进行了模糊匹配，导致查询结果不准确
          let values = this.ids.split(',') + ','
          let param = {[this.store]: values}
          getAction('/scrm/crmProject/getMultiProject', param).then((list)=>{
            this.selectionRows = []
            let selectedRowKeys = []
            let textArray = []
            if(list && list.length>0){
              for(let project of list){
                textArray.push(project[this.text])
                selectedRowKeys.push(project['id'])
                this.selectionRows.push(project)
              }
            }
            this.selectedRowKeys = selectedRowKeys
            this.$emit('initComp', textArray.join(','))
          })

        } else {
          this.$emit('initComp', '')
          // 前端用户选择单选无法置空的问题 #2610
          this.selectedRowKeys = []
        }
      },
      async loadData(arg) {
        if (arg === 1) {
          this.ipagination.current = 1;
        }
        let params = this.getQueryParams()//查询条件
        this.loading = true
        getAction('/scrm/crmProject/listForSelect', params).then(res=>{
          if (res.success) {
            this.dataSource = res.result.records
            this.ipagination.total = res.result.total
          }
        }).finally(() => {
          this.loading = false
        })
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
      showModal() {
        this.visible = true;
        this.loadData();
        this.initProjectNames();
        this.form.resetFields();
      },
      getQueryParams() {
        let param = Object.assign({}, this.queryParam, this.isorter);
        param.field = this.getQueryField();
        param.superQueryMatchType = "like";
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        param.departId = this.selectedDepIds.join(',')
        return filterObj(param);
      },
      getQueryField() {
        let str = 'id,';
        for (let a = 0; a < this.columns.length; a++) {
          str += ',' + this.columns[a].dataIndex;
        }
        return str;
      },
      searchReset(num) {
        let that = this;
        that.selectedRowKeys = [];
        that.selectProjectIds = [];
        that.selectedDepIds = [];
        if (num !== 0) {
          that.queryParam = {};
          that.loadData(1);
        }
      },
      close() {
        this.searchReset(0);
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
      handleSubmit() {
        let that = this;
        this.getSelectProjectRows();
        that.$emit('ok', that.selectProjectRows);
        that.searchReset(0)
        that.close();
      },
      //获取选择用户信息
      getSelectProjectRows() {
        this.selectProjectRows = []
        for (let row of this.selectionRows) {
          if (this.selectedRowKeys.includes(row.id)) {
            this.selectProjectRows.push(row)
          }
        }
        this.selectProjectIds = this.selectProjectRows.map(row => row.customerName).join(',')
      },
      // 点击树节点,筛选出对应的用户
      onDepSelect(selectedDepIds) {
        if (selectedDepIds[0] != null) {
          if (this.selectedDepIds[0] !== selectedDepIds[0]) {
            this.selectedDepIds = [selectedDepIds[0]];
          }
          this.loadData(1);
        }
      },
      onSelectChange(selectedRowKeys, selectionRows) {
        this.selectedRowKeys = selectedRowKeys;
        selectionRows.forEach(row => pushIfNotExist(this.selectionRows, row, 'id'))
      },
      onSearch() {
        this.loadData(1);
      },
      //update-end-author:taoyan date:20211202 for: 异步加载部门树 https://github.com/jeecgboot/jeecg-boot/issues/3196
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
