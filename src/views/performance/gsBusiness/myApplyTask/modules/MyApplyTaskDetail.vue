<template>
  <a-spin :spinning="confirmLoading">
    <j-modal
    :title="title"
    :width="width"
    :visible="visible"
    switchFullscreen
    :okButtonProps="{ class:{'jee-hidden': true} }"
    @cancel="handleCancel"
    cancelText="关闭">
      <div class="bg-border-color-10 mb10">
        <div class="flex">
          <span class="mark-logo mr10"></span>
          <div class="mb20 color-35 font-700">申请任务信息</div>
        </div>
        <div>
          <el-row :gutter="24" class="mb20">
            <el-col :span="4" ><span class="color-35">申请任务名称：</span></el-col >
            <el-col :span="16" class="color-91">{{ gsApplyInfo.applyTaskName }}</el-col>
          </el-row>
          <el-row :gutter="24" class="mb20">
            <el-col :span="4"><span class="color-35">申请人：</span></el-col>
            <el-col :span="16" class="color-91">{{ gsApplyInfo.createByName }}</el-col>
          </el-row>
          <el-row :gutter="24" class="mb20">
            <el-col :span="4"><span class="color-35">审批人：</span></el-col>
            <el-col :span="16" class="color-91">{{ gsApplyInfo.approvalName }}</el-col>
          </el-row>
          <el-row :gutter="24" class="mb20">
            <el-col :span="4">
              <span class="color-35">计划时间：</span>
            </el-col>
            <el-col :span="16" class="color-91">
              {{ gsApplyInfo.startDate | parseTime("{y}年{m}月{d}日 {h}:{i}") }}
              至
              {{ gsApplyInfo.endDate | parseTime("{y}年{m}月{d}日 {h}:{i}") }}
            </el-col>
          </el-row>
          <el-row :gutter="24" class="mb20">
            <el-col :span="4"><span class="color-35">考核类型：</span></el-col>
            <el-col :span="16" class="color-91">
              {{ gsApplyInfo.assessmentTypeLabel }}
            </el-col>
          </el-row>
          <el-row :gutter="24" class="mb20">
            <el-col :span="4"><span class="color-35">考核年月：</span></el-col>
            <el-col :span="16" class="color-91">
              {{ gsApplyInfo.assessmentYear }}年{{ gsApplyInfo.assessmentMonth }}月
            </el-col>
          </el-row>
          <el-row :gutter="24" class="mb20">
            <el-col :span="4"><span class="color-35">审批结果：</span></el-col>
            <el-col :span="16" class="color-91">
              <el-tag :type="type">{{ gsApplyInfo.applyTaskStatueLabel }}</el-tag>
            </el-col>
          </el-row>
        </div>
      </div>

      <div class="bg-border-color-10 mb10">
        <div class="flex">
          <span class="mark-logo mr10"></span>
          <div class="mb20 color-35 font-700">任务内容</div>
        </div>
        <div>
          <div class="ql-editor">
            <div v-html="gsApplyInfo.commentScore"></div>
          </div>
        </div>
      </div>
      <!-- 过程里程碑 -->
      <div class="bg-border-color-10 mb10">
        <div class="flex">
          <span class="mark-logo mr10"></span>
          <div class="mb20 color-35 font-700">任务内容</div>
        </div>
        <div class="block">
          <el-row :gutter="20" style="text-align: center">
            <el-col :span="24">
              <h4 v-if="gsApplyInfo.milestoneListVo && gsApplyInfo.milestoneListVo.length === 0">无里程牌</h4>
            </el-col>
          </el-row>
          <div v-if="gsApplyInfo.milestoneListVo && gsApplyInfo.milestoneListVo.length > 0">
            <el-timeline>
              <el-timeline-item
                v-for="milestone in gsApplyInfo.milestoneListVo"
                :key="milestone.applyMilestoneId"
                :timestamp="milestone.milestoneDate | parseTime('{y}年{m}月{d}日')"
                placement="top">
                <div class="bg-border-color-10">
                  <el-row :gutter="24" class="mb20">
                    <el-col :span="4">
                      <b>里程碑名称</b>
                    </el-col>
                    <el-col :span="20">
                      {{ milestone.milestoneName }}
                    </el-col>
                  </el-row>
                  <el-row :gutter="24" class="mb20">
                    <el-col :span="4">
                      <b>里程碑内容</b>
                    </el-col>
                    <el-col :span="20">
                      {{ milestone.milestoneContent }}
                    </el-col>
                  </el-row>
                  <el-row :gutter="24" class="mb20">
                    <el-col :span="4">
                      <b>里程碑日期</b>
                    </el-col>
                    <el-col :span="20">
                      {{ milestone.milestoneDate }}
                    </el-col>
                  </el-row>
                </div>
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>
      </div>
      <!-- 任务附件 -->
      <div class="bg-border-color-10 mb10">
        <div class="flex">
          <span class="mark-logo mr10"></span>
          <div class="mb20 color-35 font-700">任务附件</div>
        </div>
        <el-row :gutter="20" style="text-align: center">
          <el-col :span="24">
            <h4 v-if="!fileIdStr">无附件</h4>
          </el-col>
        </el-row>
        <a-upload
          :action="minioAction"
          :multiple="true"
          :remove="removeFile"
          :file-list="fileList"
          :headers="head"
          @download="downloadFile"
          @change="uploadFile"
          @preview="previewFile"
          :showUploadList="showUploadList">
        </a-upload>  
        <!-- <file-list :echo-file-str="fileIdStr" /> -->
      </div>

      <div class="bg-border-color-10 mb10">
        <div class="flex">
          <span class="mark-logo mr10"></span>
          <div class="mb20 color-35 font-700">申请备注</div>
        </div>
        <div>
          <div class="ql-editor">
            <div v-html="gsApplyInfo.remarks"></div>
          </div>
        </div>
      </div>
      <div class="bg-border-color-10">
        <div class="flex">
          <span class="mark-logo mr10"></span>
          <div class="mb20 color-35 font-700">审批备注</div>
        </div>
        <div>
          <div class="ql-editor">
            <div v-if="gsApplyInfo.approvalRemarks != null &&gsApplyInfo.approvalRemarks != ''"
              v-html="gsApplyInfo.approvalRemarks"></div>
            <div v-else align="center">无</div>
          </div>
        </div>
      </div>
    </j-modal>
  </a-spin>
