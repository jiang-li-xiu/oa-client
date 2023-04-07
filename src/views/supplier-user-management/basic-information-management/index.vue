<template>
  <a-card :bordered="false" class="assembly-container-col">
    <a-form-model ref="ruleForm" :model="formParams" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-row>
        <!-- 基本信息 -->
        <a-col :span="24" class="title">基本信息</a-col>
        <a-col class="content" :span="8"> 企业名称：<span v-html="formParams.supplier" /> </a-col>
        <a-col class="content" :span="8"> 统一社会信用代码：<span v-html="formParams.creditCode" /> </a-col>
        <a-col class="content" :span="8">供应商编号：<span v-html="formParams.companyNo" /> </a-col>
        <a-col class="content" :span="8"> 简称：<span v-html="formParams.supplierOutline" /> </a-col>
        <a-col class="content" :span="8">
          供应商类型：<span>{{ getDictText('supplier_type', formParams.trade) }}</span>
        </a-col>
        <a-col class="content" :span="8">
          企业性质：
          <span>{{ getDictText('enterprise_nature', formParams.enterpriseNature) }}</span>
        </a-col>

        <!--主要联系人  -->
        <a-col :span="24" class="title">主要联系人</a-col>
        <a-col class="content" :span="8">姓名： <span v-html="formParams.userName"></span></a-col>
        <a-col class="content" :span="8">手机号：<span v-html="formParams.phone"></span> </a-col>
        <a-col class="content" :span="8"
          >性别：
          <span>{{ getDictText('sex', formParams.sex) }}</span>
        </a-col>
        <a-col class="content" :span="8"
          >职务：
          <span v-html="formParams.position" />
        </a-col>
        <a-col class="content" :span="8"
          >邮箱地址：
          <span v-html="formParams.email"></span>
        </a-col>

        <!-- 工商信息 -->
        <a-col :span="24" class="title">工商信息</a-col>
        <a-col class="content" :span="8"
          >法人：
          <span v-html="formParams.legalPerson" />
        </a-col>
        <a-col class="content" :span="8"
          >法人身份证：
          <span v-html="formParams.idCard" />
        </a-col>
        <a-col class="content" :span="8"
          >公司成立时间：
          <span v-html="formParams.companySetUpTime" />
        </a-col>
        <a-col class="content" :span="8"
          >开户行：
          <span v-html="formParams.bank" />
        </a-col>
        <a-col class="content" :span="8"
          >开户行账号：
          <span v-html="formParams.bankNo" />
        </a-col>
        <a-col class="content" :span="8"
          >注册资金：
          <span v-html="formParams.registeredCapital" />
        </a-col>
        <a-col class="content" :span="8">
          营业执照：
          <span>
            <a-upload
              :action="uploadUrl"
              list-type="picture-card"
              :headers="headers"
              :file-list="license"
              @preview="handlePreview"
              disabled
            >
            </a-upload>
            <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
              <img alt="example" style="width: 100%" :src="previewImage" />
            </a-modal>
          </span>
        </a-col>
        <a-col class="content" :span="8"
          >证件有效截止日期：
          <span v-html="formParams.licenseExp" />
        </a-col>
        <a-col class="content" :span="8"
          >工商注册地址：
          <span v-html="formParams.registeredAddress" />
        </a-col>
        <a-col class="content" :span="8"
          >座机：
          <span v-html="formParams.tel" />
        </a-col>
        <a-col class="content" :span="8"
          >传真：
          <span v-html="formParams.fax" />
        </a-col>
        <a-col class="content" :span="8"
          >所属国家：
          <span v-html="formParams.country" />
        </a-col>
        <a-col class="content" :span="8"
          >所属地区：
          <span>{{ this.area }}</span>
        </a-col>
        <j-area-linkage
          v-show="false"
          ref="area"
          v-model="formParams.region"
          @change="changeAreaLinkage"
          type="select"
        />
        <a-col class="content" :span="8"
          >信用等级：
          <span>{{ getDictText('credit_rating', formParams.creditRating) }}</span>
        </a-col>
        <a-col class="content" :span="8"
          >行业类别：
          <span>{{ getDictText('industry_type', formParams.industryCategory) }}</span>
        </a-col>
        <a-col class="content" :span="8"
          >服务领域：
          <span>{{ this.service }}</span>
          <!-- <j-category-select disabled v-model="formParams.serviceArea" pcode="A01" :multiple="true" style="width:300px" /> -->
        </a-col>
        <a-col class="content" :span="24">
          公司简介：
          <div class="top">
            <span
              :style="{ 'max-height': textOpenFlag ? textHeight : '' }"
              :class="{ unfoldText: textOpenFlag }"
              class="titleText"
              ref="textContainer"
            >
              {{ formParams.profile }}
            </span>
            <span v-if="showBtnFlag" @click="textOpenFlag = !textOpenFlag" class="btn">
              {{ textOpenFlag ? '展开' : '收起' }}
            </span>
          </div>
        </a-col>

        <a-col class="content" :span="24"
          >主营业务：
          <div class="top">
            <span
              :style="{ 'max-height': businessOpenFlag ? textHeight : '' }"
              :class="{ unfoldText: businessOpenFlag }"
              class="titleText"
              ref="textContainer"
            >
              {{ formParams.mainBusiness }}
            </span>
            <span v-if="showBtnFlag" @click="businessOpenFlag = !businessOpenFlag" class="btn">
              {{ businessOpenFlag ? '展开' : '收起' }}
            </span>
          </div>
        </a-col>
      </a-row>
    </a-form-model>

    <div class="bootom-button">
      <a-button @click="handleEdit" type="primary" :loading="loading" :disabled="this.formParams.approval == 0"
        >编辑
      </a-button>
    </div>

    <!-- 编辑 -->
    <edit-dialog ref="modelForm" @refresh="getDetail"></edit-dialog>
  </a-card>
