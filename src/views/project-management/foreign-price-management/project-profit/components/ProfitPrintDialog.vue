<!--
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-10-21 11:42:03
 * @LastEditors: JLX
 * @LastEditTime: 2023-03-14 09:46:29
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
          <td colspan="14">
            <div class="title">
              <span></span>
              <span>利润表</span>
              <span>上控价：{{ this.formParams.priceControl }}</span>
            </div>
          </td>
        </tr>
        <tr>
          <td colspan="6">项目名称：{{ this.formParams.projectName }}</td>
          <td colspan="8">
            项目类型： <a-checkbox-group v-model="formParams.value" :options="checkboxList" @change="onChange" />
            <!-- <div class="checkbox">
              项目类型：
              <label v-for="(item, i) in checkboxList" :for="'checkbox_' + i" :key="item.value">
                <input type="checkbox" :id="'checkbox_' + i" :value="item.value" @click="onChange(item.title)" />
                <span>{{ item.title }}</span>
              </label>
            </div> -->
          </td>
        </tr>
        <tr>
          <td colspan="6">客户名称：{{ this.formParams.companyName }}</td>
          <td colspan="8">客户地址：</td>
        </tr>
        <tr>
          <td colspan="14">客户联系人：{{ this.formParams.customerName }}</td>
        </tr>
        <tr>
          <td colspan="14">客户邮箱：</td>
        </tr>
        <tr>
          <td colspan="14">客户手机：{{ this.formParams.customerPhone }}</td>
        </tr>
        <!-- <tr>
          <td rowspan="14">客户手机</td>
        </tr> -->
        <tr>
          <td colspan="14">我司选型确认人：{{ this.formParams.selectPeopleName }}</td>
        </tr>
        <tr>
          <th colspan="6">该项目产品利润分析如下：</th>
          <th colspan="8">制表日期：{{ moment().format('YYYY年 MM月 DD日') }}</th>
        </tr>

        <tr>
          <th colspan="1">细目编号</th>
          <th colspan="1">细目名称</th>
          <th colspan="1">投标文件要求的技术规格、资料证书</th>
          <th colspan="1">拟提供货物的技术规格、品牌型号</th>
          <th colspan="1">品牌</th>
          <th colspan="1">型号</th>
          <th colspan="1">单位</th>
          <th colspan="1">数量</th>
          <th colspan="1">采购单价（元）</th>
          <th colspan="1">采购合价（元）</th>
          <th colspan="1">销售单价（元）</th>
          <th colspan="1">销售合价（元）</th>
          <th colspan="1">毛利润</th>
          <th colspan="1">备注</th>
        </tr>

        <tr v-for="(item, i) in dataSource" :key="i">
          <th colspan="1">{{ item.codeNum }}</th>
          <th colspan="1">{{ item.detailName }}</th>
          <th colspan="1">{{ item.technicalSpecifications }}</th>
          <th colspan="1">{{ item.specification }}</th>
          <th colspan="1">{{ item.brand }}</th>
          <th colspan="1">{{ item.model }}</th>
          <th colspan="1">{{ item.unit }}</th>
          <th colspan="1">{{ item.num }}</th>
          <th colspan="1">{{ item.purchasePrice }}</th>
          <th colspan="1">{{ item.purchaseTotlePrice }}</th>
          <th colspan="1">{{ item.price }}</th>
          <th colspan="1">{{ item.salesTotlePrice }}</th>
          <th colspan="1">{{ `${(item.grossProfitRate).toFixed(2)}%` }}</th>
          <th colspan="1">{{ item.remark }}</th>
        </tr>

        <tr>
          <th colspan="1">合计：</th>
          <th colspan="1"></th>
          <th colspan="1"></th>
          <th colspan="1"></th>
          <th colspan="1"></th>
          <th colspan="1"></th>
          <th colspan="1"></th>
          <th colspan="1"></th>
          <th colspan="1"></th>
          <th colspan="1">{{ this.formatPurchaseTotlePrice }}</th>
          <th colspan="1"></th>
          <th colspan="1">{{ this.formatSalesTotlePrice }}</th>
          <th colspan="1">{{ this.formatGrossProfitRate }}</th>
          <th colspan="1"></th>
        </tr>
        <!-- <tr>
          <th colspan="2">制表人：</th>
          <th colspan="1">财务人员：</th>
          <th colspan="1">技术人员：</th>
          <th colspan="2">成本合约：</th>
          <th colspan="1"></th>
          <th colspan="1"></th>
          <th colspan="2">总经理：</th>
          <th colspan="2">董事长：</th>
          <th colspan="1"></th>
          <th colspan="1"></th>
        </tr>
        <tr>
          <th colspan="2">日期：</th>
          <th colspan="1">日期：</th>
          <th colspan="1">日期：</th>
          <th colspan="2">日期：</th>
          <th colspan="1"></th>
          <th colspan="1"></th>
          <th colspan="2">日期：</th>
          <th colspan="2">日期：</th>
          <th colspan="1"></th>
          <th colspan="1"></th>
        </tr> -->
      </table>
    </div>

    <div class="drawer-bootom-button">
      <!-- <a-button @click="handleExportXls('报价单')" type="primary" icon="download">导出</a-button> -->
      <a-button key="submit" type="primary" v-print="'#print'" class="sub-button">导出</a-button>
    </div>
  </a-drawer>
</template>

<script>
import { getProjectList } from '@/api/project-management/foreign-price-management/ProjectProfit.js'
import moment from 'dayjs'
export default {
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    // 产品表格数据
    proInfo: {
      type: Array,
      default: () => [],
    },
    // 产品表格
    columnsDetail: {
      type: Array,
      default: () => [],
    },
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
      checkboxList: [
        '工程项目',
        '渠道项目',
        '产品销售',
        '软件销售',
        '软件定制',
        // { value: 0, title: '工程项目' },
        // { value: 1, title: '渠道项目' },
        // { value: 2, title: '产品销售' },
        // { value: 3, title: '软件销售' },
        // { value: 4, title: '软件定制' },
      ],
      formatPurchaseTotlePrice: '', //采购合计
      formatSalesTotlePrice: '', //销售合计
      formatGrossProfitRate: '', //毛利率合计
    }
  },

  methods: {
    moment,

    // 打开弹窗
    open() {
      this.visible = true
      this.formParams = this.data
      this.dataSource = this.proInfo
      this.formatPrice()
      console.log(this.dataSource,this.formParams)
    },

    // 关闭弹窗
    close() {
      this.visible = false
    },

    //计算合价
    formatPrice() {
      this.formatPurchaseTotlePrice = this.dataSource.reduce((p, c) => p + c.purchaseTotlePrice, 0)
      this.formatSalesTotlePrice = this.dataSource.reduce((p, c) => p + c.salesTotlePrice, 0)
      this.formatGrossProfitRate =
        ((this.dataSource.reduce((p, c) => p + c.grossProfitRate, 0) / this.dataSource.length)).toFixed(2) + '%'
    },

    onChange(checkedValues) {
      console.log('checked = ', checkedValues)
      // console.log('value = ', this.value)
      this.formParams.value = checkedValues
      console.log(this.formParams, this.formParams.value)
    },
  },
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
  // > div {
  //   text-align: center;
  // }
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      flex: 1;
      text-align: center;
    }
    span:nth-child(2) {
      font-size: 32px;
      font-weight: 600;
      letter-spacing: 10px;
    }
    span:nth-child(3) {
      font-size: 20px;
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
      min-width: 70px;
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
</style>
