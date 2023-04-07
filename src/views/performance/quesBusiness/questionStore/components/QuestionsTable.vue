<!--
 * @Author: Yelucc
 * @Date: 2021-03-22 14:00:14
 * @LastEditors: Yelucc
 * @LastEditTime: 2021-04-19 09:22:38
 * @Description: 
-->
<template>
  <div>
    <el-table
      ref="multipleTable"
      v-loading="loading"
      :data="data"
      :row-key="getRowKeys"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" :reserve-selection="true" />
      <el-table-column label="问题ID" align="center" prop="qid" />
      <el-table-column label="问题" align="center" prop="qtitle" />
      <el-table-column label="选项:分值" align="center" prop="qselect">
        <template slot-scope="scope">
          <div
            v-for="(item, index) in JSON.parse(scope.row.qselect)"
            :key="index"
          >
            <i class="el-icon-edit"></i>
            <span>{{ item.q }}:{{ item.s }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="多选标记"
        align="center"
        prop="isMultiple"
        :formatter="isMultipleFormat"
      >
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.isMultiple === 1">{{
            selectDictLabel(isMultipleOptions, scope.row.isMultiple)
          }}</el-tag>
          <el-tag type="warning" v-if="scope.row.isMultiple === 0">{{
            selectDictLabel(isMultipleOptions, scope.row.isMultiple)
          }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        v-if="
          handleSwitch.indexOf('U') != -1 || handleSwitch.indexOf('D') != -1
        "
      >
        <template slot-scope="scope">
          <el-button
            v-if="handleSwitch.indexOf('U') != -1"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['business:questionStore:edit']"
            >修改</el-button
          >
          <el-button
            v-if="handleSwitch.indexOf('D') != -1"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['business:questionStore:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "QuestionsTable",
  props: {
    data: {
      type: Array,
      default: () => {
        return [];
      },
    },
    multipleList:{
      type: Array,
      default: () => {
        return [];
      },
    },
    load: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    handleSwitch: {
      type: String,
      default: () => {
        return "UD";
      },
    },
  },
  data() {
    return {
      // 显示搜索条件
      showSearch: true,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 题库表格数据
      questionStoreList: [],
      // 遮罩层
      loading: false,
      // 多选标记字典
      isMultipleOptions: [],
    };
  },
  created() {
    // console.log(this.data);
    this.getDicts("MULTIPLE").then((response) => {
      this.isMultipleOptions = response.data;
    });
    // console.log("multipleList",this.multipleList); 
    this.multipleList.forEach(item=>{
      this.$refs['multipleTable'].toggleRowSelection(item)
    })

  },
  mounted(){  
    // console.log("multipleList",this.multipleList); 
    this.multipleList.forEach(item=>{
      this.$refs['multipleTable'].toggleRowSelection(item)
    })
  },
  watch: {
    multipleList:{
      handler(n){
        console.log("multipleList",n);
        n.forEach(item=>{
          this.$refs['multipleTable'].toggleRowSelection(item)
        })
      }
    },
    data: {
      handler(n) {
        // console.log("data",n)
        this.questionStoreList = n;
        // console.log(this.questionStoreList);
      },
    },
    load: {
      handler(n) {
        this.loading = n;
      },
    },
  },
  methods: {
    getRowKeys(row){
      return row.qid
    },
    /** 查询题库列表 */
    getList() {
      this.$emit("getList");
    },
    // 多选标记字典翻译
    isMultipleFormat(row, column) {
      return this.selectDictLabel(this.isMultipleOptions, row.isMultiple);
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.$emit("handleUpdate", row);
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$emit("handleDelete", row);
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.$emit("handleSelectionChange", selection);
    },
  },
};
</script>

<style>
</style>