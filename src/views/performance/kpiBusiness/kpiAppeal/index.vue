<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="申诉id" prop="appealId">
        <el-input
          v-model="queryParams.appealId"
          placeholder="请输入申诉id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="考核选项id" prop="assessmentOptionId">
        <el-input
          v-model="queryParams.assessmentOptionId"
          placeholder="请输入考核选项id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="申诉内容" prop="appealReason">
        <el-input
          v-model="queryParams.appealReason"
          placeholder="请输入申诉内容"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="申诉附件字符串" prop="appealFileIdStr">
        <el-input
          v-model="queryParams.appealFileIdStr"
          placeholder="请输入申诉附件字符串"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="申诉状态" prop="appealStatus">
        <el-select v-model="queryParams.appealStatus" placeholder="请选择申诉状态" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="评审备注" prop="appealRemakes">
        <el-input
          v-model="queryParams.appealRemakes"
          placeholder="请输入评审备注"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="评审人" prop="assessor">
        <el-input
          v-model="queryParams.assessor"
          placeholder="请输入评审人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['business:kpiAppeal:add']"
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
          v-hasPermi="['business:kpiAppeal:edit']"
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
          v-hasPermi="['business:kpiAppeal:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['business:kpiAppeal:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="kpiAppealList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="申诉id" align="center" prop="appealId" />
      <el-table-column label="考核选项id" align="center" prop="assessmentOptionId" />
      <el-table-column label="申诉内容" align="center" prop="appealReason" />
      <el-table-column label="申诉附件字符串" align="center" prop="appealFileIdStr" />
      <el-table-column label="申诉状态" align="center" prop="appealStatus" />
      <el-table-column label="评审备注" align="center" prop="appealRemakes" />
      <el-table-column label="评审人" align="center" prop="assessor" />
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
            v-hasPermi="['business:kpiAppeal:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['business:kpiAppeal:remove']"
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

    <!-- 添加或修改kpi考核项申诉对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="考核选项id" prop="assessmentOptionId">
          <el-input v-model="form.assessmentOptionId" placeholder="请输入考核选项id" />
        </el-form-item>
        <el-form-item label="申诉内容" prop="appealReason">
          <el-input v-model="form.appealReason" placeholder="请输入申诉内容" />
        </el-form-item>
        <el-form-item label="申诉附件字符串" prop="appealFileIdStr">
          <el-input v-model="form.appealFileIdStr" placeholder="请输入申诉附件字符串" />
        </el-form-item>
        <el-form-item label="申诉状态">
          <el-radio-group v-model="form.appealStatus">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="评审备注" prop="appealRemakes">
          <el-input v-model="form.appealRemakes" placeholder="请输入评审备注" />
        </el-form-item>
        <el-form-item label="评审人" prop="assessor">
          <el-input v-model="form.assessor" placeholder="请输入评审人" />
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
import { listKpiAppeal, getKpiAppeal, delKpiAppeal, addKpiAppeal, updateKpiAppeal, exportKpiAppeal } from "@/api/performance/kpiAppeal";

export default {
  name: "KpiAppeal",
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
      // kpi考核项申诉表格数据
      kpiAppealList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        appealId: null,
        assessmentOptionId: null,
        appealReason: null,
        appealFileIdStr: null,
        appealStatus: null,
        appealRemakes: null,
        assessor: null,
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
        assessmentOptionId: [
          { required: true, message: "考核选项id不能为空", trigger: "blur" }
        ],
        appealReason: [
          { required: true, message: "申诉内容不能为空", trigger: "blur" }
        ],
        appealStatus: [
          { required: true, message: "申诉状态不能为空", trigger: "blur" }
        ],
        assessor: [
          { required: true, message: "评审人不能为空", trigger: "blur" }
        ],
        createBy: [
          { required: true, message: "创建人不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询kpi考核项申诉列表 */
    getList() {
      this.loading = true;
      listKpiAppeal(this.queryParams).then(response => {
        this.kpiAppealList = response.rows;
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
        appealId: null,
        assessmentOptionId: null,
        appealReason: null,
        appealFileIdStr: null,
        appealStatus: 0,
        appealRemakes: null,
        assessor: null,
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
      this.ids = selection.map(item => item.appealId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加kpi考核项申诉";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const appealId = row.appealId || this.ids
      getKpiAppeal(appealId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改kpi考核项申诉";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.appealId != null) {
            updateKpiAppeal(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addKpiAppeal(this.form).then(response => {
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
      const appealIds = row.appealId || this.ids;
      this.$confirm('是否确认删除kpi考核项申诉编号为"' + appealIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delKpiAppeal(appealIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有kpi考核项申诉数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportKpiAppeal(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
