<template>
  <el-col class="copy-select" :span="24">
    <el-tag v-for="(item, index) in selectedUser.text" :key="index" effect="plain" :closable="true" @close="closeTag(index)">
      {{item}}
    </el-tag>
    <el-button type="primary" size="mini" class="full-line-btn" icon="el-icon-plus" @click="onEditCopyForItem()">添加抄送人</el-button>
    <!-- 候选用户弹窗 -->
    <el-dialog title="候选用户" :visible.sync="userOpen" width="60%" append-to-body>
      <a-row :gutter="10" style="background-color: #ececec; padding: 10px; margin: -10px">
        <a-col :md="6" :sm="24">
          <a-card :bordered="false">
            <!--组织机构-->
            <a-directory-tree
              selectable
              :selectedKeys="selectedDepIds"
              :checkStrictly="true"
              :dropdownStyle="{maxHeight:'200px',overflow:'auto'}"
              :treeData="departTree"
              :expandAction="false"
              @select="onDepSelect"
              :load-data="onLoadDepartment"
            />
          </a-card>
        </a-col>
        <a-col :md="18" :sm="24">
          <a-card :bordered="false">
            <a-form-model>
              <a-form-model-item label="用户账号" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-row type="flex" :gutter="8">
                  <a-col :span="18">
                    <a-input-search
                        :style="{width:'100%'}"
                        placeholder="请输入账号"
                        v-model="queryParam.username"
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
              :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: getType}"
              :loading="loading"
              @change="handleTableChange">
            </a-table>
          </a-card>
        </a-col>
      </a-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleTaskUserComplete">确 定</el-button>
        <el-button @click="userOpen = false">取 消</el-button>
      </div>
    </el-dialog>
  </el-col>
</template>

<script>
import { treeDataTranslate } from '@/utils';
import { SysPostController, DictionaryController } from '@/api';
import { pushIfNotExist, filterObj } from '@/utils/util'
import { getAction } from '@/api/manage'
import { queryUserByDepId, queryDepartTreeSync} from '@/api/api'

