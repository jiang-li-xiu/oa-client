<template>
  <j-modal
    :title="title"
    width="92%"
    :visible="visible"
    switchFullscreen
    :fullscreen="true"
    @ok="handleOk"
    :okButtonProps="{ class: { 'jee-hidden': disableSubmit } }"
    @cancel="close"
    cancelText="关闭"
  >
    <a-spin tip="加载中..." :spinning="loading">
      <a-form-model ref="ruleForm" :model="formParams" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <!-- 方案并选型展示 -->
        <a-tabs default-active-key="1" @change="handleChange" :activeKey="activeKey">
          <a-tab-pane key="1" tab="申请信息">
            <a-row>
              <!-- <template v-if="this.currentType == 2">
                <a-col :span="24" class="title">选型人信息</a-col>
                <a-col :span="6">
                  <a-form-model-item label="选型人" prop="selectPeopleName">
                    <a-input v-model="formParams.selectPeopleName" placeholder="请输入选型人" readOnly />
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item label="选型部门" prop="selectDepartment">
                    <a-tree-select
                      v-model="formParams.selectDepartment"
                      show-search
                      style="width: 100%"
                      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                      placeholder="请选择"
                      allow-clear
                      tree-default-expand-all
                      disabled
                    >
                      <a-tree-select-node
                        v-for="item in principalPersonList"
                        :key="item.id"
                        :value="item.id"
                        :title="item.title"
                      >
                        <a-tree-select-node
                          v-for="child in item.children"
                          :key="child.id"
                          :value="child.id"
                          :title="child.title"
                        >
                          <a-tree-select-node
                            v-for="userList in child.userList"
                            :key="userList.id"
                            :value="userList.id"
                            :title="userList.realname"
                          >
                          </a-tree-select-node>
                        </a-tree-select-node>
                      </a-tree-select-node>
                    </a-tree-select>
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item label="选型日期" prop="selectTime">
                    <j-date
                      v-model="formParams.selectTime"
                      :showTime="true"
                      dateFormat="YYYY-MM-DD"
                      :style="{ width: '100%' }"
                      placeholder="请选择选型日期"
                      disabled
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item label="联系电话" prop="selectPeoplePhone">
                    <a-input v-model="formParams.selectPeoplePhone" placeholder="请输入联系电话" readOnly />
                  </a-form-model-item>
                </a-col>
              </template> -->

              <!-- <a-col :span="24" class="title">设计信息</a-col>
              <a-col :span="6">
                <a-form-model-item label="设计人" prop="peopleName">
                  <a-input v-model="formParams.peopleName" placeholder="请输入设计人" readOnly />
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item label="设计部门" prop="department">
                  <a-tree-select
                    v-model="formParams.department"
                    show-search
                    style="width: 100%"
                    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                    placeholder="请选择"
                    allow-clear
                    tree-default-expand-all
                    disabled
                  >
                    <a-tree-select-node
                      v-for="item in principalPersonList"
                      :key="item.id"
                      :value="item.id"
                      :title="item.title"
                    >
                      <a-tree-select-node
                        v-for="child in item.children"
                        :key="child.id"
                        :value="child.id"
                        :title="child.title"
                      >
                        <a-tree-select-node
                          v-for="userList in child.userList"
                          :key="userList.id"
                          :value="userList.id"
                          :title="userList.realname"
                        >
                        </a-tree-select-node>
                      </a-tree-select-node>
                    </a-tree-select-node>
                  </a-tree-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item label="设计日期" prop="time">
                  <j-date
                    v-model="formParams.time"
                    :showTime="true"
                    dateFormat="YYYY-MM-DD"
                    :style="{ width: '100%' }"
                    placeholder="请选择设计日期"
                    disabled
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item label="联系电话" prop="peoplePhone">
                  <a-input v-model="formParams.peoplePhone" placeholder="请输入联系电话" readOnly />
                </a-form-model-item>
              </a-col> -->

              <a-col :span="24" class="title">项目信息</a-col>
              <a-col :span="12">
                <a-form-model-item
                  label="项目名称"
                  prop="projectId"
                  :label-col="{ span: 4 }"
                  :wrapper-col="{ span: 20 }"
                >
                  <j-select-project
                    v-model="formParams.projectId"
                    :multi="false"
                    @change="handelChange"
                    :disabled="disableSubmit"
                  ></j-select-project>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item
                  label="客户名称"
                  prop="companyName"
                  :label-col="{ span: 4 }"
                  :wrapper-col="{ span: 20 }"
                >
                  <j-select-customer
                    v-model="formParams.customId"
                    :multi="false"
                    @change="handelChangeCustomer"
                    disabled
                  >
                  </j-select-customer>
                  <!-- <a-textarea v-model="formParams.companyName" placeholder="请输入客户名称" :rows="1" readOnly /> -->
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item label="联系人" prop="customerName">
                  <a-input v-model="formParams.customerName" placeholder="请输入联系人" readOnly />
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item label="联系电话" prop="customerPhone">
                  <a-input v-model="formParams.customerPhone" placeholder="请输入联系电话" readOnly />
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item label="立项时间" prop="buildDate">
                  <!-- <j-date
                    v-model="formParams.buildDate"
                    :showTime="true"
                    dateFormat="YYYY-MM-DD"
                    :style="{ width: '100%' }"
                    placeholder="请选择立项时间"
                    readOnly
                  /> -->
                  <span>{{ formParams.buildDate }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item label="负责人" prop="inCharge">
                  <span>{{ formParams.inCharge }}</span>
                  <!-- <a-input
                    v-if="formParams.chargeName"
                    v-model="formParams.chargeName"
                    placeholder="请输入负责人"
                    readOnly
                  />
                  <a-input v-else v-model="formParams.inCharge" placeholder="请输入负责人" readOnly /> -->
                  <!-- <a-input v-model="formParams.inCharge" placeholder="请输入负责人" readOnly /> -->
                  <!-- <a-input v-model="formParams.chargeName" placeholder="请输入负责人" readOnly /> -->
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item label="项目类型" prop="projectType">
                  <span>{{ projectType(formParams.projectType) }}</span>
                  <!-- <template v-if="[0, 1, 3].includes(this.type)">
                    <a-select v-model="formParams.projectType" show-search placeholder="请选择" readOnly>
                      <a-select-option :value="1">工程项目</a-select-option>
                      <a-select-option :value="2">渠道项目</a-select-option>
                      <a-select-option :value="3">产品销售</a-select-option>
                      <a-select-option :value="4">软件销售</a-select-option>
                      <a-select-option :value="5">软件定制</a-select-option>
                    </a-select>
                  </template>
                  <template v-else>
                    <span>{{ projectType(formParams.projectType) }}</span>
                  </template> -->
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item label="项目总额" prop="amount">
                  <template v-if="[0, 1].includes(this.type)">
                    <a-input-number
                      v-model="formParams.amount"
                      placeholder="请输入项目总额"
                      :readOnly="readOnly"
                      :style="{ width: '100%' }"
                  /></template>
                  <template v-else>
                    <span>{{ formParams.amount }}</span>
                  </template>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item label="项目概算" prop="budget">
                  <template v-if="[0, 1].includes(this.type)">
                    <a-input-number
                      v-model="formParams.budget"
                      placeholder="请输入项目概算"
                      :readOnly="readOnly"
                      :style="{ width: '100%' }"
                    />
                  </template>
                  <template v-else>
                    <span>{{ formParams.budget }}</span>
                  </template>
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item
                  label="项目地点"
                  prop="projectAddr"
                  :label-col="{ span: 2 }"
                  :wrapper-col="{ span: 20 }"
                >
                  <a-textarea v-model="formParams.projectAddr" placeholder="请输入项目地点" readOnly />
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item
                  label="概要说明"
                  prop="outlines"
                  :label-col="{ span: 2 }"
                  :wrapper-col="{ span: 20 }"
                >
                  <a-textarea v-model="formParams.outlines" placeholder="请输入概要说明" readOnly />
                </a-form-model-item>
              </a-col>

              <!-- ------------产品信息----------- -->
              <template v-if="this.currentType == 2">
                <a-col :span="24" class="title">{{ currentType == 1 ? "方案信息" : "产品信息" }}</a-col>
                <a-col :span="6">
                  <a-form-model-item label="上控价" prop="priceControl">
                    <template v-if="[0, 1].includes(type)">
                      <a-input-number
                        v-model="formParams.priceControl"
                        placeholder="请输入上控价"
                        :style="{ width: '100%' }"
                        :disabled="disableSubmit"
                      />
                    </template>
                    <template v-else>{{ formParams.priceControl }}</template>
                  </a-form-model-item>
                </a-col>
                <a-col :span="24">
                  <!-- <ProductInfo
                    ref="productForm"
                    :proData="this.formParams.pruductInfos"
                    @data="productData"
                    :is_type="2"
                    :type="this.type"
                    :dataApproval="this.dataApproval"
                    :currentData="this.currentData"
                  ></ProductInfo> -->
                  <a-button
                    class="buttom"
                    type="primary"
                    @click="addProduct"
                    :disabled="[2].includes(this.type)"
                    v-if="this.type != 4"
                    >添加一行
                  </a-button>
                  <!-- <a-button class="buttom" type="primary">方案库导入 </a-button>
                  <a-button class="buttom" type="primary">方案模板导入 </a-button> -->
                  <a-table
                    :columns="columns"
                    :data-source="this.formParams.schemeProductInfos"
                    bordered
                    rowKey="key"
                    :scroll="{ x: true }"
                    :indentSize="10"
                    :pagination="false"
                    :disabled="disableSubmit"
                  >
                    <template slot="action" slot-scope="text, row, index">
                      <a
                        href="javascript:;"
                        @click="handleEditProSheme(row, index, 1)"
                        :disabled="[5, 6, 7, 8].includes(formParams.flowStatus)"
                        v-if="![2, 4].includes(type)"
                        >编辑
                      </a>
                      <a href="javascript:;" @click="handleEditProSheme(row, index, 2)" v-else>详情 </a>

                      <template v-if="![2, 4].includes(type)">
                        <a-divider type="vertical" />
                        <a
                          href="javascript:;"
                          @click="batchPathDel(row.id)"
                          :style="{ color: 'red', height: '63px' }"
                          :disabled="[5, 6, 7, 8].includes(formParams.flowStatus)"
                          >删除
                        </a>
                      </template>
                    </template>
                  </a-table>
                </a-col>
              </template>

              <!-- ------------方案信息------------- -->
              <template v-else>
                <a-col :span="24" class="title">方案信息</a-col>
                <a-col :span="6">
                  <a-form-model-item label="上控价" prop="priceControl">
                    <template v-if="[0, 1].includes(type)">
                      <a-input-number
                        v-model="formParams.priceControl"
                        placeholder="请输入上控价"
                        :style="{ width: '100%' }"
                        :disabled="disableSubmit"
                      />
                    </template>
                    <template v-else>{{ formParams.priceControl }}</template>
                  </a-form-model-item>
                </a-col>

                <!-- 2详情 4审批详情 -->
                <template>
                  <a-col :span="24">
                    <a-button
                      class="buttom"
                      type="primary"
                      @click="addPlanRow"
                      :disabled="[2].includes(this.type)"
                      v-if="this.type != 4"
                      >添加方案
                    </a-button>
                    <a-button
                      class="buttom"
                      type="primary"
                      @click="handleImportLibrary"
                      :disabled="[2].includes(this.type)"
                      v-if="this.type != 4"
                      >方案库导入
                    </a-button>
                    <a-button
                      class="buttom"
                      type="primary"
                      @click="handleImportTempalte"
                      :disabled="[2].includes(this.type)"
                      v-if="this.type != 4"
                      >方案模板导入
                    </a-button>
                    <a-button
                      class="buttom"
                      type="danger"
                      @click="batchPathDel()"
                      :disabled="[2].includes(this.type) || selectedRowKeys.length == 0"
                      v-if="this.type != 4"
                      >批量删除
                    </a-button>
                    <a-table
                      :columns="columnsPlan"
                      :data-source="formParams.schemeInfos"
                      bordered
                      rowKey="id"
                      :scroll="{ x: true }"
                      :indentSize="10"
                      :pagination="false"
                      :rowSelection="{
                        selectedRowKeys: selectedRowKeys,
                        onChange: onSelectChange,
                        fixed: true,
                      }"
                      @change="handleTableChange"
                    >
                      <div class="overflowStyle" slot="codeNum" slot-scope="text, record">
                        <span style="white-space: pre-line">
                          {{ record.codeNum }}
                        </span>
                      </div>
                      <template slot="action" slot-scope="text, row, index">
                        <a
                          href="javascript:;"
                          @click="handleEditScheme(row, index, 1)"
                          :disabled="[5, 6, 7, 8].includes(formParams.flowStatus)"
                          v-if="![2, 4].includes(type)"
                          >编辑
                        </a>
                        <a href="javascript:;" @click="handleEditScheme(row, index, 2)" v-else>详情 </a>
                        <template v-if="![2, 4].includes(type)">
                          <a-divider type="vertical" />
                          <a
                            href="javascript:;"
                            @click="batchPathDel(row.id)"
                            :disabled="[5, 6, 7, 8].includes(formParams.flowStatus)"
                            :style="{ color: 'red', height: '63px' }"
                            >删除
                          </a>
                        </template>
                      </template>
                    </a-table>
                  </a-col>
                </template>
                <!-- 方案详情表格 -->
                <!-- <template v-else>
                  <a-col :span="24">
                    <a-table
                      :columns="columnsDetail"
                      :data-source="this.formParams.schemeInfos"
                      bordered
                      rowKey="key"
                      :scroll="{ x: true }"
                      :indentSize="10"
                      :pagination="false"
                      :disabled="disableSubmit"
                    >
                      <div class="overflowStyle" slot="technicalSpecifications" slot-scope="text, record">
                        <span style="white-space: pre-line">
                          {{ record.technicalSpecifications }}
                        </span>
                      </div>
                      <div class="overflowStyle" slot="detailName" slot-scope="text, record">
                        <span style="white-space: pre-line">
                          {{ record.detailName }}
                        </span>
                      </div>
                      <div class="overflowStyle" slot="remark" slot-scope="text, record">
                        <span style="white-space: pre-line">
                          {{ record.remark }}
                        </span>
                      </div>
                      <div class="overflowStyle" slot="position" slot-scope="text, record">
                        <span style="white-space: pre-line">
                          {{ record.position }}
                        </span>
                      </div>
                      <template slot="productId" slot-scope="text, record">
                        {{ row.productName }}
                      </template>
                    </a-table>
                  </a-col>
                </template> -->
              </template>
            </a-row>
          </a-tab-pane>

          <!-- 审批信息 -->
          <a-tab-pane key="2" tab="审批信息" v-if="[2, 4].includes(this.type)">
            <template>
              <a-col :span="24" class="title" :style="{ marginTop: '15px' }">审批信息</a-col>
              <a-col :span="24">
                <div class="block" v-if="dataApproval && dataApproval.length > 0">
                  <a-timeline>
                    <a-timeline-item
                      v-for="(item, index) in dataApproval"
                      :key="index"
                      :icon="setIcon(item.approverTime)"
                      :color="setColor(item.approverTime)"
                    >
                      <p style="font-weight: 700">{{ item.processName }}</p>
                      <a-card class="box-card" shadow="hover">
                        <a-descriptions :column="4" :labelStyle="{ 'font-weight': 'bold' }">
                          <a-descriptions-item label="操作人">{{ item.approverName || "-" }}</a-descriptions-item>
                          <a-descriptions-item label="申请时间">{{ item.applyTime || "-" }}</a-descriptions-item>
                          <a-descriptions-item label="状态">{{ commentType(item.status) || "-" }}</a-descriptions-item>
                          <a-descriptions-item label="审批时间">{{ item.approverTime || "-" }}</a-descriptions-item>
                          <a-descriptions-item label="审批备注">{{ item.remark || "-" }}</a-descriptions-item>
                        </a-descriptions>
                        <a-divider orientation="left">
                          <a-tag :color="approveTypeTag(item.status)">{{ commentType(item.status) }}</a-tag>
                          <a-tag>{{ item.approverTime || "--" }}</a-tag>
                        </a-divider>
                      </a-card>
                    </a-timeline-item>
                  </a-timeline>
                </div>
                <div v-else>- 暂无记录 -</div>
              </a-col>
            </template>
          </a-tab-pane>
        </a-tabs>
      </a-form-model>
    </a-spin>

    <div class="drawer-bootom-button">
      <template v-if="this.type !== 4">
        <a-button
          @click="handleApproval"
          type="primary"
          :loading="approvalLoading"
          style="margin-right: 0.8rem"
          v-if="![2, 3].includes(this.currentData.status) && this.type !== 2"
          :disabled="[5, 6, 7, 8].includes(formParams.flowStatus)"
          >提交审批
        </a-button>
        <a-button
          @click="handleOk"
          type="primary"
          :loading="okLoading"
          v-if="this.type !== 2"
          style="margin-right: 0.8rem"
          :disabled="[5, 6, 7, 8].includes(formParams.flowStatus)"
          >保存
        </a-button>
      </template>
      <template v-if="this.type == 4 && is_approval">
        <a-button
          key="submit"
          type="primary"
          @click="handleApprovalSub(2)"
          :disabled="this.currentData.status !== 1"
          style="margin-right: 0.8rem"
        >
          通过
        </a-button>
        <a-button
          key="back"
          type="danger"
          @click="handleApprovalSub(1)"
          :disabled="this.currentData.status !== 1"
          style="margin-right: 0.8rem"
          >不通过
        </a-button>
      </template>
      <a-button @click="close">取消</a-button>
    </div>

    <ApprovalSubmit ref="aprovalForm" @refreshClose="refreshAndClose"></ApprovalSubmit>
    <a-modal title="选择类别" :width="600" :visible.sync="visible1" :confirmLoading="loading" @cancel="closeModel">
      <a-spin tip="加载中..." :spinning="loading">
        <a-form-model ref="ruleForm2" :model="modelForm" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-row>
            <a-col :span="24">
              <a-form-model-item label="方案类别" prop="schemeType">
                <a-select v-model="modelForm.schemeType" show-search placeholder="请选择" readOnly>
                  <a-select-option :value="1">工程</a-select-option>
                  <a-select-option :value="2">软件</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </a-spin>

      <template slot="footer">
        <a-button type="dashed" @click="closeModel">取消</a-button>
        <a-button type="primary" @click="handleOkModel" :loading="loading">确认</a-button>
      </template>
    </a-modal>
    <!-- 工程方案 -->
    <add-engineering-scheme ref="engineering" @refresh="getSchemeLibrary"></add-engineering-scheme>
    <!-- 软件方案 -->
    <add-software-scheme ref="software" @refresh="getSchemeLibrary"></add-software-scheme>
    <!-- 产品 -->
    <add-product-selection ref="selectProduct" @refresh="getSchemeLibrary"></add-product-selection>

    <!-- 导入方案库 -->
    <scheme-library-model
      ref="importLibrary"
      :projectId="this.formParams.projectId"
      @refresh="getSchemeLibrary"
    ></scheme-library-model>
    <!-- 导入方案模板 -->
    <scheme-library-model
      ref="importTemplate"
      :projectId="this.formParams.projectId"
      @refresh="getSchemeLibrary"
      :columns="columnsTemplate"
    ></scheme-library-model>
  </j-modal>
