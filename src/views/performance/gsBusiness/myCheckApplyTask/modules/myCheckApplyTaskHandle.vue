<template>
  <a-spin :spinning="confirmLoading">
    <j-modal
      :title="title"
      :width="width"
      :visible="visible"
      switchFullscreen
      :okButtonProps="{ class: { 'jee-hidden': disableSubmit } }"
      @cancel="handleCancel"
      cancelText="关闭"
    >
      <div class="bg-border-color-10 mb10">
        <div class="flex mb20">
          <span class="mark-logo mr10"></span>
          <div class="font-700 color-35">申请任务信息</div>
        </div>
        <div>
          <el-row :gutter="24" class="mb20">
            <el-col :span="6"><span class="color-35">申请任务名称</span></el-col>
            <el-col :span="18" class="color-91">{{ model.applyTaskName }}</el-col>
          </el-row>
          <el-row :gutter="24" class="mb20">
            <el-col :span="6"><span class="color-35">申请人</span></el-col>
            <el-col :span="18" class="color-91">{{ model.createByName }}</el-col>
          </el-row>
          <el-row :gutter="24" class="mb20">
            <el-col :span="6"><span class="color-35">审批人</span></el-col>
            <el-col :span="18" class="color-91">{{ model.approvalName }}</el-col>
          </el-row>
          <el-row :gutter="24" class="mb20">
            <el-col :span="6">
              <span class="color-35">计划时间：</span>
            </el-col>
            <el-col :span="18">
              {{ model.startDate | parseTime('{y}年{m}月{d}日 {h}:{i}') }} 至
              {{ model.endDate | parseTime('{y}年{m}月{d}日 {h}:{i}') }}
            </el-col>
          </el-row>
          <el-row :gutter="24" class="mb20">
            <el-col :span="6"><span class="color-35">考核类型</span></el-col>
            <el-col :span="18" class="color-91">
              {{ model.assessmentTypeLabel }}
            </el-col>
          </el-row>
          <el-row :gutter="24" class="mb20">
            <el-col :span="6"><span class="color-35">考核年月</span></el-col>
            <el-col :span="18" class="color-91"> {{ model.assessmentYear }}年{{ model.assessmentMonth }}月 </el-col>
          </el-row>
          <el-row :gutter="24" class="mb20">
            <el-col :span="6"><span class="color-35">审批状态</span></el-col>
            <el-col :span="18" class="color-91">
              <el-tag :type="getStatusType(model.applyTaskStatue)">{{ model.applyTaskStatueLabel }}</el-tag>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="bg-border-color-10 mb10">
        <div class="flex mb20">
          <span class="mark-logo mr10"></span>
          <div class="font-700 color-35">任务内容</div>
        </div>
        <div>
          <div class="ql-editor">
            <div v-html="model.commentScore"></div>
          </div>
        </div>
      </div>
      <!-- 过程里程碑 -->
      <div class="bg-border-color-10 mb10">
        <div class="flex mb20">
          <span class="mark-logo mr10"></span>
          <div class="font-700 color-35">过程里程碑</div>
        </div>
        <div class="block">
          <el-row :gutter="20" style="text-align: center">
            <el-col :span="24">
              <h4 v-if="model.milestoneListVo?.length === 0">无里程牌</h4>
            </el-col>
          </el-row>
          <div v-if="model.milestoneListVo?.length > 0" style="margin-top: 15px">
            <el-timeline>
              <el-timeline-item
                v-for="milestone in model.milestoneListVo"
                :key="milestone.applyMilestoneId"
                :timestamp="milestone.milestoneDate | parseTime('{y}年{m}月{d}日')"
                placement="top"
              >
                <el-card>
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
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>
      </div>
      <!-- 任务附件 -->
      <div class="bg-border-color-10 mb10">
        <div class="flex mb20">
          <span class="mark-logo mr10"></span>
          <div class="font-700 color-35">申请任务附件</div>
        </div>
        <el-row :gutter="20" style="text-align: center; margin-top: 15px">
          <el-col :span="24">
            <h4 v-if="!model.fileIdStr">无附件</h4>
          </el-col>
        </el-row>
        <a-upload
          v-model="model.fileIdStr"
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
      </div>
      <div class="bg-border-color-10 mb10">
        <div class="flex mb20">
          <span class="mark-logo mr10"></span>
          <div class="font-700 color-35">申请备注</div>
        </div>

        <div class="ql-editor">
          <div v-html="model.remarks"></div>
        </div>
      </div>
      <div class="bg-border-color-10 mb10">
        <div class="flex mb20">
          <span class="mark-logo mr10"></span>
          <div class="font-700 color-35">审批备注</div>
        </div>
        <div class="ql-editor">
          <div v-if="model.approvalRemarks != null && model.approvalRemarks != ''" v-html="model.approvalRemarks"></div>
          <div v-else align="center">无</div>
        </div>
      </div>
      <!-- 申请审批部分开始 -->
      <div v-show="model.applyTaskStatue == 2">
        <div class="bg-border-color-10 mb10">
          <div class="flex">
            <span class="mark-logo mr10"></span>
            <div class="font-700">审批结果</div>
          </div>
          <div style="margin-top: 20px">
            <el-radio v-model="approvalRes" label="1" border>申请通过</el-radio>
            <el-radio v-model="approvalRes" label="2" border>申请驳回</el-radio>
          </div>
        </div>
        <div class="bg-border-color-10" v-show="approvalRes == '1'">
          <el-form ref="form" :model="model" :rules="rules" label-width="100px">
            <el-row>
              <el-col :span="24" class="mb10">
                <el-form-item label="考核类型" prop="assessmentType">
                  <el-radio-group v-model="model.assessmentType" size="small">
                    <!-- 90 v-for 须带索引 -->
                    <span v-for="(dict, index) in assessmentTypeOptions" :key="index">
                      <el-radio :key="dict.value" :label="dict.value" border style="margin-right: 20px">
                        {{ dict.label }}
                      </el-radio>
                    </span>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12" class="mb10">
                <el-form-item label="考核年份" prop="assessmentYear">
                  <el-date-picker
                    v-model="model.assessmentYear"
                    type="year"
                    value-format="yyyy"
                    placeholder="请选择考核年份"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12" class="mb10">
                <el-form-item label="考核月份" prop="assessmentMonth">
                  <el-date-picker
                    v-model="model.assessmentMonth"
                    type="month"
                    placeholder="请选择考核月份"
                    format="M月"
                    value-format="M"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12" class="mb10">
                <el-form-item label="开始日期" prop="startDate">
                  <el-date-picker
                    v-model="model.startDate"
                    size="small"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm"
                    format="yyyy-MM-dd HH:mm"
                    placeholder="选择任务开始日期时间"
                    default-time="12:00:00"
                    :picker-options="pickerStartDate"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12" class="mb10">
                <el-form-item label="结束日期" prop="endDate">
                  <el-date-picker
                    v-model="model.endDate"
                    size="small"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm"
                    format="yyyy-MM-dd HH:mm"
                    placeholder="选择任务结束日期时间"
                    default-time="12:00:00"
                    :picker-options="pickerStartDate"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" class="mb10">
                <el-form-item label="权重系数" prop="weightCoefficient">
                  <el-radio-group v-model="model.weightCoefficient" size="small">
                    <!-- 90 v-for 须带索引 -->
                    <span v-for="(dict, index) in weightCoefficientOptions" :key="index">
                      <el-radio :key="dict.value" :label="dict.value" border style="margin-right: 20px">
                        {{ dict.label }}
                      </el-radio>
                    </span>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="创新系数" prop="activeInnovationCoefficient">
                  <el-radio-group v-model="model.activeInnovationCoefficient" size="small" value="1">
                    <span v-for="(dict, index) in activeInnovationCoefficientOptions" :key="index">
                      <el-radio :key="dict.value" :label="dict.value" border style="margin-right: 20px">
                        {{ dict.label }}
                      </el-radio>
                    </span>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>

          <add-or-edit-acceptance
            ref="addOrEditAcceptance"
            :acceptance-array="model.acceptanceVoList"
            :acceptance-vo-array.sync="model.acceptanceList"
          />
        </div>
        <div class="bg-border-color-10">
          <div class="flex mb10">
            <span class="mark-logo mr10"></span>
            <div class="font-700">审批备注</div>
          </div>
          <el-input
            resize="none"
            type="textarea"
            placeholder="请输入审批备注"
            v-model="model.approvalRemarks"
            maxlength="100"
            show-word-limit
          >
          </el-input>
        </div>
      </div>
      <!-- 申请审批部分结束 -->
      <div align="right" slot="footer" class="dialog-footer">
        <el-button 
          v-show="model.applyTaskStatue == 2"
          size="medium"
          type="success"
          round
          v-has="'business:taskApplyManager:edit'"
          @click="submitForm(approvalRes)"
          >确定审批</el-button
        >
        <el-button size="medium" round type="primary" @click="handleCancel">返回列表</el-button>
      </div>
    </j-modal>
    <preview-file ref="previewFile"></preview-file>
  </a-spin>
