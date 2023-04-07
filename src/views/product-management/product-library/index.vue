<!--
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-08-23 17:32:23
 * @LastEditors: JLX
 * @LastEditTime: 2023-02-14 15:36:51
-->
<template>
  <a-card :bordered="false" class="assembly-container-col">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form-model ref="ruleForm" v-model="param" layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <!--       <div class="home-category" @mouseleave="leave">
            <ul class="menu">
              <li
                v-for="(item, index) in menuList"
                :key="item.key"
                @mouseenter="mouse(item.key, index)"
                :class="{ active: categoryId === item.key }"
              >
                <!~~ 一级  ~~>
                <a>{{ item.title }}</a>
                <!~~ 当有children才遍历 （二级） ~~>
              </li>
            </ul>
            <!~~ <div class="secondary">
              <span v-for="item in treeChildren" :key="item.key">
                {{ item.title }}
              </span>
            </div> ~~>

            <!~~ 弹层 ~~>
            <!~~ <div class="layer">
              <ul>
                <li v-for="item in treeChildren" :key="item.key">
                  <div class="info">
                    <p class="name">{{ item.title }}</p>
                  </div>
                </li>
              </ul>
            </div> ~~>

            <div class="layer">
              <ul>
                <li v-for="item in treeChildren" :key="item.key">
                  <div class="info">
                    <p class="name">{{ item.title }}</p>
                  </div>
                  <!~~ <div class="info" v-for="(i, index) in item" :key="index">
                    <p class="name">{{ i.title }}</p>
                  </div> ~~>
                </li>
              </ul>
            </div>
          </div> -->

          <a-col :md="6" :sm="8">
            <a-form-model-item label="产品类型" prop="productType">
              <a-input-group>
                <a-select
                  v-model="param.productType"
                  style="width: 100%"
                  placeholder="请选择产品类型"
                  @change="handleType"
                >
                  <a-select-option value="1">设备</a-select-option>
                  <a-select-option value="2">劳务</a-select-option>
                </a-select>
              </a-input-group>
            </a-form-model-item>
          </a-col>
          <!-- 设备字典 -->
          <template v-if="param.productType == 1">
            <a-col :md="6" :sm="8">
              <a-form-model-item label="产品分类" prop="productClassify">
                <j-category-select
                  v-model="param.productClassify"
                  pcode="B03"
                  :multiple="false"
                  @change="change"
                  @treeData="treeData"
                  :disabled="!param.productType"
                  placeholder="请先选择产品类型"
                  @treeChildrenData="treeChildrenData"
                />
              </a-form-model-item>
            </a-col>
          </template>
          <!-- 劳务字典 -->
          <template v-else>
            <a-col :md="6" :sm="8">
              <a-form-model-item label="产品分类" prop="productClassify">
                <j-category-select
                  v-model="param.productClassify"
                  pcode="A01"
                  :multiple="false"
                  @change="change"
                  @treeData="treeData"
                  :disabled="!param.productType"
                  placeholder="请先选择产品类型"
                  @treeChildrenData="treeChildrenData"
                />
              </a-form-model-item>
            </a-col>
          </template>

          <a-col :md="6" :sm="8">
            <a-form-model-item label="供应商" prop="supplierId">
              <a-select
                v-model="param.supplierId"
                placeholder="请选择产供应商"
                show-search
                :filter-option="filterOption"
              >
                <a-select-option v-for="item in supplierNameList" :key="item.id" :value="item.id">
                  {{ item.supplier }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>

          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-model-item label="产品名称" prop="prodName">
                <j-input v-model="param.prodName" placeholder="请输入产品名称" />
              </a-form-model-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-model-item label="规格型号" prop="model">
                <j-input v-model="param.model" placeholder="请输入规格型号" />
              </a-form-model-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-model-item label="品牌" prop="brand">
                <j-input v-model="param.brand" placeholder="请输入品牌" />
              </a-form-model-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-model-item label="设备类型" prop="equipmentType">
                <j-dict-select-tag v-model="param.equipmentType" dictCode="product_type" placeholder="请选择设备类型" />
                <!-- <j-category-select v-model="param.productType" pcode="B03" :multiple="false" placeholder="请选择类型" /> -->
              </a-form-model-item>
            </a-col>
            <!-- <a-col :md="6" :sm="8">
              <a-form-model-item label="产品状态" prop="status">
                <a-select v-model="param.status" placeholder="请选择类型">
                  <a-select-option value="1">正常</a-select-option>
                  <a-select-option value="2">冻结</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col> -->
          </template>

          <a-col :md="6" :sm="8">
            <span style="float: left; overflow: hidden" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">搜索</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form-model>

      <!-- 表格区域 -->
      <div class="table">
        <div class="ant-alert ant-alert-info" style="margin-bottom: 16px">
          <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择
          <a style="font-weight: 600">{{ selectedRowKeys.length }}</a
          >项
          <a style="margin-left: 24px" @click="onClearSelected">清空</a>
        </div>

        <a-table
          :columns="columns"
          rowKey="id"
          :pagination="ipagination"
          :data-source="dataSource"
          bordered
          :scroll="{ x: true }"
          :rowSelection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
            fixed: true,
          }"
          @change="handleTableChange"
          :loading="loading"
        >
          <div class="overflowStyle" slot="modelParameter" slot-scope="text, record">
            <a-popover placement="top">
              <template slot="content">
                <span>{{ record.modelParameter }}</span>
              </template>
              <span>{{ record.modelParameter }}</span>
            </a-popover>
          </div>

          <template #action="row">
            <a-space :size="12">
              <a href="javascript:;" @click="handleDetail(row)">详情</a>
              <a-divider type="vertical" />
              <a-dropdown>
                <a class="ant-dropdown-link">
                  更多
                  <a-icon type="down" />
                </a>
                <a-menu slot="overlay">
                  <a-menu-item>
                    <a @click="handleOutbound(row)">移除出库</a>
                  </a-menu-item>
                  <a-menu-item>
                    <a @click="handleShelves(row)">下架</a>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </a-space>
          </template>
        </a-table>
      </div>
    </div>

    <!-- 详情弹窗 -->
    <detail-dialog ref="detailForm" @refresh="loadData(1)"></detail-dialog>
  </a-card>
