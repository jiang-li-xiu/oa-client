<template>
  <div class="app-container">
    <div class="bg-border-color-10">
      <div class="flex-center mb10">
        <img src="@/assets/images/look-over.png" alt="" class="list-img" />
        <p class="font-15 font-700 color-50 ml0">筛选查询</p>
      </div>

      <el-form
        class="flex-justify-evenly flex-wrap mt20 m10"
        :model="queryParams"
        ref="queryForm"
        :inline="true"
        v-show="showSearch"
        label-width="70px"
      >
        <el-form-item label="姓名" prop="contractName">
          <el-input
            v-model="queryParams.contractName"
            placeholder="请输入姓名"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <el-form-item label="所属部门" prop="deptId" size="small">
          <treeselect
            v-model="queryParams.deptId"
            :options="queryDeptOptions"
            :show-count="true"
            style="width: 250px"
            placeholder="请选择所属部门"
          />
        </el-form-item>
        <!--      <el-form-item label="考核类型" prop="assessmentType">-->
        <!--        <el-select v-model="queryParams.assessmentType" placeholder="请选择考核类型" clearable size="small">-->
        <!--          <el-option-->
        <!--            v-for="dict in assessmentTypeOptions"-->
        <!--            :key="dict.dictValue"-->
        <!--            :label="dict.dictLabel"-->
        <!--            :value="dict.dictValue"-->
        <!--          />-->
        <!--        </el-select>-->
        <!--      </el-form-item>-->
        <!--      <el-form-item label="考核年" prop="assessmentYear">-->
        <!--        <el-date-picker clearable size="small"-->
        <!--          v-model="queryParams.assessmentYear"-->
        <!--          type="date"-->
        <!--          value-format="yyyy-MM-dd"-->
        <!--          placeholder="选择考核年">-->
        <!--        </el-date-picker>-->
        <!--      </el-form-item>-->
        <!--      <el-form-item label="考核月" prop="assessmentMonth">-->
        <!--        <el-date-picker clearable size="small"-->
        <!--          v-model="queryParams.assessmentMonth"-->
        <!--          type="date"-->
        <!--          value-format="yyyy-MM-dd"-->
        <!--          placeholder="选择考核月">-->
        <!--        </el-date-picker>-->
        <!--      </el-form-item>-->
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
      <div class="flex-align-between">
        <div class="flex-align-center">
          <img
            class="list-img ml0 mr10"
            src="@/assets/images/list.png"
            alt=""
          />
          <p class="color-50 font-15 font-700">数据列表</p>
        </div>
        <div class="flex">
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button
                type="primary"
                plain
                icon="el-icon-plus"
                size="mini"
                @click="handleAdd"
                v-hasPermi="['business:kpiCheckConfig:add']"
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
                v-hasPermi="['business:kpiCheckConfig:remove']"
                >批量删除
              </el-button>
            </el-col>
            <!--      <el-col :span="1.5">-->
            <!--        <el-button-->
            <!--          type="warning"-->
            <!--          plain-->
            <!--          icon="el-icon-download"-->
            <!--          size="mini"-->
            <!--          @click="handleExport"-->
            <!--          v-hasPermi="['business:kpiCheckConfig:export']"-->
            <!--        >导出</el-button>-->
            <!--      </el-col>-->
            <right-toolbar
              :showSearch.sync="showSearch"
              @queryTable="getList"
            ></right-toolbar>
          </el-row>
        </div>
      </div>

      <el-table
        v-loading="loading"
        :data="kpiCheckConfigList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <!--    <el-table-column label="考核配置id" align="center" prop="assessmentConfigureId" />-->
        <!--    <el-table-column label="关联绩效合约配置id" align="center" prop="kpiContractId" />-->
        <el-table-column
          label="考核编号"
          align="center"
          width="80"
          prop="assessmentConfigureId"
        />
        <el-table-column
          label="姓名"
          align="center"
          prop="commonUserInfo.contractName"
          width="100"
        />
        <el-table-column
          label="部门"
          align="center"
          prop="commonUserInfo.deptName"
          width="120"
        />
        <el-table-column
          label="岗位"
          align="center"
          prop="commonUserInfo.postName"
          width="120"
        />
        <el-table-column
          label="考核类型"
          align="center"
          prop="assessmentType"
          :formatter="assessmentTypeFormat"
        />
        <el-table-column
          label="考核年"
          align="center"
          prop="assessmentYear"
          width="100"
        >
        </el-table-column>
        <el-table-column
          label="考核月"
          align="center"
          prop="assessmentMonth"
          width="100"
        >
        </el-table-column>
        <el-table-column label="启动状态" align="center" prop="isStart">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isStart === '0'" type="info">{{
              isStartFormat(scope.row)
            }}</el-tag>
            <el-tag v-else-if="scope.row.isStart === '1'" type="success">{{
              isStartFormat(scope.row)
            }}</el-tag>
            <el-tag v-else-if="scope.row.isStart === '2'" type="danger">{{
              isStartFormat(scope.row)
            }}</el-tag>
            <el-tag v-else type="info">数据异常</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="创建人"
          align="center"
          prop="commonUserInfo.createName"
          width="120"
        />
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          width="180"
        >
          <template slot-scope="scope">
            <span>{{
              parseTime(scope.row.createTime, "{y}-{m}-{d} {h}:{i}:{s}")
            }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
          width="220"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-info"
              @click="handleInfo(scope.row)"
              v-hasPermi="['business:kpiCheckConfig:query']"
              >详情
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['business:kpiCheckConfig:edit']"
              >修改</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['business:kpiCheckConfig:remove']"
              >删除</el-button
            >
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

    <!-- 添加或修改KPI考核配置对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="70%"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <div class="bg-border-color-10">
          <div class="flex">
            <span class="mark-logo"></span>
            <div class="check-person font-15 ml0 mb20 font-700">
              考核配置信息
            </div>
          </div>
          <el-form-item label-width="120px" label="绩效合约人">
            <el-input
              v-model="checkedUserName"
              class="input-with-select"
              :disabled="true"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="openContractTable()"
                :disabled="disableCheckContract"
              ></el-button>
            </el-input>
          </el-form-item>

          <el-form-item label-width="120px" label="绩效合约信息">
            <el-input
              resize="none"
              placeholder="绩效合约信息"
              v-model="checkedUserContractDetails"
              :disabled="true"
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 5 }"
            >
            </el-input>
          </el-form-item>

          <el-form-item
            label-width="120px"
            label="考核类型"
            prop="assessmentType"
          >
            <el-select
              v-model="form.assessmentType"
              placeholder="请选择考核类型"
            >
              <el-option
                v-for="dict in assessmentTypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-row>
            <el-col :span="24">
              <el-form-item
                label-width="120px"
                label="考核年份"
                prop="assessmentYear"
              >
                <el-date-picker
                  v-model="form.assessmentYear"
                  type="year"
                  value-format="yyyy"
                  format="yyyy年"
                  placeholder="请选择考核年份"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                label-width="120px"
                label="考核月份"
                prop="assessmentMonth"
              >
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
        </div>

        <div class="bg-border-color-10">
          <div class="flex">
            <span class="mark-logo"></span>
            <div class="check-person font-15 ml0 mb20 font-700">考核项配置</div>
          </div>
          <el-form-item label-width="120px" label="考核项">
            <el-row :gutter="10" class="mb8">
              <el-col :span="1.5">
                <el-button
                  type="success"
                  plain
                  icon="el-icon-plus"
                  size="mini"
                  @click="handleLoadKpiDict"
                  >添加字典</el-button
                >
              </el-col>
              <el-col :span="1.5">
                <el-button
                  type="primary"
                  plain
                  icon="el-icon-plus"
                  size="mini"
                  @click="handleAddKpiCheckNape"
                  >新增考核项</el-button
                >
              </el-col>
            </el-row>

            <template>
              <el-table :data="kpiCheckNapeTableData" style="width: 100%">
                <el-table-column prop="number" label="序号" width="80">
                </el-table-column>
                <el-table-column
                  prop="targetTitle"
                  label="指标名称"
                  width="180"
                >
                </el-table-column>
                <el-table-column prop="targetValue" label="目标值">
                </el-table-column>
                <el-table-column prop="targetExplain" label="指标说明">
                </el-table-column>
                <el-table-column prop="weightCoefficient" label="权重（%）">
                </el-table-column>
                <el-table-column prop="scoringMethod" label="计分方法">
                </el-table-column>
                <!--              <el-table-column-->
                <!--                prop="preliminaryReviewer"-->
                <!--                label="初评人">-->
                <!--              </el-table-column>-->
                <!--              <el-table-column-->
                <!--                prop="finalReviewer"-->
                <!--                label="终评人">-->
                <!--              </el-table-column>-->

                <el-table-column prop="preliminaryReviewerLabel" label="初评人">
                </el-table-column>
                <el-table-column prop="finalReviewerLabel" label="终评人">
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="100">
                  <template slot-scope="scope">
                    <el-button
                      @click="delKpiCheckNape(scope.row)"
                      type="text"
                      size="small"
                      >删除</el-button
                    >
                    <el-button
                      @click="editKpiCheckNape(scope.row)"
                      type="text"
                      size="small"
                      >修改</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-form-item>
        </div>
      </el-form>

      <div slot="footer" class="dialog-footer popup-change-btn">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!--考核配置详情弹出框-->
    <el-dialog
      :title="infoDialogTitle"
      :visible.sync="infoDialogOpen"
      width="70%"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-card class="box-card mb10">
        <div class="font-normal">
          <div class="flex">
            <span class="mark-logo"></span>
            <div class="check-person font-15 ml0 mb20 font-700">
              考核配置信息
            </div>
          </div>
          <!-- <el-row :gutter="24" class="mb20">
            <el-col :span="24">
              <span style="font-size: 18px">考核详情</span>
            </el-col>
          </el-row> -->
          <el-row :gutter="24" class="mb20">
            <el-col :span="4">
              <b>绩效合约人</b>
            </el-col>
            <el-col :span="20">
              {{ kpiContractAndUserInfoDetails.userName }}
            </el-col>
          </el-row>

          <el-row :gutter="24" class="mb20">
            <el-col :span="4">
              <b>考核类型</b>
            </el-col>
            <el-col :span="20">
              <span v-text="assessmentTypeFormat(kpiCheckConfigDetails)"></span>
            </el-col>
          </el-row>
          <el-row :gutter="24" class="mb20">
            <el-col :span="4">
              <b>考核年份</b>
            </el-col>
            <el-col :span="20">
              {{
                kpiCheckConfigDetails.assessmentYear
                  ? kpiCheckConfigDetails.assessmentYear
                  : "无"
              }}
            </el-col>
          </el-row>
          <el-row :gutter="24" class="mb20">
            <el-col :span="4">
              <b>考核月份</b>
            </el-col>
            <el-col :span="20">
              {{
                kpiCheckConfigDetails.assessmentMonth
                  ? kpiCheckConfigDetails.assessmentMonth
                  : "无"
              }}
            </el-col>
          </el-row>

          <p class="wire-split"></p>
          <div>
            <div class="flex">
              <span class="mark-logo"></span>
              <div class="check-person font-15 ml0 mb20 font-700">
                绩效合约详情
              </div>
            </div>
            <el-row :gutter="24" class="mb20">
              <el-col :span="4">
                <b>姓名：</b>
              </el-col>
              <el-col :span="20">
                {{ kpiContractAndUserInfoDetails.userName }}
              </el-col>
            </el-row>

            <el-row :gutter="24" class="mb20">
              <el-col :span="4">
                <b>部门：</b>
              </el-col>
              <el-col :span="20">
                {{ kpiContractAndUserInfoDetails.deptName }}
              </el-col>
            </el-row>

            <el-row :gutter="24" class="mb20">
              <el-col :span="4">
                <b>岗位：</b>
              </el-col>
              <el-col :span="20">
                {{ kpiContractAndUserInfoDetails.postName }}
              </el-col>
            </el-row>

            <el-row :gutter="24" class="mb20">
              <el-col :span="4">
                <b>KPI权重（%）：</b>
              </el-col>
              <el-col :span="20">
                {{ kpiContractAndUserInfoDetails.kpiweightCoefficient }}
              </el-col>
            </el-row>
          </div>
        </div>
      </el-card>

      <el-card>
        <div>
          <el-row :gutter="24" class="mb20">
            <div class="flex">
              <span class="mark-logo"></span>
              <div class="check-person font-15 ml0 mb20 font-700">考核项</div>
            </div>

            <el-col :span="24">
              <el-table :data="kpiCheckNapeTableDetails" style="width: 100%">
                <el-table-column prop="number" label="序号" width="80">
                </el-table-column>
                <el-table-column
                  prop="targetTitle"
                  label="指标名称"
                  width="180"
                >
                </el-table-column>
                <el-table-column prop="targetValue" label="目标值">
                </el-table-column>
                <el-table-column prop="targetExplain" label="指标说明">
                </el-table-column>
                <el-table-column prop="weightCoefficient" label="权重（%）">
                </el-table-column>
                <el-table-column prop="scoringMethod" label="计分方法">
                </el-table-column>
                <el-table-column prop="preliminaryReviewerLabel" label="初评人">
                </el-table-column>
                <el-table-column prop="finalReviewerLabel" label="终评人">
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </div>
      </el-card>

      <div slot="footer" class="dialog-footer flex-cc">
        <el-button @click="cancelInfoDialog">返 回</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="titleKpiContract"
      :visible.sync="openKpiContract"
      width="85%"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form
        :model="queryParamsKpiContract"
        ref="queryFormKpiContract"
        :inline="true"
        v-show="showSearch"
        label-width="68px"
      >
        <el-form-item label="姓名" prop="userName" label-width="80px">
          <el-input
            v-model="queryParamsKpiContract.userName"
            placeholder="请输入姓名"
            clearable
            size="small"
            @keyup.enter.native="handleQueryKpiContract"
          />
        </el-form-item>

        <el-form-item label="所属部门" prop="deptId">
          <treeselect
            v-model="queryParamsKpiContract.deptId"
            :options="queryDeptOptionsContract"
            :show-count="true"
            style="width: 250px"
            placeholder="请选择所属部门"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleQueryKpiContract"
            >搜索</el-button
          >
          <el-button
            icon="el-icon-refresh"
            size="mini"
            @click="resetQueryKpiContract"
            >重置</el-button
          >
        </el-form-item>
      </el-form>

      <el-table
        max-height="340"
        ref="multipleTableKpiContract"
        v-loading="loadingKpiContract"
        :data="kpiContractList"
        @selection-change="handleSelectionChangeKpiContract"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="姓名" align="center" prop="userName" />
        <el-table-column
          label="部门"
          align="center"
          prop="commonUserInfo.deptName"
        />
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
        <el-table-column label="创建人" align="center" prop="createByLabel" />
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          width="180"
        >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime, "{y}-{m}-{d}") }}</span>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="totalKpiContract > 0"
        :total="totalKpiContract"
        :page.sync="queryParamsKpiContract.pageNum"
        :limit.sync="queryParamsKpiContract.pageSize"
        @pagination="getKpiContractList"
      />

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormKpiContract"
          >确 定</el-button
        >
        <el-button @click="cancelKpiContract">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加或修改KPI考核项对话框 -->
    <el-dialog
      :title="titleKpiCheckNape"
      :visible.sync="openKpiCheckNape"
      width="50%"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form
        ref="formKpiCheckNape"
        :model="formKpiCheckNape"
        :rules="rulesKpiCheckNape"
        label-width="120px"
      >
        <el-input v-model="formKpiCheckNape.number" style="display: none" />

        <el-form-item label="指标名称" prop="targetTitle">
          <el-input
            v-model="formKpiCheckNape.targetTitle"
            placeholder="请输入指标名称"
          />
        </el-form-item>
        <el-form-item label="目标值" prop="targetValue">
          <el-input
            v-model="formKpiCheckNape.targetValue"
            placeholder="请输入目标值"
          />
        </el-form-item>
        <el-form-item label="指标说明" prop="targetExplain">
          <el-input
            v-model="formKpiCheckNape.targetExplain"
            placeholder="请输入指标说明"
          />
        </el-form-item>
        <el-form-item label="权重（%）" prop="weightCoefficient">
          <el-input
            v-model="formKpiCheckNape.weightCoefficient"
            placeholder="请输入考核项权重"
          />
        </el-form-item>
        <el-form-item label="计分方法" prop="scoringMethod">
          <el-input
            v-model="formKpiCheckNape.scoringMethod"
            placeholder="请输入计分方法"
          />
        </el-form-item>

        <el-form-item label="初评人" prop="preliminaryReviewer">
          <dispatch-user
            :is-multiple="false"
            :id-array.sync="formKpiCheckNape.preliminaryReviewer"
            :user-name-array="formKpiCheckNape.preliminaryReviewer"
            :nick-names.sync="formKpiCheckNape.preliminaryReviewerLabel"
          />
        </el-form-item>
        <el-form-item label="终评人" prop="finalReviewer">
          <dispatch-user
            :is-multiple="false"
            :id-array.sync="formKpiCheckNape.finalReviewer"
            :user-name-array="formKpiCheckNape.finalReviewer"
            :nick-names.sync="formKpiCheckNape.finalReviewerLabel"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormKpiCheckNape"
          >确 定</el-button
        >
        <el-button @click="cancelKpiCheckNape">取 消</el-button>
      </div>
    </el-dialog>

    <!-- kpi字典选择对话框 -->
    <el-dialog
      :title="titleKpiDict"
      :visible.sync="openKpiDict"
      width="85%"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form
        :model="queryParamsKpiDict"
        ref="queryFormKpiDict"
        :inline="true"
        v-show="showSearch"
        label-width="68px"
      >
        <el-form-item label="指标名称" prop="targetTitle">
          <el-input
            v-model="queryParamsKpiDict.targetTitle"
            placeholder="请输入指标名称"
            clearable
            size="small"
            @keyup.enter.native="handleQueryKpiDict"
          />
        </el-form-item>

        <el-form-item label="部门" prop="deptId">
          <treeselect
            v-model="queryParamsKpiDict.deptId"
            :options="queryDeptOptionsKpiDict"
            :show-count="true"
            style="width: 250px"
            placeholder="请选择所属部门"
          />
        </el-form-item>

        <el-form-item label="创建时间">
          <el-date-picker
            v-model="daterangeCreateTime"
            size="small"
            style="width: 340px"
            type="datetimerange"
            range-separator="-"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :default-time="['00:00:00', '23:59:59']"
          ></el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleQueryKpiDict"
            >搜索</el-button
          >
          <el-button
            icon="el-icon-refresh"
            size="mini"
            @click="resetQueryKpiDict"
            >重置</el-button
          >
        </el-form-item>
      </el-form>

      <el-table
        max-height="340"
        v-loading="kpidictListLoading"
        :data="kpidictList"
        @selection-change="handleSelectionChangeKpiDict"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="指标名称" align="center" prop="targetTitle" />
        <el-table-column label="目标值" align="center" prop="targetValue" />
        <el-table-column label="指标说明" align="center" prop="targetExplain" />
        <el-table-column
          label="权重（%）"
          align="center"
          prop="weightCoefficient"
        />
        <el-table-column label="评分方法" align="center" prop="scoringMethod" />
        <el-table-column
          label="所属部门"
          align="center"
          prop="commonUserInfo.deptName"
        />
        <el-table-column
          label="初评人"
          align="center"
          prop="commonUserInfo.preliminaryReviewerName"
        />
        <el-table-column
          label="终评人"
          align="center"
          prop="commonUserInfo.finalReviewerName"
        />
        <el-table-column
          label="创建人"
          align="center"
          prop="commonUserInfo.createName"
        />
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          width="180"
        >
        </el-table-column>
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleAddKpiDict">确 定</el-button>
        <el-button @click="cancelKpiDict">取 消</el-button>
      </div>

      <pagination
        v-show="totalKpiDict > 0"
        :total="totalKpiDict"
        :page.sync="queryParamsKpiDict.pageNum"
        :limit.sync="queryParamsKpiDict.pageSize"
        @pagination="getKpiDictList"
      />
    </el-dialog>
  </div>
