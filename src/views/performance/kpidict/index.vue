<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="指标名称" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入指标名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="考核周期" prop="assessmentType">
        <el-select v-model="queryParams.assessmentType" placeholder="请选择考核周期" clearable size="small">
          <el-option
            v-for="dict in assessmentTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="所属部门" prop="deptId">
        <treeselect v-model="queryParams.deptId" :options="queryDeptOptions" :show-count="true" style="width:250px;" placeholder="请选择所属部门" />
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
          v-hasPermi="['business:kpidict:add']"
        >新增</el-button>
      </el-col>
      <!--      </el-col>-->
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          type="danger"-->
      <!--          plain-->
      <!--          icon="el-icon-delete"-->
      <!--          size="mini"-->
      <!--          :disabled="multiple"-->
      <!--          @click="handleDelete"-->
      <!--          v-hasPermi="['business:kpidict:remove']"-->
      <!--        >删除</el-button>-->
      <!--      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['business:kpidict:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="kpidictList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!--      <el-table-column label="kpi字典id" align="center" prop="kpidictId" />-->
      <el-table-column label="指标名称" align="center" prop="title" />
      <el-table-column label="目标值" align="center" prop="targetValue" />
      <el-table-column label="考核周期" align="center" prop="assessmentType" :formatter="assessmentTypeFormat" />
      <el-table-column label="权重（%）" align="center" prop="weightCoefficient"/>
      <el-table-column label="评分方法" align="center" prop="scoringMethod" />
      <el-table-column label="所属部门" align="center" prop="commonUserInfo.deptName" />
      <el-table-column label="初评人1" align="center" prop="commonUserInfo.preliminaryReviewerName" />
      <el-table-column label="初评人2" align="center" prop="commonUserInfo.preliminaryReviewerSecondName" />
      <el-table-column label="终评人" align="center" prop="commonUserInfo.finalReviewerName" />
      <el-table-column label="维护人" align="center" prop="commonUserInfo.createName" />
      <el-table-column label="添加时间" align="center" prop="createTime" width="180">
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['business:kpidict:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['business:kpidict:remove']"
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

    <!-- 添加或修改kpi字典对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="指标名称" prop="title">
          <el-input v-model="form.title" placeholder="请输入指标名称" />
        </el-form-item>

        <el-form-item label="考核周期" prop="assessmentType">
          <el-select v-model="form.assessmentType" placeholder="请选择考核周期">
            <el-option
              v-for="dict in assessmentTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权重（%）" prop="weightCoefficient">
          <el-input v-model="form.weightCoefficient" placeholder="请输入权重（%）" />
        </el-form-item>
        <el-form-item label="评分方法" prop="scoringMethod">
          <el-input v-model="form.scoringMethod" placeholder="请输入评分方法" />
        </el-form-item>

        <el-form-item label="所属部门" prop="deptId">
          <treeselect v-model="form.deptId" :options="deptOptions" :show-count="true" placeholder="请选择所属部门" />
        </el-form-item>
        <el-form-item label="初评人1" prop="preliminaryReviewer">
          <el-cascader
            ref="prCascader"
            v-model="form.preliminaryReviewer"
            :options="preliminaryReviewers"
            clearable
            :show-all-levels="true"
            :filterable="true"
            placeholder="请选择初评人1"
            style="width: 580px;"
            @change="prChange"
          >
          </el-cascader>
        </el-form-item>

        <el-form-item label="初评人2" prop="preliminaryReviewerSecond">
          <el-cascader
            ref="prCascader2"
            v-model="form.preliminaryReviewerSecond"
            :options="preliminaryReviewersSecond"
            clearable
            :show-all-levels="true"
            :filterable="true"
            placeholder="请选择初评人2"
            style="width: 580px;"
            @change="pr2Change"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="终评人" prop="finalReviewer">

          <el-cascader
            ref="frCascader"
            v-model="form.finalReviewer"
            :options="finalReviewers"
            clearable
            :show-all-levels="true"
            :filterable="true"
            placeholder="请选择终评人"
            style="width: 580px;"
            @change="frChange"></el-cascader>
        </el-form-item>

        <el-form-item label="目标值" prop="targetValue">
          <el-input  v-model="form.targetValue" type="textarea" :autosize="{ minRows: 3, maxRows: 5}" placeholder="请输入目标值" />
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
  import { listKpidict, getKpidict, delKpidict, addKpidict, updateKpidict, exportKpidict, logicDelKpidict } from "@/api/performance/kpidict";
  import { treeselect,deptUserCascaderSelect } from "@/api/performance/system/dept";
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";

  export default {
    name: "Kpidict",
    components: {
      Treeselect
    },
    data() {
      return {
        //初评人1
        preliminaryReviewers: undefined,
        //初评人2
        preliminaryReviewersSecond: undefined,
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
        // 总条数
        total: 0,
        // kpi字典表格数据
        kpidictList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 部门树选项
        deptOptions: undefined,
        // 查询部门树选项
        queryDeptOptions: undefined,
        // 考核类型字典
        assessmentTypeOptions: [],
        // 创建时间时间范围
        daterangeCreateTime: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          title: null,
          targetValue: null,
          assessmentType: null,
          scoringMethod:null,
          weightCoefficient: null,
          deptId: null,
          preliminaryReviewer: null,
          preliminaryReviewerSecond: null,
          finalReviewer: null,
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
          title: [
            { required: true, message: "标题不能为空", trigger: "blur" }
          ],
          targetValue: [
            { required: true, message: "目标值不能为空", trigger: "blur" }
          ],
          deptId: [
            { required: true, message: "所属部门不能为空", trigger: "change" }
          ],
          assessmentType: [
            { required: true, message: "考核类型不能为空", trigger: "change" }
          ],
          scoringMethod: [
            { required: true, message: "评分方法不能为空", trigger: "change" }
          ],
          weightCoefficient: [
            { required: true, message: "权重系数不能为空", trigger: "change" }
          ],
          preliminaryReviewer: [
            { required: true, message: "初评人1不能为空", trigger: "change" }
          ],
          preliminaryReviewerSecond: [
            { required: true, message: "初评人2不能为空", trigger: "change" }
          ],
          finalReviewer: [
            { required: true, message: "终评人不能为空", trigger: "change" }
          ],
        }
      };
    },
    created() {
      this.getList();
      this.getDeptTreeselect();
      this.getDicts("gs_assessment_type").then(response => {
        this.assessmentTypeOptions = response.data;
      });
    },
    methods: {

      /** 查询kpi字典列表 */
      getList() {
        this.loading = true;

        this.queryParams.params = {};
        //创建开始结束时间区间查询
        if (null != this.daterangeCreateTime && '' != this.daterangeCreateTime) {
          this.queryParams.params["beginCreateTime"] = this.daterangeCreateTime[0];
          this.queryParams.params["endCreateTime"] = this.daterangeCreateTime[1];
        }

        listKpidict(this.queryParams).then(response => {
          this.kpidictList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },

      /** 查询部门下拉树结构 */
      getDeptTreeselect() {
        treeselect().then(response => {
          this.deptOptions = response.data;
          this.queryDeptOptions = response.data;
        });
      },
      /** 查询部门用户级联结构 */
      getDeptUserCascaderSelect() {
        deptUserCascaderSelect().then(response => {
          // console.log(response.data);
          this.preliminaryReviewers = response.data;
          this.finalReviewers = response.data;
          this.preliminaryReviewersSecond = response.data;
        });
      },
      //当选中节点变化时触发
      prChange(val){
        //获取选中的节点并赋值
        let checkObj = this.$refs['prCascader'].getCheckedNodes();
        console.log(checkObj[0]);
        // if(!checkObj[0].data.userIs){//筛选出只属于用户的数据
        //   checkObj[0].checked = false;
        //   return;
        // }
        this.form.preliminaryReviewer = checkObj[0].value;
      },
      //当选中节点变化时触发
      pr2Change(val){
        //获取选中的节点并赋值
        let checkObj = this.$refs['prCascader2'].getCheckedNodes();
        this.form.preliminaryReviewerSecond = checkObj[0].value;
      },
      //当选中节点变化时触发
      frChange(val){
        let checkObj = this.$refs['frCascader'].getCheckedNodes();
        this.form.finalReviewer = checkObj[0].value;
      },
      // 考核类型字典翻译
      assessmentTypeFormat(row, column) {
        return this.selectDictLabel(this.assessmentTypeOptions, row.assessmentType);
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          kpidictId: null,
          title: null,
          targetValue: null,
          assessmentType: null,
          scoringMethod: null,
          weightCoefficient: null,
          deptId: null,
          preliminaryReviewer: null,
          preliminaryReviewerSecond: null,
          finalReviewer: null,
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
        this.daterangeCreateTime = [];
        this.resetForm("queryForm");
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.kpidictId)
        this.single = selection.length!==1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.getDeptTreeselect();
        this.getDeptUserCascaderSelect();
        this.open = true;
        this.title = "添加kpi字典";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        this.getDeptTreeselect();
        this.getDeptUserCascaderSelect();
        const kpidictId = row.kpidictId || this.ids
        getKpidict(kpidictId).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改kpi字典";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.kpidictId != null) {
              updateKpidict(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addKpidict(this.form).then(response => {
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
        const kpidictIds = row.kpidictId;
        // || this.ids;
        this.$confirm('是否确认删除kpi字典编号为"' + kpidictIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          // return delKpidict(kpidictIds);
          return logicDelKpidict(kpidictIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有kpi字典数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportKpidict(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
      }
    }
  };
</script>