</template>

<script>
import Editor from '@/components/performance/Editor'
import { ajaxGetDictItems } from '@/api/api'
import FileUpload from '@/components/performance/FileUpload'
import { addTask, updateTask, getTask } from '@/api/performance/task'
import { parseTime } from "@/utils/performance/ruoyi";
import AddOrEditAcceptance from "@/views/performance/gsBusiness/myAssignTask/components/addOrEditAcceptance";
import { FileHandleMixin } from '@/mixins/PerformanceFileHandleMixin'
export default {
  name: 'myCheckApplyTaskHandle',
  mixins: [FileHandleMixin],
  filters: { parseTime },
  components: {
    Editor,
    FileUpload,
    AddOrEditAcceptance ,
  },
  data() {
    return {
      title: '',
      width: 800,
      model: { milestoneListVo: [] },
      visible: false,
      dialogType: 'add',
      disableSubmit: false,
      confirmLoading: false,
      //任务权重字典
      weightCoefficientOptions: [],
      //创新系数字典
      activeInnovationCoefficientOptions: [],
      assessmentTypeOptions: [],
      approvalRes: 0,
      //任务状态
      StatusType: ["", "info", "", "success", "danger"],
      // 表单参数
      form: { milestoneListVo: [] },
      // 表单校验
      rules: {
        assessmentType: [{ required: true, message: '考核类型不能为空', trigger: 'change' }],
        startDate: [{ required: true, message: '开始日期时间不能为空', trigger: 'change' }],
        endDate: [{ required: true, message: '结束日期时间不能为空', trigger: 'change' }],
        assessmentYear: [{ required: true, message: '考核年份不能为空', trigger: 'blur' }],
        assessmentMonth: [{ required: true, message: '考核月份不能为空', trigger: 'blur' }],
        weightCoefficient: [{ required: true, message: '权重系数不能为空', trigger: 'blur' }],
        activeInnovationCoefficient: [{ required: true, message: '创新系数不能为空', trigger: 'blur' }],
      },
      pickerStartDate: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        },
      },
    }
  },
  computed: {
    workTimePlace() {
      if (this.model.endDate && this.model.startDate) {
        let val = (Date.parse(this.model.endDate) - Date.parse(this.model.startDate)) / 1000 / 60 / 60
        this.model.workTime = val
        return val
      } else {
        return '请输入开始时间和结束时间！'
      }
    },
  },
  methods: {
    handle(id) {
      const that = this
      that.getAssessmentType()
      getTask(id).then((res) => {
        if (!res.data) {
          that.$message.warning('提示，未查到任务信息！')
        } else {
          that.model = res.data
          that.title = that.model.applyTaskStatue != "2" ?'主动任务审批详情' : "审批主动任务"
          that.dialogType = 'edit'
          that.visible = true
          that.fileArr = res.data.fileIdStr?.split(',') ?? []
          that.getFileList({ ids: that.model.fileIdStr }).then((res) => {
            that.fileList = res.result
          })
        }
      })
      // 获取权重系数字典
      ajaxGetDictItems("gs_weight_coefficient").then((response) => {
        this.weightCoefficientOptions = response.result;
      });
      // 获取创新系数字典
      ajaxGetDictItems("gs_active_innovation_coefficient").then((response) => {
        this.activeInnovationCoefficientOptions = response.result;
      });
    },
    getStatusType(statue) {
      return this.StatusType[parseInt(statue)];
    },
    
    getAssessmentType() {
      ajaxGetDictItems('gs_assessment_type', null).then((res) => {
        this.assessmentTypeOptions = res.result
      })
    },
    // 提交表单
    submitForm(type) {
      const that = this
      // 触发表单验证
      that.$refs.form.validate((valid) => {
        if (valid && this.dataValidation()) {
          that.confirmLoading = true
          that.model.applyTaskStatue = type
          if (!that.model.applyTaskId) {
            addTask(that.model)
              .then((res) => {
                if (res.code == 200) {
                  that.$message.success(res.message)
                  that.visible = false
                  that.$emit('ok')
                } else {
                  that.$message.warning(res.message)
                }
              })
              .finally(() => {
                that.confirmLoading = false
              })
          } else {
            updateTask(that.model)
              .then((res) => {
                if (res.code == 200) {
                  that.$message.success(res.message)
                  that.visible = false
                  that.$emit('ok')
                } else {
                  that.$message.warning(res.message)
                }
              })
              .finally(() => {
                that.confirmLoading = false
              })
          }
        }
      })
    },
    dataValidation() {
      if (this.model.milestoneList !== undefined && this.model.milestoneList.length > 0) {
        let validatedByMilestone = this.$refs.addOrEditMilestone.dataValidation()
        if (!validatedByMilestone) {
          return false
        }
      }
      return true
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleCancel() {
      this.close()
    },
    // 获取富文本的内容（不含HTML标签）
    getEditor(editor) {
      this.model.commentScoreOfText = editor.text.trim()
    },
  },
}
</script>
<style lang="less" scoped>
@import '../../../assets/styles/performance.less';
</style>