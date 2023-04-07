<!--
 * @Author: Yelucc
 * @Date: 2021-03-23 12:20:23
 * @LastEditors: Please set LastEditors
 * @LastEdittime: 2021-03-27 09:56:25
 * @Description: 
-->
<template>
  <div>
    <el-table
      v-loading="loading"
      :data="questionTemplateList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="问卷ID" align="center" prop="tid" />
      <el-table-column label="问卷标题" align="center" prop="ttitle" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['business:questionTemplate:edit']"
            >详细</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改问卷模板对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="1000px"
      append-to-body
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="问卷标题" prop="ttitle">
          <el-input
            v-model="form.ttitle"
            placeholder="请输入问卷标题"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item label="问卷导引">
          <el-card>
            <div v-html="form.tContent"></div>
          </el-card>
        </el-form-item>
        <questions-table :load="false" :data="selectQueList" handleSwitch="" />

        <pagination
            v-show="qtotal > 0"
            :total="qtotal"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
            />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancel">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listQuestionTemplate,
  getQuestionTemplate,
} from "@/api/performance/questionTemplate";
import { listQuestionStore } from "@/api/performance/questionStore";
import QuestionsTable from "@/views/performance/quesBusiness/questionStore/components/QuestionsTable";
export default {
  name: "SelecttemplateTable",
  components: { QuestionsTable },
  props: {},
  data() {
    return {
      loading: false,
      selectid: [],
      questionTemplateList: [],
      // 查询参数
      total: 0,
      qtotal: 0,
      open: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        tid: null,
        tHasques: null,
        ttitle: null,
        tContent: null,
        deleteStatus: null,
      },
      form: {
        pageNum: 1,
        pageSize: 10,
        tid: null,
        tHasques: null,
        ttitle: null,
        tContent: null,
        deleteStatus: null,
      },
      title: "",
      selectQueList: [],
      questionStoreList: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    cancel() {
      this.open = false;
    },
    handleSelectionChange(selection) {
      this.selectid = selection.map((item) => {
        return { id: item.tid, ttitle: item.ttitle };
      });
      this.$emit("update:selectid", this.selectid);
    },
    /** 查询问卷模板列表 */
    getList() {
      this.loading = true;
      listQuestionTemplate(this.queryParams).then((response) => {
        this.questionTemplateList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      listQuestionStore(this.qusQueryParams).then((response) => {
        this.questionStoreList = response.rows;
        this.qtotal= response.total;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const tid = row.tid || this.ids;
      let that = this;
      getQuestionTemplate(tid).then((response) => {
        that.form = response.data;
        // console.log(that.form.tHasques);
        if (that.form.thasques) {
          that.selectQueList = [
            ...that.questionStoreList.filter(
              (item) => that.form.thasques.split(",").indexOf(item.qid.toString()) != -1
            ),
          ];
        }
        this.qtotal=  that.selectQueList.length;
        this.open = true;
        this.title = "问卷详情";
      });
    },
  },
};
</script>

<style>
</style>