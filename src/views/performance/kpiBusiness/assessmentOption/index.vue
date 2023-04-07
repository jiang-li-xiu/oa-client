<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="考核项id" prop="assessmentOptionId">
        <el-input
          v-model="queryParams.assessmentOptionId"
          placeholder="请输入考核项id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="考核配置id" prop="assessmentConfigureId">
        <el-input
          v-model="queryParams.assessmentConfigureId"
          placeholder="请输入考核配置id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="指标名称" prop="targetTitle">
        <el-input
          v-model="queryParams.targetTitle"
          placeholder="请输入指标名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="目标值" prop="targetValue">
        <el-input
          v-model="queryParams.targetValue"
          placeholder="请输入目标值"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="完成值" prop="finishValue">
        <el-input
          v-model="queryParams.finishValue"
          placeholder="请输入完成值"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="指标说明" prop="targetExplain">
        <el-input
          v-model="queryParams.targetExplain"
          placeholder="请输入指标说明"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="考核项权重" prop="weightCoefficient">
        <el-input
          v-model="queryParams.weightCoefficient"
          placeholder="请输入考核项权重"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="计分方法" prop="scoringMethod">
        <el-input
          v-model="queryParams.scoringMethod"
          placeholder="请输入计分方法"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="初评人" prop="preliminaryReviewer">
        <el-input
          v-model="queryParams.preliminaryReviewer"
          placeholder="请输入初评人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="初评评分" prop="firstScore">
        <el-input
          v-model="queryParams.firstScore"
          placeholder="请输入初评评分"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="初评评语" prop="firstComment">
        <el-input
          v-model="queryParams.firstComment"
          placeholder="请输入初评评语"
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
      </el-form-item>
      <el-form-item label="终评得分" prop="finalScore">
        <el-input
          v-model="queryParams.finalScore"
          placeholder="请输入终评得分"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="终评评语" prop="finalComment">
        <el-input
          v-model="queryParams.finalComment"
          placeholder="请输入终评评语"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开启时间" prop="startTime">
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
      </el-form-item>
      <el-form-item label="考核项状态" prop="assessmentStatus">
        <el-select v-model="queryParams.assessmentStatus" placeholder="请选择考核项状态" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建人" prop="createBy">
        <el-input
          v-model="queryParams.createBy"
          placeholder="请输入创建人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker clearable size="small"
          v-model="queryParams.createTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择创建时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="更新人" prop="updateBy">
        <el-input
          v-model="queryParams.updateBy"
          placeholder="请输入更新人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="更新时间" prop="updateTime">
        <el-date-picker clearable size="small"
          v-model="queryParams.updateTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择更新时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="删除人" prop="deleteBy">
        <el-input
          v-model="queryParams.deleteBy"
          placeholder="请输入删除人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="删除时间" prop="deleteTime">
        <el-date-picker clearable size="small"
          v-model="queryParams.deleteTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择删除时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="删除标志" prop="deleteStatus">
        <el-select v-model="queryParams.deleteStatus" placeholder="请选择删除标志" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
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
    </el-row>

    <el-table v-loading="loading" :data="assessmentOptionList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="考核项id" align="center" prop="assessmentOptionId" />
      <el-table-column label="考核配置id" align="center" prop="assessmentConfigureId" />
      <el-table-column label="指标名称" align="center" prop="targetTitle" />
      <el-table-column label="目标值" align="center" prop="targetValue" />
      <el-table-column label="完成值" align="center" prop="finishValue" />
      <el-table-column label="指标说明" align="center" prop="targetExplain" />
      <el-table-column label="考核项权重" align="center" prop="weightCoefficient" />
      <el-table-column label="计分方法" align="center" prop="scoringMethod" />
      <el-table-column label="初评人" align="center" prop="preliminaryReviewer" />
      <el-table-column label="初评评分" align="center" prop="firstScore" />
      <el-table-column label="初评评语" align="center" prop="firstComment" />
      <el-table-column label="终评人" align="center" prop="finalReviewer" />
      <el-table-column label="终评得分" align="center" prop="finalScore" />
      <el-table-column label="终评评语" align="center" prop="finalComment" />
      <el-table-column label="开启时间" align="center" prop="startTime" />
      <el-table-column label="结束时间" align="center" prop="endTime" />
      <el-table-column label="考核项状态" align="center" prop="assessmentStatus" />
      <el-table-column label="创建人" align="center" prop="createBy" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新人" align="center" prop="updateBy" />
      <el-table-column label="更新时间" align="center" prop="updateTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="删除人" align="center" prop="deleteBy" />
      <el-table-column label="删除时间" align="center" prop="deleteTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.deleteTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="删除标志" align="center" prop="deleteStatus" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['business:assessmentOption:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['business:assessmentOption:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改考核项对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="考核项id" prop="assessmentOptionId">
          <el-input v-model="form.assessmentOptionId" placeholder="请输入考核项id" />
        </el-form-item>
        <el-form-item label="考核配置id" prop="assessmentConfigureId">
          <el-input v-model="form.assessmentConfigureId" placeholder="请输入考核配置id" />
        </el-form-item>
        <el-form-item label="指标名称" prop="targetTitle">
          <el-input v-model="form.targetTitle" placeholder="请输入指标名称" />
        </el-form-item>
        <el-form-item label="目标值" prop="targetValue">
          <el-input v-model="form.targetValue" placeholder="请输入目标值" />
        </el-form-item>
        <el-form-item label="完成值" prop="finishValue">
          <el-input v-model="form.finishValue" placeholder="请输入完成值" />
        </el-form-item>
        <el-form-item label="指标说明" prop="targetExplain">
          <el-input v-model="form.targetExplain" placeholder="请输入指标说明" />
        </el-form-item>
        <el-form-item label="考核项权重" prop="weightCoefficient">
          <el-input v-model="form.weightCoefficient" placeholder="请输入考核项权重" />
        </el-form-item>
        <el-form-item label="计分方法" prop="scoringMethod">
          <el-input v-model="form.scoringMethod" placeholder="请输入计分方法" />
        </el-form-item>
        <el-form-item label="初评人" prop="preliminaryReviewer">
          <el-input v-model="form.preliminaryReviewer" placeholder="请输入初评人" />
        </el-form-item>
        <el-form-item label="初评评分" prop="firstScore">
          <el-input v-model="form.firstScore" placeholder="请输入初评评分" />
        </el-form-item>
        <el-form-item label="初评评语" prop="firstComment">
          <el-input v-model="form.firstComment" placeholder="请输入初评评语" />
        </el-form-item>
        <el-form-item label="终评人" prop="finalReviewer">
          <el-input v-model="form.finalReviewer" placeholder="请输入终评人" />
        </el-form-item>
        <el-form-item label="终评得分" prop="finalScore">
          <el-input v-model="form.finalScore" placeholder="请输入终评得分" />
        </el-form-item>
        <el-form-item label="终评评语" prop="finalComment">
          <el-input v-model="form.finalComment" placeholder="请输入终评评语" />
        </el-form-item>
        <el-form-item label="开启时间" prop="startTime">
          <el-input v-model="form.startTime" placeholder="请输入开启时间" />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-input v-model="form.endTime" placeholder="请输入结束时间" />
        </el-form-item>
        <el-form-item label="考核项状态">
          <el-radio-group v-model="form.assessmentStatus">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="删除人" prop="deleteBy">
          <el-input v-model="form.deleteBy" placeholder="请输入删除人" />
        </el-form-item>
        <el-form-item label="删除时间" prop="deleteTime">
          <el-date-picker clearable size="small"
            v-model="form.deleteTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择删除时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="删除标志">
          <el-radio-group v-model="form.deleteStatus">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listAssessmentOption, getAssessmentOption, delAssessmentOption, addAssessmentOption, updateAssessmentOption, exportAssessmentOption } from "@/api/performance/assessmentOption";

export default {
  name: "AssessmentOption",
  components: {
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
        deleteStatus: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询考核项列表 */
    getList() {
      this.loading = true;
      listAssessmentOption(this.queryParams).then(response => {
        this.assessmentOptionList = response.rows;
        this.total = response.total;
        this.loading = false;
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
        assessmentStatus: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        deleteBy: null,
        deleteTime: null,
        deleteStatus: 0
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
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.assessmentOptionId)
      this.single = selection.length!==1
      this.multiple = !selection.length
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
      const assessmentOptionId = row.assessmentOptionId || this.ids
      getAssessmentOption(assessmentOptionId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改考核项";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.assessmentOptionId != null) {
            updateAssessmentOption(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addAssessmentOption(this.form).then(response => {
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
      const assessmentOptionIds = row.assessmentOptionId || this.ids;
      this.$confirm('是否确认删除考核项编号为"' + assessmentOptionIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delAssessmentOption(assessmentOptionIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有考核项数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportAssessmentOption(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
