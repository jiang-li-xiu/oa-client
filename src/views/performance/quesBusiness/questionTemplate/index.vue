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
        <el-form-item label="问卷ID" prop="tid">
          <el-input
            v-model="queryParams.tId"
            placeholder="请输入问卷ID"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="问卷标题" prop="ttitle">
          <el-input
            v-model="queryParams.tTitle"
            placeholder="请输入问卷标题"
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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['business:questionTemplate:add']"
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
          v-hasPermi="['business:questionTemplate:edit']"
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
          v-hasPermi="['business:questionTemplate:remove']"
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
          v-hasPermi="['business:questionTemplate:export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="questionTemplateList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="问卷ID" align="center" prop="tid" />
      <el-table-column label="问卷标题" align="center" prop="ttitle" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['business:questionTemplate:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['business:questionTemplate:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改问卷模板对话框 -->
    <el-dialog
      title="添加问卷模板"
      :visible.sync="open"
      width="1000px"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="问卷标题" prop="ttitle">
          <el-input v-model="form.ttitle" placeholder="请输入问卷标题" />
        </el-form-item>
        <el-form-item label="问卷导引" prop="tContent">
          <editor v-model="form.tcontent" :min-height="192" />
        </el-form-item>

        <el-form-item label="题目内容" prop="thasques">
          <!-- <questions-table
            :load="loading"
            :data="selectQueList"
            handleSwitch="D"
            @handleDelete="handleDeleteSelectQues"
          >
          </questions-table> -->
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAddQuestions"
          >
            新增
          </el-button>
        </el-form-item>
        <questions-table
          :load="loading"
          :data="selectQueList"
          handleSwitch="D"
          @handleDelete="handleDeleteSelectQues"
        >
        </questions-table>
      </el-form>
      <div slot="footer" class="dialog-footer popup-change-btn">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 从题库选择题目 -->
    <el-dialog
      title="选择题目"
      :visible.sync="qopen"
      width="800px"
      :close-on-click-modal="false"
      append-to-body
    >
      <div class="btn-margin">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAddStore"
        >
          新增题目
        </el-button>
      </div>
      <questions-table
        :load="loading"
        :multipleList="selectQueList"
        :data="questionStoreList"
        handleSwitch=""
        @handleSelectionChange="handleSelectionQuestionChange"
      >
      </questions-table>
      <pagination
        v-show="qtotal > 0"
        :total="qtotal"
        :page.sync="qusQueryParams.pageNum"
        :limit.sync="qusQueryParams.pageSize"
        @pagination="getList"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitSelect">确 定</el-button>
        <el-button @click="qcancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 增加题目Dialog -->
    <add-questions-dialog
      title="增加题目"
      :open="aqopen"
      @cancel="aqcancel"
    ></add-questions-dialog>
  </div>
</template>

<script>
import {
  listQuestionTemplate,
  getQuestionTemplate,
  delQuestionTemplate,
  addQuestionTemplate,
  updateQuestionTemplate,
  exportQuestionTemplate,
} from "@/api/performance/questionTemplate";
import { listQuestionStore } from "@/api/performance/questionStore";
import Editor from "@/components/performance/Editor";
import QuestionsTable from "@/views/performance/quesBusiness/questionStore/components/QuestionsTable";
import selectQuestionsDialog from "@/views/performance/quesBusiness/questionTemplate/components/selectQuestionsDialog";
import addQuestionsDialog from "@/views/performance/quesBusiness/questionStore/components/addQuestionsDialog";
export default {
  name: "QuestionTemplate",
  components: {
    Editor,
    QuestionsTable,
    selectQuestionsDialog,
    addQuestionsDialog,
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      qids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      qtotal: 0,
      // 问卷模板表格数据
      questionTemplateList: [],
      // 题库表格数据
      questionStoreList: [],
      // 选择的题目数据
      selectQueList: [],
      selectQueListTemp: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示弹出层
      qopen: false,
      aqopen: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        tid: null,
        thasques: null,
        ttitle: null,
        tContent: null,
        deleteStatus: null,
      },
      // 题库查询参数
      qusQueryParams: {
        pageNum: 1,
        pageSize: 10,
        qid: null,
        qtitle: null,
        qselect: null,
        qselectScore: null,
        isMultiple: null,
        deleteStatus: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        ttitle: [
          { required: true, message: "问卷标题不能为空", trigger: "blur" },
        ],
        tcontent: [
          { required: true, message: "引导词不能为空", trigger: "blur" },
        ],
        thasques: [
          { required: true, message: "至少选择一个题目", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询问卷模板列表 */
    getList() {
      this.loading = true;
      listQuestionTemplate(this.queryParams).then((response) => {
        this.questionTemplateList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      listQuestionStore(this.qusQueryParams).then((response) => {
        this.questionStoreList = response.rows;
        this.qtotal = response.total;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        tid: null,
        thasques: null,
        createBy: null,
        ttitle: null,
        createTime: null,
        tContent: null,
        updateBy: null,
        updateTime: null,
        deleteStatus: 0,
        deleteBy: null,
        deleteTime: null,
      };
      this.qids = [];
      // this.selectQueList = [];
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        tid: null,
        thasques: null,
        ttitle: null,
        tContent: null,
        deleteStatus: null,
      };
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionQuestionChange(selection) {
      console.log("选中了", selection);
      console.log("集合的值", this.selectQueListTemp);
      this.selectQueListTemp = selection;
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.tid);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.selectQueListTemp = null;
      this.reset();
      this.open = true;
      this.title = "添加问卷模板";
    },
    /** 添加题目按钮操作 */
    handleAddQuestions() {
      // this.reset();
      // console.log("selectQueListTemp:",this.selectQueListTemp,"selectQueList:",this.selectQueList);
      this.selectQueList = this.selectQueListTemp;
      this.qopen = true;
      this.title = "添加题目";
    },
    /** 新增题目按钮操作 */
    handleAddStore() {
      this.reset();
      this.aqopen = true;
      this.title = "新增题目";
    },
    // 添加题目取消按钮
    qcancel() {
      this.qopen = false;
      // this.reset();
    },
    // 新增题目取消按钮
    aqcancel() {
      this.aqopen = false;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const tid = row.tid || this.ids;
      getQuestionTemplate(tid).then((response) => {
        this.form = response.data;
        this.selectQueList = response.data.qsnStores;
        this.form.thasques.split(",").forEach((item) => {
          this.qids.push(parseInt(item));
        });
        // console.log("11111:",this.selectQueList);
        this.open = true;
        this.title = "修改问卷模板";
      });
    },
    // 确认选择
    submitSelect() {
      console.log("33333:", this.selectQueList, this.selectQueListTemp);
      this.selectQueList = this.selectQueListTemp;
      this.qids = this.selectQueList.map((item) => item.qid);
      console.log(
        "44444:",
        this.selectQueList,
        this.selectQueListTemp,
        this.qids
      );
      // this.qids
      this.qopen = false;
    },
    /** 提交按钮 */
    submitForm() {
      console.log("123123123", this.qids);
      this.form.thasques = this.qids.join(",");
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.tid != null) {
            updateQuestionTemplate(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addQuestionTemplate(this.form).then((response) => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除选题按钮操作 */
    handleDeleteSelectQues(row) {
      this.selectQueList.forEach((item, index) => {
        if (item.qid == row.qid) {
          this.selectQueList.splice(index, 1);
        }
      });
      this.qids.splice(this.qids.indexOf(row.qid), 1);
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const tids = row.tid || this.ids;
      this.$confirm(
        '是否确认删除问卷模板编号为"' + tids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delQuestionTemplate(tids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有问卷模板数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportQuestionTemplate(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        });
    },
  },
};
</script>

<style scoped>
.btn-margin {
  margin: 15px 0;
}
</style>
