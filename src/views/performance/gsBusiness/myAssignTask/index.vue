<template>
  <div class="app-container">
    <div class="bg-border-color-10" v-show="showSearch">
      <div class="flex-center">
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

        <el-form-item label="验收人" prop="acceptanceByLabel">
          <el-input
            v-model="queryParams.acceptanceByLabel"
            placeholder="请输入验收人"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <el-form-item label="责任人" prop="responsibilityLabel">
          <el-input
            v-model="queryParams.responsibilityLabel"
            placeholder="请输入责任人"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item
          v-show="this.activeName == 'first'"
          label="任务状态"
          prop="applyTaskStatue"
        >
          <el-select
            v-model="taskStatusVal"
            @change="queryChangeByTaskStatus"
            clearable
            size="small"
          >
            <el-option
              v-for="dict in taskStatusOptions"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="考核类型"
          prop="applyTaskStatue"
        >
          <el-select
            v-model="assessmentTypeVal"
            @change="queryChangeByAssessmentType"
            clearable
            size="small"
          >
            <el-option
              v-for="dict in assessmentTypeOptions"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item
          label="考核类型"
          prop="applyTaskStatue"
          v-show="this.activeName == 'second'"
        >
          <el-select
            v-model="assessmentTypeVal"
            @change="queryChangeByAssessmentType"
            clearable
            size="small"
          >
            <el-option
              v-for="dict in assessmentTypeOptions"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item label="开始日期" prop="startRange"  v-show="this.activeName == 'first'">
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
        <el-form-item label="结束日期" prop="endRange"  v-show="this.activeName == 'first'">
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
        <el-form-item
          label="周期状态"
          prop="status"
          v-show="this.activeName == 'second'"
        >
          <el-select
            v-model="statusVal"
            @change="queryChangeByCycleStatus"
            clearable
            size="small"
          >
            <el-option
              v-for="dict in statusOptions"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <el-form class="flex"> </el-form>

      <div class="mt10 flex-cc">
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="small" @click="resetQuery"
          >重置</el-button
        >
      </div>
    </div>

    <div class="bg-border-color-10 mb10">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="GS任务" name="first">
          <!-- <el-row :gutter="10" class="mb20"> -->
          <!-- <el-col :span="1.5">
              <el-radio-group
                v-model="queryParams.taskStatus"
                @change="queryChangeByTaskStatus"
                size="small"
              >
                <el-radio-button label="">全部</el-radio-button>
                <span v-for="(dict, index) in taskStatusOptions" :key="index">
                  <el-radio-button :label="dict.dictValue">{{
                    dict.dictLabel
                  }}</el-radio-button>
                </span>
              </el-radio-group>
            </el-col> -->
          <!-- <el-col :span="1.5">
              <el-radio-group
                v-model="queryParams.assessmentType"
                @change="queryChangeByAssessmentType"
                size="small"
              >
                <span
                  v-for="(dict, index) in assessmentTypeOptions"
                  :key="index"
                >
                  <el-radio-button :label="dict.dictValue">{{
                    dict.dictLabel
                  }}</el-radio-button>
                </span>
              </el-radio-group>
            </el-col> -->
          <!-- <el-col :span="1.5">
              <el-button
                type="primary"
                icon="el-icon-search"
                size="mini"
                @click="handleQuery"
                >搜索</el-button
              >
              <el-button icon="el-icon-refresh" size="small" @click="resetQuery"
                >重置</el-button
              >
            </el-col> -->
          <!-- </el-row> -->

          <div class="flex-align-between mb10 mr10">
            <div class="flex-align-center">
              <img
                src="@/assets/images/list.png"
                alt=""
                class="list-img ml0 mr10"
              />
              <p class="color-50 font-15 font-700">数据列表</p>
            </div>
            <el-row :gutter="10" class="mb8">
              <el-col :span="1.5">
                <el-button
                  type="primary"
                  plain
                  icon="el-icon-plus"
                  size="mini"
                  @click="handleAdd"
                  v-has="['business:taskManager:add']"
                  >新增任务
                </el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button
                  type="success"
                  plain
                  icon="el-icon-edit-outline"
                  size="mini"
                  :disabled="single"
                  @click="handleUpdate"
                  v-has="['business:taskManager:edit']"
                  >变更任务
                </el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button
                  type="info"
                  plain
                  icon="el-icon-refresh-left"
                  size="mini"
                  :disabled="multiple"
                  @click="handleUndo"
                  v-has="['business:taskManager:undo']"
                  >撤销任务
                </el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button
                  type="danger"
                  plain
                  icon="el-icon-delete"
                  size="mini"
                  :disabled="multiple"
                  @click="handleDelete"
                  v-has="['business:taskManager:remove']"
                  >删除任务
                </el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button
                  type="warning"
                  plain
                  icon="el-icon-download"
                  size="mini"
                  @click="handleExport"
                  v-has="['business:taskManager:export']"
                  >导出
                </el-button>
              </el-col>
              <right-toolbar
                :showSearch.sync="showSearch"
                @queryTable="getList"
              ></right-toolbar>
            </el-row>
          </div>

          <el-table
            ref="tableList"
            v-loading="loading"
            :data="taskManagerList"
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
              prop="startDate"
              sortable="custom"
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
              width="150%"
              sortable="custom"
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
              width="225%"
              fixed="right"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-info"
                  @click="handleInfo(scope.row)"
                  >详情
                </el-button>
                <el-button
                  type="text"
                  icon="el-icon-edit-outline"
                  size="mini"
                  @click="handleUpdate(scope.row)"
                  >修改
                </el-button>
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="handleDelete(scope.row)"
                  >删除
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
        </el-tab-pane>

        <el-tab-pane label="周期任务" name="second">
          <!-- <el-row :gutter="10" class="mb20"> -->
          <!-- <el-col :span="1.5">
              <el-radio-group
                v-model="queryParams.assessmentType"
                @change="queryChangeByAssessmentType"
                size="small"
              >
                <span
                  v-for="(dict, index) in assessmentTypeOptions"
                  :key="index"
                >
                  <el-radio-button :label="dict.dictValue">{{
                    dict.dictLabel
                  }}</el-radio-button>
                </span>
              </el-radio-group>
            </el-col> -->

          <!-- </el-row> -->

          <div>
            <div class="flex-align-between mb10">
              <div class="flex-align-center">
                <img
                  src="@/assets/images/list.png"
                  alt=""
                  class="list-img ml0 mr10"
                />
                <p class="color-50 font-15 font-700">数据列表</p>
              </div>
              <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                  <el-button
                    type="primary"
                    plain
                    icon="el-icon-plus"
                    size="mini"
                    @click="handleCycleAdd"
                    v-has="['business:taskManager:add']"
                    >新增周期任务
                  </el-button>
                </el-col>
                <el-col :span="1.5">
                  <el-button
                    type="success"
                    plain
                    icon="el-icon-edit-outline"
                    size="mini"
                    :disabled="single"
                    @click="handleUpdate"
                    v-has="['business:taskManager:edit']"
                    >修改周期任务
                  </el-button>
                </el-col>
                <el-col :span="1.5">
                  <el-button
                    type="danger"
                    plain
                    icon="el-icon-delete"
                    size="mini"
                    :disabled="multiple"
                    @click="handleDelete"
                    v-has="['business:taskManager:remove']"
                    >删除周期任务
                  </el-button>
                </el-col>
                <el-col :span="1.5">
                  <el-button
                    type="warning"
                    plain
                    icon="el-icon-download"
                    size="mini"
                    @click="handleExportCycle"
                    v-has="['business:taskManager:export']"
                    >导出
                  </el-button>
                </el-col>
                <right-toolbar
                  :showSearch.sync="showSearch"
                  @queryTable="getList"
                ></right-toolbar>
              </el-row>
            </div>
          </div>
          <el-table
            ref="tableList1"
            v-loading="loading"
            :data="cycleTaskManagerList"
            @row-click="rowClick"
             @sort-change="sortChange"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column
              label="编号"
              sortable="custom"
              align="center"
              width="100%"
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
              label="开始时间"
              width="150%"
              align="center"
              prop="startDate"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.gsCycleTask.startTime }} </span>
              </template>
            </el-table-column>
            <el-table-column
              label="结束时间"
              align="center"
              prop="endDate"
              width="150%"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.gsCycleTask.endTime }}</span>
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
              label="工号"
              align="center"
              width="125%"
              prop="jobNumber"
            >
            </el-table-column>

            <el-table-column
              label="部门"
              align="center"
              width="125%"
              prop="deptName"
            >
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
              label="下次执行日期"
               sortable="custom"
              align="center"
              prop="gsCycleTask.nextDate"
              width="150%"
            >
              <template slot-scope="scope">
                <span>{{
                  scope.row.gsCycleTask.nextDate | parseTime("{y}-{m}-{d}")
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="周期开始日期"
               sortable="custom"
              align="center"
              prop="gsCycleTask.startDate"
              width="150%"
            >
              <template slot-scope="scope">
                <span>{{
                  scope.row.gsCycleTask.startDate | parseTime("{y}-{m}-{d}")
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="周期结束日期"
               sortable="custom"
              align="center"
              prop="gsCycleTask.endDate"
              width="150%"
            >
              <template slot-scope="scope">
                <span>{{
                  scope.row.gsCycleTask.endDate | parseTime("{y}-{m}-{d}")
                }}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" align="center" fixed="right">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.gsCycleTask.status"
                  active-value="0"
                  inactive-value="1"
                  @change="handleStatusChange(scope.row)"
                ></el-switch>
              </template>
            </el-table-column>


            <el-table-column   label="剩余时间" align="center" fixed="right">
              <template slot-scope="scope">
                <el-progress  :percentage="scope.row.leftTimeData" :text-inside="true" :stroke-width="17" :color="customColorMethod"></el-progress>
              </template>
            </el-table-column>


            <el-table-column
              label="操作"
              align="center"
              width="125%"
              fixed="right"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  icon="el-icon-edit-outline"
                  size="mini"
                  @click="handleUpdate(scope.row)"
                  >修改
                </el-button>
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="handleDelete(scope.row)"
                  >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <pagination
            v-show="cycleTaskTotal > 0"
            :total="cycleTaskTotal"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
        /></el-tab-pane>
      </el-tabs>
    </div>

    <!-- 添加或修改GS任务信息对话框 -->
    <el-dialog
      :title="title"
      class="font-bold"
      top="20vh"
      :visible.sync="open"
      width="50%"
      :close-on-click-modal="false"
      @closed="closed"
      append-to-body
    >
      <div id="elDialog" class="bg-border-color">
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <el-row>
            <el-col :span="24">
              <el-form-item label="任务名称" prop="taskName">
                <el-input
                  v-model="form.taskName"
                  placeholder="请输入任务名称"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="任务内容">
                <editor
                  ref="editor"
                  v-model="form.taskContent"
                  @on-change="getEditor"
                  :min-height="192"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="责任人" prop="responsibilityBy">
                <el-input
                  :span="4"
                  placeholder="请选择责任人"
                  v-model="form.responsibilityLabel"
                  class="input-with-select"
                  :disabled="true"
                >
                  <el-button
                    :span="8"
                    slot="append"
                    icon="el-icon-search"
                    @click="selectSend()"
                  ></el-button>
                </el-input>
                <dispatch-users
                  :is-multiple="false"
                  :visible.sync="dispatchDialogOpen"
                  @on-chose="getUser"
                  :selected="form.responsibilityBy"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="考核类型" prop="assessmentType">
                <el-radio-group v-model="form.assessmentType" size="small">
                  <!-- 90 v-for 须带索引 -->
                  <span v-for="(dict, index) in assessmentTypeOptions" v-if="index > 0" :key="index">
                    <el-radio
                      :key="dict.value"
                      :label="dict.value"
                      border
                      style="margin-right: 20px"
                    >
                      {{ dict.label }}
                    </el-radio>
                  </span>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="考核年份" prop="assessmentYear">
                <el-date-picker
                  v-model="form.assessmentYear"
                  type="year"
                  value-format="yyyy"
                  placeholder="请选择考核年份"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="考核月份" prop="assessmentMonth">
                <el-date-picker
                  v-model="form.assessmentMonth"
                  type="month"
                  placeholder="请选择考核月份"
                  format="M月"
                  value-format="M"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="工时" prop="workTime">
            <el-input
              :placeholder="workTimePlace"
              v-model="form.workTime"
            ></el-input>
            <!-- <el-input :readonly="true" v-model="form.remarks" placeholder="请输入备注" /> -->
          </el-form-item>

          <el-row>
            <el-col :span="24">
              <el-form-item label="权重系数" prop="weightCoefficient">
                <el-radio-group v-model="form.weightCoefficient" size="small">
                  <span
                    v-for="(dict, index) in weightCoefficientOptions"
                    :key="index"
                  >
                    <el-radio
                      :key="dict.dictValue"
                      :label="dict.dictValue"
                      border
                      style="margin-right: 20px"
                    >
                      {{ dict.dictLabel }}
                    </el-radio>
                  </span>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="创新系数" prop="activeInnovationCoefficient">
                <el-radio-group
                  v-model="form.activeInnovationCoefficient"
                  size="small"
                >
                  <span
                    v-for="(dict, index) in activeInnovationCoefficientOptions"
                    :key="index"
                  >
                    <el-radio
                      :key="dict.dictValue"
                      :label="dict.dictValue"
                      border
                      style="margin-right: 20px"
                    >
                      {{ dict.dictLabel }}
                    </el-radio>
                  </span>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="this.dialogType != 'cycle' && form.isCycleTask != '2'">
            <el-col :span="24">
              <el-form-item label="开始日期" prop="startDate">
                <el-date-picker
                  v-model="form.startDate"
                  size="small"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm"
                  format="yyyy-MM-dd HH:mm"
                  placeholder="选择任务开始日期时间"
                  default-time="12:00:00"
                  :picker-options="pickerStartDate"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="结束日期" prop="endDate">
                <el-date-picker
                  v-model="form.endDate"
                  size="small"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm"
                  format="yyyy-MM-dd HH:mm"
                  placeholder="选择任务结束日期时间"
                  default-time="12:00:00"
                  :picker-options="pickerStartDate"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row
            v-if="this.dialogType == 'cycle' || this.form.isCycleTask == '2'"
          >
            <el-col :span="12">
              <el-form-item label="周期开始" prop="gsCycleTask.startDate">
                <el-date-picker
                  clearable
                  size="small"
                  v-model="form.gsCycleTask.startDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择周期开始日期"
                  :picker-options="pickerStartDate"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="周期结束" prop="gsCycleTask.endDate">
                <el-date-picker
                  clearable
                  size="small"
                  v-model="form.gsCycleTask.endDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择周期结束日期"
                  :picker-options="pickerStartDate"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="开始时间" prop="gsCycleTask.startTime">
                <el-time-picker
                  v-model="form.gsCycleTask.startTime"
                  format="HH:mm"
                  value-format="HH:mm"
                  placeholder="开始时间"
                >
                </el-time-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结束时间" prop="gsCycleTask.endTime">
                <el-time-picker
                  v-model="form.gsCycleTask.endTime"
                  format="HH:mm"
                  value-format="HH:mm"
                  placeholder="结束时间"
                >
                </el-time-picker>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <cron
                :cronExpression="form.gsCycleTask.cronExpression"
                :cycleType="form.gsCycleTask.cycleType"
                @updateCycleInfo="updateCycleInfo"
              />
            </el-col>
          </el-row>
          <el-row style="margin-top: 20px">
            <el-col :span="24">
              <div class="bg-border-color">
                <div class="flex-center mb20">
                  <div class="mark-logo"></div>
                  <div class="ml15">附件</div>
                </div>
                <fileUpload
                  ref="fileUpload"
                  :file-str.sync="form.fileIdStr"
                  :echo-file-str="form.fileIdStr || ''"
                />
              </div>
            </el-col>
          </el-row>
        </el-form>

        <add-or-edit-milestone
          ref="addOrEditMilestone"
          :milestone-array="form.milestoneVoList"
          :milestone-vo-array.sync="form.milestoneList"
          :start-and-end-date="{
            startDate: form.startDate,
            endDate: form.endDate,
          }"
        />
        <add-or-edit-acceptance
          ref="addOrEditAcceptance"
          :acceptance-array="form.acceptanceVoList"
          :open="open"
          :acceptance-vo-array.sync="form.acceptanceList"
        />
      </div>

      <div slot="footer" class="dialog-footer popup-change-btn">
        <el-button
          v-if="
            form.taskStatus === '1' ||
            dialogType === 'add' ||
            dialogType === 'cycle'
          "
          type="success"
          @click="taskRelease"
          >任务下达
        </el-button>
        <el-button
          v-if="
            form.taskStatus === '1' ||
            (dialogType === 'add' && form.isCycleTask != '2')
          "
          type="primary"
          @click="saveDraft"
          >存为草稿
        </el-button>
        <el-button
          v-if="dialogType === 'edit' && form.taskStatus === '2'"
          type="warning"
          @click="modifyData"
          >确认变更
        </el-button>

        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 任务详情Dialog   start -->
    <el-dialog
      :title="title"
      :visible.sync="infoDialogOpen"
      :close-on-click-modal="false"
      width="50%"
      append-to-body
    >
      <el-card class="box-card font-normal mb10">
        <el-row :gutter="24" class="mb20">
          <el-col :span="24">
            <div class="flex-center">
              <span class="mark-logo"></span>
              <span style="font-size: 18px" class="font-700 ml15"
                >任务详情：</span
              >
            </div>
          </el-col>
        </el-row>
        <div class="font-color">
          <el-row :gutter="24" class="mb20">
            <div>
              <el-col :span="4">
                <b>任务名称：</b>
              </el-col>
              <el-col :span="8">
                {{ taskInfoDetails.taskName }}
              </el-col>
            </div>
            <div>
              <el-col :span="4">
                <b>权重系统：</b>
              </el-col>
              <el-col :span="8">
                {{
                  weightCoefficientFormat(taskInfoDetails)
                    ? weightCoefficientFormat(taskInfoDetails)
                    : "暂无"
                }}
              </el-col>
            </div>
          </el-row>

          <el-row :gutter="24" class="mb20">
            <el-col :span="4">
              <b>责任人：</b>
            </el-col>
            <el-col :span="8">
              {{
                taskInfoDetails.responsibilityLabel
                  ? taskInfoDetails.responsibilityLabel
                  : "暂无"
              }}
            </el-col>

            <el-col :span="4">
              <b>主动创新系数：</b>
            </el-col>
            <el-col :span="6">
              {{
                activeInnovationCoefficientFormat(taskInfoDetails)
                  ? activeInnovationCoefficientFormat(taskInfoDetails)
                  : "暂无"
              }}
            </el-col>
          </el-row>
          <el-row :gutter="24" class="mb20">
            <el-col :span="4">
              <b>验收人：</b>
            </el-col>
            <el-col :span="8">
              {{ acceptanceListStr ? acceptanceListStr : "暂无" }}
            </el-col>

            <el-col :span="4">
              <b>任务评分：</b>
            </el-col>
            <el-col :span="8">
              {{
                taskInfoDetails.taskScore ? taskInfoDetails.taskScore : "暂无"
              }}
            </el-col>
          </el-row>
          <el-row
            v-if="taskInfoDetails.taskStatus !== '1'"
            :gutter="24"
            class="mb20"
          >
            <el-col :span="4">
              <b>下达时间：</b>
            </el-col>
            <el-col :span="8">
              {{
                taskInfoDetails.taskReleaseTime
                  ? parseTime(
                      taskInfoDetails.taskReleaseTime,
                      "{y}年{m}月{d}日 {h}:{i}:{s}"
                    )
                  : "暂无"
              }}
            </el-col>

            <el-col :span="4">
              <b>任务状态：</b>
            </el-col>
            <el-col :span="8">
              <el-badge
                :hidden="taskInfoDetails.underwayStatus !== 3"
                value="逾期"
              >
                <el-tag
                  :type="taskStatusFormat(taskInfoDetails)"
                  size="small"
                  >{{ taskInfoDetails.taskStatusLabel }}</el-tag
                >
              </el-badge>
            </el-col>
          </el-row>
          <el-row
            v-if="taskInfoDetails.taskStatus >= '3'"
            :gutter="24"
            class="mb20"
          >
            <el-col :span="4">
              <b>实际完成时间：</b>
            </el-col>
            <el-col :span="20">
              {{
                taskInfoDetails.actualEndTime
                  ? parseTime(
                      taskInfoDetails.actualEndTime,
                      "{y}年{m}月{d}日 {h}:{i}:{s}"
                    )
                  : "暂无"
              }}
            </el-col>
          </el-row>

          <el-row :gutter="24" class="mb20">
            <el-col :span="4">
              <b>考核类型：</b>
            </el-col>
            <el-col :span="8">
              <span v-text="assessmentTypeFormat(taskInfoDetails)"></span>
            </el-col>
            <el-col :span="4">
              <b>任务来源：</b>
            </el-col>
            <el-col :span="8">
              {{ taskInfoDetails.taskSourceLabel }}
            </el-col>
          </el-row>
          <el-row :gutter="24" class="mb20">
            <el-col :span="4">
              <b>考核月份：</b>
            </el-col>
            <el-col :span="8">
              {{ taskInfoDetails.assessmentYear }}年{{
                taskInfoDetails.assessmentMonth
              }}月
            </el-col>
            <el-col :span="4">
              <b>创建人：</b>
            </el-col>
            <el-col :span="8">
              {{ taskInfoDetails.createByLabel }}
            </el-col>
          </el-row>

          <el-row :gutter="24" class="mb20">
            <el-col :span="4">
              <b>计划时间：</b>
            </el-col>
            <el-col :span="20">
              {{
                taskInfoDetails.startDate | parseTime("{y}年{m}月{d}日 {h}:{i}")
              }}
              至
              {{
                taskInfoDetails.endDate | parseTime("{y}年{m}月{d}日 {h}:{i}")
              }}
            </el-col>
          </el-row>
        </div>
      </el-card>

      <!-- 任务内容 -->
      <el-card class="box-card mb10">
        <div class="flex-center">
          <span class="mark-logo"></span>
          <div class="ml15 font-700">任务内容</div>
        </div>
        <div class="ql-snow">
          <div class="ql-editor">
            <div class="ql-height" v-html="taskInfoDetails.taskContent">
              {{ taskInfoDetails.taskContent }}
            </div>
          </div>
        </div>
      </el-card>

      <!-- 过程里程碑 -->
      <el-card class="box-card mb10">
        <el-row :gutter="24" class="mb20">
          <el-col :span="24">
            <div class="flex-center">
              <span class="mark-logo"></span>
              <span style="font-size: 18px" class="font-700 ml15"
                >过程里程碑</span
              >
            </div>
          </el-col>
        </el-row>
        <div class="block">
          <el-row :gutter="20" style="text-align: center">
            <el-col :span="24">
              <h4 v-if="milestoneVoList.length === 0">无里程牌</h4>
            </el-col>
          </el-row>
          <div v-if="milestoneVoList.length > 0">
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
                    <div class="flex-center">
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
                    </div>
                  </el-row>
                  <el-row :gutter="24" class="mb10">
                    <div class="flex-center">
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
                    </div>
                  </el-row>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>
      </el-card>

      <!-- 任务附件 -->
      <el-card class="box-card mb10">
        <el-row :gutter="24" class="mb20">
          <el-col :span="24">
            <div class="flex-center">
              <span class="mark-logo"></span>
              <span style="font-size: 18px" class="font-700 ml15"
                >附件任务</span
              >
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="text-align: center">
          <el-col :span="24">
            <h4 v-if="!taskInfoDetails.fileIdStr">无附件</h4>
          </el-col>
        </el-row>
        <file-list :echo-file-str="taskInfoDetails.fileIdStr" />
      </el-card>

      <!-- 总结报告 -->
      <el-card v-if="taskInfoDetails.taskStatus === '4'" class="box-card mb10">
        <div class="flex-center mb20">
          <span class="mark-logo"></span>
          <div style="font-size: 18px" class="ml15 font-700">总结报告</div>
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
        <el-row :gutter="24" class="mb20">
          <el-col :span="24">
            <span style="font-size: 18px">总结附件</span>
          </el-col>
        </el-row>
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
        <el-row :gutter="24" class="mb20">
          <el-col :span="24">
            <span style="font-size: 18px">任务评价</span>
          </el-col>
        </el-row>
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
                  <el-row :gutter="24" class="mb20 flex-center">
                    <el-col :span="4">
                      <b>评价内容</b>
                    </el-col>
                    <el-col :span="20">
                      <h5 v-if="!acceptance.taskContent">暂无评价</h5>
                      <div v-if="acceptance.taskContent" class="ql-snow">
                        <div v-html="acceptance.taskContent">
                          {{ acceptance.taskContent }}
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
          <el-button type="primary" @click="copyTask">复制任务</el-button>
          <el-button type="warning" @click="modifyTask">变更任务</el-button>
          <el-button type="danger" @click="draftTask">撤销任务</el-button>
          <el-button type="" @click="infoDialogOpen = false">关闭</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog
      title="选择Cron时间"
      :visible.sync="cronVisible"
      :width="'50%'"
      @closed="cronVisible = false"
    >
      <cron v-model="form.gsCycleTask.cronExpression" v-if="cronVisible" />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cronVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getTaskManager,
  delTaskManager,
  updateCycleTaskStatus,
  addCycleTaskManager,
  editCycleTaskManager,
  exportTaskManager,
  undoTaskManager,
  exportCycleTaskManager,
  myCycleListTaskManager,
  myAssignListTaskManager,
  addDraftTaskManager,
  alterationTaskManager,
  assignTaskManager,
  copyTaskManager,
} from "@/api/performance/taskManager";
import FileUpload from "@/components/performance/FileUpload";
import DispatchUser from "@/components/performance/DispatchUser";
import DispatchUsers from "@/components/performance/DispatchUsers";
import FileList from "@/components/performance/fileList";
import AddOrEditMilestone from "./components/addOrEditMilestone";
import Cron from "@/components/performance/CycleTaskCron_v2/index";
import { parseTime, formatFileSize, loadingFun, selectDictLabel } from "@/utils/performance/ruoyi";
import Editor from "@/components/performance/Editor";
// 里程碑API
import { mapGetters } from "vuex";
import AddOrEditAcceptance from "./components/addOrEditAcceptance";
import { ajaxGetDictItems } from '@/api/api'

export default {

  name: "TaskManager",
  components: {
    AddOrEditAcceptance,
    FileUpload,
    DispatchUser,
    DispatchUsers,
    Editor,
    AddOrEditMilestone,
    FileList,
    Cron,
  },
  filters: {
    parseTime,
    formatFileSize,
  },
  mounted() {
    // this.leftTimeRest();
  },
  computed: {
    ...mapGetters(["name"]),
      workTimePlace(){
        return (Date.parse(this.form.endDate) - Date.parse(this.form.startDate))/1000/60/60 ;
      },

    // leftTimeRest: function () {
    //      this.leftTime=(this.cycleTaskManagerList.endTime-new Date())/(this.cycleTaskManagerList.endTime-this.cycleTaskManagerList.startDate)
    //       return leftTime
    //     }

  },
  data() {
    return {

      leftTimeData: null,
      taskContent: "",
      summaryContent: "",
      activeName: "first",
      //周期状态字典
      statusOptions: [{ label: "全部类型", value: "" }],
      // 任务详情
      taskInfoDetails: [],
      // 里程碑列表
      milestoneVoList: [],
      // 验收人列表
      acceptanceVoList: [],
      milestoneInfo: [],
      //cron表达式弹窗
      cronVisible: false,
      // 详情弹窗
      infoDialogOpen: false,
      // 责任人弹窗
      dispatchDialogOpen: false,
      // 对话框状态 (add OR edit)
      dialogType: "",
      // 成功消息
      successMessage: "",
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
      // 周期任务总条数
      cycleTaskTotal: 0,
      // GS任务信息表格数据
      taskManagerList: [],
      // GS周期任务表格数据
      cycleTaskManagerList: [],
      acceptanceListStr: "",
      // 弹出层标题
      title: "选择派遣人",
      // 是否显示弹出层
      open: false,
      // 任务状态字典
      taskStatusVal: "",
      taskStatusOptions: [{ label: "全部状态", value: "" }],

      // 列表数据，考核类型
      assessmentTypeRow: [],
      statusVal:"",
      // 考核类型字典
      assessmentTypeVal: "",
      assessmentTypeOptions: [{ label: "全部类型", value: "" }],
      // 权重系数字典
      weightCoefficientOptions: [],
      // 周期任务周期字典
      cycleTaskLoopCycleOptions: [],
      // 是否周期字典
      isCycleTaskOptions: [],
      // 创新系数字典
      activeInnovationCoefficientOptions: [],
      underwayStatusList: [
        { value: 0, type: "info" },
        { value: 1, type: "success" },
        { value: 2, type: "warning" },
        { value: 3, type: "danger" },
      ],
      // 文件列表
      files: [],
      // 总结附件
      summaryFiles: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        taskId: null,
        taskName: null,
        taskContent: null,
        taskStatus: "",
        startRange: [],
        endRange: [],
        startDate: null,
        endDate: null,
        status:null,
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
      // 用户查询参数
      queryUserParams: {
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
        phonenumber: undefined,
        status: undefined,
        deptId: undefined,
      },
      // 表单参数
      form: { gsCycleTask: {} },
      // 验收人表单
      acceptanceFrom: {
        acceptanceBy: null,
        scoringWeight: 0,
        userName: null,
      },
      // 表单校验
      rules: {
        taskName: [
          { required: true, message: "任务名称不能为空", trigger: "blur" },
        ],
        taskContent: [
          { required: true, message: "任务内容不能为空", trigger: "blur" },
        ],
        startDate: [
          { required: true, message: "任务开始日期不能为空", trigger: "blur" },
        ],
        endDate: [
          { required: true, message: "任务结束日期不能为空", trigger: "blur" },
        ],

        assessmentType: [
          { required: true, message: "考核类型不能为空", trigger: "change" },
        ],
        assessmentYear: [
          { required: true, message: "考核年份不能为空", trigger: "blur" },
        ],
        assessmentMonth: [
          { required: true, message: "考核月份不能为空", trigger: "blur" },
        ],
        isCycleTask: [
          { required: true, message: "是否周期不能为空", trigger: "blur" },
        ],
        "gsCycleTask.cronExpression": [
          { required: true, message: "周期不能为空", trigger: "blur" },
        ],
        "gsCycleTask.startDate": [
          { required: true, message: "循环至日期不能为空", trigger: "blur" },
        ],
        "gsCycleTask.endDate": [
          { required: true, message: "循环结束日期不能为空", trigger: "blur" },
        ],
        "gsCycleTask.startTime": [
          { required: true, message: "开始时间不能为空", trigger: "blur" },
        ],
        "gsCycleTask.endTime": [
          { required: true, message: "结束时间不能为空", trigger: "blur" },
        ],
        weightCoefficient: [
          { required: true, message: "权重系数不能为空", trigger: "blur" },
        ],
        activeInnovationCoefficient: [
          { required: true, message: "创新系数不能为空", trigger: "blur" },
        ],
      },
      pickerStartDate: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
    };
  },
  created() {
    this.getList();
    // 获取任务状态字典
    ajaxGetDictItems("GS_TASK_STATUS", null).then((response) => {
      response.data?.forEach((item) => {
        this.taskStatusOptions.push({
          label: item.dictLabel,
          value: item.dictValue,
        });
      });
    });
  
    // 获取考核状态字典
    ajaxGetDictItems("gs_assessment_type", null).then((response) => {

      response.data?.forEach((item) => {
        this.assessmentTypeOptions.push({
          label: item.dictLabel,
          value: item.dictValue,
        });
      });
      this.assessmentTypeRow = response.data;
    });
    // 获取权重系数字典
    ajaxGetDictItems("gs_weight_coefficient", null).then((response) => {
      this.weightCoefficientOptions = response.data;
    });
    // 获取创新系数字典
    ajaxGetDictItems("gs_active_innovation_coefficient").then((response) => {
      this.activeInnovationCoefficientOptions = response.data;
    });
    // 获取周期字典
    ajaxGetDictItems("CYCLE_TASK_LOOP_CYCLE").then((response) => {
      this.cycleTaskLoopCycleOptions = response.data;
    });
    // 获取周期字典
    ajaxGetDictItems("IS_CYCLE_TASK").then((response) => {
      this.isCycleTaskOptions = response.data;
    });
    ajaxGetDictItems("cylcle_status").then((response) => {
      response.data?.forEach((item) => {
        this.statusOptions.push({
          label: item.dictLabel,
          value: item.dictValue,
        });
      });
    });

  },
  methods: {
    leftTimeRest(row){
      if (row.taskId === 1141) {
         return '大佬'
      }

    },

    customColorMethod(leftTimeData) {
            if (leftTimeData < 30) {
              return '#f56c6c';
            } else if (leftTimeData < 70) {
              return '#e6a23c';
            } else {
              return '#67c23a';
            }
          },
    /** 查询GS任务信息列表 */
    getList() {
      this.loading = true;


      myAssignListTaskManager(this.queryParams).then((response) => {
        this.taskManagerList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      myCycleListTaskManager(this.queryParams).then((response) => {
        this.cycleTaskManagerList = response.rows;
        let data = response.rows

        let that = this
        data.forEach(item =>{


          let today =new Date().getFullYear() +"-"+ (new Date().getMonth()+1) +"-"+ new Date().getDate();


          let startTimeData = item.gsCycleTask.startTime
          let endTimeData = item.gsCycleTask.endTime

          let allTime = Date.parse(today+" "+endTimeData)-Date.parse(today+" "+startTimeData)
          let restTime = Date.parse(today+" "+endTimeData)-Date.parse(new Date())

          let leftTime = Math.floor(restTime/allTime*100)

          item.leftTimeData = leftTime

        })
        this.cycleTaskTotal = response.total;
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
      if(prop.indexOf("gsCycleTask") != -1){
        this.queryParams.orderByColumn = `t2.${prop.split(".")[1]}`;
      }else{
        this.queryParams.orderByColumn = `t.${prop}`;
      }


      this.getList();
    },
    filterStatus(value, row) {
      return true;
    },
    filterChangeInit(filter) {
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
      if(row && row.length > 0){
        return selectDictLabel(this.assessmentTypeRow, row.assessmentType);
      }
    },
    // 权重系数字典翻译
    weightCoefficientFormat(row, column) {
      if(row && row.length > 0){
        return selectDictLabel(
          this.weightCoefficientOptions,
          row.weightCoefficient
        );
      }

    },
    // 创新系数字典翻译
    activeInnovationCoefficientFormat(row, cloumn) {
      if(row && row.length > 0){
        return selectDictLabel(
          this.activeInnovationCoefficientOptions,
          row.activeInnovationCoefficient
        );
      }
    },
    // 选择责任人
    selectSend() {
      this.dispatchDialogOpen = true;
    },
    getUser(data) {
      this.form.responsibilityLabel = data
        .map((item) => item.nickName)
        .join(" / ");
      this.form.responsibilityBy = data.map((item) => item.userName).join(",");
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 里程碑取消按钮
    cancelByMilestone() {
      this.milestoneDialogOpen = false;
    },
    // 验收人取消按钮
    cancelByAcceptance() {
      this.acceptanceOpen = false;
    },
    // 表单重置
    reset() {
      this.form = {
        taskId: null,
        taskName: null,
        taskContent: null,
        taskStatus: "0",
        startDate: null,
        endDate: null,
        assessmentType: "1",
        assessmentYear: new Date().getFullYear().toString(),
        assessmentMonth: (new Date().getMonth() + 1).toString(),
        workTime:null,
        weightCoefficient: "1",
        activeInnovationCoefficient: "1",
        isCycleTask: null,
        gsCycleTask: {
          cronExpression: null,
          startDate: new Date(),
          endDate: null,
          cycleType: "1",
          startTime: "08:30",
          endTime: "18:30",
        },

        acceptanceBy: null,
        responsibilityBy: null,
        fileIdStr: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        actualEndTime: null,
        summaryContent: null,
        summaryFileIdStr: null,
        acceptanceList: [],
        milestoneList: [],
      };
      this.taskInfoDetails = [];
      this.milestoneInfo = [];
      this.taskContent = "";

      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.assessmentTypeVal = "";
      this.taskStatusVal = "";
      this.queryParams.taskStatus = "";
      this.queryParams.assessmentType = null;
      this.queryParams.orderByColumn = null;
      this.queryParams.isAsc = null;
      this.queryParams.filterTaskStatus = [];

      this.resetForm("queryForm");
      // 取消排序选中效果
      this.$refs["tableList"].clearSort();
      this.$refs["tableList"].clearFilter();
      this.$refs["tableList1"].clearSort();
      this.$refs["tableList1"].clearFilter();
      this.handleQuery();
    },
    // 单选框值改变时触发
    queryChangeByTaskStatus(val) {
      if (val === "") {
        this.queryParams.assessmentType = null;
      }
      this.queryParams.taskStatus = val;
      this.handleQuery();
    },
// 单选框值改变时触发
    queryChangeByCycleStatus(val) {
      if (val === "") {
        this.queryParams.status = null;
      }
      this.queryParams.status = val;
      this.handleQuery();
    },
    queryChangeByAssessmentType(val) {
      this.queryParams.assessmentType = val;
      this.handleQuery();
    },
    // 点击全部按钮时触发
    allClick() {
      this.queryParams.assessmentType = null;
    },
    //唯一值，一般都未id
    getRowKeys(row) {
      return row.userId;
    },
    /** 查看详情操作 */
    handleInfo(row) {
      this.reset();
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
    // 获取富文本的内容（不好含HTML标签）
    getEditor(editor) {
      this.form.taskContentOfText = editor.text.trim();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      let nowDate = new Date();
      this.form.startDate =
        nowDate.getFullYear() +
        "-" +
        (nowDate.getMonth() + 1) +
        "-" +
        nowDate.getDate() +
        " " +
        "08:30:00";
      this.form.endDate =
        nowDate.getFullYear() +
        "-" +
        (nowDate.getMonth() + 1) +
        "-" +
        nowDate.getDate() +
        " " +
        "18:30";
      this.open = true;
      this.title = "添加GS任务信息";
      this.dialogType = "add";
    },
    /** 新增周期按钮操作 */
    handleCycleAdd() {
      this.reset();
      let nowDate = new Date();
      let endDate = nowDate.getFullYear() + "-" + 12 + "-" + 31;
      this.form.startDate =
        nowDate.getFullYear() +
        "-" +
        (nowDate.getMonth() + 1) +
        "-" +
        nowDate.getDate() +
        " " +
        "00:00:01";
      this.form.endDate =
        nowDate.getFullYear() +
        "-" +
        (nowDate.getMonth() + 1) +
        "-" +
        nowDate.getDate() +
        " " +
        "23:59";
      this.form.gsCycleTask.endDate = endDate;
      this.open = true;
      this.title = "添加GS周期任务信息";
      this.dialogType = "cycle";
    },
    updateCycleInfo(info) {
      this.form.gsCycleTask.cronExpression = info.cronExpression;
      this.form.gsCycleTask.cycleType = info.cycleType;
      this.form.gsCycleTask.cronExpressionLabel = info.cronExpressionLabel;
    },
    // 复制任务
    handleCopy() {
      this.open = true;
      this.title = "复制GS任务信息";
      this.dialogType = "copy";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const taskId = row.taskId || this.ids;
      getTaskManager(taskId).then((response) => {
        this.form = response.data;
        this.title = "修改GS任务信息";
        this.dialogType = "edit";
        this.open = true;
      });
    },
    // 存草稿
    saveDraft() {
      this.$nextTick(() => {
        this.$refs["form"].validate((valid) => {
          if (!valid) {
            return;
          }
          // 里程碑和验收人数据不为空则需要进行校验
          if (
            this.form.milestoneList !== undefined &&
            this.form.milestoneList.length !== 0
          ) {
            let validatedByMilestone = this.$refs.addOrEditMilestone.dataValidation();
            if (!validatedByMilestone) {
              return;
            }
          }
          if (
            this.form.acceptanceList !== undefined &&
            this.form.acceptanceList.length !== 0
          ) {
            let validatedByAcceptance = this.$refs.addOrEditAcceptance.dataValidation();
            if (!validatedByAcceptance) {
              return;
            }
          }

          this.$loading.show();
          addDraftTaskManager(this.form)
            .then((response) => {
              this.msgSuccessFun("草稿保存成功");
              this.$loading.hide();
              this.open = false;
              this.getList();
            })
            .catch(() => {
              this.$loading.hide();
            });
        });
      });
    },

    checkWorkTime(){
      if(this.form.workTime === null){
         return this.workTimePlace
      }
      else{
          return this.form.workTime
      }
    },

    // 任务下达
    taskRelease() {
      this.form.workTime = this.checkWorkTime();
      this.successMessage = "任务下达成功";
      this.$nextTick(() => {
        this.$refs["form"].validate((valid) => {
          if (!valid || !this.dataValidation()) {
            return;
          }

          this.$loading.show();
          if (this.dialogType == "cycle") {
            addCycleTaskManager(this.form)
              .then((response) => {
                this.msgSuccess(this.successMessage);
                this.$loading.hide();
                this.open = false;
                this.getList();
              })
              .catch(() => {
                this.$loading.hide();
              });
          } else {
            assignTaskManager(this.form)
              .then((response) => {
                this.msgSuccess(this.successMessage);
                this.$loading.hide();
                this.open = false;
                this.getList();
              })
              .catch(() => {
                this.$loading.hide();
              });
          }
        });
      });
    },
    // 变更数据
    modifyData() {
      this.successMessage = "任务变更成功";
      this.$nextTick(() => {
        this.$refs["form"].validate((valid) => {
          // 表单校验
          if (!valid || !this.dataValidation()) {
            return;
          }
          this.$loading.show(); // 显示loading
          if (this.form.isCycleTask == "1") {
            alterationTaskManager(this.form)
              .then((response) => {
                this.msgSuccess(this.successMessage);
                this.$loading.hide(); // 隐藏loading
                this.open = false;
                this.getList();
              })
              .catch(() => {
                this.$loading.hide(); // 隐藏loading
              });
          } else {
            editCycleTaskManager(this.form)
              .then((response) => {
                this.msgSuccess(this.successMessage);
                this.$loading.hide(); // 隐藏loading
                this.open = false;
                this.getList();
              })
              .catch(() => {
                this.$loading.hide(); // 隐藏loading
              });
          }
        });
      });
    },
    dataValidation() {
      if (
        this.form.acceptanceList === undefined ||
        this.form.acceptanceList.length === 0
      ) {
        this.$message.error("请选择验收人");
        return false;
      }
      if (
        this.form.milestoneList !== undefined &&
        this.form.milestoneList.length > 0
      ) {
        let validatedByMilestone = this.$refs.addOrEditMilestone.dataValidation();
        if (!validatedByMilestone) {
          return false;
        }
      }
      let validatedByAcceptance = this.$refs.addOrEditAcceptance.dataValidation();
      if (!validatedByAcceptance) {
        return false;
      }
      if (
        this.form.responsibilityBy === undefined ||
        this.form.responsibilityBy === null ||
        this.form.responsibilityBy === ""
      ) {
        this.$message.error("请选择责任人！");
        return false;
      }
      return true;
    },
    // 某一行被点击时触发
    rowClick(row, column, event) {
      if (column.label === undefined) {
        return;
      }
      if (column.label === "操作") {
        this.$refs.tableList.toggleRowSelection(row, false);
        return;
      }
      this.$refs.tableList.toggleRowSelection(row);
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const taskIds = row.taskId || this.ids;
      this.$confirm(
        '是否确认删除GS任务信息编号为"' + taskIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delTaskManager(taskIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    // 撤销任务
    handleUndo(row) {
      const taskIds = row.taskId || this.ids;
      this.$confirm(
        '是否确认撤销GS任务信息编号为"' + taskIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return undoTaskManager(taskIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("撤销成功");
          this.infoDialogOpen = false;
        });
    },
    // 复制任务
    copyTask() {
      this.$loading.show();
      copyTaskManager(this.taskInfoDetails.taskId)
        .then((response) => {
          this.form = response.data;
          this.form.taskStatus = "1";
          this.form.milestoneList = response.data.milestoneVoList;
          this.form.acceptanceList = response.data.taskRelationVoList;

          this.infoDialogOpen = false;
          this.$loading.hide();
          this.handleCopy();
        })
        .catch(() => {
          this.$loading.hide();
        });
    },
    // 变更任务
    modifyTask() {
      this.infoDialogOpen = false;
      setTimeout(() => {
        this.handleUpdate(this.taskInfoDetails);
      }, 500);
    },
    // 撤销任务
    draftTask() {
      this.handleUndo(this.taskInfoDetails);
    },
    // 关闭时回调
    closed() {
      this.$refs.addOrEditMilestone.clear();
      this.$refs.addOrEditAcceptance.clear();
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      queryParams.taskIds =  this.ids;
      queryParams.createBy = this.$store.getters.userInfo.username;
      queryParams.exportName = "我下达的GS任务";
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
    /** 导出周期按钮操作 */
    handleExportCycle() {
      const queryParams = this.queryParams;
      queryParams.taskIds =  this.ids;
      queryParams.createBy = this.$store.getters.userInfo.username;
      queryParams.exportName = "周期任务";
      this.$confirm("是否确认导出指定GS周期任务信息数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportCycleTaskManager(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        });
    },
    handleClick() {
      this.queryParams.taskStatus = "";
      this.queryParams.assessmentType = null;
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 任务状态修改
    handleStatusChange(row) {
      let text = row.gsCycleTask.status === "0" ? "启用" : "停用";
      this.$confirm(
        "确认要" + text + 'id为"' + row.taskId + '"周期任务吗?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return updateCycleTaskStatus({
            taskId: row.taskId,
            status: row.gsCycleTask.status,
          });
        })
        .then(() => {
          this.msgSuccess(text + "成功");
        })
        .catch(function () {
          row.gsCycleTask.status = row.gsCycleTask.status === "0" ? "1" : "0";
        });
    },
    showTime() {
    },
  },
};
</script>

<style>
  .el-progress-bar__innerText{
    color:black;
  }
</style>
<style lang="less" scoped>
@import '../../assets/styles/performance.less';

.info_title {
  font-size: 1.3em;
  margin-top: 12px;
}
.font-bold {
  font-weight: 700;
}

// 任务内容高度
.ql-height {
  min-height: 60px;
}

.bg-border-color {
  margin-top: 0;
}

.el-dialog__body > .bg-border-color .bg-border-color:nth-child(3),
.el-dialog__body > .bg-border-color {
  margin-bottom: 0;
}

.item {
  margin-top: 10px;
}
.el-form-item {
  margin-bottom: 20px;
}

</style>
