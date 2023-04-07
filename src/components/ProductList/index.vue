<template>
  <a-modal
    class="dialog"
    style="background-color: #f0f2f5"
    :title="modalTitle"
    :width="1350"
    v-if="visible"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :body-style="{ height: '70vh', overflow: 'hidden', overflowY: 'scroll' }"
  >
    <template #footer>
      <a-button key="back" @click="handleCancel">取消</a-button>
      <a-button key="submit" type="primary" @click="handleOk" :disabled="selectedRowKeys.length === 0">提交</a-button>
    </template>
    <!-- 弹窗内容 -->
    <a-row :gutter="20" class="main">
      <!-- 树形 -->
      <a-col :span="8">
        <div class="tree">
          <product-class-tree
            :treeData="treeData"
            :loading="treeLoading"
            style="height: 800px"
            :replaceFields="replaceFields"
          />
        </div>
      </a-col>

      <!-- 表格一 -->
      <a-col :span="16" class="list">
        <!-- 标题 -->
        <div class="title">
          <span>待选产品</span>
        </div>
        <div class="query">
          <a-form-model ref="ruleForm" :model="param" layout="inline" @keyup.enter.native="searchQuery">
            <slot :param="param">
              <a-form-model-item label="产品名称" prop="prodName">
                <j-input v-model="param.prodName" placeholder="请输入产品名称"></j-input>
              </a-form-model-item>
              <a-form-model-item label="型号" prop="model">
                <j-input v-model="param.model" placeholder="请输入型号"></j-input>
              </a-form-model-item>
              <!-- <a-form-model-item label="产品分类" prop="productClassify">
                <j-category-select
                  v-model="param.productClassify"
                  pcode="B03"
                  :multiple="false"
                  :style="{ width: '120px' }"
                />
              </a-form-model-item> -->
            </slot>
            <a-form-model-item>
              <a-button type="primary" @click="searchQuery">查询</a-button>
              <a-button style="margin-left: 10px" @click="searchReset">重置</a-button>
            </a-form-model-item>
          </a-form-model>
        </div>
        <div class="table">
          <a-table
            :columns="columns"
            :rowKey="rowKey"
            size="small"
            :pagination="ipagination"
            :data-source="dataSource"
            bordered
            :scroll="{ y: 600 }"
            :rowSelection="{
              type: selectType,
              selectedRowKeys: selectedRowKeys,
              selectionRows: selectionRows,
              onChange: onSelectChange,
            }"
            @change="handleTableChange"
            :loading="loading"
          >
            <template slot="productClassify" slot-scope="text, record, index">
              {{ loadItemByCode(text, record) }}
              <span :title="record.name">{{ record.name }}</span>
            </template>
          </a-table>
        </div>
      </a-col>

      <!-- 表格二 -->
      <!-- <template>
        <a-col :span="9" class="list">
          <div class="title">
            <span>已选产品</span>
          </div>
          <div class="table">
            <a-table
              :columns="columnsSelect"
              :rowKey="rowKey"
              size="small"
              :data-source="selectionRows"
              bordered
              :pagination="selectPagination"
              :scroll="{ y: 650 }"
              :loading="loading"
              @change="(pagination) => (selectPagination = pagination)"
            >
              <template #action="text, record">
                <a-space :size="12">
                  <a @click="remove(record)">删除</a>
                </a-space>
              </template>
            </a-table>
          </div>
        </a-col>
      </template> -->
    </a-row>
  </a-modal>
</template>

