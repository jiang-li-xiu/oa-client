<template>
  <a-drawer
    :title="title"
    :maskClosable="true"
    width="80%"
    placement="right"
    :closable="true"
    @close="close"
    :visible="visible"
    style="overflow: auto; padding-bottom: 53px"
  >
    <a-spin tip="加载中.." :spinning="loading">
      <a-form-model ref="ruleForm" :model="formParams" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <!-- 部门采购申请 -->
        <a-tabs default-active-key="1" @change="handleChange" :activeKey="activeKey">
          <a-tab-pane key="1" tab="部门采购申请" v-if="this.type == 0 || activeKeys == 1">
            <j-form-container :disabled="disableSubmit">
              <a-row slot="detail">
                <a-col :span="24" class="title">申请信息</a-col>
                <a-col :span="8">
                  <a-form-model-item label="申请部门" prop="department">
                    <a-input v-model="formParams.department" placeholder="请输入申请部门" :read-only="true" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="申请人" prop="people">
                    <a-input v-model="formParams.people" placeholder="请输入申请人" :read-only="true" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="联系电话" prop="phone">
                    <a-input v-model="formParams.phone" placeholder="请输入联系电话" :read-only="true" />
                  </a-form-model-item>
                </a-col>

                <a-col :span="24" class="title">申请内容</a-col>
                <a-col :span="8">
                  <a-form-model-item
                    label="采购类别"
                    prop="category"
                    :rules="activeKey == 1 ? rules.category : [{ required: false }]"
                  >
                    <j-dict-select-tag
                      v-model="formParams.category"
                      dictCode="procurement_categories"
                      placeholder="请选择采购类别"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item
                    label="用途"
                    prop="useWay"
                    :rules="activeKey == 1 ? rules.useWay : [{ required: false }]"
                  >
                    <a-select v-model="formParams.useWay" placeholder="请选择用途">
                      <a-select-option :value="1">已有项目采购 </a-select-option>
                      <a-select-option :value="2">销售 </a-select-option>
                      <a-select-option :value="3">公司自用 </a-select-option>
                      <a-select-option :value="4">其他 </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item
                    label="合同情况"
                    prop="hasContract"
                    :rules="activeKey == 1 ? rules.hasContract : [{ required: false }]"
                  >
                    <a-select v-model="formParams.hasContract" placeholder="请选择合同情况">
                      <a-select-option :value="1">有合同 </a-select-option>
                      <a-select-option :value="2">备货涵 </a-select-option>
                      <a-select-option :value="3">领导邮件通知下单 </a-select-option>
                      <a-select-option :value="4">其他 </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <!-- <a-col :span="8">
                  <a-form-model-item
                    label="付款方式"
                    prop="payMethod"
                    :rules="activeKey == 1 ? rules.payMethod : [{ required: false }]"
                  >
                    <a-select v-model="formParams.payMethod" placeholder="请选择付款方式">
                      <a-select-option :value="1">签订合同并开票付款 </a-select-option>
                      <a-select-option :value="2">开票付现金 </a-select-option>
                      <a-select-option :value="3">其他 </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col> -->
                <a-col :span="8">
                  <a-form-model-item
                    label="紧急情况"
                    prop="degree"
                    :rules="activeKey == 1 ? rules.degree : [{ required: false }]"
                  >
                    <a-select v-model="formParams.degree" placeholder="请选择紧急情况">
                      <a-select-option :value="1">紧急 </a-select-option>
                      <a-select-option :value="2">一般 </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item
                    label="需求到位时间"
                    prop="inPlaceTime"
                    :rules="activeKey == 1 ? rules.inPlaceTime : [{ required: false }]"
                  >
                    <j-date
                      v-model="formParams.inPlaceTime"
                      :showTime="true"
                      dateFormat="YYYY-MM-DD HH:mm:ss"
                      :style="{ width: '100%' }"
                      placeholder="请选择需求到位时间"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="24">
                  <a-form-model-item
                    label="下单申请表"
                    prop="applyFromUrl"
                    :label-col="{ span: 2 }"
                    :wrapper-col="{ span: 17 }"
                    :rules="activeKey == 1 ? rules.applyFromUrl : [{ required: false }]"
                  >
                    <a-upload
                      :action="uploadUrl"
                      :multiple="true"
                      :file-list="applyFromUrl"
                      :headers="headers"
                      :disabled="disableSubmit"
                      @change="handleUploadChange"
                      :remove="handleRemoveImage"
                      @download="downloadFile"
                      @preview="handlePreview"
                      :showUploadList="{
                        showRemoveIcon: true,
                        showDownloadIcon: true,
                      }"
                    >
                      <a v-if="applyFromUrl.length < 9" type="primary" icon="upload">上传文件 </a>
                    </a-upload>
                    <a
                      icon="download"
                      @click="download('下单申请表模版', 'xls', '/pcmProcurement/order/apply/download')"
                      >下载模板
                    </a>
                  </a-form-model-item>
                </a-col>

                <a-col :span="24">
                  <a-form-model-item
                    label="关联客户"
                    prop="customerId"
                    :label-col="{ span: 2 }"
                    :wrapper-col="{ span: 20 }"
                    :rules="[1, 2].includes(formParams.useWay) ? rules.customerId : [{ required: false }]"
                  >
                    <j-select-customer v-model="formParams.customerId" :multi="false" @change="handelChangeCustomer">
                    </j-select-customer>
                  </a-form-model-item>
                </a-col>
                <a-col :span="24">
                  <a-form-model-item
                    label="关联项目"
                    prop="projectId"
                    :label-col="{ span: 2 }"
                    :wrapper-col="{ span: 20 }"
                    :rules="[1, 2].includes(formParams.useWay) ? rules.projectId : [{ required: false }]"
                  >
                    <j-select-project
                      v-model="formParams.projectId"
                      :multi="false"
                      @change="handelChange"
                    ></j-select-project>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </j-form-container>
          </a-tab-pane>

          <!-- 三方比价申请 -->
          <a-tab-pane key="2" tab="三方比价申请" force-render v-if="this.type == 0 || activeKeys == 2">
            <j-form-container :disabled="disableSubmit">
              <a-row slot="detail">
                <a-col :span="24" class="title">申请信息</a-col>
                <a-col :span="8">
                  <a-form-model-item label="申请部门" prop="department">
                    <a-input v-model="formParams.department" placeholder="请输入申请部门" :read-only="true" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="申请人" prop="people">
                    <a-input v-model="formParams.people" placeholder="请输入申请人" :read-only="true" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="联系电话" prop="phone">
                    <a-input v-model="formParams.phone" placeholder="请输入联系电话" :read-only="true" />
                  </a-form-model-item>
                </a-col>

                <a-col :span="24" class="title">申请内容</a-col>
                <a-col :span="24">
                  <a-form-model-item
                    label="关联客户"
                    prop="customerId"
                    :rules=" [{ required: false }]"
                    :label-col="{ span: 2 }"
                    :wrapper-col="{ span: 20 }"
                  >
                    <j-select-customer v-model="formParams.customerId" :multi="false" @change="handelChangeCustomer">
                    </j-select-customer>
                  </a-form-model-item>
                </a-col>
                <a-col :span="24">
                  <a-form-model-item
                    label="关联项目"
                    prop="projectId"
                    :rules=" [{ required: false }]"
                    :label-col="{ span: 2 }"
                    :wrapper-col="{ span: 20 }"
                  >
                    <j-select-project
                      v-model="formParams.projectId"
                      :multi="false"
                      @change="handelChange"
                    ></j-select-project>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item
                    label="采购内容"
                    prop="purchaseContext"
                    :rules="formParams.type == 2 ? rules.purchaseContext : [{ required: false }]"
                  >
                    <a-input v-model="formParams.purchaseContext" placeholder="请输入采购内容" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item
                    label="采购类别"
                    prop="category"
                    :rules="formParams.type == 2 ? rules.category : [{ required: false }]"
                  >
                    <a-select v-model="formParams.category" placeholder="请选择采购类别">
                      <a-select-option :value="1">公司内部采购 </a-select-option>
                      <a-select-option :value="2">项目采购 </a-select-option>
                      <a-select-option :value="3">销售 </a-select-option>
                      <a-select-option :value="4">固定资产 </a-select-option>
                      <a-select-option :value="5">其他 </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>

                <a-col :span="24">
                  <a-form-model-item
                    label="三方比价表"
                    prop="multiContrastUrl"
                    :label-col="{ span: 2 }"
                    :wrapper-col="{ span: 17 }"
                    :rules="formParams.type == 2 ? rules.multiContrastUrl : [{ required: false }]"
                  >
                    <a-upload
                      :action="uploadUrl"
                      :multiple="true"
                      :file-list="multiContrastUrl"
                      :headers="headers"
                      :disabled="disableSubmit"
                      @change="handleUploadMultiContras"
                      :remove="handleRemoveMultiContras"
                      @download="downloadFileMultiContras"
                      @preview="handlePreviewMultiContras"
                      :showUploadList="{
                        showRemoveIcon: true,
                        showDownloadIcon: true,
                      }"
                    >
                      <a v-if="multiContrastUrl.length < 9" type="primary" icon="upload">上传文件 </a>
                    </a-upload>
                    <a
                      icon="download"
                      @click="download('三方比价表模版', 'xls', '/pcmProcurement/multi/contrast/download')"
                      >下载模板
                    </a>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </j-form-container>
          </a-tab-pane>

          <!-- 采购下单申请 -->
          <a-tab-pane key="3" tab="采购下单申请" v-if="this.type == 0 || activeKeys == 3">
            <a-row>
              <j-form-container :disabled="disableSubmit">
                <div slot="detail">
                  <a-col :span="24" class="title">申请信息</a-col>
                  <a-col :span="8">
                    <a-form-model-item label="申请部门" prop="department">
                      <a-input v-model="formParams.department" placeholder="请输入申请部门" :read-only="true" />
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-model-item label="申请人" prop="people">
                      <a-input v-model="formParams.people" placeholder="请输入申请人" :read-only="true" />
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-model-item label="联系电话" prop="phone">
                      <a-input v-model="formParams.phone" placeholder="请输入联系电话" :read-only="true" />
                    </a-form-model-item>
                  </a-col>

                  <a-col :span="24" class="title">申请内容</a-col>
                  <!-- <a-col :span="8">
                    <a-form-model-item
                      label="付款类别"
                      prop="payCategory"
                      :rules="formParams.type == 3 ? rules.payCategory : [{ required: false }]"
                    >
                      <a-select v-model="formParams.payCategory" placeholder="请选择付款类别">
                        <a-select-option :value="1">采购付款（首次） </a-select-option>
                        <a-select-option :value="2">采购付款（非首次） </a-select-option>
                      </a-select>
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-model-item
                      label="类型"
                      prop="types"
                      :rules="formParams.type == 3 ? rules.types : [{ required: false }]"
                    >
                      <a-select v-model="formParams.types" placeholder="请选择类型">
                        <a-select-option :value="1">计划内 </a-select-option>
                        <a-select-option :value="2">计划外 </a-select-option>
                      </a-select>
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-model-item
                      label="收款单位"
                      prop="receivingUnit"
                      :rules="formParams.type == 3 ? rules.receivingUnit : [{ required: false }]"
                    >
                      <a-input v-model="formParams.receivingUnit" placeholder="请输入收款单位" />
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-model-item
                      label="开户银行"
                      prop="bank"
                      :rules="formParams.type == 3 ? rules.bank : [{ required: false }]"
                    >
                      <a-input v-model="formParams.bank" placeholder="请输入开户银行" />
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-model-item
                      label="银行账号"
                      prop="bankAccount"
                      :rules="formParams.type == 3 ? rules.bankAccount : [{ required: false }]"
                    >
                      <a-input v-model="formParams.bankAccount" placeholder="请输入银行账号" />
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-model-item
                      label="金额（小写）"
                      prop="lowerAmount"
                      :rules="formParams.type == 3 ? rules.lowerAmount : [{ required: false }]"
                    >
                      <a-input
                        v-model="formParams.lowerAmount"
                        placeholder="请输入金额（小写）"
                        @change="changeAmount"
                      />
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-model-item
                      label="金额（大写）"
                      prop="upperAmount"
                      :rules="formParams.type == 3 ? rules.upperAmount : [{ required: false }]"
                    >
                      <a-input v-model="formParams.upperAmount" placeholder="请输入金额（大写）" :read-only="true" />
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-model-item
                      label="付款方式"
                      prop="payType"
                      :rules="formParams.type == 3 ? rules.payType : [{ required: false }]"
                    >
                      <a-select v-model="formParams.payType" placeholder="请选择付款方式">
                        <a-select-option :value="1">电汇 </a-select-option>
                        <a-select-option :value="2">转账 </a-select-option>
                        <a-select-option :value="3">汇票 </a-select-option>
                        <a-select-option :value="4">其他 </a-select-option>
                      </a-select>
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-model-item
                      label="票据情况"
                      prop="billSituation"
                      :rules="formParams.type == 3 ? rules.billSituation : [{ required: false }]"
                    >
                      <a-input v-model="formParams.billSituation" placeholder="请输入票据情况" />
                    </a-form-model-item>
                  </a-col> -->
                </div>
              </j-form-container>
              <j-form-container :disabled="false" class="purchase" ref="j-form-container">
                <div slot="detail">
                  <a-col :span="12">
                    <a-form-model-item
                      label="关联采购申请"
                      prop="purchaseApplyId"
                      :label-col="{ span: 5 }"
                      :wrapper-col="{ span: 16 }"
                      :rules="formParams.type == 3 ? rules.purchaseApplyId : [{ required: false }]"
                    >
                      <template v-if="[2, 3].includes(this.type)">
                        <template v-if="this.procurmentAble.length && this.procurmentAbleDetail.length">
                          <a @click="handlePurchase(1)">
                            {{
                              '采购申请' +
                              '-' +
                              this.procurmentAbleDetail[0].people +
                              '-' +
                              this.procurmentAbleDetail[0].time
                            }}
                          </a>
                        </template>
                      </template>
                      <template v-else>
                        <a-input-search
                          v-model="formParams.purchaseApplyName"
                          placeholder="请选择关联采购申请"
                          readOnly
                          unselectable="on"
                          @search="onSearchPurchase"
                        >
                          <a-button slot="enterButton">选择</a-button>
                        </a-input-search>
                        <!-- <a-select
                        v-model="formParams.purchaseApplyId"
                        placeholder="请选择关联采购申请"
                        @change="handleProcurmentAble"
                      >
                        <a-select-option v-for="(item, i) in procurmentAble" :key="i" :value="item.id"
                          >{{ item.name }}
                        </a-select-option>
                      </a-select> -->
                      </template>
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-model-item
                      label="三方比价表"
                      prop="multiContrastId"
                      :label-col="{ span: 5 }"
                      :wrapper-col="{ span: 15 }"
                    >
                      <template v-if="[2, 3].includes(this.type)">
                        <template v-if="this.priceAble.length && this.multiContrasDetail.length">
                          <a @click="handleMultiContras(2)">
                            {{
                              '采购申请' +
                              '-' +
                              this.multiContrasDetail[0].people +
                              '-' +
                              this.multiContrasDetail[0].time
                            }}
                          </a>
                        </template>
                        <template v-else> 无 </template>
                      </template>
                      <template v-else>
                        <a-input-search
                          v-model="formParams.multiContrastName"
                          placeholder="请选择三方比价表"
                          readOnly
                          unselectable="on"
                          @search="onSearchMultiContrast"
                        >
                          <a-button slot="enterButton">选择</a-button>
                        </a-input-search>
                        <!-- <a-select v-model="formParams.multiContrastId" placeholder="请选择三方比价表">
                        <a-select-option v-for="(item, i) in priceAble" :key="i" :value="item.id"
                          >{{ item.name }}
                        </a-select-option>
                      </a-select> -->
                      </template>
                    </a-form-model-item>
                  </a-col>
                </div>
              </j-form-container>

              <!-- <a-col :span="24">
                <a-form-model-item
                  label="付款内容描述"
                  prop="payContext"
                  :rules="formParams.type == 3 ? rules.payContext : [{ required: false }]"
                  :label-col="{ span: 2 }"
                  :wrapper-col="{ span: 20 }"
                >
                  <a-textarea
                    v-model="formParams.payContext"
                    :rows="4"
                    placeholder="请输入付款内容描述(最多三百字)"
                    :maxLength="300"
                    :read-only="![0, 1].includes(this.type)"
                  />
                </a-form-model-item>
              </a-col> -->
              <!-- <template v-if="formParams.purchaseApplyId"> -->
              <template>
                <a-col :span="24">
                  <a-form-model-item
                    label="关联客户"
                    prop="customerId"
                    :label-col="{ span: 2 }"
                    :wrapper-col="{ span: 20 }"
                    :rules="[{ required: false }]"
                  >
                    <j-select-customer v-model="formParams.customerId" :multi="false" @change="handelChangeCustomer" :disabled="disableSubmit">
                    </j-select-customer>
                  </a-form-model-item>
                </a-col>
                <a-col :span="24">
                  <a-form-model-item
                    label="关联项目"
                    prop="projectId"
                    :label-col="{ span: 2 }"
                    :wrapper-col="{ span: 20 }"
                    :rules="[{ required: false }]"
                  >
                    <j-select-project
                      v-model="formParams.projectId"
                      :multi="false"
                      @change="handelChange"
                      :disabled="disableSubmit"
                    ></j-select-project>
                  </a-form-model-item> </a-col
              ></template>
              <a-col :span="24">
                <a-form-model-item
                  label="下单申请表"
                  prop="applyOrderFormUrl"
                  :label-col="{ span: 2 }"
                  :wrapper-col="{ span: 17 }"
                  :rules="formParams.type == 3 ? rules.applyOrderFormUrl : [{ required: false }]"
                >
                  <a-upload
                    :action="uploadUrl"
                    :multiple="true"
                    :file-list="applyOrderFormUrl"
                    :headers="headers"
                    :disabled="disableSubmit"
                    @change="handleUploadChangeOrder"
                    :remove="handleRemoveChangeOrder"
                    @download="downloadFileChangeOrder"
                    @preview="handlePreviewChangeOrder"
                    :showUploadList="{
                      showRemoveIcon: true,
                      showDownloadIcon: true,
                    }"
                  >
                    <a v-if="applyOrderFormUrl.length < 9" type="primary" icon="upload">上传文件 </a>
                  </a-upload>
                  <a icon="download" @click="download('下申请表模版', 'xls', '/pcmProcurement/order/apply/download')"
                    >下载模板
                  </a>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-tab-pane>

          <!-- 审批记录 -->
          <a-tab-pane key="4" tab="审批记录" v-if="this.type == 2 || this.type == 3">
            <a-row>
              <a-col :span="24" class="title" :style="{ marginBottom: '30px' }">审批记录</a-col>
              <a-col :span="24">
                <div class="block" v-if="approvalList && approvalList.length > 0">
                  <a-timeline>
                    <a-timeline-item
                      v-for="(item, index) in approvalList"
                      :key="index"
                      :icon="setIcon(item.approverTime)"
                      :color="setColor(item.approverTime)"
                    >
                      <p style="font-weight: 700">{{ item.processName }}</p>
                      <a-card class="box-card" shadow="hover">
                        <a-descriptions :column="4" :labelStyle="{ 'font-weight': 'bold' }">
                          <a-descriptions-item label="操作人">{{ item.approverName || '-' }}</a-descriptions-item>
                          <a-descriptions-item label="申请时间">{{ item.applyTime || '-' }}</a-descriptions-item>
                          <a-descriptions-item label="状态">{{ commentType(item.status) || '-' }}</a-descriptions-item>
                          <a-descriptions-item label="审批时间">{{ item.approverTime || '-' }}</a-descriptions-item>
                          <a-descriptions-item label="审批备注">{{ item.remark || '-' }}</a-descriptions-item>
                        </a-descriptions>
                        <a-divider orientation="left">
                          <a-tag :color="approveTypeTag(item.status)">{{ commentType(item.status) }}</a-tag>
                          <a-tag>{{ item.approverTime || '--' }}</a-tag>
                        </a-divider>
                      </a-card>
                    </a-timeline-item>
                  </a-timeline>
                </div>
                <div v-else>- 暂无记录 -</div>
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </a-form-model>
    </a-spin>
    <div class="drawer-bootom-button">
      <template v-if="this.type !== 3">
        <a-button
          @click="handleApproval"
          type="primary"
          style="margin-right: 0.8rem"
          :loading="approvalLoading"
          :disabled="[1, 2, 3].includes(currnetRow.status)"
          >提交审批
        </a-button>
        <a-button
          @click="handleOk"
          type="primary"
          style="margin-right: 0.8rem"
          :loading="okLoading"
          v-if="this.type !== 2"
          >保存
        </a-button>
      </template>
      <template v-else>
        <!-- status: 1-待审批，2-审批通过，3-审批不通过 -->
        <a-button
          key="submit"
          type="primary"
          :loading="loading"
          @click="handleApprovalSub(2)"
          style="margin-right: 0.8rem"
          :disabled="this.currnetRow.status !== 1"
        >
          通过
        </a-button>
        <a-button
          key="back"
          type="danger"
          @click="handleApprovalSub(1)"
          style="margin-right: 0.8rem"
          :disabled="this.currnetRow.status !== 1"
          >不通过
        </a-button>
      </template>
      <a-button @click="close" style="margin-right: 0.8rem">取消</a-button>
    </div>
    <ApprovalSubmit ref="aprovalForm" @refreshClose="refreshAndClose"></ApprovalSubmit>
    <DepartmentalPurchaseDetail ref="purchaseForm"></DepartmentalPurchaseDetail>
    <ThreeWayPpriceDetail ref="priceForm"></ThreeWayPpriceDetail>
    <!-- 选择关联采购 -->
    <SelectPurchaseList ref="selectPurchase" @select="handleSelectPurchase"></SelectPurchaseList>
    <!-- 选择关联三方 -->
    <SelectPurchaseList
      ref="selectMultiContrast"
      @select="handleSelectContrast"
      :type="'2'"
      modalTitle="关联三方比价表"
    ></SelectPurchaseList>
    <j-file-dialog-preview-modal ref="modalForm"></j-file-dialog-preview-modal>
  </a-drawer>
