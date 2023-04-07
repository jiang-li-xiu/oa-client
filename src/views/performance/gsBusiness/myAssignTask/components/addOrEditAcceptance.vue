<template>
  <div class="bg-border-color">
    <div class="line-layout">
      <span class="mark-logo"></span>
      <div class="check-person">验收人</div>
    </div>
    <el-row class="mt20">
      <el-col>
        <div class="block">
          <div
            v-for="(item, index) in acceptances"
            :key="index"
            class="mb20 relative-box"
          >
            <el-card class="box-card">
              <el-form
                class="from-layout"
                ref="acceptanceForm"
                :model="item"
                :rules="rulesByGsRelation"
                label-width="60px"
              >
                <el-row :span="24" class="flex-center">
                  <!-- check-person -->
                  <el-form-item
                    class="flex-3"
                    label="验收人"
                    prop="acceptanceBy"
                  >
                    <!-- <dispatch-user
                      :is-multiple="false"
                      :select-title="title"
                      :user-name-array="item.acceptanceBy"
                      :id-array.sync="item.acceptanceBy"
                    /> -->
                    <j-select-user-by-dep v-model="item.acceptanceBy" :multi="false"></j-select-user-by-dep>
                  </el-form-item>
                  <el-form-item
                    class="flex-1"
                    label="权重"
                    prop="scoringWeight"
                  >
                    <el-input-number
                      v-model="item.scoringWeight"
                      :min="0"
                      :step="20"
                      :max="100"
                      @change="changeWeight"
                    ></el-input-number>
                  </el-form-item>
                  <!-- <div> -->
                  <!-- <el-col :span="2"
                      ><el-button
                      class="size-btn-add"
                        type="primary"
                        size="mini"
                        round
                        plain
                        @click="addWeight(index, 5)"
                        v-show="maxWeight > 5"
                        >+5</el-button
                      ></el-col
                    > -->
                  <!-- <el-col :span="2"
                      ><el-button
                      class="size-btn-add"
                        type="primary"
                        size="mini"
                        round
                        plain
                        @click="addWeight(index, 10)"
                        v-show="maxWeight > 10"
                        >+10</el-button
                      ></el-col
                    >
                    <el-col :span="2"
                      ><el-button
                        class="size-btn-add"
                        type="danger"
                        size="mini"
                        round
                        plain
                        @click="addWeight(index, maxWeight)"
                        v-show="maxWeight != 0"
                        ></el-button
                      ></el-col
                    > -->
                  <!-- </div> -->
                  <div class="flex-center flex-2 add-sum-btn">
                    <div
                      class="green"
                      @click="addWeight(index, 5)"
                      v-show="maxWeight > 5"
                    >
                      + 5
                    </div>
                    <div
                      class="yellow"
                      @click="addWeight(index, 10)"
                      v-show="maxWeight > 10"
                    >
                      + 10
                    </div>
                    <div
                      class="red"
                      @click="addWeight(index, maxWeight)"
                      v-show="maxWeight != 0"
                    >
                      +{{ maxWeight }}
                    </div>
                  </div>
                </el-row>
              </el-form>

              <div style="text-align: center">
                <el-popconfirm
                  confirm-button-text="是的"
                  cancel-button-text="不用了"
                  icon="el-icon-info"
                  icon-color="red"
                  title="确认是否删除该条验收人？"
                  @confirm="delAcceptance(index)"
                >
                  <img
                    slot="reference"
                    src="@/assets/images/close.png"
                    class="close-png"
                    alt=""
                  />
                </el-popconfirm>
              </div>
            </el-card>
          </div>
        </div>
      </el-col>
    </el-row>

    <!--  -->
    <div @click="handleAddByAcceptance" class="add-btn mt20">
      <i class="el-icon-circle-plus-outline"></i>&nbsp;添加验收人
    </div>
    <div class="tip mt10">( 验收人的权重之和必须为100% )</div>
  </div>
</template>

<script>
import DispatchUser from "@/components/performance/DispatchUser";
import DispatchUsers from "@/components/performance/DispatchUsers";