export default {
  name: 'copyForSelect',
  props: {
    value: {
      type: Array,
      default: () => []
    },
    id: String,
    type: String,
    modalWidth: {
      type: Number,
      default: 1250,
      required: false
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    multi: {
      type: Boolean,
      default: true,
      required: false
    },
    backUser: {
      type: Boolean,
      default: false,
      required: false
    },
    // 存储字段 [key field]
    store: {
      type: String,
      default: 'id',
      required: false
    },
    // 显示字段 [label field]
    text: {
      type: String,
      default: 'realname',
      required: false
    }
  },
  inject: ['prefix'],
  data () {
    return {
      isInit: false,
      deptTreeData: [],
      deptIds: [],
      userOpen: false,
      selectedUserDate: [],
      // 查询参数
      queryParams: {
        deptId: undefined
      },
      isSequential: false,
      multiLoopType: 'Null',
      queryParam: {
        username: "",
      },
      columns: [
        {
          title: '用户账号',
          align: 'center',
          dataIndex: 'username'
        },
        {
          title: '用户姓名',
          align: 'center',
          dataIndex: 'realname'
        },
        {
          title: '性别',
          align: 'center',
          dataIndex: 'sex',
          customRender: function (text) {
            if (text === 1) {
              return '男'
            } else if (text === 2) {
              return '女'
            } else {
              return text
            }
          }
        },
        {
          title: '部门',
          align: 'center',
          dataIndex: 'orgCodeTxt'
        }
      ],
      scrollTrigger: {},
      dataSource: [],
      selectionRows: [],
      selectedRowKeys: [],
      selectUserRows: [],
      selectUserIds: [],
      title: '根据部门选择用户',
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
      selectedDepIds: [],
      departTree: [],
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
      copyItemList: [],
      selectedUser: { ids: [], text: [] },
      userIds:''
    }
  },
  methods: {
    //更新已选用户数据
    update(userIds, selectedUser){
      this.userIds = userIds
      this.selectedUser = selectedUser
    },
    closeTag(index){
      this.selectedUser.text.splice(index,1)
      this.selectedUser.ids.splice(index,1)
      this.userIds = this.selectedUser.ids.join(',')
      this.copyForItemList = []
      if(this.selectedUser.ids && this.selectedUser.ids.length > 0){
        this.copyForItemList = [{"$type":"flowable:CopyItem","value":this.selectedUser.ids,"name":this.selectedUser.text,"type":"user"}]
      }
      this.updateElementExtensions()
    },
    /**用户选择开始 */
    resetTaskForm() {
      this.bpmnElement = window.bpmnInstances.bpmnElement;
      const bpmnElementObj = this.bpmnElement?.businessObject;
      if (!bpmnElementObj) {
        return;
      }
      this.clearOptionsData()
      this.dataType = bpmnElementObj['dataType'];
      let elExtensionElements = bpmnElementObj.get("extensionElements");
      if(elExtensionElements){
        // 获取抄送元素，遍历values数组，返回数组中类型type为flowable:CopyItemList的数组元素，如果没有则返回空数组，如果没有则创建一个抄送属性
        if(elExtensionElements.values){
          this.copyItemElementList = elExtensionElements.values.filter(ex => ex.$type === `${this.prefix}:CopyItemList`)?.[0] ||
            window.bpmnInstances.moddle.create(`${this.prefix}:CopyItemList`, { copyItemList: [] });
          // 初始化抄送元素数据，也即抄送属性数据
          this.copyForItemList = this.copyItemElementList.copyItemList;
          this.updateElementExtensions();
        }
      }
      this.getElementLoop(bpmnElementObj);
    },
    updateElementExtensions () {
      // 更新回扩展元素，如果扩展属性已经存在则直接赋值，如果不存在则创建
      const bpmnElementObj = this.bpmnElement?.businessObject;
      let elExtensionElements = bpmnElementObj.get("extensionElements") || window.bpmnInstances.moddle.create("bpmn:ExtensionElements", { values: [] });
      // 遍历values数组，返回数组中类型type为flowable:CopyItemList的数组元素，如果没有则返回空数组
      let otherExtensions = elExtensionElements.values.filter(ex => ex.$type !== `${this.prefix}:CopyItemList`);
      if(!this.copyItemElementList){
        this.copyItemElementList = elExtensionElements.values.filter(ex => ex.$type === `${this.prefix}:CopyItemList`)?.[0] ||
            window.bpmnInstances.moddle.create(`${this.prefix}:CopyItemList`, { copyItemList: [] });
      }
      this.copyItemElementList.copyItemList = (this.copyForItemList || []).map(item => {
        return window.bpmnInstances.moddle.create(`${this.prefix}:CopyItem`, {
          value: item.value,
          name: item.name,
          type: item.type
        });
      });
      const newElExtensionElements = window.bpmnInstances.moddle.create(`bpmn:ExtensionElements`, {
        values: otherExtensions.concat(this.copyItemElementList)
      });
      // 更新到元素上
      window.bpmnInstances.modeling.updateProperties(this.bpmnElement, {
        extensionElements: newElExtensionElements
      });
    },
    getElementLoop(businessObject) {
      if (!businessObject.loopCharacteristics) {
        this.multiLoopType = "Null";
        return;
      }
      this.isSequential = businessObject.loopCharacteristics.isSequential;
      if (businessObject.loopCharacteristics.completionCondition) {
        if (businessObject.loopCharacteristics.completionCondition.body === "${nrOfCompletedInstances >= nrOfInstances}") {
          this.multiLoopType = "SequentialMultiInstance";
        } else {
          this.multiLoopType = "ParallelMultiInstance";

        }
      }
    },
    queryDepartTree() {
      //update-begin-author:taoyan date:20211202 for: 异步加载部门树 https://github.com/jeecgboot/jeecg-boot/issues/3196
      this.expandedKeys = []
      this.departTree = []
      queryDepartTreeSync().then((res) => {
        if (res.success) {
          for (let i = 0; i < res.result.length; i++) {
            let temp = res.result[i]
            this.departTree.push(temp)
          }
        }
      })
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
    onLoadDepartment(treeNode){
      return new Promise(resolve => {
        queryDepartTreeSync({pid:treeNode.dataRef.id}).then((res) =>  {
          if (res.success) {
            //判断chidlren是否为空，并修改isLeaf属性值
            if(res.result.length == 0){
              treeNode.dataRef['isLeaf']=true
              return;
            }else{
              treeNode.dataRef['children']= res.result;
            }
          }
        })
        resolve();
      });
    },
    initUserNames() {
      if (this.userIds) {
        // 这里最后加一个 , 的原因是因为无论如何都要使用 in 查询，防止后台进行了模糊匹配，导致查询结果不准确
        let values = this.userIds.split(',') + ','
        let param = {[this.store]: values}
        getAction('/sys/user/getMultiUser', param).then((list)=>{
          this.selectionRows = []
          this.selectedUserDate = []
          let selectedRowKeys = []
          let textArray = []
          if(list && list.length>0){
            for(let user of list){
              textArray.push(user[this.text])
              selectedRowKeys.push(user['id'])
              this.selectionRows.push(user)
            }
          }
          this.selectedUserDate = this.selectionRows
          this.selectedRowKeys = selectedRowKeys
          this.$emit('initComp', textArray.join(','))
        })

      } else {
        // JSelectUserByDep组件bug issues/I16634
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
      getAction('/sys/user/queryUserComponentData', params).then(res=>{
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
    getQueryParams() {
      let param = Object.assign({}, this.queryParam, this.isorter);
      param.field = this.getQueryField();
      param.pageNo = this.ipagination.current;
      param.pageSize = this.ipagination.pageSize;
      param.departId = this.selectedDepIds.join(',')
      return filterObj(param);
    },
    queryDepartTree() {
      //for: 异步加载部门树
      this.expandedKeys = []
      this.departTree = []
      queryDepartTreeSync().then((res) => {
        if (res.success) {
          for (let i = 0; i < res.result.length; i++) {
            let temp = res.result[i]
            this.departTree.push(temp)
          }
        }
      })
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
      that.selectUserIds = [];
      that.selectedDepIds = [];
      if (num !== 0) {
        that.queryParam = {};
        that.loadData(1);
      }
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
    onSelectChange(selectedRowKeys, selectionRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedUserDate = selectionRows;
      selectionRows.forEach(row => pushIfNotExist(this.selectionRows, row, 'id'))
    },
    onSearch() {
      this.loadData(1);
    },
    // 根据选择的id来查询用户信息
    initQueryUserByDepId(selectedDepIds) {
      this.loading = true
      return queryUserByDepId({id: selectedDepIds.toString()}).then((res) => {
        if (res.success) {
          this.dataSource = res.result;
          this.ipagination.total = res.result.length;
        }
      }).finally(() => {
        this.loading = false
      })
    },
    /**
     * 清空选项数据
     */
    clearOptionsData() {
      this.selectedUser.ids = [];
      this.selectedUser.text = [];
      this.roleIds = [];
      this.deptIds = [];
    },
    /**
     * 更新节点数据
     */
    updateCopyItemList() {
      //先判断是否存在扩展属性、抄送属性和抄送向
      // 更新回扩展元素，如果扩展属性已经存在则直接赋值，如果不存在则创建
      const bpmnElementObj = this.bpmnElement?.businessObject;
      //是否存在extensionElements，不存在则创建
      let elExtensionElements = bpmnElementObj.get("extensionElements");
      //三种情况，1，没有extensionElements，2、有extensionElements但没有CopyItemList， 3、三者都存在
      if(elExtensionElements){
        // 这里有两种情况，1、value为空，2value不为空，但是没有CopyItemList
        let otherExtensions = []
        if(elExtensionElements.values){
          // 遍历values数组，返回数组中类型type不为flowable:CopyItemList的数组元素，如果没有则返回空数组
          otherExtensions = elExtensionElements.values.filter(ex => ex.$type !== `${this.prefix}:CopyItemList`);
        }
        
        this.copyItemElementList = window.bpmnInstances.moddle.create(`${this.prefix}:CopyItemList`, { copyItemList: [] });

        const extensions = window.bpmnInstances.moddle.create("bpmn:ExtensionElements", {
          values: otherExtensions.concat(this.copyItemElementList)
        });

        // 更新到元素上
        window.bpmnInstances.modeling.updateProperties(this.bpmnElement, {
          extensionElements: extensions
        });
      }else if(!elExtensionElements){
        let elExtensionElements = window.bpmnInstances.moddle.create("bpmn:ExtensionElements", { values: [] });
        // 遍历values数组，返回数组中类型type不为flowable:CopyItemList的数组元素，如果没有则返回空数组
        let otherExtensions = elExtensionElements.values.filter(ex => ex.$type !== `${this.prefix}:CopyItemList`);

        this.copyItemElementList = window.bpmnInstances.moddle.create(`${this.prefix}:CopyItemList`, { copyItemList: [] });

        const extensions = window.bpmnInstances.moddle.create("bpmn:ExtensionElements", {
          values: otherExtensions.concat(this.copyItemElementList)
        });
        //更新到元素上
        window.bpmnInstances.modeling.updateProperties(this.bpmnElement, {
          extensionElements: extensions
        });
      }

      this.copyItemElementList.copyItemList = (this.copyForItemList || []).map(item => {
        return window.bpmnInstances.moddle.create(`${this.prefix}:CopyItem`, {
          value: item.value,
          name: item.name,
          type: item.type
        });
      });
      window.bpmnInstances.modeling.updateModdleProperties(this.bpmnElement, this.copyItemElementList);
    },
    /**
     * 查询部门下拉树结构
     */
    getDeptOptions() {
      return new Promise((resolve, reject) => {
        if (!this.deptOptions || this.deptOptions.length <= 0) {
          treeselect().then(response => {
            this.deptTempOptions = response.data;
            this.deptOptions = response.data;
            resolve()
          })
        } else {
          reject()
        }
      });
    },
    /**
     * 查询部门下拉树结构（含部门前缀）
     */
    getDeptTreeData() {
      function refactorTree(data) {
        return data.map(node => {
          let treeData = { id: `DEPT${node.id}`, label: node.label, parentId: node.parentId, weight: node.weight };
          if (node.children && node.children.length > 0) {
            treeData.children = refactorTree(node.children);
          }
          return treeData;
        });
      }
      return new Promise((resolve, reject) => {
        if (!this.deptTreeData || this.deptTreeData.length <= 0) {
          this.getDeptOptions().then(() => {
            this.deptTreeData = refactorTree(this.deptOptions);
            resolve()
          }).catch(() => {
            reject()
          })
        } else {
          resolve()
        }
      })
    },
    /**
     * 查询部门下拉树结构
     */
    getRoleOptions() {
      if (!this.roleOptions || this.roleOptions.length <= 0) {
        getAction('/workflow/roleList').then(res=>{
        if (res.success) {
          this.roleOptions = res.result
        }
        }).finally(() => {
          this.loading = false
        })
      }
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 关闭标签
    handleClose(tag) {
      this.selectedUserDate.splice(this.selectedUserDate.indexOf(tag), 1);
      this.$refs.multipleTable.toggleRowSelection(tag);
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.selectedUserDate = selection;
    },
    onEditCopyForItem() {
      this.selectedUserDate = []
      this.$refs.multipleTable?.clearSelection();
      this.initUserNames()
      this.queryDepartTree();
      this.loadData();
      this.userOpen = true;
    },
    handleTaskUserComplete() {
      if (!this.selectedUserDate || this.selectedUserDate.length <= 0) {
        this.$modal.msgError('请选择用户');
        return;
      }
      let copyItemList = []
      this.selectedUser.text = this.selectedUserDate.map(k => k.realname) || [];
      if (this.selectedUserDate.length === 1) {
        let data = this.selectedUserDate[0];
        copyItemList.push({
          '$type':"flowable:CopyItem",
          'value': data.id,
          'name': data.realname,
          'type': 'user'
        })
        this.userIds = data.id;
        this.multiLoopType = 'Null';
      } else {
        copyItemList.push({
          '$type':"flowable:CopyItem",
          'value': this.selectedUserDate.map(k => k.id).join(',') || null,
          'name': this.selectedUserDate.map(k => k.realname).join(',') || null,
          'type': 'user'
        })
        this.userIds = this.selectedUserDate.map(k => k.id).join(',') || null;
      }
      this.copyForItemList = copyItemList
      this.updateCopyItemList()
      this.userOpen = false;
    },
    /**用户选择结束 */
    onDeleteCopyItem (row) {
      this.$confirm('是否删除此抄送人？').then(res => {
        let temp = (this.value || []).filter(item => {
          return row.type !== item.type;
        });
        this.$emit('input', temp);
      }).catch(e => {});
    },
    onCloseSubItem (row, item) {
      this.$confirm('是否移除此抄送人？').then(res => {
        let temp = (this.value || []).filter(copyItem => {
          if (row.type === copyItem.type) {
            if (copyItem.id == null || copyItem.id === '') return false;
            let tempIdList = (copyItem.id || '').split(',');
            tempIdList = tempIdList.filter(subItemId => {
              return subItemId !== item.id;
            });
            if (tempIdList.length <= 0) {
              return false;
            } else {
              copyItem.id = tempIdList.join(',');
              return true;
            }
          } else {
            return true;
          }
        });
        this.$emit('input', temp);
      }).catch(e => {});
    },
  },
  computed: {
    // 计算属性的 getter
    getType: function () {
      return this.multi == true ? 'checkbox' : 'radio';
    }
  },
  watch: {
    id: {
      immediate: true,
      handler() {
        this.bpmnElement = window.bpmnInstances.bpmnElement;
      }
    },
  },
  created() {
    // 该方法触发屏幕自适应
    this.resetScreenSize();
    this.loadData()
  },
  beforeDestroy () {
    this.bpmnElement = null;
  }
}
</script>

<style scoped lang="less">
  .full-line-btn {
    width: 100%;
    margin: 10px 0px;
  }

  .copy-select {
    &:deep(.el-tag){
      margin-right: 10px;
    }
  } 
</style>
