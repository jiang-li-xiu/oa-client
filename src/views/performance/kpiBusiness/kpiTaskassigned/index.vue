<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">

      <el-form-item label="姓名" prop="kpiUserName">
        <el-input
          v-model="queryParams.kpiUserName"
          placeholder="请输入姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

<!--      <el-form-item label="考核周期" prop="assessmentType">-->
<!--        <el-select v-model="queryParams.assessmentType" placeholder="请选择考核周期" clearable size="small">-->
<!--          <el-option-->
<!--            v-for="dict in assessmentTypeOptions"-->
<!--            :key="dict.dictValue"-->
<!--            :label="dict.dictLabel"-->
<!--            :value="dict.dictValue"-->
<!--          />-->
<!--        </el-select>-->
<!--      </el-form-item>-->

      <el-form-item label="所属部门" prop="deptId">
        <treeselect v-model="queryParams.deptId" :options="queryDeptOptions" :show-count="true" style="width:250px;" placeholder="请选择所属部门" />
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
          v-hasPermi="['business:kpiTaskassigned:add']"
        >新增</el-button>
      </el-col>
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="success"-->
<!--          plain-->
<!--          icon="el-icon-edit"-->
<!--          size="mini"-->
<!--          :disabled="single"-->
<!--          @click="handleUpdate"-->
<!--          v-hasPermi="['business:kpiTaskassigned:edit']"-->
<!--        >修改</el-button>-->
<!--      </el-col>-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="danger"-->
<!--          plain-->
<!--          icon="el-icon-delete"-->
<!--          size="mini"-->
<!--          :disabled="multiple"-->
<!--          @click="handleDelete"-->
<!--          v-hasPermi="['business:kpiTaskassigned:remove']"-->
<!--        >删除</el-button>-->
<!--      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['business:kpiTaskassigned:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="kpiTaskassignedList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="kpi任务下达id" align="center" prop="kpiTaskassignedId" />
      <el-table-column label="姓名" align="center" prop="kpiUserName" />
<!--      <el-table-column label="kpi字典id" align="center" prop="kpidictId" />-->
      <el-table-column label="指标名称" align="center" prop="kpiDict.title" />
      <el-table-column label="目标值" align="center" prop="kpiDict.targetValue" />
      <el-table-column label="考核周期" align="center" prop="kpiDict.assessmentType" :formatter="assessmentTypeFormat" />
      <el-table-column label="权重（%）" align="center" prop="kpiDict.weightCoefficient"/>
      <el-table-column label="评分方法" align="center" prop="kpiDict.scoringMethod" />
      <el-table-column label="所属部门" align="center" prop="commonUserInfo.deptName" />
      <el-table-column label="初评人1" align="center" prop="commonUserInfo.preliminaryReviewerName" />
      <el-table-column label="初评人2" align="center" prop="commonUserInfo.preliminaryReviewerSecondName" />
      <el-table-column label="终评人" align="center" prop="commonUserInfo.finalReviewerName" />
      <el-table-column label="创建人" align="center" prop="commonUserInfo.createName" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
      </el-table-column>
<!--      <el-table-column label="更新人" align="center" prop="updateBy" />-->
<!--      <el-table-column label="更新时间" align="center" prop="updateTime" width="180">-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d}') }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['business:kpiTaskassigned:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['business:kpiTaskassigned:remove']"
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

    <!-- 添加或修改kpi任务下达对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="80%" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
<!--        <el-form-item label="kpi考核用户账号" prop="kpiUserName">-->
<!--          <el-input v-model="form.kpiUserName" placeholder="请输入kpi考核用户账号" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="kpi字典id" prop="kpidictId">-->
<!--          <el-input v-model="form.kpidictId" placeholder="请输入kpi字典id" />-->
<!--        </el-form-item>-->

        <el-form-item label="考核人" prop="kpiUserNameArray">
          <el-cascader
            ref="prCascader"
            :props="{ multiple: true,emitPath:false}"
            v-model="form.kpiUserNameArray"
            :options="kpiUserNames"
            :show-all-levels="true"
            :filterable="true"
            placeholder="请选择考核人（单选/多选）"
            style="width: 580px;"
            @change="prChange"
          >
          </el-cascader>
        </el-form-item>

        <el-form-item label="有效考核人信息">
          <el-input
            placeholder="有效考核人信息"
            v-model="checkedUserContractDetails"
            :disabled="true" type="textarea" :autosize="{ minRows: 3, maxRows: 5}" >
          </el-input>
        </el-form-item>

        <el-form-item label="考核项" prop="kpidictIds">

          <el-form :model="queryKpiDictParams" ref="queryKpiDictForm" :inline="true" v-show="showSearch" label-width="68px">
