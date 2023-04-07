<template>
  <div>
    <el-row>
      <!-- <h4><b>审批人设置</b></h4> -->
      <el-radio-group v-model="dataType" @change="changeDataType">
        <el-radio label="USERS">指定用户</el-radio>
        <el-radio label="ROLES">角色</el-radio>
        <!-- <el-radio label="DEPTS">部门</el-radio> -->
        <el-radio label="INITIATOR">发起人</el-radio>
        <el-radio label="MANAGER">直接主管</el-radio>
      </el-radio-group>
      <div style="display:flex;padding-bottom: 8px">
        <span>
          <el-tooltip placement="top-start">
            <div slot="content">如果开启执行人相同时跳过，在当前节点执行人与<br/>已处理节点执行人相同时自动完成当前节点</div>
            <i class="header-icon el-icon-info"></i>
          </el-tooltip>
          <span>执行人相同时跳过&ensp;</span>
        </span>
        <el-switch v-model="skipFlag" @change="autoComplete" />
      </div>
    </el-row>
    <el-row>
      <div v-if="dataType === 'USERS'">
        <el-tag v-for="userText in selectedUser.text" :key="userText" effect="plain">
          {{userText}}
        </el-tag>
        <div class="element-drawer__button">
          <el-button size="mini" type="primary" icon="el-icon-plus" @click="onSelectUsers()">添加用户</el-button>
        </div>
      </div>
      <div v-if="dataType === 'ROLES'">
        <el-select v-model="roleIds" multiple size="mini" placeholder="请选择 角色" @change="changeSelectRoles">
          <el-option
            v-for="item in roleOptions"
            :key="item.roleId"
            :label="item.roleName"
            :value="item.roleId"
            :disabled="item.status === 1">
          </el-option>
        </el-select>
      </div>
      <div v-if="dataType === 'DEPTS'">
        <tree-select
          :width="320"
          :height="400"
          size="mini"
          :data="deptTreeData"
          :defaultProps="deptProps"
          multiple
          clearable
          checkStrictly
          nodeKey="id"
          :checkedKeys="deptIds"
          @checked-change="checkedDeptChange">
        </tree-select>
      </div>
    </el-row>
    <el-row>
      <div v-show="showMultiFlog">
        <el-divider />
        <h4><b>多实例审批方式</b></h4>
        <el-row>
          <el-radio-group v-model="multiLoopType" @change="changeMultiLoopType">
            <el-row><el-radio label="Null">无</el-radio></el-row>
            <el-row><el-radio label="SequentialMultiInstance">会签（需所有审批人同意）</el-radio></el-row>
            <el-row><el-radio label="ParallelMultiInstance">或签（一名审批人同意即可）</el-radio></el-row>
          </el-radio-group>
        </el-row>
        <el-row v-if="multiLoopType !== 'Null'">
          <el-tooltip content="开启后，实例需按顺序轮流审批" placement="top-start" @click.stop.prevent>
            <i class="header-icon el-icon-info"></i>
          </el-tooltip>
          <span class="custom-label">顺序审批：</span>
          <el-switch v-model="isSequential" @change="changeMultiLoopType" />
        </el-row>
      </div>
    </el-row>

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
  </div>

</template>

<script>
// import { treeselect } from '@/api/system/dept'
import TreeSelect from "@/plugins/modal/TreeSelectModal";
import { pushIfNotExist, filterObj } from '@/utils/util'
import { createListenerObject, updateElementExtensions, uuid } from "../../../utils";
import { queryUserByDepId, queryDepartTreeSync} from '@/api/api'
import { getAction } from '@/api/manage'
import { isEmpty } from "lodash";

const userTaskForm = {
  dataType: '',
  assignee: '',
  candidateUsers: '',
  candidateGroups: '',
  text: '',
  // dueDate: '',
  // followUpDate: '',
  // priority: ''
}