export default {
  name: "addOrEditAcceptance",
  components: {
    DispatchUser,
    DispatchUsers,
  },
  props: {
    acceptanceArray: {
      type: Array,
      default() {
        return [];
      },
    },
    acceptanceVoArray: {
      type: Array,
      default() {
        return [];
      },
    },
    open: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  computed: {
    acceptances: {
      get() {
        return this.acceptanceList;
      },
      set(val) {
        this.$emit("update:acceptanceVoArray", val);
      },
    },
  },
  created() {
    this.getList();
  },
  watch: {
    acceptanceArray(val) {
      console.log("22222222")
      if (val === null) {
        return;
      }
      this.getList();
    },
    open() {
      this.maxWeight = 100;
    },
  },
  data() {
    return {
      title: "选择验收人（此选项为必填）",
      // 验收人数据
      acceptanceList: [],
      indexA: -1,
      maxWeight: 100,
      dispatchDialogOpen: false,
      rulesByGsRelation: {
        scoringWeight: [
          { required: true, message: "权重不能为空", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    changeWeight(n, o) {
      this.maxWeight += o - n;
    },
    addWeight(index, num) {
      this.acceptanceList[index].scoringWeight += num;
      this.maxWeight -= num;
    },
    // 选择责任人
    selectSend() {
      this.dispatchDialogOpen = true;
    },
    // 验收人添加
    handleAddByAcceptance() {
      this.maxWeight = 100;
      this.acceptanceList.push({
        acceptanceBy: "",
        scoringWeight: 0,
      });
      this.acceptances = this.acceptanceList;
    },
    // 验收人插入
    append(index) {
      this.acceptanceList.splice(index + 1, 0, {
        acceptanceBy: "",
        scoringWeight: 0,
      });
      this.acceptances = this.acceptanceList;
    },
    // 验收人删除
    delAcceptance(index) {
      this.maxWeight += this.acceptanceList[index].scoringWeight;
      this.acceptanceList.splice(index, 1);
      this.$message.success("删除成功");
      this.acceptances = this.acceptanceList;
    },
    isRepeat(arr, key) {
      var obj = {};
      for (let i = 0; i < arr.length; i++) {
        if (obj[arr[i][key]]) {
          return false;
        } else {
          obj[arr[i][key]] = arr[i];
        }
      }
      return obj;
    },
    // 数据校验
    dataValidation() {
      let validated = true;

      for (let acceptance of this.acceptanceList) {
        if (!acceptance.acceptanceBy) {
          validated = false;
          this.$message.error("验收人必须选择！");
          return validated;
        }
      }

      let validList = this.$refs["acceptanceForm"];
      for (let valid of validList) {
        valid.validate((valid) => {
          if (!valid) {
            validated = false;
          }
        });
      }
      if (!this.isRepeat(this.acceptanceList, "acceptanceBy")) {
        this.$message.error("不能选择相同的验收人！！");
        return false;
      }
      // 计算权重和
      let scoringWeightSum = 0;
      this.acceptanceList.forEach((item) => {
        scoringWeightSum += item.scoringWeight;
      });
      if (scoringWeightSum !== 100) {
        this.$message.error("验收人权重之和必须为100%");
        validated = false;
      }
      return validated;
    },
    getList() {
      this.maxWeight = 0;
      if (
        this.acceptanceArray !== undefined &&
        this.acceptanceArray.length !== 0
      ) {
        this.acceptanceList = this.acceptanceArray;
        this.acceptances = this.acceptanceList;
      }
    },
    clear() {
      this.acceptanceList = [];
    },
  },
};
</script>

<style scoped lang='less'>
@import '../../../assets/styles/performance.less';
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
  margin: 10px 30px 0 30px;
}
.tip {
  color: red;
  font-weight: normal;
  margin-left: 30px;
  text-align: center;
}

.line-layout {
  display: flex;
  justify-content: start;
  align-items: center;
}

/* 提供定位参考 */
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

.el-button.size-btn-add {
  padding: 2px;
}
.content-width {
  width: 60%;
}
.add-sum-btn {
  margin-left: 10px;
  div {
    cursor: pointer;
    margin: 0 2px;
    padding: 2px 4px;
    border-radius: 16px;
    color: #1890ff;
    border: 1px solid #1890ff;
  }
  .red {
    color: #f56c6c;
    border: 1px solid #f56c6c;
  }
}

// * {
//   float: none !important;
// }

// .from-layout {
//   display: flex;
//   align-items: flex-start;
// }

// 属于element-ui组件库样式，修改
.el-form-item {
  margin: 20px 0;
}

.check-person {
  flex: 1.7;
}

.el-form-item__content > .el-input-number.el-input-number--medium{
  width: 150px ;
}
</style>
