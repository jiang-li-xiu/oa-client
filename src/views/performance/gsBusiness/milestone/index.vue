<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="里程碑id" prop="milestoneId">
        <el-input
          v-model="queryParams.milestoneId"
          placeholder="请输入里程碑id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="任务id" prop="taskId">
        <el-input
          v-model="queryParams.taskId"
          placeholder="请输入任务id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="里程碑名称" prop="milestoneName">
        <el-input
          v-model="queryParams.milestoneName"
          placeholder="请输入里程碑名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="里程碑日期" prop="milestoneDate">
        <el-date-picker clearable size="small"
          v-model="queryParams.milestoneDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择里程碑日期">
        </el-date-picker>
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
      <el-form-item label="里程碑完成状态" prop="milestoneStatus">
        <el-select v-model="queryParams.milestoneStatus" placeholder="请选择里程碑完成状态" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="提前提醒天数" prop="remindDay">
        <el-input
          v-model="queryParams.remindDay"
          placeholder="请输入提前提醒天数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="报告提醒日期" prop="reportTime">
        <el-date-picker clearable size="small"
          v-model="queryParams.reportTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择报告提醒日期">
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
          v-hasPermi="['business:milestone:add']"
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
          v-hasPermi="['business:milestone:edit']"
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
          v-hasPermi="['business:milestone:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['business:milestone:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="milestoneList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="里程碑id" align="center" prop="milestoneId" />
      <el-table-column label="任务id" align="center" prop="taskId" />
      <el-table-column label="里程碑名称" align="center" prop="milestoneName" />
      <el-table-column label="里程碑日期" align="center" prop="milestoneDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.milestoneDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="里程碑内容" align="center" prop="milestoneContent" />
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
      <el-table-column label="里程碑完成状态" align="center" prop="milestoneStatus" />
      <el-table-column label="里程碑报告内容" align="center" prop="milestoneReport" />
      <el-table-column label="提前提醒天数" align="center" prop="remindDay" />
      <el-table-column label="报告提醒日期" align="center" prop="reportTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.reportTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['business:milestone:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['business:milestone:remove']"
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

    <!-- 添加或修改GS任务里程碑信息对话框的 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="任务id" prop="taskId">
          <el-input v-model="form.taskId" placeholder="请输入任务id" />
        </el-form-item>
        <el-form-item label="里程碑名称" prop="milestoneName">
          <el-input v-model="form.milestoneName" placeholder="请输入里程碑名称" />
        </el-form-item>
        <el-form-item label="里程碑日期" prop="milestoneDate">
          <el-date-picker clearable size="small"
            v-model="form.milestoneDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择里程碑日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="里程碑内容" prop="milestoneContent">
          <el-input v-model="form.milestoneContent" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="里程碑完成状态" prop="milestoneStatus">
          <el-select v-model="form.milestoneStatus" placeholder="请选择里程碑完成状态">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="里程碑报告内容">
          <editor v-model="form.milestoneReport" :min-height="192"/>
        </el-form-item>
        <el-form-item label="提前提醒天数" prop="remindDay">
          <el-input v-model="form.remindDay" placeholder="请输入提前提醒天数" />
        </el-form-item>
        <el-form-item label="报告提醒日期" prop="reportTime">
          <el-date-picker clearable size="small"
            v-model="form.reportTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择报告提醒日期">
          </el-date-picker>
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
import { listMilestone, getMilestone, delMilestone, addMilestone, updateMilestone, exportMilestone } from "@/api/performance/milestone";
import Editor from '@/components/performance/Editor';

export default {
  name: "Milestone",
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
      // GS任务里程碑信息表格数据
      milestoneList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        milestoneId: null,
        taskId: null,
        milestoneName: null,
        milestoneDate: null,
        milestoneContent: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        milestoneStatus: null,
        milestoneReport: null,
        remindDay: null,
        reportTime: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        milestoneName: [
          { required: true, message: "里程碑名称不能为空", trigger: "blur" }
        ],
        milestoneDate: [
          { required: true, message: "里程碑日期不能为空", trigger: "blur" }
        ],
        milestoneContent: [
          { required: true, message: "里程碑内容不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询GS任务里程碑信息列表 */
    getList() {
      this.loading = true;
      listMilestone(this.queryParams).then(response => {
        this.milestoneList = response.rows;
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
        milestoneId: null,
        taskId: null,
        milestoneName: null,
        milestoneDate: null,
        milestoneContent: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        milestoneStatus: null,
        milestoneReport: null,
        remindDay: null,
        reportTime: null
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
      this.ids = selection.map(item => item.milestoneId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加GS任务里程碑信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const milestoneId = row.milestoneId || this.ids
      getMilestone(milestoneId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改GS任务里程碑信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.milestoneId != null) {
            updateMilestone(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addMilestone(this.form).then(response => {
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
      const milestoneIds = row.milestoneId || this.ids;
      this.$confirm('是否确认删除GS任务里程碑信息编号为"' + milestoneIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delMilestone(milestoneIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有GS任务里程碑信息数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportMilestone(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
