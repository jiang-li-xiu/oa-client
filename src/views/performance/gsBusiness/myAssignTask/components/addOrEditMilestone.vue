<template>
  <div class="bg-border-color">
    <div class="line-layout">
      <span class="mark-logo"></span>
      <div class="check-person">过程里程碑</div>
    </div>

    <el-row class="mb10 mt20">
      <el-col :span="24">
        <div class="block">
          <div
            v-for="(item, index) in milestones"
            :key="index"
            class="mb10 relative-box"
          >
            <el-card class="box-card">
              <el-alert
                v-if="isDisable(item)"
                title="此里程碑已被填报，不能修改和删除"
                type="warning"
                show-icon
                center
                :closable="false"
                class="mb10"
              >
              </el-alert>
              <el-form
                ref="milestoneForm"
                :model="item"
                :rules="rulesByMilestone"
                label-width="100px"
              >
                <el-row class="add-padding">
                  <el-col :span="24">
                    <el-form-item label="里程碑名称" prop="milestoneName">
                      <el-input
                        :disabled="isDisable(item)"
                        v-model="item.milestoneName"
                        placeholder="请输入里程碑名称"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="里程碑日期" prop="milestoneDate">
                      <el-date-picker
                        clearable
                        size="small"
                        :disabled="isDisable(item)"
                        v-model="item.milestoneDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择里程碑日期"
                        :picker-options="pickerMilestoneDate"
                        @change="changeDate"
                      >
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="提前提醒天数" prop="remindDay">
                      <el-input-number
                        v-model="item.remindDay"
                        :disabled="isDisable(item)"
                        placeholder="请输入提前提醒天数"
                        controls-position="right"
                        :min="0"
                        :max="10"
                      ></el-input-number>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="里程碑内容" prop="milestoneContent">
                      <el-input
                        resize="none"
                        v-model="item.milestoneContent"
                        :disabled="isDisable(item)"
                        type="textarea"
                        placeholder="请输入内容"
                        :autosize="{ minRows: 4, maxRows: 10 }"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>

              <div style="text-align: center">
                <el-popconfirm
                  confirm-button-text="是的"
                  cancel-button-text="不用了"
                  icon="el-icon-info"
                  icon-color="red"
                  title="确认是否删除该条里程碑？"
                  @confirm="delMilestone(index, item)"
                >
                  <!-- <el-button  type="danger" size="small"> -->
                  <img
                    slot="reference"
                    src="@/assets/images/close.png"
                    class="close-png"
                    alt=""
                  />
                  <!-- </el-button> -->
                </el-popconfirm>
              </div>
            </el-card>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- <div class="milestone">
      <span class="mark-logo"></span>
      <div class="add-milestone">过程里程碑</div>
      <div class="add-milestone-btn">
        <el-button
          @click="handleAddByMilestone"
          type="primary"
          size="small"
          style="width: 200px"
          ><i class="el-icon-circle-plus-outline"></i>&nbsp;添加里程碑
        </el-button>
      </div>
    </div> -->

    <div>
      <div @click="handleAddByMilestone" class="add-btn">
        <i class="el-icon-circle-plus-outline"></i>&nbsp;添加里程碑
      </div>
    </div>
  </div>
</template>

<script>
import { checkFillInOfMilestone } from "@/api/performance/milestone";

