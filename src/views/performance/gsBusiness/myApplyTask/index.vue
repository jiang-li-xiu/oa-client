<template>
  <div class="app-container">
    <div class="bg-border-color-10">
      <div class="flex-center">
        <img src="@/assets/images/look-over.png" alt="" class="list-img" />
        <p class="font-15 font-700 color-50">筛选查询</p>
      </div>
      <el-form
        class="el-form flex-align-between mt20 mb10 el-form--inline"
        :model="queryParams"
        ref="queryForm"
        :inline="true"
        v-show="showSearch"
        label-width="70px"
      >

              <el-form-item label="任务名称" prop="applyTaskName">
                <el-input
                  v-model="queryParams.applyTaskName"
                  placeholder="请输入申请任务名称"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>

              <el-form-item label="审批人" prop="approvalBy">
                <el-input
                  v-model="queryParams.approvalBy"
                  placeholder="请输入审批人"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>

              <el-form-item label="任务状态" prop="applyTaskStatue">
                <el-select
                  v-model="queryParams.applyTaskStatue"
                  placeholder="请选择申请任务状态"
                  clearable
                  size="small"
                >
                  <el-option
                    v-for="dict in applyTaskStatueOptions"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>

              <el-form-item label="开始日期" prop="startRange">
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

              <el-form-item label="结束日期" prop="endRange">
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
      <div class="flex-align-between">
        <div class="flex-align-center mb10">
          <img src="@/assets/images/list.png" alt="" class="list-img mr10" />
          <p class="color-50 font-15 font-700">数据列表</p>
        </div>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-has="'business:taskApplyManager:add'"
              >新增</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-has="'business:taskApplyManager:remove'"
            >
              删除
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-has="'business:taskApplyManager:export'"
              >导出</el-button
            >
          </el-col>
          <right-toolbar
            :showSearch.sync="showSearch"
            @queryTable="getList"
          ></right-toolbar>
        </el-row>
      </div>
      <!-- table区域-begin -->
 
      <el-table
        v-loading="loading"
        stripe
        ref="tableList"
        :data="taskList"
         @sort-change="sortChange"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="编号" sortable="custom" align="center" prop="applyTaskId" />
        <el-table-column
          label="申请任务名称"
          min-width="250%"
          :show-overflow-tooltip="true"
          align="center"
          prop="applyTaskName"
        />
        <!-- <el-table-column label="申请任务内容" align="center" prop="commentScore" /> -->
        <el-table-column
          label="开始日期"
          sortable="custom"
          width="150%"
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
        <!-- <el-table-column label="申请人" align="center" prop="createByName" /> -->
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
            <span v-has="'business:taskApplyManager:edit'">
              <template  v-if="scope.row.applyTaskStatue <= 2">
                <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">编辑</el-button>
                <a-divider type="vertical" />
              </template>
            </span>
            <template>
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handleInfo(scope.row)">详情</el-button>
            </template>
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

    <!-- 添加或修改主动任务申请对话框 -->
    <MyApplyTaskForm ref="modalForm" @ok="modalFormOk"></MyApplyTaskForm>

    <!-- 审批结果详情 -->
    <MyApplyTaskDetail ref="modalDetail"></MyApplyTaskDetail>

  </div>
</template>

<script>
import { listTask, delTask, exportTask } from "@/api/performance/task";
import FileUpload from "@/components/performance/FileUpload";
import DispatchUser from "@/components/performance/DispatchUser";
import AddOrEditMilestone from "@/views/performance/gsBusiness/myAssignTask/components/addOrEditMilestone";
import Editor from "@/components/performance/Editor";
import fileList from "@/components/performance/fileList";
import { parseTime, formatFileSize, selectDictLabel } from "@/utils/performance/ruoyi";
import { ajaxGetDictItems } from '@/api/api'
import MyApplyTaskForm from './modules/MyApplyTaskForm'
import MyApplyTaskDetail from './modules/MyApplyTaskDetail'

export default {
  name: "Task",
  components: {
    FileUpload,
    Editor,
    fileList,
    AddOrEditMilestone,
    DispatchUser,
    MyApplyTaskForm,
    MyApplyTaskDetail
  },
  filters: {
    parseTime,
    formatFileSize,
  },
  computed:{
    workTimePlace(){
      return (Date.parse(this.form.endDate) - Date.parse(this.form.startDate))/1000/60/60 ;
    },
  },
  data() {
    return {
      //任务状态
      StatusType: ["", "info", "", "success", "danger"],
      //审核人列表
      approvalByList: undefined,
      // 遮罩层''
      loading: true,
      // 选中数组
      ids: [],
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      //用户名
      userName: null,
      // 总条数
      total: 0,
      // 主动任务申请表格数据
      taskList: [],
      fileIdStr: null,
      milestoneVoList: [],
      gsApplyInfo: {
        remarks: null,
        commentScore: null,
        milestoneListVo: [],
      },
      //对话框，修改或者添加
      dialogType: "",
      // 弹出层标题
      title: "",
      // 拿到当前用户信息
      // 是否显示弹出层
      open: false,
      //详情弹出层
      infoDialogOpen: false,
      // 申请任务状态字典
      applyTaskStatueOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 15,
        applyTaskId: null,
        applyTaskName: null,
        commentScore: null,
        startRange: [],
        endRange: [],
        createTime: null,
        createBy: null,
        approvalBy: null,
        updateBy: null,
        updateTime: null,
        fileIdStr: null,
        applyTaskStatue: null,
        deleteStatus: null,
        deleteBy: null,
        deleteTime: null,
      },
    };
  },
  created() {
    this.userName = this.$store.getters.userInfo.username;
    this.getList();
    ajaxGetDictItems("gs_apply_task_status", null).then((res) => {
      this.applyTaskStatueOptions = res.result;
    });
  },
  methods: {
    /** 查询主动任务申请列表 */
    getList() {
      this.loading = true;
      //获取当前用户信息
      this.queryParams.createBy = this.userName;
      listTask(this.queryParams).then((response) => {
        this.taskList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 申请任务状态字典翻译
    applyTaskStatueFormat(row, column) {
      return selectDictLabel(this.applyTaskStatueOptions, row.applyTaskStatue);
    },
    close(val) {
      this.$refs.cascaderHandle.dropDownVisible = false; //监听值发生变化就关闭它
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.$refs.queryForm.resetFields();
      // this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.applyTaskId);
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    modalFormOk(){
      this.getList();
    },
    handleAdd() {
      this.$nextTick(()=>{
        this.$refs.modalForm.add();
      })
    },
    //查看详情
    handleInfo(row) {
      this.$nextTick(()=>{
        this.$refs.modalDetail.detail(row.applyTaskId);
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.$nextTick(()=>{
        this.$refs.modalForm.edit(row.applyTaskId);
      })
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
      queryParams.createBy = this.$store.getters.userInfo.username;
      queryParams.applyTaskIds = this.ids;
      this.$confirm({
        title: "提示",
        content: "是否导出选中数据?",
        onOk: function () {
          exportXls('/perf/taskApplyManager/exportXls', queryParams, "我申请的GS任务");
        }
      });
    },
    // 关闭时回调
    closed() {
      this.$refs.addOrEditMilestone.clear();
    },
    getStatusType(statue) {
      return this.StatusType[parseInt(statue)];
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

.mb20 .el-col > span {
  font-size: 14px;
}

.el-button + .el-button {
  margin-left: 0;
}
.el-form > .el-form-item {
  margin-bottom: 10px;
}

.el-form-item {
  margin-bottom: 10px;
}
</style>