<!--
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-08-23 09:13:54
 * @LastEditors: JLX
 * @LastEditTime: 2023-02-01 08:43:42
-->
<template>
  <a-card :bordered="false" class="assembly-container-col">
    <!-- <a-tabs default-active-key="1">
      <a-tab-pane key="1" tab="供应商账号"> -->
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form-model ref="ruleForm" :model="param" layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-model-item label="供应商类型" prop="trade">
              <j-dict-select-tag v-model="param.trade" dictCode="supplier_type" placeholder="请选择供应商类型" @change="searchQuery"/>
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="用户名称" prop="supplier">
              <j-input v-model="param.supplier" placeholder="请输入用户名称" />
            </a-form-model-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-model-item label="用户账号" prop="account">
              <j-input v-model="param.account" placeholder="请输入用户账号" />
            </a-form-model-item>
          </a-col>

          <!-- <a-col :md="6" :sm="8">
            <a-form-model-item label="行业分类" prop="industryInvolved">
              <j-category-select v-model="param.industryInvolved" pcode="B04" :multiple="false" @change="change" />
            </a-form-model-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-model-item label="服务分类" prop="productServiceClassify">
              <j-category-select
                v-model="param.productServiceClassify"
                pcode="B05"
                :multiple="false"
                @change="change"
              />
            </a-form-model-item>
          </a-col> -->

          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-model-item label="手机号" prop="phone">
                <j-input v-model="param.phone" placeholder="请输入手机号" />
              </a-form-model-item>
            </a-col>
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
    </div>

    <!-- 按钮区域 -->
    <div class="table-operator">
      <a-button type="primary" @click="handleAdd" icon="plus">新增</a-button>
    </div>

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
          fixed: true
        }"
        @change="handleTableChange"
        :loading="loading"
      >
        <template #action="row">
          <a-space :size="12">
            <a @click="handleEdit(row)">编辑</a>
            <a-divider type="vertical" />
            <a-dropdown>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a href="javascript:;" @click="handleDetail(row)">详情</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;" @click="handleChangePassword(row.account)">密码</a>
                </a-menu-item>
                <!-- <a-menu-item>
                  <a-popconfirm title="确定冻结吗?" @confirm="() => handleFrozen(row.id, 2, row.account)">
                    <a>冻结</a>
                  </a-popconfirm>
                </a-menu-item> -->
                <a-menu-item>
                  <a href="javascript:;" @click="handlePerssion(row.id)">授权</a>
                </a-menu-item>
              </a-menu>
              <a>更多<a-icon type="down"/></a>
            </a-dropdown>
          </a-space>
        </template>
      </a-table>
    </div>

    <!-- 新增编辑详情弹窗 -->
    <add-and-edit-dialog ref="modalForm" @refresh="loadData(1)"></add-and-edit-dialog>
    <!-- 详情 -->
    <detailDialog ref="detailForm"></detailDialog>
    <!-- 修改密码 -->
    <password-modal
      ref="passwordmodal"
      @ok="passwordModalOk"
      :changeUrl="`/prodSupplier/changePassword`"
      paramsName="account"
    ></password-modal>
    <!-- 授权 -->
    <UserRoleModal ref="modalUserRole"></UserRoleModal>

    <!-- </a-tab-pane> -->
    <!-- 标签二 -->
    <!-- <a-tab-pane key="2" tab="施工队账号"> </a-tab-pane> -->
    <!-- </a-tabs> -->
  </a-card>
</template>

