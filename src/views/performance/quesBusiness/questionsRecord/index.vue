<template>
  <div class="app-container">
    <div class="bg-border-color-10" v-show="showSearch">
      <div class="flex-center">
        <img src="@/assets/images/look-over.png" alt="" class="list-img" />
        <p class="font-15 font-700 color-50 ml0">筛选查询</p>
      </div>
      <el-form
        class="flex-align-between flex-wrap mt20 m10"
        :model="queryParams"
        ref="queryForm"
        :inline="true"
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
        <el-form-item label="评价人" prop="evaName">
          <el-input
            v-model="queryParams.evaName"
            placeholder="请输入评价人"
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
            size="small"
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
    <div class="bg-border-color-10">
      <div class="flex-align-between">
        <div class="flex-align-center mb10">
          <img
            src="@/assets/images/list.png"
            alt=""
            class="list-img ml0 mr10"
          />
          <p class="color-50 font-15 font-700">数据列表</p>
        </div>
        <div>
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button
                type="primary"
                plain
                icon="el-icon-plus"
                size="mini"
                @click="handleAdd"
                v-hasPermi="['business:questionsRecord:add']"
                >新增</el-button
              >
            </el-col>
            <right-toolbar
              :showSearch.sync="showSearch"
              @queryTable="getList"
            ></right-toolbar>
          </el-row>
        </div>
      </div>
      <el-table
        v-loading="loading"
        :data="questionsRecordList"
        :border="true"
        :span-method="verticalMerger"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <!-- <el-table-column label="记录ID" align="center" prop="qsnid" /> -->
        <el-table-column label="问卷ID" align="center" prop="tid" />
        <el-table-column label="问卷标题" align="center" prop="ttitle" />
        <el-table-column label="被评价人" align="center" prop="empName" />
        <el-table-column label="评价人" align="center" prop="evaName" />

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
          </template>
        </el-table-column>
        <el-table-column label="最后得分" align="center" prop="qsnScore" />
        <el-table-column label="平均分" align="center" prop="avgScore" />
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
              >修改</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleInfo(scope.row)"
              v-else
              v-hasPermi="['business:questionsRecord:edit']"
              >详细</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['business:questionsRecord:remove']"
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
    </div>

    <!-- 发布问卷对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="500px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <div class="bg-border-color-10 mb20">
          <div class="flex-align-center">
            <div class="flex mr10">
              <span class="mark-logo ml0"></span>
              <div class="check-person ml0 font-700 font-15">问卷模板</div>
            </div>
            <el-button type="primary" @click="selectTemplatesOpenHandle"
              >选择问卷模板</el-button
            >
          </div>
          <div
            class="topic-odd"
            v-for="(item, index) in selectTemplateList"
            :key="index"
          >
            <span> {{ index + 1 }} . </span>
            <i class="el-icon-edit-outline"></i>
            <!-- <span>已选择问卷模板:</span> -->
            <span>{{ item.ttitle }}</span>
          </div>
        </div>
        <div class="bg-border-color-10 mb20">
          <div class="flex mr10 mb20">
            <span class="mark-logo ml0"></span>
            <div class="check-person ml0 font-700 font-15">人员选择</div>
          </div>
          <div class="ml0">
            <el-form-item label="评价人" prop="evaId">
              <dispatch-user :is-multiple="true" :id-array.sync="form.evaId" />
            </el-form-item>
            <el-form-item label="被评价人" prop="empId">
              <dispatch-user :is-multiple="true" :id-array.sync="form.empId" />
            </el-form-item>
          </div>
        </div>
      </el-form>

      <div slot="footer" class="dialog-footer flex-cc">
        <el-button type="primary" class="mr10" @click="submitForm"
          >确 定</el-button
        >
        <el-button class="ml0" @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 选择问卷对话框 -->
    <el-dialog
      title="选择问卷"
      :visible.sync="tempOpen"
      width="1000px"
      :close-on-click-modal="false"
      append-to-body
    >
      <select-template-table
        :selectid.sync="selectTemplateList"
      ></select-template-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="tcancel">确 定</el-button>
        <el-button @click="tcancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 查看问卷对话框 -->
    <el-dialog
      title="查看问卷"
      :visible.sync="showOpen"
      width="1000px"
      :close-on-click-modal="false"
      append-to-body
    >
      <questions-paper
        :data="questions"
        :disabled="true"
        :answer="answer"
      ></questions-paper>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="scancel">确 定</el-button>
        <el-button @click="scancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listQuestionsRecord,
  getQuestionsRecord,
  delQuestionsRecord,
  addQuestionsRecord,
  updateQuestionsRecord,
  exportQuestionsRecord,
} from "@/api/performance/questionsRecord";
import { listQuestionTemplate } from "@/api/performance/questionTemplate";
import DispatchUser from "@/components/performance/DispatchUser";
import selectTemplateTable from "@/views/performance/quesBusiness/questionsRecord/components/selectTemplateTable";
import questionsPaper from "@/views/performance/quesBusiness/myQuestions/components/questionsPaper";
export default {
  name: "QuestionsRecord",
  components: { DispatchUser, selectTemplateTable, questionsPaper },
  data() {
    return {
      // 问卷体
      questions: null,
      answer: null,
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
      selectTemplateList: [],
      questionTemplateList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      tempOpen: false,
      showOpen: false,
      // 评价状态字典
      qsnStatusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        qsnId: null,
        tId: null,
        tTitle: null,
        evaId: null,
        empId: null,
        qsnStatus: null,
        qsnScore: null,
        createBy: null,
        deleteStatus: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        tid: [{ required: true, message: "至少选择一个问卷", trigger: "blur" }],
        evaId: [
          { required: true, message: "至少选择一个评价人", trigger: "blur" },
        ],
        empId: [
          { required: true, message: "至少选择一个被评价人", trigger: "blur" },
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
    /** 查询问卷记录列表 */
    getList() {
      this.loading = true;
      listQuestionTemplate(this.queryParams).then((response) => {
        this.questionTemplateList = response.rows;
      });
      listQuestionsRecord(this.queryParams).then((response) => {
        this.total = response.total;
        this.loading = false;
        this.questionsRecordList = response.rows;
      });
    },
    // 返回纵向下沉数组
    rowspan(rowname) {
      let spanArr = [];
      let position = 0;
      this.questionsRecordList.forEach((item, index) => {
        if (index === 0) {
          spanArr.push(1);
          position = 0;
        } else {
          if (
            this.questionsRecordList[index][rowname] ===
            this.questionsRecordList[index - 1][rowname]
          ) {
            spanArr[position] += 1;
            spanArr.push(0);
          } else {
            spanArr.push(1);
            position = index;
          }
        }
      });
      return spanArr;
    },
    // 纵向合并
    verticalMerger({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1 || columnIndex === 2) {
        const _row = this.rowspan("tid")[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      }
      // if (columnIndex === 1) {
      //   const _row = this.rowspan("ttitle")[rowIndex];
      //   const _col = _row > 0 ? 1 : 0;
      //   return {
      //     rowspan: _row,
      //     colspan: _col,
      //   };
      // }
      if (columnIndex === 7 || columnIndex === 3) {
        const _row = this.rowspan("empId")[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      }
    },
    // 接收选择的问卷模板ID回调
    submitSelectTid(ids) {
      this.selectTemplateList = ids;
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
    tcancel() {
      this.tempOpen = false;
      // this.reset();
    },
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
        qsnAnswer: null,
        deleteTime: null,
      };
      this.questions = {};
      this.answer = {};
      this.selectTemplateList = [];
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams.tTitle = null;
      this.handleQuery();
    },
    /** 查看按钮操作 */
    handleInfo(row) {
      this.questions = {
        tid: row.tid,
        ttitle: row.ttitle,
        tcontent: row.tcontent,
        data: null,
      };
      this.answer = JSON.parse(row.qsnAnswer);
      this.showOpen = true;
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
    /** 选择问卷模板句柄 */
    selectTemplatesOpenHandle() {
      this.tempOpen = true;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const qsnId = row.qsnId || this.ids;
      getQuestionsRecord(qsnId).then((response) => {
        this.form = response.data;
        this.selectTemplateList = this.questionTemplateList.filter((item) => {
          if (item.tid == this.form.tid) {
            return item;
          }
        });
        // console.log(this.selectTemplateList);
        this.open = true;
        this.title = "修改问卷记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.form.tid = this.selectTemplateList.map((item) => item.id).join(",");
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.qsnId != null) {
            updateQuestionsRecord(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addQuestionsRecord(this.form).then((response) => {
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
.el-button + .el-button {
  margin: 0;
}

.topic-odd {
  margin-left: 100px;
  margin-top: 15px;
}
</style>