</template>

<script>
// API
import {
  addprodScheme,
  EditprodScheme,
  getDetail,
  getDepartmentList,
  addProdAndScheme,
  postDetailApproval,
  postAddApproval,
  postEditApproval,
  productAddApproval,
  productEditApproval,
  getLibrary,
  deleteLibrary,
  saveProject,
  submitLibraryApprove,
  approvalInfo,
} from "@/api/project-management/plan-management/PlanManagement.js"
// 组件
import ProductInfo from "@/views/project-management/components/ProductInfo"
import InquiryTable from "@/views/project-management/plan-management/plan-ask-price/components/InquiryTable.vue"
import ApprovalSubmit from "@/components/ApprovalDialog/ApprovalSubmit.vue"
import AddEngineeringScheme from "./AddEngineeringScheme.vue"
import AddSoftwareScheme from "./AddSoftwareScheme.vue"

import AddProductSelection from "@/views/project-management/plan-management/plan-management/components/AddProductSelection.vue"
import SchemeLibraryModel from "./SchemeLibraryModel"
// import { JVXETypes } from '@/components/jeecg/JVxeTable'
import moment from "dayjs"
import JSelectProject from "@/views/scrm/modules/JSelectProject"
import JSelectCustomer from "@/views/scrm/modules/JSelectCustomer"
// 混入
import { TableListMixin } from "@/mixins/TableListMixin"
export default {
  mixins: [TableListMixin],
  components: {
    ProductInfo,
    InquiryTable,
    JSelectProject,
    ApprovalSubmit,
    JSelectCustomer,
    AddEngineeringScheme,
    AddSoftwareScheme,
    AddProductSelection,
    SchemeLibraryModel,
  },
  props: {
    is_approval: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      // 开关
      visible: false,
      // 加载动画开关
      loading: false,
      isEditAction: false,
      // 是否禁用
      disableSubmit: false,
      readOnly: false,
      // 标题
      title: "设计并选型",
      // 当前模式 0-添加 1-编辑 2-详情 3选型 4审批详情
      type: 0,
      // 表单配置
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
      // 表单参数
      formParams: {
        selectDepartment: this.$store.getters.userInfo.departIds, //当前选型部门id
        // peopleName: this.$store.getters.userInfo.realname, //当前名字
        // peopleId: this.$store.getters.userInfo.id, //当前名字id
        // department: this.$store.getters.userInfo.orgCodeTxt, //当前部门名称
        // peoplePhone: this.$store.getters.userInfo.phone, // 当前电话
        time: moment().format("YYYY-MM-DD HH:mm:ss"),
        selectTime: moment().format("YYYY-MM-DD HH:mm:ss"), //选型时间
        selectPeoplePhone: this.$store.getters.userInfo.phone, // 选型人电话
        selectPeopleName: this.$store.getters.userInfo.realname, //当前选型人
        pruductInfos: [],
        schemeInfos: [{ name: "1" }],
        schemeProductInfos: [],
      },
      // 选型表格
      columns: [
        {
          title: "方案编号",
          dataIndex: "code",
          width: "11%",
          key: "code",
          ellipsis: true,
          scopedSlots: { customRender: "codeNum" },
          // customRender(text, record, index) {
          //   return index + 1
          // }
        },
        {
          title: "方案名称",
          dataIndex: "name",
          width: "11%",
          ellipsis: true,
          align: "center",
          scopedSlots: {
            customRender: "name",
          },
        },
        {
          title: "方案类型",
          dataIndex: "type",
          width: "11%",
          ellipsis: true,
          align: "center",
          customRender(text) {
            if (text == 1) {
              return "工程"
            } else if (text == 2) {
              return "软件"
            } else {
              return ""
            }
          },
        },
        {
          title: "采购金额",
          dataIndex: "totalPurchase",
          width: "11%",
          ellipsis: true,
          align: "center",
          scopedSlots: {
            customRender: "totalPurchase",
          },
        },
        {
          title: "设计人",
          dataIndex: "designPerson",
          width: "11%",
          ellipsis: true,
          align: "center",
          scopedSlots: {
            customRender: "designPerson",
          },
        },
        {
          title: "设计部门",
          dataIndex: "designPersonDept",
          width: "11%",
          ellipsis: true,
          align: "center",
          scopedSlots: {
            customRender: "designPersonDept",
          },
        },
        {
          title: "报价人",
          dataIndex: "profitsPeopleName",
          width: "11%",
          ellipsis: true,
          align: "center",
          scopedSlots: {
            // customRender: 'position',
          },
        },
        {
          title: "报价人部门",
          dataIndex: "profitsPeopleDept",
          width: "11%",
          ellipsis: true,
          align: "center",
          scopedSlots: {
            // customRender: 'position',
          },
        },
        {
          title: "审批状态",
          dataIndex: "status",
          width: "11%",
          ellipsis: true,
          align: "center",
          customRender(text) {
            if (text == 1) {
              return "保存"
            } else if (text == 2) {
              return "已提交"
            } else if (text == 3) {
              return "询价中"
            } else if (text == 4) {
              return "询价完成"
            } else if (text == 5) {
              return "方案不通过"
            } else if (text == 6) {
              return "已选型"
            } else {
              return ""
            }
          },
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          fixed: "right",
          width: 150,
          scopedSlots: { customRender: "action" },
        },
      ],
      // 方案表格
      columnsPlan: [
        {
          title: "方案编号",
          dataIndex: "code",
          align: "center",
          width: "14%",
          ellipsis: true,
          // customRender(text, record, index) {
          //   return index + 1
          // }
        },
        {
          title: "方案名称",
          dataIndex: "name",
          width: "14%",
          ellipsis: true,
          align: "center",
          scopedSlots: {
            customRender: "name",
          },
        },
        {
          title: "方案类别",
          dataIndex: "type",
          width: "14%",
          ellipsis: true,
          align: "center",
          customRender(text) {
            if (text == 1) {
              return "工程"
            } else if (text == 2) {
              return "软件"
            } else {
              return ""
            }
          },
        },
        {
          title: "设计人",
          dataIndex: "designPerson",
          width: "14%",
          ellipsis: true,
          align: "center",
          scopedSlots: {
            customRender: "designPerson",
          },
        },
        {
          title: "设计部门",
          dataIndex: "designPersonDept",
          width: "14%",
          ellipsis: true,
          align: "center",
          scopedSlots: {
            customRender: "designPersonDept",
          },
        },
        {
          title: "设计时间",
          dataIndex: "designTime",
          width: "14%",
          ellipsis: true,
          align: "center",
          scopedSlots: {
            customRender: "designTime",
          },
        },
        {
          title: "数目数量",
          dataIndex: "detailNum",
          width: "14%",
          ellipsis: true,
          align: "center",
          scopedSlots: {
            customRender: "detailNum",
          },
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          fixed: "right",
          width: 150,
          scopedSlots: {
            customRender: "action",
          },
        },
      ],
      // 方案详情表格
      columnsDetail: [
        {
          title: "编号",
          dataIndex: "codeNum",
          align: "left",
          width: 150,
          ellipsis: true,
          // customRender(text, record, index) {
          //   return index + 1
          // }
        },
        {
          title: "安装位置",
          dataIndex: "position",
          width: 250,
          ellipsis: true,
          align: "center",
          scopedSlots: {
            customRender: "position",
          },
        },
        {
          title: "细目名称",
          dataIndex: "detailName",
          width: 250,
          ellipsis: true,
          align: "center",
          scopedSlots: {
            customRender: "detailName",
          },
        },
        {
          title: "技术规格、资质证书",
          dataIndex: "technicalSpecifications",
          width: 400,
          ellipsis: true,
          align: "center",
          scopedSlots: {
            customRender: "technicalSpecifications",
          },
        },
        {
          title: "单位",
          dataIndex: "unit",
          width: 120,
          ellipsis: true,
          align: "center",
        },
        {
          title: "数量",
          dataIndex: "num",
          width: 120,
          ellipsis: true,
          align: "center",
        },
        {
          title: "备注",
          dataIndex: "remark",
          width: 150,
          ellipsis: true,
          align: "center",
          scopedSlots: {
            customRender: "remark",
          },
        },
      ],
      // 方案模板表格
      columnsTemplate: [
        {
          title: "方案名称",
          dataIndex: "name",
          align: "center",
          width: "35%",
        },
        {
          title: "方案类别",
          dataIndex: "type",
          align: "center",
          width: "15%",
          customRender(text) {
            if (text == 1) {
              return "工程"
            } else if (text == 2) {
              return "软件"
            } else {
              return ""
            }
          },
        },
        {
          title: "设计人",
          dataIndex: "designPerson",
          align: "center",
          width: "15%",
        },
        {
          title: "设计部门",
          dataIndex: "designPersonDept",
          align: "center",
          width: "15%",
        },
        {
          title: "设计时间",
          dataIndex: "designTime",
          align: "center",
          width: "15%",
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          fixed: "right",
          width: 150,
          scopedSlots: { customRender: "action" },
        },
      ],
      tableData: [],
      //  判断方案和选型 1-方案信息，2-产品信息
      currentType: 1,
      // 表单验证规则
      rules: {
        peopleName: [
          {
            required: true,
            message: "请输入设计人",
            trigger: "blur",
          },
        ],
        department: [
          {
            required: true,
            message: "请选择设计部门",
            trigger: "change",
          },
        ],
        time: [
          {
            required: true,
            message: "请选择设计日期",
            trigger: "change",
          },
        ],
        peoplePhone: [
          {
            required: true,
            message: "请输入联系电话",
            trigger: "blur",
          },
        ],
        projectId: [
          {
            required: true,
            message: "请选择项目名称",
            trigger: "change",
          },
        ],
        purchaseContext: [
          {
            required: true,
            message: "请输入采购内容",
            trigger: "blur",
          },
        ],
        // priceControl: [{ required: true, message: '请输入上控价', trigger: 'blur' }],
        companyName: [
          {
            required: true,
            message: "请选择客户名称",
            trigger: "change",
          },
        ],
      },
      principalPersonList: [], // 设计部门列表
      currentData: [], // 当前行数据
      dataApproval: [], // 审批信息
      approvalUrl: "",
      activeKey: "1",
      approvalLoading: false,
      okLoading: false,
      // 上传地址
      uploadUrl: process.env.VUE_APP_API_BASE_URL + "/sys/common/upload",
      // 上传请求头
      headers: {
        "X-Access-Token": this.$ls.get("Access-Token"),
      },
      filesUrl: [], //合同文件上传列表
      pictureTempListImage: [],
      modelForm: {},
      visible1: false,
      disableMixinCreated: true,
      //0都不是 1方案 2选型
      schemeType: 0,
    }
  },
  computed: {
    commentType() {
      return (val) => {
        switch (val) {
          case 1:
            return "待审批"
          case 2:
            return "审批通过"
          case 3:
            return "审批不通过"
        }
      }
    },
    approveTypeTag() {
      return (val) => {
        switch (val) {
          case 1:
            return "orange"
          case 2:
            return "green"
          case 3:
            return "red"
        }
      }
    },
    projectType() {
      return (val) => {
        switch (val) {
          case 1:
            return "工程项目"
          case 2:
            return "渠道项目"
          case 3:
            return "产品销售"
          case 4:
            return "软件销售"
          case 5:
            return "软件定制"
        }
      }
    },
  },
  methods: {
    moment,
    setIcon(val) {
      if (val) {
        return "el-icon-check"
      } else {
        return "el-icon-time"
      }
    },
    setColor(val) {
      if (val) {
        return "#2bc418"
      } else {
        return "#b3bdbb"
      }
    },
    // 新增方案信息
    addPlanRow() {
      this.visible1 = true
    },
    closeModel() {
      this.visible1 = false
      this.modelForm = {}
    },
    handleOkModel() {
      if (this.currentType == 1 && this.modelForm.schemeType == 1) {
        this.$refs.engineering.add(this.modelForm.schemeType, this.formParams)
      } else if (this.currentType == 1 && this.modelForm.schemeType == 2) {
        this.$refs.software.add(this.modelForm.schemeType, this.formParams)
      } else {
        this.$refs.selectProduct.add(this.modelForm.schemeType, this.formParams)
      }
      this.visible1 = false
    },
    addProduct() {
      // this.type = 0
      this.visible1 = true
    },
    // 获取方案库列表
    getSchemeLibrary(id) {
      getLibrary({ projectId: id || this.formParams.projectId })
        .then((res) => {
          if (res.success) {
            if (this.currentType == 1) {
              this.formParams.schemeInfos = res.result.records
              console.log(this.formParams.schemeInfos)
            } else if (this.currentType == 2) {
              this.formParams.schemeProductInfos = res.result.records
            }
            this.$forceUpdate()
            this.closeModel()
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => {})
    },
    handleEditScheme(row, i, type) {
      console.log(row.type)
      if (row.type == 1) {
        // 工程方案
        this.$refs.engineering.edit(row, type)
      } else {
        // 软件方案
        this.$refs.software.edit(row, type)
      }
    },
    handleEditProSheme(row, i, type) {
      this.$refs.selectProduct.edit(row, type)
    },
    // 新增方案信息
    addRow() {
      this.tableData.push({
        detailName: "",
        position: "",
        technicalSpecifications: "",
        unit: "",
        num: 1,
        remark: "",
      })
    },
    // 批量删除
    batchPathDel: function (id) {
      let ids = this.selectedRowKeys.toString() || id
      let that = this
      console.log(ids)
      this.$confirm({
        title: "确认删除",
        content: "是否删除数据?",
        onOk: function () {
          that.loading = true
          deleteLibrary(ids)
            .then((res) => {
              if (res.success) {
                //重新计算分页问题
                that.reCalculatePage(that.selectedRowKeys.length)
                that.$message.success("删除成功")
                that.getSchemeLibrary(that.formParams.projectId)
                that.onClearSelected()
              } else {
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              that.loading = false
            })
        },
      })
    },
    // 删除方案信息
    handleDelete(row, index) {
      this.tableData.splice(index, 1)
    },
    // 获取部门树形
    getDepartmentList() {
      getDepartmentList().then((res) => {
        if (res.success) {
          this.principalPersonList = res.result
        }
      })
    },
    // 客户事件
    handelChangeCustomer(val, rows) {
      console.log(val, rows)
      this.$set(this.formParams, "customId", rows[0].id)
      // this.$set(this.formParams, 'customerName', rows[0].customName)
    },
    // 项目改变事件
    handelChange(value, rows) {
      console.log(rows)
      this.$set(this.formParams, "companyName", rows[0].customer) //客户名称
      this.$set(this.formParams, "customerName", rows[0].liaison) //联系人
      this.$set(this.formParams, "customerPhone", rows[0].phone) //联系电话
      this.$set(this.formParams, "inCharge", rows[0].inCharge)
      this.$set(this.formParams, "buildDate", rows[0].buildDate)
      this.$set(this.formParams, "amount", rows[0].amount)
      this.$set(this.formParams, "budget", rows[0].budget)
      this.$set(this.formParams, "projectType", rows[0].projectType)
      this.$set(this.formParams, "projectAddr", rows[0].projectAddr)
      this.$set(this.formParams, "outlines", rows[0].outlines)
      this.$set(this.formParams, "customId", rows[0].customer)
    },
    // 打开弹窗
    open() {
      this.getDepartmentList()
      //解决表格不对齐问题
      setTimeout(() => {
        this.visible = true
      }, 200)
      console.log("打开弹窗", this.formParams)
      this.getSchemeLibrary(this.formParams.projectId)
    },
    // 切换tab
    handleChange(key) {
      console.log(key)
      this.activeKey = key
      // this.formParams = {
      //   selectDepartment: this.$store.getters.userInfo.departIds, //当前选型部门id
      //   time: moment().format('YYYY-MM-DD HH:mm:ss'),
      //   selectTime: moment().format('YYYY-MM-DD HH:mm:ss'), //选型时间
      //   selectPeoplePhone: this.$store.getters.userInfo.phone, // 选型人电话
      //   selectPeopleName: this.$store.getters.userInfo.realname, //当前选型人
      //   pruductInfos: [],
      //   schemeInfos: [],
      //   schemeProductInfos: [],
      // }
      if (key == 2) {
        this.getApprovalInfo(this.currentData.typeId)
      }
      //  else {
      //   this.getSchemeLibrary(this.currentData.typeId)
      //   this.getDetail(this.currentData.typeId || this.currentData.id)
      // }
    },
    // 获取审批信息
    getApprovalInfo(typeId) {
      approvalInfo({ typeId: typeId, type: this.currentType }).then((res) => {
        if (res.success) {
          this.dataApproval = res.result
        }
      })
    },
    // 关闭弹窗，点击遮罩层或右上角叉或取消按钮时触发
    close() {
      this.visible = false
      this.visible1 = false
      this.isEditAction = false //关闭编辑
      // 重置表单
      this.$refs.ruleForm.resetFields()
      this.formParams = {
        selectDepartment: this.$store.getters.userInfo.departIds, //当前选型部门id
        selectTime: moment().format("YYYY-MM-DD HH:mm:ss"), //选型时间
        // peopleName: this.$store.getters.userInfo.realname, //当前名字
        // peopleId: this.$store.getters.userInfo.id, //当前名字id
        // department: this.$store.getters.userInfo.orgCodeTxt, //当前部门名称
        // peoplePhone: this.$store.getters.userInfo.phone, // 当前电话
        time: moment().format("YYYY-MM-DD HH:mm:ss"),
        selectPeoplePhone: this.$store.getters.userInfo.phone, // 选型人电话
        selectPeopleName: this.$store.getters.userInfo.realname, //当前选型人
        pruductInfos: [],
        schemeInfos: [{ name: "1" }],
        schemeProductInfos: [],
      }
      this.modelForm = {}
      this.tableData = []
      this.currentType = 1
      this.currentData = []
      this.filesUrl = ""
      this.pictureTempListImage = []
      this.activeKey = "1"
      this.selectedRowKeys = []
    },
    refreshAndClose() {
      this.close()
      this.$emit("refresh")
    },
    // 方案库导入
    handleImportLibrary() {
      this.$refs.importLibrary.open(1)
    },
    // 方案模板导入
    handleImportTempalte() {
      this.$refs.importTemplate.open(2)
    },
    // 添加方案
    // add(currentType, row) {
    //   console.log('添加方案', currentType, row)
    //   if (row && row.schemeId && [5, 6, 7, 8, 9].includes(row.flowStatus)) {
    //     this.type = 2 //详情
    //     this.$nextTick(() => {
    //       this.title = '详情'
    //       this.currentData = row // 当前行数据
    //       this.getDetail(row.schemeId)
    //       this.readOnly = true
    //       this.disableSubmit = true
    //     })
    //   } else if (row && row.schemeId) {
    //     this.type = 1 // 编辑模式
    //     this.currentData = row // 当前行数据
    //     this.getDetail(row.schemeId)
    //     this.readOnly = false
    //     this.disableSubmit = false
    //   } else {
    //     this.$set(this.formParams, 'amount', row.amount)
    //     this.$set(this.formParams, 'budget', row.budget)
    //     this.formParams = {
    //       ...this.formParams,
    //       inCharge: row.inCharge,
    //       buildDate: row.buildDate, //立项时间
    //       projectAddr: row.projectAddr, //项目地点
    //       amount: row.amount, //项目总额
    //       budget: row.budget, //项目概算
    //       outlines: row.outlines, //概要说明
    //       projectId: row.id, //*项目id
    //       projectName: row.projectName, //项目名称
    //       customLiaisonId: row.customLiaisonId, //客户联系人id
    //       customerName: row.liaison, //客户联系人
    //       customerPhone: row.phone, //客户联系人电话
    //       companyName: row.customName, //客户名称
    //       customId: row.customer, //客户id
    //       department: this.$store.getters.userInfo.departIds,
    //       type: 1,
    //     }
    //     // 当前为添加模式
    //     this.type = 0
    //     this.readOnly = false
    //     this.disableSubmit = false
    //   }
    //   console.log('type', this.type)
    //   this.currentType = currentType
    //   this.open()
    // },
    add(currentType, row) {
      console.log(row)
      this.currentData.typeId = row.id
      this.currentType = currentType
      if ([5, 6, 7, 8, 9].includes(row.flowStatus)) {
        this.$nextTick(() => {
          this.type = 2
          this.title = "详情"
          this.readOnly = true
          this.disableSubmit = true
        })
      } else {
        this.type = 0
        this.readOnly = false
        this.disableSubmit = false
      }
      this.formParams = {
        ...this.formParams,
        inCharge: row.inCharge,
        buildDate: row.buildDate, //立项时间
        projectAddr: row.projectAddr, //项目地点
        amount: row.amount, //项目总额
        budget: row.budget, //项目概算
        outlines: row.outlines, //概要说明
        projectId: row.id, //*项目id
        projectName: row.projectName, //项目名称
        customLiaisonId: row.customLiaisonId, //客户联系人id
        customerName: row.liaison, //客户联系人
        customerPhone: row.phone, //客户联系人电话
        companyName: row.customName, //客户名称
        customId: row.customer, //客户id
        department: this.$store.getters.userInfo.departIds,
        type: 1,
        priceControl: row.priceControl,
        flowStatus: row.flowStatus,
        projectType: row.projectType,
      }
      console.log("查看详情 this.formParams ", this.formParams)
      // this.readOnly = true
      // this.disableSubmit = true
      this.open()
    },

    // 添加方案并选型
    // addPlan(currentType, row) {
    //   console.log('添加方案并选型', currentType, row)
    //   if (row && row.schemeId && [5, 6, 7, 8, 9].includes(row.flowStatus)) {
    //     this.type = 2 //详情
    //     this.$nextTick(() => {
    //       this.title = '详情'
    //       this.currentData = row // 当前行数据
    //       this.getDetail(row.schemeId)
    //       this.readOnly = true
    //       this.disableSubmit = true
    //     })
    //   } else if (row && row.schemeId) {
    //     this.type = 1 // 编辑模式
    //     this.currentData = row // 当前行数据
    //     this.getDetail(row.schemeId)
    //     this.readOnly = false
    //     this.disableSubmit = false
    //   } else {
    //     this.formParams = {
    //       ...this.formParams,
    //       inCharge: row.inCharge,
    //       buildDate: row.buildDate, //立项时间
    //       projectAddr: row.projectAddr, //项目地点
    //       amount: row.amount, //项目总额
    //       budget: row.budget, //项目概算
    //       outlines: row.outlines, //概要说明
    //       projectId: row.id, //*项目id
    //       projectName: row.projectName, //项目名称
    //       customLiaisonId: row.customLiaisonId, //客户联系人id
    //       customerName: row.liaison, //客户联系人
    //       customerPhone: row.phone, //客户联系人电话
    //       companyName: row.customName, //客户名称
    //       customId: row.customer, //客户id
    //       department: this.$store.getters.userInfo.departIds,
    //       type: 2,
    //     }
    //     // 当前为添加方案并选型模式
    //     this.type = 3
    //     this.readOnly = false
    //     this.disableSubmit = false
    //   }

    //   this.currentType = currentType
    //   this.open()
    // },
    addPlan(currentType, row) {
      this.currentData.typeId = row.id
      this.currentType = currentType
      if ([5, 6, 7, 8, 9].includes(row.flowStatus)) {
        this.$nextTick(() => {
          this.type = 2 //详情
          this.title = "详情"
          this.readOnly = true
          this.disableSubmit = true
        })
      } else {
        this.type = 0
        this.readOnly = false
        this.disableSubmit = false
      }
      this.formParams = {
        ...this.formParams,
        inCharge: row.inCharge,
        buildDate: row.buildDate, //立项时间
        projectAddr: row.projectAddr, //项目地点
        amount: row.amount, //项目总额
        budget: row.budget, //项目概算
        outlines: row.outlines, //概要说明
        projectId: row.id, //*项目id
        projectName: row.projectName, //项目名称
        customLiaisonId: row.customLiaisonId, //客户联系人id
        customerName: row.liaison, //客户联系人
        customerPhone: row.phone, //客户联系人电话
        companyName: row.customName, //客户名称
        customId: row.customer, //客户id
        department: this.$store.getters.userInfo.departIds,
        type: 2,
        priceControl: row.priceControl,
        flowStatus: row.flowStatus,
        projectType: row.projectType,
      }
      // this.readOnly = true
      // this.disableSubmit = true
      this.open()
    },

    // 编辑
    edit(currentType, row) {
      console.log(row)
      this.currentData.typeId = row.id
      this.currentType = currentType
      this.title = "编辑"
      this.isEditAction = true //是否开启编辑
      this.formParams = {
        ...this.formParams,
        inCharge: row.inCharge,
        buildDate: row.buildDate, //立项时间
        projectAddr: row.projectAddr, //项目地点
        amount: row.amount, //项目总额
        budget: row.budget, //项目概算
        outlines: row.outlines, //概要说明
        projectId: row.id, //*项目id
        projectName: row.projectName, //项目名称
        customLiaisonId: row.customLiaisonId, //客户联系人id
        customerName: row.liaison, //客户联系人
        customerPhone: row.phone, //客户联系人电话
        companyName: row.customName, //客户名称
        customId: row.customer, //客户id
        department: this.$store.getters.userInfo.departIds,
        type: 1,
        priceControl: row.priceControl,
        flowStatus: row.flowStatus,
        projectType: row.projectType,
      }
      // this.readOnly = true
      // this.disableSubmit = true
      this.open()
    },

    // 详情
    detail(record) {
      this.type = 2
      this.getDetail(record.id)
      this.readOnly = true
      this.disableSubmit = true
      // 当前行数据
      this.currentData = record
      this.open()
    },
    // 审批详情
    async approvalDetail(record, currentType) {
      await this.getDetail(record.typeId)
      await this.getSchemeLibrary(record.typeId)
      this.$forceUpdate()
      this.readOnly = true
      this.disableSubmit = true
      this.currentData = record
      this.currentType = currentType || record.type
      // this.open()
      this.type = 4
      this.visible = true
    },

    // 获取详情
    getDetail(id) {
      getDetail(id).then((res) => {
        console.log("获取方案详情", res)
        if (res.success) {
          // this.formParams = res.result
          this.currentType = res.result.schemeType //当前类型
          // this.dataApproval = res.result.approves ? res.result.approves : [] //审批信息
          // 项目信息
          this.$set(this.formParams, "buildDate", res.result.buildDate)
          this.$set(this.formParams, "projectAddr", res.result.projectAddr)
          this.$set(this.formParams, "amount", res.result.amount)
          this.$set(this.formParams, "budget", res.result.budget)
          this.$set(this.formParams, "outlines", res.result.outlines)
          this.$set(this.formParams, "projectId", res.result.id) //项目id
          this.$set(this.formParams, "projectName", res.result.projectName)
          this.$set(this.formParams, "customerName", res.result.liaison) //客户联系人
          this.$set(this.formParams, "customerPhone", res.result.phone)
          this.$set(this.formParams, "companyName", res.result.customerName) //客户名称
          this.$set(this.formParams, "customId", res.result.customer) //客户id
          this.$set(this.formParams, "inCharge", res.result.inCharge)
          this.$set(this.formParams, "projectType", res.result.projectType)
        }
      })
    },

    //产品数据
    productData(data) {
      // console.log('产品数据-------', data)
      // 产品信息
      this.formParams.pruductInfos = data
    },

    // 方案数据
    planData(data) {
      // console.log('方案数据-------', data)
      // 方案数据
      this.formParams.schemeInfos = data
    },

    // 2通过/1不通过
    handleApprovalSub(type) {
      this.$refs.aprovalForm.type = type
      this.$refs.aprovalForm.open(type, this.currentData)
    },

    // 提交审批
    handleApproval() {
      console.log(this.formParams)
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let schemeInfo = []
          let schemeProductInfo = []
          if (this.currentType == 1) {
            schemeInfo = this.formParams.schemeInfos.map((item) => item.id) || []
          } else if (this.currentType == 2) {
            schemeProductInfo = this.formParams.schemeProductInfos.map((item) => item.id) || []
          }
          let data = {
            details: this.currentData.id, //方案id
            department: this.$store.getters.userInfo.orgCodeTxt, //部门名称
            people: this.$store.getters.userInfo.realname, //当前账号姓名
            // ...this.formParams,
            schemeInfos: schemeInfo.toString(),
            schemeProductInfos: schemeProductInfo.toString(),
            schemeType: this.currentType,
            projectId: this.formParams.projectId,
            amount: this.formParams.amount,
            budget: this.formParams.budget,
            priceControl: this.formParams.priceControl,
          }
          // if (this.type == 1) {
          //   this.approvalUrl = postEditApproval
          // } else if (this.type == 2) {
          //   this.approvalUrl = postDetailApproval
          // } else {
          //   this.approvalUrl = postAddApproval
          // }
          // 1编辑 2详情 0,3新增
          // let approvalUrl = this.type == 1 ? postEditApproval : this.type == 2 ? postDetailApproval : postAddApproval

          // type 1编辑 2详情 0,3新增
          // 情况一：方案信息
          // if (this.currentType == 1) {
          //   if (this.type == 1) {
          //     this.approvalUrl = postEditApproval
          //   } else if (this.type == 2) {
          //     this.approvalUrl = postDetailApproval
          //   } else {
          //     this.approvalUrl = postAddApproval
          //   }
          // }
          //  情况二：产品信息
          // else if (this.currentType == 2) {
          //   if (this.type == 1) {
          //     this.approvalUrl = productEditApproval //编辑
          //   } else if (this.type == 2) {
          //     this.approvalUrl = postDetailApproval //详情
          //   } else {
          //     this.approvalUrl = productAddApproval //新增
          //   }
          // }

          // console.log('审批----------', this.approvalUrl)
          this.approvalLoading = true
          submitLibraryApprove(data)
            .then((res) => {
              if (res.success) {
                this.$message.success(res.message)
                this.$emit("refresh")
              } else {
                this.$message.error(res.message)
              }
              this.close()
            })
            .finally(() => {
              setTimeout(() => {
                this.approvalLoading = false
              }, 2000)
            })
        }
      })
    },

    //提交
    handleOk() {
      console.log(this.formParams, this.type, this.currentType, this.formParams.schemeProductInfos)
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // 校验方案、产品信息是否为空
          // if (this.currentType == 1) {
          //   if (this.formParams.schemeInfos.length == 0) return this.$message.warning('请添加方案信息!')
          // } else if (this.currentType == 2) {
          //   if (this.formParams.pruductInfos.length == 0) return this.$message.warning('请添加产品信息!')
          // }
          // 校验是否完整填写产品信息
          // for (let keys in this.formParams.pruductInfos) {
          //   let list = this.formParams.pruductInfos[keys]
          //   // console.log(list.children)
          //   for (let key in list) {
          //     if (
          //       key !== 'totalAmount' &&
          //       key !== 'remark' &&
          //       key !== 'position' &&
          //       key !== 'approval' &&
          //       key !== 'createBy' &&
          //       key !== 'createTime' &&
          //       key !== 'currentPeopleId' &&
          //       key !== 'delFlag' &&
          //       key !== 'devops' &&
          //       key !== 'hasSerial' &&
          //       key !== 'paymentPeriod' &&
          //       key !== 'picUrl' &&
          //       key !== 'priceValid' &&
          //       key !== 'productClassify' &&
          //       key !== 'warranty' &&
          //       key !== 'updateTime' &&
          //       key !== 'updateBy' &&
          //       key !== 'supplyTime' &&
          //       key !== 'supplierId' &&
          //       key !== 'status' &&
          //       key !== 'serviceAddr' &&
          //       key !== 'serialNum' &&
          //       key !== 'secondary' &&
          //       key !== 'returnAddress' &&
          //       key !== 'products' &&
          //       key !== 'productType' &&
          //       key !== 'controlPoint' &&
          //       key !== 'supplierName' &&
          //       key !== 'prodName' &&
          //       key !== 'modelParameter' &&
          //       key !== 'brand' &&
          //       key !== 'id' &&
          //       key !== 'salesTotlePrice' &&
          //       key !== 'is_main' &&
          //       key !== 'updateBy' &&
          //       key !== 'updateTime' &&
          //       key !== 'trade' &&
          //       key !== 'model' &&
          //       key !== 'schemeId'
          //     ) {
          //       if (!list[key]) {
          //         return this.$message.warning('请完整填写带*的产品信息!')
          //       }
          //     }
          //   }
          //   if (list.children.length) {
          //     for (let keys in list.children) {
          //       let listChildren = list.children[keys]
          //       for (let key in listChildren) {
          //         if (
          //           key !== 'totalAmount' &&
          //           key !== 'children' &&
          //           key !== 'remark' &&
          //           key !== 'position' &&
          //           key !== 'is_main' &&
          //           key !== 'salesTotlePrice' &&
          //           key !== 'trade'
          //         ) {
          //           // console.log(listChildren)
          //           if (!listChildren[key]) {
          //             return this.$message.warning('请完整填写带*的产品信息!')
          //           }
          //         }
          //       }
          //     }
          //   }
          // }
          // for (let keys in this.formParams.schemeInfos) {
          //   let list = this.formParams.schemeInfos[keys]
          //   console.log(list.children)
          //   for (let key in list) {
          //     if (
          //       key !== 'totalAmount' &&
          //       key !== 'remark' &&
          //       key !== 'position' &&
          //       key !== 'paymentPeriod' &&
          //       key !== 'supplyTime' &&
          //       key !== 'supplierId' &&
          //       key !== 'serialNum' &&
          //       key !== 'products' &&
          //       key !== 'productType' &&
          //       key !== 'controlPoint' &&
          //       key !== 'supplierName' &&
          //       key !== 'prodName' &&
          //       key !== 'modelParameter' &&
          //       key !== 'brand' &&
          //       key !== 'id' &&
          //       key !== 'salesTotlePrice' &&
          //       key !== 'productId' &&
          //       key !== 'model' &&
          //       key !== 'supplier' &&
          //       key !== 'purchaseTotlePrice' &&
          //       key !== 'purchasePrice' &&
          //       key !== 'specification' &&
          //       key !== 'is_main' &&
          //       key !== 'price' &&
          //       key !== 'totalPrice' &&
          //       key !== 'updateBy' &&
          //       key !== 'updateTime' &&
          //       key !== 'trade' &&
          //       key !== 'delFlag' &&
          //       key !== 'allPrice' &&
          //       key !== 'isDeviateFrom' &&
          //       key !== 'supplierRemark' &&
          //       key !== 'productClassify' &&
          //       key !== 'schemeId'
          //     ) {
          //       if (!list[key]) {
          //         return this.$message.warning('请完整填写带*的方案信息!')
          //       }
          //     }
          //   }
          // }
          // let project = {
          //   buildDate: this.formParams.buildDate,
          //   projectAddr: this.formParams.projectAddr,
          //   amount: this.formParams.amount,
          //   budget: this.formParams.budget,
          //   outlines: this.formParams.outlines,
          //   projectId: this.formParams.projectId,
          //   projectName: this.formParams.projectName,
          //   customerName: this.formParams.customerName,
          //   customerPhone: this.formParams.customerPhone,
          //   companyName: this.formParams.companyName,
          //   customId: this.formParams.customId,
          //   inCharge: this.formParams.inCharge,
          //   projectType: this.formParams.projectType,
          // }
          let schemeInfo = []
          let schemeProductInfo = []
          if (this.currentType == 1) {
            schemeInfo = this.formParams.schemeInfos.map((item) => item.id) || []
          } else if (this.currentType == 2) {
            schemeProductInfo = this.formParams.schemeProductInfos.map((item) => item.id) || []
          }
          let data = {
            // ...this.formParams,
            schemeInfos: schemeInfo.toString() || [],
            schemeProductInfos: schemeProductInfo.toString() || [],
            schemeType: this.currentType,
            // project: project,
            projectId: this.formParams.projectId,
            amount: this.formParams.amount,
            budget: this.formParams.budget,
            priceControl: this.formParams.priceControl,
          }
          console.log(data)
          this.okLoading = true
          saveProject(data)
            .then((res) => {
              if (res.success) {
                this.$message.success(res.message)
                this.$emit("refresh")
              } else {
                this.$message.error(res.message)
              }
              this.close()
            })
            .finally(() => {
              setTimeout(() => {
                this.okLoading = false
              }, 2000)
            })
        } else {
          return false
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
.title {
  background-color: #f8faff;
  padding: 10px;
  margin-bottom: 10px;
  font-weight: 600;
}

.buttom {
  margin: 10px 5px;
}

// 隐藏上传的文件名称图标
// ::v-deep .ant-upload-list {
//   display: none;
// }
// ::v-deep .ant-upload-list-text {
//   display: none;
// }
// ::v-deep .ant-input-number-handler-wrap {
//   z-index: 0;
// }
// 表头前加*
.form-table-heard:before {
  content: "*";
  color: red;
}

.overflowStyle {
  // max-width: 250px !important;
  // max-height: 70px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-wrap: break-word;
  word-break: break-all;
  text-align: left;
}
</style>
