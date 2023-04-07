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
        <a-tabs default-active-key="1" @change="handleChangeTab">
          <!-- 报价单信息  -->
          <a-tab-pane key="1" :tab="this.type == 4 ? '采购详情' : this.type == 5 ? '报价单' : '利润表'">
            <!-- <a-tab-pane key="1" :tab="this.type == 4 ? '采购详情' : '报价单'"> -->
            <!-- <div id="print"> -->
            <div>
              <a-row>
                <a-col :span="24" class="title">报价人信息</a-col>
                <a-col :span="6">
                  <a-form-model-item label="报价人" prop="profitsPeopleName">
                    <a-input v-model="formParams.profitsPeopleName" placeholder="请输入报价人" :read-only="readOnly" />
                  </a-form-model-item>
                </a-col>

                <a-col :span="6">
                  <a-form-model-item label="报价人部门" prop="profitsDepartment">
                    <a-tree-select
                      v-model="formParams.profitsDepartment"
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
                  <a-form-model-item label="报价日期" prop="profitsTime">
                    <j-date
                      v-model="formParams.profitsTime"
                      :showTime="true"
                      dateFormat="YYYY-MM-DD"
                      :style="{ width: '100%' }"
                      placeholder="请选择报价日期"
                      :read-only="readOnly"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item label="联系电话" prop="profitsPeoplePhone">
                    <a-input
                      v-model="formParams.profitsPeoplePhone"
                      placeholder="请输入联系电话"
                      :read-only="readOnly"
                    />
                  </a-form-model-item>
                </a-col>
                <!-- <a-col :span="6">
            <a-form-model-item label="合同类型" prop="contractType">
              <j-dict-select-tag
                v-model="formParams.contractType"
                placeholder="请选择合同类型"
                dictCode="contract_type"
                :disabled="disableSubmit"
              />
            </a-form-model-item>
          </a-col> -->

                <a-col :span="24" class="title">项目信息</a-col>
                <a-col :span="12">
                  <a-form-model-item
                    label="客户名称"
                    prop="companyName"
                    :label-col="{ span: 4 }"
                    :wrapper-col="{ span: 19 }"
                  >
                    <a-textarea
                      v-model="formParams.companyName"
                      placeholder="请输入客户名称"
                      :rows="1"
                      :read-only="readOnly"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item
                    label="项目名称"
                    prop="projectId"
                    :label-col="{ span: 4 }"
                    :wrapper-col="{ span: 19 }"
                  >
                    <j-select-project
                      v-model="formParams.projectId"
                      :multi="false"
                      @change="handelChange"
                      :disabled="disableSubmit"
                    ></j-select-project>
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item label="联系人" prop="customerName">
                    <a-input v-model="formParams.customerName" placeholder="请输入联系人" :read-only="readOnly" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item label="联系电话" prop="customerPhone">
                    <a-input v-model="formParams.customerPhone" placeholder="请输入联系电话" :read-only="readOnly" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item label="负责人" prop="inCharge">
                    <a-input
                      v-if="formParams.chargeName"
                      v-model="formParams.chargeName"
                      placeholder="请输入负责人"
                      readOnly
                    />
                    <a-input v-else v-model="formParams.inCharge" placeholder="请输入负责人" readOnly />
                  </a-form-model-item>
                </a-col>
                <!-- <a-col :span="6">
                  <a-form-model-item label="方案编号" prop="schemeCode">
                    <a-input v-model="formParams.schemeCode" placeholder="请输入方案编号" readOnly />
                  </a-form-model-item>
                </a-col> -->
                <a-col :span="6">
                  <a-form-model-item label="立项时间" prop="buildDate">
                    <a-input v-model="formParams.buildDate" placeholder="请输入立项时间" readOnly />
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item label="项目总额" prop="amount">
                    <a-input-number
                      v-model="formParams.amount"
                      placeholder="请输入项目总额"
                      :readOnly="disableSubmit"
                      :style="{ width: '100%' }"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item label="项目概算" prop="budget">
                    <a-input-number
                      v-model="formParams.budget"
                      placeholder="请输入项目概算"
                      :readOnly="disableSubmit"
                      :style="{ width: '100%' }"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item label="项目类型" prop="projectType">
                    <span>{{ projectType(formParams.projectType) }}</span>
                  </a-form-model-item>
                </a-col>
                <a-col :span="24">
                  <a-form-model-item
                    label="项目地点"
                    prop="projectAddr"
                    :label-col="{ span: 2 }"
                    :wrapper-col="{ span: 21 }"
                  >
                    <a-textarea v-model="formParams.projectAddr" placeholder="请输入项目地点" readOnly />
                  </a-form-model-item>
                </a-col>
                <a-col :span="24">
                  <a-form-model-item
                    label="概要说明"
                    prop="outlines"
                    :label-col="{ span: 2 }"
                    :wrapper-col="{ span: 21 }"
                  >
                    <a-textarea v-model="formParams.outlines" placeholder="请输入概要说明" readOnly />
                  </a-form-model-item>
                </a-col>

                <a-col :span="24" class="title">产品信息</a-col>
                <a-col :span="6" v-if="[0, 1, 2].includes(this.type)">
                  <a-form-model-item label="上控价" prop="priceControl">
                    <template v-if="type != 2">
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
                <a-col :span="6">
                  <a-form-model-item label="采购内容" prop="purchaseContext">
                    <template v-if="type != 2">
                      <a-input
                        v-model="formParams.purchaseContext"
                        placeholder="请输入采购内容"
                        :disabled="disableSubmit"
                      />
                    </template>
                    <template v-else>{{ formParams.purchaseContext }}</template>
                  </a-form-model-item>
                </a-col>

                <a-col :span="24">
                  <template>
                    <a-button
                      class="buttom"
                      type="primary"
                      @click="addRow"
                      :disabled="[2].includes(this.type)"
                      v-if="![3, 4, 5].includes(this.type)"
                      >添加一行
                    </a-button>
                    <a-button
                      class="buttom"
                      type="primary"
                      @click="handleAdjustedProfit"
                      :disabled="this.selectedRowKeys.length == 0 || [2].includes(this.type)"
                      v-if="![3, 4, 5].includes(this.type)"
                      >调整利润率</a-button
                    >
                    <a-button
                      class="buttom"
                      type="primary"
                      :disabled="this.selectionRows.length == 0 || this.selectionRows.length > 1"
                      @click="handleHistory"
                      v-if="![3, 4, 5].includes(this.type)"
                      >查看产品历史报价
                    </a-button>
                    <a-upload
                      v-model="formParams.upload"
                      name="file"
                      :multiple="true"
                      accept=".xls, .xlsx"
                      :headers="headers"
                      @change="handleUp"
                      :action="uploadUrl"
                      :file-list="fileList"
                    >
                      <a-button
                        type="primary"
                        icon="upload"
                        :disabled="[2, 4].includes(this.type)"
                        v-if="![3, 4, 5].includes(this.type)"
                        >导入
                      </a-button>
                    </a-upload>
                    <a-button
                      class="buttom"
                      icon="download"
                      @click="download('产品信息模版', 'xls')"
                      :disabled="[2, 4].includes(this.type)"
                      v-if="![3, 4, 5].includes(this.type)"
                      >下载模板
                    </a-button>

                    <a-button
                      type="primary"
                      @click="handleMultiProduce"
                      class="buttom"
                      :disabled="[2, 4].includes(this.type)"
                      v-if="![3, 4, 5].includes(this.type)"
                      >批量添加产品
                    </a-button>

                    <!-- 表格区域 -->
                    <template v-if="![2, 3, 4, 5].includes(this.type)">
                      <!-- <a-form-model ref="tableformRef" :model="form"> -->
                      <a-col :span="24" :style="{ color: 'red', fontSize: '18px', padding: '5px' }">
                        提示：请填写带 * 的产品信息
                      </a-col>
                      <a-table
                        :columns="columns"
                        ref="tableformRef"
                        :data-source="dataSource"
                        bordered
                        :rowKey="(record) => record.key"
                        :scroll="{ x: true }"
                        :indentSize="10"
                        :pagination="false"
                        :row-selection="rowSelection"
                        :expanded-row-keys.sync="expandedRowKeys"
                        @expandedRowsChange="expandedRowsChange"
                        :disabled="disableSubmit"
                        class="table"
                      >
                        <div class="overflowStyle" slot="model" slot-scope="text, record">
                          <span style="white-space: pre-line">
                            {{ record.model }}
                          </span>
                        </div>
                        <div class="overflowStyle" slot="supplier" slot-scope="text, record">
                          <span style="white-space: pre-line">
                            {{ record.supplier }}
                          </span>
                        </div>

                        <span slot="titleDetailName" class="form-table-heard">细目名称</span>
                        <span slot="titleSpecifications" class="form-table-heard">技术规格、资质证书 </span>
                        <span slot="titleProductId" class="form-table-heard">产品名称 </span>
                        <span slot="titleSpecification" class="form-table-heard">规格参数 </span>
                        <span slot="titleModel" class="form-table-heard">型号 </span>
                        <span slot="titleSupplier" class="form-table-heard">供应商 </span>
                        <span slot="titleUnit" class="form-table-heard">单位 </span>
                        <span slot="titleNum" class="form-table-heard">数量 </span>
                        <span slot="titlePrice" class="form-table-heard">销售单价（元） </span>
                        <span slot="titleSalesTotlePrice" class="form-table-heard">销售合价（元） </span>
                        <span slot="titlePurchasePrice" class="form-table-heard">采购单价(元) </span>
                        <span slot="titlePurchaseTotlePrice" class="form-table-heard">采购合价(元) </span>
                        <span slot="titleGrossProfitRate" class="form-table-heard">毛利率 </span>

                        <!-- 名称 -->
                        <template #detailName="record, row" class="form-table-heard">
                          <a-tooltip placement="top" :title="row.detailName">
                            <a-input v-model="row.detailName" :style="{ width: '80%' }" :disabled="disableSubmit" />
                          </a-tooltip>
                        </template>
                        <template #code="record, row, index" class="form-table-heard">
                          <span>{{ formatCode(record, row, index) }}</span>
                        </template>
                        <!-- 安装位置 -->
                        <template #position="record, row">
                          <a-tooltip placement="top" :title="row.position">
                            <a-input v-model="row.position" :disabled="disableSubmit" />
                          </a-tooltip>
                        </template>
                        <template #technicalSpecifications="record, row">
                          <a-tooltip placement="top" :title="row.technicalSpecifications">
                            <a-input v-model="row.technicalSpecifications" :disabled="disableSubmit" />
                          </a-tooltip>
                        </template>
                        <!-- 规格参数 -->
                        <template #specification="record, row">
                          <!-- <template v-if="row.specification">
                            <a-popover placement="top">
                              <template slot="content">
                                <span>{{ row.specification }}</span>
                              </template>
                              <a-input v-model="row.specification" :read-only="true" />
                            </a-popover>
                          </template> -->
                          <a-tooltip placement="top" :title="row.specification">
                            <a-input v-model="row.specification" :read-only="true" />
                          </a-tooltip>
                        </template>
                        <!-- 单位 -->
                        <template #unit="record, row">
                          <a-input v-model="row.unit" :disabled="disableSubmit" />
                        </template>
                        <!-- 产品 -->
                        <template #productId="record, row, index">
                          <a-tooltip placement="top" :title="row.productName">
                            <a-input v-model="row.productName" :style="{ width: '60%' }" :read-only="true" />
                          </a-tooltip>
                          <a-button
                            type="link"
                            @click="handleChangeProduce(record, row, index)"
                            :style="{ float: 'right' }"
                            >选择
                          </a-button>
                        </template>
                        <!-- 数量 -->
                        <template #num="record, row, index">
                          <a-input-number
                            :default-value="1"
                            :min="0"
                            v-model="row.num"
                            :disabled="disableSubmit"
                            :style="{ width: '90%' }"
                            @change="changeNum(row, index)"
                          />
                        </template>
                        <!-- 销售单价 -->
                        <template #price="record, row, index">
                          <a-input-number
                            :defaultValue="0"
                            :precision="2"
                            :min="0"
                            v-model="row.price"
                            :disabled="!row.productId || disableSubmit"
                            @change="changeNum(row, index)"
                            :placeholder="row.productId ? `请输入` : `请先选产品`"
                          />
                        </template>
                        <!-- 备注 -->
                        <template #remark="record, row">
                          <a-tooltip placement="top" :title="row.remark">
                            <a-input v-model="row.remark" />
                          </a-tooltip>
                        </template>

                        <!-- 采购合价 -->
                        <!-- <template #salesTotlePrice="record, row">
                        {{ row.salesTotlePrice }}
                      </template> -->
                        <!-- 销售合价 -->
                        <!-- <template #purchaseTotlePrice="record, row">
                        {{ row.purchaseTotlePrice }}
                      </template> -->
                        <!-- 毛利率 -->
                        <template #grossProfitRate="record, row, index">
                          <!-- {{ formatGrossProfit(row) }} -->
                          <a-input-number
                            @change="changeGrossProfitRate($event, row, index)"
                            :value="row.grossProfitRate"
                            :default-value="0"
                            :precision="4"
                            :step="0.0001"
                            :max="0.99"
                            :min="0"
                            :style="{ width: '90%' }"
                            :disabled="!row.productId || disableSubmit"
                            :placeholder="row.productId ? `请输入` : `请先选产品`"
                          />
                        </template>
                        <!-- 采购单价 -->
                        <template #purchasePrice="record, row, index">
                          <a-input-number
                            @change="changeNum(row, index)"
                            v-model="row.purchasePrice"
                            :precision="2"
                            :step="0.01"
                            :min="0"
                            :style="{ width: '90%' }"
                            :disabled="!row.productId || disableSubmit"
                            :placeholder="row.productId ? `请输入` : `请先选产品`"
                          />
                        </template>
                        <template #action="record, row, index">
                          <template v-if="row.children">
                            <a
                              href="javascript:;"
                              @click="addCurrentRow(row, index)"
                              :disabled="disableSubmit || !row.productId"
                              >增加下级
                            </a>
                            <a-divider type="vertical" />
                            <a href="javascript:;" @click="deleteCurrentRow(row, index)" :disabled="disableSubmit"
                              >删除
                            </a>
                          </template>
                          <template v-else>
                            <!-- 这是children里数据的删除 -->
                            <a href="javascript:;" @click="deleteRow(row, index)" :disabled="disableSubmit">删除</a>
                          </template>
                        </template>
                      </a-table>

                      <div class="subtotal">
                        <div class="left">汇总</div>
                        <div class="number"></div>
                        <div class="number"></div>
                        <div class="number"></div>
                        <div class="number"></div>
                        <div class="number"></div>
                        <div class="number"></div>
                        <div class="number"></div>
                        <div class="number"></div>
                        <div class="number"></div>
                        <div class="number"></div>
                        <!-- 采购合价 -->
                        <div class="number">{{ formatPurchasePrice }}</div>
                        <div class="number"></div>
                        <div class="number"></div>
                        <!-- 销售合价 -->
                        <div class="number">{{ formatSalePrice }}</div>
                        <div class="number"></div>
                        <div class="number" :style="{ width: '185px' }"></div>
                      </div>
                      <!-- </a-form-model> -->
                    </template>

                    <!-- 详情表格 -->
                    <template v-else>
                      <a-table
                        :columns="columnsDetail"
                        :data-source="dataSource"
                        bordered
                        ref="tableformRef"
                        rowKey="key"
                        :scroll="{ x: true }"
                        :indentSize="10"
                        :pagination="false"
                        :row-selection="rowSelection"
                        :expanded-row-keys.sync="expandedRowKeys"
                        @expandedRowsChange="expandedRowsChange"
                        :disabled="disableSubmit"
                      >
                        <div class="overflowStyle" slot="technicalSpecifications" slot-scope="text, record">
                          <span style="white-space: pre-line">
                            {{ record.technicalSpecifications }}
                          </span>
                        </div>
                        <div class="overflowStyle" slot="specification" slot-scope="text, record">
                          <span style="white-space: pre-line">
                            {{ record.specification }}
                          </span>
                        </div>
                        <div class="overflowStyle" slot="detailName" slot-scope="text, record">
                          <span style="white-space: pre-line">
                            {{ record.detailName }}
                          </span>
                        </div>
                        <div class="overflowStyle" slot="position" slot-scope="text, record">
                          <span style="white-space: pre-line">
                            {{ record.position }}
                          </span>
                        </div>
                        <div class="overflowStyle" slot="model" slot-scope="text, record">
                          <span style="white-space: pre-line">
                            {{ record.model }}
                          </span>
                        </div>
                        <div class="overflowStyle" slot="supplier" slot-scope="text, record">
                          <span style="white-space: pre-line">
                            {{ record.supplier }}
                          </span>
                        </div>
                        <div class="overflowStyle" slot="remark" slot-scope="text, record">
                          <span style="white-space: pre-line">
                            {{ record.remark }}
                          </span>
                        </div>
                        <!-- 产品名称 -->
                        <div class="overflowStyle" slot="productId" slot-scope="text, record">
                          <span style="white-space: pre-line">
                            {{ record.productName }}
                          </span>
                        </div>
                      </a-table>
                      <div class="subtotal">
                        <div class="left">汇总</div>
                        <div class="number"></div>
                        <div class="number"></div>
                        <div class="number"></div>
                        <div class="number"></div>
                        <div class="number"></div>
                        <div class="number"></div>
                        <div class="number"></div>
                        <div class="number"></div>
                        <div class="number"></div>
                        <div class="number"></div>
                        <!-- 采购合价 -->
                        <div class="number">{{ formatPurchasePrice }}</div>
                        <div class="number"></div>
                        <div class="number"></div>
                        <!-- 销售合价 -->
                        <div class="number">{{ formatSalePrice }}</div>
                        <div class="number"></div>
                        <div class="number" :style="{ width: '120px' }"></div>
                      </div>
                    </template>
                  </template>
                </a-col>
              </a-row>
            </div>
          </a-tab-pane>

          <a-tab-pane key="2" tab="审批信息" v-if="this.type == 3 || this.type == 2">
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
          </a-tab-pane>

          <!-- 采购单 -->
          <template v-if="this.type == 4">
            <a-tab-pane key="2" tab="采购单" force-render>
              <a-row>
                <a-col :span="24" class="title">采购单信息</a-col>
                <a-col :span="24">
                  <!-- 采购单组件-->
                  <procurement-detail
                    ref="procurementDetail"
                    :dataSourcePurchase="this.dataSourcePurchase"
                    @refreshClose="refreshClose"
                  >
                  </procurement-detail>
                </a-col>
              </a-row>
            </a-tab-pane>
          </template>
        </a-tabs>
      </a-form-model>
    </a-spin>

    <div class="drawer-bootom-button">
      <template v-if="![2, 3, 4, 5].includes(this.type)">
        <!-- 已选型/不通过状态才能发起审批 -->
        <a-button
          @click="handleApproval"
          :loading="approvalLoading"
          type="primary"
          class="sub-button"
          :disabled="[7, 8].includes(this.currentData.flowStatus)"
        >
          提交审批
        </a-button>
        <a-button
          @click="handleOk(1)"
          :loading="okLoading"
          type="primary"
          :disabled="[7, 8].includes(this.currentData.flowStatus)"
          class="sub-button"
          >保存
        </a-button>
      </template>
      <a-button @click="close">取消</a-button>
    </div>

    <div class="drawer-bootom-button" v-if="this.type == 3">
      <a-button
        key="submit"
        type="primary"
        :loading="loading"
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
        style="margin-right: 0.8rem"
        :disabled="this.currentData.status !== 1"
        >不通过
      </a-button>
      <a-button @click="close">取消</a-button>
    </div>
    <ApprovalSubmit ref="aprovalForm" @refreshClose="refreshClose"></ApprovalSubmit>

    <!-- 选审批流程 2项目利润详情/4采购列表详情-->
    <div class="drawer-bootom-button" v-if="[2].includes(this.type)">
      <!-- 已选型/不通过状态才能发起审批 -->
      <!-- <a-button @click="handleApproval" type="primary" :disabled="![3, 4].includes(this.status)" class="sub-button">
        审批
      </a-button> -->
      <a-button @click="handleProfitPrint" type="primary" class="sub-button">导出pdf</a-button>
      <a-button @click="close">取消</a-button>
    </div>

    <!-- 报价单打印 -->
    <div class="drawer-bootom-button" v-if="[5].includes(this.type)">
      <a-button @click="handlePrint" type="primary" class="sub-button" icon="download">导出pdf</a-button>
      <a-button @click="handleExport('报价单')" type="primary" icon="download">导出excel</a-button>
    </div>

    <!-- 产品弹窗单选 -->
    <add-materials-dialog
      ref="materialRForm"
      :listUrl="`/jeecg-supplier/prodProductEntrepot/list`"
      :treeType="2"
      @select="handleSelectData"
      paramMode="query"
      modalTitle="选择产品"
      rowKey="id"
    >
    </add-materials-dialog>

    <!-- 产品弹窗多选 -->
    <add-materials-dialog
      ref="multiSelectForm"
      :listUrl="`/jeecg-supplier/prodProductEntrepot/list`"
      :treeType="2"
      @select="handleMultiSelectData"
      paramMode="query"
      modalTitle="选择产品"
      rowKey="id"
      selectType="checkbox"
    >
    </add-materials-dialog>

    <!-- 调整利率 -->
    <adjust-rate ref="rateFrom" @changeProfit="changeProfit"></adjust-rate>
    <!-- 报价历史 -->
    <product-historical-dialog ref="historyFrom" />

    <!-- 打印预览 -->
    <Print
      ref="print"
      :data="this.formParams"
      :proInfo="this.dataSource"
      :columnsDetail="columnsDetail"
      :type="this.type"
    ></Print>

    <!-- 利润表打印 -->
    <ProfitPrintDialog
      ref="profitPrint"
      :data="this.formParams"
      :proInfo="this.dataSource"
      :columnsDetail="columnsDetail"
    ></ProfitPrintDialog>

    <!-- 导出报价表 -->
    <ExportDialog ref="export"></ExportDialog>

    <!-- 选择导出报价表pdf版本 -->
    <SelectPrintDialog
      ref="selectPrint"
      :data="this.formParams"
      :proInfo="this.dataSource"
      :columnsDetail="columnsDetail"
    ></SelectPrintDialog>
  </j-modal>
