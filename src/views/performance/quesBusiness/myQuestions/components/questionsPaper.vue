<!--
 * @Author: Yelucc
 * @Date: 2021-03-23 17:01:25
 * @LastEditors: Yelucc
 * @LastEditTime: 2021-04-19 09:20:04
 * @Description: 
-->
<template>
  <el-card>
    <div class="flex mb20 font-17 font-700">{{ data.ttitle }}</div>
    <div class="color-35" v-html="data.tcontent"></div>
    <div class="wire mt20 mb10"></div>

    <!-- 题目渲染 -->

    <el-form ref="form" :model="form">
      <!-- 单选题 -->
      <div>
        <div>
          <el-form-item
            v-for="(item, index) in form.single"
            :key="index"
            :label="'问题' + (index + 1)"
            :rules="rules.ques"
            :prop="`single.${index}.answer`"
          >
            <span>{{ item.title }} （ 单选 ）</span>
            <el-radio-group v-model="item.answer" :disabled="disabled">
              <el-radio
                class="ml0 mt10 mb20"
                :label="radio.i"
                v-for="(radio, ind) in item.data"
                :key="ind"
                >{{ radio.q }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </div>
      </div>
      <!-- 多选题 -->
      <div>
        <div>
          <el-form-item
            v-for="(item, index) in form.mutiple"
            :key="index"
            :label="'问题' + (index + 1 + form.single.length)"
            :rules="rules.ques"
            :prop="`mutiple.${index}.answer`"
          >
            <span>{{ item.title }} （ 多选 ）</span>
            <el-checkbox-group v-model="item.answer" :disabled="disabled">
              <el-checkbox
                @change="handleSelect(checkbox)"
                :label="checkbox.i"
                v-for="(checkbox, ind1) in item.data"
                :key="ind1"
                >{{ checkbox.q }}</el-checkbox
              >
            </el-checkbox-group>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <div v-if="!disabled" class="btn flex-cc">
      <el-button type="primary" @click="submitForm">提交</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "QuestionsPaper",
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
    answer: {
      type: Object,
      default: () => {
        return {};
      },
    },
    disabled: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
  },
  data() {
    return {
      mutiple: this.answer == {} ? this.answer.mutiple : [],
      single: this.answer == {} ? this.answer.single : [],
      form: this.answer == {} ? this.answer : {},
      rules: {
        ques: [{ required: true, message: "请做出选择", trigger: "blur" }],
      },
    };
  },
  created() {
    // console.log(this.data,this.answer);
    if (this.answer) {
      this.mutiple = this.answer.mutiple;
      this.single = this.answer.single;
      this.form = { ...this.answer };
    }
    // console.log(this.form);
  },
  watch: {
    data: {
      handler(n) {
        // console.log(n);
        let obj = n.data;
        if (n.data != null) {
          this.mutiple = [];
          this.single = [];
          obj.forEach((item) => {
            if (item.isMultiple == 1) {
              this.mutiple.push({
                id: item.qid,
                title: item.qtitle,
                data: JSON.parse(item.qselect),
                answer: [],
              });
            } else if (item.isMultiple == 0) {
              this.single.push({
                id: item.qid,
                title: item.qtitle,
                data: JSON.parse(item.qselect),
                answer: "",
              });
            }
          });
          this.form = {
            mutiple: this.mutiple,
            single: this.single,
          };
        }
      },
    },
    answer: {
      handler(n) {
        // console.log(n);
        this.mutiple = n.mutiple;
        this.single = n.single;
        this.form = {
          mutiple: n.mutiple,
          single: n.single,
        };
      },
    },
  },
  methods: {
    handleSelect(n) {
      if (n.c == 0) {
        n.c = 1;
      } else {
        n.c = 0;
      }
    },
    submitForm() {
      // console.log(result);
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let result = {
            single: this.single,
            mutiple: this.mutiple,
          };
          //  console.log(result);
          this.$emit("submitForm", result);
        }
      });
    },
    cancel() {
      this.$emit("cancel");
    },
  },
};
</script>

<style  scoped>
/deep/ .el-card__header {
  text-align: center;
  font-size: 2.5vh;
  font-weight: bold;
}

/deep/ .el-radio-group,
.el-checkbox-group {
  display: flex;
  flex-direction: column;
}

/deep/ .el-radio.is-disabled {
  margin: 1.5vh 0;
}
/deep/ .el-checkbox {
  margin: 1vh 0;
}

/deep/ .el-dialog__footer .dialog-footer {
  display: flex;
  justify-content: center;
}

.wire {
  width: 100%;
  height: 1px;
  background: #1890ff;
}
</style>