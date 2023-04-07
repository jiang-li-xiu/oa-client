<template>
  <div class="app-container">
    <div class="bg-border-color-10">
      <div class="flex-center">
        <img src="@/assets/images/look-over.png" alt="" class="list-img" />
        <p class="font-15 font-700 color-50 ml0">筛选查询</p>
      </div>
      <el-form class="el-form flex-align-between mt20 mb10" :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch"
        label-width="70">
        <el-form-item label="任务名称" prop="taskName">
          <el-input v-model="queryParams.taskName" placeholder="请输入任务名称" clearable size="small" @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="验收人" prop="acceptanceByLabel">
          <el-input v-model="queryParams.acceptanceByLabel" placeholder="请输入验收人" clearable size="small"
            @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="责任人" prop="responsibilityLabel">
          <el-input v-model="queryParams.responsibilityLabel" placeholder="请输入责任人" clearable size="small"
            @keyup.enter.native="handleQuery" />
        </el-form-item>
        <!--  <el-form-item label="责任人" prop="responsibilityBy">
        <el-select v-model="queryParams.responsibilityBy" placeholder="请选择责任人" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item> -->

        <!-- 任务状态 -->
        <el-form-item label="任务状态" prop="applyTaskStatue">
          <el-select v-model="taskStatusVal" @change="queryChangeByTaskStatus" clearable size="small">
            <el-option v-for="dict in taskStatusOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <!-- 考核类型 -->
        <el-form-item label="考核类型" prop="applyTaskStatue">
          <el-select v-model="assessmentTypeVal" @change="queryChangeByAssessmentType" clearable size="small">
            <el-option v-for="dict in assessmentTypeOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="开始日期" prop="startRange">
          <el-date-picker v-model="queryParams.startRange" type="datetimerange" range-separator="至" start-placeholder="开始"
            end-placeholder="结束" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" align="right">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期" prop="endRange">
          <el-date-picker v-model="queryParams.endRange" type="datetimerange" range-separator="至" start-placeholder="开始"
            end-placeholder="结束" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" align="right">
          </el-date-picker>
        </el-form-item>
        <!-- <el-col :span="1.5">
            <el-radio-group
              v-model="queryParams.taskStatus"
              @change="queryChangeByTaskStatus"
              size="small"
            >
              <el-radio-button label="">全部</el-radio-button>
              <span v-for="(dict, index) in taskStatusOptions" :key="index">
                <el-radio-button v-if="index !== 0" :label="dict.dictValue">{{
                  dict.dictLabel
                }}</el-radio-button>
              </span>
            </el-radio-group>
          </el-col> -->

        <!-- <el-col :span="1.5"> -->
        <!-- <el-radio-group
              v-model="queryParams.assessmentType"
              @change="queryChangeByAssessmentType"
              size="small"
            >
              <span v-for="(dict, index) in assessmentTypeOptions" :key="index">
                <el-radio-button :label="dict.dictValue">{{
                  dict.dictLabel
                }}</el-radio-button>
              </span>
            </el-radio-group> -->
        <!-- </el-col> -->

        <!-- <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item> -->
      </el-form>
      <div class="flex-cc">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
      </div>
    </div>

    <div class="bg-border-color-10 mb10">
      <div class="flex-align-between mb10">
        <div class="flex-align-center">
          <img src="@/assets/images/list.png" alt="" class="list-img ml0 mr10" />
          <p class="color-50 font-15 font-700">数据列表</p>
        </div>
        <el-button class="mr10" type="warning" plain icon="el-icon-download" size="small" @click="handleExport"
          v-hasPermi="['business:taskApplyManager:export']">导出
        </el-button>
      </div>
      <el-table v-loading="loading" stripe ref="tableList" :data="gsTaskList" @sort-change="sortChange" :default-sort="{ prop: 'taskStatus' }"
        @filter-change="filterChangeInit">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="编号" sortable="custom" align="center" prop="taskId" />
        <el-table-column label="任务名称" min-width="200%" :show-overflow-tooltip="true" align="center" prop="taskName" />
        <!-- <el-table-column label="任务内容" align="center" prop="taskContent" /> -->
        <el-table-column label="开始日期" width="150%" align="center" sortable="custom" prop="startDate">
          <template slot-scope="scope">
            <span>{{
              scope.row.startDate | parseTime("{y}-{m}-{d} {h}:{i}")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="结束日期" sortable="custom" align="center" prop="endDate" width="150%">
          <template slot-scope="scope">
            <span>{{
              scope.row.endDate | parseTime("{y}-{m}-{d} {h}:{i}")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="考核类型" align="center" prop="assessmentType" :formatter="assessmentTypeFormat" />
        <el-table-column label="考核年份" align="center" prop="assessmentYear" />
        <el-table-column label="考核月份" align="center" prop="assessmentMonth" />
        <!-- <el-table-column label="权重系数" align="center" prop="weightCoefficient" :formatter="weightCoefficientFormat" />
      <el-table-column label="创新系数" align="center" prop="activeInnovationCoefficient" :formatter="activeInnovationCoefficientFormat" /> -->
        <el-table-column label="工时" align="center" prop="workTime" />
        <el-table-column label="责任人" align="center" prop="responsibilityLabel" />
        <el-table-column label="验收人" min-width="150%" align="center" prop="acceptanceByLabel">
          <template slot-scope="scope">
            {{
              scope.row.acceptanceVoList
                .map((item) => item.acceptanceByLabel)
                .join(" / ")
            }}
          </template>
        </el-table-column>
        <el-table-column label="任务状态" width="125%" align="center" prop="taskStatus" column-key="taskStatus" fixed="right"
          :filters="[
            { text: '未逾期', value: 1 },

            { text: '逾期', value: 3 },
          ]"
          :filter-method="filterStatus" filter-placement="bottom-end">
          <template slot-scope="scope">
            <el-badge :hidden="scope.row.underwayStatus !== 3" value="逾期" class="item">
              <el-tag effect="plain" type="info" size="small">{{
                scope.row.taskStatusLabel
              }}</el-tag>
            </el-badge>
          </template>
        </el-table-column>
        <!--        <el-table-column
          label="是否超期"
          fixed="right"
          align="center"
          prop="underwayStatus"
        >
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.underwayStatus == 3"
              >是</el-tag
            >
            <el-tag type="success" v-else>否</el-tag>
          </template>
        </el-table-column>-->
        <el-table-column label="审核状态" align="center" fixed="right" prop="taskStatus" :formatter="taskStatusFormat">
          <template slot-scope="scope">
            <p v-if="isCheckTask(scope.row.taskId) == 0">
              <el-tag>待审核</el-tag>
            </p>
            <p v-else>
              <el-tag type="info">已审核</el-tag>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="small" type="text" icon="el-icon-info" @click="handleInfo(scope.row.taskId)" v-hasPermi="[
                'business:taskManager:query',
                'business:milestone:list',
              ]">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
        @pagination="getList" />
    </div>
    <!-- GS任务完成详情对话框 -->

    <el-dialog :title="title" :close-on-click-modal="false" :visible.sync="infoDialogOpen" width="50%" append-to-body>
      <!-- 任务明细 -->
      <el-card class="box-card mb10">
        <div>
          <div class="flex">
            <span class="mark-logo mr10"></span>
            <div class="font-15 font-700 mb20">任务详情</div>
          </div>

          <div class="ml0">
            <el-row :gutter="24" class="mb20">
              <el-col :span="3">
                <span class="color-35">任务名称</span>
              </el-col>
              <el-col :span="7" class="color-91">
                {{ thisTask.taskName }}
              </el-col>

              <el-col :span="3">
                <span class="color-35">责任人</span>
              </el-col>
              <el-col :span="11" class="color-91">
                {{
                  thisTask.responsibilityLabel
                    ? thisTask.responsibilityLabel
                    : "暂无"
                }}
              </el-col>
            </el-row>

            <el-row :gutter="24" class="mb20">
              <el-col :span="3">
                <span class="color-35">验收人</span>
              </el-col>
              <el-col :span="7" class="color-91">
                {{
                  thisTask.acceptanceVoList == null
                    ? "暂无"
                    : thisTask.acceptanceVoList
                        .map((a) => a.acceptanceByLabel)
                        .join(" / ")
                }}
              </el-col>
              <div v-if="thisTask.taskStatus !== '1'">
                <el-col :span="3">
                  <span class="color-35">下达时间</span>
                </el-col>
                <el-col :span="11" class="color-91">
                  {{
                    thisTask.taskReleaseTime
                      ? parseTime(
                          thisTask.taskReleaseTime,
                          "{y}年{m}月{d}日 {h}:{i}:{s}"
                        )
                      : "暂无"
                  }}
                </el-col>
              </div>
            </el-row>

            <el-row v-if="thisTask.taskStatus >= '3'" :gutter="24" class="mb20">
              <div>
                <el-col :span="3">
                  <span class="color-35">实际完成时间</span>
                </el-col>
                <el-col :span="7" class="color-91">
                  {{
                    thisTask.actualEndTime
                      ? parseTime(
                          thisTask.actualEndTime,
                          "{y}年{m}月{d}日 {h}:{i}:{s}"
                        )
                      : "暂无"
                  }}
                </el-col>
                <el-col :span="3">
                  <span class="color-35">主动创新系数</span>
                </el-col>
                <el-col :span="11" class="color-91">
                  {{
                    activeInnovationCoefficientFormat(thisTask)
                      ? activeInnovationCoefficientFormat(thisTask)
                      : "暂无"
                  }}
                </el-col>
              </div>
            </el-row>
            <el-row class="mb20">
              <el-col :span="3">
                <span class="color-35">计划时间：</span>
              </el-col>
              <el-col :span="12" class="color-91">
                {{
                  thisTask.startDate | parseTime("{y}  年 {m} 月{d} 日 {h}:{i}")
                }}
                至
                {{
                  thisTask.endDate | parseTime("{y} 年 {m} 月 {d} 日 {h}:{i}")
                }}
              </el-col>
            </el-row>
            <el-row class="mb20">
              <el-col :span="3">
                <span class="color-35">考核类型</span>
              </el-col>
              <el-col :span="7" class="color-91">
                <span v-text="assessmentTypeFormat(thisTask)"></span>
              </el-col>

              <el-col :span="3">
                <span class="color-35">考核月份</span>
              </el-col>
              <el-col :span="11" class="color-91">
                {{ thisTask.assessmentYear }}年{{ thisTask.assessmentMonth }}月
              </el-col>
            </el-row>

            <el-row class="mb20">
              <el-col :span="3">
                <span class="color-35">权重系统</span>
              </el-col>
              <el-col :span="7" class="color-91">
                {{
                  weightCoefficientFormat(thisTask)
                    ? weightCoefficientFormat(thisTask)
                    : "暂无"
                }}
              </el-col>

              <el-col :span="3">
                <span class="color-35">任务评分</span>
              </el-col>
              <el-col :span="11" class="color-91">
                {{ thisTask.taskScore ? thisTask.taskScore : "暂无" }}
              </el-col>
            </el-row>

            <el-row class="mb20">
              <el-col :span="3" class="color-91">
                <span class="color-35">任务状态</span>
              </el-col>
              <el-col :span="7">
                <el-badge :hidden="thisTask.underwayStatus !== 3" value="逾期">
                  <el-tag :type="taskStatusFormat(thisTask)" size="small">{{
                    thisTask.taskStatusLabel
                  }}</el-tag>
                </el-badge>
              </el-col>
              <el-col :span="3">
                <span class="color-35">任务来源</span>
              </el-col>
              <el-col :span="11" class="color-91">
                {{ thisTask.taskSourceLabel }}
              </el-col>
            </el-row>

            <el-row class="mb20">
              <el-col :span="3">
                <span class="color-35">创建人</span>
              </el-col>
              <el-col :span="7" class="color-91">
                {{ thisTask.createByLabel }}
              </el-col>
            </el-row>
          </div>
        </div>
      </el-card>
      <!-- 任务内容 -->
      <el-card class="box-card mb10">
        <div class="flex mb10">
          <span class="mark-logo mr10"></span>
          <div class="font-15 font-700">任务内容</div>
        </div>
        <div>
          <div class="ql-editor">
            <div v-html="thisTask.taskContent">
              {{ thisTask.taskContent }}
            </div>
          </div>
        </div>
      </el-card>
      <!-- 任务附件 -->
      <el-card class="box-card mb10">
        <div class="flex mb10">
          <span class="mark-logo mr10"></span>
          <div class="font-15 font-700">任务附件</div>
        </div>

        <el-row :gutter="20" style="text-align: center">
          <el-col :span="24">
            <h4 v-if="!thisTask.fileIdStr">无附件</h4>
          </el-col>
        </el-row>
        <file-list :echo-file-str="thisTask.fileIdStr" />
      </el-card>

      <!-- 过程里程碑 -->
      <el-card class="box-card mb10" shadow="never" style="margin-top: 20px">
        <el-row>
          <el-col :span="24">
            <div class="flex mb10">
              <span class="mark-logo mr10"></span>
              <div class="font-15 font-700">过程里程碑</div>
            </div>
            <el-col :span="24">
              <el-timeline>
                <el-timeline-item placement="top" v-for="(item, index) in milestoneInfo" :key="index" :timestamp="item.milestoneDate">
                  <el-card>
                    <el-row :gutter="24" class="mb20">
                      <el-col :span="4">
                        <b>里程碑名称</b>
                      </el-col>
                      <el-col :span="20">
                        {{ item.milestoneName }}
                      </el-col>
                    </el-row>
                    <el-row :gutter="24" class="mb20">
                      <el-col :span="4">
                        <b>里程碑内容</b>
                      </el-col>
                      <el-col :span="20">
                        {{ item.milestoneContent }}
                      </el-col>
                    </el-row>
                    <el-row :gutter="24" class="mb20">
                      <el-col :span="4">
                        <b>里程碑填报日期</b>
                      </el-col>
                      <el-col :span="20">
                        {{
                          item.reportDate
                            | parseTime("{y}年{m}月{d}日  {h}:{i}:{s}")
                        }}
                      </el-col>
                    </el-row>
                    <el-row :gutter="24" class="mb20">
                      <el-col :span="4">
                        <b>报告附件</b>
                      </el-col>
                      <el-col :span="20">
                        <fileList ref="fileUpload" :file-str.sync="item.reportFileIdStr" :echo-file-str="item.reportFileIdStr || ''"></fileList>
                      </el-col>
                    </el-row>
                    <el-row :gutter="24" class="mb20">
                      <el-col :span="4">
                        <b>里程碑报告内容</b>
                      </el-col>
                    </el-row>
                    <el-row :gutter="24">
                      <el-col :span="24">
                        <div v-html="item.milestoneReport"></div>
                      </el-col>
                    </el-row>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </el-col>
          </el-col>
        </el-row>
      </el-card>
      <!-- 总结内容 -->
      <el-card class="box-card mb10">
        <div class="flex mb10">
          <span class="mark-logo mr10"></span>
          <div class="font-15 color-35 font-700">总结报告</div>
        </div>
        <div>
          <el-col :span="24">
            <h4 v-if="!thisTask.summaryContent">无总结报告</h4>
          </el-col>
        </div>
        <div class="ml0" v-html="thisTask.summaryContent"></div>
      </el-card>
      <!--总结附件-->
      <el-card class="box-card mb10">
        <div class="flex mb10">
          <span class="mark-logo mr10"></span>
          <div class="font-15 color-35 font-700">总结附件</div>
        </div>

        <el-row :gutter="20" style="text-align: center">
          <el-col :span="24">
            <h4 v-if="!thisTask.summaryFileIdStr">无总结附件</h4>
          </el-col>
        </el-row>
        <file-list :echo-file-str="thisTask.summaryFileIdStr" />
      </el-card>
      <!-- 任务评分-->
      <el-card class="box-card mb10 pt5 pb5">
        <el-row class="flex-align-center">
          <el-col :span="3">
            <div class="flex">
              <span class="mark-logo mr10"></span>
              <div class="font-15 color-35 font-700">任务评分</div>
            </div>
          </el-col>
          <el-col :span="9">
            <el-form ref="commentInfo" :model="commentInfo" :rules="rules1" label-width="80px">
              <el-rate prop="commentScore" score-template :max="12" :disabled="this.commentInfo.isCheck == 1" :texts="values"
                v-model="commentInfo.taskScore" :allow-half="false" show-text>
              </el-rate>
            </el-form>
          </el-col>
          <el-col :span="12">
            <div class="color-91">
              评分系数定义: 0-3星，远低于预期; 3-6星，低于预期; 7星：略低于预期;
              8星：符合预期; 9星：略高于预期; 10星：高于预期
            </div>
          </el-col>
        </el-row>
      </el-card>
      <el-card class="box-card mb10 pt5 pb5">
        <el-row class="flex-align-center">
          <el-col :span="3">
            <div class="flex">
              <span class="mark-logo mr10"></span>
              <div class="font-15 color-35 font-700">评分权重:</div>
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              {{ commentInfo.scoringWeight }}
            </div>
          </el-col>
          <el-col :span="3">
            <div class="flex">
              <span class="mark-logo mr10"></span>
              <div class="font-15 color-35 font-700">任务评分:</div>
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              {{
                commentInfo.taskScore != null
                  ? (commentInfo.taskScore * commentInfo.scoringWeight) / 10
                  : 0
              }}
            </div>
          </el-col>
        </el-row>
      </el-card>
      <el-card class="box-card mb10">
        <el-row>
          <el-col :span="24">
            <div class="flex mb10">
              <span class="mark-logo mr10"></span>
              <div class="font-15 color-35 font-700">任务评价</div>
            </div>
            <p v-if="this.commentInfo.isCheck == 1">
              <el-card class="box-card" style="margin-top: 20px; width: 100%">
                <div id="taskContent" v-html="commentInfo.taskContent">
                  <div>{{ commentInfo.taskContent }}</div>
                </div>
              </el-card>
            </p>
            <p v-else>
              <el-input resize="none" type="textarea" placeholder="请输入内容" v-model="commentInfo.taskContent" maxlength="100"
                show-word-limit>
              </el-input>
            </p>
          </el-col>
        </el-row>
      </el-card>
      <div class="bg-border-color-10 mb10">
        <el-row>
          <el-col :span="24">
            <div class="flex" align="center" style="margin: auto;">
              <span class="mark-logo mr10"></span>
              <div class="font-15 font-700">任务完成情况



              </div>
              <div style="margin: auto;">
                <template>
                  <el-radio v-model="taskInfoPage.completionCheck" label="3">已完成</el-radio>
                  <el-radio v-model="taskInfoPage.completionCheck" label="6">未完成</el-radio>
                  <el-radio v-model="taskInfoPage.completionCheck" label="9">已完成不达标</el-radio>
                </template>
              </div>
            </div>


          </el-col>
        </el-row>
      </div>

      <div align="center" style="margin-top: 20px">
        <el-row>
          <el-col v-if="commentInfo.isCheck == 0">
            <el-button size="medium" type="success" round v-hasPermi="['business:taskManager:edit']" @click="submitForm">确认验收</el-button>
            <el-button size="medium" type="primary" round @click="cancel">返回列表</el-button>
          </el-col>
          <el-col v-else>
            <el-button size="medium" type="primary" round @click="cancel">返回列表</el-button>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    listTaskManager,
    getTaskManager,
    updateTaskManager,
    myListTaskManager,
    exportTaskManager,
    myCheckListTaskManager,
  } from "@/api/performance/taskManager";
  //用户列表
  import {
    listUser,
    getUserProfile
  } from "@/api/performance/system/user";
  //获取评分
  import {
    listComment,
    addComment,
    getComment
  } from "@/api/performance/comment";
  import {
    parseTime,
    formatFileSize
  } from "@/utils/performance/ruoyi";
  import {
    delRelation,
    updateRelation,
    listRelation,
    listRelationByTaskId,
  } from "@/api/performance/relation";
  import FileUpload from "@/components/performance/FileUpload";
  import fileList from "@/components/performance/fileList";
  import Editor from "@/components/performance/Editor";

  // 里程碑API
  import {
    listMilestone,
    listMilestoneByTaskId
  } from "@/api/performance/milestone";

  export default {
    name: "GsTaskAssignment",
    components: {
      FileUpload,
      Editor,
      fileList,
    },
    filters: {
      parseTime,
      formatFileSize,
    },
    data() {
      return {
        completionCheck: null,
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        //评分文字
        values: [
          "0.1",
          "0.2",
          "0.3",
          "0.4",
          "0.5",
          "0.6",
          "0.7",
          "0.8",
          "0.9",
          "1.0",
          "1.1",
          "1.2",
        ],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // GS任务下达表格数据
        gsTaskList: [],
        //设置评分
        commentScoreOpen: false,
        // 弹出层标题
        title: "",
        relationQuery: {
          acceptanceBy: null
        },
        //当前任务
        thisTask: {
          fileIdStr: null,
          summaryContent: null,
          taskContent: null,
          summaryFileIdStr: null,
        },
        //任务信息
        taskInfoPage: {},
        //里程碑信息
        milestoneInfo: [],
        //评价信息
        commentInfo: {},
        // 是否显示弹出层
        open: false,
        //当前审核详情
        thisCheckInfo: {},
        //当前用户名
        username: null,
        //待审核列表
        checkList: [],
        //当前用户信息
        userInfo: {},
        infoDialogOpen: false,
        // 任务状态字典
        taskStatusVal: "",
        taskStatusOptions: [{
          label: "全部状态",
          value: ""
        }],
        // 评分字典
        commentScoreOptions: [],
        // 列表数据，考核类型
        assessmentTypeRow: [],
        // 考核类型字典
        assessmentTypeVal: "",
        assessmentTypeOptions: [{
          label: "全部类型",
          value: ""
        }],

        // 权重系数字典
        weightCoefficientOptions: [],
        // 创新系数字典
        activeInnovationCoefficientOptions: [],
        //评分系数字典
        gsScoreCoefficientOptions: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          taskId: null,
          taskName: null,
          taskContent: null,
          startDate: null,
          taskStatus: null,
          endDate: null,
          startRange: [],
          endRange: [],
          assessmentType: null,
          assessmentYear: null,
          assessmentMonth: null,
          weightCoefficient: null,
          activeInnovationCoefficient: null,
          acceptanceByLabel: null,
          responsibilityLabel: null,
          fileIdStr: null,
          createBy: null,
          createTime: null,
          summaryContent: null,
          summaryFileIdStr: null,
          isAsc: null,
          filterTaskStatus: [],
        },
        // 表单参数
        form: {},
        // 表单校验
        rules1: {
          taskId: [{
            required: true,
            message: "关联任务id不能为空",
            trigger: "blur"
          }, ],
          commentScore: [{
            required: true,
            message: "评分不能为空",
            trigger: "blur"
          }, ],
        },
      };
    },
    created() {
      this.username = this.$store.getters.userInfo.username;
      this.getList();
      this.getDicts("gs_task_score").then((response) => {
        this.commentScoreOptions = response.data;
      });
      this.getDicts("GS_TASK_STATUS").then((response) => {
        response.data.forEach((item) => {
          this.taskStatusOptions.push({
            label: item.dictLabel,
            value: item.dictValue,
          });
        });
      });
      this.getDicts("gs_assessment_type").then((response) => {
        response.data.forEach((item) => {
          this.assessmentTypeOptions.push({
            label: item.dictLabel,
            value: item.dictValue,
          });
        });
        this.assessmentTypeRow = response.data;
      });
      this.getDicts("gs_weight_coefficient").then((response) => {
        this.weightCoefficientOptions = response.data;
      });
      this.getDicts("gs_active_innovation_coefficient").then((response) => {
        this.activeInnovationCoefficientOptions = response.data;
      });
      this.getDicts("GS_SCORE_COEFFICIENT").then((response) => {
        this.gsScoreCoefficientOptions = response.data;
      });
    },
    methods: {

      tes(data) {
        console.log(data)
      },
      /** 查询GS任务下达列表 */
      getList() {
        this.loading = true;
        // this.queryParams.taskStatus = '3';
        let s = {
          acceptanceBy: this.username
        };
        this.relationQuery.acceptanceBy = this.username;
        listRelation(s).then((response) => {
          this.checkList = response.rows;
        });
        // console.log(this.checkList);
        // this.queryParams.acceptanceBy = this.username;
        myCheckListTaskManager(this.queryParams).then((response) => {
          this.gsTaskList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 任务状态字典翻译
      taskStatusFormat(row, column) {
        return this.selectDictLabel(this.taskStatusOptions, row.taskStatus);
      },
      // 考核类型字典翻译
      assessmentTypeFormat(row, column) {
        return this.selectDictLabel(this.assessmentTypeRow, row.assessmentType);
      },
      //从待审核中拿到状态
      isCheckTask(taskId) {
        for (let i = 0; i < this.checkList.length; i++) {
          if (
            taskId == this.checkList[i].taskId &&
            this.username == this.checkList[i].acceptanceBy
          ) {
            console.log(this.checkList[i].isCheck);
            return this.checkList[i].isCheck;
          }
        }
        return 0;
      },
      // 权重系数字典翻译
      weightCoefficientFormat(row, column) {
        return this.selectDictLabel(
          this.weightCoefficientOptions,
          row.weightCoefficient
        );
      },
      // 创新系数字典翻译
      activeInnovationCoefficientFormat(row, column) {
        return this.selectDictLabel(
          this.activeInnovationCoefficientOptions,
          row.activeInnovationCoefficient
        );
      },
      // 评分字典翻译
      commentScoreFormat(row, column) {
        return this.selectDictLabel(this.commentScoreOptions, row.commentScore);
      },
      // 取消按钮
      cancel() {
        this.infoDialogOpen = false;
        this.open = false;
        this.reset();
      },
      open2() {
        this.$notify({
          title: "警告",
          message: "评分不能为空哦",
          type: "warning",
        });
      },
      // 表单重置
      reset() {
        this.form = {};
        (this.thisTask = {
          fileIdStr: null,
          summaryContent: null,
          taskContent: null,
          summaryFileIdStr: null,
        }),
        (this.taskInfoPage = null);
        this.milestoneInfo = [];
        this.resetForm("form");
        this.commentInfo = {};
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.queryParams.taskStatus = "";
        this.queryParams.assessmentType = null;
        this.queryParams.isAsc = null;
        this.queryParams.orderByColumn = [];
        this.queryParams.filterTaskStatus = [];
        this.assessmentTypeVal = "";
        this.taskStatusVal = "";
        // 取消排序选中效果
        this.$refs["tableList"].clearSort();
        this.$refs["tableList"].clearFilter();
        this.handleQuery();
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        queryParams.taskIds = this.ids;
        queryParams.exportName = "我审核的GS任务";
        queryParams.acceptanceBy = this.$store.getters.userInfo.username;
        this.$confirm("是否确认导出指定GS任务信息数据项?", "警告", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
          .then(function() {
            return exportTaskManager(queryParams);
          })
          .then((response) => {
            this.download(response.msg);
          });
      },
      /** 详情按钮操作 */
      handleInfo(taskId) {
        this.reset();
        this.commentInfo.taskId = taskId;

        getTaskManager(taskId).then((response) => {

          this.taskInfoPage = response.data;
          console.log(11111111111111111111 + this.taskInfoPage.completionCheck)
          this.thisTask = response.data;
          console.log(response.data)
          // this.commentInfo.completionCheck = response.data.completionCheck;
          this.fileIdStr = response.data.fileIdStr;
          this.infoDialogOpen = true;
          this.title = "任务完成详情";
          // 富文本追加
          this.taskContent = response.data.taskContent;
          this.summaryContent = response.data.summaryContent;
        });
        listRelation({
          taskId: taskId,
          acceptanceBy: this.username
        }).then(
          (response) => {
            if (response.rows[0] != null) {
              this.commentInfo = response.rows[0];
              this.commentInfo.taskScore = this.commentInfo.taskScore * 10;

            }
          }
        );
        listMilestoneByTaskId(taskId).then((res) => {
          this.milestoneInfo = res.data;
        });
      },
      /** 提交按钮 */
      submitForm() {
        console.log(this.taskInfoPage.completionCheck)
        console.log(this.commentInfo.taskContent);
        if (
          this.commentInfo.taskScore == null ||
          this.commentInfo.taskScore == 0
        ) {

          this.open2();
        } else {
          console.log(this.commentInfo.commentScore);
          this.$refs["commentInfo"].validate((valid) => {
            const temp = {};
            if (valid) {

              console.log("1111111111111111")

              console.log(this.commentInfo)
              this.commentInfo.completionCheck = this.taskInfoPage.completionCheck
              this.commentInfo.isCheck = 1;
              this.commentInfo.taskScore = this.commentInfo.taskScore / 10;
              updateRelation(this.commentInfo).then((response) => {

                this.msgSuccess("审核成功");
                this.infoDialogOpen = false;
                this.getList();
              });
            }
          });
        }
      },
      // 单选框值改变时触发
      queryChangeByTaskStatus(val) {
        if (val === "") {
          this.queryParams.assessmentType = null;
        }

        this.queryParams.taskStatus = val;
        this.handleQuery();
      },
      queryChangeByAssessmentType(val) {
        this.queryParams.assessmentType = val;
        this.handleQuery();
      },
      // 点击排序箭头调用
      sortChange(data) {
        const {
          column,
          prop,
          order
        } = data;
        if (order === null) {
          return;
        }

        this.queryParams.isAsc = order === "ascending" ? "asc" : "desc";
        // 需要指定一下是那张表
        this.queryParams.orderByColumn = `t.${prop}`;

        this.getList();
      },
      filterChangeInit(filter) {

        console.log(filter)
        if (filter.taskStatus) {
          if (filter.taskStatus.length == 1) {
            if (filter.taskStatus[0] == 1) {
              filter.taskStatus = [1, 2];
            }
          } else {
            filter.taskStatus = [1, 2, 3];
          }

          this.queryParams.filterTaskStatus = filter.taskStatus;
          this.getList();
        }
      },
    },
  };
</script>
<style lang="scss" scoped>
  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 120px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 33%;
  }

  .item .el-form-item__label {
    font-size: 1.3em;
    margin-top: 10px;
  }

  .el-table--striped .el-table__body tr.el-table__row--striped td {
    background: rgb(228, 228, 228);
  }

  .item_make {
    color: #000000;
  }

  .item_submit {
    color: #13ce66;
  }

  .item {
    margin-top: 10px;
  }
</style>
