<template>
  <div class="app-container">
    <div class="bg-border-color-10">
      <div class="flex-center">
        <img src="@/assets/images/look-over.png" alt="" class="list-img" />
        <p class="font-15 font-700 color-50">筛选查询</p>
      </div>
      <el-form
        class="flex-align-between flex-wrap mt20 m10"
        :model="queryParams"
        ref="queryForm"
        :inline="true"
        v-show="showSearch"
        label-width="70px"
      >
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
        <el-form-item label="部门" prop="deptName">
          <tree-select
            v-model="queryParams.deptName"
            :options="deptOptions"
            :show-count="true"
            style="width: 250px"
            placeholder="请选择部门"
          />
        </el-form-item>
        <el-form-item label="姓名" prop="nickName">
          <el-input
            v-model="queryParams.nickName"
            placeholder="请输入姓名"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="考核类型" prop="assessmentType">
          <el-select
            v-model="queryParams.assessmentType"
            placeholder="请选择考核类型"
            clearable
            size="small"
          >
            <el-option
              v-for="dict in assessmentTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
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
      <div class="flex-align-center mb10">
        <img src="@/assets/images/list.png" alt="" class="list-img mr10" />
        <p class="color-50 font-15 font-700">数据列表</p>
      </div>
      <el-table
        v-loading="loading"
        :data="assessmentConfigureList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column
          label="编号"
          align="center"
          prop="assessmentConfigureId"
        />
        <el-table-column label="考核年" align="center" prop="assessmentYear" />
        <el-table-column label="考核月" align="center" prop="assessmentMonth" />
        <el-table-column label="部门" align="center" prop="dept">
          <template slot-scope="scope">
            {{ scope.row.dept != null ? scope.row.dept : "无" }}
          </template>
        </el-table-column>
        <el-table-column label="姓名" align="center" prop="nickName" />
        <el-table-column label="岗位" align="center" prop="postList">
          <template slot-scope="scope">
            {{
              scope.row.postList
                .map((item) => (item != null ? item.postName : "无岗位"))
                .join(" 、 ")
            }}
          </template>
        </el-table-column>
        <el-table-column
          label="考核类型"
          align="center"
          prop="assessmentTypeLabel"
          :formatter="assessmentTypeFormat"
        />
        <!-- <el-table-column label="kpi得分" align="center" prop="kpiScore">
        <template slot-scope="scope">
            <p v-if="scope.row.kpiScore == null || scope.row.kpiScore === ''">
              ——
            </p>
            <p v-else>
             {{scope.row.kpiScore}}
            </p>
          </template>
      </el-table-column> -->
        <!-- <el-table-column
        label="考核状态"
        align="center"
        prop="assessmentStatus"
      >
        <template slot-scope="scope">
          <el-tag :type="getAssessmentStatusLabel(scope.row).type">
            {{getAssessmentStatusLabel(scope.row).label}}
          </el-tag>
        </template>
      </el-table-column> -->
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <router-link
              :to="
                '/assessment/final/record/data/' +
                scope.row.assessmentConfigureId
              "
              class="link-type"
            >
              <span>查看</span>
            </router-link>
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

    <!-- 添加或修改KPI考核项配置对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="500px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="合约配置id" prop="kpiContractId">
          <el-input
            v-model="form.kpiContractId"
            placeholder="请输入合约配置id"
          />
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
          <el-date-picker
            clearable
            size="small"
            v-model="form.deleteTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择删除时间"
          >
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
import {
  listAssessmentConfigure,
  listAssessmentConfigureFinalRecord,
  listAssessmentConfigureFinal,
  getAssessmentConfigure,
  delAssessmentConfigure,
  addAssessmentConfigure,
  updateAssessmentConfigure,
  exportAssessmentConfigure,
} from "@/api/performance/assessmentConfigure";
import { treeselect } from "@/api/performance/system/dept";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import TreeSelect from "@riophae/vue-treeselect";
export default {
  name: "AssessmentConfigure",
  components: {
    TreeSelect,
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      //考核状态颜色
      typeStatue: ["info", "success"],
      //考核类型
      assessmentTypeOptions: [],
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      //考核配置状态字典
      assessmentStatusOptions: [],
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
        assessmentStatus: null,
        nickName: null,
        deptName: null,
        isStart: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        deleteBy: null,
        deleteTime: null,
        deleteStatus: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        kpiContractId: [
          { required: true, message: "合约配置id不能为空", trigger: "blur" },
        ],
        assessmentType: [
          { required: true, message: "考核类型不能为空", trigger: "change" },
        ],
        isStart: [
          {
            required: true,
            message: "配置是否已启动不能为空",
            trigger: "blur",
          },
        ],
        createBy: [
          { required: true, message: "创建人不能为空", trigger: "blur" },
        ],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询KPI考核项配置列表 */
    getList() {
      this.loading = true;
      listAssessmentConfigureFinalRecord(this.queryParams).then((response) => {
        this.assessmentConfigureList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      this.getDicts("gs_assessment_type").then((response) => {
        this.assessmentTypeOptions = response.data;
      });
      this.getDicts("KPI_ASSESSMENT_OPTION_STATUS").then((response) => {
        this.assessmentStatusOptions = response.data;
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
        deleteStatus: 0,
      };
      this.resetForm("form");
    },
    // 考核类型字典翻译
    assessmentTypeFormat(row, column) {
      return this.selectDictLabel(
        this.assessmentTypeOptions,
        row.assessmentType
      );
    },
    // 考核配置字典翻译
    assessmentStatusFormat(row, column) {
      return this.selectDictLabel(
        this.assessmentStatusOptions,
        row.assessmentStatus
      );
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
      this.ids = selection.map((item) => item.assessmentConfigureId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
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
      const assessmentConfigureId = row.assessmentConfigureId || this.ids;
      getAssessmentConfigure(assessmentConfigureId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改KPI考核项配置";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.assessmentConfigureId != null) {
            updateAssessmentConfigure(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addAssessmentConfigure(this.form).then((response) => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
      this.$store.getters.userInfo.username;
    },

    //获取状态
    getAssessmentStatusLabel(row) {
      let userName = this.$store.getters.userInfo.username;
      // console.log(userName);
      for (var value of row.kpiCheckNapeVoList) {
        if (userName === value.finalReviewer && value.assessmentStatus != "1") {
          console.log(value.assessmentStatusLabel);
          return {
            label: value.assessmentStatusLabel,
            type:
              value.assessmentStatus == "2"
                ? this.typeStatue[1]
                : this.typeStatue[0],
          };
        }
      }
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const assessmentConfigureIds = row.assessmentConfigureId || this.ids;
      this.$confirm(
        '是否确认删除KPI考核项配置编号为"' +
          assessmentConfigureIds +
          '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delAssessmentConfigure(assessmentConfigureIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有KPI考核项配置数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportAssessmentConfigure(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        });
    },
  },
};
</script>

<style scoped>
.el-button + .el-button {
  margin: 0;
}
</style>
