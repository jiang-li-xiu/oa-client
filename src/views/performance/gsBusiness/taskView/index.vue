<template>
  <div class="app-container">
    <div class="bg-border-color-10 mb10" v-show="showSearch">
      <div class="flex-center mb20">
        <img src="@/assets/images/look-over.png" alt="" class="list-img" />
        <p class="font-15 font-700 color-50 ml0">筛选查询</p>
      </div>

      <el-form
        class="el-form flex-align-between mt20 mb10"
        :model="queryParams"
        ref="queryForm"
        :inline="true"
        label-width="70px"
      >
              <el-form-item label="任务名称" prop="taskName">
                <el-input
                  v-model="queryParams.taskName"
                  placeholder="请输入任务名称"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
              <!-- 任务状态检索 -->
              <el-form-item label="任务状态" prop="startRange">
                <el-select
                  @change="queryChangeByTaskStatus"
                  v-model="statusValue"
                  placeholder="任务状态"
                >
                  <el-option
                    v-for="item in optionsStatus"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <!-- 考核类型检索 -->
              <el-form-item label="考核类型" prop="startRange">
                <el-select
                  v-model="checkValue"
                  @change="queryChangeByAssessmentType"
                >
                  <el-option
                    v-for="item in optionsCheck"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>

              <!-- 验收人 -->
              <el-form-item label="验收人" prop="acceptanceByLabel">
                <el-input
                  v-model="queryParams.acceptanceByLabel"
                  placeholder="请输入验收人"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>

            <!-- 责任人 -->
              <el-form-item label="责任人" prop="responsibilityLabel">
                <el-input
                  v-model="queryParams.responsibilityLabel"
                  placeholder="请输入责任人"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>

              <!-- 日期选择 -->
              <el-form-item label="开始日期" prop="startRange">
                <el-date-picker
                  v-model="queryParams.startRange"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始"
                  end-placeholder="结束"
                  value-format="yyyy-MM-dd HH:mm"
                  format="yyyy-MM-dd HH:mm"
                  align="right"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="结束日期" prop="endRange">
                <el-date-picker
                  v-model="queryParams.endRange"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始"
                  end-placeholder="结束"
                  value-format="yyyy-MM-dd HH:mm"
                  format="yyyy-MM-dd HH:mm"
                  align="right"
                >
                </el-date-picker>
              </el-form-item>
      </el-form>
      <div class="flex-cc mt10">
        <div @click="handleQuery" class="cursor font-14 search-btn mr10">
          <i class="el-icon-search"></i>
          搜索
        </div>

        <div @click="resetQuery" class="cursor font-14 reset-btn ml10">
          <i class="el-icon-refresh"></i>
          重置
        </div>
      </div>
    </div>

    <div class="bg-border-color-10">
      <div class="task_item">
        <div class="header_left">
          <img class="list_img" src="@/assets/images/list.png" alt="" />
          <span class="img_text">数据列表</span>
        </div>
        <div class="task_item_btn">
          <div class="item_btn">
            <el-col :span="1.5">
              <!-- plain -->
              <!-- size="small" -->
              <el-button
                type="primary"
                icon="el-icon-download"
                @click="handleExport()"
                v-hasPermi="['business:taskManager:export']"
                >导出
              </el-button>
            </el-col>
          </div>

          <right-toolbar
            :showSearch.sync="showSearch"
            @queryTable="getList"
          ></right-toolbar>
        </div>
      </div>

      <el-table
        ref="tableList"
        v-loading="loading"
        :data="taskManagerList"
        :default-sort="{}"
        @row-click="rowClick"
        @selection-change="handleSelectionChange"
        @sort-change="sortChange"
        @filter-change="filterChangeInit"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column
          label="编号"
          align="center"
          width="90"
          sortable="custom"
          prop="taskId"
        />
        <el-table-column
          label="任务名称"
          min-width="300%"
          align="center"
          :show-overflow-tooltip="true"
          prop="taskName"
        />
        <el-table-column
          label="开始日期"
          width="150%"
          align="center"
          sortable="custom"
          prop="startDate"
        >
          <template slot-scope="scope">
            <span>{{
              scope.row.startDate | parseTime("{y}-{m}-{d} {h}:{i}")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="结束日期"
          align="center"
          prop="endDate"
          sortable="custom"
          width="150%"
        >
          <template slot-scope="scope">
            <span>{{
              scope.row.endDate | parseTime("{y}-{m}-{d} {h}:{i}")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="考核类型"
          width="100%"
          align="center"
          prop="assessmentType"
          :formatter="assessmentTypeFormat"
        />
        <el-table-column
          label="权重系数"
          width="100%"
          align="center"
          prop="weightCoefficient"
          :formatter="weightCoefficientFormat"
        />
        <el-table-column
          label="创新系数"
          width="100%"
          align="center"
          prop="activeInnovationCoefficient"
          :formatter="activeInnovationCoefficientFormat"
        />
        <el-table-column
          label="工时"
          width="100%"
          align="center"
          prop="workTime"
        />
        <el-table-column
          label="责任人"
          align="center"
          width="125%"
          prop="responsibilityLabel"
        >
          <template slot-scope="scope">
            {{ scope.row.responsibilityLabel }}
          </template>
        </el-table-column>
        <el-table-column
          label="验收人"
          align="center"
          width="225%"
          prop="acceptanceList"
        >
          <template slot-scope="scope">
            {{
              scope.row.acceptanceVoList
                .map((item) => item.acceptanceByLabel)
                .join(" / ")
            }}
          </template>
        </el-table-column>
        <el-table-column
          label="任务状态"
          width="125%"
          align="center"
          prop="taskStatus"
          column-key="taskStatus"
          fixed="right"
          :filters="[
            { text: '未逾期', value: 1 },

            { text: '逾期', value: 3 },
          ]"
          :filter-method="filterStatus"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            <el-badge
              :hidden="scope.row.underwayStatus !== 3"
              value="逾期"
              class="item"
            >
              <el-tag :type="taskStatusFormat(scope.row)" size="small">{{
                scope.row.taskStatusLabel
              }}</el-tag>
            </el-badge>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="105%"
          fixed="right"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-info"
              @click="handleInfo(scope.row)"
              v-hasPermi="['business:taskManager:query']"
              >详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 任务详情Dialog -->
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="infoDialogOpen"
      width="50%"
      append-to-body
    >
      <div class="bg-border-color-10 mb10">
        <div class="flex">
          <span class="mark-logo mr10 mb20"></span>
          <div class="font-700 color-35 font-15">任务详情</div>
        </div>

        <el-row :gutter="24" class="mb20">
          <el-col :span="4">
            <span class="color-35">任务名称</span>
          </el-col>
          <el-col :span="8" class="color-91">
            {{ taskInfoDetails.taskName }}
          </el-col>

          <el-col :span="4">
            <span class="color-35">责任人</span>
          </el-col>
          <el-col :span="8" class="color-91">
            {{
              taskInfoDetails.responsibilityLabel
                ? taskInfoDetails.responsibilityLabel
                : "暂无"
            }}
          </el-col>
        </el-row>
        <el-row :gutter="24" class="mb20">
          <el-col :span="4">
            <span class="color-35">验收人</span>
          </el-col>
          <el-col :span="8" class="color-91">
            {{ acceptanceListStr ? acceptanceListStr : "暂无" }}
          </el-col>

          <div v-if="taskInfoDetails.taskStatus !== '1'">
            <el-col :span="4">
              <span class="color-35">下达时间</span>
            </el-col>
            <el-col :span="8" class="color-91">
              {{
                taskInfoDetails.taskReleaseTime
                  ? parseTime(
                      taskInfoDetails.taskReleaseTime,
                      "{y}年{m}月{d}日 {h}:{i}:{s}"
                    )
                  : "暂无"
              }}
            </el-col>
          </div>
        </el-row>

        <el-row
          v-if="taskInfoDetails.taskStatus >= '3'"
          :gutter="24"
          class="mb20"
        >
          <el-col :span="4">
            <span class="color-35">实际完成时间</span>
          </el-col>
          <el-col :span="20" class="color-91">
            {{
              taskInfoDetails.actualEndTime
                ? parseTime(
                    taskInfoDetails.actualEndTime,
                    "{y} 年 {m} 月 {d} 日 {h}:{i}:{s}"
                  )
                : "暂无"
            }}
          </el-col>
        </el-row>

        <el-row :gutter="24" class="mb20">
          <el-col :span="4">
            <span class="color-35">计划时间：</span>
          </el-col>
          <el-col :span="20" class="color-91">
            {{
              taskInfoDetails.startDate
                | parseTime("{y} 年 {m} 月 {d} 日 {h}:{i}")
            }}
            至
            {{
              taskInfoDetails.endDate
                | parseTime("{y} 年 {m} 月 {d} 日 {h}:{i}")
            }}
          </el-col>
        </el-row>

        <el-row :gutter="24" class="mb20">
          <el-col :span="4">
            <span class="color-35">考核类型</span>
          </el-col>
          <el-col :span="8" class="color-91">
            <span v-text="assessmentTypeFormat(taskInfoDetails)"></span>
          </el-col>

          <el-col :span="4">
            <span class="color-35">考核月份</span>
          </el-col>
          <el-col :span="8" class="color-91">
            {{ taskInfoDetails.assessmentYear }}年{{
              taskInfoDetails.assessmentMonth
            }}月
          </el-col>
        </el-row>

        <el-row :gutter="24" class="mb20">
          <el-col :span="4">
            <span class="color-35">权重系统</span>
          </el-col>
          <el-col :span="8" class="color-91">
            {{
              weightCoefficientFormat(taskInfoDetails)
                ? weightCoefficientFormat(taskInfoDetails)
                : "暂无"
            }}
          </el-col>

          <el-col :span="4">
            <span class="color-35">主动创新系数</span>
          </el-col>
          <el-col :span="8" class="color-91">
            {{
              activeInnovationCoefficientFormat(taskInfoDetails)
                ? activeInnovationCoefficientFormat(taskInfoDetails)
                : "暂无"
            }}
          </el-col>
        </el-row>

        <el-row :gutter="24" class="mb20">
          <el-col :span="4">
            <span class="color-35">任务评分</span>
          </el-col>
          <el-col :span="8" class="color-91">
            {{ taskInfoDetails.taskScore ? taskInfoDetails.taskScore : "暂无" }}
          </el-col>

          <el-col :span="4">
            <span class="color-35">任务状态</span>
          </el-col>
          <el-col :span="8" class="color-91">
            <el-badge
              :hidden="taskInfoDetails.underwayStatus !== 3"
              value="逾期"
              class=""
            >
              <el-tag :type="taskStatusFormat(taskInfoDetails)" size="small">{{
                taskInfoDetails.taskStatusLabel
              }}</el-tag>
            </el-badge>
          </el-col>
        </el-row>

        <el-row :gutter="24" class="mb20">
          <el-col :span="4">
            <span class="color-35">任务来源</span>
          </el-col>
          <el-col :span="8" class="color-91">
            {{ taskInfoDetails.taskSourceLabel }}
          </el-col>

          <el-col :span="4">
            <span class="color-35">创建人</span>
          </el-col>
          <el-col :span="8" class="color-91">
            {{ taskInfoDetails.createByLabel }}
          </el-col>
        </el-row>
      </div>

      <!-- 任务内容 -->
      <el-card class="box-card mb10">
        <div class="flex">
          <span class="mark-logo mr10 mb20"></span>
          <div class="font-700 color-35 font-15">任务内容</div>
        </div>
        <div>
          <div class="ql-editor">
            <div v-html="taskInfoDetails.taskContent">
              {{ taskInfoDetails.taskContent }}
            </div>
          </div>
        </div>
      </el-card>

      <!-- 过程里程碑 -->
      <el-card class="box-card mb10">
        <div class="flex">
          <span class="mark-logo mr10 mb20"></span>
          <div class="font-700 color-35 font-15">过程里程碑</div>
        </div>

        <el-row :gutter="20" style="text-align: center">
          <el-col :span="24">
            <h4 v-if="milestoneVoList.length === 0">无里程牌</h4>
          </el-col>
        </el-row>
        <div v-if="milestoneVoList.length > 0" class="block">
          <el-timeline>
            <el-timeline-item
              v-for="milestone in taskInfoDetails.milestoneVoList"
              :key="milestone.milestoneId"
              :timestamp="
                milestone.milestoneDate | parseTime('{y}年{m}月{d}日')
              "
              placement="top"
            >
              <el-card>
                <el-row :gutter="24" class="mb20">
                  <el-col :span="4">
                    <b>里程碑名称</b>
                  </el-col>
                  <el-col :span="20">
                    {{ milestone.milestoneName }}
                  </el-col>
                </el-row>
                <el-row :gutter="24" class="mb20">
                  <el-col :span="4">
                    <b>里程碑内容</b>
                  </el-col>
                  <el-col :span="20">
                    {{ milestone.milestoneContent }}
                  </el-col>
                </el-row>
                <el-row :gutter="24" class="mb20">
                  <el-col :span="4">
                    <b>里程碑填报日期</b>
                  </el-col>
                  <el-col :span="20">
                    {{
                      milestone.reportDate
                        | parseTime("{y}年{m}月{d}日 {h}:{i}:{s}")
                    }}
                  </el-col>
                </el-row>
                <el-row :gutter="24" class="mb20">
                  <el-col :span="4">
                    <b>里程碑报告内容</b>
                  </el-col>
                  <el-col :span="20">
                    <b v-if="!milestone.milestoneReport">无报告内容</b>
                    <div
                      v-if="milestone.milestoneReport"
                      class="ql-container ql-snow"
                    >
                      <div class="ql-editor">
                        <div v-html="milestone.milestoneReport">
                          {{ milestone.milestoneReport }}
                        </div>
                      </div>
                    </div>
                  </el-col>
                </el-row>
                <el-row :gutter="24" class="mb10">
                  <el-col :span="4">
                    <b>里程碑附件</b>
                  </el-col>
                  <el-col :span="20">
                    <b v-if="!milestone.reportFileIdStr">无附件</b>
                    <file-list
                      v-if="milestone.reportFileIdStr"
                      :echo-file-str="milestone.reportFileIdStr"
                    />
                  </el-col>
                </el-row>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-card>

      <!-- 任务附件 -->
      <el-card class="box-card mb10">
        <div class="flex">
          <span class="mark-logo mr10 mb20"></span>
          <div class="font-700 color-35 font-15">任务附件</div>
        </div>
        <el-row :gutter="20" style="text-align: center">
          <el-col :span="24">
            <h4 v-if="!taskInfoDetails.fileIdStr">无附件</h4>
          </el-col>
        </el-row>
        <file-list :echo-file-str="taskInfoDetails.fileIdStr" />
      </el-card>

      <!-- 总结报告 -->
      <el-card v-if="taskInfoDetails.taskStatus === '4'" class="box-card mb10">
        <div class="flex">
          <span class="mark-logo mr10 mb20"></span>
          <div class="font-700 color-35 font-15">总结报告</div>
        </div>
        <el-row :gutter="20" style="text-align: center">
          <el-col :span="24">
            <h4 v-if="!taskInfoDetails.summaryContent">无总结报告</h4>
          </el-col>
        </el-row>
        <div v-html="taskInfoDetails.summaryContent"></div>
      </el-card>

      <!-- 总结附件 -->
      <el-card v-if="taskInfoDetails.taskStatus === '4'" class="box-card mb10">
        <div class="flex">
          <span class="mark-logo mr10 mb20"></span>
          <div class="font-700 color-35 font-15">总结附件</div>
        </div>
        <el-row :gutter="20" style="text-align: center">
          <el-col :span="24">
            <h4 v-if="!taskInfoDetails.summaryFileIdStr">无总结附件</h4>
          </el-col>
        </el-row>
        <file-list
          v-if="taskInfoDetails.taskStatus === '4'"
          :echo-file-str="taskInfoDetails.summaryFileIdStr"
        />
      </el-card>

      <!-- 任务评价 -->
      <el-card v-if="taskInfoDetails.taskStatus === '4'" class="box-card mb10">
        <div class="flex">
          <span class="mark-logo mr10 mb20"></span>
          <div class="font-700 color-35 font-15">任务评价</div>
        </div>
        <div class="block">
          <el-row :gutter="20" style="text-align: center">
            <el-col :span="24">
              <h4 v-if="acceptanceVoList.length === 0">无任务评价</h4>
            </el-col>
          </el-row>
          <div v-if="acceptanceVoList.length > 0">
            <el-timeline>
              <el-timeline-item
                v-for="acceptance in acceptanceVoList"
                :key="acceptance.relationId"
                placement="top"
              >
                <el-card>
                  <el-row :gutter="24" class="mb20">
                    <el-col :span="4">
                      <b>验收人</b>
                    </el-col>
                    <el-col :span="20">
                      {{ acceptance.acceptanceByLabel }}
                    </el-col>
                  </el-row>
                  <el-row :gutter="24" class="mb20">
                    <el-col :span="4">
                      <b>评价内容</b>
                    </el-col>
                    <el-col :span="20">
                      <h5 v-if="!acceptance.taskContent">暂无评价</h5>
                      <div
                        v-if="acceptance.taskContent"
                        class="ql-container ql-snow"
                      >
                        <div class="ql-editor">
                          <div v-html="acceptance.taskContent">
                            {{ acceptance.taskContent }}
                          </div>
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row :gutter="24" class="mb20">
                    <el-col :span="4">
                      <b>任务评分</b>
                    </el-col>
                    <el-col :span="20">
                      <el-tag type="info">{{
                        acceptance.taskScore * acceptance.scoringWeight
                      }}</el-tag>
                    </el-col>
                  </el-row>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>
      </el-card>

      <!-- 底部按钮 -->
      <el-row :gutter="20" style="text-align: center" justify="center">
        <el-col :span="24">
          <el-button type="" @click="infoDialogOpen = false">关闭</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  exportTaskManager,
  getTaskManager,
  listTaskManager,
} from "@/api/performance/taskManager";
import FileUpload from "@/components/performance/FileUpload";
import DispatchUser from "@/components/performance/DispatchUser";
import FileList from "@/components/performance/fileList";
import { formatFileSize, parseTime } from "@/utils/performance/ruoyi";
import Editor from "@/components/performance/Editor";
// 里程碑API
import { mapGetters } from "vuex";
import { defaultJsonExport } from "@/utils/performance/export";

export default {
  name: "TaskManager",
  components: {
    FileUpload,
    DispatchUser,
    Editor,
    FileList,
  },
  filters: {
    parseTime,
    formatFileSize,
  },
  computed: {
    ...mapGetters(["name"]),
  },
  data() {
    return {
      empty: "暂未查询到任务喔",
      taskContent: "",
      summaryContent: "",
      // 任务详情
      taskInfoDetails: [],
      // 里程碑列表
      milestoneVoList: [],
      // 验收人列表
      acceptanceVoList: [],
      milestoneInfo: [],
      // 详情弹窗
      infoDialogOpen: false,
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
      // GS任务信息表格数据
      taskManagerList: [],
      // 里程碑数据
      milestoneList: [],
      acceptanceListStr: "",
      // 验收人数据
      acceptanceList: [],
      // 弹出层标题
      title: "选择派遣人",
      // 是否显示弹出层
      open: false,
      // 任务状态字典
      taskStatusOptions: [],
      // 考核类型字典
      assessmentTypeOptions: [],
      // 权重系数字典
      weightCoefficientOptions: [],
      // 创新系数字典
      activeInnovationCoefficientOptions: [],
      // 文件列表
      files: [],
      // 总结附件
      summaryFiles: [],
      underwayStatusList: [
        { value: 0, type: "info" },
        { value: 1, type: "success" },
        { value: 2, type: "warning" },
        { value: 3, type: "danger" },
      ],

      // 考核年数据
      optionsYear: [
        {
          value: "",
          label: "全部年份",
        },
        {
          value: "选项2",
          label: "双皮奶",
        },
        {
          value: "选项3",
          label: "蚵仔煎",
        },
        {
          value: "选项4",
          label: "龙须面",
        },
        {
          value: "选项5",
          label: "北京烤鸭",
        },
      ],
      yearValue: "",

      // 考核类型
      optionsCheck: [
        {
          value: "",
          label: "全部类型",
        },
      ],
      checkValue: "",

      // 考核月数据
      optionsMonth: [
        {
          value: "",
          label: " 全部月份",
        },
        {
          value: "1",
          label: " 1 月",
        },
        {
          value: "2",
          label: " 2 月",
        },
        {
          value: "3",
          label: " 3 月",
        },
        {
          value: "4",
          label: " 4 月",
        },
        {
          value: "5",
          label: " 5 月",
        },
        {
          value: "6",
          label: " 6 月",
        },
        {
          value: "7",
          label: " 7 月",
        },
        {
          value: "8",
          label: " 8 月",
        },
        {
          value: "9",
          label: " 9 月",
        },
        {
          value: "10",
          label: " 10 月",
        },
        {
          value: "11",
          label: " 11 月",
        },
        {
          value: "12",
          label: " 12 月",
        },
      ],
      monthValue: "",

      // 任务状态
      optionsStatus: [
        {
          value: "",
          label: "全部状态",
        },
      ],
      statusValue: "",

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        taskId: null,
        taskName: null,
        taskContent: null,
        taskStatus: "",
        startDate: null,
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
        updateBy: null,
        updateTime: null,
        actualEndTime: null,
        summaryContent: null,
        summaryFileIdStr: null,
        orderByColumn: null,
        isAsc: null,
        filterTaskStatus: [],
      },
    };
  },

  created() {
    this.getList();
    // 获取任务状态字典
    this.getDicts("GS_TASK_STATUS").then((response) => {
      this.taskStatusOptions = response.data;

      response.data.forEach((item) => {
        this.optionsStatus.push({
          value: item.dictValue,
          label: item.dictLabel,
        });
      });
    });

    // 获取考核类型字典
    this.getDicts("gs_assessment_type").then((response) => {
      this.assessmentTypeOptions = response.data;
      response.data.forEach((item) => {
        this.optionsCheck.push({
          value: item.dictValue,
          label: item.dictLabel,
        });
      });
    });
    // 获取权重系数字典
    this.getDicts("gs_weight_coefficient").then((response) => {
      this.weightCoefficientOptions = response.data;
    });
    // 获取创新系数字典
    this.getDicts("gs_active_innovation_coefficient").then((response) => {
      this.activeInnovationCoefficientOptions = response.data;
    });
  },

  methods: {
    defaultJsonExport,
    /** 查询GS任务信息列表 */
    getList() {
      this.loading = true;
      listTaskManager(this.queryParams).then((response) => {
        this.taskManagerList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 点击排序箭头调用
    sortChange(data) {
      const { column, prop, order } = data;
      if (order === null) {
        return;
      }

      this.queryParams.isAsc = order === "ascending" ? "asc" : "desc";
      // 需要指定一下是那张表
      this.queryParams.orderByColumn = `t.${prop}`;

      this.getList();
    },
    filterStatus(value, row) {
      return true;
    },
 filterChangeInit(filter) {
 
   console.log(filter)
   if (filter.taskStatus) {
     if(filter.taskStatus.length == 1){
       if(filter.taskStatus[0] == 1){
         filter.taskStatus= [1,2];
       }
     }else{
         filter.taskStatus= [1,2,3];
     }
 
     this.queryParams.filterTaskStatus = filter.taskStatus;
     this.getList();
   }
 },
    // 任务状态字典翻译
    taskStatusFormat(row, column) {
      if (row.taskStatus !== "2") {
        return this.underwayStatusList[0].type;
      }

      for (const underwayStatus of this.underwayStatusList) {
        if (underwayStatus.value === row.underwayStatus) {
          return underwayStatus.type;
        }
      }
    },
    // 考核类型字典翻译
    assessmentTypeFormat(row, column) {
      return this.selectDictLabel(
        this.assessmentTypeOptions,
        row.assessmentType
      );
    },
    // 权重系数字典翻译
    weightCoefficientFormat(row, column) {
      return this.selectDictLabel(
        this.weightCoefficientOptions,
        row.weightCoefficient
      );
    },
    // 创新系数字典翻译
    activeInnovationCoefficientFormat(row, cloumn) {
      return this.selectDictLabel(
        this.activeInnovationCoefficientOptions,
        row.activeInnovationCoefficient
      );
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      console.log(this.queryParams.endRange);
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.taskStatus = "";
      this.queryParams.assessmentType = null;
      this.checkValue = "";
      this.statusValue = "";
      this.yearValue = "";
      this.monthValue = "";
      this.taskStatus = "";
      this.queryParams.assessmentType = "";
      this.queryParams.taskName = "";
      this.queryParams.assessmentMonth = "";
      this.queryParams.assessmentYear = "";
      this.queryParams.responsibilityLabel = "";
      this.queryParams.acceptanceByLabel = "";
      this.queryParams.orderByColumn = null;
      this.queryParams.isAsc = null;
      this.queryParams.filterTaskStatus = [];

      this.resetForm("queryForm");
      // 取消排序选中效果
      this.$refs["tableList"].clearSort();
      this.$refs["tableList"].clearFilter();
      this.handleQuery();
    },
    // 单选框值改变时触发
    queryChangeByTaskStatus(val) {
      if (val === "") {
        this.queryParams.assessmentType = null;
      }
      console.log(val);
      this.queryParams.taskStatus = val;
      this.handleQuery();
    },

    // 考核类型检索
    queryChangeByAssessmentType(val) {
      this.queryParams.assessmentType = val;
      this.handleQuery();
    },

    // 获取月份检索
    queryChangeByTaskMonth(value) {
      this.queryParams.assessmentMonth = value;
    },

    // 获取月份检索
    queryChangeByTaskYear(value) {
      this.queryParams.assessmentYear = value;
    },

    // 点击全部按钮时触发
    // allClick() {
    //   this.queryParams.assessmentType = null;
    // },
    //唯一值，一般都未id
    getRowKeys(row) {
      return row.userId;
    },
    /** 查看详情操作 */
    handleInfo(row) {
      const taskId = row.taskId || this.ids;
      getTaskManager(taskId).then((response) => {
        this.taskInfoDetails = response.data;
        this.infoDialogOpen = true;
        this.title = "任务详细信息";

        this.milestoneVoList = this.taskInfoDetails.milestoneVoList;
        this.acceptanceVoList = this.taskInfoDetails.acceptanceVoList;
        this.acceptanceListStr = this.taskInfoDetails.acceptanceVoList
          .map((a) => a.acceptanceByLabel)
          .join(" / ");
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.taskId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    // 单选选中数据
    handleCurrentChange(val) {
      if (this.selectAttribution === "acceptanceBy") {
        this.form.acceptanceBy = val.userName;
      } else {
        this.form.responsibilityBy = val.userName;
      }
      this.selectOpen = false;
    },
    // 某一行被点击时触发
    rowClick(row, column, event) {
      if (column.label === undefined) {
        return;
      }
      if (column.label === "操作") {
        return;
      }
      this.$refs.tableList.toggleRowSelection(row);
    },

    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      queryParams.exportName = "任务总览";
      queryParams.taskIds =  this.ids;
      this.$confirm("是否确认导出指定GS任务信息数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportTaskManager(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.info_title {
  font-size: 1.3em;
  margin-top: 12px;
}

// 添加element样式
.el-row .el-col .el-form .el-form-item {
  padding-left: 2vw;
}

// 检索那妞容器
.search_btn {
  display: flex;
  flex-wrap: wrap;
  width: 3%;
}

// 检索按钮样式
.font_style {
  width: 70px;
  height: 30px;
  color: #fff;
  background: #368afc;
  border-radius: 5px;
  text-align: center;
  line-height: 30px;
  font-size: 14px;
}
.task_item_header {
  border: 1px solid #cccccc80;
}
//
.task_item {
  padding: 10px 20px 5px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task_item .list_img {
  width: 25px;
  height: 25px;
}
.header_left {
  display: flex;
  align-items: center;
}
.img_text {
  margin-left: 10px;
  font-size: 15px;
}
.task_item_btn {
  display: flex;
  align-items: center;
}

.item_btn {
  margin-right: 20px;
}

.item {
  margin-top: 10px;
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