export default {
  name: "UserTask",
  inject: {
    prefix: "prefix"
  },
  props: {
    id: String,
    type: String,
    modalWidth: {
      type: Number,
      default: 1250,
      required: false
    },
    value: {
      type: String,
      required: false
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    multi: {
      type: Boolean,
      default: false,
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
  components: { TreeSelect },
  data() {
    return {
      loading: false,
      dataType: 'USERS',
      selectedUser: {
        ids: [],
        text: []
      },
      otherExtensionList: [],
      skipFlag: false,
      userOpen: false,
      deptName: undefined,
      deptOptions: [],
      deptProps: {
        children: "children",
        label: "label"
      },
      deptTempOptions: [],
      userTableList: [],
      userTotal: 0,
      selectedUserDate: [],
      roleOptions: [],
      roleIds: [],
      deptTreeData: [],
      deptIds: [],
      // 查询参数
      queryParams: {
        deptId: undefined
      },
      showMultiFlog: false,
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
      }
    };
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
        this.$nextTick(() => this.resetTaskForm());
      }
    },
    userIds: {
      immediate: true,
      handler() {
        this.initUserNames()
      }
    },
  },
  beforeDestroy() {
    this.bpmnElement = null
  },
  created() {
    // 该方法触发屏幕自适应
    this.resetScreenSize();
    this.loadData()
  },
  methods: {
    resetTaskForm() {
      const bpmnElementObj = this.bpmnElement?.businessObject;
      if (!bpmnElementObj) {
        return;
      }
      this.clearOptionsData()
      this.dataType = bpmnElementObj['dataType'];
      if (this.dataType === 'USERS') {
        let userIdData = bpmnElementObj['candidateUsers'] || bpmnElementObj['assignee'];
        let userText = bpmnElementObj['text'] || [];
        if (userIdData && userIdData.toString().length > 0 && userText && userText.length > 0) {
          this.userIds = userIdData.toString();
          this.selectedUser.ids = userIdData?.toString().split(',');
          this.selectedUser.text = userText?.split(',');
        }
        if (this.selectedUser.ids.length > 1) {
          this.showMultiFlog = true;
        }
      } else if (this.dataType === 'ROLES') {
        this.getRoleOptions();
        let roleIdData = bpmnElementObj['candidateGroups'] || [];
        if (roleIdData && roleIdData.length > 0) {
          this.roleIds = roleIdData.split(',')
        }
        this.showMultiFlog = true;
      } else if (this.dataType === 'DEPTS') {
        this.getDeptTreeData().then(() => {
          let deptIdData = bpmnElementObj['candidateGroups'] || [];
          if (deptIdData && deptIdData.length > 0) {
            this.deptIds = deptIdData.split(',');
          }
        });
        this.showMultiFlog = true;
      }
      this.getElementLoop(bpmnElementObj);
      // 判断跳过事件是否开启
      let skipListener = this.bpmnElement.businessObject?.extensionElements?.values?.filter((ex) => {
        if(ex.$type === `${this.prefix}:TaskListener` && ex.eventType === "skip"){
          return true;
        }
      }) ?? [];
      if(skipListener && skipListener.length > 0){
        this.skipFlag = true;
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
      this.skipFlag = false;
    },
    /**
     * 跟新节点数据
     */
    updateElementTask() {
      const taskAttr = Object.create(null);
      for (let key in userTaskForm) {
          taskAttr[key] = userTaskForm[key];
      }
      window.bpmnInstances.modeling.updateProperties(this.bpmnElement, taskAttr);
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
    onSelectUsers() {
      this.selectedUserDate = []
      this.$refs.multipleTable?.clearSelection();
      //this.getDeptOptions();
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
      userTaskForm.dataType = 'USERS';
      this.selectedUser.text = this.selectedUserDate.map(k => k.realname) || [];
      if (this.selectedUserDate.length === 1) {
        let data = this.selectedUserDate[0];
        userTaskForm.assignee = data.id;
        this.userIds = data.id;
        userTaskForm.text = data.realname;
        userTaskForm.candidateUsers = null;
        this.showMultiFlog = false;
        this.multiLoopType = 'Null';
        this.changeMultiLoopType(this.multiLoopType);
      } else {
        userTaskForm.candidateUsers = this.selectedUserDate.map(k => k.id).join() || null;
        userTaskForm.text = this.selectedUserDate.map(k => k.realname).join() || null;
        userTaskForm.assignee = null;
        this.showMultiFlog = true;
      }
      this.updateElementTask()
      this.userOpen = false;
    },
    changeSelectRoles(val) {
      userTaskForm.dataType = 'ROLES';
      userTaskForm.candidateGroups = val.join() || null;
      let textArr = this.roleOptions.filter(k => val.indexOf(`ROLE${k.roleId}`) >= 0);
      userTaskForm.text = textArr?.map(k => k.roleName).join() || null;
      this.updateElementTask();
    },
    checkedDeptChange(checkedIds, checkedData) {
      userTaskForm.dataType = 'DEPTS';
      if (checkedIds && checkedIds.length > 0) {
        this.deptIds = checkedIds;
      }
      if (checkedData && checkedData.length > 0) {
        userTaskForm.candidateGroups = checkedData.map(k => k.id).join() || null
        userTaskForm.text = checkedData.map(k => k.label).join() || null
        this.updateElementTask();
      }
    },
    changeDataType(val) {
      // 清空 userTaskForm 所有属性值
      Object.keys(userTaskForm).forEach(key => userTaskForm[key] = null);
      userTaskForm.dataType = val;
      if (val === 'USERS') {
        if (this.selectedUser && this.selectedUser.ids && this.selectedUser.ids.length > 0) {
          if (this.selectedUser.ids.length === 1) {
            userTaskForm.assignee = this.selectedUser.ids[0];
          } else {
            userTaskForm.candidateUsers = this.selectedUser.ids.join()
          }
          userTaskForm.text = this.selectedUser.text?.join() || null
        }
        this.removeEventListener('assignee')
      } else if (val === 'ROLES') {
        this.getRoleOptions();
        if (this.roleIds && this.roleIds.length > 0) {
          userTaskForm.candidateGroups = this.roleIds.join() || null;
          let textArr = this.roleOptions.filter(k => this.roleIds.indexOf(`ROLE${k.roleId}`) >= 0);
          userTaskForm.text = textArr?.map(k => k.roleName).join() || null;
        }
        this.removeEventListener('assignee')
      } else if (val === 'DEPTS') {
        this.getDeptTreeData();
        if (this.deptIds && this.deptIds.length > 0) {
          userTaskForm.candidateGroups = this.deptIds.join() || null;
          let textArr = []
          let treeStarkData = JSON.parse(JSON.stringify(this.deptTreeData));
          this.deptIds.forEach(id => {
            let stark = []
            stark = stark.concat(treeStarkData);
            while(stark.length) {
              let temp = stark.shift();
              if(temp.children) {
                stark = temp.children.concat(stark);
              }
              if(id === temp.id) {
                textArr.push(temp);
              }
            }
          })
          userTaskForm.text = textArr?.map(k => k.label).join() || null;
        }
        this.removeEventListener('assignee')
      } else if (val === 'INITIATOR') {
        userTaskForm.assignee = "${initiator}";
        userTaskForm.text = "流程发起人";
      }else if(val == "MANAGER"){
        this.otherExtensionList = this.bpmnElement.businessObject?.extensionElements?.values?.filter(ex => ex.$type !== `${this.prefix}:TaskListener` 
        || (ex.$type === `${this.prefix}:TaskListener` && isEmpty(ex.eventType)) 
        || (ex.$type === `${this.prefix}:TaskListener` && ex.eventType !== 'assignee')) ?? [];
        let listenerForm = {"$type":"flowable:TaskListener","event":"create","class":"org.jeecg.modules.listener.SetDirectorApproverListener","fields":[],"listenerType":"classListener","id":`Listener_${uuid(8)}`,"eventType": "assignee"};
        const listenerObject = createListenerObject(listenerForm, true, "flowable");
        // let bpmnElementListeners = this.bpmnElement.businessObject?.extensionElements?.values?.filter(ex => ex.$type === `${this.prefix}:TaskListener`) ?? [];
        // bpmnElementListeners.push(listenerObject);
        updateElementExtensions(this.bpmnElement, this.otherExtensionList.concat(listenerObject));
      }
      this.updateElementTask();
      if (val === 'ROLES' || val === 'DEPTS' || (val === 'USERS' && this.selectedUser.ids.length > 1)) {
        this.showMultiFlog = true;
      } else {
        this.showMultiFlog = false;
      }
      this.multiLoopType = 'Null';
      this.changeMultiLoopType(this.multiLoopType);
    },
    // 移除事件
    removeEventListener(type){
      this.otherExtensionList = this.bpmnElement.businessObject?.extensionElements?.values?.filter(ex => ex.$type !== `${this.prefix}:TaskListener` 
      || (ex.$type === `${this.prefix}:TaskListener` && isEmpty(ex.eventType)) 
      || (ex.$type === `${this.prefix}:TaskListener` && ex.eventType !== type)) ?? [];
      updateElementExtensions(this.bpmnElement, this.otherExtensionList);
    },
    // 审批人处理策略
    autoComplete (val) {
      if(val){
        this.otherExtensionList = this.bpmnElement.businessObject?.extensionElements?.values?.filter(ex => ex.$type !== `${this.prefix}:TaskListener` 
        || (ex.$type === `${this.prefix}:TaskListener` && isEmpty(ex.eventType)) 
        || (ex.$type === `${this.prefix}:TaskListener` && ex.eventType !== 'skip')) ?? [];
        let listenerForm = {"$type":"flowable:TaskListener","event":"create","class":"org.jeecg.modules.listener.SkipNextNodeListener","fields":[],"listenerType":"classListener","id":`Listener_${uuid(8)}`,"eventType": "skip"};
        const listenerObject = createListenerObject(listenerForm, true, "flowable");
        // let bpmnElementListeners = this.bpmnElement.businessObject?.extensionElements?.values?.filter(ex => ex.$type === `${this.prefix}:TaskListener`) ?? [];
        // bpmnElementListeners.push(listenerObject);
        updateElementExtensions(this.bpmnElement, this.otherExtensionList.concat(listenerObject));
      }else{
        this.removeEventListener('skip')
      }
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
    changeMultiLoopType(type) {
      // 取消多实例配置
      if (type === "Null") {
        window.bpmnInstances.modeling.updateProperties(this.bpmnElement, { loopCharacteristics: null });
        return;
      }
      this.multiLoopInstance = window.bpmnInstances.moddle.create("bpmn:MultiInstanceLoopCharacteristics", { isSequential: this.isSequential });
      // 更新多实例配置
      window.bpmnInstances.modeling.updateProperties(this.bpmnElement, {
        loopCharacteristics: this.multiLoopInstance,
        assignee: '${assignee}'
      });
      // 完成条件
      let completionCondition = null;
      // 会签
      if (type === "SequentialMultiInstance") {
        completionCondition = window.bpmnInstances.moddle.create("bpmn:FormalExpression", { body: "${nrOfCompletedInstances >= nrOfInstances}" });
      }
      // 或签
      if (type === "ParallelMultiInstance") {
        completionCondition = window.bpmnInstances.moddle.create("bpmn:FormalExpression", { body: "${nrOfCompletedInstances > 0}" });
      }
      // 更新模块属性信息
      window.bpmnInstances.modeling.updateModdleProperties(this.bpmnElement, this.multiLoopInstance, {
        collection: '${multiInstanceHandler.getUserIds(execution)}',
        elementVariable: 'assignee',
        completionCondition
      });
    },
  }
};
</script>

<style scoped lang="scss">
.el-row .el-radio-group {
  margin-bottom: 15px;
  .el-radio {
    line-height: 28px;
    margin-right: 15px !important;
  }
}
.el-tag {
  margin-bottom: 10px;
  + .el-tag {
    margin-left: 10px;
  }
}

.custom-label {
  padding-left: 5px;
  font-weight: 500;
  font-size: 14px;
  color: #606266;
}

.ant-tree-directory{
  overflow-x: hidden;
}

</style>
