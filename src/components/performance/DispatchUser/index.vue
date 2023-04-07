<template>
  <div>
    <el-input :placeholder="selectTitle" v-model="userArrayList" class="input-with-select"
              :disabled="true">
      <el-button slot="append" icon="el-icon-search" @click="selectSend()"></el-button>
    </el-input>
    <!-- 选择派遣人Dialog -->
    <el-dialog :title="selectTitle" :visible.sync="open" :modal="false" width="55%">
      <div class="el-dialog-div">
        <el-row :gutter="20">
          <!--部门数据-->
          <el-col :span="7" :xs="24">
            <div class="head-container">
              <el-input
                v-model="deptName"
                placeholder="请输入部门名称"
                clearable
                size="small"
                prefix-icon="el-icon-search"
                style="margin-bottom: 20px"
              />
            </div>
            <div class="head-container">
              <el-tree
                :data="deptOptions"
                :props="defaultProps"
                :expand-on-click-node="false"
                :filter-node-method="filterNode"
                ref="tree"
                default-expand-all
                @node-click="handleNodeClick"
              />
            </div>
          </el-col>
          <el-col :span="17" :xs="24">
            <el-form :model="queryParams" ref="queryUserForm" :inline="true" v-show="showSearch" label-width="80px">
              <el-form-item label="用户名称" prop="nickName">
                <el-input
                  v-model="queryParams.nickName"
                  placeholder="请输入用户名称"
                  clearable
                  size="small"
                  style="width: 240px"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
              <el-form-item label="手机号码" prop="phonenumber">
                <el-input
                  v-model="queryParams.phonenumber"
                  placeholder="请输入手机号码"
                  clearable
                  size="small"
                  style="width: 240px"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
              </el-form-item>
            </el-form>
            <el-table ref="list" v-loading="loading" :data="list" max-height="500" @row-click="rowClick" @selection-change="handleSelectionChange"
                      @select="handleSelect" @select-all="handleSelectAll" :row-key="getRowKeys">
              <el-table-column type="selection" width="50" align="center" :reserve-selection="true"></el-table-column>
              <el-table-column label="用户编号" align="center" key="userId" prop="userId"/>
              <el-table-column label="用户昵称" align="center" key="nickName" prop="nickName"
                               :show-overflow-tooltip="true"/>
              <el-table-column label="部门" align="center" key="deptName" prop="dept.deptName"
                               :show-overflow-tooltip="true"/>
            </el-table>
            <pagination
              v-show="total>0"
              :total="total"
              :page.sync="queryParams.pageNum"
              :limit.sync="queryParams.pageSize"
              @pagination="getList"
            />
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="clearSelect">清除已选</el-button>
        <el-button type="primary" size="small" @click="open = false">确 定</el-button>
        <el-button @click="open = false" size="small">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {listUser, listByNames} from "@/api/performance/system/user";
import {treeselect} from "@/api/performance/system/dept";

