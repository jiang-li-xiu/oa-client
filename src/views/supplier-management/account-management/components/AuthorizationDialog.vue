<template>
  <a-drawer
    :title="title"
    :maskClosable="true"
    width="650"
    placement="right"
    :closable="true"
    @close="close"
    :visible="visible"
    style="overflow: auto; padding-bottom: 53px"
  >
    <a-form>
      <a-form-item label="所拥有的权限">
        <a-tree
          checkable
          @check="onCheck"
          :checkedKeys="checkedKeys"
          :treeData="treeData"
          @expand="onExpand"
          @select="onTreeNodeSelect"
          :selectedKeys="selectedKeys"
          :expandedKeys="expandedKeysss"
          :checkStrictly="checkStrictly"
        >
          <span slot="hasDatarule" slot-scope="{ slotTitle, ruleFlag }">
            {{ slotTitle }}
            <a-icon v-if="ruleFlag" type="align-left" style="margin-left: 5px; color: red"></a-icon>
          </span>
        </a-tree>
      </a-form-item>
    </a-form>

    <div class="drawer-bootom-button">
      <a-dropdown style="float: left" :trigger="['click']" placement="topCenter">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="switchCheckStrictly(1)">父子关联</a-menu-item>
          <a-menu-item key="2" @click="switchCheckStrictly(2)">取消关联</a-menu-item>
          <a-menu-item key="3" @click="checkALL">全部勾选</a-menu-item>
          <a-menu-item key="4" @click="cancelCheckALL">取消全选</a-menu-item>
          <a-menu-item key="5" @click="expandAll">展开所有</a-menu-item>
          <a-menu-item key="6" @click="closeAll">合并所有</a-menu-item>
        </a-menu>
        <a-button> 树操作 <a-icon type="up" /> </a-button>
      </a-dropdown>
      <a-popconfirm title="确定放弃编辑？" @confirm="close" okText="确定" cancelText="取消">
        <a-button style="margin-right: 0.8rem">取消</a-button>
      </a-popconfirm>
      <a-button @click="handleSubmit(false)" type="primary" :loading="loading" ghost style="margin-right: 0.8rem"
        >仅保存
      </a-button>
      <a-button @click="handleSubmit(true)" type="primary" :loading="loading">保存并关闭</a-button>
    </div>

    <role-datarule-modal ref="datarule"></role-datarule-modal>
  </a-drawer>
</template>
<script>
import { querySupplierTreeListForRole, querySupplierRolePermission, saveSupplierRolePermission } from '@/api/api'
import RoleDataruleModal from './RoleDataruleModal.vue'

export default {
  name: 'RoleModal',
  components: {
    RoleDataruleModal,
  },
  data() {
    return {
      supplierId: '', //供应商id
      treeData: [],
      defaultCheckedKeys: [], //默认选中复选框的树节点
      checkedKeys: [], //选中复选框的树节点
      expandedKeysss: [], //展开指定的树节点
      allTreeKeys: [],
      autoExpandParent: true,
      checkStrictly: true, //checkable状态下节点选择完全受控（父子节点选中状态不再关联）
      title: '菜单权限配置',
      visible: false,
      loading: false,
      selectedKeys: [],
    }
  },
  methods: {
    onTreeNodeSelect(id) {
      if (id && id.length > 0) {
        this.selectedKeys = id
      }
      this.$refs.datarule.show(this.selectedKeys[0], this.supplierId)
    },
    onCheck(o) {
      console.log(o)
      if (this.checkStrictly) {
        this.checkedKeys = o.checked
      } else {
        this.checkedKeys = o
      }
    },
    show(supplierId) {
      this.supplierId = supplierId
      this.visible = true
    },
    close() {
      this.reset()
      this.$emit('close')
      this.visible = false
    },
    onExpand(expandedKeys) {
      this.expandedKeysss = expandedKeys
      this.autoExpandParent = false
    },
    reset() {
      this.expandedKeysss = []
      this.checkedKeys = []
      this.defaultCheckedKeys = []
      this.loading = false
    },
    expandAll() {
      this.expandedKeysss = this.allTreeKeys
    },
    closeAll() {
      this.expandedKeysss = []
    },
    checkALL() {
      this.checkedKeys = this.allTreeKeys
    },
    cancelCheckALL() {
      //this.checkedKeys = this.defaultCheckedKeys
      this.checkedKeys = []
    },
    switchCheckStrictly(v) {
      if (v == 1) {
        this.checkStrictly = false
      } else if (v == 2) {
        this.checkStrictly = true
      }
    },
    handleCancel() {
      this.close()
    },
    handleSubmit(exit) {
      let that = this
      let params = {
        // id: that.supplierId, //供应商id
        permissionIds: that.checkedKeys.join(','), //权限id
        // lastpermissionIds: that.defaultCheckedKeys.join(','),
      }
      that.loading = true
      console.log('请求参数：', that.checkedKeys, params)
      saveSupplierRolePermission(that.supplierId, params).then((res) => {
        if (res.success) {
          that.$message.success(res.message)
          that.loading = false
          if (exit) {
            that.close()
          }
        } else {
          that.$message.error(res.message)
          that.loading = false
          if (exit) {
            that.close()
          }
        }
        this.loadData()
      })
    },
    loadData() {
      querySupplierTreeListForRole().then((res) => {
        this.treeData = res.result.treeList
        this.allTreeKeys = res.result.ids //展开的树形节点
        // console.log(this.treeData)
        // 查询供应商权限id
        querySupplierRolePermission(this.supplierId).then((res) => {
          let data = res.result.filter((item) => item !== '') //过滤掉空数据
          // console.log(data)
          this.checkedKeys = [...data]
          this.defaultCheckedKeys = [...res.result]
          this.expandedKeysss = this.allTreeKeys //expandedKeysss：展开指定的树节点
          // console.log(this.checkedKeys)
        })
      })
    },
  },
  watch: {
    visible() {
      if (this.visible) {
        this.loadData()
      }
    },
  },
}
</script>
<style lang="less" scoped>
.drawer-bootom-button {
  position: absolute;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  left: 0;
  background: #fff;
  border-radius: 0 0 2px 2px;
}
</style>