</template>

<script>
import {
  listKpiCheckConfig,
  getKpiCheckConfig,
  delKpiCheckConfig,
  addKpiCheckConfig,
  updateKpiCheckConfig,
  exportKpiCheckConfig,
  logicDel,
} from "@/api/performance/kpiCheckConfig";
//根据用户账号获取绩效合约信息
// import { getKpiContractByUserName } from "@/api/performance/kpiContract";
//加载部门树形下拉
import { treeselect } from "@/api/performance/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
//加载用户选择控件
import { mapGetters } from "vuex";
import DispatchUser from "@/components/performance/DispatchUser";
//kpi字典列表
import { listKpidict, getKpidict } from "@/api/performance/kpidict";

//绩效合约人
import {
  listKpiContractAndUserInfo,
  getKpiContractAndUserInfo,
} from "@/api/performance/kpiContract";
//用户名称，部门，岗位
import { getUserInfoByUserName } from "@/api/performance/system/user";

//考核项
import { listKpiCheckNapeByAssessmentConfigureId } from "@/api/performance/kpiCheckNape";

export default {
  name: "KpiCheckConfig",
  components: {
    Treeselect,
    DispatchUser,
  },
  computed: {
    ...mapGetters(["name"]),
  },
  data() {
    return {
      //***************************************考核配置主业务
      // 遮罩层
      loading: true,
      // 弹出层标题
      title: "",
      // 是否显示新增/修改弹出层
      open: false,
      // 是否显示详情弹框
      infoDialogOpen: false,
      infoDialogTitle: "考核配置详情",
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
      // KPI考核配置总表格数据
      kpiCheckConfigList: [],
      // 考核类型字典
      assessmentTypeOptions: [],
      queryDeptOptions: undefined,
      queryDeptOptionsContract: undefined,

      //考核配置详情
      kpiCheckConfigDetails: [],
      kpiContractAndUserInfoDetails: [],
      //配置是否已启动字典翻译
      isStartOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        kpiContractId: null,
        assessmentType: null,
        assessmentYear: null,
        assessmentMonth: null,
        kpiScore: null,
        isStart: null,
        assessmentStatus: null,
        contractName: null,
        deptId: null,
      },
      // 表单参数
      form: {
        kpiContractIdArray: [],
        kpiCheckNapeTableData: [],
      },
      // 表单校验
      rules: {
        kpiContractId: [
          {
            required: true,
            message: "关联绩效合约配置id不能为空",
            trigger: "blur",
          },
        ],
        assessmentType: [
          { required: true, message: "考核类型不能为空", trigger: "change" },
        ],
      },

      //***********************************************kpi绩效合约部分
      //绩效合约人遮罩层
      loadingKpiContract: true,
      //是否禁用绩效合约人选择
      disableCheckContract: false,
      totalKpiContract: 0,
      kpiContractList: [],
      //绩效合约选择id数组
      kpiContractIds: [],
      //kpi字典配置选择弹框
      openKpiContract: false,
      //绩效合约id数组
      kpiContractIdArray: [],
      //已选考核人绩效合约详情等
      checkedUserContractDetails: null,
      checkedUserName: null,
      titleKpiContract: "选择绩效合约人",
      //已选kpi绩效合约人权重
      checkedKpiWeightCoefficient: null,
      //部门
      queryDeptOptionsContract: undefined,

      //********************************考核项部分******************
      //是否显示考核项新增弹框
      openKpiCheckNape: false,
      //考核项新增弹框标题
      titleKpiCheckNape: "",

      //详情显示
      kpiCheckNapeTableDetails: [],
      // 表单参数
      formKpiCheckNape: {},
      // 表单校验
      rulesKpiCheckNape: {
        targetTitle: [
          { required: true, message: "指标名称不能为空", trigger: "blur" },
        ],
        targetValue: [
          { required: true, message: "目标值不能为空", trigger: "blur" },
        ],
        scoringMethod: [
          { required: true, message: "评分方法不能为空", trigger: "change" },
        ],
        weightCoefficient: [
          { required: true, message: "权重不能为空", trigger: "change" },
        ],
        preliminaryReviewer: [
          { required: true, message: "初评人不能为空", trigger: "change" },
        ],
        finalReviewer: [
          { required: true, message: "终评人不能为空", trigger: "change" },
        ],
      },
      //kpi考核项表数据
      kpiCheckNapeTableData: [],
      //绩效合约人查询参数
      queryParamsKpiContract: {
        pageNum: 1,
        pageSize: 10,
        userName: null,
      },

      //****************************************************************************kpi字典部分
      //kpi字典数据总条数
      totalKpiDict: 0,
      // 字典遮罩层
      kpidictListLoading: true,
      //选中kpi字典id数组
      kpiDictIds: [],
      //kpi字典表格数据
      kpidictList: [],
      //时间查询区间
      daterangeCreateTime: [],
      //kpi字典配置选择弹框
      openKpiDict: false,
      //kpi字典配置弹框标题
      titleKpiDict: "选择字典配置",
      //考核项序号初始值
      initIndex: 1,
      queryDeptOptionsKpiDict: undefined,
      // kpi字典查询参数
      queryParamsKpiDict: {
        pageNum: 1,
        pageSize: 10,
        targetTitle: null,
        deptId: null,
      },
    };
  },

  created() {
    //页面初始化创建
    this.getList();
    this.getDeptTreeselectKpiDict();
    this.getDicts("kpi_assessment_type").then((response) => {
      this.assessmentTypeOptions = response.data;
    });
    this.getDicts("ASSESSMENT_CONFIGURATION_STATUS").then((response) => {
      this.isStartOptions = response.data;
    });
  },
  methods: {
    //**********************************考核配置业务部分
    /** 查询KPI考核配置总列表 */
    getList() {
      this.loading = true;
      listKpiCheckConfig(this.queryParams).then((response) => {
        this.kpiCheckConfigList = response.rows;
        // console.log(this.kpiCheckConfigList);
        this.total = response.total;
        this.loading = false;
      });
    },
    // 考核类型字典翻译
    assessmentTypeFormat(row, column) {
      return this.selectDictLabel(
        this.assessmentTypeOptions,
        row.assessmentType
      );
    },
    //配置是否已启动
    isStartFormat(row, column) {
      return this.selectDictLabel(this.isStartOptions, row.isStart);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 取消按钮
    cancelInfoDialog() {
      this.infoDialogOpen = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        assessmentConfigureId: null,
        kpiContractId: null,
        assessmentType: null,
        assessmentYear: null,
        assessmentMonth: null,
        kpiScore: null,
        isStart: null,
        assessmentStatus: "0",
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
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.deptId = null;
      this.queryParams.contractName = null;
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.assessmentConfigureId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 查看详情操作 */
    handleInfo(row) {
      this.reset();
      this.infoDialogOpen = true;
      const assessmentConfigureId = row.assessmentConfigureId || this.ids;
      getKpiCheckConfig(assessmentConfigureId).then((response) => {
        let kpiCheckConfig = response.data;
        //主业务信息
        this.kpiCheckConfigDetails = kpiCheckConfig;

        //根据绩效合约id查询部门，姓名，岗位，权重等信息
        getKpiContractAndUserInfo(kpiCheckConfig.kpiContractId).then(
          (response) => {
            let kpiContractAndUserInfo = response.data;
            this.kpiContractAndUserInfoDetails = kpiContractAndUserInfo;
          }
        );
      });
      //考核项信息
      listKpiCheckNapeByAssessmentConfigureId(assessmentConfigureId).then(
        (response) => {
          let KpiCheckNapeList = response.data;
          if (KpiCheckNapeList.length > 0) {
            KpiCheckNapeList.forEach(function (row, index) {
              //序号处理
              row.number = index + 1;
            });
          }
          this.kpiCheckNapeTableDetails = KpiCheckNapeList;
          // console.log(this.kpiCheckNapeTableDetails)
        }
      );
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.getKpiContractList();
      this.getKpiDictList();
      //关闭禁用绩效合约人勾选
      this.disableCheckContract = false;
      this.kpiContractIds = [];
      this.kpiCheckNapeTableData = [];
      this.checkedUserContractDetails = "";
      this.checkedUserName = "";
      this.open = true;
      this.title = "添加KPI考核配置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      if (row.isStart !== "0") {
        this.msgError("仅支持修改启动状态为【未开启】的数据！");
        return;
      }
      this.reset();
      this.getKpiContractList();
      this.getKpiDictList();
      //开启禁用绩效合约人勾选
      this.disableCheckContract = true;
      this.kpiContractIds = [];
      this.kpiCheckNapeTableData = [];
      this.checkedUserContractDetails = "";
      this.checkedUserName = "";
      const assessmentConfigureId = row.assessmentConfigureId || this.ids;
      getKpiCheckConfig(assessmentConfigureId).then((response) => {
        let kpiCheckConfig = response.data;
        //绩效合约id
        //console.log("this.kpiContractIds赋值开始")
        this.kpiContractIds.push(kpiCheckConfig.kpiContractId);
        //console.log(this.kpiContractIds)
        //主业务信息
        this.form = kpiCheckConfig;
        // console.log(kpiCheckConfig);
        //根据绩效合约id查询部门，姓名，岗位，权重等信息
        getKpiContractAndUserInfo(kpiCheckConfig.kpiContractId).then(
          (response) => {
            let kpiContractAndUserInfo = response.data;
            // console.log(kpiContractAndUserInfo);
            this.checkedKpiWeightCoefficient =
              kpiContractAndUserInfo.kpiweightCoefficient;
            //绩效合约人详情回显
            this.setCheckedContractInfo(kpiContractAndUserInfo);
          }
        );

        //绩效合约列表勾选回显
        this.setCheckedData();
      });
      //考核项信息
      listKpiCheckNapeByAssessmentConfigureId(assessmentConfigureId).then(
        (response) => {
          let KpiCheckNapeList = response.data;
          if (KpiCheckNapeList.length > 0) {
            KpiCheckNapeList.forEach(function (row, index) {
              //序号处理
              row.number = index + 1;
            });
          }
          this.kpiCheckNapeTableData = KpiCheckNapeList;
          this.initIndex = this.kpiCheckNapeTableData.length + 1;
        }
      );

      this.open = true;
      this.title = "修改KPI考核配置";
    },
    /** 提交按钮 */
    submitForm() {
      // console.log(this.kpiContractIds)
      // console.log(this.kpiContractIds.length)
      if (this.kpiContractIds.length === 0) {
        this.msgError("绩效合约人至少选择一个");
        return;
      }
      this.form.kpiContractIds = this.kpiContractIds;
      if (this.kpiCheckNapeTableData.length === 0) {
        this.msgError("考核项至少填写一个");
        return;
      }
      //遍历考核项中的权重，判断考核项权重之和是否等于已选绩效合约人的权重
      let countKpi = 0.0;
      for (let kpiCheckNape of this.kpiCheckNapeTableData) {
        countKpi = countKpi + parseFloat(kpiCheckNape.weightCoefficient);
      }
      if (countKpi !== this.checkedKpiWeightCoefficient) {
        this.msgError(
          "【所选绩效合约人kpi权重:" +
            this.checkedKpiWeightCoefficient +
            "%】与【所有考核项权重之和:" +
            countKpi +
            "%】不相等！"
        );
        return;
      }

      this.form.kpiCheckNapeTableData = this.kpiCheckNapeTableData;
      // console.log(this.form);
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.assessmentConfigureId != null) {
            updateKpiCheckConfig(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addKpiCheckConfig(this.form).then((response) => {
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
      const assessmentConfigureIds = row.assessmentConfigureId || this.ids;
      this.$confirm(
        '是否确认删除KPI考核配置编号为"' +
          assessmentConfigureIds +
          '"的数据项? 注：仅支持删除【未启动】的数据',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return logicDel(assessmentConfigureIds);
        })
        .then((response) => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有KPI考核配置总数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportKpiCheckConfig(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        });
    },

    //***********************************绩效合约人部分************************
    //打开合约人选择
    openContractTable() {
      this.openKpiContract = true;
      this.setCheckedData();
    },
    //绩效合约人详情显示
    setCheckedContractInfo(kpiContractAndUserInfo) {
      let userContractDetails =
        "姓名：" +
        kpiContractAndUserInfo.userName +
        "；部门：" +
        kpiContractAndUserInfo.deptName +
        "；岗位：" +
        kpiContractAndUserInfo.postName +
        "；kpi权重：" +
        kpiContractAndUserInfo.kpiweightCoefficient +
        "% | ";
      let userNames = kpiContractAndUserInfo.userName + "/";
      //渲染绩效合约人输入框数据
      this.checkedUserContractDetails = userContractDetails;
      //渲染绩效合约详情数据
      this.checkedUserName = userNames;
    },
    //回显已勾选的合约人
    setCheckedData() {
      /* if (this.kpiContractList.length > 0 && this.kpiContractIds.length > 0) {
        this.$nextTick(() => {
          this.kpiContractIds.forEach((id) => {
            this.kpiContractList.forEach((item) => {
              if (item.kpicontractId === id) {
                this.$refs.multipleTableKpiContract.toggleRowSelection(
                  item,
                  true
                );
              }
            });
          });
        });
      } */
    },
    //获取合约列表
    getKpiContractList() {
      this.loadingKpiContract = true;
      listKpiContractAndUserInfo(this.queryParamsKpiContract).then(
        (response) => {
          this.kpiContractList = response.rows;
          this.totalKpiContract = response.total;
          this.loadingKpiContract = false;
        }
      );
    },
    /** 搜索按钮操作 */
    handleQueryKpiContract() {
      this.queryParamsKpiContract.pageNum = 1;
      this.getKpiContractList();
    },
    /** 重置按钮操作 */
    resetQueryKpiContract() {
      this.resetForm("queryFormKpiContract");
      this.handleQueryKpiContract();
    },
    // 多选框选中数据
    handleSelectionChangeKpiContract(selection) {
      let userContractDetails = "";
      let userNames = "";
      this.kpiContractIds = [];
      let kpiweightCoefficient = null;
      for (let item of selection) {
        if (
          null != kpiweightCoefficient &&
          kpiweightCoefficient != item.kpiweightCoefficient
        ) {
          this.$refs.multipleTableKpiContract.clearSelection();
          this.msgError("只可选择kpi权重相同的人员");
          userContractDetails = "";
          userNames = "";
          continue;
        } else {
          kpiweightCoefficient = item.kpiweightCoefficient;
          //已选kpi权重值
          this.checkedKpiWeightCoefficient = kpiweightCoefficient;
          this.kpiContractIds.push(item.kpicontractId);
          userContractDetails +=
            "姓名：" +
            item.userName +
            "；部门：" +
            item.commonUserInfo.deptName +
            "；岗位：" +
            item.commonUserInfo.postName +
            "；kpi权重：" +
            item.kpiweightCoefficient +
            "% | ";
          userNames += item.userName + "/";
        }
      }
      //渲染绩效合约人输入框数据
      this.checkedUserContractDetails = userContractDetails;
      //渲染绩效合约详情数据
      this.checkedUserName = userNames;
      // console.log(this.kpiContractIds)
    },

    submitFormKpiContract() {
      if (this.kpiContractIds.length === 0) {
        this.msgError("至少添加一位合约人！");
        return;
      }
      this.openKpiContract = false;
      this.msgSuccess("添加绩效合约人成功！");
    },
    cancelKpiContract() {
      this.openKpiContract = false;
    },

    //**********************************考核项部分*****************************
    formatterPreliminaryReviewer: function (row, column) {
      return getUserInfoByUserName(row.preliminaryReviewer).then((response) => {
        let userinfo = response.data;
        // console.log(userinfo.nickName);
        return userinfo.nickName;
      });
    },
    formatterFinalReviewer: function (row, column) {
      let nickName = "";
      getUserInfoByUserName(row.finalReviewer).then((response) => {
        let userinfo = response.data;
        nickName = userinfo.nickName;
      });
      return nickName;
    },
    /** 查询部门下拉树结构 */
    getDeptTreeselectKpiDict() {
      treeselect().then((response) => {
        this.queryDeptOptionsKpiDict = response.data;
        this.queryDeptOptions = response.data;
        this.queryDeptOptionsContract = response.data;
      });
    },
    handleLoadKpiDict() {
      this.openKpiDict = true;
      //弹出字典列表提供选择
      this.getKpiDictList();
      this.getDeptTreeselectKpiDict();
    },
    handleAddKpiCheckNape() {
      //弹出新增考核项目框进行新增
      this.resetKpiCheckNape();
      this.openKpiCheckNape = true;
      this.titleKpiCheckNape = "新增考核项";
    },
    delKpiCheckNape(data) {
      let tableData = this.kpiCheckNapeTableData;
      this.$confirm(
        '是否确认删除KPI考核项序号为"' + data.number + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          tableData.forEach(function (row, index) {
            if (row.number === data.number) {
              //序号相同时，数据删除
              tableData.splice(index, 1);
            }
          });
        })
        .then(() => {
          this.msgSuccess("删除成功");
        });
      this.kpiCheckNapeTableData = tableData;
      // this.initIndex --;
    },
    editKpiCheckNape(row) {
      this.formKpiCheckNape = row;
      this.openKpiCheckNape = true;
      this.titleKpiCheckNape = "修改考核项";
    },

    resetKpiCheckNape() {
      this.formKpiCheckNape = {
        nubmer: null,
        targetTitle: null,
        targetValue: null,
        targetExplain: null,
        weightCoefficient: null,
        scoringMethod: null,
        preliminaryReviewer: null,
        finalReviewer: null,
      };
      this.resetForm("formKpiCheckNape");
    },
    // 取消按钮
    cancelKpiCheckNape() {
      this.openKpiCheckNape = false;
    } /** 提交按钮 */,
    submitFormKpiCheckNape() {
      this.$refs["formKpiCheckNape"].validate((valid) => {
        if (valid) {
          let newKpiCheckNape = {
            number: 1,
            targetTitle: this.formKpiCheckNape.targetTitle,
            targetValue: this.formKpiCheckNape.targetValue,
            targetExplain: this.formKpiCheckNape.targetExplain,
            weightCoefficient: this.formKpiCheckNape.weightCoefficient,
            scoringMethod: this.formKpiCheckNape.scoringMethod,
            preliminaryReviewer: this.formKpiCheckNape.preliminaryReviewer,
            preliminaryReviewerLabel: this.formKpiCheckNape
              .preliminaryReviewerLabel,
            finalReviewer: this.formKpiCheckNape.finalReviewer,
            finalReviewerLabel: this.formKpiCheckNape.finalReviewerLabel,
          };
          // console.log(newKpiCheckNape);

          let number = this.formKpiCheckNape.number;
          let option = "新增";
          if (null != number || undefined != number) {
            option = "修改";
            newKpiCheckNape.number = number;
            let tableData = this.kpiCheckNapeTableData;
            tableData.forEach(function (row, index) {
              if (row.number === number) {
                //序号相同时，数据删除
                tableData.splice(index, 1);
                tableData.push(newKpiCheckNape);
              }
            });
            this.kpiCheckNapeTableData = tableData;
          } else {
            number = this.initIndex;
            newKpiCheckNape.number = number;
            this.kpiCheckNapeTableData.push(newKpiCheckNape);
            this.initIndex++;
          }

          this.msgSuccess(option + "考核项成功");
          this.openKpiCheckNape = false;
        }
      });
    },
    getKpiDictList() {
      this.kpidictListLoading = true;

      this.queryParamsKpiDict.params = {};
      //创建开始结束时间区间查询
      if (null != this.daterangeCreateTime && "" != this.daterangeCreateTime) {
        this.queryParamsKpiDict.params[
          "beginCreateTime"
        ] = this.daterangeCreateTime[0];
        this.queryParamsKpiDict.params[
          "endCreateTime"
        ] = this.daterangeCreateTime[1];
      }
      listKpidict(this.queryParamsKpiDict).then((response) => {
        this.kpidictList = response.rows;
        this.totalKpiDict = response.total;
        this.kpidictListLoading = false;
      });
    },
    handleAddKpiDict() {
      let tempIndex = this.initIndex;
      //获取选中的kpidict_id
      let tableData = this.kpiCheckNapeTableData;
      for (let kpidictId of this.kpiDictIds) {
        getKpidict(kpidictId).then((response) => {
          let kpiDict = response.data;
          if (null != kpiDict && undefined != kpiDict) {
            let newKpiCheckNape = {
              number: 0,
              targetTitle: kpiDict.targetTitle,
              targetValue: kpiDict.targetValue,
              targetExplain: kpiDict.targetExplain,
              weightCoefficient: kpiDict.weightCoefficient,
              scoringMethod: kpiDict.scoringMethod,
              preliminaryReviewer: kpiDict.preliminaryReviewer,
              finalReviewer: kpiDict.finalReviewer,
              preliminaryReviewerLabel: kpiDict.preliminaryReviewerLabel,
              finalReviewerLabel: kpiDict.finalReviewerLabel,
            };

            newKpiCheckNape.number = tempIndex;
            tableData.push(newKpiCheckNape);
            tempIndex++;
          }
        });
        this.initIndex++;
        // console.log(this.initIndex);
      }
      this.kpiCheckNapeTableData = tableData;
      this.openKpiDict = false;
      this.msgSuccess("添加字典模板成功");
    },
    cancelKpiDict() {
      this.openKpiDict = false;
    },
    handleSelectionChangeKpiDict(selection) {
      this.kpiDictIds = selection.map((item) => item.kpidictId);
    },
    //*************************kpi字典弹框部分***********************
    /** 搜索按钮操作 */
    handleQueryKpiDict() {
      this.queryParamsKpiDict.pageNum = 1;
      this.getKpiDictList();
    },
    /** 重置按钮操作 */
    resetQueryKpiDict() {
      this.daterangeCreateTime = [];
      this.resetForm("queryFormKpiDict");
      this.handleQueryKpiDict();
    },
  },
};
</script>
