<template>
  <div class="app-container">
    <!-- <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="<100></100>px"
    >
      <el-form-item label="考核项状态" prop="assessmentStatus">
        <el-select
          v-model="queryParams.assessmentStatus"
          placeholder="请选择考核项状态"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in assessmentOptionStatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
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
    </el-form> -->
    <div class="bg-border-color-10">
<div class="flex-align-center mb10">
      <img
        src="@/assets/images/list.png"
        alt=""
        class="list-img ml0 mr10"
      />
      <p class="color-50 font-15 font-700">数据列表</p>
    </div>
    <el-table
      v-loading="loading"
      :data="assessmentOptionList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" align="center" prop="assessmentOptionId" />
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
            v-if="scope.row.firstScore === null || scope.row.firstScore === ''"
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
            v-if="scope.row.finalScore === null || scope.row.finalScore === ''"
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
            icon="el-icon-info"
            @click="handleUpdate(scope.row)"
            >详情/申诉</el-button
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
              <div class="check-person font-15 ml0 mb10 font-700">考核详情</div>
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
            <el-col
              :span="20"
              :class="
                form.assessmentStatus == 1 || form.assessmentStatus == 2
                  ? 'orange'
                  : form.assessmentStatus == 3
                  ? 'green'
                  : form.assessmentStatus == 4 || form.assessmentStatus == 5
                  ? 'red'
                  : ''
              "
            >
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
              <div class="check-person font-15 ml0 mb10 font-700">初评详情</div>
            </div>
          </el-row>
          <div v-if="form.assessmentStatus >= '2' || form.isAppeal == '2'">
            <el-row :gutter="24" class="mb20">
              <el-col :span="4">
                <b>初评评语</b>
              </el-col>
              <el-col :span="20">
                {{ form.firstComment }}
              </el-col>
            </el-row>
            <el-row :gutter="24" class="mb20">
              <el-col :span="4">
                <b>实际完成值</b>
              </el-col>
              <el-col :span="20">
                {{ form.finishValue }}
              </el-col>
            </el-row>

            <el-row :gutter="24" class="mb20">
              <el-col :span="4">
                <b>考核评分</b>
              </el-col>
              <el-col :span="20">
                {{ form.firstScore }}
              </el-col>
            </el-row>
          </div>
          <div v-else align="center">暂无</div>
        </div>
      </el-card>
      <el-card class="box-card mb10">
        <div>
          <el-row :gutter="24" class="mb20">
            <div class="flex">
              <span class="mark-logo ml0"></span>
              <div class="check-person font-15 ml0 mb10 font-700">终评详情</div>
            </div>
          </el-row>
          <div v-if="form.assessmentStatus >= '3' || form.isAppeal == '2'">
            <el-row :gutter="24" class="mb20">
              <el-col :span="4">
                <b>终评评语</b>
              </el-col>
              <el-col :span="20">
                {{ form.finalComment }}
              </el-col>
            </el-row>
            <el-row :gutter="24" class="mb20">
              <el-col :span="4">
                <b>实际完成值</b>
              </el-col>
              <el-col :span="20">
                {{ form.finalFinishValue }}
              </el-col>
            </el-row>
            <el-row :gutter="24" class="mb20">
              <el-col :span="4">
                <b>考核评分</b>
              </el-col>
              <el-col :span="20">
                {{ form.finalScore }}
              </el-col>
            </el-row>
          </div>
          <div v-else align="center">暂无</div>
        </div>
      </el-card>
      <div
        v-if="
          form.isAppeal != '0' &&
          form.assessmentStatus != null &&
          form.kpiAppeal != null
        "
      >
        <el-card class="mb10">
          <div>
            <!-- <el-row :gutter="24" class="mb20">
            <el-col :span="24">
              <span style="font-size: 18px">申诉详情</span>
            </el-col>
          </el-row> -->
            <div>
              <el-row :gutter="24">
                <div class="flex">
                  <span class="mark-logo"></span>
                  <div class="check-person font-15 ml0 mb20 font-700">
                    申诉理由
                  </div>
                </div>
              </el-row>
              <el-row :gutter="24" class="mb20">
                <el-col :span="24">
                  <span style="font-size: 15px">{{
                    form.kpiAppeal.appealReason
                  }}</span>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-card>

        <el-card>
          <el-row :gutter="24">
            <div class="flex">
              <span class="mark-logo"></span>
              <div class="check-person font-15 ml0 mb20 font-700">申诉附件</div>
            </div>
          </el-row>
          <el-row :gutter="24">
            <el-col
              v-if="
                form.kpiAppeal.appealFileIdStr != null &&
                form.kpiAppeal.appealFileIdStr != ''
              "
              :span="24"
            >
              <fileList
                ref="fileUpload"
                :file-str.sync="form.kpiAppeal.appealFileIdStr"
                :echo-file-str="form.kpiAppeal.appealFileIdStr || ''"
              ></fileList>
            </el-col>
            <el-col v-else :gutter="24" class="mb20">
              <div align="center">无</div>
            </el-col>
          </el-row>
        </el-card>
      </div>

      <el-card
        v-if="form.isAppeal == '3' && form.kpiAppeal.appealStatus == '3'"
        style="margin-top: 10px"
      >
        <div>
          <el-row :gutter="24" class="mb20">
            <el-col :span="24">
              <span style="font-size: 18px">驳回理由</span>
            </el-col>
          </el-row>
          <el-row :gutter="24" class="mb20">
            <el-col :span="24">
              <span style="font-size: 15px">{{
                form.kpiAppeal.appealRemakes
              }}</span>
            </el-col>
          </el-row>
        </div>
      </el-card>
      <div align="center" slot="footer" class="dialog-footer" style="">
        <el-button

          type="warning"
          @click="assessmentAppeal(form.assessmentOptionId)"
          >考核申诉</el-button
        >
        <el-button type="info" @click="cancel">返回列表</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="title"
      :visible.sync="appealOpen"
      width="40%"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-row :gutter="24" class="mb20">
        <el-col :span="24">
          <span style="font-size: 15px">申诉理由</span>
        </el-col>
      </el-row>
      <el-form
        ref="appealInfo"
        :model="appealInfo"
        :rules="rules"
        label-width="0px"
      >
        <el-form-item prop="appealReason">
          <el-row :gutter="24" class="mb20">
            <el-col :span="23">
              <el-input
                style="margin-left: 20px; margin-right: 20px"
                type="textarea"
                placeholder="请输入内容"
                :autosize="{ minRows: 6, maxRows: 10 }"
                v-model="appealInfo.appealReason"
                show-word-limit
              >
              </el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-row>
          <el-card>
            <fileUpload
              ref="fileUpload"
              :file-str.sync="appealInfo.appealFileIdStr"
              :echo-file-str="appealInfo.appealFileIdStr || ''"
            />
          </el-card>
        </el-row>
      </el-form>
      <div align="center" style="margin-top: 20px">
        <el-button type="success" @click="commitAppeal">考核申诉</el-button>
        <el-button type="info" @click="appealCancel">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  allListAssessmentOptions,
  assessmentOptionSendPreliminarys,
  getAssessmentOption,
  delAssessmentOption,
  addAssessmentOption,
  updateAssessmentOption,
  finalCommentAssessmentOption,
} from "@/api/performance/assessmentOption";
import FileUpload from "@/components/performance/FileUpload";
import { addKpiAppeal } from "@/api/performance/kpiAppeal";
import fileList from "@/components/performance/fileList";
export default {
  name: "AssessmentOption",
  components: {
    FileUpload,
    fileList,
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      //考核申诉弹窗
      appealOpen: false,
      //考核状态验
      StatusType: ["", "info", "", "success", "warning", "danger"],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
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
      //申诉信息
      appealInfo: {
        appealFileIdStr: null,
        appealReason: null,
        assessmentOptionId: null,
      },
      // 表单参数
      form: {
        kpiAppeal: { appealStatus: "" },
      },
      // 表单校验
      rules: {
        appealReason: [
          { required: true, message: "申诉理由不能为空！！", trigger: "blur" },
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
      allListAssessmentOptions(this.queryParams).then((response) => {
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
    appealCancel() {
      this.appealOpen = false;
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
      //申诉信息
      this.appealInfo = {
        appealFileIdStr: null,
        appealReason: null,
        assessmentOptionId: null,
      };
      // 表单参数
      this.resetForm("form");
    },
    //考核申诉
    assessmentAppeal(assessmentOptionId) {
      if (this.form.isAppeal != 0) {
        this.open3();
      } else {
        this.title = "考核申诉";
        this.appealOpen = true;
        this.appealInfo.assessmentOptionId = assessmentOptionId;
      }
    },
    open3() {
      this.$message({
        message: "警告哦，您已经申诉过一次，不能进行第二次申诉！！！",
        type: "warning",
      });
    },
    //提交申诉
    commitAppeal() {
      this.$refs["appealInfo"].validate((valid) => {
        if (valid) {
          addKpiAppeal(this.appealInfo).then((response) => {
            this.msgSuccess("操作成功");
            this.open = false;
            this.appealOpen = false;
            this.getList();
          });
        }
      });
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
    getAssessmentInfo(assessmentOptionId) {
      getAssessmentOption(assessmentOptionId).then((response) => {
        this.form = response.data;
      });
    },
    /** 详情按钮操作 */
    handleUpdate(row) {
      this.reset();
      const assessmentOptionId = row.assessmentOptionId || this.ids;
      this.getAssessmentInfo(assessmentOptionId);
      this.open = true;
      this.title = "考核项详情";
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
            this.msgSuccess("修改成功");
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
      return this.StatusType[parseInt(statue)];
    },
  },
};
</script>
