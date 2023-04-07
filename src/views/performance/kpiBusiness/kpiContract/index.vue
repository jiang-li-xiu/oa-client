<template>
  <div class="app-container">
    <div class="bg-border-color-10">
      <div class="flex-center">
        <img src="@/assets/images/look-over.png" alt="" class="list-img" />
        <p class="font-15 font-700 color-50">筛选查询</p>
      </div>
      <div class="flex-cc width-100">
        <el-form
          class="flex-align-between flex-wrap mt20 m10 width-70"
          :model="queryParams"
          ref="queryForm"
          :inline="true"
          v-show="showSearch"
          label-width="70px"
        >
          <el-form-item label="姓名" prop="userName">
            <el-input
              v-model="queryParams.userName"
              placeholder="请选择人员"
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
      <div>
        <div class="data-list-header flex-align-between">
          <div class="list-header-left font-700 flex-align-center">
            <img src="@/assets/images/list.png" alt="" />
            <p>数据列表</p>
          </div>

          <el-row :gutter="10" class="mb8 list-header-right">
            <el-col :span="1.5">
              <el-button
                type="primary"
                plain
                icon="el-icon-plus"
                size="mini"
                @click="handleAdd"
                v-hasPermi="['business:kpiContract:add']"
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
                v-hasPermi="['business:kpiContract:remove']"
                >删除</el-button
              >
            </el-col>
            <right-toolbar
              :showSearch.sync="showSearch"
              @queryTable="getList"
            ></right-toolbar>
          </el-row>
        </div>
        <div>
          <el-table
            v-loading="loading"
            :data="kpiContractList"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column
              label="合约编号"
              align="center"
              width="80"
              prop="kpicontractId"
            />
            <el-table-column label="姓名" align="center" prop="userName" />
            <el-table-column
              label="部门"
              align="center"
              prop="commonUserInfo.deptName"
            />
            <!-- <el-table-column label="岗位" align="center" prop="post" /> -->
            <el-table-column
              label="Gs权重(%)"
              align="center"
              prop="gsweightCoefficient"
            />
            <el-table-column
              label="KPI权重(%)"
              align="center"
              prop="kpiweightCoefficient"
            />
            <el-table-column
              label="内部满意度(%)"
              align="center"
              prop="intrinsicSatisfaction"
            />
            <el-table-column
              label="创建人"
              align="center"
              prop="createByLabel"
            />
            <el-table-column
              label="创建时间"
              align="center"
              prop="createTime"
              width="180"
            >
              <!--        <template slot-scope="scope">-->
              <!--          <span>{{ parseTime(scope.row.createTime, "{y}-{m}-{d}") }}</span>-->
              <!--        </template>-->
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope">
                <!--          <el-button-->
                <!--            size="mini"-->
                <!--            type="text"-->
                <!--            icon="el-icon-edit"-->
                <!--            @click="handleUpdate(scope.row)"-->
                <!--            v-hasPermi="['business:kpiContract:edit']"-->
                <!--            >修改</el-button-->
                <!--          >-->
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['business:kpiContract:remove']"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
    <!-- 添加或修改kpi绩效合约配置对话框 -->
    <el-dialog
      :title="title"
      top="20vh"
      :close-on-click-modal="false"
      :visible.sync="open"
      width="35%"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="16">
            <el-form-item label-width="120px" label="员工姓名" prop="userName">
              <dispatch-user
                :is-multiple="true"
                :id-array.sync="form.userName"
                :user-name-array="form.userName"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="16">
            <el-form-item label="" prop="userNameArray">
              <el-input style="display: none" v-model="form.userNameArray" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- <el-form-item label="部门" prop="deptId" label-width="80px">
        <treeselect
        v-model="form.deptId"
        :options="queryDeptOptions"
        style="width:250px;"
        :show-coount="true"
        placeholder="请选择所属部门"
        ></treeselect>
      </el-form-item> -->

        <!-- <el-row>
        <el-col :span="12">
           <el-form-item label="岗位" prop="post">
          <el-input v-model="form.post" placeholder="请输入岗位" />
        </el-form-item>
        </el-col>
      </el-row> -->

        <el-row>
          <el-col :span="16">
            <el-form-item
              label-width="120px"
              label="Gs权重(%)"
              prop="gsweightCoefficient"
            >
              <el-input
                v-model.number="form.gsweightCoefficient"
                placeholder="请输入Gs权重(%)"
                @blur="proving1($event)"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="16">
            <el-form-item
              label-width="120px"
              label="KPI权重(%)"
              prop="kpiweightCoefficient"
            >
              <el-input
                v-model.number="form.kpiweightCoefficient"
                placeholder="请输入KPI权重(%)"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="16">
            <el-form-item
              label-width="120px"
              label="内部满意度(%)"
              prop="intrinsicSatisfaction"
            >
              <el-input
                v-model.number="form.intrinsicSatisfaction"
                placeholder="请输入内部满意度(%)"
                @blur="proving1($event)"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <div class="flex-cc font-color" :span="24">
          <img src="@/assets/images/hint.png" alt="" class="hint-img" />
          <p>(GS权重（%）、KPI权重（%）、内部满意度（%）三项之和为100)</p>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer popup-change-btn">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listKpiContract,
  getKpiContract,
  delKpiContract,
  addKpiContract,
  updateKpiContract,
  exportKpiContract,
} from "@/api/performance/kpiContract";
import { treeselect, deptUserCascaderSelect } from "@/api/performance/system/dept";
import TreeSelect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

import DispatchUser from "@/components/performance/DispatchUser";
import { listUser, listByNames } from "@/api/performance/system/user";

