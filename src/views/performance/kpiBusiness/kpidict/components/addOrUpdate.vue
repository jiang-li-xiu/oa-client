<template>
  <div>
    <!-- 添加或修改kpi字典对话框 -->
    <el-dialog :title="!form.kpidictId ? '新增' : '修改'" :visible.sync="visible" width="35%" append-to-body :close-on-click-modal="false">
      <el-form ref="dataForm" :model="form" :rules="rules" label-width="80px">
        <el-form-item   label="指标名称" prop="targetTitle">
          <el-input  v-model="form.targetTitle" placeholder="请输入指标名称"/>
        </el-form-item>

        <el-form-item label="考核周期" prop="assessmentType">
          <el-radio-group v-model="form.assessmentType" size="small">
            <!-- 90 v-for 须带索引 -->
            <span v-for="(dict,index) in assessmentTypeOptions" :key="index">
                  <el-radio :key="dict.dictValue" :label="dict.dictValue" border style="margin-right: 20px;">
                    {{ dict.dictLabel }}
                  </el-radio>
                </span>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="权重" prop="weightCoefficient">
          <el-input-number v-model="form.weightCoefficient" controls-position="right" :min="0" :max="100" />
        </el-form-item>

        <el-form-item  label="所属部门" prop="deptId">
          <tree-select v-model="form.deptId" :options="deptOptions" :show-count="true" placeholder="请选择所属部门"/>
        </el-form-item>
        <el-form-item label="初评人" prop="preliminaryReviewer">
          <dispatch-user :is-multiple="false" :id-array.sync="form.preliminaryReviewer"
          :user-name-array="form.preliminaryReviewer"/>
<!--          <el-input placeholder="请选择责任人" v-model="form.preliminaryReviewerLabel" class="input-with-select"
                    :disabled="true">
            <el-button slot="append" icon="el-icon-search" @click="selectPreliminaryReviewer()"></el-button>
          </el-input>
          <dispatch-users :is-multiple="false" :visible.sync="preliminaryReviewerOpen" @on-chose="getPreliminaryReviewer" :selected="form.preliminaryReviewer"/>-->
        </el-form-item>
        <el-form-item label="终评人" prop="finalReviewer">
          <dispatch-user :is-multiple="false" :id-array.sync="form.finalReviewer"
                         :user-name-array="form.finalReviewer"/>
<!--          <el-input placeholder="请选择终评人" v-model="form.finalReviewerLabel" class="input-with-select"
                    :disabled="true">
            <el-button slot="append" icon="el-icon-search" @click="selectFinalReviewer()"></el-button>
          </el-input>
          <dispatch-users :is-multiple="false" :visible.sync="finalReviewerOpen" @on-chose="getFinalReviewer" :selected="form.finalReviewer"/>-->
        </el-form-item>

        <el-form-item label="计分方法" prop="scoringMethod">
          <el-input resize="none" v-model="form.scoringMethod" type="textarea" :autosize="{ minRows: 3, maxRows: 5}"
                    placeholder="请输入计分方法"/>
        </el-form-item>
        <el-form-item  label="目标值" prop="targetValue">
          <el-input resize="none" v-model="form.targetValue" type="textarea" :autosize="{ minRows: 3, maxRows: 5}"
                    placeholder="请输入目标值"/>
        </el-form-item>
        <el-form-item  label="指标说明" prop="targetExplain">
          <el-input resize="none" v-model="form.targetExplain" type="textarea" :autosize="{ minRows: 3, maxRows: 5}"
                    placeholder="请输入指标说明"/>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer popup-change-btn">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {addKpidict, getKpidict, updateKpidict} from "@/api/performance/kpidict";
import {treeselect} from "@/api/performance/system/dept";
import TreeSelect from "@riophae/vue-treeselect";
import DispatchUser from '@/components/performance/DispatchUser';
import DispatchUsers from '@/components/performance/DispatchUsers';

export default {
  name: "addOrUpdate",
  components: {
    TreeSelect, DispatchUser, DispatchUsers
  },
  data() {
    return {
      visible: false,
      preliminaryReviewerOpen: false,
      finalReviewerOpen: false,
      form: {
        kpidictId: undefined,
        targetTitle: null,
        targetValue: null,
        targetExplain: null,
        assessmentType: null,
        weightCoefficient: null,
        deptId: null,
        preliminaryReviewer: null,
        preliminaryReviewerSecond: null,
        scoringMethod: null,
        finalReviewer: null,
      },
      // 考核类型字典
      assessmentTypeOptions: [],
      // 部门列表
      deptOptions: [],
      // 表单校验
      rules: {
        targetTitle: [
          {required: true, message: "指标名称不能为空", trigger: "blur"}
        ],
        targetValue: [
          {required: true, message: "目标值不能为空", trigger: "blur"}
        ],
        deptId: [
          {required: true, message: "所属部门不能为空", trigger: "change"}
        ],
        assessmentType: [
          {required: true, message: "考核类型不能为空", trigger: "change"}
        ],
        weightCoefficient: [
          {required: true, message: "权重系数不能为空", trigger: "change"}
        ],
        preliminaryReviewer: [
          {required: true, message: "初评人不能为空", trigger: "change"}
        ],
        scoringMethod: [
          {required: true, message: "计分方法不能为空", trigger: "change"}
        ],
        finalReviewer: [
          {required: true, message: "终评人不能为空", trigger: "change"}
        ],
      }
    }
  },
  methods: {
    getList() {
      this.getDicts("gs_assessment_type").then(response => {
        this.assessmentTypeOptions = response.data;
      });
    },
    /** 查询部门下拉树结构 */
    getDeptTreeSelect() {
      treeselect().then(response => {
        this.deptOptions = response.data;
      });
    },
    init (id) {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
        this.$refs['dataForm'].resetFields()
        if (id === undefined) {
          //重置this.form.kpidictId,解决新增修改时的bug
          this.form.kpidictId = undefined;
          return;
        }
        getKpidict(id).then(response => {
          this.form = response.data;
        });

      })
    },
    // 初评人
    selectPreliminaryReviewer() {
      this.preliminaryReviewerOpen = true
    },
    // 终评人
    selectFinalReviewer() {
      this.finalReviewerOpen = true
    },
    getPreliminaryReviewer(data) {
      this.form.preliminaryReviewer = data[0].userName
      this.form.preliminaryReviewerLabel = data[0].nickName
    },
    getFinalReviewer(data) {
      this.form.finalReviewer = data[0].userName
      this.form.finalReviewerLabel = data[0].nickName
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["dataForm"].validate(valid => {
        if (!valid) {
          return
        }
        if (this.form.kpidictId != null) {
          updateKpidict(this.form).then(response => {
            this.msgSuccessFun("修改成功", () => {
              this.visible = false
              this.$emit('refreshDataList')
            });
          });
          return;
        }

        addKpidict(this.form).then(response => {
          this.msgSuccessFun("新增成功", () => {
            this.visible = false
            this.$emit('refreshDataList')
          });
        });
      });
    },
    // 取消按钮
    cancel() {
      this.visible = false;
    },
  },
  created() {
    this.getDeptTreeSelect()
    this.getList()
  }
}
</script>

<style scoped>

</style>
