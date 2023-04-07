<template>
  <div class="app-container">
    <div class="content bg-border-color-10">
      <div class="flex-center">
        <img src="@/assets/images/look-over.png" alt="" class="list-img" />
        <p class="font-15 font-700 color-50 ml0">筛选查询</p>
      </div>

      <el-form
        class="el-form flex-align-between mt20 mb10 el-form--inline"
        :model="queryParams"
        ref="queryForm"
        :inline="true"
        v-show="showSearch"
        label-width="100px"
      >
        <el-form-item label="申请任务名称" prop="applyTaskName">
          <el-input
            v-model="queryParams.applyTaskName"
            placeholder="请输入申请任务名称"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="申请人" label-width="60px" prop="createName">
          <el-input
            v-model="queryParams.createName"
            placeholder="请输入申请人"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="申请任务状态" prop="applyTaskStatue">
          <el-select
            v-model="queryParams.applyTaskStatue"
            placeholder="请选择申请任务状态"
            clearable
            size="small"
          >
            <el-option
              v-for="dict in applyTaskStatueOptions"
              v-show="dict.value != '1'"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="开始日期" label-width="70px" prop="startRange">
          <el-date-picker
            v-model="queryParams.startRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始"
            end-placeholder="结束"
            value-format="yyyy-MM-dd HH:mm"
            format="yyyy-MM-dd HH:mm"
            align="right"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="结束日期" label-width="70px" prop="endRange">
          <el-date-picker
            v-model="queryParams.endRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始"
            end-placeholder="结束"
            value-format="yyyy-MM-dd HH:mm"
            format="yyyy-MM-dd HH:mm"
            align="right"
          >
          </el-date-picker>
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
      <div>
        <div class="flex-align-between mb10">
          <div class="flex-align-center">
            <img
              src="@/assets/images/list.png"
              alt=""
              class="list-img ml0 mr10"
            />
            <p class="color-50 font-15 font-700">数据列表</p>
          </div>
          <div class="mr10">
            <el-button
              style="margin-left: :;px;"
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              >导出
            </el-button>
          </div>
        </div>
      </div>
      <div>
        <el-table
          v-loading="loading"
          stripe
           ref="tableList"
           @sort-change="sortChange"
          :data="taskList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="编号" sortable="custom" align="center" prop="applyTaskId" />
          <el-table-column
            label="申请任务名称"
            min-width="200%"
            :show-overflow-tooltip="true"
            align="center"
            prop="applyTaskName"
          />
          <el-table-column label="申请人" align="center" prop="createByName" />
          <el-table-column
            label="开始日期"
            width="150%"
            sortable="custom"
            align="center"
            prop="startDate"
          >
            <template slot-scope="scope">
              <span>{{
                scope.row.startDate | parseTime("{y}-{m}-{d} {h}:{i}")
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="结束日期"
            sortable="custom"
            align="center"
            prop="endDate"
            width="150%"
          >
            <template slot-scope="scope">
              <span>{{
                scope.row.endDate | parseTime("{y}-{m}-{d} {h}:{i}")
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="考核年月"
            align="center"
            prop="createTime"
            width="180"
          >
            <template slot-scope="scope">
              {{ scope.row.assessmentYear }}年{{ scope.row.assessmentMonth }}月
            </template>
          </el-table-column>
          <el-table-column label="工时" align="center" prop="workTime" />
          <el-table-column label="审批人" align="center" prop="approvalName" />
          <el-table-column
            label="状态"
            align="center"
            prop="applyTaskStatue"
            :formatter="applyTaskStatueFormat"
          >
            <template slot-scope="scope">
              <el-tag :type="getStatusType(scope.row.applyTaskStatue)">{{
                applyTaskStatueFormat(scope.row, scope.row.applyTaskStatue)
              }}</el-tag>
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
              >
                申请详情
              </el-button>
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
    </div>
    <!-- 审批或详情 -->
    <myCheckApplyTaskHandle ref="modalForm"></myCheckApplyTaskHandle>
  </div>
</template>

<script>
import { myListTask, adoptApplyTask,  rejectTask, getTask, delTask, exportTask} from "@/api/performance/task";
import FileUpload from "@/components/performance/FileUpload";
import Editor from "@/components/performance/Editor";
import fileList from "@/components/performance/fileList";
import { parseTime, exportXls, selectDictLabel } from "@/utils/performance/ruoyi";
import { ajaxGetDictItems } from '@/api/api'
import myCheckApplyTaskHandle from './modules/myCheckApplyTaskHandle'
export default {
  name: "Task",
  filters: {
    parseTime,
  },
  components: {
    myCheckApplyTaskHandle,
    FileUpload,
    Editor,
    fileList
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
      //审核人列表
      approvalByList: undefined,
      approvalRes: 0,
      // 显示搜索条件
      showSearch: true,
      //审核框显示
      infoDialogOpen: false,
      //详情框显示
      infoDialogOpenInfo: false,
      // 总条数
      total: 0,
      // 主动任务申请表格数据
      taskList: [],
      //审核任务信息
      gsApplyInfo: {
        fileIdStr: null,
        remarks: null,
        commentScore: null,
        milestoneListVo: [],
      },
      //任务状态
      StatusType: ["", "info", "", "success", "danger"],
      // 弹出层标题
      title: "",
      //是否显示提交按钮
      btn: false,
      // 是否显示下拉
      show: false,
      //用户名
      userName: null,
      // 是否显示弹出层
      open: false,
      // 主动任务申请状态字典
      applyTaskStatueOptions: [],
      // 考核类型字典
      assessmentTypeOptions: [],
      //任务权重字典
      weightCoefficientOptions: [],
      //查询用户列表参数
      userQueryParams: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        applyTaskId: null,
        applyTaskName: null,
        commentScore: null,
        startRange: [],
        endRange: [],
        createTime: null,
        createBy: null,
        createName: null,
        approvalBy: null,
        updateBy: null,
        updateTime: null,
        fileIdStr: null,
        applyTaskStatue: null,
        deleteStatus: null,
        deleteBy: null,
        deleteTime: null,
      },
      //
      temp: {},
      // 表单参数
      form: { milestoneListVo: [] },
      // 表单校验
    };
  },
  created() {
    this.userName = this.$store.getters.userInfo.username;
    this.getList();
    //主动任务申请字典
    ajaxGetDictItems("gs_apply_task_status", null).then((res) => {
      this.applyTaskStatueOptions = res.result;
    });
    // 获取考核状态字典
    ajaxGetDictItems("gs_assessment_type").then((response) => {
      this.assessmentTypeOptions = response.data;
    });


  },
  methods: {
    /** 查询主动任务申请列表 */
    getList() {
      this.loading = true;
      // this.queryParams.approvalBy = this.userName;
      console.log("pageNum:" + typeof(this.queryParams.pageNum))
      myListTask(this.queryParams).then((response) => {
        this.taskList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    clickNode($event) {
      $event.target.parentElement.parentElement.firstElementChild.click();
    },
    //自动关闭选择框
    close(val) {
      console.log(val);
      this.$refs.cascaderHandle.dropDownVisible = false; //监听值发生变化就关闭它
    },
    // 申请任务状态字典翻译
    applyTaskStatueFormat(row, column) {
      return selectDictLabel(this.applyTaskStatueOptions, row.applyTaskStatue);
    },
    // 取消按钮
    cancel() {
      this.infoDialogOpen = false;
      this.infoDialogOpenInfo = false;
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
      this.ids = selection.map((item) => item.applyTaskId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 详情按钮操作 */
    handleUpdate(row) {
      this.$nextTick(()=>{
        this.$refs.modalForm.handle(row.applyTaskId);
      })
    },
    /** 提交按钮 */
    submitForm(result) {
      console.log(this.form);
      if (result == 0) {
        this.error();
        return;
      }
      if (result == "1") {
        this.$refs["form"].validate((valid) => {
          if (!valid || !this.dataValidation()) {
            return;
          }
          adoptApplyTask(this.form).then((response) => {
            this.msgSuccess("审批成功,任务已下达");
            this.infoDialogOpen = false;
            this.getList();
          });
        });
      } else {
        rejectTask({
          applyTaskId: this.form.applyTaskId,
          approvalRemarks: this.form.approvalRemarks,
        }).then((response) => {
          this.msgSuccess("审批成功");
          this.infoDialogOpen = false;
          this.getList();
        });
      }
    },
    //校验验收人
    dataValidation() {
      if (
        this.form.acceptanceList === undefined ||
        this.form.acceptanceList.length === 0
      ) {
        this.$message.error("请选择验收人");
        return false;
      }
      let validatedByAcceptance = this.$refs.addOrEditAcceptance.dataValidation();
      if (!validatedByAcceptance) {
        return false;
      }
      return true;
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const applyTaskIds = row.applyTaskId || this.ids;
      this.$confirm(
        '是否确认删除主动任务申请编号为"' + applyTaskIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delTask(applyTaskIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      queryParams.approvalBy = this.$store.getters.userInfo.username;
      queryParams.exportName = "我审批的主动任务申请";
      queryParams.applyTaskIds = this.ids;
 
      this.$confirm({
        title: "提示",
        content: "是否导出选中数据?",
        onOk: function () {
          exportXls('/perf/taskApplyManager/exportXls', queryParams);
        }
      });
    },
    // 关闭时回调
    closed() {
      this.approvalRes = 0;
      this.$refs.addOrEditAcceptance.clear();
    },
    getStatusType(statue) {
      return this.StatusType[parseInt(statue)];
    },
    error() {
      this.$message.error("请选择审批结果！！！！");
    },
    // 点击排序箭头调用
    sortChange(data) {
      const { column, prop, order } = data;
      if (order === null) {
        return;
      }
    
      this.queryParams.isAsc = order === "ascending" ? "asc" : "desc";
      // 需要指定一下是那张表
      this.queryParams.orderByColumn = `s.${prop}`;
    
      this.getList();
    },
  },
};
</script>
<style lang="less" scoped>
@import '../../assets/styles/performance.less';
p {
  display: inline;
}

.el-button + .el-button {
  margin-left: 0;
}

.el-form-item {
  margin-bottom: 0;
}
.el-form > .el-form-item {
  margin-bottom: 10px;
}
</style>
