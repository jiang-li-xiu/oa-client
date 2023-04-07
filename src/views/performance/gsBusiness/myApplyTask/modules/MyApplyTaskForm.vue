<template>
  <a-spin :spinning="confirmLoading">
    <j-modal
    :title="title"
    :width="width"
    :visible="visible"
    switchFullscreen
    :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
    @cancel="handleCancel"
    cancelText="关闭">
      <el-form ref="form" :model="model" :rules="rules" label-width="110px">
          <el-form-item class="mb10" label="任务名称" prop="applyTaskName"
            ><el-input
              v-model="model.applyTaskName"
              placeholder="请输入任务名称"
          /></el-form-item>
          <el-form-item class="mb10" label="任务内容" prop="commentScore"
            ><editor
              v-model="model.commentScore"
              @on-change="getEditor"
              :min-height="192"
          /></el-form-item>
          <el-row class="mb10">
            <el-col :span="24">
              <el-form-item label="考核类型" prop="assessmentType">
                <el-radio-group v-model="model.assessmentType" size="small">
                  <!-- 90 v-for 须带索引 -->
                  <span
                    v-for="(dict, index) in assessmentTypeOptions"
                    :key="index"
                  >
                    <el-radio
                      :key="dict.value"
                      :label="dict.value"
                      :border = "true"
                      style="margin-right: 20px"
                    >
                      {{ dict.label }}
                    </el-radio>
                  </span>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="mb10">
            <el-col :span="12">
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
            <el-col :span="12">
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
          <el-row class="mb10">
            <el-col :span="12">
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
            <el-col :span="12">
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
          <el-form-item label="工时" prop="workTime">
            <el-input :placeholder="workTimePlace" v-model="model.workTime"></el-input>
          </el-form-item>
          <el-form-item label="审批人" prop="approvalBy">
            <j-select-user-by-dep v-model="model.approvalBy" :multi="false"></j-select-user-by-dep>
          </el-form-item>
          <add-or-edit-milestone
            ref="addOrEditMilestone"
            :milestone-array="model.milestoneListVo"
            :milestone-vo-array.sync="model.milestoneList"
            :start-and-end-date="{
              startDate: model.startDate,
              endDate: model.endDate,
            }"
          />
          <el-form-item label-width="110px" label="附件">
            <!-- <fileUpload
              ref="fileUpload"
              :file-str.sync="model.fileIdStr"
                :echo-file-str="model.fileIdStr || ''"
            /> -->
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
              <a-button> <a-icon type="upload"/> 上传文件 </a-button>
            </a-upload>  
          </el-form-item>
          <el-form-item label="备注" prop="remarks">
            <el-input
              resize="none"
              type="textarea"
              :rows="2"
              placeholder="请输入备注"
              v-model="model.remarks"
            ></el-input>
            <!-- <el-input :readonly="true" v-model="model.remarks" placeholder="请输入备注" /> -->
          </el-form-item>
        </el-form>
        <div align="right" slot="footer" class="dialog-footer">
          <p v-if="dialogType == 'add' || model.applyTaskStatue == '1'">
            <el-button type="primary" @click="submitForm(2)">提交申请</el-button>
            <el-button style="margin-left: 10px" @click="submitForm(1)">保存草稿</el-button>
            <el-button style="margin-left: 10px" @click="handleCancel">返回列表</el-button>
          </p>
          <p v-else-if="dialogType == 'edit'">
            <el-button type="primary" @click="submitForm(2)">确认修改</el-button>
            <el-button style="margin-left: 10px" @click="handleCancel">取消修改</el-button>
          </p>
        </div>
    </j-modal>
    <preview-file ref="previewFile"></preview-file>
  </a-spin>
</template>