<!--            <el-form-item label="考核周期" prop="assessmentType">-->
<!--              <el-select v-model="queryKpiDictParams.assessmentType" placeholder="请选择考核周期" clearable size="small">-->
<!--                <el-option-->
<!--                  v-for="dict in assessmentTypeOptions"-->
<!--                  :key="dict.dictValue"-->
<!--                  :label="dict.dictLabel"-->
<!--                  :value="dict.dictValue"-->
<!--                />-->
<!--              </el-select>-->
<!--            </el-form-item>-->

<!--            <el-form-item label="所属部门" prop="deptId">-->
<!--              <treeselect v-model="queryKpiDictParams.deptId" :options="queryDeptOptions" :show-count="true" style="width:250px;" placeholder="请选择所属部门" />-->
<!--            </el-form-item>-->

<!--            <el-form-item>-->
<!--              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQueryKpiDict">搜索</el-button>-->
<!--              <el-button icon="el-icon-refresh" size="mini" @click="resetQueryKpiDict">重置</el-button>-->
<!--            </el-form-item>-->

            <el-row :gutter="10" class="mb8">
              <el-col :span="1.5">
                <el-button
                  type="primary"
                  plain
                  icon="el-icon-plus"
                  size="mini"
                  @click="handleAddKpiDict"
                  v-hasPermi="['business:kpidict:add']"
                >新增</el-button>
              </el-col>
<!--              <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>-->
            </el-row>
          </el-form>

          <el-table v-loading="loading" :data="kpidictList" @selection-change="handleSelectionChangeKpidict">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="指标名称" align="center" prop="title" />
            <el-table-column label="目标值" align="center" prop="targetValue" />
<!--            <el-table-column label="考核周期" align="center" prop="assessmentType" :formatter="assessmentTypeFormat_m2" />-->
            <el-table-column label="权重（%）" align="center" prop="weightCoefficient"/>
            <el-table-column label="评分方法" align="center" prop="scoringMethod" />
            <el-table-column label="所属部门" align="center" prop="commonUserInfo.deptName" />
            <el-table-column label="初评人" align="center" prop="commonUserInfo.preliminaryReviewerName" />
<!--            <el-table-column label="初评人2" align="center" prop="commonUserInfo.preliminaryReviewerSecondName" />-->
            <el-table-column label="终评人" align="center" prop="commonUserInfo.finalReviewerName" />
            <el-table-column label="创建人" align="center" prop="commonUserInfo.createName" />
            <el-table-column label="创建时间" align="center" prop="createTime" width="180">
            </el-table-column>
          </el-table>

          <pagination
            v-show="kpiDictTotal>0"
            :total="kpiDictTotal"
            :page.sync="queryKpiDictParams.pageNum"
            :limit.sync="queryKpiDictParams.pageSize"
            @pagination="getKpiDictList"
          />
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
import { listKpiTaskassigned, getKpiTaskassigned, delKpiTaskassigned, addKpiTaskassigned, updateKpiTaskassigned, exportKpiTaskassigned, logicDelKpiTaskassigned} from "@/api/performance/kpiTaskassigned";
import { treeselect,deptUserCascaderSelect } from "@/api/performance/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { listKpidict, getKpidict, delKpidict, addKpidict, updateKpidict, exportKpidict, logicDelKpidict } from "@/api/performance/kpidict";
import { getKpiContractByUserName } from "@/api/performance/kpiContract";

