<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="下达任务id" prop="taskId">
        <el-input
          v-model="queryParams.taskId"
          placeholder="请输入下达任务id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="任务名称" prop="taskName">
        <el-input
          v-model="queryParams.taskName"
          placeholder="请输入任务名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="任务状态" prop="taskStatus">
        <el-select v-model="queryParams.taskStatus" placeholder="请选择任务状态" clearable size="small">
          <el-option
            v-for="dict in taskStatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="任务开始日期" prop="startDate">
        <el-date-picker clearable size="small"
          v-model="queryParams.startDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择任务开始日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="任务结束日期" prop="endDate">
        <el-date-picker clearable size="small"
          v-model="queryParams.endDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择任务结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="验收人" prop="acceptanceBy">
        <el-input
          v-model="queryParams.acceptanceBy"
          placeholder="请输入验收人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="实际结束时间" prop="actualEndTime">
        <el-date-picker clearable size="small"
          v-model="queryParams.actualEndTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择实际结束时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="责任人" prop="responsibilityBy">
        <el-input
          v-model="queryParams.responsibilityBy"
          placeholder="请输入责任人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="附件id字符串" prop="fileIdStr">
        <el-input
          v-model="queryParams.fileIdStr"
          placeholder="请输入附件id字符串"
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
      <el-form-item label="删除状态" prop="deleteStatus">
        <el-select v-model="queryParams.deleteStatus" placeholder="请选择删除状态" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
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
          v-hasPermi="['business:progress:add']"
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
          v-hasPermi="['business:progress:edit']"
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
          v-hasPermi="['business:progress:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['business:progress:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="progressList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="下达任务id" align="center" prop="taskId" />
      <el-table-column label="任务名称" align="center" prop="taskName" />
      <el-table-column label="任务内容" align="center" prop="taskContent" />
      <el-table-column label="任务状态" align="center" prop="taskStatus" :formatter="taskStatusFormat" />
      <el-table-column label="任务开始日期" align="center" prop="startDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务结束日期" align="center" prop="endDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="验收人" align="center" prop="acceptanceBy" />
      <el-table-column label="实际结束时间" align="center" prop="actualEndTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.actualEndTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="责任人" align="center" prop="responsibilityBy" />
      <el-table-column label="附件id字符串" align="center" prop="fileIdStr" />
      <el-table-column label="创建人" align="center" prop="createBy" />
      <el-table-column label="创建时间" align="center" prop="createTime" />
      <el-table-column label="更新人" align="center" prop="updateBy" />
      <el-table-column label="更新时间" align="center" prop="updateTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="删除状态" align="center" prop="deleteStatus" />
      <el-table-column label="删除人" align="center" prop="deleteBy" />
      <el-table-column label="删除时间" align="center" prop="deleteTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.deleteTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务进度" align="center" prop="taskProgress" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['business:progress:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['business:progress:remove']"
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

    <!-- 添加或修改gs任务进度对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="任务名称" prop="taskName">
          <el-input v-model="form.taskName" placeholder="请输入任务名称" />
        </el-form-item>
        <el-form-item label="任务内容">
          <editor v-model="form.taskContent" :min-height="192"/>
        </el-form-item>
        <el-form-item label="任务状态">
          <el-radio-group v-model="form.taskStatus">
            <el-radio
              v-for="dict in taskStatusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="任务开始日期" prop="startDate">
          <el-date-picker clearable size="small"
            v-model="form.startDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择任务开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="任务结束日期" prop="endDate">
          <el-date-picker clearable size="small"
            v-model="form.endDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择任务结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="验收人" prop="acceptanceBy">
          <el-input v-model="form.acceptanceBy" placeholder="请输入验收人" />
        </el-form-item>
        <el-form-item label="实际结束时间" prop="actualEndTime">
          <el-date-picker clearable size="small"
            v-model="form.actualEndTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择实际结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="责任人" prop="responsibilityBy">
          <el-input v-model="form.responsibilityBy" placeholder="请输入责任人" />
        </el-form-item>
        <el-form-item label="附件id字符串" prop="fileIdStr">
          <el-input v-model="form.fileIdStr" placeholder="请输入附件id字符串" />
        </el-form-item>
        <el-form-item label="删除状态">
          <el-radio-group v-model="form.deleteStatus">
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
        <el-form-item label="任务进度">
          <editor v-model="form.taskProgress" :min-height="192"/>
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
import { listProgress, getProgress, delProgress, addProgress, updateProgress, exportProgress } from "@/api/performance/progress";
import Editor from '@/components/performance/Editor';

export default {
  name: "Progress",
  components: {
    Editor,
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
      // gs任务进度表格数据
      progressList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 任务状态字典
      taskStatusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        taskId: null,
        taskName: null,
        taskContent: null,
        taskStatus: null,
        startDate: null,
        endDate: null,
        acceptanceBy: null,
        actualEndTime: null,
        responsibilityBy: null,
        fileIdStr: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        deleteStatus: null,
        deleteBy: null,
        deleteTime: null,
        taskProgress: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        taskName: [
          { required: true, message: "任务名称不能为空", trigger: "blur" }
        ],
        taskContent: [
          { required: true, message: "任务内容不能为空", trigger: "blur" }
        ],
        taskStatus: [
          { required: true, message: "任务状态不能为空", trigger: "blur" }
        ],
        startDate: [
          { required: true, message: "任务开始日期不能为空", trigger: "blur" }
        ],
        endDate: [
          { required: true, message: "任务结束日期不能为空", trigger: "blur" }
        ],
        acceptanceBy: [
          { required: true, message: "验收人不能为空", trigger: "blur" }
        ],
        actualEndTime: [
          { required: true, message: "实际结束时间不能为空", trigger: "blur" }
        ],
        responsibilityBy: [
          { required: true, message: "责任人不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("GS_TASK_STATUS").then(response => {
      this.taskStatusOptions = response.data;
    });
  },
  methods: {
    /** 查询gs任务进度列表 */
    getList() {
      this.loading = true;
      listProgress(this.queryParams).then(response => {
        this.progressList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 任务状态字典翻译
    taskStatusFormat(row, column) {
      return this.selectDictLabel(this.taskStatusOptions, row.taskStatus);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        taskId: null,
        taskName: null,
        taskContent: null,
        taskStatus: "0",
        startDate: null,
        endDate: null,
        acceptanceBy: null,
        actualEndTime: null,
        responsibilityBy: null,
        fileIdStr: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        deleteStatus: 0,
        deleteBy: null,
        deleteTime: null,
        taskProgress: null
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
      this.ids = selection.map(item => item.taskId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加gs任务进度";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const taskId = row.taskId || this.ids
      getProgress(taskId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改gs任务进度";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.taskId != null) {
            updateProgress(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addProgress(this.form).then(response => {
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
      const taskIds = row.taskId || this.ids;
      this.$confirm('是否确认删除gs任务进度编号为"' + taskIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delProgress(taskIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有gs任务进度数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportProgress(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