<script>
  import Editor from "@/components/performance/Editor";
  import { ajaxGetDictItems } from '@/api/api'
  import FileUpload from "@/components/performance/FileUpload";
  import { addTask, updateTask, getTask } from "@/api/performance/task";
  import AddOrEditMilestone from "@/views/performance/gsBusiness/myAssignTask/components/addOrEditMilestone";
  import { FileHandleMixin } from '@/mixins/PerformanceFileHandleMixin'
  export default {
    name: 'MyApplyTaskForm',
    mixins:[ FileHandleMixin ],
    components: {
      Editor,
      FileUpload,
      AddOrEditMilestone
    },
    data () {
      return {
        title: '',
        width: 800,
        model: {},
        visible: false,
        dialogType: 'add',
        disableSubmit: false,
        confirmLoading: false,
        assessmentTypeOptions: [],
        // 表单校验
        rules: {
          applyTaskName: [
            { required: true, message: "申请任务名称不能为空", trigger: "blur" },
          ],
          commentScore: [
            { required: true, message: "申请任务内容不能为空", trigger: "blur" },
          ],
          approvalBy: [
            { required: true, message: "审批人不能为空", trigger: "change" },
          ],
          assessmentYear: [
            { required: true, message: "考核年份不能为空", trigger: "change" },
          ],
          assessmentMonth: [
            { required: true, message: "考核月份不能为空", trigger: "change" },
          ],
          startDate: [
            { required: true, message: "开始时间不能为空", trigger: "change" },
          ],
          endDate: [
            { required: true, message: "结束时间不能为空", trigger: "change" },
          ],
          assessmentType: [
            { required: true, message: "考核类型不能为空", trigger: "change" },
          ],
        },
        pickerStartDate: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          },
        },
      }
    },
    computed:{
      workTimePlace(){
        if(this.model.endDate && this.model.startDate){
          let val = (Date.parse(this.model.endDate) - Date.parse(this.model.startDate))/1000/60/60;
          this.model.workTime = val;
          return val;
        }else{
          return "请输入开始时间和结束时间！"
        }
      },
    },
    methods: {
      add () {
        this.visible = true
        this.title = '申请任务'
        this.getAssessmentType()
      },
      edit (id) {
        const that = this
        that.getAssessmentType()
        getTask(id).then((res) => {
          if (!res.data) {
            that.$message.warning("提示，未查到任务信息！");
          } else if(parseInt(res.data.applyTaskStatue) <= 2){
            that.model = res.data;
            that.title = '编辑任务'
            that.dialogType = 'edit'
            that.visible = true
            that.fileArr = res.data.fileIdStr?.split(',') ?? []
            that.getFileList({ids:that.model.fileIdStr}).then((res) => {
              that.fileList = res.result
            })
          } else {
            that.$message.warning("警告，改任务领导已审批无法进行修改！");
          }
        });
      },
      getAssessmentType(){
        ajaxGetDictItems("gs_assessment_type", null).then((res) => {
          this.assessmentTypeOptions = res.result;
        });
      },
      // 提交表单
      submitForm (type) {
        const that = this;
        // 触发表单验证
        that.$refs.form.validate(valid => {
          if (valid && this.dataValidation()) {
            that.confirmLoading = true;
            that.model.applyTaskStatue = type;
            if(!that.model.applyTaskId){
              addTask(that.model).then((res) => {
                if(res.code == 200){
                that.$message.success(res.message);
                that.visible = false;
                that.$emit('ok');
                }else{
                  that.$message.warning(res.message);
                }
              }).finally(() => {
                that.confirmLoading = false;
              })
            }else{
              updateTask(that.model).then((res) => {
                if(res.code == 200){
                that.$message.success(res.message);
                that.visible = false;
                that.$emit('ok');
                }else{
                  that.$message.warning(res.message);
                }
              }).finally(() => {
                that.confirmLoading = false;
              })
            }
          }
        })
      },
      dataValidation(){
        if (
          this.model.milestoneList !== undefined &&
          this.model.milestoneList.length > 0
        ) {
          let validatedByMilestone = this.$refs.addOrEditMilestone.dataValidation();
          if (!validatedByMilestone) {
            return false;
          }
        }
        return true;
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