<script>
import { frozenBatch, changeSupplierPassword } from '@/api/api'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin'
import PasswordModal from '@/views/system/modules/PasswordModal.vue'
// 组件
import AddAndEditDialog from './components/AddAndEditDialog'
import detailDialog from '@/views/supplier-user-management/basic-information-management/components/EditDialog.vue'
import UserRoleModal from './components/AuthorizationDialog'
// import UserRoleModal from '@/views/system/modules/UserRoleModal.vue'
//导入过滤对象中为空的属性、防抖方法
import { filterObj, simpleDebounce } from '@/utils/util'
// 字典
import { getDictText } from '@/api/api'
export default {
  mixins: [TableListMixin],
  components: { AddAndEditDialog, detailDialog, PasswordModal, UserRoleModal },
  data() {
    return {
      // 查询参数
      param: {
        industry: null
      },
      // 表格配置
      columns: [
        // {
        //   title: '序号',
        //   dataIndex: 'index',
        //   align: 'center',
        //   width: 100,
        //   customRender(text, record, index) {
        //     return index + 1
        //   }
        // },
        {
          title: '用户名称',
          dataIndex: 'supplier',
          align: 'center',
          width: 250
        },
        {
          title: '用户账号',
          dataIndex: 'account',
          align: 'center',
          width: 250
        },
        {
          title: '手机号',
          dataIndex: 'phone',
          align: 'center',
          width: 250
        },
        {
          title: '供应商类型',
          dataIndex: 'trade',
          align: 'center',
          width: 300,
          customRender: value => getDictText('supplier_type', value)
        },
        {
          title: '供应商等级',
          dataIndex: 'supplierLevel',
          align: 'center',
          width: 250,
          customRender: value => getDictText('credit_rating', value)
        },
        {
          title: '所属地区',
          dataIndex: 'city',
          align: 'center',
          width: 300
        },
        {
          title: '账号状态',
          dataIndex: 'status',
          align: 'center',
          width: 300,
          // (1-正常,2-冻结)
          customRender(text) {
            return text == 1 ? '正常' : text == 2 ? '冻结' : ''
          }
        },
        // {
        //   title: '状态',
        //   dataIndex: 'approval',
        //   align: 'center',
        //   width: 300,
        //   // 0-待审批，1-已审批，2-审批通过，3审批不通过
        //   // customRender(text) {
        //   //   return text == 3 ? '审批不通过' : text == 1 ? '已审批' : text == 2 ? '审批通过' : '待审批'
        //   // }
        //   customRender: value => getDictText('approval_status', value)
        // },
        // {
        //   title: '用户类型',
        //   dataIndex: 'trade',
        //   align: 'center',
        //   width: 250,
        //   customRender: value => getDictText('supplier_type', value)
        // },
        {
          title: '创建人',
          dataIndex: 'createBy',
          align: 'center',
          width: 250
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          fixed: 'right',
          width: 250,
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 请求地址
      url: {
        // 列表
        list: '/jeecg-supplier/prodSupplier/list'
      }
    }
  },
  methods: {
    change(val) {
      // console.log('选中的分类id-',val);
      this.searchQuery()
    },

    // 详情
    handleDetail(row) {
      // console.log(row);
      this.$refs.detailForm.detailAccount(row)
      this.$refs.detailForm.disableSubmit = true
      this.$refs.detailForm.title = '详情'
    },

    // 授权
    handlePerssion(id) {
      this.$refs.modalUserRole.show(id)
    },

    handleFrozen: function(id, status, username) {
      let that = this
      //TODO 后台校验管理员角色
      if ('admin' == username) {
        that.$message.warning('管理员账号不允许此操作！')
        return
      }
      frozenBatch({ ids: id, status: status }).then(res => {
        if (res.success) {
          that.$message.success(res.message)
          that.loadData()
        } else {
          that.$message.warning(res.message)
        }
      })
    },

    // 打开密码弹窗
    handleChangePassword(username) {
      console.log(username)
      this.$refs.passwordmodal.show(username)
    },

    passwordModalOk() {
      //TODO 密码修改完成 不需要刷新页面，可以把datasource中的数据更新一下
    },

    // 查询参数渲染
    getQueryParams() {
      //获取高级查询条件
      let sqp = {}
      if (this.superQueryParams) {
        sqp['superQueryParams'] = encodeURI(this.superQueryParams)
        sqp['superQueryMatchType'] = this.superQueryMatchType
      }
      let param = Object.assign(sqp, this.param, this.isorter, this.filters)
      param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      param.roleCode = 'gongying'
      return filterObj(param)
    },
    getQueryField() {
      //TODO 字段权限控制
      let str = 'id,'
      this.columns.forEach(function(value) {
        str += ',' + value.dataIndex
      })
      return str
    }
  }
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
</style>
