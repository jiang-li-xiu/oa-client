<!--
 * @Author: Yelucc
 * @Date: 2021-03-03 16:50:56
 * @LastEditors: Yelucc
 * @LastEditTime: 2021-03-03 17:30:32
 * @Description:
-->
<template>
  <el-form ref="form" :model="form" :rules="rules" label-width="80px">
    <el-card class="box-card">
      <el-form-item label="任务名称" prop="taskName">
        <el-input v-model="form.taskName" placeholder="请输入任务名称"/>
      </el-form-item>
      <el-form-item label="开始日期" prop="startDate">
        <el-date-picker
          clearable
          size="small"
          v-model="form.startDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择任务开始日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束日期" prop="endDate">
        <el-date-picker
          clearable
          size="small"
          v-model="form.endDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择任务结束日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="考核月份" prop="assessmentMonth">
        <el-input v-model="form.assessmentMonth" placeholder="请输入考核月份"/>
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
      <el-form-item label="责任人" prop="responsibilityBy">
        <el-input v-model="form.responsibilityBy" placeholder="请输入责任人"/>
      </el-form-item>
      <el-form-item label="验收人" prop="acceptanceBy">
        <el-input v-model="form.acceptanceBy" placeholder="请输入验收人"/>
      </el-form-item>
      <el-form-item label="权重系数" prop="weightCoefficient">
        <el-input v-model="form.weightCoefficient" placeholder="请输入权重系数"/>
      </el-form-item>
      <el-form-item label="创新系数" prop="activeInnovationCoefficient">
        <el-input
          v-model="form.activeInnovationCoefficient"
          placeholder="请输入创新系数"
        />
      </el-form-item>
    </el-card>
    <!-- <el-form-item label="任务状态">
      <el-radio-group v-model="form.taskStatus">
        <el-radio
          v-for="dict in taskStatusOptions"
          :key="dict.dictValue"
          :label="dict.dictValue"
          >{{ dict.dictLabel }}</el-radio
        >
      </el-radio-group>
    </el-form-item> -->
    <el-card class="box-card">
      <el-form-item label="任务内容">
        <editor v-model="form.taskContent" :min-height="192"/>
      </el-form-item>
    </el-card>

    <!-- <el-form-item label="考核年份" prop="assessmentYear">
      <el-input v-model="form.assessmentYear" placeholder="请输入考核年份" />
    </el-form-item> -->


    <el-card class="box-card">
      <el-form-item label="附件">
        <fileUpload v-model="form.fileIdStr"/>
      </el-form-item>
    </el-card>
    <!-- <el-form-item label="结束时间" prop="actualEndTime">
      <el-date-picker
        clearable
        size="small"
        v-model="form.actualEndTime"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="选择结束时间"
      >
      </el-date-picker>
    </el-form-item> -->
    <!-- <el-form-item label="总结内容">
      <editor v-model="form.summaryContent" :min-height="192" />
    </el-form-item>
    <el-form-item label="附件">
      <fileUpload v-model="form.summaryFileIdStr" />
    </el-form-item> -->
  </el-form>
</template>

<script>
import Editor from "@/components/performance/Editor";

export default {
  name: "TaskPublish",
  components: {
    Editor,
  },
  data() {
    return {
      form: {},
    };
  },
};
</script>

<style>
</style>