</template>

<script>
// API
import { upProduct, removingProduct } from '@/api/product-management/productLibrary.js'
import { getAllSupplierList } from '@/api/product-management/product-management/index'
// 组件
import DetailDialog from '@/views/product-management/components/AddAndDetailDialog'

// 混入
import { TableListMixin } from '@/mixins/TableListMixin'
// 字典
import { getDictText } from '@/api/api'
import { getAction } from '@/api/manage'
export default {
  mixins: [TableListMixin],
  components: { DetailDialog },
  data() {
    return {
      // 查询参数
      param: {},
      // 表格配置
      columns: [
        {
          title: '产品名称',
          dataIndex: 'prodName',
          align: 'center',
          width: 150,
          ellipsis: true,
        },
        {
          title: '供应商',
          dataIndex: 'supplierName',
          align: 'center',
          width: 150,
          ellipsis: true,
        },
        {
          title: '品牌',
          dataIndex: 'brand',
          align: 'center',
          width: 150,
          ellipsis: true,
        },
        {
          title: '单位',
          dataIndex: 'unit',
          align: 'center',
          width: 150,
          ellipsis: true,
        },
        {
          title: '规格型号',
          dataIndex: 'model',
          align: 'center',
          width: 150,
          ellipsis: true,
        },
        {
          title: '规格参数',
          dataIndex: 'modelParameter',
          align: 'center',
          width: 150,
          ellipsis: true,
          scopedSlots: { customRender: 'modelParameter' },
        },
        {
          title: '单价（元）',
          dataIndex: 'price',
          align: 'center',
          width: 100,
          ellipsis: true,
        },
        {
          title: '到货周期',
          dataIndex: 'supplyTime',
          align: 'center',
          width: 100,
          ellipsis: true,
        },
        {
          title: '付款周期',
          dataIndex: 'paymentPeriod',
          align: 'center',
          width: 100,
          ellipsis: true,
        },
        {
          title: '单价有效期',
          dataIndex: 'priceValid',
          align: 'center',
          width: 150,
          ellipsis: true,
        },
        {
          title: '维修地址',
          dataIndex: 'serviceAddr',
          align: 'center',
          width: 150,
          ellipsis: true,
        },
        {
          title: '退货地址',
          dataIndex: 'returnAddress',
          align: 'center',
          width: 150,
          ellipsis: true,
        },
        {
          title: '运维周期',
          dataIndex: 'devops',
          align: 'center',
          width: 100,
          ellipsis: true,
        },
        {
          title: '质保时间',
          dataIndex: 'warranty',
          align: 'center',
          width: 100,
          ellipsis: true,
        },
        {
          title: '设备类型',
          dataIndex: 'equipmentType',
          align: 'center',
          width: 100,
          ellipsis: true,
          customRender: (value) => getDictText('product_type', value),
          // customRender(text) {
          //   return text == 1 ? '主材' : text == 2 ? '辅材' : '耗材'
          // }
        },
        {
          title: '含序列号',
          dataIndex: 'hasSerial',
          align: 'center',
          width: 100,
          ellipsis: true,
          customRender(text) {
            return text == 1 ? '是' : '否'
          },
        },
        {
          title: '审批状态',
          dataIndex: 'approval',
          align: 'center',
          width: 100,
          ellipsis: true,
          customRender: (value) => getDictText('approval_status', value),
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          fixed: 'right',
          width: 200,
          scopedSlots: { customRender: 'action' },
        },
      ],
      // 请求地址
      url: {
        list: '/jeecg-supplier/prodProductEntrepot/list', // 列表
      },
      // 供应商名称列表
      supplierNameList: {},
      menuList: [
        {
          id: '1',
          name: '测试名称',
          children: [
            {
              id: '1',
              name: '名称',
              children: [],
              goods: [],
            },
          ],
          goods: [],
        },
      ],
      currCategory: [],
      treeChildren: [],
      categoryId: '',
      currentIndex: '', //当前移入的下标
      enterData: '', //当前移入的数据
    }
  },

  created() {
    this.getsupplierNameList()
    this.treeData()
  },

  methods: {
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    change(val) {
      // console.log('选中的产品分类id-',val);
      this.searchQuery()
    },
    handleType(val) {
      this.param.productClassify = ''
      this.searchQuery()
    },

    // 产品分类数据
    treeData(data) {
      console.log(data)
      this.menuList = data
    },

    treeChildrenData(data) {
      console.log('treeChildrenData', data, '下标', this.currentIndex)
      this.enterData = data
      this.treeChildren = this.enterData[this.currentIndex].children
      console.log('treeChildren---', this.treeChildren)
    },

    mouse(key, index) {
      console.log(key, index)
      // 当前移入的下标
      this.currentIndex = index
      this.categoryId = key
    },
    leave() {
      this.categoryId == null
      this.currentIndex == ''
    },

    // 详情
    handleDetail(row) {
      console.log(row)
      // this.$refs.detailForm.detailApproval(row)
      this.$refs.detailForm.details(row)
      this.$refs.detailForm.disableSubmit = true
      this.$refs.detailForm.title = '详情'
    },

    // 获取供应商名称列表
    getsupplierNameList() {
      getAllSupplierList().then((res) => {
        this.supplierNameList = res.result.records
      })
    },

    // 移除出库
    handleOutbound(row) {
      let that = this
      this.$confirm({
        title: '请确认',
        content: '是否确认移除出库？',
        onOk: function () {
          that.loading = true
          removingProduct(row.id)
            .then((res) => {
              if (res.success) {
                //重新计算分页问题
                that.reCalculatePage(that.selectedRowKeys.length)
                that.$message.success(res.message)
                that.loadData()
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

    // 下架
    handleShelves(row) {
      let that = this
      this.$confirm({
        title: '请确认',
        content: '是否确认下架？',
        onOk: function () {
          that.loading = true
          upProduct(row.id)
            .then((res) => {
              if (res.success) {
                //重新计算分页问题
                that.reCalculatePage(that.selectedRowKeys.length)
                that.$message.success(res.message)
                that.loadData()
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
  },
  watch: {
    currentIndex: {
      handler(val) {
        console.log(val)
        this.currentIndex = val
        console.log(this.treeChildren, this.enterData, this.enterData[val])
        this.treeChildren = this.enterData[val].children
      },
      // immediate: true
    },
  },
}
</script>

<style lang="less" scoped>
.assembly-container-col {
  min-height: calc(100vh - 135px);
  background-color: #fff;
}
::v-deep .ant-table td {
  white-space: nowrap;
}

.home-category {
  width: 300px;
  height: 300px;
  background: rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 99;
  .menu {
    width: 1000px;
    li {
      // padding-left: 40px;
      height: 20px;
      line-height: 20px;
      list-style: none;
      a {
        margin-right: 4px;
        color: rgb(27, 26, 26);
        &:first-child {
          font-size: 12px;
        }
        // 有active激活
        &:hover,
        &.active {
          // background: pink;
          color: #f5222d;
        }
      }
    }
  }

  // 弹层样式
  .layer {
    width: 990px;
    height: 300px;
    background: rgba(255, 255, 255, 0.8);
    position: absolute;
    left: 300px;
    top: 0;
    display: none; //隐藏
    ul {
      display: flex;
      // flex-wrap: wrap;
      flex-direction: column;
      li {
        width: 250px;
        list-style: none;
        &:nth-child(3n) {
          margin-right: 0;
        }
        .info {
          // line-height: 24px;
          // width: 190px;
          .name {
            font-size: 4px;
            color: rgb(1, 1, 1);
          }
        }
        &:hover {
          // background: pink;
          cursor: pointer;
          .info {
            .name {
              font-size: 4px;
              color: #f5222d;
            }
          }
        }
      }
    }
  }
  &:hover {
    .layer {
      display: block;
    }
  }
}

.secondary {
  margin-left: 120px;
  margin-top: 0;

  span {
    margin-right: 4px;
    color: rgb(27, 26, 26);
    &:first-child {
      font-size: 12px;
    }
    // 有active激活
    &:hover,
    &.active {
      background: pink;
    }
  }
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
  max-width: 150px !important;
  max-height: 70px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-wrap: break-word;
  word-break: break-all;
}
</style>
