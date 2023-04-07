<template>
  <div class="community-tree">
    <!-- 头部标题 -->
    <div class="head-title">{{ title }}</div>
    <!-- 搜索区域 -->
    <div class="tree-search">
      <a-input-search @change="handleSearchChange" :placeholder="searchPlaceholder" />
    </div>
    <!-- 树形区域 -->
    <!-- 加载动画组件 -->
    <a-spin :spinning="loading" tip="加载中..." class="tree">
      <!-- 
        树形组件
        - expanded-keys：展开指定的树节点
        - default-selected-keys：默认选中的树节点
        - auto-expand-parent：是否自动展开父节点
        - tree-data: 树形数据
        - replaceFields：替换 treeNode 中 title,key,children 字段为 treeData 中对应的字段
        - @expand：展开/收起节点时触发
        - @select：点击树节点触发
      -->
      <a-tree
        :expanded-keys="expandedKeys"
        :auto-expand-parent="autoExpandParent"
        :tree-data="list"
        :replaceFields="replaceFields"
        :selectedKeys="selectedKeys"
        @expand="onExpand"
        @select="handleNodeClick"
        @loadData="asyncLoadTreeData"
        :loadedKeys="loadedKeys"
      >
        <template #title="props">
          <div class="tree-node" :title="props[replaceFields.title]">
            <span v-if="props[replaceFields.title].indexOf(filterText) > -1">
              {{ props[replaceFields.title].substr(0, props[replaceFields.title].indexOf(filterText)) }}
              <span style="color: #f50">{{ filterText }}</span>
              {{
                props[replaceFields.title].substr(props[replaceFields.title].indexOf(filterText) + filterText.length)
              }}
            </span>
            <div v-else>{{ props[replaceFields.title] }}</div>
          </div>
        </template>
      </a-tree>
    </a-spin>
  </div>
</template>

