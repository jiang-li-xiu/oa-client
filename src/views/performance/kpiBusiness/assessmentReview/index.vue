<template>
  <div class="app-container">
    <div class="bg-border-color-10">
      <div class="flex-center">
        <img src="@/assets/images/look-over.png" alt="" class="list-img" />
        <p class="font-15 font-700 color-50 ml0">筛选查询</p>
      </div>
      <div class="flex-cc width-100">
        <el-form
          class="flex-align-between flex-wrap mt20 m10 width-80"
          :model="queryParams"
          ref="queryForm"
          :inline="true"
          v-show="showSearch"
          label-width="70px"
        >
          <el-form-item label="姓名" prop="nickName">
            <el-input
              v-model="queryParams.nickName"
              placeholder="请输入开启姓名"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="所属部门" prop="deptName" size="small">
            <tree-select
              v-model="queryParams.deptName"
              :options="deptOptions"
              :show-count="true"
              style="width: 250px"
              placeholder="请选择部门"
            />
          </el-form-item>
          <el-form-item label="申诉状态" prop="assessmentStatus">
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
        </el-form>
      </div>

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

    <!--    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['business:assessmentOption:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['business:assessmentOption:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['business:assessmentOption:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['business:assessmentOption:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row> -->
    <div class="bg-border-color-10">
      <div class="flex-align-center mb10">
        <img class="list-img ml0 mr10" src="@/assets/images/list.png" alt="" />
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
          min-width="250%"
          align="center"
          :show-overflow-tooltip="true"
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
        <el-table-column label="部门" align="center" prop="deptName" />
        <el-table-column label="姓名" align="center" prop="nickName" />
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
          align="center"
          :show-overflow-tooltip="true"
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
          label="申诉状态"
          align="center"
          prop="assessmentStatus"
          :formatter="assesssmentOptionStatusFormat"
        >
          <template slot-scope="scope">
            <el-tag
              :type="getStyle(scope.row.kpiAppeal.appealStatus)"
              v-if="scope.row.kpiAppeal != null"
            >
              {{ scope.row.kpiAppeal.appealStatusLabel }}
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
              >查看详情</el-button
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
          <div class="flex-align-center mb20">
            <span class="mark-logo mr10"> </span>
            <el-row :gutter="24">
              <el-col :span="24">
                <span class="font-700">考核详情</span>
              </el-col>
            </el-row>
          </div>
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
              <b>申诉状态</b>
            </el-col>
            <el-col
              :span="20"
              :class="
                form.kpiAppeal.appealStatusLabel == '申诉待批'
                  ? 'green'
                  : form.kpiAppeal.appealStatusLabel == '申诉通过'
                  ? 'orange'
                  : 'red'
              "
            >
              {{ form.kpiAppeal.appealStatusLabel }}
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
            <div class="flex-align-center">
              <span class="mark-logo mr10"> </span>
              <el-row :gutter="24">
                <el-col :span="24">
                  <span class="font-700">初评详情</span>
                </el-col>
              </el-row>
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
      </el-card>
      <el-card class="box-card mb10">
        <div>
          <el-row :gutter="24" class="mb20">
            <div class="flex-align-center">
              <span class="mark-logo mr10"> </span>
              <el-row :gutter="24">
                <el-col :span="24">
                  <span class="font-700">终评详情</span>
                </el-col>
              </el-row>
            </div>
          </el-row>
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
      </el-card>
      <el-card class="box-card mb10" v-if="form.isAppeal != '0'">
        <div>
          <el-row :gutter="24" class="mb20">
            <div class="flex-align-center">
              <span class="mark-logo mr10"> </span>
              <el-row :gutter="24">
                <el-col :span="24">
                  <span class="font-700">申诉理由</span>
                </el-col>
              </el-row>
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
      </el-card>

      <el-card class="mb10">
        <el-row :gutter="24" class="mb20">
          <div class="flex-align-center">
            <span class="mark-logo mr10"> </span>
            <el-row :gutter="24">
              <el-col :span="24">
                <span class="font-700">申诉附件</span>
              </el-col>
            </el-row>
          </div>
        </el-row>
        <el-row
          v-if="
            form.kpiAppeal.appealFileIdStr != null &&
            form.kpiAppeal.appealFileIdStr != ''
          "
          :gutter="24"
          class="mb20"
        >
          <el-col :span="24">
            <fileList
              ref="fileUpload"
              :file-str.sync="form.kpiAppeal.appealFileIdStr"
              :echo-file-str="form.kpiAppeal.appealFileIdStr || ''"
            ></fileList>
          </el-col>
        </el-row>
        <el-row v-else class="mb20">
          <div align="center">无</div>
        </el-row>
      </el-card>

      <el-card
        v-if="form.kpiAppeal.appealStatus == '3'"
        style="margin-top: 10px"
      >
        <div>
          <el-row :gutter="24" class="mb20">
            <div class="flex-align-center">
              <span class="mark-logo mr10"> </span>
              <el-row :gutter="24">
                <el-col :span="24">
                  <span class="font-700">驳回理由</span>
                </el-col>
              </el-row>
            </div>
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
        <p v-if="form.kpiAppeal != null && form.kpiAppeal.appealStatus == '1'">
          <el-button type="success" @click="sendPreliminary"
            >发回初评</el-button
          >
          <el-button type="warning" @click="submitForm">驳回申诉</el-button>
          <el-button type="info" @click="cancel">返回列表</el-button>
        </p>
        <p v-else>
          <el-button type="info" @click="cancel">关 闭</el-button>
        </p>
      </div>
    </el-dialog>
    <el-dialog
      class="font-15 font-700"
      :title="title"
      :visible.sync="appealOpen"
      width="40%"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-row :gutter="24" class="mb20">
        <el-col :span="24">
          <span class="text-danger"> * </span
          ><span class="font-normal">驳回理由</span>
        </el-col>
      </el-row>
      <el-form
        ref="appealInfo"
        :model="appealInfo"
        :rules="rules"
        label-width="0px"
      >
        <el-form-item prop="appealRemakes">
          <el-row :gutter="24" class="mb20">
            <el-col :span="23">
              <el-input
                style="margin-left: 20px; margin-right: 20px"
                type="textarea"
                resize="none"
                placeholder="请输入内容"
                :autosize="{ minRows: 6, maxRows: 10 }"
                v-model="appealInfo.appealRemakes"
                show-word-limit
              >
              </el-input>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <div align="center" style="margin-top: 20px">
        <el-button type="success" @click="commitAppeal">确 定</el-button>
        <el-button type="info" @click="appealCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  allAppealAssessmentOptionsList,
  assessmentOptionSendPreliminarys,
  getAssessmentOption,
  delAssessmentOption,
  addAssessmentOption,
  updateAssessmentOption,
  finalCommentAssessmentOption,
} from "@/api/performance/assessmentOption";
import { rejectKpiAppeal, adoptKpiAppeal } from "@/api/performance/kpiAppeal";
import fileList from "@/components/performance/fileList";
import { treeselect } from "@/api/performance/system/dept";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import TreeSelect from "@riophae/vue-treeselect";
export default {
  name: "AssessmentOption",
  components: {
    fileList,
    TreeSelect,
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      appealOpen: false,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      //状态样式
      statueStyle: ["", "success", "danger"],
      //考核项状态字典
      assessmentOptionStatusOptions: [],
      // 考核项表格数据
      assessmentOptionList: [],
      // 弹出层标题
      title: "",
      //申诉信息
      appealInfo: { appealRemakes: null },
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
        deptName: null,
        nickName: null,
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
      form: { kpiAppeal: {} },
      // 表单校验
      // 表单校验
      rules: {
        appealRemakes: [
          { required: true, message: "申诉理由不能为空！！", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getDeptTreeSelect();
  },
  methods: {
    /** 查询考核项列表 */
    getList() {
      this.loading = true;
      allAppealAssessmentOptionsList(this.queryParams).then((response) => {
        this.assessmentOptionList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      this.getDicts("KPI_APPEAL_STATUS").then((response) => {
        this.assessmentOptionStatusOptions = response.data;
        console.log(this.assessmentOptionStatusOptions);
      });
    },
    /** 查询部门下拉树结构 */
    getDeptTreeSelect() {
      treeselect().then((response) => {
        this.deptOptions = response.data;
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
        kpiAppeal: {},
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
        console.log(this.form);

        this.open = true;
        this.title = "考核项详情";
      });
    },
    //发回初评
    sendPreliminary() {
      adoptKpiAppeal({
        assessmentOptionId: this.form.assessmentOptionId,
        appealId: this.form.kpiAppeal.appealId,
      }).then((response) => {
        this.msgSuccess("操作成功");
        this.open = false;
        this.getList();
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.appealOpen = true;
      this.title = "申诉驳回";
    },
    commitAppeal() {
      this.$refs["appealInfo"].validate((valid) => {
        if (valid) {
          rejectKpiAppeal({
            assessmentOptionId: this.form.assessmentOptionId,
            appealRemakes: this.appealInfo.appealRemakes,
            appealId: this.form.kpiAppeal.appealId,
          }).then((response) => {
            this.open = false;
            this.appealOpen = false;
            this.getList();
          });
        }
      });
    },
    getStyle(statue) {
      return this.statueStyle[parseInt(statue) - 1];
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
  },
};
</script>
<style scoped>
/* 提示图标 */
.hint-img {
  padding: 5px;
}
/* 红色提示语 */
.font-color {
  color: #f65c55;
}

/* 检索区内容 */
.search-content {
  width: 60%;
  display: flex;
  align-items: center;
  justify-content: start;
}

.list-header-left {
  font-size: 15px;
  color: #505050;
}

.list-header-left > img {
  width: 25px;
  height: 25px;
  margin: 0 10px;
}

.el-form > .el-form-item {
  margin-bottom: 10px;
}
</style>