export default {
  name: "addOrEditMilestone",
  props: {
    milestoneArray: {
      type: Array,
      default() {
        return [];
      },
    },
    milestoneVoArray: {
      type: Array,
      default() {
        return [];
      },
    },
    startAndEndDate: {
      default() {
        return {
          startDate: undefined,
          endDate: undefined,
        };
      },
    },
  },
  data() {
    return {
      startDate: new Date(),
      endDate: new Date(),
      // 里程碑数据
      milestoneList: [],
      // 表单校验
      rulesByMilestone: {
        milestoneName: [
          { required: true, message: "里程碑名称不能为空", trigger: "blur" },
        ],
        milestoneDate: [
          { required: true, message: "里程碑日期不能为空", trigger: "blur" },
        ],
        milestoneContent: [
          { required: true, message: "里程碑内容不能为空", trigger: "blur" },
        ],
      },
      pickerMilestoneDate: {
         disabledDate: time => {
          /*return false
           if (this.startAndEndDate === undefined) {
            return time.getTime()  < Date.now() - 8.64e7;
          } */
         // return this.startAndEndDate.startDate >= time.getTime() || time.getTime() >= this.startAndEndDate.endDate;*/

          let minDate = new Date(this.startDate);
          let maxDate = new Date(this.endDate) - 0;
          let newDate =  new Date().getFullYear()+"-" + (new Date().getMonth()+1) + "-" + new Date().getDate()
          let nowDate = new Date().getTime();
          let diff = 0;
          if(navigator.userAgent.indexOf("Firefox") > -1){
            diff = nowDate - (new Date(newDate) - 3600000 * 8);
          }else{
            diff = nowDate - (new Date(newDate));
          }
          return (time.getTime() + diff) < minDate || (time.getTime() + diff) > maxDate;
       }
      }
    }
  },
  created() {
    this.getList();
  },
  computed: {
    milestones: {
      get() {
        return this.milestoneList;
      },
      set(val) {
        this.$emit("update:milestoneVoArray", val);
      },
    },
  },
  watch: {
    milestoneArray(val) {
      if (val === null) {
        return;
      }
      this.getList()
    },
     startAndEndDate(){
        this.refresh();
    }
  },
  mounted() {
    this.refresh();
  },
  methods: {
    // 里程碑添加
    handleAddByMilestone() {
      this.milestoneList.push({
        milestoneName: "",
        milestoneDate: null,
        milestoneContent: "",
        remindDay: null,
      });
      this.milestones = this.milestoneList;
    },
    // 里程碑插入
    append(index) {
      this.milestoneList.splice(index + 1, 0, {
        milestoneName: "",
        milestoneDate: null,
        milestoneContent: "",
        remindDay: null,
      });
    },
    // 刷新开始和结束时间
    refresh(){
      this.startDate = this.startAndEndDate.startDate;
      this.endDate = this.startAndEndDate.endDate;
    },
    // 里程碑删除
    delMilestone(index, milestone) {
      // id为 undefined 表示为新增的数据
      if (milestone.milestoneId === undefined) {
        this.milestoneList.splice(index, 1);
        this.$message.success("删除成功");
        return;
      }

      const { milestoneId } = milestone;
      checkFillInOfMilestone(milestoneId).then((response) => {
        const checked = response.data;
        // 已填写则跳出
        if (checked) {
          this.$message.warning("此任务已被填报，不能删除！");
          return;
        }

        this.milestoneList.splice(index, 1);
        this.$message.success("删除成功");
        this.milestones = this.milestoneList;
      });
    },
    // 是否禁用
    isDisable(milestone) {
      return (
        milestone.milestoneId !== undefined && milestone.milestoneStatus === "2"
      );
    },
    // 数据校验
    dataValidation() {
      let validated = true;
      let validList = this.$refs["milestoneForm"];
      for (let valid of validList) {
        valid.validate((valid) => {
          if (!valid) {
            validated = false;
          }
        });
      }
      return validated;
    },
    // 列表
    getList() {
      if (
        this.milestoneArray !== undefined &&
        this.milestoneArray.length !== 0
      ) {
        this.milestoneList = this.milestoneArray;
        this.milestones = this.milestoneList;
      }
    },
    changeDate(val) {
      if (
        this.startAndEndDate.startDate === null ||
        this.startAndEndDate.endDate === null
      ) {
        for (let milestone of this.milestones) {
          milestone.milestoneDate = undefined;
        }
        this.$message.warning("请选择开始日期和结束日期");
      }
    },
    clear() {
      this.milestoneList = [];
    },
  },
};
</script>

<style scoped>
.check-person {
  font-size: 14px;
  font-weight: 600;
  margin-left: 15px;
}
.add-btn {
  cursor: pointer;
  color: #1890ff;
  background: #fff;
  box-shadow: 2px 2px 2px rgba(204, 204, 204, 0.397),
    -2px -2px 2px rgba(204, 204, 204, 0.397);
  border-radius: 5px;
  text-align: center;
  height: 35px;
  line-height: 35px;
  margin: 0 100px 15px 100px;
}

.line-layout {
  display: flex;
  justify-content: start;
  align-items: center;
  margin-bottom: 8px;
}

.relative-box {
  position: relative;
}

.add-padding {
  padding-top: 5vh;
}

/* 里程碑删除按钮 */
.close-png {
  cursor: pointer;
  position: absolute;
  height: 2.5vh;
  right: 0.5vw;
  top: 1vh;
}

/*蓝色标记*/ 
.mark-logo{
	height: 19px;
	width: 5px;
	background: #1890ff;
}

/*阴影部分边框*/ 
.bg-border-color {
	margin: 22px 0;
	padding: 20px;
	background: #fff;
	box-shadow: 2px 2px 2px rgba(204, 204, 204, 0.397),
	  -2px -2px 2px rgba(204, 204, 204, 0.397);
	border-radius: 5px;
}

.bg-border-color-10 {
	margin-bottom: 20px;
	padding: 20px;
	background: #fff;
	box-shadow: 2px 2px 2px rgba(204, 204, 204, 0.397),
	  -2px -2px 2px rgba(204, 204, 204, 0.397);
	border-radius: 5px;
}

.mt20 {
  margin-top: 20px;
}
.mb10 {
  margin-bottom: 10px;
}

.el-row {
  position: relative;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

</style>
