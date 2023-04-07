<template>
  <div class="app-container">
    <!-- <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="<100></100>px"
    > -->
    <!-- <el-form-item label="考核项权重" prop="weightCoefficient">
        <el-input
          v-model="queryParams.weightCoefficient"
          placeholder="请输入考核项权重"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->

    <!-- <el-form-item label="初评人" prop="preliminaryReviewer">
        <el-input
          v-model="queryParams.preliminaryReviewer"
          placeholder="请输入初评人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>


      <el-form-item label="终评人" prop="finalReviewer">
        <el-input
          v-model="queryParams.finalReviewer"
          placeholder="请输入终评人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
    <!-- <el-form-item label="开启时间" prop="startTime">
        <el-input
          v-model="queryParams.startTime"
          placeholder="请输入开启时间"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-input
          v-model="queryParams.endTime"
          placeholder="请输入结束时间"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->

    <!-- <el-form-item label="考核项状态" prop="assessmentStatus">
        <el-select v-model="queryParams.assessmentStatus" placeholder="请选择考核项状态" clearable size="small">
          <el-option v-for="dict in assessmentOptionStatusOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item> -->
    <!-- </el-form> -->
    <div class="bg-border-color-10">
      <div class="flex-align-center mb10">
        <img src="@/assets/images/list.png" alt="" class="list-img ml0 mr10" />
        <p class="color-50 font-15 font-700">数据列表</p>
      </div>
      <el-table
        v-loading="loading"
        :data="assessmentOptionList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column
          label="编号"
          align="center"
          prop="assessmentOptionId"
        />
        <el-table-column
          label="指标名称"
          min-width="200%"
          :show-overflow-tooltip="true"
          align="center"
          prop="targetTitle"
        />
        <!-- <el-table-column label="目标值" align="center" prop="targetValue" />
      <el-table-column label="完成值" align="center" prop="finishValue" />
      <el-table-column label="指标说明" align="center" prop="targetExplain" /> -->
        <el-table-column
          label="考核项权重"
          align="center"
          prop="weightCoefficient"
        />
        <!-- <el-table-column label="初评人" align="center" prop="preliminaryReviewerLabel" /> -->
        <el-table-column label="初评评分" align="center" prop="firstScore">
          <template slot-scope="scope">
            <p
              v-if="
                scope.row.firstScore === null || scope.row.firstScore === ''
              "
            >
              —— ——
            </p>
            <p v-else>
              {{ scope.row.firstScore }}
            </p>
          </template>
        </el-table-column>
        <el-table-column
          label="初评评语"
          min-width="150%"
          :show-overflow-tooltip="true"
          align="center"
          prop="firstComment"
        >
          <template slot-scope="scope">
            <p
              v-if="
                scope.row.firstComment === null || scope.row.firstComment === ''
              "
            >
              —— ——
            </p>
            <p v-else>
              {{ scope.row.firstComment }}
            </p>
          </template>
        </el-table-column>
        <!-- <el-table-column label="终评人" align="center" prop="finalReviewerLabel" /> -->
        <el-table-column label="终评得分" align="center" prop="finalScore">
          <template slot-scope="scope">
            <p
              v-if="
                scope.row.finalScore === null || scope.row.finalScore === ''
              "
            >
              —— ——
            </p>
            <p v-else>
              {{ scope.row.finalScore }}
            </p>
          </template>
        </el-table-column>
        <el-table-column
          label="终评评语"
          min-width="150%"
          :show-overflow-tooltip="true"
          align="center"
          prop="finalComment"
        >
          <template slot-scope="scope">
            <p
              v-if="
                scope.row.finalComment == null || scope.row.finalComment === ''
              "
            >
              —— ——
            </p>
            <p v-else>
              {{ scope.row.finalComment }}
            </p>
          </template>
        </el-table-column>
        <el-table-column
          label="考核项状态"
          align="center"
          prop="assessmentStatus"
          :formatter="assesssmentOptionStatusFormat"
        >
          <template slot-scope="scope">
            <el-tag :type="getType(scope.row.assessmentStatus)">
              {{ scope.row.assessmentStatusLabel }}
            </el-tag>
          </template>
        </el-table-column>
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
              v-hasPermi="['business:kpiCheckConfig:edit']"
              >终评</el-button
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

    <!-- 考核项详情对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="1000px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-card class="box-card mb10">
        <div>
          <el-row :gutter="24" class="mb20">
            <div class="flex">
              <span class="mark-logo ml0"></span>
              <div class="check-person ml0 font-700 font-15">考核详情</div>
            </div>
          </el-row>
          <el-row :gutter="24" class="mb20">
            <el-col :span="4">
              <b>指标名称</b>
            </el-col>
            <el-col :span="20">
              {{ form.targetTitle }}
            </el-col>
          </el-row>
          <el-row :gutter="24" class="mb20">
            <el-col :span="4">
              <b>部门</b>
            </el-col>
            <el-col :span="20">
              {{ form.deptName }}
            </el-col>
          </el-row>
          <el-row :gutter="24" class="mb20">
            <el-col :span="4">
              <b>姓名</b>
            </el-col>
            <el-col :span="20">
              {{ form.nickName }}
            </el-col>
          </el-row>
          <el-row :gutter="24" class="mb20">
            <el-col :span="4">
              <b>考核周期</b>
            </el-col>
            <el-col :span="20">
              {{ form.assessmentTypeLabel }}
            </el-col>
          </el-row>
          <el-row :gutter="24" class="mb20">
            <el-col :span="4">
              <b>权重</b>
            </el-col>
            <el-col :span="20">
              {{ form.weightCoefficient }}
            </el-col>
          </el-row>
          <el-row :gutter="24" class="mb20">
            <el-col :span="4">
              <b>计分方法</b>
            </el-col>
            <el-col :span="20">
              {{ form.scoringMethod }}
            </el-col>
          </el-row>
          <el-row :gutter="24" class="mb20">
            <el-col :span="4">
              <b>考核项状态</b>
            </el-col>
            <el-col :span="20">
              {{ assesssmentOptionStatusFormat(form, form.assessmentStatus) }}
            </el-col>
          </el-row>
          <el-row :gutter="24" class="mb20">
            <el-col :span="4">
              <b>初评人</b>
            </el-col>
            <el-col :span="20">
              {{ form.preliminaryReviewerLabel }}
            </el-col>
          </el-row>
          <el-row :gutter="24" class="mb20">
            <el-col :span="4">
              <b>终评人</b>
            </el-col>
            <el-col :span="20">
              {{ form.finalReviewerLabel }}
            </el-col>
          </el-row>
          <el-row :gutter="24" class="mb20">
            <el-col :span="4">
              <b>启动时间</b>
            </el-col>
            <el-col :span="20">
              {{ form.startTime }}
            </el-col>
          </el-row>
          <el-row :gutter="24" class="mb20">
            <el-col :span="4">
              <b>结束时间</b>
            </el-col>
            <el-col :span="20">
              {{ form.endTime }}
            </el-col>
          </el-row>
          <el-row :gutter="24" class="mb20">
            <el-col :span="4">
              <b>目标值</b>
            </el-col>
            <el-col :span="20">
              {{ form.targetValue }}
            </el-col>
          </el-row>
        </div>
      </el-card>
      <el-card class="box-card mb10">
        <div>
          <el-row :gutter="24" class="mb20">
            <div class="flex">
              <span class="mark-logo ml0"></span>
              <div class="check-person ml0 font-700 font-15">初评详情</div>
            </div>
          </el-row>
          <el-row :gutter="24" class="mb20">
            <el-col :span="4">
              <b>评语内容</b>
            </el-col>
            <el-col :span="20">
              {{ form.firstComment }}
            </el-col>
          </el-row>
          <el-row :gutter="24" class="mb20">
            <el-col :span="4">
              <b>实际完成值</b>
            </el-col>
            <el-col :span="8">
              {{ form.finishValue }}
            </el-col>

            <el-col :span="4">
              <b>考核评分</b>
            </el-col>
            <el-col :span="8">
              {{ form.firstScore }}
            </el-col>
          </el-row>
        </div>
      </el-card>
      <el-card class="box-card mb10">
        <div>
          <p v-if="form.assessmentStatus == '2'">
            <el-row :gutter="24" class="mb20">
              <div class="flex">
                <span class="mark-logo ml0"></span>
                <div class="check-person ml0 font-700 font-15">评价内容</div>
              </div>
            </el-row>
            <el-form ref="form" :model="form" :rules="rules" label-width="0px">
              <el-form-item prop="finalComment">
                <el-row :gutter="24" class="mb20">
                  <el-col :span="23">
                    <el-input
                      resize="none"
                      style="margin-left: 20px; margin-right: 20px"
                      type="textarea"
                      placeholder="请输入内容"
                      maxlength="100"
                      minlength="5"
                      :autosize="{ minRows: 6, maxRows: 10 }"
                      v-model="form.finalComment"
                      show-word-limit
                    >
                    </el-input>
                  </el-col>
                </el-row>
              </el-form-item>

              <div class="flex-justify-evenly">
                <div class="flex-align-center width-40">
                  <p class="font-15 width-10">评分</p>
                  <el-input
                    class="ml0"
                    placeholder="请输入评分"
                    v-model.number="form.finalScore"
                    show-word-limit
                  >
                  </el-input>
                </div>
                <div class="flex-align-center width-40">
                  <p class="font-15 width-30">实际完成值</p>
                  <el-input
                    class="ml0"
                    placeholder="请输入评分"
                    v-model="form.finalFinishValue"
                    maxlength="20"
                    min="1"
                    show-word-limit
                  >
                  </el-input>
                </div>
              </div>
            </el-form>
          </p>
          <p v-else>
            <el-row :gutter="24" class="mb20">
              <el-col :span="4">
                <b>评语内容</b>
              </el-col>
              <el-col :span="20">
                {{ form.finalComment }}
              </el-col>
            </el-row>
            <el-row :gutter="24" class="mb20">
              <el-col :span="4">
                <b>实际完成值</b>
              </el-col>
              <el-col :span="8">
                {{ form.finalFinishValue }}
              </el-col>
              <el-col :span="4">
                <b>考核评分</b>
              </el-col>
              <el-col :span="8">
                {{ form.finalScore }}
              </el-col>
            </el-row>
          </p>
        </div>
      </el-card>

      <div align="center" slot="footer" class="dialog-footer" style="">
        <p v-if="form.assessmentStatus == '2'">
          <el-button type="success" @click="submitForm">提交评价</el-button>
          <el-button type="warning" @click="sendPreliminary"
            >发回初评</el-button
          >
          <el-button type="info" @click="cancel">返回列表</el-button>
        </p>
        <p v-else>
          <el-button type="info" @click="cancel">返回列表</el-button>
        </p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  finalListAssessmentOptions,
  assessmentOptionSendPreliminarys,
  getAssessmentOption,
  delAssessmentOption,
  addAssessmentOption,
  updateAssessmentOption,
  finalCommentAssessmentOption,
} from "@/api/performance/assessmentOption";

