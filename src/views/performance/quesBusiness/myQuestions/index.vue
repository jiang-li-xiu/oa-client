<template>
  <div class="app-container">
    <div class="bg-border-color-10">
      <div class="flex-center">
        <img src="@/assets/images/look-over.png" alt="" class="list-img" />
        <p class="font-15 font-700 color-50">筛选查询</p>
      </div>
      <el-form
        class="flex-align-between flex-wrap mt20 m10"
        :model="queryParams"
        ref="queryForm"
        :inline="true"
        v-show="showSearch"
        label-width="70px"
      >
        <el-form-item label="问卷ID" prop="tId">
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
        <el-form-item label="被评价人" prop="empName">
          <el-input
            v-model="queryParams.empName"
            placeholder="请输入被评价人"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="评价状态" prop="qsnStatus">
          <el-select
            v-model="queryParams.qsnStatus"
            placeholder="请选择评价状态"
            clearable
            :style="{ width: '100%' }"
          >
            <el-option
              v-for="(item, index) in qsnStatusOptions"
              :key="index"
              :label="item.dictLabel"
              :value="item.dictValue"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="flex-cc" v-show="showSearch">
        <div @click="handleQuery" class="cursor font-14 search-btn mr20">
          <i class="el-icon-search"></i>
          搜索
        </div>

        <div @click="resetQuery" class="cursor font-14 reset-btn">
          <i class="el-icon-refresh"></i>
          重置
        </div>
      </div>
    </div>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['business:questionsRecord:export']"
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
      :data="questionsRecordList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="问卷ID" align="center" prop="tid" />
      <el-table-column label="问卷标题" align="center" prop="ttitle">
      </el-table-column>
      <el-table-column label="被评价人" align="center" prop="empName" />
      <el-table-column
        label="评价状态"
        align="center"
        prop="qsnStatus"
        :formatter="qsnStatusFormat"
      >
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.qsnStatus === 1">{{
            selectDictLabel(qsnStatusOptions, scope.row.qsnStatus)
          }}</el-tag>
          <el-tag type="danger" v-if="scope.row.qsnStatus === 0">{{
            selectDictLabel(qsnStatusOptions, scope.row.qsnStatus)
          }}</el-tag>
        </template></el-table-column
      >
      <el-table-column label="最后得分" align="center" prop="qsnScore" />
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
            v-if="scope.row.qsnStatus == 0"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['business:questionsRecord:edit']"
            >评价</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            v-else
            @click="handleInfo(scope.row)"
            >已评价</el-button
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

    <!-- 填写问卷 -->
    <el-dialog
      title="填写问卷"
      :visible.sync="open"
      width="1000px"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-form ref="form" :model="form" label-width="80px">
        <questions-paper
          :data="questions"
          @cancel="cancel"
          @submitForm="submitForm"
        ></questions-paper>
      </el-form>
      <!-- <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div> -->
    </el-dialog>

    <!-- 查看问卷对话框 -->
    <el-dialog
      title="查看问卷"
      :visible.sync="showOpen"
      :close-on-click-modal="false"
      width="1000px"
      append-to-body
    >
      <questions-paper
        :data="questions"
        :disabled="true"
        :answer="answer"
      ></questions-paper>
      <div slot="footer" class="dialog-footer">
        <div class="confirm" @click="scancel">确 定</div>
        <div class="cancel" @click="scancel">取 消</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  exportQuestionsRecord,
  listMyQuestionsRecord,
  getQuestionsByTid,
  updateQuestionsRecord,
} from "@/api/performance/questionsRecord";
import { listQuestionTemplate } from "@/api/performance/questionTemplate";
import DispatchUser from "@/components/performance/DispatchUser";
import selectTemplateTable from "@/views/performance/quesBusiness/questionsRecord/components/selectTemplateTable";
import questionsPaper from "@/views/performance/quesBusiness/myQuestions/components/questionsPaper";
export default {
  name: "MyQuestions",
  components: { DispatchUser, selectTemplateTable, questionsPaper },
  data() {
    return {
      // 问卷体
      questions: {},
      answer: {},
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
      // 问卷记录表格数据
      questionsRecordList: [],
      // 问卷记录表格数据
      questionTemplateList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      showOpen: false,
      // 评价状态字典
      qsnStatusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        qsnId: null,
        tid: null,
        evaId: null,
        empId: null,
        qsnStatus: null,
        qsnScore: null,
        createBy: null,
        deleteStatus: null,
        qsnAnswer: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        evaId: [
          { required: true, message: "评价人ID不能为空", trigger: "blur" },
        ],
        empId: [
          { required: true, message: "被评价人ID不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getDicts("qsn_status").then((response) => {
      this.qsnStatusOptions = response.data;
    });
  },
  methods: {
    /** 查看按钮操作 */
    handleInfo(row) {
      // console.log(row);
      this.questions = {
        tid: row.tid,
        ttitle: row.ttitle,
        tcontent: row.tcontent,
        data: null,
      };
      this.answer = JSON.parse(row.qsnAnswer);
      this.showOpen = true;
    },
    /** 查询问卷记录列表 */
    getList() {
      this.loading = true;
      listQuestionTemplate(this.queryParams).then((response) => {
        this.questionTemplateList = response.rows;
      });
      listMyQuestionsRecord(this.queryParams).then((response) => {
        this.total = response.total;
        this.loading = false;
        this.questionsRecordList = response.rows;
      });
    },
    // 评价状态字典翻译
    qsnStatusFormat(row, column) {
      return this.selectDictLabel(this.qsnStatusOptions, row.qsnStatus);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 取消按钮
    scancel() {
      this.showOpen = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        qsnId: null,
        tid: null,
        evaId: null,
        empId: null,
        qsnStatus: null,
        qsnScore: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        deleteStatus: 0,
        deleteBy: null,
        deleteTime: null,
        qsnAnswer: null,
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
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        qsnId: null,
        tid: null,
        evaId: null,
        empId: null,
        qsnStatus: null,
        qsnScore: null,
        createBy: null,
        deleteStatus: null,
        qsnAnswer: null,
      };
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.qsnId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加问卷记录";
    },

    /** 评价按钮操作 */
    handleUpdate(row) {
      this.reset();
      // 关联ID
      const qsnId = row.qsnId || this.ids;
      // 问卷ID
      const tId = row.tid;
      // 拿到问卷ID 得到题目
      getQuestionsByTid(tId).then((response) => {
        this.questions = response;
      });
      this.form.qsnId = qsnId;
      this.form.tid = tId;
      this.form.evaId = row.evaId;
      this.form.empId = row.empId;
      this.open = true;
      this.title = "";
    },
    /** 提交评价按钮 */
    submitForm(data) {
      this.form.qsnStatus = 1;
      this.form.qsnAnswer = JSON.stringify(data);
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.qsnId != null) {
            updateQuestionsRecord(this.form).then((response) => {
              this.msgSuccess("评价成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const qsnIds = row.qsnId || this.ids;
      this.$confirm(
        '是否确认删除问卷记录编号为"' + qsnIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delQuestionsRecord(qsnIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有问卷记录数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportQuestionsRecord(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        });
    },
  },
};
</script>
<style scoped>
.dialog-footer {
  display: flex;
  justify-content: center;
}

.dialog-footer > .confirm,
.cancel {
  background: #46a6ff;
  width: 6vw;
  height: 3.5vh;
  line-height: 3.5vh;
  text-align: center;
  border-radius: 10px;
  color: #fff;
  font-size: 14px;
  margin: 0 1.5vw;
}

.cancel {
  color: #000;
  background: #a79d9d4f;
}
</style>