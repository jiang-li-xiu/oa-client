<!--
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-10-21 11:42:03
 * @LastEditors: JLX
 * @LastEditTime: 2022-10-27 15:18:06
-->
<template>
  <a-drawer
    title="预览"
    :maskClosable="true"
    width="1400"
    placement="right"
    :closable="true"
    @close="close"
    :visible="visible"
    style="overflow: auto; padding-bottom: 53px"
  >
    <div class="content" id="print">
      <table class="table" border="1" cellpadding="2" cellspacing="0">
        <tr>
          <td colspan="12">
            <div class="company-head">
              <div class="img">
                <img
                  :src="
                    this.type == 0
                      ? require('../../../../../assets/LuShengTong.jpg')
                      : require('../../../../../assets/QinLing.jpg')
                  "
                />
              </div>
              <span>{{ this.type == 0 ? '广西路盛通智能科技有限公司' : '上海勤岭智能科技有限公司' }}</span>
              <span></span>
            </div>
            <div class="company-english">
              {{
                this.type == 0
                  ? 'Guangxi lushengtong Smart Technology Co.,Ltd'
                  : 'ShangHai QinLing Intelligent Technology Co.,Ltd'
              }}
            </div>
          </td>
        </tr>
        <tr>
          <td colspan="12">
            <div class="title">
              <span></span>
              <span>{{ this.type == 0 ? '报价单' : '报价表' }}</span>
              <span></span>
            </div>
          </td>
        </tr>
        <tr>
          <td colspan="4">项目名称：{{ this.formParams.projectName }}</td>
          <td colspan="4">
            报价单位：{{ this.type == 0 ? '广西路盛通智能科技有限公司' : '上海勤岭智能科技有限公司' }}
          </td>
          <td colspan="4">报价日期：{{ moment().format('YYYY年 MM月 DD日') }}</td>
        </tr>
        <tr>
          <td colspan="4">客户名称：{{ this.formParams.companyName }}</td>
          <td colspan="8">商务联系人：</td>
        </tr>

        <tr>
          <td colspan="4">客户地址：</td>
          <td colspan="8">商务联系电话：</td>
        </tr>
        <tr>
          <td colspan="4">联系人：{{ this.formParams.customerName }}</td>
          <td colspan="8">邮箱：</td>
        </tr>
        <tr>
          <td colspan="4">邮箱：</td>
          <td colspan="8">技术联系人：</td>
        </tr>
        <tr>
          <td colspan="4">手机：{{ this.formParams.customerPhone }}</td>
          <td colspan="8">技术联系电话：</td>
        </tr>
        <tr>
          <th colspan="12">您好！我公司产品报价如下：</th>
        </tr>

        <tr class="tr-color">
          <th colspan="1">序号</th>
          <th colspan="1">细目名称</th>
          <th colspan="1">技术参数、规格要求</th>
          <th colspan="1">拟提供的技术参数/规格</th>
          <th colspan="1">品牌</th>
          <th colspan="1">型号</th>
          <th colspan="1">单位</th>
          <th colspan="1">数量</th>
          <th colspan="1">单价（元）</th>
          <th colspan="1">小计（元）</th>
          <th colspan="2">备注</th>
        </tr>

        <tr v-for="(item, i) in dataSource" :key="i">
          <th colspan="1">{{ i + 1 }}</th>
          <th colspan="1">{{ item.detailName }}</th>
          <th colspan="1">{{ item.technicalSpecifications }}</th>
          <th colspan="1">{{ item.specification }}</th>
          <th colspan="1">{{ item.brand }}</th>
          <th colspan="1">{{ item.model }}</th>
          <th colspan="1">{{ item.unit }}</th>
          <th colspan="1">{{ item.num }}</th>
          <th colspan="1">{{ item.price }}</th>
          <th colspan="1">{{ item.salesTotlePrice }}</th>
          <th colspan="2">{{ item.remark }}</th>
        </tr>

        <tr class="tr-color">
          <th colspan="3"></th>
          <th colspan="3">合计</th>
          <th colspan="1"></th>
          <th colspan="1"></th>
          <th colspan="1"></th>
          <th colspan="1">{{ this.formatTotal }}</th>
          <th colspan="2"></th>
        </tr>
      </table>

      <div class="text">报价说明：</div>
      <div>1、此金额含增值税（13%）的人民币报价。</div>
      <div>2、运费说明：以上价格含陆运运费。</div>
      <div>3、交期说明：根据对方订单要求。</div>
      <div>4、付款方式：以合同为准。</div>
      <div>5、报价有效期：本报价有效期15天，逾期请再次垂询。</div>
    </div>

    <div class="drawer-bootom-button">
      <!-- <a-button @click="handleExportXls('报价单')" type="primary" icon="download">导出</a-button> -->
      <a-button key="submit" type="primary" v-print="'#print'" class="sub-button">导出</a-button>
    </div>
  </a-drawer>
</template>

<script>
import moment from 'dayjs'
export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    // 产品表格数据
    proInfo: {
      type: Array,
      default: () => []
    },
    // 产品表格
    columnsDetail: {
      type: Array,
      default: () => []
    }
    // 类型：5报价单 2利润表
    // type: {
    //   type: Number,
    //   default: ''
    // }
  },
  data() {
    return {
      // 开关
      visible: false,
      // 加载动画开关
      loading: false,
      formParams: {},
      dataSource: [],
      projectList: [],
      value: [],
      formatTotal: '', //合计
      type: '' //类型：0路盛通 1勤岭
    }
  },

  // created() {
  //   this.formParams =
  // },

  methods: {
    moment,

    // 打开弹窗
    open(type) {
      this.type = type
      this.visible = true
      this.formParams = this.data
      this.dataSource = this.proInfo
      this.formatPrice()
      console.log(this.dataSource)
    },

    // 关闭弹窗
    close() {
      this.visible = false
    },

    //计算合价
    formatPrice() {
      this.formatTotal = this.dataSource.reduce((p, c) => p + c.salesTotlePrice, 0)
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  .head {
    height: 46px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 4px solid #797979;
    .head-item {
      flex: 1;
      &:nth-child(2) {
        text-align: center;
      }
      &:last-child {
        text-align: right;
      }
    }
  }

  .company-head {
    text-align: center;
    .img {
      display: inline-block;
      width: 200px;
      margin: 0 40px 0 -100px;
    }
    span:nth-child(2) {
      // text-align: center;
      font-size: 28px;
      font-weight: 900;
      letter-spacing: 2px;
      margin: 0 80px;
      font-family: '宋体', 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑',
        Arial, sans-serif;
    }
  }
  .company-english {
    text-align: center;
    font-size: 20px;
    font-weight: 900;
    letter-spacing: 1px;
    margin-left: 40px;
    font-family: '宋体', 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑',
      Arial, sans-serif;
  }

  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      flex: 1;
      text-align: center;
    }
    span:nth-child(2) {
      font-size: 28px;
      font-weight: 900;
      letter-spacing: 10px;
      font-family: '宋体', 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑',
        Arial, sans-serif;
    }
  }

  .table {
    width: 100%;
    tr {
      height: 40px;
      text-align: center;
    }

    th,
    td {
      min-width: 90px;
      padding: 5px;
      text-align: left;
    }
  }

  label {
    height: 30px;
    line-height: 30px;
    display: flex;
    align-items: center;
    span {
      padding-left: 5px;
    }
  }

  .checkbox {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }
}
.tr-color {
  background-color: #d9d9d9;
}
.text {
  font-weight: 600;
  padding-top: 20px;
}
</style>