</template>

<script>
import JFileDialogPreviewModal from '@/components/jeecg/JFileDialogPreviewModal'
import { getDepartmentList } from '@/api/project-management/foreign-price-management/ProjectProfit.js'
import {
  addProcurement,
  addAndSubmit,
  editProcurement,
  getDetail,
  getProcurment,
  getProcurmentApproList,
  getPcmProcurement,
} from '@/api/project-management/PurchaseRequest.js'
import JFormContainer from '@/components/jeecg/JFormContainer'
import JSelectCustomer from '@/views/scrm/modules/JSelectCustomer'
import JSelectProject from '@/views/scrm/modules/JSelectProject'
import ApprovalSubmit from '@/components/ApprovalDialog/ApprovalSubmit.vue'
import DepartmentalPurchaseDetail from './DepartmentalPurchaseDetail'
import ThreeWayPpriceDetail from './ThreeWayPpriceDetail'
import SelectPurchaseList from '@/components/SelectPopoverModel'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin'
import { getDictText } from '@/api/api.js'
import { downFile, getAction } from '@/api/manage'
import { getAmountChinese } from '@/utils/index'
import { simpleDebounce, throttle } from '@/utils/util'
import { Base64 } from 'js-base64'
export default {
  mixins: [TableListMixin],
  components: {
    JSelectCustomer,
    JSelectProject,
    JFormContainer,
    ApprovalSubmit,
    DepartmentalPurchaseDetail,
    ThreeWayPpriceDetail,
    SelectPurchaseList,
    JFileDialogPreviewModal,
  },
  data() {
    return {
      // 开关
      visible: false,
      // 是否禁用
      disableSubmit: false,
      approvalLoading: false,
      okLoading: false,
      // 标题
      title: '详情',
      type: 0,
      // 表单配置
      labelCol: { span: 6 },
      wrapperCol: { span: 17 },
      disableMixinCreated: true,
      // 表单参数
      formParams: {
        type: '1',
        department: this.$store.getters.userInfo.orgCodeTxt, //当前部门
        departIds: this.$store.getters.userInfo.departIds, //当前部门
        phone: this.$store.getters.userInfo.phone, // 当前电话
        people: this.$store.getters.userInfo.realname, // 当前人
        peopleId: this.$store.getters.userInfo.id,
      },
      // 上传地址
      // uploadUrl: process.env.VUE_APP_API_BASE_URL + '/sys/common/upload',
      // 上传请求头
      // headers: {
      //   'X-Access-Token': this.$ls.get('Access-Token'),
      // },
      headers: { 'X-Access-Token': this.$ls.get('Access-Token') },
      uploadUrl: window._CONFIG['domianURL'] + '/sys/upload/uploadMinio',
      // 图片上传列表
      applyFromUrl: [],
      // 图片处理数据集合
      pictureTempListImage: [],

      multiContrastUrl: [], //三方比对表
      pictureTempListMulti: [], //三方比对表数据集合

      applyOrderFormUrl: [], //下单申请表url
      pictureTempListMultiOrder: [], //下单申请表数据集合

      contractReviewUrl: [], //合同审查url
      pictureTempListReview: [], //合同审查数据集合

      payApplyUrl: [], //付款申请表url
      pictureTempListPay: [], //付款申请表数据集合
      activeKey: '1',
      activeKeys: '1',
      principalPersonList: [], //部门列表
      procurmentAble: [],
      priceAble: [],
      approvalList: [],
      // 加载动画开关
      loading: false,
      rules: {
        customerId: [{ required: true, message: '请选择客户名称', trigger: 'change' }],
        projectId: [{ required: true, message: '请选择项目名称', trigger: 'change' }],
        customerName: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
        customerPhone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
        category: [{ required: true, message: '请选择采购类别', trigger: 'change' }],
        useWay: [{ required: true, message: '请选择用途', trigger: 'change' }],
        hasContract: [{ required: true, message: '请选择合同情况', trigger: 'change' }],
        payMethod: [{ required: true, message: '请选择付款方式', trigger: 'change' }],
        degree: [{ required: true, message: '请选择紧急情况', trigger: 'change' }],
        inPlaceTime: [{ required: true, message: '请输入需求到位时间', trigger: 'blur' }],
        purchaseContext: [{ required: true, message: '请输入采购内容', trigger: 'blur' }],
        payCategory: [{ required: true, message: '请选择付款类别', trigger: 'change' }],
        types: [{ required: true, message: '请选择类型', trigger: 'change' }],
        payContext: [{ required: true, message: '请输入付款内容描述', trigger: 'blur' }],
        receivingUnit: [{ required: true, message: '请输入收款单位', trigger: 'blur' }],
        bank: [{ required: true, message: '请输入开户银行', trigger: 'blur' }],
        bankAccount: [{ required: true, message: '请输入银行账号', trigger: 'blur' }],
        upperAmount: [{ required: true, message: '请输入金额（大写）', trigger: 'blur' }],
        lowerAmount: [{ required: true, message: '请输入金额（小写）', trigger: 'blur' }],
        payType: [{ required: true, message: '请选择付款方式', trigger: 'change' }],
        billSituation: [{ required: true, message: '请输入票据情况', trigger: 'blur' }],
        purchaseApplyId: [{ required: true, message: '请选择关联采购申请', trigger: 'change' }],
        applyFromUrl: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (this.applyFromUrl == '') return callback(new Error('请上传下单申请表！'))
              callback()
            },
            trigger: 'blur',
          },
        ],
        multiContrastUrl: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (this.multiContrastUrl == '') return callback(new Error('请上传三方比对表！'))
              callback()
            },
            trigger: 'blur',
          },
        ],
        applyOrderFormUrl: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (this.applyOrderFormUrl == '') return callback(new Error('请上传下单申请表！'))
              callback()
            },
            trigger: 'blur',
          },
        ],
        contractReviewUrl: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (this.contractReviewUrl == '') return callback(new Error('请上传合同审查表！'))
              callback()
            },
            trigger: 'blur',
          },
        ],
      },
      currnetId: '',
      currnetRow: {},
      procurmentAbleDetail: [],
      multiContrasDetail: [],
      purchaseApplyId: '',
    }
  },
  computed: {
    commentType() {
      return (val) => {
        switch (val) {
          case 1:
            return '待审批'
          case 2:
            return '审批通过'
          case 3:
            return '审批不通过'
          case 4:
            return '申请通过'
        }
      }
    },
    approveTypeTag() {
      return (val) => {
        switch (val) {
          case 1:
            return 'orange'
          case 2:
            return 'green'
          case 3:
            return 'red'
          case 3:
            return 'blue'
        }
      }
    },
  },
  methods: {
    getDictText,
    setIcon(val) {
      if (val) {
        return 'el-icon-check'
      } else {
        return 'el-icon-time'
      }
    },
    setColor(val) {
      if (val) {
        return '#2bc418'
      } else {
        return '#b3bdbb'
      }
    },
    // 下载模版
    download(fileName, format, url) {
      downFile(url).then((data) => {
        if (!data || data.size === 0) {
          Vue.prototype['$message'].warning('文件下载失败')
          return
        }
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          window.navigator.msSaveBlob(new Blob([data]), fileName)
        } else {
          let url = window.URL.createObjectURL(new Blob([data]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', fileName + `.${format}`)
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link) //下载完成移除元素
          window.URL.revokeObjectURL(url) //释放掉blob对象
        }
      })
    },
    //* ---选择与接收 关联采购/三方比价start---
    onSearchPurchase() {
      this.$refs.selectPurchase.open(this.formParams.purchaseApplyId)
    },
    handleSelectPurchase(data) {
      console.log(data.selectionRows[0].id)
      this.$set(this.formParams, 'purchaseApplyId', data.selectionRows[0].id)
      this.$set(
        this.formParams,
        'purchaseApplyName',
        `采购申请-${data.selectionRows[0].people}-${data.selectionRows[0].time}`
      )

      getPcmProcurement(data.selectionRows[0].id).then((res) => {
        if (res.success) {
          console.log(res)
          this.$set(this.formParams, 'customerId', res.result.pcmContextFirst.customerId)
          this.$set(this.formParams, 'projectId', res.result.pcmContextFirst.projectId)
          this.$set(this.formParams, 'customerName', res.result.pcmContextFirst.customerName)
          this.$set(this.formParams, 'projectName', res.result.pcmContextFirst.projectName)
        }
      })
    },
    onSearchMultiContrast() {
      this.$refs.selectMultiContrast.open(this.formParams.multiContrastId)
    },
    handleSelectContrast(data) {
      this.$set(this.formParams, 'multiContrastId', data.selectionRows[0].id)
      this.$set(
        this.formParams,
        'multiContrastName',
        `三方比价申请-${data.selectionRows[0].people}-${data.selectionRows[0].time}`
      )
    },
    //* ---选择接收 关联采购/三方比价 end---
    changeAmount(e) {
      this.formParams.upperAmount = getAmountChinese(e.target.value)
    },
    // 跳转查看关联的采购
    handlePurchase(num) {
      // this.getProcurmentApproList(this.formParams.pcmContextThird.purchaseApplyId)
      if (this.purchaseApplyId) {
        this.$refs.purchaseForm.detail(this.formParams.pcmContextThird.purchaseApplyId)
      }
      // this.activeKeys = '1'
      // this.activeKey = '1'
    },
    handleMultiContras(num) {
      if (this.multiContrastId) {
        this.$refs.priceForm.detail(this.formParams.pcmContextThird.multiContrastId)
      }
    },
    getProcurmentApproList(id) {
      getProcurmentApproList(id).then((res) => {
        if (res.success) {
          this.approvalList = res.result.approves

          this.formParams.category = res.result.pcmContextFirst.category
          this.formParams.useWay = res.result.pcmContextFirst.useWay
          this.formParams.payMethod = res.result.pcmContextFirst.payMethod
          this.formParams.hasContract = res.result.pcmContextFirst.hasContract
          this.formParams.degree = res.result.pcmContextFirst.degree
          this.formParams.inPlaceTime = res.result.pcmContextFirst.inPlaceTime
          this.formParams.applyFromUrl = res.result.pcmContextFirst.applyFromUrl
          this.formParams.customerName = res.result.pcmContextFirst.customerName
          this.formParams.customerId = res.result.pcmContextFirst.customerId
          this.formParams.projectName = res.result.pcmContextFirst.projectName
          this.formParams.projectId = res.result.pcmContextFirst.projectId
          // let applyFromUrl = res.result.pcmContextFirst.applyFromUrl
          //   ? res.result.pcmContextFirst.applyFromUrl.split(',')
          //   : []
          this.applyFromUrl = res.result.pcmContextFirst.applyFromUrl.map((item, index) => {
            let i = index + 1
            return {
              uid: item.uid,
              status: 'done',
              name: item.name,
              url: item.url,
            }
          })
        }
      })
    },
    // 切换tab
    handleChange(key) {
      this.activeKey = key
      this.formParams = {
        type: key,
        department: this.$store.getters.userInfo.orgCodeTxt, //当前部门
        departIds: this.$store.getters.userInfo.departIds, //当前部门
        phone: this.$store.getters.userInfo.phone, // 当前电话
        people: this.$store.getters.userInfo.realname, // 当前人
      }
      if (this.currnetId) {
        this.getDetail(this.currnetId)
      }
      if (key == 3) {
        this.getProcurment(1)
        this.getProcurment(2)
      }
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
      this.$set(this.formParams, 'customerId', rows[0].id)
      this.$set(this.formParams, 'customerName', rows[0].customName)
    },
    // 项目改变事件
    handelChange(value, rows) {
      this.$set(this.formParams, 'projectId', value)
      this.$set(this.formParams, 'projectName', rows[0].projectName)
      // this.$set(this.formParams, 'companyName', rows[0].customer) //客户名称
      // this.$set(this.formParams, 'customerName', rows[0].liaison) //联系人
      // this.$set(this.formParams, 'customerPhone', rows[0].phone) //联系电话
    },
    handleProcurmentAble(val) {
      this.formParams.purchaseApplyId = val
      this.$forceUpdate()
    },
    // 可关联采购申请列表
    getProcurment(type) {
      getProcurment({ type }).then((res) => {
        if (res.success) {
          if (type == 1) {
            this.procurmentAble = res.result.records
          } else {
            this.priceAble = res.result.records
          }
        }
      })
    },
    getProcumentDetail() {
      console.log(this.purchaseApplyId)
      if (this.purchaseApplyId) {
        this.procurmentAbleDetail = this.procurmentAble.filter((item) => {
          console.log(this.purchaseApplyId)
          return item.id == this.purchaseApplyId
        })
      } else {
        this.procurmentAbleDetail = []

        // console.log('this.procurmentAbleDetail', this.procurmentAbleDetail, this.priceAble)
      }
    },
    getPriceAble() {
      if (this.multiContrastId) {
        this.multiContrasDetail = this.priceAble.filter((item) => {
          // console.log(this.multiContrastId)
          return item.id == this.multiContrastId
        })
      } else {
        this.multiContrasDetail = []
      }
    },
    refreshAndClose() {
      this.close()
      this.$emit('refresh')
    },
    // 2通过/1不通过
    handleApprovalSub(type) {
      this.$refs.aprovalForm.type = type
      this.$refs.aprovalForm.open(type, this.currnetRow)
    },
    close() {
      this.visible = false
      // 重置表单
      this.$refs.ruleForm.resetFields()
      this.formParams = {
        type: '1',
        department: this.$store.getters.userInfo.orgCodeTxt, //当前部门
        departIds: this.$store.getters.userInfo.departIds, //当前部门
        phone: this.$store.getters.userInfo.phone, // 当前电话
        people: this.$store.getters.userInfo.realname, // 当前人
        peopleId: this.$store.getters.userInfo.id,
      }
      this.applyFromUrl = []
      this.multiContrastUrl = []
      this.pictureTempListImage = []
      this.pictureTempListMulti = []
      this.pictureTempListMultiOrder = []
      this.applyOrderFormUrl = []
      this.contractReviewUrl = []
      this.pictureTempListReview = []
      this.payApplyUrl = []
      this.pictureTempListPay = []
      this.currnetRow = {}
      this.activeKey = '1'
      this.activeKeys = '1'
      this.currnetId = ''
      this.procurmentAble = []
      this.priceAble = []
      this.approvalList = []
      this.purchaseApplyId = ''
      this.multiContrastId = ''
      this.procurmentAbleDetail = []
      this.multiContrasDetail = []
    },
    async open() {
      // this.getDepartmentList()
      await this.getProcurment(1)
      await this.getProcurment(2)
      if (this.currnetRow.type == 1 || this.currnetRow.type == 4) {
        this.activeKey = '1'
      } else if (this.currnetRow.type == 2 || this.currnetRow.type == 6) {
        this.activeKey = '2'
      } else if (this.currnetRow.type == 3 || this.currnetRow.type == 7) {
        this.activeKey = '3'
      }

      await setTimeout(() => {
        this.getProcumentDetail()
        this.getPriceAble()
        // console.log(this.procurmentAble, this.purchaseApplyId, this.procurmentAbleDetail, this.multiContrasDetail)
      }, 300)
      this.visible = true
    },
    add() {
      this.type = 0
      this.open()
    },
    edit(record) {
      this.type = 1

      this.currnetId = record.id
      this.currnetRow = record
      this.open()
      setTimeout(() => {
        this.getDetail(record.id)
      }, 300)
    },
    detail(record) {
      this.type = 2
      this.getDetail(record.id)
      this.currnetId = record.id
      this.currnetRow = record
      this.open()
    },
    // 审批
    approvalDetail(record) {
      this.type = 3
      this.getDetail(record.typeId)
      this.currnetId = record.typeId
      this.currnetRow = record
      this.disableSubmit = true

      this.open()
    },
    getDetail(id) {
      getDetail(id).then((res) => {
        if (res.success) {
          this.formParams = res.result
          // this.activeKey = res.result.type.toString()
          this.activeKeys = res.result.type.toString()
          this.approvalList = res.result.approves

          if (res.result.type == 1) {
            this.$set(this.formParams, 'category', res.result.pcmContextFirst.category)
            this.$set(this.formParams, 'useWay', res.result.pcmContextFirst.useWay)
            this.$set(this.formParams, 'payMethod', res.result.pcmContextFirst.payMethod)
            this.$set(this.formParams, 'hasContract', res.result.pcmContextFirst.hasContract)
            this.$set(this.formParams, 'degree', res.result.pcmContextFirst.degree)
            this.$set(this.formParams, 'inPlaceTime', res.result.pcmContextFirst.inPlaceTime)
            this.$set(this.formParams, 'applyFromUrl', res.result.pcmContextFirst.applyFromUrl)
            this.$set(this.formParams, 'customerName', res.result.pcmContextFirst.customerName)
            this.$set(this.formParams, 'customerId', res.result.pcmContextFirst.customerId)
            this.$set(this.formParams, 'projectName', res.result.pcmContextFirst.projectName)
            this.$set(this.formParams, 'projectId', res.result.pcmContextFirst.projectId)
            // let applyFromUrl = res.result.pcmContextFirst.applyFromUrl
            //   ? res.result.pcmContextFirst.applyFromUrl.split(',')
            //   : []
            this.applyFromUrl = res.result.pcmContextFirst.applyFromUrl.map((item, index) => {
              let i = index + 1
              return {
                uid: item.uid,
                status: 'done',
                name: item.name,
                url: item.url,
              }
            })
          } else if (this.formParams.type == 2) {
            this.$set(this.formParams, 'customerId', res.result.pcmContextSecond.customerId)
            this.$set(this.formParams, 'customerName', res.result.pcmContextSecond.customerName)
            this.$set(this.formParams, 'projectId', res.result.pcmContextSecond.projectId)
            this.$set(this.formParams, 'projectName', res.result.pcmContextSecond.projectName)
            this.$set(this.formParams, 'category', res.result.pcmContextSecond.category)
            this.$set(this.formParams, 'purchaseContext', res.result.pcmContextSecond.purchaseContext)
            this.$set(this.formParams, 'multiContrastUrl', res.result.pcmContextSecond.multiContrastUrl)
            // let multiContrastUrl = res.result.pcmContextSecond.multiContrastUrl
            //   ? res.result.pcmContextSecond.multiContrastUrl.split(',')
            //   : []
            this.multiContrastUrl = res.result.pcmContextSecond.multiContrastUrl.map((item, index) => {
              let i = index + 1
              return {
                uid: item.uid,
                status: 'done',
                name: item.name,
                url: item.url,
              }
            })
          } else if (this.formParams.type == 3) {
            this.$set(this.formParams, 'payCategory', res.result.pcmContextThird.payCategory)
            this.$set(this.formParams, 'applyOrderFormUrl', res.result.pcmContextThird.applyOrderFormUrl)
            this.$set(this.formParams, 'contractReviewUrl', res.result.pcmContextThird.contractReviewUrl)
            this.$set(this.formParams, 'payApplyUrl', res.result.pcmContextThird.payApplyUrl)
            this.$set(this.formParams, 'multiContrastId', res.result.pcmContextThird.multiContrastId)
            this.$set(this.formParams, 'types', res.result.pcmContextThird.type)
            this.$set(this.formParams, 'payContext', res.result.pcmContextThird.payContext)
            this.$set(this.formParams, 'receivingUnit', res.result.pcmContextThird.receivingUnit)
            this.$set(this.formParams, 'bank', res.result.pcmContextThird.bank)
            this.$set(this.formParams, 'bankAccount', res.result.pcmContextThird.bankAccount)
            this.$set(this.formParams, 'upperAmount', res.result.pcmContextThird.upperAmount)
            this.$set(this.formParams, 'lowerAmount', res.result.pcmContextThird.lowerAmount)
            this.$set(this.formParams, 'payType', res.result.pcmContextThird.payType)
            this.$set(this.formParams, 'billSituation', res.result.pcmContextThird.billSituation)
            this.$set(this.formParams, 'purchaseApplyId', res.result.pcmContextThird.purchaseApplyId)
            this.$set(this.formParams, 'customerId', res.result.pcmContextThird.customerId)
            this.$set(this.formParams, 'customerName', res.result.pcmContextThird.customerName)
            this.$set(this.formParams, 'projectId', res.result.pcmContextThird.projectId)
            this.$set(this.formParams, 'projectName', res.result.pcmContextThird.projectName)

            // let applyOrderFormUrl = res.result.pcmContextThird.applyOrderFormUrl
            //   ? res.result.pcmContextThird.applyOrderFormUrl.split(',')
            //   : []
            this.applyOrderFormUrl = res.result.pcmContextThird.applyOrderFormUrl.map((item, index) => {
              let i = index + 1
              return {
                uid: item.uid,
                status: 'done',
                name: item.name,
                url: item.url,
              }
            })
            // let contractReviewUrl = res.result.pcmContextThird.contractReviewUrl
            //   ? res.result.pcmContextThird.contractReviewUrl.split(',')
            //   : []
            // this.contractReviewUrl = res.result.pcmContextThird.contractReviewUrl.map((item, index) => {
            //   let i = index + 1
            //   return {
            //     uid: item.uid,
            //     status: 'done',
            //     name: item.name,
            //     url: item.url,
            //   }
            // })
          }
        }
        this.purchaseApplyId = res.result.pcmContextThird.purchaseApplyId
        this.multiContrastId = res.result.pcmContextThird.multiContrastId
        // console.log(this.purchaseApplyId, this.multiContrastId)
        this.getProcumentDetail()
        this.getPriceAble()
        // console.log('this.procurmentAbleDetail', this.procurmentAbleDetail, this.multiContrasDetail)
        if (this.procurmentAbleDetail.length) {
          this.$set(
            this.formParams,
            'purchaseApplyName',
            `采购申请-${this.procurmentAbleDetail[0].people}-${this.procurmentAbleDetail[0].time}`
          )
        }
        if (this.multiContrasDetail.length) {
          this.$set(
            this.formParams,
            'multiContrastName',
            `三方比价申请-${this.multiContrasDetail[0].people}-${this.multiContrasDetail[0].time}`
          )
        }
      })
    },
    // 文件上传
    // handleUploadChange(info) {
    //   console.log(info)
    //   const isLt10M = info.file.size / 1024 / 1024 < 10
    //   // if (!isLt10M) {
    //   //   this.$message.error('上传图片大小不能超过10M!')
    //   //   return false
    //   // }

    //   let fileList = [...info.fileList]
    //   this.applyFromUrl = fileList

    //   if (info.file.status === 'uploading') {
    //     return
    //   }
    //   if (info.file.status === 'done') {
    //     let a = fileList[fileList.length - 1]
    //     this.pictureTempListImage.push({
    //       uid: a.uid,
    //       status: 'done',
    //       name: a.name,
    //       url: a.response.message,
    //     })

    //     this.applyFromUrl = this.pictureTempListImage
    //     // const data = this.applyFromUrl.map((item) => item.url).toString()
    //     this.formParams.applyFromUrl = this.pictureTempListImage
    //   }
    // },
    // 移除
    // handleRemoveImage(file) {
    //   this.pictureTempListImage.splice(this.pictureTempListImage.indexOf(file), 1)
    //   this.formParams.applyFromUrl = this.pictureTempListImage.map((item) => item.url).toString()
    //   console.log(this.pictureTempListImage, this.formParams.applyFromUrl)
    // },
    // 文件上传
    handleUploadChange(info) {
      let fileList = [...info.fileList]
      if (info.file.status === 'uploading') {
        this.applyFromUrl = fileList
      }
      if (info.file.status === 'done') {
        let result = info.file.response.result
        this.pictureTempListImage.push({
          uid: result.id,
          status: 'done',
          name: result.fileName,
          url: result.url,
        })
        this.applyFromUrl = this.pictureTempListImage
        this.formParams.applyFromUrl = this.pictureTempListImage
      }
    },
    // 移除
    handleRemoveImage(file) {
      const index = this.applyFromUrl.indexOf(file)
      const newFileList = this.applyFromUrl.slice()
      newFileList.splice(index, 1)
      this.applyFromUrl = newFileList
      const newUploadList = this.formParams.applyFromUrl.slice()
      newUploadList.splice(index, 1)
      this.formParams.applyFromUrl = newUploadList
      this.pictureTempListImage = newUploadList
    },
    downloadFile(file) {
      getAction('sys/upload/preview', { id: file.uid }).then((res) => {
        if (res.success) {
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = res.result
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link) //下载完成移除元素
        } else {
          this.$message.error('文件下载失败')
        }
      })
    },
    async handlePreview(file) {
      console.log(file)
      let that = this
      getAction('sys/upload/preview', { id: file.uid }).then((res) => {
        if (res.success) {
          if (res && res.result) {
            let url = window._CONFIG['onlinePreviewDomainURL'] + '?url=' + encodeURIComponent(Base64.encode(res.result))
            console.log(url)
            that.$refs.modalForm.open(url)
          }
        } else {
          this.$message.error('文件预览失败')
        }
      })
    },

    // 三方比价表
    // handleUploadMultiContras(info) {
    //   let fileList = [...info.fileList]
    //   this.multiContrastUrl = fileList

    //   if (info.file.status === 'uploading') {
    //     return
    //   }
    //   if (info.file.status === 'done') {
    //     let a = fileList[fileList.length - 1]
    //     this.pictureTempListMulti.push({
    //       uid: a.uid,
    //       status: 'done',
    //       name: a.name,
    //       url: a.response.message,
    //     })

    //     this.multiContrastUrl = this.pictureTempListMulti
    //     // const data = this.multiContrastUrl.map((item) => item.url).toString()
    //     this.formParams.multiContrastUrl = this.pictureTempListMulti
    //   }
    // },
    // handleRemoveMultiContras(file) {
    //   this.pictureTempListMulti.splice(this.pictureTempListMulti.indexOf(file), 1)
    //   this.formParams.multiContrastUrl = this.pictureTempListMulti.map((item) => item.url).toString()
    //   console.log(this.pictureTempListMulti, this.formParams.multiContrastUrl)
    // },
    // 三方比价表
    handleUploadMultiContras(info) {
      let fileList = [...info.fileList]
      if (info.file.status === 'uploading') {
        this.multiContrastUrl = fileList
      }
      if (info.file.status === 'done') {
        let result = info.file.response.result
        this.pictureTempListMulti.push({
          uid: result.id,
          status: 'done',
          name: result.fileName,
          url: result.url,
        })
        this.multiContrastUrl = this.pictureTempListMulti
        this.formParams.multiContrastUrl = this.pictureTempListMulti
      }
    },
    // 移除
    handleRemoveMultiContras(file) {
      const index = this.multiContrastUrl.indexOf(file)
      const newFileList = this.multiContrastUrl.slice()
      newFileList.splice(index, 1)
      this.multiContrastUrl = newFileList
      const newUploadList = this.formParams.multiContrastUrl.slice()
      newUploadList.splice(index, 1)
      this.formParams.multiContrastUrl = newUploadList
      this.pictureTempListMulti = newUploadList
    },
    downloadFileMultiContras(file) {
      getAction('sys/upload/preview', { id: file.uid }).then((res) => {
        if (res.success) {
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = res.result
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link) //下载完成移除元素
        } else {
          this.$message.error('文件下载失败')
        }
      })
    },
    async handlePreviewMultiContras(file) {
      console.log(file)
      let that = this
      getAction('sys/upload/preview', { id: file.uid }).then((res) => {
        if (res.success) {
          if (res && res.result) {
            let url = window._CONFIG['onlinePreviewDomainURL'] + '?url=' + encodeURIComponent(Base64.encode(res.result))
            console.log(url)
            that.$refs.modalForm.open(url)
          }
        } else {
          this.$message.error('文件预览失败')
        }
      })
    },

    // 下单申请表
    // handleUploadChangeOrder(info) {
    //   let fileList = [...info.fileList]
    //   this.applyOrderFormUrl = fileList

    //   if (info.file.status === 'uploading') {
    //     return
    //   }
    //   if (info.file.status === 'done') {
    //     let a = fileList[fileList.length - 1]
    //     this.pictureTempListMultiOrder.push({
    //       uid: a.uid,
    //       status: 'done',
    //       name: a.name,
    //       url: a.response.message,
    //     })

    //     this.applyOrderFormUrl = this.pictureTempListMultiOrder
    //     // const data = this.applyOrderFormUrl.map((item) => item.url).toString()
    //     this.formParams.applyOrderFormUrl = this.pictureTempListMultiOrder
    //   }
    // },
    // handleRemoveChangeOrder(file) {
    //   this.pictureTempListMultiOrder.splice(this.pictureTempListMultiOrder.indexOf(file), 1)
    //   this.formParams.applyOrderFormUrl = this.pictureTempListMultiOrder.map((item) => item.url).toString()
    //   console.log(this.pictureTempListMultiOrder, this.formParams.applyOrderFormUrl)
    // },
    handleUploadChangeOrder(info) {
      let fileList = [...info.fileList]
      if (info.file.status === 'uploading') {
        this.applyOrderFormUrl = fileList
      }
      if (info.file.status === 'done') {
        let result = info.file.response.result
        this.pictureTempListMultiOrder.push({
          uid: result.id,
          status: 'done',
          name: result.fileName,
          url: result.url,
        })
        this.applyOrderFormUrl = this.pictureTempListMultiOrder
        this.formParams.applyOrderFormUrl = this.pictureTempListMultiOrder
      }
    },
    // 移除
    handleRemoveChangeOrder(file) {
      const index = this.applyOrderFormUrl.indexOf(file)
      const newFileList = this.applyOrderFormUrl.slice()
      newFileList.splice(index, 1)
      this.applyOrderFormUrl = newFileList
      const newUploadList = this.formParams.applyOrderFormUrl.slice()
      newUploadList.splice(index, 1)
      this.formParams.applyOrderFormUrl = newUploadList
      this.pictureTempListMultiOrder = newUploadList
    },
    downloadFileChangeOrder(file) {
      getAction('sys/upload/preview', { id: file.uid }).then((res) => {
        if (res.success) {
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = res.result
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link) //下载完成移除元素
        } else {
          this.$message.error('文件下载失败')
        }
      })
    },
    async handlePreviewChangeOrder(file) {
      console.log(file)
      let that = this
      getAction('sys/upload/preview', { id: file.uid }).then((res) => {
        if (res.success) {
          if (res && res.result) {
            let url = window._CONFIG['onlinePreviewDomainURL'] + '?url=' + encodeURIComponent(Base64.encode(res.result))
            console.log(url)
            that.$refs.modalForm.open(url)
          }
        } else {
          this.$message.error('文件预览失败')
        }
      })
    },

    // 审批
    handleApproval() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let pcmContextFirst = {}
          let pcmContextSecond = {}
          let pcmContextThird = {}
          if (this.formParams.type == 1) {
            pcmContextFirst = {
              category: this.formParams.category,
              useWay: this.formParams.useWay,
              payMethod: this.formParams.payMethod,
              hasContract: this.formParams.hasContract,
              degree: this.formParams.degree,
              inPlaceTime: this.formParams.inPlaceTime,
              applyFromUrl: this.formParams.applyFromUrl,
              customerName: this.formParams.customerName,
              customerId: this.formParams.customerId,
              projectName: this.formParams.projectName,
              projectId: this.formParams.projectId,
            }
          } else if (this.formParams.type == 2) {
            pcmContextSecond = {
              customerId: this.formParams.customerId,
              customerName: this.formParams.customerName,
              projectId: this.formParams.projectId,
              projectName: this.formParams.projectName,
              category: this.formParams.category,
              purchaseContext: this.formParams.purchaseContext,
              multiContrastUrl: this.formParams.multiContrastUrl,
            }
          } else if (this.formParams.type == 3) {
            pcmContextThird = {
              applyOrderFormUrl: this.formParams.applyOrderFormUrl,
              contractReviewUrl: this.formParams.contractReviewUrl,
              payApplyUrl: this.formParams.payApplyUrl,
              multiContrastId: this.formParams.multiContrastId,
              payCategory: this.formParams.payCategory,
              type: this.formParams.types,
              payContext: this.formParams.payContext,
              receivingUnit: this.formParams.receivingUnit,
              bank: this.formParams.bank,
              bankAccount: this.formParams.bankAccount,
              upperAmount: this.formParams.upperAmount,
              lowerAmount: this.formParams.lowerAmount,
              payType: this.formParams.payType,
              billSituation: this.formParams.billSituation,
              purchaseApplyId: this.formParams.purchaseApplyId,
              customerId: this.formParams.customerId,
              projectId: this.formParams.projectId,
              customerName: this.formParams.customerName,
              projectName: this.formParams.projectName,
            }
          }
          let data = {
            department: this.formParams.department,
            people: this.formParams.people,
            type: this.formParams.type,
            phone: this.formParams.phone,
            id: this.formParams.id,
            peopleId: this.$store.getters.userInfo.id,
            pcmContextFirst: pcmContextFirst,
            pcmContextSecond: pcmContextSecond,
            pcmContextThird: pcmContextThird,
          }
          console.log('data', data)
          this.approvalLoading = true
          addAndSubmit(data)
            .then((res) => {
              if (res.success) {
                this.$message.success(res.message)
                this.$emit('refresh')
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
          return false
        }
      })
    },
    //提交
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        console.log('--', this.formParams.type, this.type, this.formParams)
        if (valid) {
          let pcmContextFirst = {}
          let pcmContextSecond = {}
          let pcmContextThird = {}
          if (this.formParams.type == 1) {
            pcmContextFirst = {
              category: this.formParams.category,
              useWay: this.formParams.useWay,
              payMethod: this.formParams.payMethod,
              hasContract: this.formParams.hasContract,
              degree: this.formParams.degree,
              inPlaceTime: this.formParams.inPlaceTime,
              applyFromUrl: this.formParams.applyFromUrl,
              customerName: this.formParams.customerName,
              customerId: this.formParams.customerId,
              projectName: this.formParams.projectName,
              projectId: this.formParams.projectId,
            }
          } else if (this.formParams.type == 2) {
            pcmContextSecond = {
              // id: this.formParams.pcmContextSecond.id ? this.formParams.pcmContextSecond.id : '',
              customerId: this.formParams.customerId,
              customerName: this.formParams.customerName,
              projectId: this.formParams.projectId,
              projectName: this.formParams.projectName,
              category: this.formParams.category,
              purchaseContext: this.formParams.purchaseContext,
              multiContrastUrl: this.formParams.multiContrastUrl,
            }
          } else if (this.formParams.type == 3) {
            pcmContextThird = {
              // id: this.formParams.pcmContextThird.id ? this.formParams.pcmContextThird.id : '',
              applyOrderFormUrl: this.formParams.applyOrderFormUrl,
              contractReviewUrl: this.formParams.contractReviewUrl,
              payApplyUrl: this.formParams.payApplyUrl,
              multiContrastId: this.formParams.multiContrastId,
              payCategory: this.formParams.payCategory,
              type: this.formParams.types,
              payContext: this.formParams.payContext,
              receivingUnit: this.formParams.receivingUnit,
              bank: this.formParams.bank,
              bankAccount: this.formParams.bankAccount,
              upperAmount: this.formParams.upperAmount,
              lowerAmount: this.formParams.lowerAmount,
              payType: this.formParams.payType,
              billSituation: this.formParams.billSituation,
              purchaseApplyId: this.formParams.purchaseApplyId,
              customerId: this.formParams.customerId,
              projectId: this.formParams.projectId,
              customerName: this.formParams.customerName,
              projectName: this.formParams.projectName,
            }
          }
          let data = {
            department: this.formParams.department,
            people: this.formParams.people,
            peopleId: this.$store.getters.userInfo.id,
            type: this.formParams.type,
            phone: this.formParams.phone,
            pcmContextFirst: pcmContextFirst,
            pcmContextSecond: pcmContextSecond,
            pcmContextThird: pcmContextThird,
          }
          console.log('data', data)
          if (this.type == 0) {
            this.okLoading = true
            addProcurement(data)
              .then((res) => {
                if (res.success) {
                  this.$message.success(res.message)
                  this.$emit('refresh')
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
            if (this.formParams.type == 1) {
              data.pcmContextFirst.id = this.formParams.pcmContextFirst.id
            } else if (this.formParams.type == 2) {
              data.pcmContextSecond.id = this.formParams.pcmContextSecond.id
            } else if (this.formParams.type == 3) {
              data.pcmContextThird.id = this.formParams.pcmContextThird.id
            }
            this.okLoading = true
            editProcurement(data)
              .then((res) => {
                if (res.success) {
                  this.$message.success(res.message)
                  this.$emit('refresh')
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
          }
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
  margin: 20px 0;
  font-weight: 600;
}
.content {
  padding: 0 20px;
  margin: 20px 0;
}
/deep/ .j-form-container {
  padding: 0;
}
</style>
