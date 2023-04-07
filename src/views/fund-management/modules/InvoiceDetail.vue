<template>
  <a-drawer
    :title="title"
    :maskClosable="true"
    width="70%"
    placement="right"
    :closable="true"
    @close="close"
    :visible="visible"
    style="overflow: auto; padding-bottom: 53px"
  >
    <a-spin tip="加载中..." :spinning="loading">
      <a-form-model ref="ruleForm" :model="formParams" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row>
          <a-tabs default-active-key="1">
            <a-tab-pane key="1" tab="基础信息">
              <a-col :span="24" class="title">基础信息</a-col>
              <a-col :span="8">
                <a-form-model-item label="编号" prop="num">
                  <span>{{ formParams.num }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="发票号码" prop="invoiceNum">
                  <span>{{ formParams.invoiceNum }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="申请人" prop="applyPeopleName">
                  <span>{{ formParams.applyPeopleName }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="关联客户" prop="customName">
                  <a-tag color="#fff4ea" v-for="item in this.customNameList" :key="item">
                    <div :style="{ color: '#ff943c' }">
                      {{ item }}
                    </div>
                  </a-tag>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="关联回款类型" prop="type">
                  <!-- 1-应收款，2-回款单 -->
                  <span>{{ formParams.type == 1 ? '应收款' : formParams.type == 2 ? '回款单' : '' }}</span>
                </a-form-model-item>
              </a-col>

              <template v-if="formParams.type == 1">
                <a-col :span="8">
                  <a-form-model-item label="应收款" prop="items">
                    <a-tag color="#fff4ea" v-for="item in this.receivableNums" :key="item">
                      <div :style="{ color: '#ff943c' }">
                        {{ item }}
                      </div>
                    </a-tag>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="回款单" prop="items">
                    <span>无</span>
                  </a-form-model-item>
                </a-col>
              </template>
              <template v-else>
                <a-col :span="8">
                  <a-form-model-item label="回款单" prop="items">
                    <a-tag color="#fff4ea" v-for="item in this.returnNums" :key="item">
                      <div :style="{ color: '#ff943c' }">
                        {{ item }}
                      </div>
                    </a-tag>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="应收款" prop="items">
                    <span>无</span>
                  </a-form-model-item>
                </a-col>
              </template>

              <a-col :span="8">
                <a-form-model-item label="开票日期" prop="invoiceDate">
                  <span>{{ formParams.invoiceDate }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item
                  label="开票金额"
                  prop="invoiceAmount"
                  :label-col="{ span: 2 }"
                  :wrapper-col="{ span: 17 }"
                >
                  <span>{{ formParams.invoiceAmount }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item label="" prop="invoiceAmount" :label-col="{ span: 2 }" :wrapper-col="{ span: 21 }">
                  <a-table
                    :columns="columns"
                    :data-source="formParams.itemsInfo"
                    :rowKey="(record) => record.id"
                    bordered
                    size="small"
                    :scroll="{ x: true }"
                    :indentSize="10"
                    :pagination="false"
                  >
                  </a-table>
                </a-form-model-item>
              </a-col>

              <a-col :span="24" class="title">扩展信息</a-col>
              <a-col :span="8">
                <a-form-model-item label="发票类型" prop="invoiceType">
                  <!-- 1-增值税普通发票，2-增值税专用发票，3-国税通用机打发票，4-地税通用机打发票，5-收据 -->
                  <span>{{ getDictText('invoice_type', formParams.invoiceType) }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="备注" prop="remark">
                  <span>{{ formParams.remark }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item
                  label="附件"
                  prop="attachmentUrl"
                  :label-col="{ span: 2 }"
                  :wrapper-col="{ span: 17 }"
                >
                  <a-upload
                    :action="uploadUrl"
                    :multiple="true"
                    :file-list="attachmentUrl"
                    :headers="headers"
                    :disabled="disableSubmit"
                  >
                  </a-upload>
                </a-form-model-item>
              </a-col>
            </a-tab-pane>

            <a-tab-pane key="2" tab="开票信息" force-render>
              <a-col :span="24" class="title">开票信息</a-col>
              <a-col :span="12">
                <a-form-model-item label="抬头类型" prop="titleType">
                  <!-- 1-企业，2-个人 -->
                  <span>{{ formParams.titleType == 1 ? '企业' : formParams.titleType == 2 ? '个人' : '-' }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="发票抬头" prop="titleInvoice">
                  <span>{{ formParams.titleInvoice || '-' }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="纳税识别号" prop="taxIdentificationNumber">
                  <span>{{ formParams.taxIdentificationNumber || '-' }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="注册电话" prop="registerPhone">
                  <span>{{ formParams.registerPhone || '-' }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="开票地址" prop="invoiceAddress">
                  <span>{{ formParams.invoiceAddress || '-' }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="开户行" prop="bankOfDeposit">
                  <span>{{ formParams.bankOfDeposit || '-' }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="开户账号" prop="accountNumber">
                  <span>{{ formParams.accountNumber || '-' }}</span>
                </a-form-model-item>
              </a-col>

              <a-col :span="24" class="title">寄送信息</a-col>
              <a-col :span="12">
                <a-form-model-item label="地址名称" prop="addressName">
                  <span>{{ formParams.addressName || '-' }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="联系人" prop="contactPerson">
                  <span>{{ formParams.contactPerson || '-' }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="联系电话" prop="contactPhone">
                  <span>{{ formParams.contactPhone || '-' }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="详细地址" prop="fullAddress">
                  <span>{{ formParams.fullAddress || '-' }}</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="邮政编码" prop="postalCode">
                  <span>{{ formParams.postalCode || '-' }}</span>
                </a-form-model-item>
              </a-col>
            </a-tab-pane>
          </a-tabs>
        </a-row>
      </a-form-model>
    </a-spin>
  </a-drawer>
</template>

<script>
import { getContractList, getInvoiceDetail } from '@/api/fund-management/Collection.js'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin'
import { getDictText } from '@/api/api.js'
export default {
  mixins: [TableListMixin],
  data() {
    return {
      // 开关
      visible: false,
      // 是否禁用
      disableSubmit: false,
      // 标题
      title: '发票详情',
      // 表单配置
      labelCol: { span: 6 },
      wrapperCol: { span: 17 },
      // 表单参数
      formParams: {},
      // 上传地址
      uploadUrl: process.env.VUE_APP_API_BASE_URL + '/sys/common/upload',
      // 上传请求头
      headers: {
        'X-Access-Token': this.$ls.get('Access-Token'),
      },
      attachmentUrl: [], //合同文件上传列表
      pictureTempListImage: [],
      // 表格配置
      columns: [
        {
          title: '关联合同',
          dataIndex: 'itemContract',
          align: 'center',
          width: '33%',
        },
        {
          title: '关联应收',
          dataIndex: 'itemNum',
          align: 'center',
          width: '33%',
        },
        {
          title: '开票金额',
          dataIndex: 'itemInvoiceAmount',
          align: 'center',
          width: '33%',
          scopedSlots: { customRender: 'itemInvoiceAmount' },
        },
      ],
      disableMixinCreated: true,

      // 加载动画开关
      loading: false,
      // 合同列表
      contractList: [],
      receivableNums: [], //应收
      returnNums: [], //回款
      customNameList: [], //客户
    }
  },

  methods: {
    getDictText,
    // 客户事件
    handelChangeCustomer(val, rows) {
      console.log(val, rows)
      this.$nextTick(() => {
        this.getContractLists(rows[0].id) //获取合同列表
      })
    },
    // 合同列表
    getContractLists(ids) {
      getContractList({ id: ids }).then((res) => {
        console.log(res)
        if (res.success) {
          this.contractList = res.result.records
        }
      })
    },
    open(row) {
      console.log(row)
      this.visible = true
      console.log('---------------')
      this.getDetail(row.id)
    },
    close() {
      this.visible = false
      // 重置表单
      this.$refs.ruleForm.resetFields()
      this.formParams = {}
      this.attachmentUrl = []
      this.pictureTempListImage = []
      this.customNameList = []
      this.returnNums = []
      this.receivableNums = []
    },

    // 获取详情
    getDetail(id) {
      getInvoiceDetail(id).then((res) => {
        if (res.success) {
          console.log(res.result)
          this.formParams = res.result
          this.receivableNums = res.result.items ? res.result.items.split(',') : [] //应收
          this.returnNums = res.result.items ? res.result.items.split(',') : [] // 回款
          this.customNameList = res.result.customName ? res.result.customName.split(',') : []
          let attachmentUrl = res.result.attachmentUrl ? res.result.attachmentUrl.split(',') : []
          this.attachmentUrl = attachmentUrl.map((item, index) => {
            let i = index + 1
            return {
              uid: index,
              status: 'done',
              name: '附件' + i + 1,
              url: item,
            }
          })
          this.pictureTempListImage = this.attachmentUrl
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
.charge_people {
  display: flex;
  flex-direction: row;
  padding: 10px;
  margin: 10px;
  width: 180px;
  height: 80px;
  border-radius: 5px;
  border: 2px solid #f3f5f5;
  .left {
    width: 60px;
    height: 60px;
    color: #f8faff;
    text-align: center;
    line-height: 60px;
    border-radius: 5px;
    background-color: #6bb5ce;
    margin-right: 6px;
  }
  .rigth {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .name {
      font-size: 16px;
      font-weight: 600;
    }
    .type {
      color: #ff8c2e;
    }
  }
  .icon {
    margin-left: 10px;
  }

  &:hover {
    border: 2px solid #ff8c2e;
  }
}
.charge_add {
  box-sizing: border-box;
  color: #ff8c2e;
  text-align: center;
  margin: 10px;
  width: 180px;
  height: 80px;
  line-height: 80px;
  border-radius: 5px;
  border: 2px solid #f3f5f5;
  &:hover {
    border: 2px solid #ff8c2e;
  }
}
</style>
