<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="关联考核配置总表id" prop="assessmentConfigureId">
        <el-input
          v-model="queryParams.assessmentConfigureId"
          placeholder="请输入关联考核配置总表id"
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
        <el-select v-model="queryParams.preliminaryReviewer" placeholder="请选择初评人" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="终评人" prop="finalReviewer">
        <el-select v-model="queryParams.finalReviewer" placeholder="请选择终评人" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
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
      <el-form-item label="初评完成值" prop="finishValue">
        <el-input
          v-model="queryParams.finishValue"
          placeholder="请输入初评完成值"
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
      <el-form-item label="终评完成值" prop="finalFinishValue">
        <el-input
          v-model="queryParams.finalFinishValue"
          placeholder="请输入终评完成值"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开启时间" prop="startTime">
        <el-date-picker clearable size="small"
          v-model="queryParams.startTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择开启时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-date-picker clearable size="small"
          v-model="queryParams.endTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择结束时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="考核项状态" prop="assessmentStatus">
        <el-select v-model="queryParams.assessmentStatus" placeholder="请选择考核项状态" clearable size="small">
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
          v-hasPermi="['business:kpiCheckNape:add']"
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
          v-hasPermi="['business:kpiCheckNape:edit']"
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
          v-hasPermi="['business:kpiCheckNape:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['business:kpiCheckNape:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

  <el-table v-loading="loading" :data="kpiCheckNapeList" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55" align="center" />
    <el-table-column label="考核项id" align="center" prop="assessmentOptionId" />
    <el-table-column label="关联考核配置总表id" align="center" prop="assessmentConfigureId" />
    <el-table-column label="指标名称" align="center" prop="targetTitle" />
    <el-table-column label="目标值" align="center" prop="targetValue" />
    <el-table-column label="指标说明" align="center" prop="targetExplain" />
    <el-table-column label="考核项权重" align="center" prop="weightCoefficient" />
    <el-table-column label="计分方法" align="center" prop="scoringMethod" />
    <el-table-column label="初评人" align="center" prop="preliminaryReviewer" />
    <el-table-column label="终评人" align="center" prop="finalReviewer" />
    <el-table-column label="初评评分" align="center" prop="firstScore" />
    <el-table-column label="初评评语" align="center" prop="firstComment" />
    <el-table-column label="初评完成值" align="center" prop="finishValue" />
    <el-table-column label="终评得分" align="center" prop="finalScore" />
    <el-table-column label="终评评语" align="center" prop="finalComment" />
    <el-table-column label="终评完成值" align="center" prop="finalFinishValue" />
    <el-table-column label="开启时间" align="center" prop="startTime" width="180">
      <template slot-scope="scope">
        <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
      </template>
    </el-table-column>
    <el-table-column label="结束时间" align="center" prop="endTime" width="180">
      <template slot-scope="scope">
        <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
      </template>
    </el-table-column>
    <el-table-column label="考核项状态" align="center" prop="assessmentStatus" />
    <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
      <template slot-scope="scope">
        <el-button
          size="mini"
          type="text"
          icon="el-icon-edit"
          @click="handleUpdate(scope.row)"
          v-hasPermi="['business:kpiCheckNape:edit']"
        >修改</el-button>
        <el-button
          size="mini"
          type="text"
          icon="el-icon-delete"
          @click="handleDelete(scope.row)"
          v-hasPermi="['business:kpiCheckNape:remove']"
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
    <KpiCheckNapeDialog
      :open.sync="open"
      :title="title"
      @getList="getList"
    />
  </div>
</template>

<script>
import { listKpiCheckNape, getKpiCheckNape, delKpiCheckNape, addKpiCheckNape, updateKpiCheckNape, exportKpiCheckNape } from "@/api/performance/kpiCheckNape";
import KpiCheckNapeDialog from "./components/kpiCheckNapeDialog"
export default {
  name: "KpiCheckNape",
  components: {
    KpiCheckNapeDialog
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
      kpiCheckNapeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        assessmentConfigureId: null,
        targetTitle: null,
        targetValue: null,
        targetExplain: null,
        weightCoefficient: null,
        scoringMethod: null,
        preliminaryReviewer: null,
        finalReviewer: null,
        firstScore: null,
        firstComment: null,
        finishValue: null,
        finalScore: null,
        finalComment: null,
        finalFinishValue: null,
        startTime: null,
        endTime: null,
        assessmentStatus: null,
      },
      // 表单参数
      form: {

      },
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
      listKpiCheckNape(this.queryParams).then(response => {
        this.kpiCheckNapeList = response.rows;
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
        targetExplain: null,
        weightCoefficient: null,
        scoringMethod: null,
        preliminaryReviewer: null,
        finalReviewer: null,
        firstScore: null,
        firstComment: null,
        finishValue: null,
        finalScore: null,
        finalComment: null,
        finalFinishValue: null,
        startTime: null,
        endTime: null,
        assessmentStatus: "0",
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
      getKpiCheckNape(assessmentOptionId).then(response => {
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
            updateKpiCheckNape(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addKpiCheckNape(this.form).then(response => {
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
          return delKpiCheckNape(assessmentOptionIds);
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
          return exportKpiCheckNape(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
