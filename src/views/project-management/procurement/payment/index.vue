<template>
  <a-card :bordered="false" class="assembly-container-col">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form-model ref="ruleForm" v-model="param" layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-model-item label="项目名称" prop="projectName">
              <a-select v-model="param.projectId" placeholder="请选择项目名称">
                <a-select-option v-for="item in projectList" :key="item.id" :value="item.id">
                  {{ item.projectName }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="合同编号" prop="contractCode">
              <a-input v-model="param.contractCode" placeholder="请输入合同编号" />
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="项目编号" prop="projectCode">
              <a-input v-model="param.projectCode" placeholder="请输入项目编号" />
            </a-form-model-item>
          </a-col>

          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-model-item label="申请时间" prop="makeFormTime">
                <a-range-picker v-model="times" style="width: 100%" @change="handleRangePickerChange" />
              </a-form-model-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-model-item label="申请部门" prop="departmentName">
                <a-select
                  ref="select"
                  v-model="param.departmentName"
                  :options="depOptions"
                  :field-names="{ label: 'name', value: 'id' }"
                  @change="handleDepart"
                ></a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-model-item label="结算单位" prop="settlementCompany">
                <a-input v-model="param.settlementCompany" placeholder="请输入结算单位" />
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

      <!-- 按钮区域 -->
      <div class="table-operator">
        <!-- <a-button type="primary" @click="handleAdd" icon="plus">新增</a-button> -->
        <a-button icon="delete" type="danger" @click="batchPathDel()" :disabled="selectedRowKeys.length === 0"
          >批量删除
        </a-button>
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
          <template #action="row">
            <a-space :size="12">
              <!-- <a href="javascript:;" @click="handleEdit(row)">编辑</a>
              <a-divider type="vertical" /> -->
              <a href="javascript:;" @click="handleDetail(row)">详情</a>
              <a-divider type="vertical" />
              <a href="javascript:;" @click="batchPathDel(row.id)" :style="{ color: 'red' }">删除</a>
            </a-space>
          </template>
        </a-table>
      </div>
    </div>

    <!-- 新增编辑详情弹窗 -->
    <AddAndEditDialog ref="modalForm" @refresh="loadData(1)"></AddAndEditDialog>
  </a-card>
</template>

<script>
import { getProjectList } from '@/api/project-management/foreign-price-management/ProjectProfit.js'
// 组件
import AddAndEditDialog from './components/AddAndEditDialog'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin'
// 字典
import { getDictText } from '@/api/api.js'
import { simpleDebounce } from '@/utils/util'
export default {
  mixins: [TableListMixin],
  components: { AddAndEditDialog },
  data() {
    return {
      // 查询参数
      param: {},
      // 表格配置
      columns: [
        {
          title: '序号',
          dataIndex: '',
          key:'rowIndex',
          width:80,
          align:"center",
          customRender:function (t,r,index) {
            return parseInt(index)+1;
          }
        },
        {
          title: '项目名称',
          dataIndex: 'projectName',
          align: 'center',
          width: 230,
          ellipsis: true,
        },
        {
          title: '项目编号',
          dataIndex: 'projectCode',
          align: 'center',
          width: 230,
          ellipsis: true,
        },
        {
          title: '合同编号',
          dataIndex: 'contractCode',
          align: 'center',
          width: 230,
          ellipsis: true,
          // customRender: (value) => getDictText('project_type', value),
        },
        {
          title: '结算单位',
          dataIndex: 'settlementCompany',
          align: 'center',
          width: 230,
          ellipsis: true,
        },
        {
          title: '申请部门',
          dataIndex: 'departmentName',
          align: 'center',
          width: 230,
          ellipsis: true,
        },
        {
          title: '申请时间',
          dataIndex: 'makeFormTime',
          align: 'center',
          width: 230,
          ellipsis: true,
        },
        {
          title: '合同金额',
          dataIndex: 'contractAmount',
          align: 'center',
          width: 230,
          ellipsis: true,
        },
        {
          title: '累计结算金额',
          dataIndex: 'allSettlementAmount',
          align: 'center',
          width: 230,
          ellipsis: true,
        },
        {
          title: '结算次数',
          dataIndex: 'settlementTimes',
          align: 'center',
          width: 230,
          ellipsis: true,
        },
        {
          title: '状态',
          dataIndex: 'status',
          align: 'center',
          width: 230,
          ellipsis: true,
          // customRender: value => getDictText('price_status', value)
          // 0-已保存，1-审批中，2-审批通过，3-审批不通过
          customRender(text) {
            return text == 0 ? '已保存' : text == 1 ? '审批中' : text == 1 ? '审批通过' : '审批不通过'
          },
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          fixed: 'right',
          width: 147,
          scopedSlots: { customRender: 'action' },
        },
      ],
      depOptions: [],
      dataSource: [{ projectName: '1' }],
      // 请求地址
      url: {
        list: '/prodPayment/list', // 列表
        deleteBatch: '/prodPayment/batch', //删除
      },
      // 时间
      times: [],
      projectList: [], //项目信息
    }
  },

  created() {
    this.getProjectList(1000)
  },

  methods: {
    // 获取项目列表
    getProjectList(pageSize) {
      getProjectList({ pageSize: pageSize }).then(({ result, success }) => {
        if (success) {
          // console.log(result)
          this.projectList = result.records
        }
      })
    },
    /**部门选择处理 */
    getCurrentUserDepart() {
      getAction('sys/sysDepart/getCurrentUserDepart').then((res) => {
        if (res.success) {
          //构建选项
          if (res.result) {
            this.depOptions = res.result
          }
        } else {
          this.depOptions = []
        }
      })
    },
    handleDepart(val) {
      this.param.departName = val
    },
    /**部门数据处理结束 */

    // 处理搜索时间
    handleRangePickerChange(dates, dateStrings) {
      this.param.makeFormTime_begin = dateStrings[0]
      this.param.makeFormTime_end = dateStrings[1]
    },
    // 检索：重置按钮
    searchReset() {
      for (let key in this.param) {
        if (key != 'ids') {
          this.param[key] = null
        }
      }
      this.times = []
      simpleDebounce(this.loadData, 0)(1)
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
</style>
