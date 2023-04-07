<!--
 * @Author: Yelucc
 * @Date: 2021-03-22 11:52:07
 * @LastEditors: Yelucc
 * @LastEditTime: 2021-04-02 19:01:19
 * @Description: 
-->

<template>
  <el-dialog
    :title="title"
    :visible.sync="open"
    width="800px"
    append-to-body
    :close-on-click-modal="false"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-row :gutter="10">
        <el-col :span="14"
          ><el-form-item label="问题" prop="qtitle">
            <el-input
              class="inp-border"
              v-model="form.qtitle"
              placeholder="请输入问题"
            /> </el-form-item
        ></el-col>
        <el-col :span="3">
          <el-form-item label="多选" prop="isMultiple"
            ><el-checkbox v-model="form.isMultiple"></el-checkbox
          ></el-form-item>
        </el-col>
      </el-row>
      <div class="select-content">
        <div class="select-item"><i>*</i> 选项</div>
        <div class="add-select-item" @click="addSelect">添加</div>
      </div>
      <el-form-item prop="qselect">
        <div v-for="(item, index) in form.qselect" class="mb20" :key="index">
          <el-row :gutter="10">
            <el-col :span="1">
              <span>{{alpheter[index]}}</span>
              <!-- <i class="el-icon-s-order"></i> -->
              </el-col>
            <el-col :span="6">
              <el-form-item :prop="`qselect.${index}.q`" :rules="rules.q">
                <el-input v-model="item.q" placeholder="请输入选项内容" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :prop="`qselect.${index}.s`" :rules="rules.s">
                <el-input v-model.number="item.s" placeholder="请输入分值" />
              </el-form-item>
            </el-col>
            <el-col v-if="form.qselect.length == 1 ? false : true" :span="3">
              <el-button
                circle
                type="danger"
                size="mini"
                @click="delSelect(index)"
                icon="el-icon-minus"
              >
              </el-button>
            </el-col>
            <!-- <el-col :span="4"
              ><el-button
                circle
                type="primary"
                size="mini"
                @click="addSelect"
                icon="el-icon-plus"
              ></el-button
            ></el-col> -->
          </el-row>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer popup-change-btn">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  addQuestionStore,
  updateQuestionStore,
} from "@/api/performance/questionStore";
export default {
  name: "AddQuestionDialog",
  components: {},
  props: {
    title: {
      type: String,
      default: () => {
        return "";
      },
    },
    open: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      alpheter:["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"],
      form: {
        qid: null,
        qtitle: null,
        qselect: [],
        qselectScore: null,
        createBy: null,
        isMultiple: 0,
        createTime: null,
        updateBy: null,
        updateTime: null,
        deleteStatus: 0,
        deleteBy: null,
        deleteTime: null,
      },
      rules: {
        qtitle: [{ required: true, message: "题目不能为空", trigger: "blur" }],
        qselect: [
          { required: true, message: "选项最少为1个", trigger: "blur" },
        ],
        q: [{ required: true, message: "题目不能为空", trigger: "blur" }],
        s: [
          { required: true, message: "分值不能为空", trigger: "blur" },
          { type: "number", message: "分值必须为数字值" },
        ],
      },
      qnum: 1,
    };
  },
  watch: {
    data: {
      handler(n) {
        this.form = n;
        if (n.qselect) {
          this.form.qselect = JSON.parse(n.qselect);
          this.form.isMultiple = n.isMultiple == 1 ? true : false;
        } else {
          this.form.qselect = [
            {
              i: 0,
              q: "",
              s: "",
              c: 0,
            },
          ];
        }
      },
    },
  },
  methods: {
    // 表单重置
    reset() {
      this.form = {
        qid: null,
        qtitle: null,
        qselect: [],
        qselectScore: null,
        createBy: null,
        isMultiple: 0,
        createTime: null,
        updateBy: null,
        updateTime: null,
        deleteStatus: 0,
        deleteBy: null,
        deleteTime: null,
      };
      this.resetForm("form");
    },
    /** 增加选项 */
    addSelect() {
      this.qnum++;
      console.log(this.form);
      this.form.qselect.push({
        i: this.qnum,
        q: "",
        s: "",
        c: 0,
      });
    },
    /** 删除选项 */
    delSelect(id) {
      this.qnum--;
      if (this.form.qselect.length == 1) {
        return;
      } else {
        this.form.qselect.splice(id, 1);
      }
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          // 深拷贝
          let temp = { ...this.form };
          temp.qselect =
            temp.qselect.length > 0 ? JSON.stringify(temp.qselect) : null;
          temp.isMultiple = temp.isMultiple == true ? "1" : "0";
          if (temp.qid != null) {
            updateQuestionStore(temp).then((response) => {
              this.msgSuccess("修改成功");
              this.$emit("cancel");
              this.reset();
            });
          } else {
            addQuestionStore(temp).then((response) => {
              this.msgSuccess("新增成功");
              this.$emit("cancel");
              this.reset();
            });
          }
        }
      });
    },
    // 取消按钮
    cancel() {
      this.$emit("cancel");
      this.reset();
    },
  },
};
</script>

<style scoped>
.select-item {
  font-size: 14px;
  color: #606266;
  margin-left: 30px;
  font-weight: 700;
}
.select-item > i {
  color: red;
}
.select-content {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.add-select-item {
  width: 58px;
  padding: 10px;
  height: 30px;
  line-height: 10px;
  text-align: center;
  border: 1px solid #1890ff;
  font-size: 12px;
  margin-left: 42px;
  color: #ffffff;
  background-color: #1890ff;
  border-radius: 4px;
}

.el-button--mini.is-circle {
  padding: 3px;
}

.inp-border {
  width: 335px;
  margin-left: 30px;
}
</style>