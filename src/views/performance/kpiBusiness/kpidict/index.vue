<template>
  <div class="app-container">
    <div class="bg-border-color-10">
      <div class="flex-center">
        <img src="@/assets/images/look-over.png" alt="" class="list-img" />
        <p class="font-15 font-700 color-50 ml0">筛选查询</p>
      </div>
      <div class="flex-cc width-100">
        <el-form
          class="flex-align-between flex-wrap mt20 m10 width-90"
          :model="queryParams"
          ref="queryForm"
          :inline="true"
          v-show="showSearch"
          label-width="70px"
        >
          <el-form-item label="指标名称" prop="targetTitle">
            <el-input
              v-model="queryParams.targetTitle"
              placeholder="请输入标题"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>

          <el-form-item label="所属部门" prop="deptId" size="small">
            <tree-select
              v-model="queryParams.deptId"
              :options="deptOptions"
              :show-count="true"
              style="width: 250px"
              placeholder="请选择所属部门"
            />
          </el-form-item>

          <el-form-item label="创建时间">
            <el-date-picker
              v-model="daterangeCreateTime"
              size="small"
              style="width: 340px"
              type="datetimerange"
              range-separator="-"
              value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              :default-time="['00:00:00', '23:59:59']"
            ></el-date-picker>
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
    <div class="bg-border-color-10">
      <div class="flex-align-between">
        <div class="flex-align-center">
          <img
            class="list-img ml0 mr10"
            src="@/assets/images/list.png"
            alt=""
          />
          <p class="color-50 font-15 font-700">数据列表</p>
        </div>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="addOrUpdateHandle(0)"
              v-hasPermi="['business:kpidict:add']"
              >新增
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['business:kpidict:remove']"
              >删除
            </el-button>
          </el-col>
          <!--      <el-col :span="1.5">-->
          <!--        <el-button-->
          <!--          type="warning"-->
          <!--          plain-->
          <!--          icon="el-icon-download"-->
          <!--          size="mini"-->
          <!--          @click="handleExport"-->
          <!--          v-hasPermi="['business:kpidict:export']"-->
          <!--        >导出-->
          <!--        </el-button>-->
          <!--      </el-col>-->
          <right-toolbar
            :showSearch.sync="showSearch"
            @queryTable="getList"
          ></right-toolbar>
        </el-row>
      </div>
      <el-table
        v-loading="loading"
        :data="kpidictList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column
          label="字典编号"
          align="center"
          width="80"
          prop="kpidictId"
        />
        <el-table-column
          label="指标名称"
          align="center"
          min-width="200%"
          :show-overflow-tooltip="true"
          prop="targetTitle"
        />
        <el-table-column
          label="目标值"
          align="center"
          min-width="200%"
          :show-overflow-tooltip="true"
          prop="targetValue"
        />
        <el-table-column
          label="考核周期"
          align="center"
          prop="assessmentType"
          min-width="90%"
          :formatter="assessmentTypeFormat"
        />
        <el-table-column
          label="权重（%）"
          align="center"
          min-width="90%"
          prop="weightCoefficient"
        />
        <el-table-column
          label="评分方法"
          align="center"
          min-width="250%"
          :show-overflow-tooltip="true"
          prop="scoringMethod"
        />
        <el-table-column
          label="所属部门"
          align="center"
          min-width="125%"
          :show-overflow-tooltip="true"
          prop="commonUserInfo.deptName"
        />
        <el-table-column
          label="初评人"
          align="center"
          min-width="100%"
          prop="commonUserInfo.preliminaryReviewerName"
        />
        <el-table-column
          label="终评人"
          align="center"
          min-width="100%"
          prop="commonUserInfo.finalReviewerName"
        />
        <el-table-column
          label="创建人"
          align="center"
          min-width="100%"
          prop="commonUserInfo.createName"
        />
        <el-table-column
          label="创建时间"
          align="center"
          min-width="175%"
          :show-overflow-tooltip="true"
          prop="createTime"
        />
        <el-table-column
          label="操作"
          align="center"
          min-width="100%"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="addOrUpdateHandle(scope.row)"
              v-hasPermi="['business:kpidict:edit']"
              >修改
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['business:kpidict:remove']"
              >删除
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

    <!-- 添加或修改kpi字典对话框 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshDataList="getList"
    />
  </div>
</template>

<script>
import { listKpidict, delKpidict, exportKpidict } from "@/api/performance/kpidict";
import { treeselect } from "@/api/performance/system/dept";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import TreeSelect from "@riophae/vue-treeselect";
import addOrUpdate from "./components/addOrUpdate";

export default {
  name: "Kpidict",
  components: {
    addOrUpdate,
    TreeSelect,
  },
  data() {
    return {
      //初评人
      preliminaryReviewers: undefined,
      //终评人
      finalReviewers: undefined,
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
      addOrUpdateVisible: false,
      // 总条数
      total: 0,
      // kpi字典表格数据
      kpidictList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 部门树选项
      deptOptions: [],
      // 考核类型字典
      assessmentTypeOptions: [],
      // 创建时间时间范围
      daterangeCreateTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        targetTitle: null,
        targetValue: null,
        assessmentType: null,
        weightCoefficient: null,
        deptId: null,
        preliminaryReviewer: null,
        finalReviewer: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        deleteBy: null,
        deleteTime: null,
        deleteStatus: null,
        preliminaryReviewers: null,
        finalReviewers: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
        targetValue: [
          { required: true, message: "目标值不能为空", trigger: "blur" },
        ],
        deptId: [
          { required: true, message: "所属部门不能为空", trigger: "change" },
        ],
        assessmentType: [
          { required: true, message: "考核类型不能为空", trigger: "change" },
        ],
        weightCoefficient: [
          { required: true, message: "权重系数不能为空", trigger: "change" },
        ],
        preliminaryReviewer: [
          { required: true, message: "初评人不能为空", trigger: "change" },
        ],
        finalReviewer: [
          { required: true, message: "终评人不能为空", trigger: "change" },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getDeptTreeSelect();
    this.getDicts("gs_assessment_type").then((response) => {
      this.assessmentTypeOptions = response.data;
    });
  },
  methods: {
    /** 查询kpi字典列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      //创建开始结束时间区间查询
      if (
        null != this.daterangeCreateTime &&
        "" !== this.daterangeCreateTime &&
        undefined !== this.daterangeCreateTime
      ) {
        this.queryParams.params[
          "beginCreateTime"
        ] = this.daterangeCreateTime[0];
        this.queryParams.params["endCreateTime"] = this.daterangeCreateTime[1];
      }

      listKpidict(this.queryParams).then((response) => {
        this.kpidictList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询部门下拉树结构 */
    getDeptTreeSelect() {
      treeselect().then((response) => {
        this.deptOptions = response.data;
      });
    },
    // 考核类型字典翻译
    assessmentTypeFormat(row, column) {
      return this.selectDictLabel(
        this.assessmentTypeOptions,
        row.assessmentType
      );
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.daterangeCreateTime = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.kpidictId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    // 新增 / 修改
    addOrUpdateHandle(row) {
      let kpidictId = undefined;
      if (row !== 0) {
        kpidictId = row.kpidictId || this.ids;
      }
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(kpidictId);
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const kpidictIds = row.kpidictId || this.ids;
      this.$confirm(
        '是否确认删除kpi字典编号为"' + kpidictIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delKpidict(kpidictIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有kpi字典数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportKpidict(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
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
  margin-bottom: 0;
}
</style>