export default {
  name: "KpiContract",
  components: {
    TreeSelect,
    DispatchUser,
  },
  data() {
    //Gs权重
    var gsCheckNumber = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("Gs权重(%)不能为空"));
      }
      if (!Number.isInteger(value)) {
        callback(new Error("Gs权重(%)请输入数字值"));
      } else {
        if (value > 100 || value < 0) {
          callback(new Error("Gs权重(%)必须大于0小于100"));
        } else {
          callback();
        }
      }
    };
    //KPI权重
    var kpiCheckNumber = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("KPI权重(%)不能为空"));
      }
      if (!Number.isInteger(value)) {
        callback(new Error("KPI权重(%)请输入数字值"));
      } else {
        if (value > 100 || value < 0) {
          callback(new Error("KPI权重(%)必须大于0小于100"));
        } else {
          callback();
        }
      }
    };
    //内部满意度
    var internalCheckNumber = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("内部满意度(%)不能为空"));
      }
      if (!Number.isInteger(value)) {
        callback(new Error("内部满意度(%)请输入数字值"));
      } else {
        if (value > 100 || value < 0) {
          callback(new Error("内部满意度(%)必须大于0小于100"));
        } else {
          callback();
        }
      }
    };

    return {
      //姓名
      userNames: undefined,
      // 遮罩层
      loading: true,
      //请选择所属部门
      queryDeptOptions: undefined,
      // 选中数组
      ids: [],
      //用户数组
      userNameArray: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // kpi绩效合约配置表格数据
      kpiContractList: [],
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
        kpicontractId: null,
        userName: null,
        deptId: null,
        post: null,
        gsweightCoefficient: null,
        kpiweightCoefficient: null,
        intrinsicSatisfaction: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        deleteBy: null,
        deleteTime: null,
        deleteStatus: null,
      },
      // 表单参数
      form: {
        userNameArray: [],
      },
      // 表单校验
      rules: {
        userName: [
          { required: true, message: "姓名不能为空", trigger: "blur" },
        ],
        gsweightCoefficient: [
          { required: true, validator: gsCheckNumber, trigger: "blur" },
        ],
        kpiweightCoefficient: [
          { required: true, validator: kpiCheckNumber, trigger: "blur" },
        ],
        intrinsicSatisfaction: [
          { required: true, validator: internalCheckNumber, trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getDeptTreeSelect();
  },
  methods: {
    /** 查询kpi绩效合约配置列表 */
    getList() {
      this.loading = true;
      listKpiContract(this.queryParams).then((response) => {
        this.kpiContractList = response.rows;
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
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        kpicontractId: null,
        userName: null,
        deptId: null,
        post: null,
        gsweightCoefficient: null,
        kpiweightCoefficient: null,
        intrinsicSatisfaction: null,
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
    //设置禁止输入小数和负数(只允许输入正整数)
    proving1(e) {
      let boolean = new RegExp("^[0-9]*[1-9][0-9]*$").test(e.target.value);
      console.log(boolean);
      if (!boolean) {
        // this.$message.warning('请输入正整数')
        // e.target.value = ' '
        return "请输入正整数";
      }
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
      this.ids = selection.map((item) => item.kpicontractId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.getDeptUserCascaderSelect();
      this.getDeptTreeselect();
      this.open = true;
      this.title = "添加kpi绩效合约配置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getDeptUserCascaderSelect();
      this.getDeptTreeselect();
      const kpicontractId = row.kpicontractId || this.ids;
      getKpiContract(kpicontractId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改kpi绩效合约配置";
      });
    },
    /**查询部门用户级联结构 */
    getDeptUserCascaderSelect() {
      deptUserCascaderSelect().then((response) => {
        this.userNames = response.data;
      });
    },

    /**查询部门下拉树结构 */
    getDeptTreeselect() {
      treeselect().then((response) => {
        this.queryDeptOptions = response.data;
        console.log("部门");
        console.log(this.queryDeptOptions);
      });
    },

    /** 提交按钮 */
    submitForm() {
      console.log("1");
      this.form.userNameArray = (this.form.userName || "").split(",");

      if (
        this.form.gsweightCoefficient +
          this.form.kpiweightCoefficient +
          this.form.intrinsicSatisfaction !=
        100
      ) {
        this.$confirm("GS权重(%)+KPI权重(%)+内部满意度(%)要等于100", {
          confirmButtonText: "确定",
          type: "warning",
        });
      } else if (
        this.form.userName == undefined ||
        this.form.userName == null ||
        this.form.userName == ""
      ) {
        console.log(this.form.userName);
        this.$message.error("请选择人员！");
        return;
      } else {
        this.$refs["form"].validate((valid) => {
          if (valid) {
            if (this.form.kpicontractId != null) {
              updateKpiContract(this.form).then((response) => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addKpiContract(this.form).then((response) => {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              });
            }
          }
        });
      }
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const kpicontractIds = row.kpicontractId || this.ids;
      this.$confirm(
        '是否确认删除kpi绩效合约配置编号为"' + kpicontractIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delKpiContract(kpicontractIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有kpi绩效合约配置数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportKpiContract(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        });
    },
  },
};
</script>

<style scoped>
/* 提示图标 */
.hint-img {
  padding: 5px;
}
/* 红色提示语 */
.font-color {
  color: #f65c55;
}

/* 检索区内容 */
.search-content {
  width: 60%;
  display: flex;
  align-items: center;
  justify-content: start;
}

.list-header-left {
  font-size: 15px;
  color: #505050;
}

.list-header-left > img {
  width: 25px;
  height: 25px;
  margin: 0 10px;
}

.el-form > .el-form-item {
  margin-bottom: 10px;
}
</style>