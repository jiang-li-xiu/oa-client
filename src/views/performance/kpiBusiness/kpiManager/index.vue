<template>
  <div class="app-container">
    <div class="bg-border-color-10">
      <div class="flex-center">
        <img src="@/assets/images/look-over.png" alt="" class="list-img" />
        <p class="font-15 font-700 color-50 ml0">筛选查询</p>
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

        <el-form-item label="所属部门" prop="deptId" size="small">
          <treeselect
            v-model="queryParams.deptId"
            :options="queryDeptOptions"
            :show-count="true"
            style="width: 215px"
            placeholder="请选择所属部门"
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
        <el-form-item label="启动状态">
          <el-select
            v-model="startStatueValue"
            @change="queryChangeByIsStart"
            clearable
            size="small"
          >
            <el-option
              v-for="(item, index) in startStatueOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <!-- 考核类型 -->
        <el-form-item label="考核类型">
          <el-select
            v-model="queryChangeValue"
            @change="queryChangeByAssessmentType"
            clearable
            size="small"
          >
            <el-option
              v-for="(item, index) in queryChangeOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
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

    <el-row :gutter="10" class="mb20">
      <!-- <el-col :span="1.5">
        <el-radio-group
          v-model="queryParams.isStart"
          @change="queryChangeByIsStart"
          size="small"
        >
          <el-radio-button label="">全部</el-radio-button>
          <span v-for="(dict, index) in isStartOptions" :key="index">
            <el-radio-button
              v-if="dict.dictValue !== '0'"
              :label="dict.dictValue"
              >{{ dict.dictLabel }}</el-radio-button
            >
          </span>
        </el-radio-group>
      </el-col> -->

      <!-- <el-col :span="1.5">
        <el-radio-group
          v-model="queryParams.assessmentType"
          @change="queryChangeByAssessmentType"
          size="small"
        >
          <span v-for="(dict, index) in assessmentTypeOptions" :key="index">
            <el-radio-button :label="dict.dictValue">{{
              dict.dictLabel
            }}</el-radio-button>
          </span>
        </el-radio-group>
      </el-col> -->
    </el-row>
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
              icon="el-icon-video-play"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['business:assessmentConfigure:add']"
              >启动KPI
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="el-icon-remove"
              size="mini"
              :disabled="multiple"
              @click="handleKpiEnd"
              v-hasPermi="['business:kpiCheckConfig:edit']"
              >结束KPI
            </el-button>
          </el-col>
          <right-toolbar
            :showSearch.sync="showSearch"
            @queryTable="getList"
          ></right-toolbar>
        </el-row>
      </div>

      <el-table
        v-loading="loading"
        :data="list"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column
          label="考核编号"
          align="center"
          width="80"
          prop="assessmentConfigureId"
        />

        <el-table-column label="姓名" align="center" prop="nickName" />
        <el-table-column label="部门" align="center" prop="deptName" />
        <el-table-column label="岗位" align="center" prop="postName" />
        <el-table-column
          label="考核类型"
          align="center"
          prop="assessmentTypeLabel"
        />
        <el-table-column label="考核年" align="center" prop="assessmentYear" />
        <el-table-column label="考核月" align="center" prop="assessmentMonth" />
        <el-table-column label="kpi得分" align="center" prop="kpiScore">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.kpiScore">{{ scope.row.kpiScore }}</el-tag>
            <el-tag v-else type="info">暂无</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="启动状态" align="center" prop="isStart">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isStart === '1'" type="success">{{
              isStartFormat(scope.row)
            }}</el-tag>
            <el-tag v-else-if="scope.row.isStart === '2'" type="danger">{{
              isStartFormat(scope.row)
            }}</el-tag>
            <el-tag v-else type="info">数据异常</el-tag>
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
              icon="el-icon-info"
              @click="handleInfo(scope.row)"
              v-hasPermi="['business:assessmentConfigure:edit']"
              >查看
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-remove"
              @click="handleKpiEnd(scope.row)"
              v-hasPermi="['business:kpiCheckConfig:end']"
              >结束
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

    <!-- 添加或修改KPI考核项配置对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="85%"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item v-if="open" label="" prop="selectedUserList">
          <elt-transfer
            size="small"
            v-loading="eltLoading"
            :show-query="true"
            :show-pagination="true"
            v-model="form.selectedUserList"
            :pagination-call-back="paginationCallBack"
            :left-columns="leftColumns"
            :title-texts="['待选人员列表', '选中人员列表']"
            :button-texts="['', '']"
            :table-row-key="(row) => row.assessmentConfigureId"
          >
            <!-- 可以使用插槽获取到列信息和行信息，从而进行数据的处理 -->
            <template v-slot:leftCondition="{ scope }">
              <el-form-item>
                <el-input
                  style="width: 100px"
                  v-model="scope.nickName"
                  placeholder="姓名"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-input
                  style="width: 100px"
                  v-model="scope.deptName"
                  placeholder="部门"
                ></el-input>
              </el-form-item>

              <el-form-item>
                <el-input
                  style="width: 100px"
                  v-model="scope.assessmentTypeLabel"
                  placeholder="考核类型"
                ></el-input>
              </el-form-item>

              <el-form-item>
                <el-input
                  style="width: 100px"
                  v-model="scope.assessmentYear"
                  placeholder="年份"
                ></el-input>
              </el-form-item>

              <el-form-item>
                <el-input
                  style="width: 100px"
                  v-model="scope.assessmentMonth"
                  placeholder="月份"
                ></el-input>
              </el-form-item>
            </template>

            <template v-slot:rightCondition="{ scope }">
              <el-form-item>
                <el-input
                  style="width: 100px"
                  v-model="scope.nickName"
                  placeholder="姓名"
                ></el-input>
              </el-form-item>
              <!-- <el-form-item >
                <el-input
                  style="width: 100px"
                  v-model="scope.deptName"
                  placeholder="部门"
                ></el-input>
              </el-form-item> -->
            </template>
          </elt-transfer>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- KPI管理详情框 -->
    <el-drawer
      title="考核详情"
      :visible.sync="infoDialogOpen"
      direction="rtl"
      size="85%"
    >
      <div class="bg-border-color-10 mr10 ml0" v-if="infoDialogOpen">
        <div class="flex-center mb20">
          <div class="mark-logo"></div>
          <div class="ml15 font-700">人员信息</div>
        </div>
        <el-row :gutter="20">
          <el-col :span="6"> <b>姓名：</b>{{ details.nickName }} </el-col>
          <el-col :span="6"> <b>部门：</b>{{ details.deptName }} </el-col>
          <el-col :span="6"> <b>岗位：</b>{{ details.postName }} </el-col>
          <el-col :span="6">
            <b>KPI总权重(%)：</b>{{ details.kpiWeightCoefficient }}
          </el-col>
        </el-row>
      </div>

      <div class="bg-border-color-10 mr10 ml0">
        <div class="flex-center mb20">
          <div class="mark-logo"></div>
          <div class="ml15 font-700">考核项信息</div>
        </div>

        <el-table
          v-if="infoDialogOpen"
          v-loading="loading"
          :data="details.kpiCheckNapeVoList"
        >
          <el-table-column
            label="指标名称"
            align="center"
            prop="targetTitle"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="目标值" align="center" prop="targetValue" />
          <el-table-column
            label="指标说明"
            align="center"
            prop="targetExplain"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="考核项权重(%)"
            align="center"
            prop="weightCoefficient"
          />
          <el-table-column
            label="计分方法"
            align="center"
            prop="scoringMethod"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="初评人"
            align="center"
            prop="preliminaryReviewerLabel"
          />

          <el-table-column label="初评分" align="center" prop="firstScore" />
          <el-table-column
            label="初评评语"
            align="center"
            prop="firstComment"
          />

          <el-table-column
            label="终评人"
            align="center"
            prop="finalReviewerLabel"
          />

          <el-table-column label="终评分" align="center" prop="finalScore" />
          <el-table-column
            label="终评评语"
            align="center"
            prop="finalComment"
          />
        </el-table>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import {
  delAssessmentConfigure,
  exportAssessmentConfigure,
  getAssessmentConfigure,
  updateAssessmentConfigure,
} from "@/api/performance/assessmentConfigure";
import { listAssessmentOptions } from "@/api/performance/assessmentOption";
import {
  getKpiCheckConfigDetails,
  kpiCheckConfigByStart,
  kpiCheckConfigByEnd,
  listKpiCheckConfigByStartAndEnd,
  listKpiCheckConfigByUnStart,
} from "@/api/performance/kpiCheckConfig";
//加载部门树形下拉
import { treeselect } from "@/api/performance/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  name: "AssessmentConfigure",
  components: {
    Treeselect,
  },
  data() {
    const checkList = (rule, value, callback) => {
      console.log(value);
      if (value.length === 0) {
        return callback(new Error("请至少选中一个人员"));
      }
      callback();
    };
    return {
      //穿梭框左边框列
      leftColumns: [
        { label: "姓名", id: "nickName" },
        { label: "部门", id: "deptName" },
        { label: "岗位", id: "postName" },
        { label: "考核类型", id: "assessmentTypeLabel" },
        { label: "考核年份", id: "assessmentYear" },
        { label: "考核月份", id: "assessmentMonth", width: "100%" },
      ],
      details: null,
      //考核类型翻译
      assessmentTypeTransalte: undefined,
      //配置是否已启动字典翻译
      isStartOptions: [],
      //考核类型字典的翻译
      assessmentTypeOptions: [],
      // 启动状态字典
      startStatueValue: "",
      startStatueOptions: [
        {
          value: "",
          label: "全部状态",
        },
        {
          value: "1",
          label: "进行中",
        },
        {
          value: "2",
          label: "已结束",
        },
      ],

      // 考核类型
      queryChangeValue: "",
      queryChangeOptions: [
        {
          value: "",
          label: "全部类型",
        },
        {
          value: "1",
          label: "月度考核",
        },
        {
          value: "2",
          label: "季度考核",
        },
        {
          value: "3",
          label: "年度考核",
        },
      ],
      queryDeptOptions: undefined,
      //详情框
      infoDialogOpen: false,
      // 遮罩层
      loading: true,
      eltLoading: false,
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
      list: [],
      unStartTotal: 0,
      //KPI考核项表格数据
      assessmentOptionList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,

      // 部门树选项
      deptOptions: [],

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        assessmentConfigureId: null,
        kpiContractId: null,
        assessmentType: null,
        nickName: null,
        deptId: null,
        kpiScore: null,
        assessmentYear: null,
        assessmentMonth: null,
        isStart: "",
        createBy: null,
        createTime: null,
      },
      queryParamsByUnStart: {
        pageNum: 1,
        pageSize: 10,
        nickName: null,
        deptName: null,
        assessmentType: null,
        assessmentYear: null,
        assessmentMonth: null,
      },
      // 表单参数
      form: {
        selectedUserList: [],
      },
      // 表单校验
      rules: {
        // selectedUserList: { validator: checkList, trigger: 'blur' }
      },
    };
  },
  created() {
    this.getList();
    /*    listAssessmentOptions(this.queryParams).then(response => {
      this.assessmentOptionList = response.rows;
      this.total = response.total;
      this.loading = false;
    }); */

    this.getDicts("ASSESSMENT_CONFIGURATION_STATUS").then((response) => {
      this.isStartOptions = response.data;
    });
    this.getDicts("gs_assessment_type").then((response) => {
      this.assessmentTypeOptions = response.data;
    });

    this.getDeptTreeselectKpiDict();
  },
  methods: {
    /** 查询KPI考核项配置列表 */
    getList() {
      this.loading = true;
      listKpiCheckConfigByStartAndEnd(this.queryParams).then((response) => {
        this.list = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询部门下拉树结构 */
    getDeptTreeselectKpiDict() {
      treeselect().then((response) => {
        this.queryDeptOptions = response.data;
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
        selectedUserList: [],
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    // 是否启动状态改变
    queryChangeByIsStart(val) {
      console.log(val);
      if (val === "") {
        this.queryParams.isStart = null;
      }

      this.queryParams.isStart = val;
      this.handleQuery();
    },
    queryChangeByAssessmentType(val) {
      console.log(val);
      this.queryParams.assessmentType = val;
      this.handleQuery();
    },
    // queryKpiCheckConfigUnStartByAssessmentType(val) {
    //   this.queryParamsByUnStart.assessmentType = val;
    //   let queryObj={};
    //   queryObj.pageIndex = this.queryParamsByUnStart.pageNum;
    //   queryObj.pageSize = this.queryParamsByUnStart.pageSize;
    //   this.paginationCallBack(queryObj);
    // },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.isStart = "";
      this.queryParams.assessmentType = null;
      this.queryChangeValue = "";
      this.startStatueValue = "";

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
      this.title = "启动KPI";
    },

    //配置是否已启动
    isStartFormat(row, column) {
      return this.selectDictLabel(this.isStartOptions, row.isStart);
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
      // console.log(this.form.selectedUserList)
      this.form.selectedUserList = this.form.selectedUserList.map(
        (data) => data.assessmentConfigureId
      );
      // console.log(this.form.selectedUserList);
      if (this.form.selectedUserList.length === 0) {
        this.$message.error("请至少选择一个人员");
        return;
      }

      kpiCheckConfigByStart(this.form.selectedUserList).then((response) => {
        this.msgSuccessFun("启动成功", () => {
          this.open = false;
          this.getList();
        });
      });
    },
    /** 删除按钮操作 */
    // handleDelete(row) {
    //   const assessmentConfigureIds = row.assessmentConfigureId || this.ids;
    //   this.$confirm('是否确认删除KPI考核项配置编号为"' + assessmentConfigureIds + '"的数据项?', "警告", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning"
    //   }).then(function () {
    //     return delAssessmentConfigure(assessmentConfigureIds);
    //   }).then(() => {
    //     this.getList();
    //     this.msgSuccess("删除成功");
    //   })
    // },

    /** 结束kpi按钮操作 */
    handleKpiEnd(row) {
      const assessmentConfigureIds = row.assessmentConfigureId || this.ids;
      this.$confirm(
        '是否确认结束KPI考核配置编号为"' +
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
          return kpiCheckConfigByEnd(assessmentConfigureIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("结束KPI成功");
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

    //穿梭框设置分页
    paginationCallBack(obj) {
      //分页
      this.queryParamsByUnStart.pageNum = obj.pageIndex;
      this.queryParamsByUnStart.pageSize = obj.pageSize;
      //查询
      this.queryParamsByUnStart.nickName = obj.nickName;
      this.queryParamsByUnStart.deptName = obj.deptName;
      this.queryParamsByUnStart.assessmentTypeLabel = obj.assessmentTypeLabel;
      this.queryParamsByUnStart.assessmentYear = obj.assessmentYear;
      this.queryParamsByUnStart.assessmentMonth = obj.assessmentMonth;
      return new Promise((resolve, reject) => {
        try {
          this.eltLoading = true;
          listKpiCheckConfigByUnStart(this.queryParamsByUnStart).then(
            (response) => {
              //this.form.selectedUserList = response.rows;
              resolve({ total: response.total, data: response.rows });
              this.eltLoading = false;
            }
          );
        } catch {
          reject();
        }
      });
    },
    clearTransfer() {
      this.$refs.eltTransfer.clear();
    },
    //考核类型字典的翻译
    assessmentTypeFormat(row, column) {
      return this.selectDictLabel(
        this.assessmentTypeOptions,
        row.assessmentType
      );
    },
    //任务详情
    handleInfo(row) {
      this.title = "KPI考核管理详情";
      const configureId = row.assessmentConfigureId;
      getKpiCheckConfigDetails(configureId).then((response) => {
        this.details = response.data;
        this.infoDialogOpen = true;
      });
    },
    // handleQueryKpiCheckConfig(){
    //   let queryObj={};
    //   queryObj.pageIndex = this.queryParamsByUnStart.pageNum;
    //   queryObj.pageSize = this.queryParamsByUnStart.pageSize;
    //   this.paginationCallBack(queryObj);
    // },
    // resetQueryKpiCheckConfig(){
    //   let queryObj={};
    //   queryObj.pageIndex = this.queryParamsByUnStart.pageNum;
    //   queryObj.pageSize = this.queryParamsByUnStart.pageSize;
    //   this.queryParamsByUnStart = [];
    //   this.paginationCallBack(queryObj);
    // }
  },
};
</script>

<style lang="scss" scoped>
</style>
