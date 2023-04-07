<!--
 * @Author: Yelucc
 * @Date: 2021-03-11 14:27:41
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-05-18 16:18:24
 * @Description:
-->
<template>
  <div class="app-container">
    <div class="bg-border-color-10">
      <div class="flex-center">
        <img src="@/assets/images/look-over.png" alt="" class="list-img" />
        <p class="font-15 font-700 color-50 ml0">筛选查询</p>
      </div>
      <el-form
        class="el-form flex-align-between mt20 mb10"
        :model="queryParams"
        ref="queryForm"
        :inline="true"
        v-show="showSearch"
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
            placeholder="责任人"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <el-form-item label="任务状态" prop="applyTaskStatue">
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

        <el-form-item label="考核类型" prop="applyTaskStatue">
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
      <div class="flex-align-between mb10">
        <div class="flex-align-center">
          <img
            src="@/assets/images/list.png"
            alt=""
            class="list-img ml0 mr10"
          />
          <p class="color-50 font-15 font-700">数据列表</p>
        </div>
        <div>
          <el-button
            class="mr10"
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
            v-hasPermi="['business:taskManager:export']"
            >导出
          </el-button>
          <right-toolbar
            :showSearch.sync="showSearch"
            @queryTable="getList"
          ></right-toolbar>
        </div>
      </div>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5"> </el-col>
      </el-row>

      <el-table
        v-loading="loading"
        :data="taskManagerList"
        ref="tableList"
        :default-sort="{ prop: 'taskStatus' }"
        @sort-change="sortChange"
        @selection-change="handleSelectionChange"
         @filter-change="filterChangeInit"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="编号" sortable="custom"  align="center" prop="taskId" />
        <!-- <el-table-column label="下达任务id" align="center" prop="taskId" /> -->
        <el-table-column
          label="任务名称"
          min-width="200%"
          :show-overflow-tooltip="true"
          align="center"
          prop="taskName"
        />

        <el-table-column
          label="开始日期"
          width="150%"
          sortable="custom"
          align="center"
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
          sortable="custom"
          prop="endDate"
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
          align="center"
          prop="assessmentType"
          :formatter="assessmentTypeFormat"
        />
        <el-table-column
          label="权重系数"
          align="center"
          prop="weightCoefficient"
          :formatter="weightCoefficientTypeFormat"
        />
        <el-table-column
          label="创新系数"
          align="center"
          prop="activeInnovationCoefficient"
          :formatter="activeInnovationCoefficientFormat"
        />
        <el-table-column
          label="工时"
          align="center"
          prop="workTime"
        />
        <el-table-column label="验收人" align="center" prop="acceptanceByLabel">
          <template slot-scope="scope">
            {{
              scope.row.acceptanceVoList
                .map((item) => item.acceptanceByLabel)
                .join(" / ")
            }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="验收人" align="center" prop="acceptanceBy"/>
      <el-table-column label="责任人" align="center" prop="responsibilityBy"/> -->
        <!-- <el-table-column
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
        </el-table-column> -->
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
              >任务详情
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
    </div>

    <!-- 任务详情Dialog -->
    <el-dialog
      :close-on-click-modal="false"
      :title="title"
      :visible.sync="infoDialogOpen"
      width="60%"
      append-to-body
    >
      <!-- 任务明细 -->
      <div class="bg-border-color-10 mb10">
        <div>
          <div class="flex mb20">
            <span class="mark-logo mr10"></span>
            <div class="font-700 font-15">任务详情</div>
          </div>
          <el-row class="mb20">
            <el-col :span="3">
              <span class="color-35">任务名称:</span>
            </el-col>
            <el-col :span="6" class="color-91">
              {{ form.taskName }}
            </el-col>

            <el-col :span="3">
              <span class="color-35">责任人:</span>
            </el-col>
            <el-col :span="12" class="color-91">
              {{ form.responsibilityLabel ? form.responsibilityLabel : "暂无" }}
            </el-col>
          </el-row>

          <el-row class="mb20">
            <el-col :span="3">
              <span class="color-35">验收人:</span>
            </el-col>
            <el-col :span="6" class="color-91">
              {{
                form.acceptanceVoList == null
                  ? "暂无"
                  : form.acceptanceVoList
                      .map((a) => a.acceptanceByLabel)
                      .join(" / ")
              }}
            </el-col>
            <div v-if="form.taskStatus !== '1'">
              <el-col :span="3">
                <span class="color-35">下达时间:</span>
              </el-col>
              <el-col :span="12" class="color-91">
                {{
                  form.taskReleaseTime
                    ? parseTime(
                        form.taskReleaseTime,
                        "{y}年{m}月{d}日 {h}:{i}:{s}"
                      )
                    : "暂无"
                }}
              </el-col>
            </div>
          </el-row>
          <!-- <el-row v-if="form.taskStatus !== '1'"  class="mb20">
            <el-col :span="4">
              <span>下达时间</span>
            </el-col>
            <el-col :span="20">
              {{
                form.taskReleaseTime
                  ? parseTime(
                      form.taskReleaseTime,
                      "{y}年{m}月{d}日 {h}:{i}:{s}"
                    )
                  : "暂无"
              }}
            </el-col>
          </el-row> -->

          <el-row class="mb20">
            <div v-if="form.taskStatus >= '3'">
              <el-col :span="3">
                <span class="color-35">实际完成时间:</span>
              </el-col>
              <el-col :span="6" class="color-91">
                {{
                  form.actualEndTime
                    ? parseTime(
                        form.actualEndTime,
                        "{y}年{m}月{d}日 {h}:{i}:{s}"
                      )
                    : "暂无"
                }}
              </el-col>
            </div>
            <el-col :span="3">
              <span class="color-35">计划时间：</span>
            </el-col>
            <el-col :span="12" class="color-91">
              {{ form.startDate | parseTime("{y} 年 {m}月{d} 日 {h} : {i}") }}
              至
              {{ form.endDate | parseTime("{y} 年 {m} 月 {d} 日 {h} : {i}") }}
            </el-col>
          </el-row>

          <el-row class="mb20">
            <el-col :span="3">
              <span class="color-35">考核类型：</span>
            </el-col>
            <el-col :span="6" class="color-91">
              <span v-text="assessmentTypeFormat(form)"></span>
            </el-col>

            <el-col :span="3">
              <span class="color-35">考核月份：</span>
            </el-col>
            <el-col :span="6" class="color-91">
              {{ form.assessmentYear }} 年 {{ form.assessmentMonth }} 月
            </el-col>
          </el-row>

          <el-row class="mb20">
            <el-col :span="3">
              <span class="color-35">任务状态：</span>
            </el-col>
            <el-col :span="6" class="color-91">
              <el-badge :hidden="form.underwayStatus !== 3" value="逾期">
                <el-tag :type="taskStatusFormat(form)" size="small">{{
                  form.taskStatusLabel
                }}</el-tag>
              </el-badge>
            </el-col>

            <el-col :span="3">
              <span class="color-35">权重系统：</span>
            </el-col>
            <el-col :span="12" class="color-91">
              {{ form.weightCoefficientLabel }}
            </el-col>
          </el-row>

          <el-row class="mb20">
            <el-col :span="3">
              <span class="color-35">主动创新系数：</span>
            </el-col>
            <el-col :span="6" class="color-91">
              {{ form.activeInnovationCoefficientLabel }}
            </el-col>

            <el-col :span="3">
              <span class="color-35">任务评分：</span>
            </el-col>
            <el-col :span="12" class="color-91">
              {{ form.taskScore ? form.taskScore : "暂无" }}
            </el-col>
          </el-row>

          <el-row class="mb20">
            <el-col :span="3">
              <span class="color-35">创建人：</span>
            </el-col>
            <el-col :span="6" class="color-91">
              {{ form.createByLabel }}
            </el-col>
            <el-col :span="3">
              <span class="color-35">任务来源：</span>
            </el-col>
            <el-col :span="12" class="color-91">
              {{ form.taskSourceLabel }}
            </el-col>
          </el-row>
        </div>
      </div>

      <!-- 任务内容 -->
      <div class="bg-border-color-10 mb10">
        <div class="flex mb10">
          <span class="mark-logo mr10"></span>
          <div class="font-15 font-700">任务内容</div>
        </div>

        <div>
          <div class="ql-editor">
            <div v-html="form.taskContent">
              {{ form.taskContent }}
            </div>
          </div>
        </div>
      </div>
      <!-- 任务附件 -->
      <div class="bg-border-color-10 mb10">
        <div class="flex mb10">
          <span class="mark-logo mr10"></span>
          <div class="font-15 font-700">任务附件</div>
        </div>
        <el-row :gutter="20" style="text-align: center">
          <el-col :span="24">
            <h4 v-if="!form.fileIdStr">无附件</h4>
          </el-col>
        </el-row>
        <file-list :echo-file-str="form.fileIdStr" />
      </div>
      <!-- 过程里程碑 -->
      <div class="bg-border-color-10 mb10">
        <el-row>
          <el-col :span="24">
            <div class="flex mb10">
              <span class="mark-logo mr10"></span>
              <div class="font-15 font-700">过程里程碑</div>
            </div>
            <el-timeline>
              <div v-if="milestoneInfo.length != 0 && milestoneInfo != null">
                <el-timeline-item
                  placement="top"
                  v-for="(item, index) in milestoneInfo"
                  :key="index"
                  :timestamp="item.milestoneDate"
                >
                  <el-card>
                    <el-row>
                      <el-col :span="4">
                        <h4>里程碑名称:</h4>
                      </el-col>
                      <el-col :span="16">
                        <h4>{{ item.milestoneName }}</h4>
                      </el-col>
                      <el-col :span="4">
                        <el-button
                          v-if="form.taskStatus == 2"
                          style="margin-top: 20px"
                          size="medium"
                          type="primary"
                          v-hasPermi="['business:milestone:edit']"
                          @click="submitMilestone(item)"
                          >{{
                            item.milestoneStatus == "1"
                              ? "填写报告"
                              : "修改报告"
                          }}
                        </el-button>
                        <el-button
                          v-else
                          style="margin-top: 0px"
                          size="medium"
                          type="primary"
                          v-hasPermi="['business:milestone:query']"
                          @click="milestoneReportInfo(item)"
                        >
                          查看详情
                        </el-button>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="4">
                        <h4>里程碑内容:</h4>
                      </el-col>
                      <el-col :span="15">
                        <h4>{{ item.milestoneContent }}</h4>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="15"
                        ><p>
                          {{ item.createLabel }} 创建于 {{ item.createTime }}
                        </p></el-col
                      >
                    </el-row>
                  </el-card>
                </el-timeline-item>
              </div>

              <div class="flex-cc mt10" else>无</div>
            </el-timeline>
          </el-col>
        </el-row>
      </div>

      <div class="bg-border-color-10 mb10">
        <el-row>
          <el-col class="mb10" :span="24">
            <div class="flex">
              <span class="mark-logo mr10 mb10"></span>
              <div class="font-15 font-700">总结附件</div>
            </div>

            <p v-if="form.taskStatus == '2'">
              <fileUpload
                ref="fileUpload"
                :file-str.sync="fileIdStr"
                :echo-file-str="fileIdStr || ''"
              />
            </p>
            <p
              v-else-if="
                form.summaryFileIdStr == null || form.summaryFileIdStr == ''
              "
            >
              <el-card>
                <div align="center">无附件</div>
              </el-card>
            </p>
            <p v-else>
              <fileList
                ref="fileUpload"
                :file-str.sync="form.summaryFileIdStr"
                :echo-file-str="form.summaryFileIdStr || ''"
              ></fileList>
            </p>
          </el-col>
        </el-row>
      </div>

      <div class="bg-border-color-10 mb10">
        <el-row>
          <el-col :span="24">
            <div class="flex">
              <span class="mark-logo mr10"></span>
              <div class="font-15 font-700">任务总结</div>
            </div>
            <p v-if="form.taskStatus !== '2'">
              <el-card class="box-card mt10">
                <div id="from.taskContent" v-html="form.summaryContent">
                  <div>{{ form.summaryContent }}</div>
                </div>
              </el-card>
            </p>
            <p v-else>
              <el-card class="box-card" style="margin-top: 20px">
                <el-form :ref="form" :model="form">
                  <editor v-model="summaryContent" :min-height="192" />
                </el-form>
              </el-card>
            </p>
          </el-col>
        </el-row>
      </div>
      <div class="bg-border-color-10 mb10">
        <el-row>
          <el-col :span="24">
            <div class="flex" align="center" style="margin: auto;">
              <span class="mark-logo mr10"></span>
              <div class="font-15 font-700" >任务完成情况



              </div>
              <div style="margin: auto;">
                  <template>
                    <el-radio v-model="form.completion" label="3">已完成</el-radio>
                    <el-radio v-model="form.completion" label="6">未完成</el-radio>
                    <el-radio v-model="form.completion" label="9">已完成不达标</el-radio>
                  </template>
                  </div>
            </div>
            <p v-if="form.taskStatus !== '2'">
              <el-card class="box-card mt10">

              </el-card>
            </p>
            <p v-else>

            </p>
          </el-col>
        </el-row>
      </div>
      <div align="center" style="margin-top: 20px">
        <p v-if="form.taskStatus == '2'">
          <el-button
            size="medium"
            type="success"
            round
            :disabled="openProgressCommit"
            v-hasPermi="['business:taskApplyManager:edit']"
            @click="submitForm"
            >提交填报
          </el-button>
          <el-button size="medium" type="primary" round @click="cancel"
            >返回列表
          </el-button>
        </p>
        <p v-else>
          <el-button size="medium" type="primary" round @click="cancel"
            >返回列表
          </el-button>
        </p>
      </div>
    </el-dialog>

    <!-- 填报里程碑 -->
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      top="20vh"
      :visible.sync="openMilestone"
      width="50%"
      append-to-body
    >
      <el-row>
        <el-col :span="24">
          <el-card class="box-card" style="margin-top: 20px">
            <editor
              v-model="milestoneSubmit.milestoneReport"
              :min-height="192"
            />
          </el-card>
          <el-card class="box-card" style="margin-top: 20px">
            <fileUpload
              ref="fileUpload"
              :file-str.sync="milestoneSubmit.reportFileIdStr"
              :echo-file-str="milestoneSubmit.reportFileIdStr || ''"

            />
          </el-card>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="margin-top: 20px">
          <div align="center" style="margin-top: 20px">
            <el-button size="medium" type="primary" @click="updateMilestone">

              确认填报</el-button
            >
            <el-button
              size="medium"
              @click="milestoneCancel"
              style="margin-left: 10px"
              >取 消</el-button
            >
          </div>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 填报详情 -->
    <el-dialog
      :title="title"
      top="20vh"
      :close-on-click-modal="false"
      :visible.sync="milestoneReportOpen"
      width="50%"
      append-to-body
    >
      <el-card class="box-card mb10" shadow="never">
        <div slot="header" class="clearfix" style="line-height: 30px">
          <span>里程碑信息</span>
        </div>
        <div>
          <el-row :gutter="24" class="mb20" style="line-height: 5px">
            <el-col :span="6">
              <b>里程碑名称</b>
            </el-col>
            <el-col :span="18">
              {{ milestoneSubmit.milestoneName }}
            </el-col>
          </el-row>
          <el-row
            :gutter="24"
            class="mb20"
            style="background-color: #dfe4ed; line-height: 40px"
          >
            <el-col :span="6">
              <b>下达人</b>
            </el-col>
            <el-col :span="18">
              {{ milestoneSubmit.createLabel }}
            </el-col>
          </el-row>
          <el-row :gutter="24" class="mb20" style="line-height: 5px">
            <el-col :span="6">
              <b>填报时间</b>
            </el-col>
            <el-col :span="18">
              {{ milestoneSubmit.reportDate | parseTime("{y}-{m}-{d}") }}
            </el-col>
          </el-row>
          <el-row
            :gutter="24"
            class="mb20"
            style="background-color: #dfe4ed; line-height: 40px"
          >
            <el-col :span="6">
              <b>里程碑状态</b>
            </el-col>
            <el-col :span="18">
              {{
                milestoneStatusFormat(
                  milestoneSubmit,
                  milestoneSubmit.milestoneStatus
                )
              }}
              <!-- <span v-text="assessmentTypeFormat(taskInfoPage)"></span> -->
            </el-col>
          </el-row>
        </div>
      </el-card>
      <el-card class="box-card mb10">
        <el-row :gutter="24" class="mb20">
          <el-col :span="24">
            <span style="font-size: 18px">里程碑内容</span>
          </el-col>
        </el-row>
        <div class="ql-container ql-snow">
          <div class="ql-editor">
            <div v-html="milestoneSubmit.milestoneContent">
              {{ milestoneSubmit.milestoneContent }}
            </div>
          </div>
        </div>
      </el-card>
      <el-card class="box-card mb10">
        <el-row :gutter="24" class="mb20">
          <el-col :span="24">
            <span style="font-size: 18px">里程碑内容</span>
          </el-col>
        </el-row>
        <div class="ql-container ql-snow">
          <div class="ql-editor">
            <div v-html="milestoneSubmit.milestoneReport">
              {{ milestoneSubmit.milestoneReport }}
            </div>
          </div>
        </div>
      </el-card>
      <!-- 里程碑附件 -->
      <el-card class="box-card mb10">
        <el-row :gutter="24" class="mb20">
          <el-col :span="24">
            <span style="font-size: 18px">任务附件</span>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="text-align: center">
          <el-col :span="24">
            <h4 v-if="!milestoneSubmit.reportFileIdStr">无附件</h4>
          </el-col>
        </el-row>
        <file-list :echo-file-str="milestoneSubmit.reportFileIdStr" />
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
import {
  listTaskManager,
  getTaskManager,
  delTaskManager,
  addTaskManager,
  commitTaskManager,
  updateTaskManager,
  myListTaskManager,
  exportTaskManager,
} from "@/api/performance/taskManager";
import {
  listMilestoneByTaskId,
  reportmilestone,
  getMilestone,
} from "@/api/performance/milestone";
import { listUser } from "@/api/performance/system/user";
import FileUpload from "@/components/performance/FileUpload";
import Editor from "@/components/performance/Editor";
import { parseTime, formatFileSize } from "@/utils/performance/ruoyi";
import { dateDiff, getDay } from "@/utils";
//文件列表组件
import fileList from "@/components/performance/fileList";

export default {
  name: "TaskManager",
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
      completion: null,
      openProgressCommit: false,
      taskContent: "",
      summaryContent: "",
      milestoneInfo: [],
      underwayStatusList: [
        { value: 0, type: "info" },
        { value: 1, type: "success" },
        { value: 2, type: "warning" },
        { value: 3, type: "danger" },
      ],
      infoDialogOpen: false,
      //里程碑填报详情
      milestoneReportOpen: false,
      //里程碑填报
      openMilestone: false,
      // 遮罩层
      loading: true,
      //进度详情
      taskProgressDetails: null,
      //进度附件字符串
      fileIdStr: null,
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
      // 用户总条数
      userTotal: 0,
      // GS任务信息表格数据
      taskManagerList: [],
      // 用户列表
      userList: [],
      // 弹出层标题
      title: "选择派遣人",
      // 选择框标题
      selectTitle: "",
      // 是否显示弹出层
      open: false,
      // 是否显示选择框
      selectOpen: false,
      //里程碑信息
      milestoneSubmit: { reportFileIdStr: null, milestoneReport: null },
      // 哪个字段点击
      selectAttribution: "",
      // 任务状态字典
      taskStatusVal: "",
      taskStatusOptions: [{ label: "全部状态", value: "" }],
      // 里程碑状态字典
      milestoneStatusOptions: [],
      // 列表数据，考核类型
      assessmentTypeRow: [],
      // 考核类型字典
      assessmentTypeVal: "",
      assessmentTypeOptions: [{ label: "全部类型", value: "" }],
      //任务权重字典
      weightCoefficientTypeOptions: [],
      //重新系数字典
      activeInnovationCoefficientOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        taskId: null,
        taskName: null,
        taskContent: null,
        taskStatus: null,
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
      form: {},
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
        weightCoefficient: [
          { required: true, message: "权重系数不能为空", trigger: "blur" },
        ],
        activeInnovationCoefficient: [
          { required: true, message: "创新系数不能为空", trigger: "blur" },
        ],
        acceptanceBy: [
          { required: true, message: "验收人不能为空", trigger: "blur" },
        ],
        responsibilityBy: [
          { required: true, message: "责任人不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getUserList();

    this.getDicts("GS_MILESTONE_STATUS").then((response) => {
      this.milestoneStatusOptions = response.data;
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
      this.weightCoefficientTypeOptions = response.data;
    });
    this.getDicts("gs_active_innovation_coefficient").then((response) => {
      this.activeInnovationCoefficientOptions = response.data;
    });
  },
  methods: {
    /** 查询我负责的GS任务信息列表 */
    getList() {
      this.loading = true;

      this.queryParams.responsibilityBy = this.$store.getters.userInfo.username;
      myListTaskManager(this.queryParams).then((response) => {
        this.taskManagerList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询用户列表 */
    getUserList() {
      listUser(this.queryUserParams).then((response) => {
        this.userList = response.rows;
        this.userTotal = response.total;
      });
    },
    // 重新系数典翻译
    activeInnovationCoefficientFormat(row, column) {
      return this.selectDictLabel(
        this.activeInnovationCoefficientOptions,
        row.activeInnovationCoefficient
      );
    },
    // 任务权重典翻译
    weightCoefficientTypeFormat(row, column) {
      return this.selectDictLabel(
        this.weightCoefficientTypeOptions,
        row.weightCoefficient
      );
    },
    // 考核类型字典翻译
    assessmentTypeFormat(row, column) {
      return this.selectDictLabel(this.assessmentTypeRow, row.assessmentType);
    },
    // 里程碑状态字典翻译
    milestoneStatusFormat(row, column) {
      return this.selectDictLabel(
        this.milestoneStatusOptions,
        row.milestoneStatus
      );
    },
    // 取消按钮
    cancel() {
      this.infoDialogOpen = false;
    },
    // 取消按钮
    milestoneCancel() {
      this.openMilestone = false;
    },
    // 表单重置
    reset() {
      //任务进度
      this.taskProgress = 0;
      //进度详情
      this.taskProgressDetails = null;
      //进度附件字符串
      this.fileIdStr = null;
      this.form = {
        taskId: null,
        taskName: null,
        taskContent: null,
        taskStatus: "0",
        startDate: null,
        endDate: null,
        assessmentType: null,
        assessmentYear: null,
        assessmentMonth: null,
        weightCoefficient: null,
        activeInnovationCoefficient: null,
        acceptanceBy: null,
        responsibilityBy: null,
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
        taskProgress: 0,
      };
      this.milestoneSubmit = { milestoneReport: null };
      this.resetForm("form");
      this.milestoneInfo = [];
      this.taskContent = "";
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      console.log(this.queryParams.startDate);
      this.getList();
    },
    /** 用户搜索按钮操作 */
    handleUserQuery() {
      this.queryUserParams.pageNum = 1;
      this.getUserList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.taskStatus = "";
      this.queryParams.assessmentType = null;
      this.assessmentTypeVal = "";
      this.taskStatusVal = "";
      this.queryParams.isAsc= null,
      this.queryParams.orderByColumn= [],
      // 取消排序选中效果
      this.$refs["tableList"].clearSort();
      this.resetForm("queryForm");
       this.$refs["tableList"].clearFilter();
      this.handleQuery();
    },
    /** 用户重置按钮操作 */
    resetUserQuery() {
      this.resetForm("queryUserForm");
      this.handleUserQuery();
    },
    /** 查看详情操作 */
    handleInfo(row) {
      this.reset();
      const taskId = row.taskId || this.ids;
      //拿到任务信息
      getTaskManager(taskId).then((response) => {
        this.form = response.data;
        console.log(this.form);
        this.infoDialogOpen = true;
        this.title = "任务详细信息";
        // 富文本追加
        this.taskContent = response.data.taskContent;
        this.summaryContent = response.data.summaryContent;
      });
      listMilestoneByTaskId(row.taskId).then((res) => {
        this.milestoneInfo = res.data;
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
    // 选择派遣操作
    selectSend(attribution) {
      this.selectOpen = true;
      this.selectAttribution = attribution;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加GS任务信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const taskId = row.taskId || this.ids;
      getTaskManager(taskId).then((response) => {
        this.form = response.data;
        this.title = "修改GS任务信息";
        this.open = true;
        /*// 此出为调用子组件ref=fileUpload的init方法
        this.$refs.fileUpload.init(this.form.fileIdStr)*/
      });
    },
    submitMilestone(item) {
      this.milestoneSubmit.milestoneReport = null;
      getMilestone(item.milestoneId).then((response) => {
        this.milestoneSubmit = response.data;
        this.title = "里程碑填报";
        this.openMilestone = true;
      });
    },
    milestoneReportInfo(item) {
      getMilestone(item.milestoneId).then((response) => {
        this.milestoneSubmit = response.data;
        this.milestoneReportOpen = true;
        this.title = "里程碑详情";
      });
    },

    summaryIsNull() {
      this.$message({
        message: "警告哦，总结内容不能为空！！",
        type: "warning",
      });
    },
    milestoneIsNull() {
      this.$notify({
        title: "警告",
        message: "里程碑内容不能为空",
        type: "warning",
      });
    },
    //里程碑填报
    updateMilestone() {
      if (
        this.milestoneSubmit.milestoneReport == null ||
        this.milestoneSubmit.milestoneReport == "<p><br></p>"
      ) {
        this.milestoneIsNull();
      } else {
        this.milestoneSubmit.milestoneStatus = "2";
        reportmilestone(this.milestoneSubmit).then((response) => {
          this.msgSuccess("里程碑填报成功");
          listMilestoneByTaskId(this.milestoneSubmit.taskId).then((res) => {
            this.milestoneInfo = res.data;
          });
          this.openMilestone = false;
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
    /** 提交按钮 */
    submitForm() {
      console.log(this.summaryContent);
      if (
        this.summaryContent == "<p><br></p>" ||
        this.summaryContent == null ||
        this.summaryContent.length == 0
      ) {
        this.summaryIsNull();
      } else {
        console.log(this.summaryContent);
        commitTaskManager({
          taskId: this.form.taskId,
          taskStatus: "3",
          endDate: this.form.endDate,
          completion:this.form.completion,
          summaryFileIdStr: this.fileIdStr,
          summaryContent: this.summaryContent,
        }).then((response) => {
          this.getList();
          this.infoDialogOpen = false;
        });
      }
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      queryParams.taskIds =  this.ids;
      queryParams.responsibilityBy = this.$store.getters.userInfo.username;
        queryParams.exportName = "我执行的任务";
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
    swapValue() {
      this.taskProgress = Number(this.inputProgressValue);
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
  },
};
</script>

<style lang="scss" scoped>
.info_title {
  font-size: 1.3em;
  margin-top: 12px;
}
.item {
  margin-top: 10px;
}
</style>