export default {
  name: "DispatchUser",
  data() {
    return {
      // 总记录数
      total: 0,
      // 用户列表
      list: [],
      // 选中id列表
      ids: [],
      // 选中用户列表
      userList: [],
      // 临时数组
      tempList: [],
      // 加载状态
      loading: false,
      // 是否打开会话框
      open: false,
      // 是否显示搜索列表
      showSearch: true,
      // 派遣人
      acceptanceBy: '',
      // 部门名称
      deptName: '',
      // 部门树选项
      deptOptions: undefined,
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 用户查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
        nickName: undefined,
        phonenumber: undefined,
        status: undefined,
        deptId: undefined
      },
    }
  },
  props: {
    // 搜索标题
    selectTitle: {
      type: String,
      default: '选择用户'
    },
    // 是否多选
    isMultiple: {
      required: true,
      type: Boolean,
      default: false
    },
    // 分隔符
    separator: {
      type: String,
      default: '/'
    },
    idArray: {
      type: String,
      default() {
        return ''
      }
    },
    userArray: {
      type: String,
      default() {
        return ''
      }
    },
    userNamesString: {
      type: String,
      default: undefined
    },
    userNameArray: {
      type: String,
      default: undefined
    }
  },
  computed: {
    userIds: {
      get() {
        return this.ids
        // return ','.join(this.ids)
      },
      set(val) {
        this.ids = val.map(user => user.userName)
        // 传值到父组件
        this.$emit('update:idArray', this.ids.join(','))
      }
    },
    userArrayList: {
      get() {
        return this.userList.map(user => user.nickName).join(` ${this.separator.trim()} `)
        // return ','.join(this.userList.map(user => user.nickName).join(` ${this.separator.trim()} `))
      },
      set(val) {
        this.userList = val
        // 传值到父组件
        // this.$emit('update:userArray', this.userList)
        // this.$emit('update:userArray', this.userList.join(","))
        this.$emit('update:userArray', JSON.stringify(this.userList))
        this.$emit('update:nickNames', this.userList.map(user => user.nickName).join(` ${this.separator.trim()} `))
      }
    }
  },
  created() {
    this.getList()
    this.getTreeselect()
  },
  mounted() {
    this.getEchoData(this.userNameArray)
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val);
    },
    // 监听父组件传过来的值
    idArray(val) {
      if (val === null) {
        this.clearSelect()
        return
      }

      this.getEchoData(val)
      this.setEchoData()
    }
  },
  methods: {
    getList() {
      this.loading = true
      listUser(this.queryParams).then(response => {
          this.list = response.rows;
          this.total = response.total;
          this.loading = false
          this.setEchoData()
        }
      );
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.userName = ''
      this.queryParams.phonenumber = null
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框内容变化时调用
    handleSelectionChange(selection) {
      // 为单选时跳过
      if (!this.isMultiple) {
        return
      }

      const selectionList = this.unique(selection)
      this.userArrayList = selectionList
      this.userIds = selectionList
    },
    // 点击多选框调用
    handleSelect(select, row) {
      // 为多选时跳过
      if (this.isMultiple) {
        return;
      }

      // 清除已选的数据
      this.$refs.list.clearSelection();
      if (select.length === 0) { // 判断selection是否有值存在
        // 表示未选择或者取消选择
        this.userList = []
        return;
      }
      // 回显数据
      this.$refs.list.toggleRowSelection(row, true);
      this.userArrayList = new Array(row)
      this.userIds = new Array(row)
    },
    // 点击全选时调用
    handleSelectAll(select) {
      // 多选时跳过
      if (this.isMultiple) {
        return;
      }

      // this.$message.warning('此模式为单选状态，无法点击全选按钮！')
      // 清除已选的数据
      this.$refs.list.clearSelection();
      if (this.userList.length === 0) { // 判断selection是否有值存在
        return;
      }
      this.$refs.list.toggleRowSelection(this.userList[0], true);
    },
    // 指定id
    getRowKeys(row) {
      return row.userId
    },
    // 选择派遣操作
    selectSend() {
      this.open = true;
      this.setEchoData()
    },
    // 获取父组件传来的值
    getEchoData(val) {
      // 为空跳过
      if (val === '' || val === undefined || val === null) {
        return
      }

      listByNames(val.split(',')).then(response => {
        this.userList = response.data
      })
    },
    // 设置回显数据
    setEchoData() {
      if (this.userList.length === 0) {
        return
      }

      // DOM加载完成之后调用
      if (this.$refs.list) {
        this.$nextTick(() => {
          console.log(this.userList)
          if (this.userList.length === 0) {
            return
          }

          this.userList.forEach(user => {
            this.list.forEach(item => {
              if (item.userId === user.userId) {
                this.$refs.list.toggleRowSelection(item, true);
              }
            })
          })
        })
      }
    },
    // 点击表格行触发
    rowClick(row) {
      // 为多选时跳过
      if (this.isMultiple) {
        this.$refs.list.toggleRowSelection(row);
        return;
      }

      // 清除已选的数据
      this.$refs.list.clearSelection();
      // 回显数据
      this.$refs.list.toggleRowSelection(row, true);
      this.userArrayList = new Array(row)
      this.userIds = new Array(row)
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then(response => {
        this.deptOptions = response.data;
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.deptId = data.id;
      this.getList();
    },
    // 清除已选择的内容
    clearSelect() {
      // 清除已选的数据
      if (this.$refs.list !== undefined) {
        this.$refs.list.clearSelection();
      }
      this.userList = []
    },
    // 去重
    unique(arr) { // 根据唯一标识orderId来对数组进行过滤
      const res = new Map();  //定义常量 res,值为一个Map对象实例
      //返回arr数组过滤后的结果，结果为一个数组   过滤条件是，如果res中没有某个键，就设置这个键的值为1
      return arr.filter((arr) => !res.has(arr.userId) && res.set(arr.userId, 1))
    },
  },
}
</script>

<style scoped>
/*.el-dialog-div {
  height: 50%;
  overflow: scroll;
}*/
</style>
