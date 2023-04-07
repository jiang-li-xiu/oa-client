<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="考核配置id" prop="assessmentConfigureId">
        <el-input
          v-model="queryParams.assessmentConfigureId"
          placeholder="请输入考核配置id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="合约配置id" prop="kpiContractId">
        <el-input
          v-model="queryParams.kpiContractId"
          placeholder="请输入合约配置id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="考核类型" prop="assessmentType">
        <el-select v-model="queryParams.assessmentType" placeholder="请选择考核类型" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="kpi得分" prop="kpiScore">
        <el-input
          v-model="queryParams.kpiScore"
          placeholder="请输入kpi得分"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="考核年" prop="assessmentYear">
        <el-input
          v-model="queryParams.assessmentYear"
          placeholder="请输入考核年"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="考核月" prop="assessmentMonth">
        <el-input
          v-model="queryParams.assessmentMonth"
          placeholder="请输入考核月"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="配置是否已启动" prop="isStart">
        <el-input
          v-model="queryParams.isStart"
          placeholder="请输入配置是否已启动"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="创建人" prop="createBy">
        <el-input
          v-model="queryParams.createBy"
          placeholder="请输入创建人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
     <!-- <el-form-item label="创建时间" prop="createTime">
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
      <el-form-item label="删除标识" prop="deleteStatus">
        <el-select v-model="queryParams.deleteStatus" placeholder="请选择删除标识" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item> -->
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
          v-hasPermi="['business:assessmentConfigure:add']"
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
          v-hasPermi="['business:assessmentConfigure:edit']"
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
          v-hasPermi="['business:assessmentConfigure:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['business:assessmentConfigure:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="assessmentConfigureList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="考核配置id" align="center" prop="assessmentConfigureId" />
      <el-table-column label="合约配置id" align="center" prop="kpiContractId" />
      <el-table-column label="考核类型" align="center" prop="assessmentType" />
      <el-table-column label="kpi得分" align="center" prop="kpiScore" />
      <el-table-column label="考核年" align="center" prop="assessmentYear" />
      <el-table-column label="考核月" align="center" prop="assessmentMonth" />
      <el-table-column label="配置是否已启动" align="center" prop="isStart" />
      <!-- <el-table-column label="创建人" align="center" prop="createBy" />
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
      <el-table-column label="删除标识" align="center" prop="deleteStatus" /> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['business:assessmentConfigure:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['business:assessmentConfigure:remove']"
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

    <!-- 添加或修改KPI考核项配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="合约配置id" prop="kpiContractId">
          <el-input v-model="form.kpiContractId" placeholder="请输入合约配置id" />
        </el-form-item>
        <el-form-item label="考核类型" prop="assessmentType">
          <el-select v-model="form.assessmentType" placeholder="请选择考核类型">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="kpi得分" prop="kpiScore">
          <el-input v-model="form.kpiScore" placeholder="请输入kpi得分" />
        </el-form-item>
        <el-form-item label="考核年" prop="assessmentYear">
          <el-input v-model="form.assessmentYear" placeholder="请输入考核年" />
        </el-form-item>
        <el-form-item label="考核月" prop="assessmentMonth">
          <el-input v-model="form.assessmentMonth" placeholder="请输入考核月" />
        </el-form-item>
        <el-form-item label="配置是否已启动" prop="isStart">
          <el-input v-model="form.isStart" placeholder="请输入配置是否已启动" />
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
        <el-form-item label="删除标识">
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
import { listAssessmentConfigure, getAssessmentConfigure, delAssessmentConfigure, addAssessmentConfigure, updateAssessmentConfigure, exportAssessmentConfigure } from "@/api/performance/assessmentConfigure";

export default {
  name: "AssessmentConfigure",
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
      // KPI考核项配置表格数据
      assessmentConfigureList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        assessmentConfigureId: null,
        kpiContractId: null,
        assessmentType: null,
        kpiScore: null,
        assessmentYear: null,
        assessmentMonth: null,
        isStart: null,
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
        kpiContractId: [
          { required: true, message: "合约配置id不能为空", trigger: "blur" }
        ],
        assessmentType: [
          { required: true, message: "考核类型不能为空", trigger: "change" }
        ],
        isStart: [
          { required: true, message: "配置是否已启动不能为空", trigger: "blur" }
        ],
        createBy: [
          { required: true, message: "创建人不能为空", trigger: "blur" }
        ],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询KPI考核项配置列表 */
    getList() {
      this.loading = true;
      listAssessmentConfigure(this.queryParams).then(response => {
        this.assessmentConfigureList = response.rows;
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
        assessmentConfigureId: null,
        kpiContractId: null,
        assessmentType: null,
        kpiScore: null,
        assessmentYear: null,
        assessmentMonth: null,
        isStart: null,
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
      this.ids = selection.map(item => item.assessmentConfigureId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加KPI考核项配置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const assessmentConfigureId = row.assessmentConfigureId || this.ids
      getAssessmentConfigure(assessmentConfigureId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改KPI考核项配置";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.assessmentConfigureId != null) {
            updateAssessmentConfigure(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addAssessmentConfigure(this.form).then(response => {
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
      const assessmentConfigureIds = row.assessmentConfigureId || this.ids;
      this.$confirm('是否确认删除KPI考核项配置编号为"' + assessmentConfigureIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delAssessmentConfigure(assessmentConfigureIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有KPI考核项配置数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportAssessmentConfigure(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