</template>

<script>
// API
import {
  addprodProfits,
  editprodProfits,
  getDetail,
  getQuotationDetail,
  getDepartmentList,
  getProjectList,
  addApproval,
  editApproval,
  detailApproval,
  submitApproval,
} from "@/api/project-management/foreign-price-management/ProjectProfit.js"
import { getPurchaseOrder, getProcurementListDetail } from "@/api/procurement/ProcurementList.js"
// 组件
import AddMaterialsDialog from "@/components/ProductList"
import ProcurementDetail from "@/views/project-management/procurement/procurement-list/components/ProcurementDetail.vue"
import AdjustRate from "./AdjustRate.vue"
import ProductHistoricalDialog from "./ProductHistoricalDialog.vue"
import Print from "./PrintDiloag.vue"
import ProfitPrintDialog from "./ProfitPrintDialog.vue"
import ExportDialog from "./ExportDialog.vue"
import SelectPrintDialog from "./SelectPrintDialog.vue"
import JSelectProject from "@/views/scrm/modules/JSelectProject"
import ApprovalSubmit from "@/components/ApprovalDialog/ApprovalSubmit.vue"
// 导入
import ImportExcelModal from "@/components/ImportExcelModal"
// 混入
import { TableListMixin } from "@/mixins/TableListMixin"
// 数组对象去重
import { uniqBy, uniq, isEmpty } from "lodash"
import moment from "dayjs"
import * as XLSX from "xlsx/xlsx.mjs"
export default {
  components: {
    AddMaterialsDialog,
    ImportExcelModal,
    AdjustRate,
    ProductHistoricalDialog,
    ProcurementDetail,
    Print,
    ProfitPrintDialog,
    ExportDialog,
    SelectPrintDialog,
    JSelectProject,
    ApprovalSubmit,
  },
  mixins: [TableListMixin],
  props: {
    // 是否展示审核tab
    is_ApprovalInfo: {
      type: Boolean,
      default: false,
    },
    // 产品详情表格
    columnsDetail: {
      type: Array,
      default: () => [
        {
          title: "编号",
          dataIndex: "codeNum",
          width: 80,
          align: "center",
          ellipsis: true,
        },
        {
          title: "安装位置",
          dataIndex: "position",
          width: 120,
          ellipsis: true,
          align: "center",
          scopedSlots: { customRender: "position" },
        },
        {
          title: "细目名称",
          dataIndex: "detailName",
          width: 120,
          ellipsis: true,
          align: "center",
          scopedSlots: { customRender: "detailName" },
        },
        {
          title: "技术规格、资质证书",
          dataIndex: "technicalSpecifications",
          width: 150,
          align: "center",
          ellipsis: true,
          scopedSlots: { customRender: "technicalSpecifications" },
        },
        {
          title: "规格参数",
          dataIndex: "specification",
          width: 150,
          ellipsis: true,
          align: "center",
          scopedSlots: { customRender: "specification" },
        },
        {
          title: "产品名称",
          dataIndex: "productName",
          width: 200,
          ellipsis: true,
          align: "center",
          scopedSlots: { customRender: "productId" },
        },
        {
          title: "供应商",
          dataIndex: "supplier",
          width: 150,
          ellipsis: true,
          align: "center",
          scopedSlots: { customRender: "supplier" },
        },
        {
          title: "型号",
          dataIndex: "model",
          width: 130,
          align: "center",
          ellipsis: true,
          scopedSlots: { customRender: "model" },
        },
        {
          title: "单位",
          dataIndex: "unit",
          width: 130,
          align: "center",
          ellipsis: true,
        },
        {
          title: "数量",
          dataIndex: "num",
          width: 120,
          align: "center",
          ellipsis: true,
        },
        {
          title: "采购单价(元)",
          dataIndex: "purchasePrice",
          width: 170,
          align: "center",
          ellipsis: true,
        },
        {
          title: "采购合价(元)",
          dataIndex: "purchaseTotlePrice",
          width: 170,
          align: "center",
          ellipsis: true,
        },
        {
          title: "毛利率",
          dataIndex: "grossProfitRate",
          width: 150,
          align: "center",
          ellipsis: true,
        },
        {
          title: "销售单价（元）",
          dataIndex: "price",
          width: 150,
          ellipsis: true,
          align: "center",
        },
        {
          title: "销售合价（元）",
          dataIndex: "salesTotlePrice",
          width: 150,
          ellipsis: true,
          align: "center",
        },
        {
          title: "备注",
          dataIndex: "remark",
          width: 200,
          ellipsis: true,
          align: "center",
          scopedSlots: { customRender: "remark" },
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          fixed: "right",
          scopedSlots: { customRender: "action" },
        },
      ],
    },
  },
  data() {
    return {
      // 开关
      visible: false,
      // 加载动画开关
      loading: false,
      approvalLoading: false,
      okLoading: false,
      // 是否禁用
      disableSubmit: false,
      readOnly: false,
      // 标题
      title: "新增",
      // 当前模式 0-添加 1-编辑 2-详情  3-办公处理详情 4-采购单详情 5-报价单
      type: 0,
      // 表单配置
      labelCol: { span: 8 },
      wrapperCol: { span: 15 },
      // 表单参数
      formParams: {
        selectPeopleName: this.$store.getters.userInfo.realname, //当前选型人
        selectPeopleId: this.$store.getters.userInfo.id, //当前选型人id
        profitsPeopleId: this.$store.getters.userInfo.id, //当前报价人id
        profitsDepartment: this.$store.getters.userInfo.departIds, //当前报价部门id
        selectDepartment: this.$store.getters.userInfo.departIds, //当前选型部门id
        department: this.$store.getters.userInfo.departIds, //当前部门id
        profitsPeoplePhone: this.$store.getters.userInfo.phone, // 当前电话
        profitsPeopleName: this.$store.getters.userInfo.realname, // 当前人
        selectPhone: this.$store.getters.userInfo.phone, // 选型人电话
        profitsTime: moment().format("YYYY-MM-DD HH:mm:ss"),
        selectTime: moment().format("YYYY-MM-DD HH:mm:ss"), //选型时间
        project: {
          inCharge: "",
          buildDate: "",
          projectAddr: "",
          amount: "",
          budget: "",
          outlines: "",
          projectId: "",
          projectName: "",
          customLiaisonId: "",
          customerName: "",
          customerPhone: "",
          companyName: "",
          customId: "",
          projectType: "",
          department: "",
        },
      },
      // 汇总采购合价
      formatPurchasePrice: 0,
      // 汇总销售合价
      formatSalePrice: 0,
      currnetIndex: "", //当前表格选中的下标
      currnetRow: "", //当前表格选中的行数据
      disableMixinCreated: true, //不执行混入
      // rowSelection:'',
      expandedRowKeys: [],
      // 表格配置
      columns: [
        {
          title: "编号",
          dataIndex: "codeNum",
          align: "center",
          width: 80,
          ellipsis: true,
          // scopedSlots: { customRender: 'code' }
          // customRender(text, row, index) {
          //   return index + 1
          // }
        },
        {
          title: "安装位置",
          dataIndex: "position",
          width: 120,
          key: "position",
          ellipsis: true,
          scopedSlots: { customRender: "position" },
          align: "center",
        },
        {
          // title: '细目名称',
          dataIndex: "detailName",
          width: 120,
          key: "detailName",
          // ellipsis: true,
          scopedSlots: { customRender: "detailName" },
          slots: { title: "titleDetailName" }, //表头插槽
          align: "center",
        },
        {
          // title: '技术规格、资质证书(必填)',
          dataIndex: "technicalSpecifications",
          width: 150,
          key: "technicalSpecifications",
          ellipsis: true,
          scopedSlots: { customRender: "technicalSpecifications" },
          slots: { title: "titleSpecifications" }, //表头插槽
          align: "center",
        },
        {
          // title: '规格参数(必填)',
          dataIndex: "specification",
          width: 150,
          ellipsis: true,
          key: "specification",
          scopedSlots: { customRender: "specification" },
          slots: { title: "titleSpecification" }, //表头插槽
          align: "center",
        },
        {
          // title: '产品名称(必填)',
          dataIndex: "productId",
          width: 200,
          key: "productId",
          ellipsis: true,
          scopedSlots: { customRender: "productId" },
          slots: { title: "titleProductId" }, //表头插槽
          align: "center",
        },
        {
          // title: '供应商(必填)',
          dataIndex: "supplier",
          width: 150,
          ellipsis: true,
          key: "supplier",
          scopedSlots: { customRender: "supplier" },
          slots: { title: "titleSupplier" }, //表头插槽
          align: "center",
        },
        {
          // title: '型号(必填)',
          dataIndex: "model",
          width: 130,
          ellipsis: true,
          key: "model",
          scopedSlots: { customRender: "model" },
          slots: { title: "titleModel" }, //表头插槽
          align: "center",
        },
        {
          // title: '单位(必填)',
          dataIndex: "unit",
          width: 130,
          key: "unit",
          ellipsis: true,
          scopedSlots: { customRender: "unit" },
          slots: { title: "titleUnit" }, //表头插槽
          align: "center",
        },
        {
          // title: '数量(必填)',
          dataIndex: "num",
          width: 120,
          ellipsis: true,
          key: "num",
          scopedSlots: { customRender: "num" },
          slots: { title: "titleNum" }, //表头插槽
          align: "center",
        },
        {
          // title: '采购单价(元)(必填)',
          dataIndex: "purchasePrice",
          width: 170,
          ellipsis: true,
          key: "purchasePrice",
          slots: { title: "titlePurchasePrice" }, //表头插槽
          align: "center",
          scopedSlots: { customRender: "purchasePrice" },
        },
        {
          // title: '采购合价(元)(必填)',
          dataIndex: "purchaseTotlePrice",
          width: 170,
          ellipsis: true,
          key: "purchaseTotlePrice",
          slots: { title: "titlePurchaseTotlePrice" }, //表头插槽
          align: "center",
          // scopedSlots: { customRender: 'purchaseTotlePrice' },
        },
        {
          // title: '毛利率(必填)',
          dataIndex: "grossProfitRate",
          width: 150,
          ellipsis: true,
          key: "grossProfitRate",
          scopedSlots: { customRender: "grossProfitRate" },
          slots: { title: "titleGrossProfitRate" }, //表头插槽
          align: "center",
        },
        {
          // title: '销售单价（元）(必填)',
          dataIndex: "price",
          width: 150,
          ellipsis: true,
          key: "price",
          scopedSlots: { customRender: "price" },
          slots: { title: "titlePrice" }, //表头插槽
          align: "center",
        },
        {
          // title: '销售合价（元）(必填)',
          dataIndex: "salesTotlePrice",
          width: 150,
          ellipsis: true,
          key: "salesTotlePrice",
          // scopedSlots: { customRender: 'salesTotlePrice' }
          slots: { title: "titleSalesTotlePrice" }, //表头插槽
          align: "center",
        },
        {
          title: "备注",
          dataIndex: "remark",
          width: 200,
          ellipsis: true,
          key: "remark",
          align: "center",
          scopedSlots: { customRender: "remark" },
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          fixed: "right",
          scopedSlots: { customRender: "action" },
        },
      ],

      // 表格数据
      dataSource: [],
      // 审批表格数据
      dataApproval: [],
      url: {
        importUrl: ``, //导入
        downloadGetUrl: "/prodProfits/model", //下载模板
        exportXlsUrl: "/jeecg-supplier/prodProfits/model", //导出
      },
      // 表单验证规则
      rules: {
        projectId: [{ required: true, message: "请选择项目名称", trigger: "blur" }],
        purchaseContext: [{ required: true, message: "请输入采购内容", trigger: "blur" }],
        // priceControl: [{ required: true, message: '请输入上控价', trigger: 'blur' }],
        // department: [{ required: true, message: '请选择设计部门', trigger: 'change' }],
        // phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }, { validator: this.validateMobile }],
      },
      projectList: [], //项目信息
      principalPersonList: [], // 设计部门列表
      dataFristLeval: [], // 表格数据的第一层
      approvalId: "", //当前id，传给审批
      fileList: [], //文件数据
      // 上传地址
      uploadUrl: process.env.VUE_APP_API_BASE_URL + "/sys/common/upload",
      // 上传请求头
      headers: {
        "X-Access-Token": this.$ls.get("Access-Token"),
      },
      btnState: false,
      // 字段对应的表头（必须一一对应）
      character: {
        detailName: {
          text: "细目名称",
          type: "string",
        },
        technicalSpecifications: {
          text: "投标文件要求的技术规格、资料证书",
          type: "string",
        },
        unit: {
          text: "单位",
          type: "string",
        },
        num: {
          text: "数量",
          type: "string",
        },
        // position: {
        //   text: '安装位置',
        //   type: 'string'
        // },
        remark: {
          text: "备注",
          type: "string",
        },
        is_main: {
          text: "是否主材",
          type: "string",
        },
      },
      code: "", //查看采购单列表标识
      dataSourcePurchase: [], //采购单数据
      status: "", //可以审批的标识 status=4（已选型状态）
      currentData: [],
    }
  },

  computed: {
    // 计算采购合价 数量*采购单价purchasePrice
    format() {
      return (row) => {
        if (row.num && row.purchasePrice) {
          return Number(row.num * row.purchasePrice).toFixed(2)
        } else {
          return 0
        }
      }
    },
    // 销售合价salesTotlePrice = 数量*销售单价:price
    formatSalesPrice() {
      return (row) => {
        if (row.num && row.price) {
          return Number(row.num * row.price).toFixed(2)
        } else {
          return 0
        }
      }
    },
    // 毛利率=(销售合价salesTotlePrice-采购合价purchaseTotlePrice)/销售合价
    formatGrossProfit() {
      return (row) => {
        if (row.num && row.salesTotlePrice && row.purchaseTotlePrice) {
          return Number((row.salesTotlePrice - row.purchaseTotlePrice) / row.salesTotlePrice).toFixed(2)
        } else {
          return 0
        }
      }
    },
    rowSelection() {
      const { selectedRowKeys } = this
      return {
        selectedRowKeys,
        onChange: this.onSelectChange,
        hideDefaultSelections: true,
        onSelect: this.onSelect, //触发级联的方法
        fixed: true,
      }
    },
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
  watch: {
    // 监听滚动条(把表格的滚动条隐藏了，只显示一条滚动条，监听滚动条滚动的时候，表格和尾部可以一起滑动)
    dataSource: {
      handler(val) {
        if (val) {
          console.log(val)
          this.formatPurchasePrice = val.reduce((p, c) => p + Number(c.purchaseTotlePrice), 0).toFixed(2)
          this.formatSalePrice = val.reduce((p, c) => p + Number(c.salesTotlePrice), 0).toFixed(2)
          let purchaseTotlePrice = 0
          let salesTotlePrice = 0
          let data = val.forEach((item) => {
            console.log(item)
            if (item.children) {
              console.log(item.children)
              purchaseTotlePrice = item.children.reduce((p, c) => p + Number(c.purchaseTotlePrice), 0).toFixed(2)
              salesTotlePrice = item.children.reduce((p, c) => p + Number(c.salesTotlePrice), 0).toFixed(2)
              console.log("purchaseTotlePrice", purchaseTotlePrice, this.formatPurchasePrice)
              this.formatPurchasePrice = (Number(this.formatPurchasePrice) + Number(purchaseTotlePrice)).toFixed(2)
              this.formatSalePrice = (Number(this.formatSalePrice) + Number(salesTotlePrice)).toFixed(2)
            }
          })

          const dom = this.$refs.tableformRef.$el.getElementsByClassName("ant-table-body")[0]
          const footerDom = document.getElementsByClassName("subtotal")[0]
          footerDom.addEventListener(
            "scroll",
            () => {
              dom.scrollLeft = footerDom.scrollLeft
            },
            true
          )
        }
      },
      deep: true,
      // immediate: true,
    },
  },
  methods: {
    moment,
    // 2通过/1不通过
    handleApprovalSub(type) {
      this.$refs.aprovalForm.type = type
      this.$refs.aprovalForm.open(type, this.approvalId)
    },
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
    formatCode(record, row, index) {
      let i = index + 1
      return i
    },

    // 导出
    handleExport(fileName) {
      this.$refs.export.open(fileName, this.approvalId)
    },

    // 读取
    fileFile(file) {
      return new Promise((resolve) => {
        let reader = new FileReader()
        reader.readAsBinaryString(file)
        reader.onload = (ev) => {
          resolve(ev.target.result)
        }
      })
    },

    async handleUp(info) {
      this.fileList = info.fileList
      //如果没有数据
      if (info.file.response && info.file.response.message == null) {
        this.btnState = true
      }
      // 有数据并且填写正确
      if (info.file.response && info.file.response.message != null) {
        this.btnState = false

        let data = await this.fileFile(info.file.originFileObj)

        let workbook = XLSX.read(data, { type: "binary" }) //读取二进制数据
        console.log(workbook)

        let worksheet = workbook.Sheets[workbook.SheetNames[0]]
        data = XLSX.utils.sheet_to_json(worksheet)
        console.log(data)
        let arr = []
        data.forEach((item, index) => {
          let obj = {}
          for (let key in this.character) {
            if (!this.character.hasOwnProperty(key)) break
            let v = this.character[key]
            let text = v.text
            let type = v.type
            v = item[text] || ""
            type === "string" ? (v = String(v)) : null
            type === "number" ? (v = Number(v)) : null
            obj[key] = v
          }

          arr.push(obj)
        })

        // *如果是主材，就加上children
        let newData = arr.map((item, index) => {
          // 给每一项先设置一个随机key
          let currentKey = Math.random()
          item.key = Math.floor(currentKey * 1000)
          item.is_import = true
          item.position = ""
          item.specification = ""
          item.model = ""
          item.supplier = ""
          item.productId = null
          item.price = 0
          item.salesTotlePrice = 0
          item.purchasePrice = 0
          item.purchaseTotlePrice = 0
          item.grossProfitRate = 0
          let firstLeval = []
          // if (item.is_main == '是') {
          //   firstLeval[index] = item
          //   firstLeval[index].children = []
          // }
          firstLeval[index] = item
          firstLeval[index].children = []
        })

        // 插入导入的数据
        // this.insert(arr)
        // 给表格添加导入的值
        this.dataSource.push(...arr)
        console.log(this.dataSource)

        this.list = info.file.response.message
      } else if (info.file.response && info.file.response.message != null && this.fileList.length > 0) {
        // 如果填写错误
        // this.fileList.splice(0)
        const h = this.$createElement
        this.$error({
          title: "提醒",
          content: h("div", {}, [h("p", `${info.file.response.message}`), h("p", "请确认无误后重新上传")]),
        })
      }
      // this.fileList =[]
    },

    // *把当前行数据插入到导入的上一个有children的数据里
    insert(arr) {
      arr.forEach((item, index) => {
        // if (item.remark == '主材') {
        if (item.is_main == "是") {
          let i = index + 1
          if (arr[i] && arr[i].is_main !== "是") {
            arr[index].children.push(arr[i])
            arr.splice(i, 1)
          }
        } else {
          return this.insert(arr)
        }
      })
      return arr
    },

    validateMobile(rule, value, callback) {
      if (!value || new RegExp(/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/).test(value)) {
        callback()
      } else {
        callback("您的手机号码格式不正确!")
      }
    },

    onSelectChange(selectedRowKeys, selectionRows) {
      console.log("selectedRowKeys changed: ", selectedRowKeys, selectionRows)
      this.selectedRowKeys = uniqBy(selectedRowKeys) //选中的key
      this.selectionRows = selectionRows //选中的表格数据
    },
    onSelect(record, selected) {
      //每个复选框点击都会触发
      const selectrows = [record.key]
      if (record.hasOwnProperty("children")) {
        const generator = (record) => {
          //这里做一个递归查找
          record.forEach((item) => {
            selectrows.push(item.key)

            if (item.children && item.children.length > 0) {
              generator(item.children)
            }
          })
        }
        generator(record.children)
      }
      const newselect = this.selectedRowKeys.filter((item) => !selectrows.includes(item))
      //选中和取消选中的级联
      selected ? (this.selectedRowKeys = [...this.selectedRowKeys, ...selectrows]) : (this.selectedRowKeys = newselect)
    },

    // 获取部门树形
    getDepartmentList() {
      getDepartmentList().then((res) => {
        if (res.success) {
          this.principalPersonList = res.result
        }
      })
    },

    // 获取关联项目列表
    getProjectList() {
      getProjectList().then(({ result, success }) => {
        if (success) {
          this.projectList = result.records
        }
      })
    },

    // 项目改变事件
    handelChange(value, rows) {
      this.$set(this.formParams, "companyName", rows[0].customer) //客户名称
      this.$set(this.formParams, "customerName", rows[0].liaison) //联系人
      this.$set(this.formParams, "customerPhone", rows[0].phone) //联系电话
    },

    // 打开弹窗
    open() {
      this.visible = true
      this.getDepartmentList()
      // this.getProjectList()
    },

    // 关闭弹窗，点击遮罩层或右上角叉或取消按钮时触发
    close() {
      this.visible = false
      // 重置表单
      this.$refs.ruleForm.resetFields()
      this.selectedRowKeys = []
      this.selectionRows = []
      this.type = 0
      this.disableSubmit = false
      this.formParams = {
        selectPeopleName: this.$store.getters.userInfo.realname, //当前选型人
        selectPeopleId: this.$store.getters.userInfo.id, //当前选型人id
        profitsPeopleId: this.$store.getters.userInfo.id, //当前报价人id
        profitsDepartment: this.$store.getters.userInfo.departIds, //当前报价部门id
        selectDepartment: this.$store.getters.userInfo.departIds, //当前选型部门id
        department: this.$store.getters.userInfo.departIds, //当前部门id
        profitsPeoplePhone: this.$store.getters.userInfo.phone, // 当前电话
        profitsPeopleName: this.$store.getters.userInfo.realname, // 当前人
        selectPhone: this.$store.getters.userInfo.phone, // 选型人电话
        profitsTime: moment().format("YYYY-MM-DD HH:mm:ss"),
        selectTime: moment().format("YYYY-MM-DD HH:mm:ss"), //选型时间
        project: {
          inCharge: "",
          buildDate: "",
          projectAddr: "",
          amount: "",
          budget: "",
          outlines: "",
          projectId: "",
          projectName: "",
          customLiaisonId: "",
          customerName: "",
          customerPhone: "",
          companyName: "",
          customId: "",
          projectType: "",
          department: "",
        },
      }
      this.dataSource = []
      this.fileList = []
      this.dataSourcePurchase = []
      this.currentData = []
    },

    // 添加
    add(row) {
      console.log("添加利润---", row, this.type)
      if (row) {
        if (row.profitsId && [7, 8].includes(row.flowStatus)) {
          this.type = 2 // 审批利润表/详情
          this.title = "详情"
          this.currentData = row
          this.getDetail(row.profitsId)
          this.disableSubmit = true
        } else if (row.profitsId) {
          this.type = 1 // 编辑模式
          // this.title = '编辑'
          this.currentData = row
          this.getDetail(row.profitsId)
        } else {
          this.formParams = {
            ...this.formParams,
            inCharge: row.inCharge, //负责人
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
            projectType: row.projectType, //客户id
            department: this.$store.getters.userInfo.departIds,
          }
          // 当前为添加模式
          this.type = 0
          this.title = "新增利润表"
        }
      } else {
        this.type = 0
        this.title = "新增利润表"
        this.open()
      }

      this.open()
      this.readOnly = true
      console.log(this.formParams)
    },
    // 编辑
    edit(record) {
      console.log(record)
      this.type = 1
      this.getDetail(record.id)
      // 当前id（传给审批）
      this.approvalId = record.id || record
      this.currentData = record
      this.open()
      this.readOnly = true
    },
    // 详情
    detail(record) {
      this.type = 2
      // this.status = record.status // 已选型、不通过状态才能发起审批
      this.getDetail(record.id || record)
      // 当前id（传给审批）
      this.approvalId = record.id || record
      this.currentData = record
      this.readOnly = true
      this.open()
    },
    // 办公处理审批详情
    officeDetail(record) {
      this.type = 3
      this.getDetail(record.typeId)
      // 当前id（传给审批）
      this.approvalId = record.id
      this.currentData = record
      this.readOnly = true
      this.disableSubmit = true
      this.title = "详情"
      this.open()
    },

    // 报价单详情
    quotationDetail(id) {
      this.type = 5
      this.title = "详情"
      this.getQuotationDetail(id)
      // 当前id
      this.approvalId = id
      this.readOnly = true
      this.disableSubmit = true
      this.open()
    },

    // 获取报价单详情
    getQuotationDetail(id) {
      getQuotationDetail(id).then((res) => {
        if (res.success) {
          this.formParams = res.result
          this.dataSource = res.result.profitsProducts ? res.result.profitsProducts : []
          // 项目信息
          this.$set(this.formParams, "buildDate", res.result.project.buildDate)
          this.$set(this.formParams, "projectAddr", res.result.project.projectAddr)
          this.$set(this.formParams, "amount", res.result.project.amount)
          this.$set(this.formParams, "budget", res.result.project.budget)
          this.$set(this.formParams, "outlines", res.result.project.outlines)
          this.$set(this.formParams, "projectId", res.result.project.id)
          this.$set(this.formParams, "projectName", res.result.project.projectName)
          this.$set(this.formParams, "customerName", res.result.project.liaison)
          this.$set(this.formParams, "customerPhone", res.result.project.phone)
          this.$set(this.formParams, "companyName", res.result.project.customerName)
          this.$set(this.formParams, "customId", res.result.project.customer)
          this.$set(this.formParams, "inCharge", res.result.project.inCharge)
          this.$set(this.formParams, "projectType", res.result.project.projectType)
        }
      })
    },
    // 获取详情
    getDetail(id) {
      getDetail(id).then((res) => {
        if (res.success) {
          this.formParams = res.result
          this.dataSource = res.result.profitsProducts ? res.result.profitsProducts : []
          this.dataApproval = res.result.approves ? res.result.approves : []
          // 项目信息
          this.$set(this.formParams, "buildDate", res.result.project.buildDate)
          this.$set(this.formParams, "projectAddr", res.result.project.projectAddr)
          this.$set(this.formParams, "amount", res.result.project.amount)
          this.$set(this.formParams, "budget", res.result.project.budget)
          this.$set(this.formParams, "outlines", res.result.project.outlines)
          this.$set(this.formParams, "projectId", res.result.project.id)
          this.$set(this.formParams, "projectName", res.result.project.projectName)
          this.$set(this.formParams, "customerName", res.result.project.liaison)
          this.$set(this.formParams, "customerPhone", res.result.project.phone)
          this.$set(this.formParams, "companyName", res.result.project.customerName)
          this.$set(this.formParams, "customId", res.result.project.customer)
          this.$set(this.formParams, "inCharge", res.result.project.inCharge)
          this.$set(this.formParams, "projectType", res.result.project.projectType)
        }
      })
    },

    // 采购详情
    procurementDetail(record) {
      this.type = 4
      this.getProcurementListDetail(record.id || record)
      // 当前id（传给采购审批）
      this.approvalId = record.id || record
      this.readOnly = true
      this.disableSubmit = true
      this.open(record)
      this.code = record.code
      // 采购列表下的采购单
      this.getPurchaseOrder(this.code)
    },
    // 获取采购详情
    getProcurementListDetail(id) {
      getProcurementListDetail(id).then((res) => {
        if (res.success) {
          this.formParams = res.result
          this.dataSource = res.result.prodPurchaseOrderProductVos ? res.result.prodPurchaseOrderProductVos : []
        }
      })
    },
    //采购列表下的采购单
    getPurchaseOrder(code) {
      getPurchaseOrder({ code }).then((res) => {
        if (res.success) {
          this.dataSourcePurchase = res.result.records
        }
      })
    },

    // 切换标签页
    handleChangeTab(value) {
      if (value == 2) {
        // 采购列表下的采购单
        this.getPurchaseOrder(this.code)
      }
    },

    // 确认审批后关闭弹窗且刷新
    refreshClose() {
      this.close()
      this.$emit("refresh")
    },

    // 数量/销售单价发生变化事件   //*销售单价=采购单价*（1+毛利润）
    changeNum(row, i) {
      console.log(row)
      let data = this.format(row) //计算采购合价
      let dataSalesPrice = this.formatSalesPrice(row) //计算销售合价
      // let profit = this.formatGrossProfit(row) //计算毛利率
      let profit = ((dataSalesPrice - data) / dataSalesPrice).toFixed(2) //计算毛利率
      // 销售单价：price  采购单价：purchasePrice
      // console.log('毛利润----', profit, '销售合价--', dataSalesPrice, '采购合价--', data)

      let is_children = row.children
      // 这一层数据
      let dataFristLeval = []
      this.getFirstLevel(this.dataSource, row.key, dataFristLeval)
      // *采购单价可编辑
      is_children
        ? this.$set(this.dataSource[i], "purchasePrice", Number(row.purchasePrice).toFixed(2))
        : this.$set(dataFristLeval[0].children[i], "purchasePrice", Number(row.purchasePrice).toFixed(2))
      //改采购合价
      is_children
        ? this.$set(this.dataSource[i], "purchaseTotlePrice", Number(data).toFixed(2))
        : this.$set(dataFristLeval[0].children[i], "purchaseTotlePrice", Number(data).toFixed(2))
      // 改销售合价
      is_children
        ? this.$set(this.dataSource[i], "salesTotlePrice", Number(dataSalesPrice).toFixed(2))
        : this.$set(dataFristLeval[0].children[i], "salesTotlePrice", Number(dataSalesPrice).toFixed(2))

      if (row.salesTotlePrice !== "0.00") {
        // console.log('不等于0', row.salesTotlePrice)
        // 改毛利率
        is_children
          ? this.$set(this.dataSource[i], "grossProfitRate", Number(profit).toFixed(4))
          : this.$set(dataFristLeval[0].children[i], "grossProfitRate", Number(profit).toFixed(4))
      } else {
        // console.log('等于0')
        // 改毛利率
        is_children
          ? this.$set(this.dataSource[i], "grossProfitRate", 0)
          : this.$set(dataFristLeval[0].children[i], "grossProfitRate", 0)
      }

      console.log(this.dataSource)
      // 表格底部汇总金额
      // this.formatPurchasePrice = this.dataSource.reduce((p, c) => p + c.purchaseTotlePrice, 0).toFixed(2)
      // this.formatSalePrice = this.dataSource.reduce((p, c) => p + c.salesTotlePrice, 0).toFixed(2)
      // formatPurchasePrice
      // formatSalePrice
    },

    // 毛利润发生改变的事件 (用来计算采购单价和总价)
    changeGrossProfitRate(changeVal, row, i) {
      console.log(row)
      // 有没有children
      let is_children = row.children
      // 当前层数据
      let dataFristLeval = []
      this.getFirstLevel(this.dataSource, row.key, dataFristLeval)

      //改毛利率
      is_children
        ? this.$set(this.dataSource[i], "grossProfitRate", Number(changeVal).toFixed(4))
        : this.$set(dataFristLeval[0].children[i], "grossProfitRate", Number(changeVal).toFixed(4))
      // console.log('当前的毛利润', row.grossProfitRate)

      // 计算销售合价和单价  purchasePrice:采购单价  销售单价：price = 成本/(1-毛利)
      let salesPrice = row.purchasePrice / (1 - row.grossProfitRate)
      // 销售合价
      let salesTotalPrice = (salesPrice * row.num).toFixed(2)
      // 销售单价：price
      is_children
        ? this.$set(this.dataSource[i], "price", Number(salesPrice) || 0)
        : this.$set(dataFristLeval[0].children[i], "price", Number(salesPrice) || 0)
      // 销售合价：salesTotlePrice
      is_children
        ? this.$set(this.dataSource[i], "salesTotlePrice", Number(salesTotalPrice) || 0)
        : this.$set(dataFristLeval[0].children[i], "salesTotlePrice", Number(salesTotalPrice) || 0)

      //*  清空已选中的产品信息，因为产品的children改了不刷新
      this.selectedRowKeys = []
    },

    // 返回包含这条key的第一层
    getFirstLevel(list, key, dataFristLeval) {
      list.forEach((item) => {
        if (item.children) {
          // 拿到第二层所有的key 比对 最终返回包含这条key的第一层（我就是想拿到第一层在dataSource中是下标哎）
          // dataFristLeval.push(...item.children.filter((i) => key == i.key))
          item.children.forEach((i) => {
            if ([i.key].includes(key)) {
              dataFristLeval.push(item)
            }
          })
        }
      })
    },

    // 打开选择产品弹窗
    handleChangeProduce(record, row, index) {
      console.log(row, index)
      // 保存key
      let key = row.key
      //* 保存传来的key对应的第一层！！🤮
      this.getFirstLevel(this.dataSource, key, this.dataFristLeval)
      // console.log(this.dataFristLeval)

      // 保存当前选中下标和当前行数据
      this.currnetIndex = index
      this.currnetRow = row
      // let id = row.id //回显！！
      // 打开弹窗
      this.$refs.materialRForm.open(row.productId, row)
    },

    // 接收产品选中返回的值
    handleSelectData(data) {
      console.log("接收的产品选中值", data)
      // this.dataSource = data.selectionRows
      let i = this.currnetIndex
      let row = this.currnetRow
      let is_children = row.children

      let detailName = is_children ? this.dataSource[i].detailName : this.dataFristLeval[0].children[i].detailName
      let tech = is_children
        ? this.dataSource[i].technicalSpecifications
        : this.dataFristLeval[0].children[i].technicalSpecifications
      console.log("detailName:" + detailName + ",tech:" + tech)

      //细目名称
      if (detailName == undefined || detailName == "") {
        is_children
          ? this.$set(this.dataSource[i], "detailName", data.selectionRows[0].prodName)
          : this.$set(this.dataFristLeval[0].children[i], "detailName", data.selectionRows[0].prodName)
      }

      //技术规则
      if (tech == undefined || tech == "") {
        is_children
          ? this.$set(this.dataSource[i], "technicalSpecifications", data.selectionRows[0].modelParameter)
          : this.$set(
              this.dataFristLeval[0].children[i],
              "technicalSpecifications",
              data.selectionRows[0].modelParameter
            )
      }

      //产品名称
      is_children
        ? this.$set(this.dataSource[i], "productName", data.selectionRows[0].prodName)
        : this.$set(this.dataFristLeval[0].children[i], "productName", data.selectionRows[0].prodName)

      //产品id
      is_children
        ? this.$set(this.dataSource[i], "productId", data.selectionRows[0].id)
        : this.$set(this.dataFristLeval[0].children[i], "productId", data.selectionRows[0].id)

      // 规格参数
      is_children
        ? this.$set(this.dataSource[i], "specification", data.selectionRows[0].modelParameter)
        : this.$set(this.dataFristLeval[0].children[i], "specification", data.selectionRows[0].modelParameter)
      //型号
      is_children
        ? this.$set(this.dataSource[i], "model", data.selectionRows[0].model)
        : this.$set(this.dataFristLeval[0].children[i], "model", data.selectionRows[0].model)
      //供应商
      is_children
        ? this.$set(this.dataSource[i], "supplier", data.selectionRows[0].supplierName)
        : this.$set(this.dataFristLeval[0].children[i], "supplier", data.selectionRows[0].supplierName)
      //采购单价
      is_children
        ? this.$set(this.dataSource[i], "purchasePrice", data.selectionRows[0].price)
        : this.$set(this.dataFristLeval[0].children[i], "purchasePrice", data.selectionRows[0].price)
      //单位
      is_children
        ? this.$set(this.dataSource[i], "unit", data.selectionRows[0].unit)
        : this.$set(this.dataFristLeval[0].children[i], "unit", data.selectionRows[0].unit)

      // 数量
      let nums = is_children ? this.dataSource[i].num : this.dataFristLeval[0].children[i].num
      // 采购总价：price*num
      let totalprice = nums ? data.selectionRows[0].price * Number(nums) : 0
      // 采购合价
      is_children
        ? this.$set(this.dataSource[i], "purchaseTotlePrice", totalprice)
        : this.$set(this.dataFristLeval[0].children[i], "purchaseTotlePrice", totalprice)

      //* 清空第一层数据，保证打开弹窗的数据是新返回第一层数据（🤮）
      this.dataFristLeval = []
      //*  清空已选中的产品信息，因为产品的children改了不刷新
      this.selectedRowKeys = []
    },

    // 多选产品
    handleMultiProduce() {
      // 打开弹窗
      this.$refs.multiSelectForm.open()
    },

    // 接收多选产品返回的值
    handleMultiSelectData(data) {
      this.dataSource.push(...data.selectionRows)

      console.log("多选表格数据----", this.dataSource)

      data.selectionRows.map((item, index) => {
        // 生成随机key
        let key = Math.random()
        item.key = Math.floor(key * 1000)
        item.children = []
        item.grossProfitRate = 0
        this.$set(data.selectionRows[index], "detailName", item.prodName)
        this.$set(data.selectionRows[index], "technicalSpecifications", item.modelParameter)
        this.$set(data.selectionRows[index], "productName", item.prodName)
        this.$set(data.selectionRows[index], "productId", item.id)
        this.$set(data.selectionRows[index], "specification", item.modelParameter)
        this.$set(data.selectionRows[index], "model", item.model)
        this.$set(data.selectionRows[index], "supplier", item.supplierName)
        this.$set(data.selectionRows[index], "purchasePrice", item.price)
        this.$set(data.selectionRows[index], "unit", item.unit)
        this.$set(data.selectionRows[index], "num", 1)
        // 采购合价
        this.$set(
          data.selectionRows[index],
          "purchaseTotlePrice",
          (data.selectionRows[index].num * data.selectionRows[index].price).toFixed(2)
        )
        // 销售单价
        this.$set(data.selectionRows[index], "price", "")
      })
      console.log(this.dataSource)
      this.selectedRowKeys = []
      // 用深拷贝解决数组不更新渲染
      this.dataSource = JSON.parse(JSON.stringify(this.dataSource))
    },

    // 打开调整利润率
    handleAdjustedProfit() {
      this.selectedRowKeys = []
      // 获取过滤后的数据id
      // const filterArr = this.dataSource.filter((item) => !this.selectedRowKeys.includes(item.id)).map((item) => item.id)
      const filterArr = this.selectionRows
        .filter((item) => {
          return item.productId !== null
        })
        .map((item) => item.key)

      // 过滤后勾选的值
      this.selectedRowKeys = filterArr

      if (this.selectedRowKeys.length == 0) {
        this.$message.warning("调整利润率前请先选择产品名称！")
      } else if (this.selectionRows.length > this.selectedRowKeys.length && filterArr.length !== 0) {
        this.$message.warning("已过滤未选择产品的数据！")
        this.$refs.rateFrom.open(this.selectedRowKeys.toString())
      } else {
        this.$refs.rateFrom.open(this.selectedRowKeys.toString())
      }
      console.log(this.selectedRowKeys, "filterArr", filterArr)
    },

    // 接收批量改变利润率传回的事件
    changeProfit(data) {
      let arr = [data.key]
      // 拿到传过来的key
      let keys = []
      arr.forEach((item) => {
        if (arr.includes(item)) {
          keys.push(item)
          return keys
        }
      })

      // 更改毛利率
      this.$nextTick(() => {
        this.getData(this.dataSource, keys, data.profit)
      })

      // 接收了改变毛利润传过来的参数后，再计算采购的合价
      let price = this.selectionRows.map((item) => {
        //得到采购单价
        return { price: item.price, purchaseTotlePrice: item.purchaseTotlePrice, num: item.num }
      })
      console.log("单价和销售总价", price, "当前毛利润:", data.profit)

      // 最终的总价和单价; data.profit:当前毛利润
      this.selectionRows.map((item, index) => {
        console.log(item, index)
        item.price = item.purchasePrice / (1 - data.profit) //销售单价=采购单价/（1-毛利润）
        item.salesTotlePrice = (item.price * item.num).toFixed(2) //销售合价
        console.log("销售单价--", item.price, "销售总价--", item.salesTotlePrice)
        this.getChangeData(this.dataSource, item.key, item.salesTotlePrice, item.price)
      })

      // this.selectionRows.map((item, index) => {
      //   console.log(item, index)
      //   let total = Number(price[index].purchaseTotlePrice) * (1 - Number(data.profit))
      //   item.salesTotlePrice = total.toFixed(2) //采购总价
      //   item.price = (total / item.num).toFixed(2) //再根据总价/数量 得到采购的单价
      //   console.log(item.salesTotlePrice, item.price)
      //   this.getChangeData(this.dataSource, item.key, item.salesTotlePrice, item.price)
      // })

      console.log(this.selectionRows)
      console.log(this.dataSource)
      //*  清空已选中的产品信息，因为产品的children改了毛利率不刷新
      this.selectedRowKeys = []
    },

    // 通过key递归 更改采购单价和总价
    getChangeData(tree, keys, salesTotlePrice, price) {
      // * 关键：找到key,找到后赋值
      let data = tree.filter((item) => item.key == keys)
      // console.log(data)
      if (data.length != 0) {
        data[0].salesTotlePrice = salesTotlePrice
        data[0].price = price
        console.log("20000--", salesTotlePrice)
      } else {
        tree.map((item) => {
          if (item.children) {
            //递归循环
            this.getChangeData(item.children, keys, salesTotlePrice, price)
          }
        })
      }
      return data
    },

    // 更改毛利率
    getData(list, key, rofit) {
      list.forEach((item) => {
        if ([...key].toString().includes(item.key)) {
          item.grossProfitRate = rofit
        }
        if (item.children) {
          return this.getData(item.children, key, rofit)
        }
      })
    },

    // 报价历史弹窗
    handleHistory() {
      this.$refs.historyFrom.open(this.selectionRows)
    },

    // 在当前行下面新增一条数据
    addCurrentRow(row, index) {
      // console.log(row, index, this.dataSource[index].children)
      // 先生成一个随机key
      let keys = Math.random()
      this.dataSource[index].children.push({
        key: Math.floor(keys * 1000),
        productId: null,
        num: 1,
        index: `${index}-${index}`,
        grossProfitRate: 0,
        price: 0,
        salesTotlePrice: 0,
        purchaseTotlePrice: 0,
      })
      console.log(this.dataSource)
      //*  清空已选中的产品信息，因为产品的children改了不刷新
      this.selectedRowKeys = []
    },

    expandedRowsChange(e) {
      // this.expandedRowKeys = e
    },

    //删除整行
    deleteCurrentRow(row, index) {
      this.dataSource.splice(index, 1)
    },

    // 删除当前行下面的数据
    deleteRow(row, index) {
      // *保存点击的key对应的这一层
      let arr = []
      this.getFirstLevel(this.dataSource, row.key, arr)
      console.log("arr------------", arr)
      // 删除这一层children对应下标的这条数据
      arr[0].children.splice(index, 1)
      //*  清空已选中的产品信息，因为产品的children改了不刷新
      this.selectedRowKeys = []
    },

    // 新增项目利润
    addRow() {
      // 生成随机key
      let key = Math.random()
      this.dataSource.push(
        {
          key: Math.floor(key * 1000),
          detailName: "",
          position: "",
          technicalSpecifications: "",
          specification: "",
          model: "",
          supplier: "",
          unit: "",
          num: 1,
          productId: null,
          price: 0,
          salesTotlePrice: 0,
          purchasePrice: 0,
          purchaseTotlePrice: 0,
          grossProfitRate: 0,
          remark: "",
          children: [],
        }
        // {
        //   key: Math.floor(key * 1000),
        //   codeNum: '合计',
        // }
      )
    },

    // 审批
    handleApproval() {
      console.log("编辑审批", this.type)
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // 校验产品信息是否为空
          if (this.dataSource.length == 0) return this.$message.warning("请添加并填写带*的产品信息!")
          // 校验是否完整填写产品信息
          for (let keys in this.dataSource) {
            let list = this.dataSource[keys]
            console.log(list.children)
            for (let key in list) {
              if (
                key !== "totalAmount" &&
                key !== "remark" &&
                key !== "position" &&
                key !== "approval" &&
                key !== "createBy" &&
                key !== "createTime" &&
                key !== "currentPeopleId" &&
                key !== "delFlag" &&
                key !== "devops" &&
                key !== "hasSerial" &&
                key !== "paymentPeriod" &&
                key !== "picUrl" &&
                key !== "priceValid" &&
                key !== "productClassify" &&
                key !== "warranty" &&
                key !== "updateTime" &&
                key !== "updateBy" &&
                key !== "supplyTime" &&
                key !== "supplierId" &&
                key !== "status" &&
                key !== "serviceAddr" &&
                key !== "serialNum" &&
                key !== "secondary" &&
                key !== "returnAddress" &&
                key !== "products" &&
                key !== "productType" &&
                key !== "controlPoint" &&
                key !== "supplierName" &&
                key !== "prodName" &&
                key !== "modelParameter" &&
                key !== "brand" &&
                key !== "id" &&
                key !== "is_main" &&
                key !== "grossProfitRate" &&
                key !== "code" &&
                key !== "salesPrice" &&
                key !== "codeNum" &&
                key !== "model" &&
                key !== "salesTotlePrice" &&
                key !== "price"
              ) {
                if (!list[key]) {
                  return this.$message.warning("请完整填写带*的产品信息!")
                }
              }
            }
            if (list.children.length) {
              for (let keys in list.children) {
                let listChildren = list.children[keys]
                for (let key in listChildren) {
                  if (
                    key !== "totalAmount" &&
                    key !== "children" &&
                    key !== "remark" &&
                    key !== "position" &&
                    key !== "is_main" &&
                    key !== "codeNum" &&
                    key !== "purchaseTotlePrice" &&
                    key !== "salesTotlePrice" &&
                    key !== "price" &&
                    key !== "grossProfitRate" &&
                    key !== "salesPrice" &&
                    key !== "totalAmount"
                  ) {
                    // console.log(listChildren)
                    if (!listChildren[key]) {
                      return this.$message.warning("请完整填写带*的产品信息!")
                    }
                  }
                }
              }
            }
          }
          let project = {
            buildDate: this.formParams.buildDate,
            projectAddr: this.formParams.projectAddr,
            amount: this.formParams.amount,
            budget: this.formParams.budget,
            outlines: this.formParams.outlines,
            projectId: this.formParams.projectId,
            projectName: this.formParams.projectName,
            customerName: this.formParams.customerName,
            customerPhone: this.formParams.customerPhone,
            companyName: this.formParams.companyName,
            customId: this.formParams.customId,
            inCharge: this.formParams.inCharge,
            projectType: this.formParams.projectType,
          }
          // 表单数据和产品dataSource数据
          let formParamsAndPro = {
            ...this.formParams,
            profitsProducts: this.dataSource,
            accountId: this.$store.getters.userInfo.id,
            project: project,
          }
          this.approvalLoading = true
          if (this.type == 1) {
            editApproval(formParamsAndPro)
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
          } else {
            submitApproval(formParamsAndPro)
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

          // if (this.type == 0) {
          // 新增利润审批接口
          //   addApproval(data, this.$store.getters.userInfo.realname).then((res) => {
          //     if (res.success) {
          //       this.$message.success(res.message)
          //       this.$emit('refresh')
          //     } else {
          //       this.$message.error(res.message)
          //     }
          //     this.close()
          //   })
          // } else if (this.type == 1) {
          // 编辑利润审批接口
          //   editApproval(data, this.$store.getters.userInfo.realname).then((res) => {
          //     if (res.success) {
          //       this.$message.success(res.message)
          //       this.$emit('refresh')
          //     } else {
          //       this.$message.error(res.message)
          //     }
          //     this.close()
          //   })
          // } else if (this.type == 2) {
          // 详情利润审批接口
          //   detailApproval(data, this.$store.getters.userInfo.realname).then((res) => {
          //     if (res.success) {
          //       this.$message.success(res.message)
          //       this.$emit('refresh')
          //     } else {
          //       this.$message.error(res.message)
          //     }
          //     this.close()
          //   })
          // }
        }
      })
    },

    // 报价单导出预览
    handlePrint() {
      // this.$refs.print.open()
      this.$refs.selectPrint.open()
    },

    // 利润表导出预览
    handleProfitPrint() {
      this.$refs.profitPrint.open()
    },

    //提交 1-保存 2-提交
    handleOk(value) {
      console.log(this.dataSource, this.formParams)
      // const flag = Object.keys(this.dataSource).some(key => this.dataSource[key].productId == '')
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // 校验产品信息是否为空
          if (this.dataSource.length == 0) return this.$message.warning("请添加并填写带*的产品信息!")
          // 校验是否完整填写产品信息
          for (let keys in this.dataSource) {
            let list = this.dataSource[keys]
            console.log(list.children)
            for (let key in list) {
              if (
                key !== "totalAmount" &&
                key !== "remark" &&
                key !== "position" &&
                key !== "approval" &&
                key !== "createBy" &&
                key !== "createTime" &&
                key !== "currentPeopleId" &&
                key !== "delFlag" &&
                key !== "devops" &&
                key !== "hasSerial" &&
                key !== "paymentPeriod" &&
                key !== "picUrl" &&
                key !== "priceValid" &&
                key !== "productClassify" &&
                key !== "warranty" &&
                key !== "updateTime" &&
                key !== "updateBy" &&
                key !== "supplyTime" &&
                key !== "supplierId" &&
                key !== "status" &&
                key !== "serviceAddr" &&
                key !== "serialNum" &&
                key !== "secondary" &&
                key !== "returnAddress" &&
                key !== "products" &&
                key !== "productType" &&
                key !== "controlPoint" &&
                key !== "supplierName" &&
                key !== "prodName" &&
                key !== "modelParameter" &&
                key !== "brand" &&
                key !== "id" &&
                key !== "is_main" &&
                key !== "grossProfitRate" &&
                key !== "code" &&
                key !== "salesPrice" &&
                key !== "codeNum" &&
                key !== "model" &&
                key !== "purchaseTotlePrice" &&
                key !== "salesTotlePrice" &&
                key !== "price"
              ) {
                if (!list[key]) {
                  return this.$message.warning("请完整填写带*的产品信息!")
                }
              }
            }
            if (list.children.length) {
              for (let keys in list.children) {
                let listChildren = list.children[keys]
                for (let key in listChildren) {
                  if (
                    key !== "totalAmount" &&
                    key !== "children" &&
                    key !== "remark" &&
                    key !== "position" &&
                    key !== "is_main" &&
                    key !== "codeNum" &&
                    key !== "purchaseTotlePrice" &&
                    key !== "salesTotlePrice" &&
                    key !== "price" &&
                    key !== "grossProfitRate" &&
                    key !== "salesPrice" &&
                    key !== "totalAmount"
                  ) {
                    // console.log(listChildren)
                    if (!listChildren[key]) {
                      return this.$message.warning("请完整填写产品信息!")
                    }
                  }
                }
              }
            }
          }
          let project = {
            buildDate: this.formParams.buildDate,
            projectAddr: this.formParams.projectAddr,
            amount: this.formParams.amount,
            budget: this.formParams.budget,
            outlines: this.formParams.outlines,
            projectId: this.formParams.projectId,
            projectName: this.formParams.projectName,
            customerName: this.formParams.customerName,
            customerPhone: this.formParams.customerPhone,
            companyName: this.formParams.companyName,
            customId: this.formParams.customId,
            inCharge: this.formParams.inCharge,
            projectType: this.formParams.projectType,
          }
          // 传给后端的数据
          let data = {
            ...this.formParams,
            profitsProducts: this.dataSource,
            project: project,
          }
          console.log(data)
          // 添加
          if (this.type == 0) {
            this.okLoading = true
            addprodProfits(data)
              .then((res) => {
                if (res.success) {
                  this.$message.success(res.message)
                  this.$emit("refresh")
                } else {
                  this.$message.error(res.message)
                }
                // 点击的是保存按钮的话需要关闭弹窗
                if (value == 1) {
                  this.close()
                }
              })
              .finally(() => {
                setTimeout(() => {
                  this.okLoading = false
                }, 2000)
              })
          } else if (this.type == 1) {
            this.okLoading = true
            // 编辑
            editprodProfits(data)
              .then((res) => {
                if (res.success) {
                  this.$message.success(res.message)
                  this.$emit("refresh")
                } else {
                  this.$message.error(res.message)
                }
                // 点击的是保存按钮的话需要关闭弹窗
                if (value == 1) {
                  this.close()
                }
              })
              .finally(() => {
                setTimeout(() => {
                  this.okLoading = false
                }, 2000)
              })
          }
        } else {
          this.$message.warning("请完整填写带*的产品信息")
          return false
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
::v-deep .ant-table td {
  white-space: nowrap;
}
.title {
  background-color: #f8faff;
  padding: 6px;
  margin-bottom: 10px;
  font-weight: 600;
}
.buttom {
  margin: 10px 5px;
}
.sub-button {
  margin: 0 0.8rem 0 0;
}

.price-control {
  // margin-left: 20px;
  // float: right;
  font-size: 18px;
  font-weight: 600;
}
// 隐藏上传的文件名称图标
::v-deep .ant-upload-list {
  display: none;
}
::v-deep .ant-upload-list-text {
  display: none;
}
::v-deep .ant-input-number-handler-wrap {
  z-index: 0;
}
// 表头前加*
.form-table-heard:before {
  content: "*";
  color: red;
}

/*统一table表格的尺寸*/
.ant-table {
  table-layout: fixed;
}
.ant-table-tbody > tr > td {
  max-width: 200px;
  min-width: 70px;
  height: 70px;
  border-bottom: 0;
  /*text-align: center !important;*/
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
  word-break: break-all;
}
.overflowStyle {
  max-width: 250px !important;
  // max-height: 70px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-wrap: break-word;
  word-break: break-all;
}

.subtotal {
  height: 50px;
  // position: absolute;
  // bottom: 10px;
  width: 100%;
  border: 1px solid #e8e8e8;
  background: #fafafa;
  display: flex;
  align-items: center;
  font-weight: 700;
  overflow-x: scroll;
  overflow-y: hidden;
  .left {
    flex: none; /* div显示滚动条的重点 */
    // width: 391px;
    margin-left: 75px;
  }
  .number {
    flex: none;
    color: #666666;
    height: 100%;
    width: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    // padding-left: 5px;
  }
  .last {
    flex: none;
    color: #666666;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 182px;
  }
}
//隐藏a-table组件的滚动条
/deep/.ant-table-body {
  overflow: hidden !important;
}
/deep/.ant-table-footer {
  margin: 0;
}
</style>
