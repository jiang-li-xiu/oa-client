<template>
  <a-card :bordered="false" class="assembly-container-col">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <!-- 表格区域 -->
      <div class="table">
        <a-table
          :columns="columns"
          :data-source="dataSource"
          bordered
          size="small"
          rowKey="id"
          :scroll="{ x: true }"
          :indentSize="10"
          :pagination="false"
        >
          <template #action="text, record">
            <a @click="handlePlanDetail(record)">方案详情</a>
            <!-- <template v-if="record.status == 3">
              <a-divider type="vertical" />
              <a href="javascript:;" @click="handleInquiryDetail(record)">询价详情</a>
            </template> -->
          </template>
        </a-table>
      </div>
    </div>
    <PlanDetail ref="planForm" :is_approval="false"></PlanDetail>
    <CrmProjectInquiry ref="inquiryForm" :schemeCode="schemeCode"></CrmProjectInquiry>

    <!-- 工程方案 -->
    <add-engineering-scheme ref="engineering"></add-engineering-scheme>
    <!-- 软件方案 -->
    <add-software-scheme ref="software"></add-software-scheme>
  </a-card>
</template>

<script>
import { getSchemeListDetail, getLibrary } from '@/api/set-project/set-project.js'
import PlanDetail from '@/views/project-management/plan-management/plan-management/components/AddSchemeSelectDialog.vue'
import CrmProjectInquiry from './CrmProjectInquiry.vue'

import AddEngineeringScheme from '@/views/project-management/plan-management/plan-management/components/AddEngineeringScheme.vue'
import AddSoftwareScheme from '@/views/project-management/plan-management/plan-management/components/AddSoftwareScheme.vue'
export default {
  components: { PlanDetail, CrmProjectInquiry, AddEngineeringScheme, AddSoftwareScheme },
  props: {
    currnetId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      // 查询参数
      param: {},
      // 表格配置
      columns: [
        {
          title: '方案编号',
          dataIndex: 'code',
          align: 'center',
          width: '14%',
        },
        {
          title: '方案名称',
          dataIndex: 'name',
          align: 'center',
          width: '14%',
        },
        {
          title: '方案类型',
          dataIndex: 'type',
          width: '14%',
          ellipsis: true,
          align: 'center',
          customRender(text) {
            if (text == 1) {
              return '工程'
            } else if (text == 2) {
              return '软件'
            } else {
              return ''
            }
          },
        },
        {
          title: '设计人',
          dataIndex: 'designPerson',
          align: 'center',
          width: '14%',
        },
        {
          title: '设计部门',
          dataIndex: 'designPersonDept',
          align: 'center',
          width: '14%',
        },
        {
          title: '设计时间',
          dataIndex: 'designTime',
          align: 'center',
          width: '14%',
        },
        {
          title: '状态',
          dataIndex: 'status',
          align: 'center',
          width: '14%',
          customRender(text) {
            if (text == 1) {
              return '保存'
            } else if (text == 2) {
              return '已提交'
            } else if (text == 3) {
              return '询价中'
            } else if (text == 4) {
              return '询价完成'
            } else if (text == 5) {
              return '方案不通过'
            } else if (text == 6) {
              return '已选型'
            } else {
              return ''
            }
          },
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: 150,
          scopedSlots: { customRender: 'action' },
        },
      ],
      dataSource: [],
      schemeCode: '',
    }
  },
  watch: {
    currnetId: {
      handler(val) {
        if (val) {
          this.getSchemeListDetail(this.currnetId)
        }
      },
      deep: true,
      // immediate: true,
    },
  },
  methods: {
    getSchemeListDetail(projectId) {
      getLibrary({ projectId }).then((res) => {
        if (res.success) {
          this.dataSource = res.result.records
        }
      })
    },
    close() {
      // this.currnetId = ''
      this.dataSource = []
    },
    // 方案详情
    handlePlanDetail(record) {
      if (record.type == 1) {
        // 工程方案
        this.$refs.engineering.edit(record, 2)
      } else {
        // 软件方案
        this.$refs.software.edit(record, 2)
      }
      // this.$refs.planForm.detail(record)
      // this.$refs.planForm.title = '方案详情'
      // this.$refs.planForm.type = 4
    },
    // 询价详情
    handleInquiryDetail(record) {
      this.schemeCode = record.schemeCode
      this.$refs.inquiryForm.open(record)
      this.$nextTick(() => {
        // this.$refs.inquiryForm.loadData(1)
        this.$refs.inquiryForm.loadData(record.schemeCode)
      })
    },
  },
}
</script>

<style lang="less" scoped>
.button {
  margin-top: 15px;
  width: 100%;
  margin-bottom: 20px;
}
</style>