<script>
import { getAction } from '@/api/manage.js'
export default {
  props: {
    // 树形数据
    treeData: {
      type: Array,
      default() {
        return []
      },
    },
    // 标题
    title: {
      type: String,
      default: '产品分类',
    },
    // 搜索提示内容
    searchPlaceholder: {
      type: String,
      default: '请输入搜索的内容',
    },
    // 树形配置
    replaceFields: {
      type: Object,
      default() {
        return {
          // 子节点
          children: 'children',
          // 树节点展示的内容
          title: 'areaName',
          // 树节点唯一标识
          key: 'areaId',
        }
      },
    },
    // 加载开关
    loading: {
      type: Boolean,
      default: false,
    },
    // emit事件名称
    emitEventName: {
      type: String,
      default: 'getTreeNodeData',
    },
  },
  data() {
    return {
      // 搜索字段
      filterText: '',
      // 拼接完label的树形数据列表
      list: [],
      // 展开指定的树节点
      expandedKeys: [],
      // 搜索前展开的树节点
      oldExpandedKeys: [],
      // 是否自动展开父节点
      autoExpandParent: false,
      // 当前选中的节点
      selectedKeys: [],
      loadedKeys: [],
    }
  },
  created() {
    this.loadedKeys = []
  },
  methods: {
    /*
     * 递归树形列表，拼接层级的名字到属性label上
     * - arr 这里开始为 数组
     * - ico 连接 的字符
     * - site 记录前一段的位置
     */
    fnb(arr, ico = '', site = '') {
      // 返回新数组
      return arr.map((item) => {
        // 拼接层级的名称，赋值到label
        item.label = site + ico + item[this.replaceFields.title]
        // 判断有没有子节点，没有就返回当前节点数据
        if (!item[this.replaceFields.children]) {
          return item
        } else {
          // 如果有，则再次调用当前函数，进入递归
          item[this.replaceFields.children] = this.fnb(
            item[this.replaceFields.children],
            ' / ',
            site + ico + item[this.replaceFields.title]
          )
          // 递归完成后，返回当前节点数据
          return item
        }
      })
    },

    // 展开/收起节点时触发
    onExpand(expandedKeys, expands) {
      console.log(expandedKeys, expands);
      // console.log(expandedKeys)
      this.expandedKeys = expandedKeys
      this.$bus.$emit('onExpand', expands.node.$vnode.data.props)
    },

    // 点击树节点触发
    handleNodeClick(selectedKeys, { node }) {
      // 设置当前选中的节点
      this.selectedKeys = selectedKeys
      // 获取点击项的数据
      const data = node.$vnode.data.props
      // 判断当前是否在搜索中, length不等于0则在搜索中
      if (this.filterText.length !== 0) {
        // 展开对应的列表
        this.oldExpandedKeys = [data[this.replaceFields.key]]
      }
      // 获取所有的id
      data.ids = []
      this.getAreaIds([data.dataRef], data.ids)
      // 传递data到其他组件
      this.$bus.$emit(this.emitEventName, data, selectedKeys)
    },

    // 搜索输入框输入时触发
    handleSearchChange(e) {
      // 获取输入的内容
      const value = e.target.value
      // 在第一次输入的时候保存搜索前展开的树节点
      if (this.filterText === '' && value.length !== 0) {
        this.oldExpandedKeys = [...this.expandedKeys]
      }
      // 保存输入的内容
      this.filterText = value
      // 判断value是否为空，恢复原来搜索前展开的内容
      if (value === '') {
        // 恢复默认展示第一级数据
        return (this.expandedKeys = [...this.oldExpandedKeys])
      }

      // 清空展开列表
      this.expandedKeys = []
      // 根据搜索内容，获取内容对应所在的父级id，生成对应的展开列表
      this.getParentKey(value, this.list, '', this.expandedKeys)
      // 展开列表
      this.autoExpandParent = true
    },

    /*
     * 根据搜索内容，获取内容对应所在的父级id，生成对应的展开列表
     * - text：搜索的内容,
     * - list：树形列表数据,
     * - parent：父级id,
     * - arr：保存父级id的数组
     */
    getParentKey(text, list, parent, arr) {
      list.forEach((item) => {
        // 判断有没有子节点，有就进入递归，目的是获取到所有节点的父级id
        if (item[this.replaceFields.children]) {
          this.getParentKey(text, item[this.replaceFields.children], item[this.replaceFields.key], arr)
        }
        // 递归到最后一层没有子节点后，判断字符串中是否包含有搜索内容，如果有，则保存父级id到数组中，return一路返回添加所有层级的id
        if (item[this.replaceFields.title].indexOf(text) !== -1) {
          // 包含，则添加父级id到数组中
          return arr.push(parent)
        }
      })
    },

    // 获取所有的id
    getAreaIds(list, arr) {
      list.forEach((item) => {
        // 保存所有的id
        arr.push(item[this.replaceFields.key])
        // 判断有没有子节点，有就进入递归，目的是获取到所有节点的id
        if (item[this.replaceFields.children]) {
          return this.getAreaIds(item[this.replaceFields.children], arr)
        }
      })
    },
    asyncLoadTreeData(treeNode) {
      console.log('异步加载', treeNode)
    },
  },
  watch: {
    // 侦听树形数据的变化，在这里拼接label，默认展开第一级树节点
    treeData: {
      handler(val, old) {
        // console.log(val, old)
        if (val[0]) {
          // 拼接完label的树形数据列表
          this.list = this.fnb(val)
          // 默认展开第一级树节点
          // this.expandedKeys.push(val[0][this.replaceFields.key])
        }
      },
      immediate: true,
    },
  },
}
</script>

<style lang="less" scoped>
.community-tree {
  height: calc(100vh - 135px);
  background-color: #fff;
  .head-title {
    width: 100%;
    height: 48px;
    line-height: 48px;
    text-align: center;
    color: #fff;
    font-size: 15px;
    font-weight: 600;
    background-color: #1890ff;
  }
  .tree-search {
    height: 40px;
    line-height: 40px;
    padding: 5px;
  }

  .tree {
    height: calc(100% - 88px);
    // overflow: hidden;

    overflow-y: scroll;
    &::-webkit-scrollbar {
      // display: none;
      width: 3px;
    }
    ::v-deep .ant-tree-node-content-wrapper {
      width: calc(100% - 50px);

      .tree-node {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>