export default {
  name: "KpiTaskassigned",
  components: {
    Treeselect
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      //考核人数组
      kpiUserNameArray:[],

      //已选考核人绩效合约详情等
      checkedUserContractDetails: null,


      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // kpi任务下达表格数据
      kpiTaskassignedList: [],

      // 总条数
      kpiDictTotal: 0,
      //kpi字典列表
      kpidictList: [],

      // 考核类型字典
      assessmentTypeOptions: [],

      // 查询部门树选项
      queryDeptOptions: undefined,

      // kpi字典列表选中数组
      kpidictIds: [],

      //部门用户级联
      kpiUserNames: undefined,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        kpiUserName: null,
        assessmentType: null,
        deptId: null,
      },

      // 查询参数
      queryKpiDictParams: {
        pageNum: 1,
        pageSize: 100,
        assessmentType: null,
        deptId: null,
      },
      // 表单参数
      form: {
        kpiUserNameArray:[],
        kpidictIds:[]
      },
      // 表单校验
      rules: {
        kpiUserNameArray: [
          { required: true, message: "考核人至少选择一个", trigger: "blur" }
        ],
        // kpidictIds: [
        //   { required: true, message: "考核项至少勾选一个", trigger: "blur" }
        // ],

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
    /** 查询kpi任务下达列表 */
    getList() {
      this.loading = true;

      this.queryParams.params = {};
      if(this.queryParams.deptId){
        this.queryParams.params["deptId"] = this.queryParams.deptId;
      }
      if(this.queryParams.assessmentType){
        this.queryParams.params["assessmentType"] = this.queryParams.assessmentType;
      }
      listKpiTaskassigned(this.queryParams).then(response => {
        this.kpiTaskassignedList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询部门下拉树结构 */
    getDeptTreeselect() {
      treeselect().then(response => {

        this.queryDeptOptions = response.data;
      });
    },
    /** 查询部门用户级联结构 */
    getDeptUserCascaderSelect() {
      deptUserCascaderSelect().then(response => {
        // console.log(response.data);
        this.kpiUserNames = response.data;
      });
    },
    //当选中节点变化时触发
    prChange(val){
      let userContractDetails = "";
      //重置已选的考核人
      this.kpiUserNameArray = [];
      //获取选中的节点并赋值
      let checkObj = this.$refs['prCascader'].getCheckedNodes();
      checkObj.forEach((row, index) => {
        console.log(row)
        if(row.data.userIs){//筛选出只属于用户的数据

          //根据用户账号获取所配置的绩效合约信息，若为配置则取消勾选，并进行提示
          getKpiContractByUserName(row.data.value).then(response => {
            console.log(response.data)
            let resultData = response.data;
            if(undefined != resultData){
              this.kpiUserNameArray.push(row.value);
              userContractDetails += "姓名："+row.data.label +";kpi权重："+resultData.kpiweightCoefficient+"%"+"|";
              this.checkedUserContractDetails = userContractDetails;
            }else{
              //提示
              this.$message({
                type: 'warning',
                showClose: true,
                message: '不允许勾选未配置绩效合约的用户：'+ row.data.label
              });
            }
          });
        }
      });
      // console.log("数组");
      // console.log(this.kpiUserNameArray)
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        kpiTaskassignedId: null,
        kpiUserName: null,

        kpidictId: null,
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
      this.ids = selection.map(item => item.kpiTaskassignedId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.getDeptUserCascaderSelect();
      this.getKpiDictList();
      this.open = true;
      this.title = "添加-任务考核配置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getDeptUserCascaderSelect();
      this.getKpiDictList();
      const kpiTaskassignedId = row.kpiTaskassignedId || this.ids
      getKpiTaskassigned(kpiTaskassignedId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改-任务考核配置";
      });
    },
    /** 提交按钮 */
    submitForm() {
      console.log("提交数组")
      console.log(this.form.kpiUserNameArray);
      if(this.kpidictIds.length === 0){
        this.msgError("考核项至少勾选一个");
        return;
      }
      console.log(this.form)
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.kpiTaskassignedId != null) {
            updateKpiTaskassigned(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addKpiTaskassigned(this.form).then(response => {
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
      const kpiTaskassignedIds = row.kpiTaskassignedId || this.ids;
      this.$confirm('是否确认删除kpi任务下达编号为"' + kpiTaskassignedIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {

          // return delKpiTaskassigned(kpiTaskassignedIds);
          return logicDelKpiTaskassigned(kpiTaskassignedIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有kpi任务下达数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportKpiTaskassigned(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    },
    /** 查询kpi字典列表 */
    getKpiDictList() {
      listKpidict(this.queryKpiDictParams).then(response => {
        this.kpidictList = response.rows;
        this.kpiDictTotal = response.total;
      });
    },
    // 考核类型字典翻译
    assessmentTypeFormat(row, column) {
        return this.selectDictLabel(this.assessmentTypeOptions, row.kpiDict.assessmentType);
    },
    assessmentTypeFormat_m2(row, column) {
        return this.selectDictLabel(this.assessmentTypeOptions, row.assessmentType);
    },
    /** 搜索按钮操作 */
    handleQueryKpiDict() {
      this.queryKpiDictParams.pageNum = 1;
      this.getKpiDictList();
    },
    /** 重置按钮操作 */
    resetQueryKpiDict() {
      this.resetForm("queryKpiDictForm");
      this.handleQueryKpiDict();
    },
    // 多选框选中数据
    handleSelectionChangeKpidict(selection) {
      this.form.kpidictIds  = selection.map(item => item.kpidictId)
      this.kpidictIds = selection.map(item => item.kpidictId)
      // this.single = selection.length!==1
      // this.multiple = !selection.length
    },
  }
};
</script>