export default {
  name: "AssessmentOption",
  components: {},
  data() {
    //评分校验
    var scorekNumber = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("评分不能为空"));
      }
      if (!Number.isInteger(value)) {
        callback(new Error("请输入数字"));
      } else {
        if (value > 100 || value < 0) {
          callback(new Error("必须大于0小于100"));
        } else {
          callback();
        }
      }
    };
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
      //考核状态颜色
      typeStatue: ["info", "success"],
      //考核项状态字典
      assessmentOptionStatusOptions: [],
      // 考核项表格数据
      assessmentOptionList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        assessmentOptionId: null,
        assessmentConfigureId: null,
        targetTitle: null,
        targetValue: null,
        finishValue: null,
        targetExplain: null,
        weightCoefficient: null,
        scoringMethod: null,
        preliminaryReviewer: null,
        firstScore: null,
        firstComment: null,
        finalReviewer: null,
        finalScore: null,
        finalComment: null,
        startTime: null,
        endTime: null,
        assessmentStatus: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        deleteBy: null,
        deleteTime: null,
        deleteStatus: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        finalComment: [
          {required: true,message: "评语最少3-100个字符", trigger: "blur" },
          { min: 3, max: 100, message: '长度在 3 到 100 个字符', trigger: 'blur' }
        ],
        finalScore: [
          { required: true,validator:scorekNumber, trigger: "blur" }
        ],
        finalFinishValue: [
          {required: true,message: "实际完成值最少1-20个字符", trigger: "blur" },
          { min: 1, max: 20, message: '长度 1 到 20 个字符', trigger: 'blur' }
        ],
      },
    };
  },
  created() {
    this.queryParams.assessmentConfigureId =
      this.$route.params && this.$route.params.assessmentConfigureId;
    this.getList();
  },
  methods: {
    /** 查询考核项列表 */
    getList() {
      this.loading = true;
      finalListAssessmentOptions(this.queryParams).then((response) => {
        this.assessmentOptionList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      this.getDicts("KPI_ASSESSMENT_OPTION_STATUS").then((response) => {
        this.assessmentOptionStatusOptions = response.data;
        console.log(this.assessmentOptionStatusOptions);
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
        assessmentOptionId: null,
        assessmentConfigureId: null,
        targetTitle: null,
        targetValue: null,
        finishValue: null,
        targetExplain: null,
        weightCoefficient: null,
        scoringMethod: null,
        preliminaryReviewer: null,
        firstScore: null,
        firstComment: null,
        finalReviewer: null,
        finalScore: null,
        finalComment: null,
        startTime: null,
        endTime: null,
        assessmentStatus: 0,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        deleteBy: null,
        deleteTime: null,
        deleteStatus: 0,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    // 考核项状态字典翻译
    assesssmentOptionStatusFormat(row, column) {
      console.log(row);
      return this.selectDictLabel(
        this.assessmentOptionStatusOptions,
        row.assessmentStatus
      );
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.assessmentOptionId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加考核项";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const assessmentOptionId = row.assessmentOptionId || this.ids;
      getAssessmentOption(assessmentOptionId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改考核项";
      });
    },
    //发回初评
    sendPreliminary() {
      assessmentOptionSendPreliminarys({
        assessmentOptionId: this.form.assessmentOptionId,
        preliminaryReviewer: this.form.preliminaryReviewer,
      }).then((response) => {
        this.msgSuccess("操作成功");
        this.open = false;
        this.getList();
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          finalCommentAssessmentOption(this.form).then((response) => {
            this.msgSuccess("评价成功");
            this.open = false;
            this.getList();
          });
        }
      });
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const assessmentOptionIds = row.assessmentOptionId || this.ids;
      this.$confirm(
        '是否确认删除考核项编号为"' + assessmentOptionIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delAssessmentOption(assessmentOptionIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有考核项数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportAssessmentOption(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        });
    },
    getType(statue) {
      return statue == "2" ? this.typeStatue[1] : this.typeStatue[0];
    },
  },
};
</script>
