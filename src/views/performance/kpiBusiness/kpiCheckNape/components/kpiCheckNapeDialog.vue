<template>
 <!-- 添加或修改考核项对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="关联考核配置总表id" prop="assessmentConfigureId">
          <el-input v-model="form.assessmentConfigureId" placeholder="请输入关联考核配置总表id" />
        </el-form-item>
        <el-form-item label="指标名称" prop="targetTitle">
          <el-input v-model="form.targetTitle" placeholder="请输入指标名称" />
        </el-form-item>
        <el-form-item label="目标值" prop="targetValue">
          <el-input v-model="form.targetValue" placeholder="请输入目标值" />
        </el-form-item>
        <el-form-item label="指标说明" prop="targetExplain">
          <el-input v-model="form.targetExplain" placeholder="请输入指标说明" />
        </el-form-item>
        <el-form-item label="考核项权重" prop="weightCoefficient">
          <el-input v-model="form.weightCoefficient" placeholder="请输入考核项权重" />
        </el-form-item>
        <el-form-item label="计分方法" prop="scoringMethod">
          <el-input v-model="form.scoringMethod" placeholder="请输入计分方法" />
        </el-form-item>
        <el-form-item label="初评人" prop="preliminaryReviewer">
          <el-select v-model="form.preliminaryReviewer" placeholder="请选择初评人">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="终评人" prop="finalReviewer">
          <el-select v-model="form.finalReviewer" placeholder="请选择终评人">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="初评评分" prop="firstScore">
          <el-input v-model="form.firstScore" placeholder="请输入初评评分" />
        </el-form-item>
        <el-form-item label="初评评语" prop="firstComment">
          <el-input v-model="form.firstComment" placeholder="请输入初评评语" />
        </el-form-item>
        <el-form-item label="初评完成值" prop="finishValue">
          <el-input v-model="form.finishValue" placeholder="请输入初评完成值" />
        </el-form-item>
        <el-form-item label="终评得分" prop="finalScore">
          <el-input v-model="form.finalScore" placeholder="请输入终评得分" />
        </el-form-item>
        <el-form-item label="终评评语" prop="finalComment">
          <el-input v-model="form.finalComment" placeholder="请输入终评评语" />
        </el-form-item>
        <el-form-item label="终评完成值" prop="finalFinishValue">
          <el-input v-model="form.finalFinishValue" placeholder="请输入终评完成值" />
        </el-form-item>
        <el-form-item label="开启时间" prop="startTime">
          <el-date-picker clearable size="small"
            v-model="form.startTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择开启时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker clearable size="small"
            v-model="form.endTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="考核项状态">
          <el-radio-group v-model="form.assessmentStatus">
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
import {addKpiCheckNape, updateKpiCheckNape} from "@/api/performance/kpiCheckNape";

    export default {
        name: "KpiCheckNapeDialog",
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
                // 表单参数
                form: {},
                // 表单校验
                rules: {
                                                             }
            }
        },
        methods: {
            // 提交到父组件
            submitForm() {
              this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.assessmentOptionId != null) {
            updateKpiCheckNape(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addKpiCheckNape(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
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