</template>

<script>
// API
import { getDetail } from '@/api/supplier-user-management/basicInformationManagement'
// 组件
import EditDialog from './components/EditDialog'
// 字典
import { getDictText, getDictItemsFromCache, ajaxGetDictItems, categoryDictItem } from '@/api/api'
// 混入
// import { TableListMixin } from '@/mixins/TableListMixin'
export default {
  // mixins: [TableListMixin],
  components: { EditDialog },
  data() {
    return {
      // 开关
      visible: false,
      // 是否禁用
      disableSubmit: false,
      // 标题
      title: '新增',
      // 当前模式 0-添加 1-编辑 2-详情
      type: 0,
      // 表单配置
      labelCol: { span: 6 },
      wrapperCol: { span: 17 },
      // 预览功能弹窗显隐
      previewVisible: false,
      // 预览地址
      previewImage: '',
      // 图片上传列表
      businessLicenseUrl: [],
      // 图片处理数据集合
      pictureTempListImage: [],
      // 上传地址
      uploadUrl: process.env.VUE_APP_API_BASE_URL + '/sys/common/upload',
      // 上传请求头
      headers: {
        'X-Access-Token': this.$ls.get('Access-Token'),
      },
      // 表单参数
      formParams: {
        supplierType: undefined,
        nation: 0,
        license: [],
      },
      license: [],
      // 表单验证规则
      rules: {},
      // 加载动画开关
      loading: false,
      // 服务列表
      industryList: [],
      disableMixinCreated: true, //不执行混入
      textHeight: '', // 想要显示的高度
      textOpenFlag: false, // 展开/收起 判定
      showBtnFlag: false, // 是否显示展开收起
      businessOpenFlag: true, // 展开/收起 判定
      area: '', //显示所属地区
      serviceArea: '', //
      treeValue: [],
      service: '', //处理服务领域
    }
  },

  created() {
    // 详情
    this.getDetail(this.$store.getters.userInfo.id)
    // this.getDetail('1567768563292667906')
    // this.loadItemByCode()
  },

  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.showAllText()
      }, 100)
    })
    this.$nextTick(() => {
      setTimeout(() => {
        this.loadItemByCode()
      }, 100)
    })
  },

  methods: {
    getDictText,

    showAllText() {
      // 默认展示两行数据的高度，20是一行的高度可以自定义 *2 表示展示两行 如果想要显示n行就*n
      let twoHeight = 20 * 1
      this.textHeight = `${twoHeight}px`
      let curHeight = this.$refs.textContainer.offsetHeight
      console.log(curHeight, twoHeight)
      if (curHeight > twoHeight) {
        this.textOpenFlag = true
        this.businessOpenFlag = true
        this.showBtnFlag = true
      } else {
        this.textOpenFlag = false
        this.showBtnFlag = false
        this.businessOpenFlag = false
      }
    },

    /** 分类字典数据回显*/
    loadItemByCode() {
      // console.log(this.formParams.serviceArea)
      if (!this.formParams.serviceArea || this.formParams.serviceArea == '0') {
        this.treeValue = []
      } else {
        categoryDictItem({ ids: this.formParams.serviceArea }).then((res) => {
          if (res.success) {
            let values = this.formParams.serviceArea.split(',')
            this.treeValue = res.result.map((item, index) => ({
              key: values[index],
              value: values[index],
              label: item,
            }))
            // 回显服务领域
            this.service = this.treeValue.map((item) => {
              return item.label
            })
            this.service = this.service.toString()
          }
        })
      }
    },

    // 获取详情
    getDetail(id) {
      getDetail({ id }).then((res) => {
        if (res.success) {
          this.formParams = res.result
          //处理图片
          let license = res.result.license ? res.result.license.split(',') : []
          this.license = license.map((item, index) => {
            return {
              uid: index,
              status: 'done',
              name: '图片' + index,
              url: item,
            }
          })
        }
      })
    },

    // 图片预览
    handlePreview(file) {
      this.previewImage = file.url
      this.previewVisible = true
    },
    // 预览弹窗关闭
    handleCancel() {
      this.previewVisible = false
    },

    //获取去省级信息
    changeAreaLinkage(val) {
      const arr = []
      this.$refs['area'].areaData.getAreaBycode(val, arr, 3)
      this.formParams.province = arr[0]
      this.formParams.city = arr[1]
      this.formParams.country = arr[2]

      // 回显所属地区
      this.area = this.formParams.province + this.formParams.city + this.formParams.country
    },

    //编辑
    handleEdit() {
      // this.$refs.modelForm.edit('1567768563292667906')
      this.$refs.modelForm.edit(this.$store.getters.userInfo.id)
    },
  },

  watch: {
    'formParams.serviceArea'() {
      this.loadItemByCode()
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
  font-size: 18px;
  &::before {
    content: '▎';
    margin-right: 5px;
    color: #1890ff;
  }
}

.bootom-button {
  float: right;
}

.top {
  font-size: 14px;
  color: #333333;
  position: relative;
  // display: block;
  .titleText {
    overflow: hidden;
    display: block;
  }
  .titleText:after {
    // z-index: 3;
    // content: '...';
    position: absolute;
    bottom: 2px;
    right: 55px;
    width: 14px;
    padding-left: 15px;
    background: linear-gradient(to right, rgba(255, 255, 255, 0.1), #fff 45%);
  }
  .btn {
    color: #1890ff;
    position: absolute;
    right: 0;
    bottom: 0;
    background-color: #fff;
  }
}
.content {
  margin: 22px 0;
  // display: flex;
}
</style>
