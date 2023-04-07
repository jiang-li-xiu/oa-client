<!--
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-09-19 17:17:44
 * @LastEditors: JLX
 * @LastEditTime: 2022-10-14 17:49:04
-->
<template>
  <div>
    <a-modal title="历史报价信息" :width="1400" :visible.sync="visible" :confirmLoading="loading" @cancel="close">
      <a-spin tip="加载中..." :spinning="loading">
        <a-row>
          <a-col :span="24">
            <a-table :columns="columns" :data-source="dataSource" bordered :loading="loading"> </a-table>
          </a-col>
        </a-row>
      </a-spin>

      <template slot="footer">
        <a-button type="dashed" @click="close">关闭</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { getHistoryQuto } from '@/api/project-management/foreign-price-management/ProjectProfit.js'
export default {
  data() {
    return {
      // 开关
      visible: false,
      // 表单参数
      formParams: {},
      // 加载动画开关
      loading: false,
      // 表格配置
      columns: [
        {
          title: '项目',
          dataIndex: 'projectName',
          width: '5%',
          ellipsis: true
        },
        {
          title: '产品名称',
          dataIndex: 'productName',
          width: '6%',
          ellipsis: true
        },
        {
          title: '技术规格 资质证书',
          dataIndex: 'technicalSpecifications',
          width: '8%',
          ellipsis: true
        },
        {
          title: '规格参数',
          dataIndex: 'specification',
          width: '5%',
          ellipsis: true
        },
        {
          title: '型号',
          dataIndex: 'model',
          width: '4%',
          ellipsis: true
        },
        {
          title: '供应商',
          dataIndex: 'supplierName',
          width: '5%',
          ellipsis: true
        },
        {
          title: '单位',
          dataIndex: 'unit',
          width: '4%',
          ellipsis: true
        },
        {
          title: '数量',
          dataIndex: 'num',
          width: '4%',
          ellipsis: true
        },
        {
          title: '采购单价(元)',
          dataIndex: 'purchasePrice',
          width: '6%',
          ellipsis: true
        },
        {
          title: '采购合价(元)',
          dataIndex: 'purchaseTotlePrice',
          width: '6%',
          ellipsis: true
        },
        {
          title: '销售单价(元)',
          dataIndex: 'price',
          width: '6%',
          ellipsis: true
        },
        {
          title: '销售合价(元)',
          dataIndex: 'salesTotlePrice',
          width: '6%',
          ellipsis: true
        },
        {
          title: '毛利率',
          dataIndex: 'grossProfitRate',
          width: '5%',
          ellipsis: true
        }
      ],
      dataSource: [],
      productId: '' //产品id
    }
  },

  methods: {
    // 打开弹窗
    open(row) {
      console.log(row)
      // 产品id
      this.productId = row[0].productId
      // 发请求，渲染数据
      this.getHistoryQuto(row[0].productId)

      this.visible = true
    },

    // 关闭弹窗，点击遮罩层或右上角叉或取消按钮时触发
    close() {
      this.visible = false
    },

    // 历史报价
    getHistoryQuto(id) {
      getHistoryQuto({ productId: id }).then(res => {
        if (res.success) {
          this.dataSource = res.result.records
        }
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
