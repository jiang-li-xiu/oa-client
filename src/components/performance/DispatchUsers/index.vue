<template>
  <div>
    <!-- 选择派遣人Dialog -->
    <el-dialog @open="openDialog" @close="close" :visible.sync="show" :modal="false" width="55%">
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
            <egrid ref="multipleTable"
                   v-loading="loading"
                   max-height="500"
                   :data="data"
                   :columns="columns"
                   :column-type="colType"
                   :columns-schema="columnsSchema"
                   @selection-change="selectionChange"
                   @select-all="handleSelectAll"
                   @select="handleSelect"
            />

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
        <el-button type="primary" size="small" @click="resetAllChecked">清除已选</el-button>
        <el-button type="primary" size="small" @click="save">确 定</el-button>
        <el-button @click="show = false" size="small">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue';
import {listUser, listByNames} from "@/api/performance/system/user";
import {treeselect} from "@/api/performance/system/dept";
import tableChecked from '@/utils/performance/table-checked'

const columns = [
  {prop: 'userId', label: '用户编号'},
  {prop: 'nickName', label: '用户昵称'},
  {prop: 'dept.deptName', label: '部门'}
]

export default {
  name: "DispatchUsers",
  mixins: [tableChecked],
  data() {
    return {
      // 用户数据列表
      data: [],
      selectedData: [],
      unionKey: ['userId'], // 统一标识key集合
      // 相当于 Element Table-column 的 type 属性，用于支持功能特殊的功能列（多选、索引、折叠行），不设置则不显示功能列
      colType: 'selection',
      // 用于控制表格列渲染
      columns: columns,
      // Object 可以用来单独定义 columns 的某一列，这里的设置会覆盖 columnsProps 的配置属性
      // 使用 Element Table-column 中 label 值进行匹配
      columnsSchema: {
        '部门': {
          propsHandler({col, row}) {
            if (row.dept === null) {
              return {deptName: '—— ——'}
            }
            return {deptName: row.dept.deptName}
          },
          component: Vue.extend({
            props: ['deptName'],
            render(h) {
              return h('div', this.deptName)
            }
          })
        }
      },
      selectedRows: [], // 当前列表页选择的数据项
      // 总记录数
      total: 0,
      // 选中id列表
      ids: [],
      // 加载状态
      loading: false,
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
    visible: {
      type: Boolean,
      default: false
    },
    selected: {
      type: String,
      default() {
        return '';
      }
    },
    selectedList: {
      type: Array,
      default() {
        return []
      }
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
    }
  },
  computed: {
    show: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    },
  },
  created() {
    this.getTreeselect()
  },
  mounted() {
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    getList() {
      this.loading = true
      this.updateTableSelection(this.data, this.selectedRows, this.unionKey)

      listUser(this.queryParams).then(response => {
          this.data = response.rows;
          this.total = response.total;
          this.loading = false
          this.buildTableSelection(this.data, 'multipleTable', this.unionKey)
        }
      );
    },
    // 获取并设置父组件传来的值
    getAndSetParentVal() {
      if (!this.isMultiple) {
        this.singleChoice()
        return
      }
      this.multipleChoice()
    },
    // 单选
    singleChoice() {
      if (this.selected !== undefined && this.selected !== null && this.selected !== '') {
        const ids = this.selected.split(',');
        if (ids.length === 0 || ids.length !== 1) {
          return;
        }

        listByNames(ids).then(response => {
          this.selectedData = response.data
          this.totalCheckedList = this.selectedData // 将selectedList放进去回显选中状态
        })
        return
      }

      if (this.selectedList.length === 0 || this.selectedList.length === 1) {
        return;
      }
      this.totalCheckedList = this.selectedList
    },
    // 多选
    multipleChoice() {
      if (this.selected !== undefined && this.selected !== null && this.selected !== '') {
        const ids = this.selected.split(',');
        if (ids.length === 0) {
          return;
        }

        listByNames(ids).then(response => {
          this.selectedData = response.data
          this.totalCheckedList.push(...this.selectedData) // 将selectedList放进去回显选中状态
        })
        return
      }

      this.totalCheckedList.push(...this.selectedList)
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
    // 取消全部选择
    resetAllChecked() {
      this.selectedRows = [] // 清空当前列表页选择的数据项
      this.totalCheckedList = [] // 清空已选择的数据项
      this.$refs.multipleTable.clearSelection() // 清除全部的选中状态
    },
    // Dialog 打开的回调
    openDialog() {
      this.totalCheckedList = [] // 清空选择的数据项
      this.getAndSetParentVal()
      this.getList()
    },
    // 当选择项发生变化时会触发该事件
    selectionChange(val) {
      // 为单选时跳过
      if (!this.isMultiple) {
        this.totalCheckedList = []
        if (val[val.length - 1] !== undefined) {
          this.selectedRows = new Array(val[val.length - 1])
        }
        return
      }

      this.selectedRows = val
    },
    // 点击全选时调用
    handleSelectAll(select) {
      // 多选时跳过
      if (this.isMultiple) {
        return;
      }

      // this.$message.warning('此模式为单选状态，无法点击全选按钮！')
      // 清除已选的数据
      this.$refs.multipleTable.clearSelection();
      this.totalCheckedList = []
      if (this.totalCheckedList.length === 0) { // 判断selection是否有值存在
        return;
      }
      this.$refs.multipleTable.toggleRowSelection(this.totalCheckedList[0], true);
    },
    // 点击多选框调用
    handleSelect(select, row) {
      // 为多选时跳过
      if (this.isMultiple) {
        return;
      }

      // 清除已选的数据
      this.$refs.multipleTable.clearSelection();
      this.totalCheckedList = []
      if (select.length === 0) { // 判断selection是否有值存在
        // 表示未选择或者取消选择
        this.selectedRows = []
        return;
      }
      this.selectedRows = new Array(row)
      // 回显数据
      this.$refs.multipleTable.toggleRowSelection(row, true);
    },
    // Dialog 关闭的回调
    close() {
      this.queryParams.pageNum = 1
      this.queryParams.pageSize = 10
      this.data = []
    },
    // 确定
    save() {
      this.updateTableSelection(this.data, this.selectedRows, this.unionKey)
      // 调用自定义事件，向父组件传值
      this.$emit('on-chose', this.totalCheckedList)
      this.selectedRows = []
      this.show = false
    }
  },
}
</script>

<style scoped>
</style>
