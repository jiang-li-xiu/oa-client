<template>
  <div class="app-container">
    <div class="bg-border-color-10">
      <div class="flex-center">
        <img src="@/assets/images/look-over.png" alt="" class="list-img" />
        <p class="font-15 font-700 color-50">筛选查询</p>
      </div>
      <el-form
        class="mt20"
        :model="queryParams"
        ref="queryForm"
        :inline="true"
        v-show="showSearch"
        label-width="70px"
      >
        <el-form-item label="问题ID" prop="qid">
          <el-input
            v-model="queryParams.qId"
            placeholder="请输入问题ID"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="问题" prop="qtitle">
          <el-input
            v-model="queryParams.qTitle"
            placeholder="请输入问题"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleQuery"
            >搜索</el-button
          >
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <div class="bg-border-color-10">
      <div class="flex-align-between">
        <div class="flex-align-center mb10">
          <img src="@/assets/images/list.png" alt="" class="list-img mr10" />
          <p class="color-50 font-15 font-700">数据列表</p>
        </div>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['business:questionStore:add']"
              >新增</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              plain
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['business:questionStore:edit']"
              >修改</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['business:questionStore:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['business:questionStore:export']"
              >导出</el-button
            >
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList">
          </right-toolbar>
        </el-row>
      </div>

      <questions-table
        :load="loading"
        :data="questionStoreList"
        @handleUpdate="handleUpdate"
        @handleDelete="handleDelete"
        @handleSelectionChange="handleSelectionChange"
      ></questions-table>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>

    <add-questions-dialog
      :title="title"
      :open.sync="open"
      :data="form"
      @cancel="cancel"
    ></add-questions-dialog>
  </div>
</template>

<script>
import {
  listQuestionStore,
  getQuestionStore,
  delQuestionStore,
  addQuestionStore,
  updateQuestionStore,
  exportQuestionStore,
} from "@/api/performance/questionStore";
import addQuestionsDialog from "@/views/performance/quesBusiness/questionStore/components/addQuestionsDialog";
import QuestionsTable from "@/views/performance/quesBusiness/questionStore/components/QuestionsTable";
export default {
  name: "QuestionStore",
  components: {
    addQuestionsDialog,
    QuestionsTable,
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 题库表格数据
      questionStoreList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 多选标记字典
      isMultipleOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        qid: null,
        qtitle: null,
        qTitle: null,
        qselect: null,
        qselectScore: null,
        isMultiple: null,
        deleteStatus: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询题库列表 */
    getList() {
      this.loading = true;
      listQuestionStore(this.queryParams).then((response) => {
        this.questionStoreList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
      this.getList();
    },
    // 表单重置
    reset() {
      this.form = {
        qid: null,
        qtitle: null,
        qTitle: null,
        qselect: null,
        qselectScore: null,
        createBy: null,
        isMultiple: 0,
        createTime: null,
        updateBy: null,
        updateTime: null,
        deleteStatus: 0,
        deleteBy: null,
        deleteTime: null,
      };

      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      (this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        qid: null,
        qtitle: null,
        qTitle: null,
        qselect: null,
        qselectScore: null,
        isMultiple: null,
        deleteStatus: null,
      }),
        this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.qid);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加题目";
    },

    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const qid = row.qid || this.ids;
      getQuestionStore(qid).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改题目";
      });
      this.getList();
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.qid != null) {
            updateQuestionStore(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addQuestionStore(this.form).then((response) => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const qIds = row.qid || this.ids;
      this.$confirm('是否确认删除题目编号为"' + qIds + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delQuestionStore(qIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有题目数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportQuestionStore(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        });
    },
  },
};
</script>
<style scoped>
.el-form > .el-form-item {
  margin-bottom: 10px;
}
</style>