</template>

<script>
  import { getTask } from "@/api/performance/task";
  import AddOrEditMilestone from "@/views/performance/gsBusiness/myAssignTask/components/addOrEditMilestone";
  import { parseTime } from "@/utils/performance/ruoyi";
  import { FileHandleMixin } from '@/mixins/PerformanceFileHandleMixin'
  export default {
    name: 'MyApplyTaskForm',
    mixins:[ FileHandleMixin ],
    components: {
      AddOrEditMilestone
    },
    filters: {
      parseTime
    },
    data () {
      return {
        title: '任务详情',
        width: 800,
        type: '',
        gsApplyInfo: {},
        fileIdStr: null,
        visible: false,
        disableSubmit: false,
        confirmLoading: false,
        assessmentTypeOptions: [],
        pickerStartDate: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          },
        },
        //任务状态
        statusType: ["", "info", "", "success", "danger"],
      }
    },
    methods: {
      detail (id) {
        let that = this
        getTask(id).then((res) => {
          if (!res.data) {
            that.$message.warning("提示，未查到任务信息！");
          } else {
            that.visible = true;
            that.gsApplyInfo = res.data;
            that.fileIdStr = res.data.fileIdStr;
            that.fileArr = res.data.fileIdStr?.split(',') ?? []
            that.getFileList({ids: that.fileIdStr}).then((data) => {
              that.fileList = data.result
            })
            that.getStatusType(res.data.applyTaskStatue)
          }
        });
      },
      getStatusType(statue) {
        this.type = this.statusType[parseInt(statue)];
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleCancel () {
        this.close()
      },
      // 获取富文本的内容（不含HTML标签）
      getEditor(editor) {
        this.model.commentScoreOfText = editor.text.trim();
      },
    }
  }
</script>

<style lang="less" scoped>
  @import '../../../assets/styles/performance.less';
</style>