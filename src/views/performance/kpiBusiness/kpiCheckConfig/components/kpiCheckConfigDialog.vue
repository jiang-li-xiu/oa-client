<template>
 <!-- 添加或修改KPI考核配置总对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="70%" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="关联绩效合约配置id" prop="kpiContractId">
          <el-input v-model="form.kpiContractId" placeholder="请输入关联绩效合约配置id" />
        </el-form-item>
        <el-form-item label="考核类型" prop="assessmentType">
          <el-select v-model="form.assessmentType" placeholder="请选择考核类型">
            <el-option
              v-for="dict in assessmentTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="考核年" prop="assessmentYear">
          <el-date-picker clearable size="small"
            v-model="form.assessmentYear"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择考核年">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="考核月" prop="assessmentMonth">
          <el-date-picker clearable size="small"
            v-model="form.assessmentMonth"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择考核月">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="kpi得分" prop="kpiScore">
          <el-input v-model="form.kpiScore" placeholder="请输入kpi得分" />
        </el-form-item>
        <el-form-item label="配置是否已启动" prop="isStart">
          <el-input v-model="form.isStart" placeholder="请输入配置是否已启动" />
        </el-form-item>
        <el-form-item label="考核项状态">
          <el-radio-group v-model="form.assessmentStatus">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="删除人" prop="deleteBy">
          <el-input v-model="form.deleteBy" placeholder="请输入删除人" />
        </el-form-item>
        <el-form-item label="删除时间" prop="deleteTime">
          <el-date-picker clearable size="small"
            v-model="form.deleteTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择删除时间">
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
</template>
<script>
import {addKpiCheckConfig, updateKpiCheckConfig} from "@/api/performance/kpiCheckConfig";

    export default {
        name: "KpiCheckConfigDialog",
        props: {
            title: {
                type: String,
                default: () => {
                    return ""
                }
            },
            open: {
                type: Boolean,
                default: () => {
                    return false
                }
            }
        },
        data() {
            return {

              // 考核类型字典
              assessmentTypeOptions: [],

                // 表单参数
                form: {},
                // 表单校验
                rules: {
                      kpiContractId: [
                        {
                            required: true,
                            message: "关联绩效合约配置id不能为空",
                            trigger:  "blur"                         }
                    ] ,
                       assessmentType: [
                        {
                            required: true,
                            message: "考核类型不能为空",
                            trigger: "change"                         }
                    ] ,
                          isStart: [
                        {
                            required: true,
                            message: "配置是否已启动不能为空",
                            trigger:  "blur"                         }
                    ] ,
                       assessmentStatus: [
                        {
                            required: true,
                            message: "考核项状态不能为空",
                            trigger:  "blur"                         }
                    ] ,
                       createBy: [
                        {
                            required: true,
                            message: "创建人不能为空",
                            trigger:  "blur"                         }
                    ] ,
                       createTime: [
                        {
                            required: true,
                            message: "创建时间不能为空",
                            trigger:  "blur"                         }
                    ] ,
                 }
            }
        },
        created() {
          this.getDicts("kpi_assessment_type").then(response => {
            this.assessmentTypeOptions = response.data;
          });
        },
        methods: {
            // 提交到父组件
            submitForm() {
              this.$refs["form"].validate(valid => {
              if (valid) {
                if (this.form.assessmentConfigureId != null) {
                  updateKpiCheckConfig(this.form).then(response => {
                    this.msgSuccess("修改成功");
                    // this.open = false;
                    this.getList();
                  });
                } else {
                  addKpiCheckConfig(this.form).then(response => {
                    this.msgSuccess("新增成功");
                    // this.open = false;
                    this.getList();
                  });
                }
              }
            });
            },
            // 取消按钮
            cancel() {
                this.$emit("cancel");
            }
        }
    }
</script>
