<!--
 * @Author: Yelucc
 * @Date: 2021-03-22 16:36:36
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-04-29 08:57:44
 * @Description: 
-->
<template>
  <el-dialog
    :title="title"
    :visible.sync="thisopen"
    width="800px"
    append-to-body
    :close-on-click-modal="false"
  >
      <questions-table
        :load="loading"
        :data="questionStoreList"
        handleSwitch=""
        @handleSelectionChange="handleSelectionChange"
      >
      </questions-table>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  listQuestionStore,
  addQuestionStore,
  updateQuestionStore,
} from "@/api/performance/questionStore";
import QuestionsTable from "@/views/performance/quesBusiness/questionStore/components/QuestionsTable";
export default {
  name: "AddQuestionDialog",
  components: { QuestionsTable },
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
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  created() {
    // this.loading = true;
    // listQuestionStore(this.queryParams).then((response) => {
    //   this.questionStoreList = response.rows;
    //   console.log(this.questionStoreList);
    //   this.loading = false;
    // });
  },
  data() {
    return {
      loading: false,
      thisopen: false,
      ids:[],
      questionStoreList: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        qid: null,
        qtitle: null,
        qselect: null,
        qselectScore: null,
        isMultiple: null,
        deleteStatus: null,
      },
    };
  },
  watch: {
    open: {
      handler(n) {
        this.thisopen = n;
      },
    },
    data: {
      handler(n) {
        this.questionStoreList = n
      },
    },
  },
  methods: {
    /** 提交按钮 */
    submitForm() {
        this.$emit("cancel");
    },
    // 取消按钮
    cancel() {
      this.$emit("cancel");
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.qid);
    },
  },
};
</script>

<style>
</style>