<script>
import ProductClassTree from '@/components/ProductClassTree'
import { treeData } from '@/components/ProductClassTree/utils.js'
// API
import { getAction } from '@/api/manage.js'
import { categoryDictItem } from '@/api/api'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin.js'
//导入过滤对象中为空的属性、防抖方法
import { filterObj, simpleDebounce } from '@/utils/util'
// 数组对象去重
import { uniqBy, uniq } from 'lodash'
export default {
  mixins: [TableListMixin],
  components: { ProductClassTree },
  props: {
    // 表格配置
    columns: {
      type: Array,
      default: () => [
        {
          title: '产品分类',
          dataIndex: 'productClassify',
          align: 'center',
          scopedSlots: { customRender: 'productClassify' },
          ellipsis: true,
        },
        {
          title: '产品名称',
          dataIndex: 'prodName',
          align: 'center',
          ellipsis: true,
        },
        {
          title: '型号',
          dataIndex: 'model',
          align: 'center',
          ellipsis: true,
        },
        {
          title: '规格参数',
          dataIndex: 'modelParameter',
          align: 'center',
          ellipsis: true,
        },
        {
          title: '品牌',
          dataIndex: 'brand',
          align: 'center',
          ellipsis: true,
        },
        {
          title: '单位',
          dataIndex: 'unit',
          align: 'center',
          ellipsis: true,
        },
        {
          title: '采购单价(元)',
          dataIndex: 'price',
          align: 'center',
          ellipsis: true,
        },
        {
          title: '供应商',
          dataIndex: 'supplierName',
          align: 'center',
          ellipsis: true,
        },
      ],
    },
    // 已选表格配置
    columnsSelect: {
      type: Array,
      default: () => [
        {
          title: '产品名称',
          dataIndex: 'prodName',
          align: 'center',
          ellipsis: true,
        },
        {
          title: '型号',
          dataIndex: 'model',
          align: 'center',
          ellipsis: true,
        },
        {
          title: '规格参数',
          dataIndex: 'modelParameter',
          align: 'center',
          ellipsis: true,
        },
        {
          title: '品牌',
          dataIndex: 'brand',
          align: 'center',
          ellipsis: true,
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' },
        },
      ],
    },

    // 表格请求地址
    listUrl: {
      require: true,
      type: String,
      default: '/jeecg-supplier/prodProductEntrepot/list',
    },
    // 单选或多选
    selectType: {
      type: String,
      default: 'radio',
    },
    // 弹窗标题
    modalTitle: {
      type: String,
      default: '选择辅材',
    },
    // 已选范围
    HouseItem: {
      type: Array,
      default() {},
    },
    // 列表传参方式
    paramMode: {
      type: String,
      // 可选值 path, query
      default: 'query',
    },

    // 表格唯一标识
    rowKey: {
      type: String,
      default: 'houseId',
    },
    // 列表请求数据携带的参数
    listKey: {
      type: String,
      default: '',
    },
    // 树形点击发射事件名
    // emitEventName: {
    //   type: String,
    //   default: 'treeNodeClick',
    // },

    // 插槽数据
    slotParams: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      // 弹窗开关
      visible: false,
      // 选中的范围列表
      houseList: [],
      // 请求地址
      url: {
        list: this.listUrl,
      },
      // 不允许执行混入的created
      disableMixinCreated: true,
      // 表单查询参数
      param: {},
      // 标题
      title: '全部',
      // 当前点击的树形节点
      treeNodeData: {},
      /* 分页参数 */
      selectPagination: {
        current: 1,
        pageSize: 15,
        pageSizeOptions: ['15', '20', '30'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0,
      },
      // 角色类型
      principalType: '',
      // 保存回显的id和principalType类型
      id: '',
      arr: '',
      // 树形加载开关
      treeLoading: false,
      // 树形数据
      treeData: [],
      // 树形节点数据
      treeNodeData: [],
      replaceFields: {
        // 子节点
        children: 'children',
        // 树节点展示的内容
        title: 'title',
        // 树节点唯一标识
        key: 'key',
      },
      pid: '',
    }
  },
  created() {
    // this.treeData = treeData
    // 监听树形点击事件
    this.$bus.$on('getTreeNodeData', this.getTreeClickEvent)
    // this.$bus.$on('onExpand', this.getTreeList)
  },
  beforeDestroy() {
    // 销毁监听树形点击事件
    this.$bus.$off('getTreeNodeData', this.getTreeClickEvent)
    // this.$bus.$off('onExpand', this.getTreeList)
  },
  methods: {
    /**加载一级节点 */
    loadRoot() {
      let param = {
        pid: '',
        pcode: 'B03',
        condition: '',
      }
      getAction('/sys/category/loadTreeData', param).then((res) => {
        if (res.success && res.result) {
          for (let i of res.result) {
            i.value = i.key
            if (i.leaf == false) {
              i.isLeaf = false
            } else if (i.leaf == true) {
              i.isLeaf = true
            }
          }
          this.treeData = [...res.result]
          this.$emit('treeData', this.treeData)
          this.treeData.forEach((item) => {
            if (!item.leaf) {
              this.getChildren(item.key, this.treeData)
            } else {
              return
            }
          })
        } else {
          console.log('树一级节点查询结果-else', res)
        }
      })
    },
    // 获取树形children数据
    getChildren(pid, data) {
      let param = {
        pid: pid,
        pcode: 'B03',
        condition: '',
      }
      return getAction('/sys/category/loadTreeData', param)
        .then((res) => {
          // console.log(res)
          if (res.success) {
            for (let i of res.result) {
              i.value = i.key
              if (i.leaf == false) {
                i.isLeaf = false
                this.getChildren(i.key, res.result)
              } else if (i.leaf == true) {
                i.isLeaf = true
              }
            }
            // console.log(res.result)
            // 获取列表数据
            this.addChildren(pid, res.result, data)
            data = [...data]
          }
        })
        .then(() => {
          window.localStorage.setItem('productClass', JSON.stringify(this.treeData))
        })
    },
    addChildren(pid, children, treeArray) {
      if (treeArray && treeArray.length > 0) {
        for (let item of treeArray) {
          if (item.key == pid) {
            if (!children || children.length == 0) {
              item.isLeaf = true
            } else {
              item.children = children
            }
            break
          } else {
            this.addChildren(pid, children, item.children)
          }
        }
      }
    },
    // 监听树形点击事件
    getTreeClickEvent(data, selectkey) {
      // console.log('selectkey:', data, selectkey.toString())
      this.pid = selectkey.toString()
      // 保存数据
      this.treeNodeData = data
      // 修改请求列表的key
      this.param.productClassify = data.dataRef.key
      this.$set(this.param, 'productClassify', data.dataRef.key)
      // console.log(this.param);
      // 请求数据
      this.loadData(1)
    },
    /** 分类字典数据回显*/
    loadItemByCode(id, record) {
      if (id) {
        categoryDictItem({ ids: id }).then((res) => {
          if (res.success) {
            let values = id.split(',')
            let name = res.result.map((item, index) => ({
              key: values[index],
              value: values[index],
              label: item,
            }))
            this.$set(record, 'name', name[0].label)
          }
        })
      }
    },
    // 打开弹窗
    open(id, arr) {
      console.log('open:', id, arr)
      // 打开弹窗保存回显的id
      this.id = id
      this.arr = arr
      // 打开弹窗
      this.visible = true
      // 获取树形数据
      // this.loadRoot()
      let data = window.localStorage.getItem('productClass')
      let tree = JSON.parse(data)
      if (!tree) {
        this.loadRoot()
      } else {
        this.treeData = tree
      }
      this.loadData().then((res) => {
        if (id) {
          // 回显数据
          this.selectType == 'radio' ? this.selectedRowKeys.push(id) : this.selectedRowKeys.push(...id)
          // 选中的数据
          Array.isArray(arr)
            ? (this.selectionRows = uniqBy(this.selectionRows.concat(arr), this.rowKey))
            : this.getSelectionRows()
          //去重
          this.selectedRowKeys = uniqBy(this.selectedRowKeys)
        }
      })
    },
    // 关闭弹窗事件
    handleCancel() {
      // 关闭弹窗
      this.visible = false

      // 清空数据
      this.onClearSelected()
      this.searchReset()
      this.id = ''
      this.arr = []
    },

    // 列表多选
    onSelectChange(selectedRowKeys, selectionRows) {
      console.log(selectedRowKeys)
      this.selectedRowKeys = uniq(selectedRowKeys)
      const arr = uniqBy([...this.selectionRows, ...selectionRows], this.rowKey)

      this.selectionRows = arr.filter((row) => this.selectedRowKeys.includes(row[this.rowKey]))
    },

    // 获取列表数据
    loadData(arg) {
      if (!this.url.list) {
        this.$message.error('请设置url.list属性!')
        return
      }
      //加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1
      }
      let params = this.getQueryParams() //查询条件
      this.loading = true
      // 处理url
      this.url.list =
        this.paramMode == 'path' ? `${this.listUrl}/${this.treeNodeData[this.treeReplaceFields.key]}` : this.listUrl
      return getAction(this.url.list, params)
        .then((res) => {
          if (res.success) {
            //update-begin---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
            this.dataSource = res.result.records || res.result.orderProduct || res.result
            // this.dataSourceSelect = res.result.records || res.result

            if (this.id) {
              // 回显数据
              const selectedRowKeys = []
              this.selectType == 'radio' ? selectedRowKeys.push(this.id) : selectedRowKeys.push(...this.id)
              this.selectedRowKeys = uniq([...this.selectedRowKeys, ...selectedRowKeys])
              console.log(selectedRowKeys, 1111111111111111)
              // 选中的数据
              Array.isArray(this.arr)
                ? (this.selectionRows = uniqBy(this.selectionRows.concat(this.arr), this.rowKey))
                : this.getSelectionRows()
            }
            if (res.result.total) {
              this.ipagination.total = res.result.total
            } else {
              this.ipagination.total = 0
            }
            //update-end---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
          } else {
            this.$message.warning(res.message)
          }
          return res
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 查询参数渲染
    // getQueryParams() {
    //   //获取高级查询条件
    //   let sqp = {}
    //   if (this.superQueryParams) {
    //     sqp['superQueryParams'] = encodeURI(this.superQueryParams)
    //     sqp['superQueryMatchType'] = this.superQueryMatchType
    //   }
    //   let param = Object.assign(sqp, this.param, this.isorter, this.filters)
    //   param.field = this.getQueryField()
    //   param.pageNo = this.ipagination.current
    //   param.pageSize = this.ipagination.pageSize
    //   param.pageSize = this.ipagination.pageSize
    //   // param.productClassify = this.ipagination.pageSize
    //   return filterObj(param)
    // },
    // 点击确认
    handleOk() {
      const data = {
        selectedRowKeys: [...this.selectedRowKeys],
        selectionRows: [...this.selectionRows],
      }
      // 发射选中的数据出去
      this.$emit('select', data)
      // 关闭弹窗
      this.handleCancel()
    },

    // 保存数据回显后需提交的数据
    getSelectionRows() {
      const selectionArr = this.dataSource.filter((item) => this.selectedRowKeys.indexOf(item[this.rowKey]) !== -1)
      this.selectionRows = uniqBy([...this.selectionRows, ...selectionArr], this.rowKey)
    },

    // 删除已选覆盖范围
    remove(data, selectedRowKeys, selectionRows) {
      // 判断当前模式，data为数组则为当前组件删除，不为数组则是外部组件调用
      const flag = Object.prototype.toString.call(data) === '[object Object]'
      // 处理id
      const id = flag ? data[this.rowKey] : data
      // 判断数据
      selectedRowKeys = flag ? this.selectedRowKeys : selectedRowKeys
      selectionRows = flag ? this.selectionRows : selectionRows
      // 根据id删除selectedRowKeys对应的值
      selectedRowKeys.splice(selectedRowKeys.indexOf(id), 1)
      // 重新查询数据
      if (flag)
        return (this.selectionRows = this.selectionRows.filter(
          (item) => this.selectedRowKeys.indexOf(item[this.rowKey]) !== -1
        ))
      // 根据情况返回数据
      if (!flag) {
        selectionRows = selectionRows.filter((item) => selectedRowKeys.indexOf(item[this.rowKey]) !== -1)
        const selectData = {
          selectedRowKeys: [...selectedRowKeys],
          selectionRows: [...selectionRows],
        }
        // 发射处理好的数据出去
        this.$emit('select', selectData)
      }
    },

    // 检索：重置按钮
    searchReset() {
      console.log(this.selectedRowKeys)
      for (let key in this.param) {
        if (key != 'ids') {
          this.param[key] = null
        }
      }
      this.$refs.ruleForm.resetFields()
      simpleDebounce(this.loadData, 0)(1)
    },
  },
  watch: {
    slotParams: {
      handler(newVlaue) {
        Object.assign(this.slotParams, this.param)
        this.param = this.slotParams
      },
      deep: true,
      immediate: true,
    },
  },
}
</script>

<style lang="less" scoped>
.main {
  min-height: 800px;
  .tree {
    min-height: 800px;
    border-right: 5px solid #eee;
  }
  .list {
    .title {
      height: 50px;
      line-height: 50px;
      border-bottom: 1px solid #eee;
      background-color: #1890ff;
      font-size: 15px;
      color: #eee;
      text-align: center;
      font-weight: bold;
    }
    .query {
      margin: 12px 0;
    }
  }
}
</style>
